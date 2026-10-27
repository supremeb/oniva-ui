import { useRef, useState } from 'react';
import { CopyButton } from 'oniva-ui';
import { Callout, Curve, Dim, easeAt, easeWords, firstEasing, type Held, markClass, Moments, Overlay, r1, SpecPage, Timeline, U, useCrisp, useDrawingScale, useTransitionSpec, Ut, within } from '../kit/spec-kit';
import styles from '../kit/spec.module.css';
import type { SpecProps } from '../types';

// Pipeline proof: the skill's copy-button poster, driving oniva-ui's own CopyButton (motion/CopyButton).
// Held 40ms-ish into the swap: copy icon half gone and soft, check half arrived. Not in the registry's public row
// unless `_example` is added there; the route #/specs/_example always works.

type Base = { size: number; icon: number; radius: number; blur: number; scale: number };
type Read = { outO: number; inO: number; outB: number; inB: number };
const FRACTIONS = [0.08, 0.2, 1] as const;
// CopyButton's own `resetAfter` is huge here so the swap never reverts under the held frame; the poster remounts it (key) to reset.
const HOLD_FOREVER = 2_000_000_000;

const blurOf = (f: string) => parseFloat(f.match(/blur\(([^)]+)\)/)?.[1] ?? '0');
const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

function Drawing({ m, z: Z }: { m: Held<Base, Read>; z: number }) {
  const { ref, snap } = useCrisp();
  const S = m.size * Z,
    i = m.icon * Z,
    o = (S - i) / 2;
  return (
    <Overlay w={S} h={S} svgRef={ref}>
      <rect x={snap(o, 'x')} y={snap(o, 'y')} width={snap(o + i, 'x') - snap(o, 'x')} height={snap(o + i, 'y') - snap(o, 'y')} className={markClass.reference} data-part="n1 n2" />
      <Dim snap={snap} x1={0} x2={S} y={S + 21} from={S} label={m.size} below part="none" />
      <Dim snap={snap} x1={o} x2={o + i} y={-21} from={o} label={m.icon} part="n1" />
      <Callout n={1} x={o} y={o + i * 0.3} dir="w" len={o + 34} />
      <Callout n={2} x={o + i} y={o + i * 0.7} dir="e" len={o + 34} />
    </Overlay>
  );
}

export function CopyButtonSpec({ theme }: SpecProps) {
  const [key, setKey] = useState(0);
  const mounted = useRef(0);
  mounted.current = key;
  const drv = useTransitionSpec<Base, Read>({
    fractions: FRACTIONS,
    setup: async (root, { stale }) => {
      // Reset to rest through a remount if a previous run left it copied.
      if (root.querySelector('svg[data-copied]')) {
        setKey((k) => k + 1);
        await frame();
        await frame();
        if (stale()) throw new Error('stale');
      }
      const button = root.querySelector<HTMLButtonElement>('button')!;
      const icons = button.querySelectorAll<SVGElement>('span[aria-hidden] > svg');
      const out = icons[0]!,
        inn = icons[1]!;
      const c = getComputedStyle(inn);
      return {
        base: { size: button.offsetWidth, icon: within(root, out).w, radius: parseFloat(getComputedStyle(button).borderTopLeftRadius), blur: blurOf(c.filter), scale: new DOMMatrixReadOnly(c.transform).a },
        easing: firstEasing(getComputedStyle(out).transitionTimingFunction),
        // The component's own handler: a click presses the button. Clipboard write is stubbed for the instant of the click.
        trigger: () => {
          const clip = navigator.clipboard;
          const write = clip?.writeText;
          if (clip) clip.writeText = async () => undefined;
          button.click();
          if (clip && write) clip.writeText = write;
        },
        pick: (all) => all.filter((a) => (a.effect as KeyframeEffect | null)?.target?.closest('svg')),
        read: () => {
          const a = getComputedStyle(out), b = getComputedStyle(inn);
          return { outO: parseFloat(a.opacity), inO: parseFloat(b.opacity), outB: blurOf(a.filter), inB: blurOf(b.filter) };
        },
      };
    },
  });
  const Z = useDrawingScale(7);
  const m = drv.m;
  const ease = (t: number) => (m ? easeAt(Math.min(1, t / m.duration), m.easing) : 0);
  return (
    <SpecPage
      accent="copy" label="Copy button specification" name="Copy button" theme={theme}
      ready={drv.ready} error={drv.error} onRetry={drv.retry}
      drawing={<>
        <div className={styles.subject} style={{ zoom: Z }} inert>
          <div ref={drv.root} style={{ display: 'inline-block' }}>
            <CopyButton key={key} value="https://oniva.ai" resetAfter={HOLD_FOREVER} />
          </div>
        </div>
        {m && !m.reduced && <Drawing m={m} z={Z} />}
      </>}
      moments={m && !m.reduced && <Moments snapshots={drv.snapshots} labels={['Copy', 'Swapping', 'Copied']} selected={drv.selected} onSelect={drv.select}
        timeline={<Timeline value={m.elapsed} max={m.duration} f={ease} marks={FRACTIONS.map((f) => f * m.duration)} selected={drv.selected} label={<Ut v={m.elapsed} u="ms" />} />} />}
      notes={m ? [
        { part: 'n1', head: 'The old icon dissolves.', body: <>It fades out while blurring to {m.blur}px and shrinking to {Math.round(m.scale * 100)}%, so it goes soft rather than popping off. Now: {Math.round(m.outO * 100)}% there, {r1(m.outB)}px blur.</> },
        { part: 'n2', head: 'The new one arrives sharp.', body: 'The check does the reverse on the same clock, in the same spot. They cross in the middle, so the button is never empty.' },
      ] : []}
      spec={m ? [
        ['Trigger', 'Press', 'none'],
        ['Animates', 'opacity, blur, scale', 'n1'],
        ['Button', <><U v={m.size} u="px" />, radius <U v={m.radius} u="px" /></>, 'none'],
        ['Icons', <><U v={m.icon} u="px" />, one spot</>, 'n2'],
        ['Duration', m.reduced ? 'None' : <U v={m.duration} u="ms" />, 'curve'],
        ['Easing', m.reduced ? 'None' : easeWords(m.easing), 'curve'],
        ['Reduced motion', 'Scale is dropped; the icons still fade and blur', 'none'],
      ] : []}
      fig2={m && !m.reduced ? { node: <Curve x={m.elapsed} max={m.duration} series={[{ f: ease }, { f: (t) => 1 - ease(t), className: styles.easeAlt }]} end={<Ut v={m.duration} u="ms" />} unit="ms" /> } : undefined}
      units={`Dimensions in px at 1×, drawn at ${Z}×`}
    />
  );
}
