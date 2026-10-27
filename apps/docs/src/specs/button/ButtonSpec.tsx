import { Button } from 'oniva-ui';
import { Callout, Curve, Dim, easeAt, easeWords, firstEasing, type Held, markClass, Moments, Overlay, r1, SpecPage, Timeline, U, useCrisp, useDrawingScale, useTransitionSpec, Ut, within } from '../kit/spec-kit';
import styles from '../kit/spec.module.css';
import type { SpecProps } from '../types';

// Button: the press scales the whole control to the press-scale token on a CSS transition (pointer-only, `:active`),
// and `loadingStyle="shimmer"` sweeps a gradient band across the label on a looping keyframe animation.
// One clock: the press runs at the start of the shared run, the shimmer loops beside it, so the three moments are
// rest (t=0), pressed (press done) and loading (shimmer mid-sweep).
//
// A script can't hold `:active`, so the pressed state is applied by writing the component's own value
// (`--oniva-motion-press-scale`, read from the button) to its transform. The transition that runs is the button's own
// (property, duration and easing all come from its computed style); the value is checked against a real mouse press in
// the verification notes.

type Base = { w: number; h: number; ax: number; bx: number; bw: number; radius: number; pressDur: number; scale: number; sweepDur: number; spinDur: number; sweepEasing: string; labelAlpha: number };
type Read = { s: number; pw: number; ph: number; pos: number };
const FRACTIONS = [0, 0.2, 0.55] as const;

const msOf = (v: string) => parseFloat(v) * (v.trim().endsWith('ms') ? 1 : 1000);

function Drawing({ m, z: Z, root }: { m: Held<Base, Read>; z: number; root: number }) {
  const { ref, snap } = useCrisp();
  const W = m.w * Z, H = m.h * Z, ox = m.ax * Z, bx = m.bx * Z;
  const pxs = (m.w - m.pw) / 2 * Z, pys = (m.h - m.ph) / 2 * Z;
  return (
    <Overlay w={root * Z} h={H} svgRef={ref}>
      <rect x={snap(ox, 'x')} y={snap(0, 'y')} width={snap(ox + W, 'x') - snap(ox, 'x')} height={snap(H, 'y') - snap(0, 'y')} rx={m.radius * Z} className={markClass.ghost} data-part="n1" />
      <Dim snap={snap} x1={ox + pxs} x2={ox + W - pxs} y={H + 21 + pys} from={H - pys} label={r1(m.pw)} below part="n1" />
      <Dim snap={snap} x1={ox} x2={ox + W} y={-21} from={0} label={m.w} part="n1" />
      <Callout n={1} x={ox} y={H * 0.5} dir="w" len={34} />
      <Callout n={2} x={bx + m.bw * Z * 0.75} y={0} dir="ne" len={34} />
    </Overlay>
  );
}

export function ButtonSpec({ theme }: SpecProps) {
  const drv = useTransitionSpec<Base, Read>({
    fractions: FRACTIONS,
    setup: async (root) => {
      const [a, b] = Array.from(root.querySelectorAll<HTMLButtonElement>('button'));
      a!.style.transform = '';
      const cs = getComputedStyle(a!);
      const props = cs.transitionProperty.split(',').map((s) => s.trim());
      const at = props.indexOf('transform');
      const list = (v: string) => v.split(/,(?![^(]*\))/).map((s) => s.trim());
      // (computed lists repeat their last value: 6 properties, one duration)
      const nth = (v: string) => { const l = list(v); return l[at % l.length]!; };
      const pressDur = msOf(nth(cs.transitionDuration));
      const easing = firstEasing(nth(cs.transitionTimingFunction));
      const tok = parseFloat(cs.getPropertyValue('--oniva-motion-press-scale'));
      const label = b!.querySelector<HTMLElement>('span > span:not([aria-hidden])')!;
      const lc = getComputedStyle(label);
      const spin = b!.querySelector('svg')!;
      // The kit cancels every animation before setup, and a cancelled CSS loop stays cancelled: restart the button's own loops.
      for (const el of [label, spin]) { el.style.animationName = 'none'; void getComputedStyle(el).animationName; el.style.animationName = ''; }
      const sweepEasing = firstEasing(lc.animationTimingFunction);
      // (the gradient is drawn in `currentColor`, i.e. the label's own colour: its alpha decides whether the sweep can show)
      const labelAlpha = Number(/rgba\(.*,\s*([\d.]+)\)/.exec(lc.color)?.[1] ?? 1);
      const box = within(root, a!);
      return {
        base: {
          w: box.w, h: box.h, ax: box.x, bx: within(root, b!).x, bw: within(root, b!).w, radius: parseFloat(cs.borderTopLeftRadius),
          pressDur, scale: tok, sweepDur: msOf(lc.animationDuration), spinDur: msOf(getComputedStyle(spin).animationDuration), sweepEasing, labelAlpha,
        },
        easing,
        trigger: () => { a!.style.transform = `scale(${tok})`; },
        pick: (all) => all.filter((x) => {
          const t = (x.effect as KeyframeEffect | null)?.target;
          return (x instanceof CSSTransition && t === a && x.transitionProperty === 'transform') || (!(x instanceof CSSTransition) && !!t && b!.contains(t));
        }),
        read: () => {
          const r = within(root, a!);
          return { s: new DOMMatrixReadOnly(getComputedStyle(a!).transform).a, pw: r.w, ph: r.h, pos: parseFloat(getComputedStyle(label).backgroundPositionX) };
        },
      };
    },
  });
  const Z = useDrawingScale(2.5);
  const m = drv.m;
  const pressT = (t: number) => (m ? Math.min(1, t / m.pressDur) : 0);
  const ease = (t: number) => (m ? easeAt(pressT(t), m.easing) : 0);
  const rootW = m ? m.bx + m.w + 12 : 0;
  return (
    <SpecPage
      accent="button" label="Button specification" name="Button" theme={theme}
      ready={drv.ready} error={drv.error} onRetry={drv.retry}
      drawing={<>
        <div className={styles.subject} style={{ zoom: Z }} inert>
          <div ref={drv.root} style={{ display: 'inline-flex', gap: 32, alignItems: 'center' }}>
            <Button>Save changes</Button>
            <Button isLoading loadingStyle="shimmer">Saving</Button>
          </div>
        </div>
        {m && !m.reduced && <Drawing m={m} z={Z} root={drv.root.current?.offsetWidth ?? rootW} />}
      </>}
      moments={m && !m.reduced && <Moments snapshots={drv.snapshots} labels={['Rest', 'Pressed', 'Loading']} selected={drv.selected} onSelect={drv.select}
        timeline={<Timeline value={m.elapsed} max={m.duration} f={(t) => ease(t)} marks={FRACTIONS.map((f) => f * m.duration)} selected={drv.selected} label={<Ut v={m.elapsed} u="ms" />} />} />}
      notes={m ? [
        { part: 'n1', head: 'Press shrinks it from the center.', body: <>The whole button scales to {m.s.toFixed(2)}: {m.w}px wide becomes {r1(m.pw)}px. It is a transition on transform alone, not a keyframe, so letting go mid-press turns it round.</> },
        { part: 'n2', head: m.labelAlpha === 0 ? 'Loading: the sweep is invisible.' : 'Loading sweeps the label.', body: <>The label is clipped to a clear-banded gradient that slides across it every {m.sweepDur}ms ({easeWords(m.sweepEasing).toLowerCase()}). It is drawn in the label's own colour, measured {Math.round(m.labelAlpha * 100)}% opaque{m.labelAlpha === 0 ? ', so every stop is clear and the text never shows' : ''}. The spinner turns every {m.spinDur}ms.</> },
      ] : []}
      spec={m ? [
        ['Trigger', 'Pointer press (:active); not keyboard', 'n1'],
        ['Animates', 'transform: scale', 'n1'],
        ['Scale', <><U v={m.scale} u="×" />, from <U v={1} u="×" /></>, 'n1'],
        ['Duration', m.reduced ? 'None' : <U v={m.pressDur} u="ms" />, 'curve'],
        ['Easing', m.reduced ? 'None' : easeWords(m.easing), 'curve'],
        ['Loading', <>Sweep <U v={m.sweepDur} u="ms" />, loops</>, 'n2'],
        ['Reduced motion', 'Press scale 1, sweep stops', 'none'],
      ] : []}
      fig2={m && !m.reduced ? { node: <Curve x={Math.min(m.elapsed, m.pressDur)} max={m.pressDur} series={[{ f: ease }]} end={<Ut v={m.pressDur} u="ms" />} unit="ms" /> } : undefined}
      units={`Dimensions in px at 1×, drawn at ${Z}×`}
    />
  );
}
