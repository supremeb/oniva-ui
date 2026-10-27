import { useState } from 'react';
import { Accordion, AccordionItem } from 'oniva-ui';
import { Callout, Curve, easeAt, easeWords, firstEasing, type Held, markClass, Moments, Overlay, r1, SpecPage, Timeline, U, useCrisp, useDrawingScale, useTransitionSpec, Ut, VDim, within } from '../kit/spec-kit';
import styles from '../kit/spec.module.css';
import type { SpecProps } from '../types';

// Accordion: the panel is oniva-ui's AnimatedHeight (motion/AnimatedHeight). Its outer box is a grid whose single row
// goes grid-template-rows 0fr -> 1fr; the inner box clips (min-height 0, overflow hidden) and fades; the chevron turns
// on its own transition. Nothing sets a width or a height. Durations, easings and boxes are all read off the running
// transitions (getAnimations) and computed styles.
const ITEM = 'shipping';
const FRACTIONS = [0, 0.16, 1] as const;
// Width of the demo accordion in its own px (a layout choice of the poster, not a component value).
const WIDTH = 280;

type Tr = { dur: number; easing: string };
type Base = { W: number; H: number; top: number; full: number; trig: number; chev: { x: number; y: number; w: number; h: number }; row: Tr; fade: Tr; turn: Tr; props: string };
type Read = { panelH: number; opacity: number; angle: number };

const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
const angleOf = (t: string) => {
  const m = new DOMMatrixReadOnly(t === 'none' ? undefined : t);
  return Math.round((Math.atan2(m.b, m.a) * 180) / Math.PI * 10) / 10;
};

function Drawing({ m, z: Z }: { m: Held<Base, Read>; z: number }) {
  const { ref, snap } = useCrisp();
  const W = m.W * Z, H = m.H * Z, top = m.top * Z;
  const gy = snap(top, 'y');
  const edge = top + m.panelH * Z;
  const cx = (m.chev.x + m.chev.w) * Z;
  return (
    <Overlay w={W} h={H} svgRef={ref}>
      <rect x={snap(0, 'x')} y={gy} width={snap(W, 'x') - snap(0, 'x')} height={Math.max(snap(top + m.full * Z, 'y') - gy, 1)} className={markClass.reference} data-part="n1" />
      <VDim snap={snap} y1={top} y2={top + m.full * Z} x={-20} from={0} label={r1(m.full)} left part="n1" />
      <VDim snap={snap} y1={top} y2={Math.max(edge, top + 0.5)} x={-62} from={0} label={r1(m.panelH)} left part="n1" />
      <Callout n={1} x={W - 14 * Z} y={Math.max(edge, top + 2)} dir="e" len={14 * Z + 34} />
      <Callout n={2} x={W - 14 * Z} y={top + (m.full - 12) * Z} dir="e" len={14 * Z + 34} />
      <Callout n={3} x={cx} y={(m.chev.y + m.chev.h / 2) * Z} dir="e" len={(m.W - m.chev.x - m.chev.w) * Z + 34} />
    </Overlay>
  );
}

export function AccordionSpec({ theme }: SpecProps) {
  const [key, setKey] = useState(0);
  const drv = useTransitionSpec<Base, Read>({
    fractions: FRACTIONS,
    setup: async (root, { stale }) => {
      const trigger = () => root.querySelector<HTMLButtonElement>('button')!;
      // Reset to rest through a remount if a previous run left it open.
      if (trigger().getAttribute('aria-expanded') === 'true') {
        setKey((k) => k + 1);
        await frame();
        await frame();
        if (stale()) throw new Error('stale');
      }
      const button = trigger();
      const chevron = button.querySelector<SVGElement>('svg:last-of-type')!;
      const inner = root.querySelector<HTMLElement>('[data-open], [inert]')!;
      const grid = inner.parentElement!;
      const body = inner.firstElementChild!;
      const tr = (name: string, el: Element): Tr => {
        const a = el.getAnimations().find((x) => x instanceof CSSTransition && x.transitionProperty === name);
        const t = a!.effect!.getComputedTiming();
        return { dur: Math.round(Number(t.duration)), easing: firstEasing(getComputedStyle(el).transitionTimingFunction) };
      };
      return {
        base: () => {
          const g = within(root, grid), w = within(root, root.firstElementChild!), full = within(root, body).h;
          const chev = within(root, chevron);
          // The transitions are running here (just triggered): read each one's own duration and easing.
          return {
            W: w.w, H: w.h - g.h + full, top: g.y, full, trig: within(root, button).h, chev,
            row: tr('grid-template-rows', grid), fade: tr('opacity', inner), turn: tr('transform', chevron),
            props: 'grid-template-rows, opacity, transform',
          };
        },
        easing: firstEasing(getComputedStyle(grid).transitionTimingFunction),
        // The component's own handler: pressing the heading button (React Aria's press, from a click).
        trigger: async () => {
          button.click();
          for (let i = 0; i < 40; i++) {
            if (grid.getAnimations().some((a) => a instanceof CSSTransition)) return;
            await frame();
          }
        },
        pick: (all) => all.filter((a) => a instanceof CSSTransition && [grid, inner, chevron].includes((a.effect as KeyframeEffect).target as HTMLElement) && ['grid-template-rows', 'visibility', 'opacity', 'transform'].includes(a.transitionProperty)),
        read: () => ({
          panelH: within(root, grid).h,
          opacity: parseFloat(getComputedStyle(inner).opacity),
          angle: angleOf(getComputedStyle(chevron).transform),
        }),
      };
    },
  });
  const Z = useDrawingScale(1.8);
  const m = drv.m;
  const prog = (tr: Tr) => (t: number) => easeAt(Math.min(1, t / tr.dur), tr.easing);
  const rowP = m ? prog(m.row) : () => 0;
  return (
    <SpecPage
      accent="accordion" label="Accordion specification" name="Accordion" theme={theme}
      ready={drv.ready} error={drv.error} onRetry={drv.retry}
      drawing={<>
        <div className={styles.subject} style={{ zoom: Z }} inert>
          <div ref={drv.root} style={{ width: WIDTH }}>
            <Accordion key={key}>
              <AccordionItem id={ITEM} title="Shipping and returns">
                Orders leave within two days. Returns are free for thirty days, and refunds land on the original card.
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        {m && !m.reduced && <Drawing m={m} z={Z} />}
      </>}
      moments={m && !m.reduced && <Moments snapshots={drv.snapshots} labels={['Closed', 'Opening', 'Open']} selected={drv.selected} onSelect={drv.select}
        timeline={<Timeline value={m.elapsed} max={m.duration} f={rowP} marks={FRACTIONS.map((f) => f * m.duration)} selected={drv.selected} label={<Ut v={m.elapsed} u="ms" />} />} />}
      notes={m ? [
        { part: 'n1', head: 'The row grows, not the box.', body: <>The panel&apos;s one grid row goes from 0fr to 1fr, so it opens to the content&apos;s own {r1(m.full)}px with no height set. Now: {r1(m.panelH)}px.</> },
        { part: 'n2', head: 'The text fades on a shorter clock.', body: <>Opacity runs {m.fade.dur}ms against the row&apos;s {m.row.dur}ms, so the text is fully in before the panel stops. Now: {Math.round(m.opacity * 100)}%.</> },
        { part: 'n3', head: 'The chevron turns on its own.', body: <>It rotates to 180° in {m.turn.dur}ms, started by the same press. Now: {m.angle}°.</> },
      ] : []}
      spec={m ? [
        ['Trigger', 'Press the heading', 'none'],
        ['Animates', m.props, 'n1'],
        ['Panel', <><U v={0} u="px" /> to <U v={r1(m.full)} u="px" /></>, 'n1'],
        ['Row', m.reduced ? 'None' : <><U v={m.row.dur} u="ms" />, {easeWords(m.row.easing)}</>, 'curve'],
        ['Fade', m.reduced ? 'None' : <><U v={m.fade.dur} u="ms" />, {easeWords(m.fade.easing)}</>, 'curve'],
        ['Chevron', m.reduced ? 'None' : <><U v={m.turn.dur} u="ms" />, {easeWords(m.turn.easing)}</>, 'curve'],
      ] : []}
      fig2={m && !m.reduced ? { node: <>
        <Curve x={m.elapsed} max={m.duration} series={[{ f: rowP }, { f: prog(m.fade), className: styles.easeAlt }, { f: prog(m.turn), className: styles.easeAlt }]} label={<Ut v={r1(m.panelH)} u="px" />} end={<Ut v={m.duration} u="ms" />} unit="ms" />
        <p style={{ margin: '4px 0 0', fontSize: 12 }}>Row {m.row.dur}ms, fade {m.fade.dur}ms, chevron {m.turn.dur}ms</p>
      </> } : undefined}
      units={`Dimensions in px at 1×, drawn at ${Z}×. Row in the accent, fade and chevron in grey.`}
    />
  );
}
