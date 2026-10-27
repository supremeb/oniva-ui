import { useState } from 'react';
import { Switch } from 'oniva-ui';
import { Callout, Curve, Dim, easeAt, easeWords, firstEasing, type Held, markClass, Moments, Overlay, r1, SpecPage, Timeline, U, useCrisp, useDrawingScale, useTransitionSpec, Ut, within } from '../kit/spec-kit';
import styles from '../kit/spec.module.css';
import type { SpecProps } from '../types';

// Switch (components/Switch): pressing it turns it on. Moments are fractions of the longest run (the thumb's):
// pressed (t = 0), the thumb a little past its stop, settled.
const FRACTIONS = [0, 0.56, 1] as const;
// Under prefers-reduced-motion both of the Switch's transition durations are 0.01ms (the `media.reducedMotion` rule on the
// track and the thumb in Switch.tsx, read from the compiled stylesheet; the browser tool can't emulate the media query).
const REDUCED = 'Both transitions drop to 0.01ms, so the thumb jumps';

type Box = { x: number; y: number; w: number; h: number };
type Base = {
  wrap: { w: number; h: number };
  track: Box; thumb: Box;
  /** the thumb's left edge in the wrapper's px: where it starts, where it is meant to stop, the furthest it gets */
  x0: number; x1: number; xPeak: number; peakAt: number;
  bdur: number; bease: string;
  fillStep: boolean; declared: string; animated: string;
};
type Read = { kx: number; borderA: number };

const alphaOf = (c: string) => parseFloat(c.match(/rgba?\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/)?.[1] ?? '1');
const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

function Drawing({ m, z: Z }: { m: Held<Base, Read>; z: number }) {
  const { ref, snap } = useCrisp();
  const { track: t, thumb: k } = m;
  const r = (k.w / 2) * Z, cy = (k.y + k.h / 2) * Z;
  const cx = (kx: number) => (kx + k.w / 2) * Z;
  const right = m.kx + k.w / 2 > t.x + t.w / 2;
  return (
    <Overlay w={m.wrap.w * Z} h={m.wrap.h * Z} svgRef={ref}>
      <circle cx={snap(cx(m.x0), 'x')} cy={snap(cy, 'y')} r={r} className={markClass.ghost} data-part="n1" />
      <circle cx={snap(cx(m.x1), 'x')} cy={snap(cy, 'y')} r={r} className={markClass.reference} data-part="n1" />
      <Dim snap={snap} x1={m.x0 * Z} x2={m.x1 * Z} y={t.y * Z - 21} from={t.y * Z} label={<>{r1(m.x1 - m.x0)}</>} part="n1" />
      <Callout n={1} x={(m.kx + (right ? k.w : 0)) * Z} y={cy} dir={right ? 'e' : 'w'} len={(right ? t.x + t.w - m.kx - k.w : m.kx - t.x) * Z + 34} />
      <Callout n={2} x={(t.x + t.w * (right ? 0.18 : 0.82)) * Z} y={(t.y + t.h) * Z} dir={right ? 'sw' : 'se'} len={34} />
      <Callout n={3} x={(t.x + t.w * 0.5) * Z} y={(t.y + t.h) * Z} dir={right ? 'se' : 'sw'} len={34} />
    </Overlay>
  );
}

export function SwitchSpec({ theme }: SpecProps) {
  const [key, setKey] = useState(0);
  const drv = useTransitionSpec<Base, Read>({
    fractions: FRACTIONS,
    setup: async (root, { stale }) => {
      // Reset to rest (off) through a remount if a previous run left it on.
      if (root.querySelector<HTMLInputElement>('input')!.checked) {
        setKey((k) => k + 1);
        await frame();
        await frame();
        if (stale()) throw new Error('stale');
      }
      const input = root.querySelector<HTMLInputElement>('input')!;
      const track = root.querySelector<HTMLElement>('label > span[aria-hidden]')!;
      const thumb = track.firstElementChild as HTMLElement;
      const rel = (el: Element): Box => {
        const b = within(root, el);
        return { x: b.x, y: b.y, w: b.w, h: b.h };
      };
      const fillBefore = getComputedStyle(track).backgroundImage + getComputedStyle(track).boxShadow;
      return {
        easing: firstEasing(getComputedStyle(thumb).transitionTimingFunction),
        // The component's own handler: a press on its input toggles it.
        trigger: () => { input.click(); },
        pick: (all) => all.filter((a) => root.contains((a.effect as KeyframeEffect | null)?.target ?? null)),
        base: () => {
          const all = root.getAnimations({ subtree: true });
          const move = all.find((a) => (a as CSSTransition).transitionProperty === 'transform')!;
          const dur = Number(move.effect!.getComputedTiming().duration);
          const border = all.find((a) => (a as CSSTransition).transitionProperty === 'border-top-color')!;
          // Seek the thumb's own transition: its ends, and the furthest it gets (the transition's keyframes read back
          // as translateX(40px) to none, so the positions are measured on the element instead).
          move.pause();
          let xPeak = -Infinity, peakAt = 0, x0 = 0;
          for (let t = 0; t <= dur; t += 2) {
            move.currentTime = t;
            const x = rel(thumb).x;
            if (t === 0) x0 = x;
            if (x > xPeak) { xPeak = x; peakAt = t; }
          }
          move.currentTime = dur;
          const x1 = rel(thumb).x;
          move.currentTime = 0;
          const fillAt0 = getComputedStyle(track).backgroundImage + getComputedStyle(track).boxShadow;
          move.currentTime = dur;
          const fillEnd = getComputedStyle(track).backgroundImage + getComputedStyle(track).boxShadow;
          const c = getComputedStyle(track);
          const animated = [...new Set(all.filter((a) => (a.effect as KeyframeEffect).target === track).map((a) => (a as CSSTransition).transitionProperty.replace(/-(top|right|bottom|left)-/, '-')))].join(', ');
          // (back to the start, so the transition is still running when the driver takes over)
          move.currentTime = 0;
          return {
            wrap: { w: root.offsetWidth, h: root.offsetHeight },
            track: rel(track), thumb: rel(thumb),
            x0, x1, xPeak, peakAt,
            bdur: Number(border.effect!.getComputedTiming().duration), bease: firstEasing(c.transitionTimingFunction),
            fillStep: fillAt0 !== fillBefore && fillAt0 === fillEnd,
            declared: c.transitionProperty,
            animated,
          };
        },
        read: () => ({ kx: rel(thumb).x, borderA: alphaOf(getComputedStyle(track).borderTopColor) }),
      };
    },
  });
  const Z = useDrawingScale(11);
  const m = drv.m;
  const thumbAt = (t: number) => (m ? easeAt(Math.min(1, t / m.duration), m.easing) : 0);
  const borderAt = (t: number) => (m ? easeAt(Math.min(1, t / m.bdur), m.bease) : 0);
  const travel = m ? m.x1 - m.x0 : 0;
  const past = m ? m.xPeak - m.x1 : 0;
  return (
    <SpecPage
      accent="switch" label="Switch specification" name="Switch" theme={theme}
      ready={drv.ready} error={drv.error} onRetry={drv.retry}
      drawing={<>
        <div className={styles.subject} style={{ zoom: Z }} inert>
          <div ref={drv.root} style={{ display: 'inline-flex' }}>
            <Switch key={key} aria-label="Alerts" />
          </div>
        </div>
        {m && !m.reduced && <Drawing m={m} z={Z} />}
      </>}
      moments={m && !m.reduced && <Moments snapshots={drv.snapshots} labels={['Pressed', 'Past the stop', 'On']} selected={drv.selected} onSelect={drv.select}
        timeline={<Timeline value={m.elapsed} max={m.duration} f={thumbAt} marks={FRACTIONS.map((f) => f * m.duration)} selected={drv.selected} label={<Ut v={m.elapsed} u="ms" />} />} />}
      notes={m ? [
        { part: 'n1', head: 'The thumb overshoots.', body: <>It travels {r1(travel)}px on a spring curve and runs {r1(past)}px past its stop at {m.peakAt}ms, then settles back. Now: {r1(m.kx - m.x0)}px.</> },
        { part: 'n2', head: m.fillStep ? 'The fill does not fade.' : 'The fill follows.', body: m.fillStep ? <>Its gradient and inner shadow are in the transition list but neither ran: the track is the accent from the first frame, before the thumb has moved.</> : <>It animates with the border.</> },
        { part: 'n3', head: 'Only the border fades.', body: <>The 1px edge clears from the hairline to transparent in {m.bdur}ms, shorter than the thumb. Now: {Math.round(m.borderA * 100)}% left.</> },
      ] : []}
      spec={m ? [
        ['Trigger', 'Press', 'none'],
        ['Animates', m.animated.replace('border-color', 'border colour') + ', thumb transform', 'n3'],
        ['Track', <><U v={m.track.w} u="px" /> × <U v={m.track.h} u="px" /></>, 'none'],
        ['Thumb', <><U v={m.thumb.w} u="px" />, travels <U v={r1(travel)} u="px" /></>, 'n1'],
        ['Duration', m.reduced ? 'None' : <>thumb <U v={m.duration} u="ms" />, border <U v={m.bdur} u="ms" /></>, 'curve'],
        ['Easing', m.reduced ? 'None' : <>thumb {easeWords(m.easing)}; border {easeWords(m.bease)}</>, 'curve'],
        ['Reduced motion', REDUCED, 'none'],
      ] : []}
      fig2={m && !m.reduced ? { node: <Curve x={m.elapsed} max={m.duration} series={[{ f: thumbAt }, { f: borderAt, className: styles.easeAlt }]} end={<Ut v={m.duration} u="ms" />} unit="ms" /> } : undefined}
      units={`Dimensions in px at 1×, drawn at ${Z}×`}
    />
  );
}
