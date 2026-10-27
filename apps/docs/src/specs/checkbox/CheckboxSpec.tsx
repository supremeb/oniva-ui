import { useState } from 'react';
import { Checkbox } from 'oniva-ui';
import { Callout, Curve, Dim, easeAt, easeWords, firstEasing, type Held, markClass, Moments, Overlay, r1, SpecPage, Timeline, U, useCrisp, useDrawingScale, useTransitionSpec, Ut, within } from '../kit/spec-kit';
import styles from '../kit/spec.module.css';
import type { SpecProps } from '../types';

// Checkbox poster: the real `Checkbox` (box styles in internal/checkbox-box.tsx), clicked the way a pointer does
// (pointerdown, hold until the press has settled, pointerup, click). Everything below is read from the running box.
// Held at the end of the press-release: the box is coming back from its press scale while the fill lands and the tick draws.
// The checked box is a flat accent fill (no gradient) that eases background-color and border-color; the tick draws by stroke-dashoffset.

type Chan = { delay: number; duration: number; easing: string };
type Base = { fill: Chan; border: Chan; tickCh: Chan; fillFrom: number[]; fillTo: number[]; borderFrom: number[]; borderTo: number[]; size: number; radius: number; pressScale: number; tick: { x: number; y: number; w: number; h: number } };
type Read = { scale: number; draw: number; fillP: number; borderP: number; gradient: boolean };
// Moments are fractions of the whole run (the tick's delay + duration): just after release (box still empty), mid-draw, checked.
const FRACTIONS = [0.02, 0.4, 1] as const;

const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const rgbOf = (c: string) => (c.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
// how far along the line from one colour to the other a colour is (0 the first, 1 the second)
const along = (c: number[], a: number[], b: number[]) => {
  const d = b.map((v, i) => v - a[i]!);
  const n = d.reduce((t, v) => t + v * v, 0);
  return n ? c.reduce((t, v, i) => t + (v - a[i]!) * d[i]!, 0) / n : 1;
};

function Drawing({ m, z: Z }: { m: Held<Base, Read>; z: number }) {
  const { ref, snap } = useCrisp();
  const S = m.size * Z;
  const t = m.tick;
  return (
    <Overlay w={S} h={S} svgRef={ref}>
      <rect x={snap(t.x * Z, 'x')} y={snap(t.y * Z, 'y')} width={snap((t.x + t.w) * Z, 'x') - snap(t.x * Z, 'x')} height={snap((t.y + t.h) * Z, 'y') - snap(t.y * Z, 'y')} className={markClass.reference} data-part="n3" />
      <Dim snap={snap} x1={0} x2={S} y={-21} from={0} label={m.size} part="n1" />
      <Callout n={1} x={0} y={S * 0.2} dir="w" len={34} />
      <Callout n={2} x={0} y={S * 0.8} dir="w" len={34} />
      <Callout n={3} x={S} y={S * 0.5} dir="e" len={34} />
    </Overlay>
  );
}

export function CheckboxSpec({ theme }: SpecProps) {
  const [key, setKey] = useState(0);
  const drv = useTransitionSpec<Base, Read>({
    fractions: FRACTIONS,
    setup: async (root, { stale }) => {
      // Reset to rest (unchecked) by remounting the component if a previous run left it checked: clicking it back can
      // leave the box mid-transition, and a second run then finds nothing to animate.
      if (root.querySelector<HTMLInputElement>('input')!.checked) {
        setKey((k) => k + 1);
        await frame();
        await frame();
        if (stale()) throw new Error('stale');
      }
      const label = root.querySelector<HTMLLabelElement>('label')!;
      const box = label.querySelector<HTMLElement>('span[aria-hidden]')!;
      const paths = box.querySelectorAll<SVGPathElement>('path');
      const tick = paths[0]!;
      // (a press left over from a replaced run is let go first)
      label.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true, pointerId: 7, pointerType: 'mouse' }));
      let pressScale = 1;
      const endsRef: { current: { fillFrom: number[]; fillTo: number[]; borderFrom: number[]; borderTo: number[] } } = { current: { fillFrom: [], fillTo: [], borderFrom: [], borderTo: [] } };
      const pointer = (type: string) => label.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 7, pointerType: 'mouse', isPrimary: true, button: 0, buttons: type === 'pointerup' ? 0 : 1, clientX: 5, clientY: 5 }));
      return {
        base: () => {
          // (read right after the release, while the transitions are running: a transition held past its end is gone)
          const timing = (el: Element, prop: string) => (el.getAnimations().find((a) => (a as CSSTransition).transitionProperty === prop)?.effect as KeyframeEffect | undefined)?.getTiming();
          const ch = (t?: ReturnType<KeyframeEffect['getTiming']>): Chan => ({ delay: Number(t?.delay ?? 0), duration: Number(t?.duration ?? 0), easing: String(t?.easing ?? 'linear') });
          const ends = (el: Element, prop: string) => {
            const k = (el.getAnimations().find((a) => (a as CSSTransition).transitionProperty === prop)?.effect as KeyframeEffect | undefined)?.getKeyframes() ?? [];
            const v = (n: number) => rgbOf(String((k[n] as unknown as Record<string, string> | undefined)?.[prop === 'background-color' ? 'backgroundColor' : 'borderTopColor'] ?? ''));
            return [v(0), v(k.length - 1)] as const;
          };
          const [fillFrom, fillTo] = ends(box, 'background-color');
          const [borderFrom, borderTo] = ends(box, 'border-top-color');
          endsRef.current = { fillFrom, fillTo, borderFrom, borderTo };
          return { fill: ch(timing(box, 'background-color')), border: ch(timing(box, 'border-top-color')), tickCh: ch(timing(tick, 'stroke-dashoffset')), fillFrom, fillTo, borderFrom, borderTo, size: box.offsetWidth, radius: parseFloat(getComputedStyle(box).borderTopLeftRadius), pressScale, tick: within(box, tick) };
        },
        easing: firstEasing(getComputedStyle(tick).transitionTimingFunction),
        // The component's own press: hold the pointer down until the box has settled at its press scale, then release.
        trigger: async () => {
          pointer('pointerdown');
          await sleep(220);
          // (React's development mode runs setup twice: the replaced run lets go without clicking, so it can't toggle the box again)
          if (stale()) { pointer('pointercancel'); throw new Error('stale'); }
          box.getAnimations().forEach((a) => a.finish());
          pressScale = new DOMMatrixReadOnly(getComputedStyle(box).transform).a;
          pointer('pointerup');
          label.click();
          // (React may commit the change a few frames later on a busy page, so wait until the box's transitions have started)
          for (let i = 0; i < 60 && !box.getAnimations().some((a) => (a as CSSTransition).transitionProperty === 'background-color'); i++) await frame();
        },
        pick: (all) => all.filter((a) => { const e = a.effect as KeyframeEffect | null; const t = e?.target; return !!t && (t === box || t.closest('[aria-hidden]') === box); }),
        read: () => {
          const c = getComputedStyle(box);
          return {
            scale: new DOMMatrixReadOnly(c.transform).a,
            draw: 1 - parseFloat(getComputedStyle(tick).strokeDashoffset),
            fillP: along(rgbOf(c.backgroundColor), endsRef.current.fillFrom, endsRef.current.fillTo),
            borderP: along(rgbOf(c.borderTopColor), endsRef.current.borderFrom, endsRef.current.borderTo),
            gradient: c.backgroundImage !== 'none',
          };
        },
      };
    },
  });
  const Z = useDrawingScale(10);
  const m = drv.m;
  // Two channels on one clock, each on the box's own easing: the fill/border/press (no delay) and the tick (delayed).
  const chan = (c: Chan) => (t: number) => (c.duration ? easeAt(Math.max(0, Math.min(1, (t - c.delay) / c.duration)), c.easing) : 1);
  const fillF = m ? chan(m.fill) : () => 0;
  const sameClock = !!m && m.fill.duration === m.border.duration && m.fill.delay === m.border.delay && m.fill.easing === m.border.easing;
  const tickF = m ? chan(m.tickCh) : () => 0;
  const total = m?.duration ?? 1;
  return (
    <SpecPage
      accent="checkbox" label="Checkbox specification" name="Checkbox" theme={theme}
      ready={drv.ready} error={drv.error} onRetry={drv.retry}
      drawing={<>
        <div className={styles.subject} style={{ zoom: Z }} inert>
          <div ref={drv.root} style={{ display: 'inline-block' }}>
            <Checkbox key={key} aria-label="Subscribe" />
          </div>
        </div>
        {m && !m.reduced && <Drawing m={m} z={Z} />}
      </>}
      moments={m && !m.reduced && <Moments snapshots={drv.snapshots} labels={['Empty', 'Mid-draw', 'Checked']} selected={drv.selected} onSelect={drv.select}
        timeline={<Timeline value={m.elapsed} max={m.duration} f={tickF} marks={FRACTIONS.map((f) => f * m.duration)} selected={drv.selected} label={<Ut v={m.elapsed} u="ms" />} />} />}
      notes={m ? [
        { part: 'n1', head: 'The box presses.', body: <>Held down, it settles at {m.pressScale} of its {m.size}px size, then eases back on release. Now: {m.scale.toFixed(3)}.</> },
        { part: 'n2', head: 'The fill eases in.', body: <>{m.gradient ? 'A gradient sits under the fill.' : 'A flat accent colour, no gradient.'} Fill and border {sameClock ? 'ease together' : 'ease on their own clocks'} over {m.fill.duration}ms{sameClock ? '' : ` and ${m.border.duration}ms`}. Now: fill {Math.round(m.fillP * 100)}%, border {Math.round(m.borderP * 100)}%.</> },
        { part: 'n3', head: 'The tick draws itself.', body: <>Its stroke runs on after {m.tickCh.delay}ms, over {m.tickCh.duration}ms. Now {Math.round(m.draw * 100)}% drawn.</> },
      ] : []}
      spec={m ? [
        ['Trigger', 'Press and release, or Space', 'none'],
        ['Animates', 'scale, fill and border colour, stroke draw', 'n2'],
        ['Box', <><U v={m.size} u="px" />, radius <U v={r1(m.radius)} u="px" />, press <U v={m.pressScale} u="×" /></>, 'n1'],
        ['Tick', <>starts at <U v={m.tickCh.delay} u="ms" />, runs <U v={m.tickCh.duration} u="ms" /></>, 'n3'],
        ['Duration', m.reduced ? 'None' : <>fill <U v={m.fill.duration} u="ms" />, tick <U v={m.tickCh.duration} u="ms" />, whole <U v={m.duration} u="ms" /></>, 'curve'],
        ['Easing', m.reduced ? 'None' : m.fill.easing === m.tickCh.easing ? easeWords(m.fill.easing) : <>fill {easeWords(m.fill.easing)}; tick {easeWords(m.tickCh.easing)}</>, 'curve'],
        ['Reduced motion', 'Read from the tokens, not tested here', 'none'],
      ] : []}
      fig2={m && !m.reduced ? { node: <Curve x={m.elapsed} max={total} series={[{ f: tickF }, { f: fillF, className: styles.easeAlt }]} end={<Ut v={total} u="ms" />} unit="ms" /> } : undefined}
      units={`Dimensions in px at 1×, drawn at ${Z}×`}
    />
  );
}
