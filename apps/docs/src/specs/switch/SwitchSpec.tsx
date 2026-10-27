import { useRef, useState } from 'react';
import { Switch } from 'oniva-ui';
import { Callout, Curve, Dim, easeAt, easeWords, firstEasing, type Held, markClass, Moments, Overlay, r1, SpecPage, Timeline, U, useCrisp, useDrawingScale, useTransitionSpec, Ut, within } from '../kit/spec-kit';
import styles from '../kit/spec.module.css';
import type { SpecProps } from '../types';

// Switch (components/Switch): pressing it turns it on. Off is a solid grey track (control-off), on is a flat accent track;
// the track eases background-color while the knob slides on a spring-shaped curve that runs past its stop.
// Moments are fractions of the longest run (the knob's): off (t = 0), the knob at its furthest (measured, set in setup), on.
// The middle fraction is filled in from the measured peak time, so the hero moment is where the knob really is furthest.
const REDUCED = 'Both drop to 0.01ms: the knob jumps';
// Under prefers-reduced-motion both of the Switch's transition durations are 0.01ms (the `media.reducedMotion` rule on the
// track and the knob in Switch.tsx, read from the compiled stylesheet; the browser tool can't emulate the media query).

type Box = { x: number; y: number; w: number; h: number };
type Base = {
  wrap: { w: number; h: number };
  track: Box; thumb: Box;
  /** the knob's left edge in the wrapper's px: where it starts, where it is meant to stop, the furthest it gets */
  x0: number; x1: number; xPeak: number; peakAt: number;
  /** the track's colour channel: duration, easing, and the grey and accent it eases between */
  tdur: number; tease: string; off: number[]; on: number[];
  /** what else the track could animate but does not, read at rest */
  borderW: number; gradient: boolean; shadow: boolean;
  animated: string;
};
type Read = { kx: number; fill: number };

const rgbOf = (c: string) => (c.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
// how far along the line from grey to accent a colour is (0 grey, 1 accent)
const along = (c: number[], a: number[], b: number[]) => {
  const d = b.map((v, i) => v - a[i]!);
  const n = d.reduce((s, v) => s + v * v, 0);
  return n ? c.reduce((s, v, i) => s + (v - a[i]!) * d[i]!, 0) / n : 1;
};
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
  // (a starting guess for the hero moment; setup overwrites the middle one with the measured peak time before any capture)
  const fractions = useRef<number[]>([0, 0.56, 1]).current;
  const drv = useTransitionSpec<Base, Read>({
    fractions,
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
      let endsOff: number[] = [], endsOn: number[] = [];
      const rest = getComputedStyle(track);
      const borderW = parseFloat(rest.borderTopWidth);
      const gradient = rest.backgroundImage !== 'none';
      const shadow = rest.boxShadow !== 'none';
      return {
        easing: firstEasing(getComputedStyle(thumb).transitionTimingFunction),
        // The component's own handler: a press on its input toggles it.
        trigger: () => { input.click(); },
        pick: (all) => all.filter((a) => root.contains((a.effect as KeyframeEffect | null)?.target ?? null)),
        base: () => {
          const all = root.getAnimations({ subtree: true });
          const move = all.find((a) => (a as CSSTransition).transitionProperty === 'transform')!;
          const fill = all.find((a) => (a as CSSTransition).transitionProperty === 'background-color' && (a.effect as KeyframeEffect).target === track)!;
          const dur = Number(move.effect!.getComputedTiming().duration);
          const ends = (fill.effect as KeyframeEffect).getKeyframes();
          // Seek the knob's own transition: its ends, and the furthest it gets (the transition's keyframes read back
          // as translateX(40px) to none, so the positions are measured on the element instead).
          move.pause();
          let xPeak = -Infinity, peakAt = 0, x0 = 0;
          for (let t = 0; t <= dur; t += 1) {
            move.currentTime = t;
            const x = rel(thumb).x;
            if (t === 0) x0 = x;
            if (x > xPeak) { xPeak = x; peakAt = t; }
          }
          move.currentTime = dur;
          const x1 = rel(thumb).x;
          move.currentTime = 0;
          const c = getComputedStyle(track);
          const animated = [...new Set(all.map((a) => (a as CSSTransition).transitionProperty))].join(', ');
          // the hero moment is where the knob is furthest
          fractions[1] = peakAt / dur;
          endsOff = rgbOf(String(ends[0]!.backgroundColor)); endsOn = rgbOf(String(ends[1]!.backgroundColor));
          return {
            wrap: { w: root.offsetWidth, h: root.offsetHeight },
            track: rel(track), thumb: rel(thumb),
            x0, x1, xPeak, peakAt,
            tdur: Number(fill.effect!.getComputedTiming().duration), tease: firstEasing(c.transitionTimingFunction),
            off: endsOff, on: endsOn,
            borderW, gradient, shadow,
            animated,
          };
        },
        read: () => ({ kx: rel(thumb).x, fill: along(rgbOf(getComputedStyle(track).backgroundColor), endsOff, endsOn) }),
      };
    },
  });
  const Z = useDrawingScale(11);
  const m = drv.m;
  const thumbAt = (t: number) => (m ? easeAt(Math.min(1, t / m.duration), m.easing) : 0);
  const fillAt = (t: number) => (m ? easeAt(Math.min(1, t / m.tdur), m.tease) : 0);
  const pastOne = !!m && Array.from({ length: 101 }, (_, i) => thumbAt((m.duration * i) / 100)).some((v) => v > 1.001);
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
      moments={m && !m.reduced && <Moments snapshots={drv.snapshots} labels={['Off', 'Past the stop', 'On']} selected={drv.selected} onSelect={drv.select}
        timeline={<Timeline value={m.elapsed} max={m.duration} f={thumbAt} marks={fractions.map((f) => f * m.duration)} selected={drv.selected} label={<Ut v={m.elapsed} u="ms" />} />} />}
      notes={m ? [
        { part: 'n1', head: 'The knob overshoots.', body: <>It travels {r1(travel)}px on a spring-shaped curve and runs {r1(past)}px past its stop at {m.peakAt}ms, then settles back. Now: {r1(m.kx - m.x0)}px.</> },
        { part: 'n2', head: 'The track eases its colour.', body: <>It goes from solid grey to flat accent in {m.tdur}ms, done {m.duration - m.tdur}ms before the knob settles. Now: {Math.round(m.fill * 100)}% of the way.</> },
        { part: 'n3', head: 'Nothing else on the track moves.', body: <>No border ({m.borderW}px), {m.gradient ? 'a gradient' : 'no gradient'} and {m.shadow ? 'a shadow' : 'no shadow'}: colour is the only thing it animates.</> },
      ] : []}
      spec={m ? [
        ['Trigger', 'Press', 'none'],
        ['Animates', m.animated.replace('background-color', 'track colour').replace('transform', 'knob transform'), 'n2'],
        ['Size', <>track <U v={m.track.w} u="px" /> × <U v={m.track.h} u="px" />, knob <U v={m.thumb.w} u="px" />, travels <U v={r1(travel)} u="px" /></>, 'n1'],
        ['Duration', m.reduced ? 'None' : <>knob <U v={m.duration} u="ms" />, track <U v={m.tdur} u="ms" /></>, 'curve'],
        ['Knob easing', m.reduced ? 'None' : pastOne ? easeWords(m.easing).replace(/^[^(]*/, 'Overshoot ') : easeWords(m.easing), 'curve'],
        ['Track easing', m.reduced ? 'None' : easeWords(m.tease), 'curve'],
        ['Reduced motion', REDUCED, 'none'],
      ] : []}
      fig2={m && !m.reduced ? { node: <Curve x={m.elapsed} max={m.duration} series={[{ f: thumbAt }, { f: fillAt, className: styles.easeAlt }]} end={<Ut v={m.duration} u="ms" />} unit="ms" /> } : undefined}
      units={`Dimensions in px at 1×, drawn at ${Z}×`}
    />
  );
}
