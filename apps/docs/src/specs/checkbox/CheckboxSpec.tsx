import { Checkbox } from 'oniva-ui';
import { Callout, Curve, Dim, easeAt, easeWords, firstEasing, type Held, markClass, Moments, Overlay, r1, SpecPage, Timeline, U, useCrisp, useDrawingScale, useTransitionSpec, Ut, within } from '../kit/spec-kit';
import styles from '../kit/spec.module.css';
import type { SpecProps } from '../types';

// Checkbox poster: the real `Checkbox` (box styles in internal/checkbox-box.tsx), clicked the way a pointer does
// (pointerdown, hold until the press has settled, pointerup, click). Everything below is read from the running box.
// Held at the end of the press-release: the box is coming back from its press scale while the tick is drawing.

type Chan = { delay: number; duration: number; easing: string };
type Base = { fill: Chan; tickCh: Chan; size: number; radius: number; pressScale: number; tick: { x: number; y: number; w: number; h: number } };
type Read = { scale: number; draw: number; borderA: number; gradient: boolean };
const FRACTIONS = [0.02, 0.6, 1] as const;

const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const alphaOf = (c: string) => {
  const m = c.match(/\/\s*([\d.]+%?)\s*\)|,\s*([\d.]+)\s*\)$/);
  if (!m) return 1;
  const v = m[1] ?? m[2]!;
  return v.endsWith('%') ? parseFloat(v) / 100 : parseFloat(v);
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
  const drv = useTransitionSpec<Base, Read>({
    fractions: FRACTIONS,
    setup: async (root, { stale }) => {
      const label = root.querySelector<HTMLLabelElement>('label')!;
      const box = label.querySelector<HTMLElement>('span[aria-hidden]')!;
      const paths = box.querySelectorAll<SVGPathElement>('path');
      const tick = paths[0]!;
      const input = label.querySelector<HTMLInputElement>('input')!;
      // Reset to rest through the component's own handler if a previous run left it checked.
      if (input.checked) {
        label.click();
        await frame();
        await frame();
        if (stale()) throw new Error('stale');
        root.getAnimations({ subtree: true }).forEach((a) => a.cancel());
      }
      // (a press left over from a replaced run is let go first)
      label.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true, pointerId: 7, pointerType: 'mouse' }));
      let pressScale = 1;
      const pointer = (type: string) => label.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 7, pointerType: 'mouse', isPrimary: true, button: 0, buttons: type === 'pointerup' ? 0 : 1, clientX: 5, clientY: 5 }));
      return {
        base: () => {
          // (read right after the release, while the transitions are running: a transition held past its end is gone)
          const timing = (el: Element, prop: string) => (el.getAnimations().find((a) => (a as CSSTransition).transitionProperty === prop)?.effect as KeyframeEffect | undefined)?.getTiming();
          const ch = (t?: ReturnType<KeyframeEffect['getTiming']>): Chan => ({ delay: Number(t?.delay ?? 0), duration: Number(t?.duration ?? 0), easing: String(t?.easing ?? 'linear') });
          return { fill: ch(timing(box, 'border-top-color')), tickCh: ch(timing(tick, 'stroke-dashoffset')), size: box.offsetWidth, radius: parseFloat(getComputedStyle(box).borderTopLeftRadius), pressScale, tick: within(box, tick) };
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
        },
        pick: (all) => all.filter((a) => { const e = a.effect as KeyframeEffect | null; const t = e?.target; return !!t && (t === box || t.closest('[aria-hidden]') === box); }),
        read: () => {
          const c = getComputedStyle(box);
          return {
            scale: new DOMMatrixReadOnly(c.transform).a,
            draw: 1 - parseFloat(getComputedStyle(tick).strokeDashoffset),
            borderA: alphaOf(c.borderTopColor),
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
  const tickF = m ? chan(m.tickCh) : () => 0;
  const total = m?.duration ?? 1;
  return (
    <SpecPage
      accent="checkbox" label="Checkbox specification" name="Checkbox" theme={theme}
      ready={drv.ready} error={drv.error} onRetry={drv.retry}
      drawing={<>
        <div className={styles.subject} style={{ zoom: Z }} inert>
          <div ref={drv.root} style={{ display: 'inline-block' }}>
            <Checkbox aria-label="Subscribe" />
          </div>
        </div>
        {m && !m.reduced && <Drawing m={m} z={Z} />}
      </>}
      moments={m && !m.reduced && <Moments snapshots={drv.snapshots} labels={['Released', 'Mid-draw', 'Checked']} selected={drv.selected} onSelect={drv.select}
        timeline={<Timeline value={m.elapsed} max={m.duration} f={tickF} marks={FRACTIONS.map((f) => f * m.duration)} selected={drv.selected} label={<Ut v={m.elapsed} u="ms" />} />} />}
      notes={m ? [
        { part: 'n1', head: 'The box presses.', body: <>Held down, it settles at {m.pressScale} of its {m.size}px size, then eases back on release. Now: {m.scale.toFixed(3)}.</> },
        { part: 'n2', head: 'The fill lands.', body: <>{m.gradient ? 'The accent gradient is there from the first frame; it does not animate.' : 'The accent gradient has not arrived.'} The border fades out over {m.fill.duration}ms. Border at {Math.round(m.borderA * 100)}%.</> },
        { part: 'n3', head: 'The tick draws itself.', body: <>Its stroke runs on after {m.tickCh.delay}ms, over {m.tickCh.duration}ms. Now {Math.round(m.draw * 100)}% drawn.</> },
      ] : []}
      spec={m ? [
        ['Trigger', 'Press and release, or Space', 'none'],
        ['Animates', 'scale, border colour, stroke draw', 'n2'],
        ['Box', <><U v={m.size} u="px" />, radius <U v={r1(m.radius)} u="px" />, press <U v={m.pressScale} u="×" /></>, 'n1'],
        ['Tick', <>starts at <U v={m.tickCh.delay} u="ms" />, runs <U v={m.tickCh.duration} u="ms" /></>, 'n3'],
        ['Duration', m.reduced ? 'None' : <U v={m.duration} u="ms" />, 'curve'],
        ['Easing', m.reduced ? 'None' : easeWords(m.easing), 'curve'],
        ['Reduced motion', 'Read from the tokens, not tested here', 'none'],
      ] : []}
      fig2={m && !m.reduced ? { node: <Curve x={m.elapsed} max={total} series={[{ f: tickF }, { f: fillF, className: styles.easeAlt }]} end={<Ut v={total} u="ms" />} unit="ms" /> } : undefined}
      units={`Dimensions in px at 1×, drawn at ${Z}×`}
    />
  );
}
