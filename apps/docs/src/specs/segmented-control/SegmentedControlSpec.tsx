import { useRef, useState } from 'react';
import { SegmentedControl, SegmentedControlItem } from 'oniva-ui';
import { Callout, Curve, Dim, easeAt, easeWords, firstEasing, type Held, markClass, Moments, Overlay, r1, SpecPage, sampleStops, stopsOf, Timeline, U, useCrisp, useDrawingScale, useTransitionSpec, Ut, within } from '../kit/spec-kit';
import styles from '../kit/spec.module.css';
import type { SpecProps } from '../types';

// SegmentedControl: the pill is the SlidingIndicator box, glided by a WAAPI animation in SegIndicator
// (packages/oniva-ui/src/components/SegmentedControl/SegmentedControl.tsx). The hero is the keyframe where the pill spans
// both items. Its offset is read off the running animation; STRETCH_OFFSET and EASE below only give the moments row a
// first guess before the animation exists (source: `offset: 0.45` and `const EASE` in SegIndicator), and setup() overwrites it.
const STRETCH_OFFSET = 0.45;
const EASE = 'cubic-bezier(0.77, 0, 0.175, 1)';
// The time (as a fraction of the run) at which the eased progress reaches `p`.
const timeAt = (p: number, easing: string) => {
  let lo = 0, hi = 1;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (easeAt(mid, easing) < p) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
};
const ITEMS = ['Day', 'Week', 'Month', 'Quarter'] as const;
const FROM = 'Day';
const TO = 'Month';

type Edge = { x: number; w: number };
type Base = {
  trackW: number; trackH: number; pillY: number; pillH: number; radius: number;
  start: Edge; peak: Edge; end: Edge; offset: number;
  lead: ReturnType<typeof stopsOf>; trail: ReturnType<typeof stopsOf>;
};
type Read = { px: number; pw: number };

const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
const num = (s: unknown) => parseFloat(String(s));
const tx = (s: unknown) => parseFloat(String(s).match(/translate\(\s*(-?[\d.]+)px|matrix\([^,]+,[^,]+,[^,]+,[^,]+,\s*(-?[\d.]+)/)?.slice(1).find(Boolean) ?? '0');

const FRACTIONS: number[] = [0, timeAt(STRETCH_OFFSET, EASE), 1];

function Drawing({ m, z: Z }: { m: Held<Base, Read>; z: number }) {
  const { ref, snap } = useCrisp();
  const W = m.trackW * Z, H = m.trackH * Z;
  const y = m.pillY * Z, h = m.pillH * Z;
  const L = m.px * Z, R = (m.px + m.pw) * Z, r = m.radius * Z;
  const rect = (e: Edge) => ({ x: snap(e.x * Z, 'x'), w: snap((e.x + e.w) * Z, 'x') - snap(e.x * Z, 'x') });
  const s = rect(m.start), t = rect(m.end);
  return (
    <Overlay w={W} h={H} svgRef={ref}>
      <rect x={s.x} y={snap(y, 'y')} width={s.w} height={snap(y + h, 'y') - snap(y, 'y')} rx={r} className={markClass.ghost} data-part="n2" />
      <rect x={t.x} y={snap(y, 'y')} width={t.w} height={snap(y + h, 'y') - snap(y, 'y')} rx={r} className={markClass.reference} data-part="n3" />
      <Dim snap={snap} x1={L} x2={R} y={-21} from={y} label={m.pw} part="n1" />
      <Dim snap={snap} x1={t.x} x2={t.x + t.w} y={H + 21} from={H} label={m.end.w} below part="n3" />
      <Callout n={1} x={R} y={y} dir="ne" len={40} />
      <Callout n={2} x={L} y={y} dir="nw" len={40} />
      <Callout n={3} x={t.x + t.w} y={y + h} dir="se" len={40} />
    </Overlay>
  );
}

export function SegmentedControlSpec({ theme }: SpecProps) {
  const [key, setKey] = useState(0);
  // (held in a ref'd array so setup can replace the guess with the value read off the animation)
  const fractions = useRef(FRACTIONS).current;
  const drv = useTransitionSpec<Base, Read>({
    fractions,
    setup: async (root, { stale }) => {
      const selectedLabel = () => root.querySelector<HTMLElement>('[data-selected="true"]')?.textContent;
      // Reset to rest through a remount if a previous run left another item selected.
      if (selectedLabel() !== FROM) {
        setKey((k) => k + 1);
        await frame();
        await frame();
        if (stale()) throw new Error('stale');
      }
      const group = root.querySelector<HTMLElement>('[role="radiogroup"]')!;
      const pill = group.querySelector<HTMLElement>(':scope > span[aria-hidden="true"]')!;
      const labels = Array.from(group.querySelectorAll<HTMLElement>('label'));
      const target = labels.find((l) => l.textContent === TO)!;
      const wait = async () => {
        for (let i = 0; i < 40; i++) {
          if (pill.getAnimations().some((a) => !(a instanceof CSSTransition))) return;
          await frame();
        }
      };
      const pillAnim = () => pill.getAnimations().find((a) => !(a instanceof CSSTransition))!;
      return {
        base: () => {
          const a = pillAnim();
          const eff = a.effect as KeyframeEffect;
          const frames = eff.getKeyframes();
          const lead = stopsOf(a, (k) => tx(k.transform) + num(k.width));
          const trail = stopsOf(a, (k) => tx(k.transform));
          const edge = (k: ComputedKeyframe | undefined): Edge => ({ x: tx(k?.transform), w: num(k?.width) });
          const peakFrame = frames.find((k) => k.computedOffset > 0 && k.computedOffset < 1)!;
          const offset = Number(peakFrame.computedOffset);
          const easing = firstEasing(String(eff.getTiming().easing));
          const track = within(root, group), box = within(root, pill);
          // The moment row's middle frame is the stretched one: put it where the animation's own keyframe is.
          fractions[1] = timeAt(offset, easing);
          const end = within(root, target);
          return {
            trackW: track.w, trackH: track.h, pillY: box.y, pillH: box.h, radius: num(getComputedStyle(pill).borderTopLeftRadius),
            start: edge(frames[0]), peak: edge(peakFrame), end: { x: end.x, w: end.w }, offset, lead, trail,
          };
        },
        // (read off the running animation once it exists)
        get easing() {
          return firstEasing(String((pillAnim().effect as KeyframeEffect).getTiming().easing));
        },
        // The component's own handler: choosing an item in the group. Then wait for the pill's glide to start.
        trigger: async () => {
          target.click();
          await wait();
        },
        pick: (all) => all.filter((a) => !(a instanceof CSSTransition) && (a.effect as KeyframeEffect | null)?.target === pill),
        read: () => {
          const b = within(root, pill);
          return { px: b.x, pw: b.w };
        },
      };
    },
  });
  const Z = useDrawingScale(2.6);
  const m = drv.m;
  // The pill's two edges as a share of their own trip (0 at the start edge, 1 on the target's edge), on the animation's own ease.
  const prog = (t: number) => (m ? easeAt(Math.min(1, t / m.duration), m.easing) : 0);
  const share = (stops: Base['lead'], a: number, b: number) => (t: number) => (sampleStops(stops, prog(t)) - a) / (b - a);
  const lead = m ? share(m.lead, m.start.x + m.start.w, m.end.x + m.end.w) : () => 0;
  const trail = m ? share(m.trail, m.start.x, m.end.x) : () => 0;
  const stretch = m ? m.peak.w : 0;
  return (
    <SpecPage
      accent="segmented-control" label="Segmented control specification" name="Segmented control" theme={theme}
      ready={drv.ready} error={drv.error} onRetry={drv.retry}
      drawing={<>
        <div className={styles.subject} style={{ zoom: Z }} inert>
          <div ref={drv.root} style={{ display: 'inline-flex' }}>
            <SegmentedControl key={key} aria-label="Range" defaultValue={FROM} isDraggable={false}>
              {ITEMS.map((v) => <SegmentedControlItem key={v} value={v}>{v}</SegmentedControlItem>)}
            </SegmentedControl>
          </div>
        </div>
        {m && !m.reduced && <Drawing m={m} z={Z} />}
      </>}
      moments={m && !m.reduced && <Moments snapshots={drv.snapshots} labels={['Start', 'Stretched', 'Settled']} selected={drv.selected} onSelect={drv.select}
        timeline={<Timeline value={m.elapsed} max={m.duration} f={prog} marks={fractions.map((f) => f * m.duration)} selected={drv.selected} label={<Ut v={m.elapsed} u="ms" />} />} />}
      notes={m ? [
        { part: 'n1', head: 'The leading edge goes first.', body: <>The right edge reaches the target item by {Math.round(fractions[1]! * m.duration)}ms and the pill spans both, {m.start.w}px at rest, {stretch}px at its widest. Now: {m.pw}px.</> },
        { part: 'n2', head: 'The trailing edge waits.', body: <>The left edge stays on the old item until then, then catches up on the same ease. The dashed box is where the pill started.</> },
        { part: 'n3', head: 'It settles on the item.', body: <>The pill ends as the target item&apos;s own box, {m.end.w}px wide, so it never overshoots.</> },
      ] : []}
      spec={m ? [
        ['Trigger', 'Choosing an item', 'none'],
        ['Animates', 'translate and width of the pill', 'n1'],
        ['Stretch', <>Widest at {Math.round(m.offset * 100)}% of the ease</>, 'n1'],
        ['Width', <><U v={m.start.w} u="px" /> to <U v={stretch} u="px" /> to <U v={m.end.w} u="px" /></>, 'n3'],
        ['Duration', m.reduced ? 'None' : <U v={m.duration} u="ms" />, 'curve'],
        ['Easing', m.reduced ? 'None' : easeWords(m.easing), 'curve'],
        ['Reduced motion', 'No glide: the pill jumps to the item', 'none'],
      ] : []}
      fig2={m && !m.reduced ? { node: <Curve x={m.elapsed} max={m.duration} series={[{ f: lead }, { f: trail, className: styles.easeAlt }]} marks={[fractions[1]! * m.duration]} label={<Ut v={r1(m.pw)} u="px" />} end={<Ut v={m.duration} u="ms" />} unit="ms" /> } : undefined}
      units={`Dimensions in px at 1×, drawn at ${Z}×. Curves: right edge in colour, left edge in grey.`}
    />
  );
}
