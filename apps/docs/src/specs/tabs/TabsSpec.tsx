import { useState } from 'react';
import { Tab, TabList, Tabs } from 'oniva-ui';
import { Callout, Curve, Dim, easeAt, easeWords, firstEasing, type Held, markClass, Moments, Overlay, r1, SpecPage, Timeline, U, useCrisp, useDrawingScale, useTransitionSpec, Ut, within } from '../kit/spec-kit';
import styles from '../kit/spec.module.css';
import type { SpecProps } from '../types';

// Tabs (line variant): the underline is the SlidingIndicator box (packages/oniva-ui/src/motion/SlidingIndicator). It is
// placed by CSS variables (x, y, w, h) and glided by a CSS transition on transform and width, so both edges ride one
// curve. Everything is read off the running component: the transitions, the easing and the boxes.
const FROM = 'overview';
const TO = 'members';
const FRACTIONS = [0, 0.5, 1] as const;

type Edge = { x: number; w: number };
type Base = { W: number; H: number; uy: number; uh: number; start: Edge; end: Edge; travel: number };
type Read = { px: number; pw: number };

const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

function Drawing({ m, z: Z }: { m: Held<Base, Read>; z: number }) {
  const { ref, snap } = useCrisp();
  const W = m.W * Z, H = m.H * Z;
  const y = m.uy * Z, h = m.uh * Z;
  const L = m.px * Z, R = (m.px + m.pw) * Z;
  const rect = (e: Edge) => ({ x: snap(e.x * Z, 'x'), w: snap((e.x + e.w) * Z, 'x') - snap(e.x * Z, 'x') });
  const s = rect(m.start), t = rect(m.end);
  const yy = snap(y, 'y'), hh = snap(y + h, 'y') - snap(y, 'y');
  return (
    <Overlay w={W} h={H} svgRef={ref}>
      <rect x={s.x} y={yy} width={s.w} height={Math.max(hh, 1)} className={markClass.ghost} data-part="n2" />
      <rect x={t.x} y={yy} width={t.w} height={Math.max(hh, 1)} className={markClass.reference} data-part="n3" />
      <Dim snap={snap} x1={L} x2={R} y={H + 21} from={H} label={r1(m.pw)} below part="n1" />
      <Dim snap={snap} x1={s.x} x2={t.x} y={H + 48} from={H} label={r1(m.travel)} below part="n3" />
      <Callout n={1} x={L} y={y + h} dir="sw" len={34} />
      <Callout n={2} x={s.x} y={y} dir="nw" len={40} />
      <Callout n={3} x={t.x + t.w} y={y + h} dir="se" len={40} />
    </Overlay>
  );
}

export function TabsSpec({ theme }: SpecProps) {
  const [key, setKey] = useState(0);
  const drv = useTransitionSpec<Base, Read>({
    fractions: FRACTIONS,
    setup: async (root, { stale }) => {
      const selectedLabel = () => root.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')?.dataset.key;
      // Reset to rest through a remount if a previous run left another tab selected.
      if (selectedLabel() !== FROM) {
        setKey((k) => k + 1);
        await frame();
        await frame();
        if (stale()) throw new Error('stale');
      }
      const list = root.querySelector<HTMLElement>('[role="tablist"]')!;
      const wrap = list.parentElement!;
      const ind = wrap.querySelector<HTMLElement>(':scope > span[aria-hidden="true"]')!;
      const target = list.querySelector<HTMLElement>(`[data-key="${TO}"]`) ?? Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]')).at(-1)!;
      // The first placement is not animated and lands a frame or two after mount: wait until the underline has a width.
      for (let i = 0; i < 60 && !(ind.offsetWidth > 0 && ind.hasAttribute('data-ready')); i++) await frame();
      if (stale()) throw new Error('stale');
      const startBox = within(root, ind);
      const fire = (type: string, init: PointerEventInit & MouseEventInit) => target.dispatchEvent(new (type.startsWith('pointer') ? PointerEvent : MouseEvent)(type, { bubbles: true, cancelable: true, button: 0, ...init }));
      return {
        base: () => {
          const w = within(root, wrap), end = within(root, target);
          return {
            W: w.w, H: w.h, uy: startBox.y, uh: startBox.h,
            start: { x: startBox.x, w: startBox.w }, end: { x: end.x, w: end.w }, travel: end.x - startBox.x,
          };
        },
        easing: firstEasing(getComputedStyle(ind).transitionTimingFunction),
        // The component's own handler: pressing a tab (React Aria's press events), then wait for the glide to start.
        trigger: async () => {
          const init = { pointerId: 1, pointerType: 'mouse', isPrimary: true, clientX: target.getBoundingClientRect().x + 4, clientY: target.getBoundingClientRect().y + 4 };
          fire('pointerdown', init); fire('mousedown', init); fire('pointerup', init); fire('mouseup', init); fire('click', init);
          for (let i = 0; i < 40; i++) {
            if (ind.getAnimations().some((a) => a instanceof CSSTransition)) return;
            await frame();
          }
        },
        pick: (all) => all.filter((a) => a instanceof CSSTransition && (a.effect as KeyframeEffect | null)?.target === ind && (a.transitionProperty === 'transform' || a.transitionProperty === 'width')),
        read: () => {
          const b = within(root, ind);
          return { px: b.x, pw: b.w };
        },
      };
    },
  });
  const Z = useDrawingScale(2.2);
  const m = drv.m;
  // The underline's left and right edges both ride this share of their trip.
  const prog = (t: number) => (m ? easeAt(Math.min(1, t / m.duration), m.easing) : 0);
  return (
    <SpecPage
      accent="tabs" label="Tabs specification" name="Tabs" theme={theme}
      ready={drv.ready} error={drv.error} onRetry={drv.retry}
      drawing={<>
        <div className={styles.subject} style={{ zoom: Z }} inert>
          <div ref={drv.root} style={{ display: 'inline-flex' }}>
            <Tabs key={key} defaultSelectedKey={FROM}>
              <TabList aria-label="Workspace">
                <Tab id="overview" data-key="overview">Overview</Tab>
                <Tab id="invoices" data-key="invoices" count={12}>Invoices</Tab>
                <Tab id="members" data-key="members">Members</Tab>
              </TabList>
            </Tabs>
          </div>
        </div>
        {m && !m.reduced && <Drawing m={m} z={Z} />}
      </>}
      moments={m && !m.reduced && <Moments snapshots={drv.snapshots} labels={['Start', 'Mid-glide', 'Settled']} selected={drv.selected} onSelect={drv.select}
        timeline={<Timeline value={m.elapsed} max={m.duration} f={prog} marks={FRACTIONS.map((f) => f * m.duration)} selected={drv.selected} label={<Ut v={m.elapsed} u="ms" />} />} />}
      notes={m ? [
        { part: 'n1', head: 'The underline glides tab to tab.', body: <>It slides across and keeps almost the same width, {r1(m.start.w)}px at the start, {r1(m.end.w)}px settled. Now: {r1(m.pw)}px.</> },
        { part: 'n2', head: 'It starts from the old tab.', body: <>The dashed line is where it rested, under the first tab. Both edges leave together on one curve.</> },
        { part: 'n3', head: 'It lands on the tab.', body: <>It ends as the new tab&apos;s own width, {r1(m.end.w)}px, after travelling {r1(m.travel)}px.</> },
      ] : []}
      spec={m ? [
        ['Trigger', 'Choosing a tab (pointer)', 'none'],
        ['Animates', 'translate and width of the underline', 'n1'],
        ['Width', <><U v={r1(m.start.w)} u="px" /> to <U v={r1(m.end.w)} u="px" /></>, 'n3'],
        ['Travel', <U v={r1(m.travel)} u="px" />, 'n3'],
        ['Duration', m.reduced ? 'None' : <U v={m.duration} u="ms" />, 'curve'],
        ['Easing', m.reduced ? 'None' : easeWords(m.easing), 'curve'],
      ] : []}
      fig2={m && !m.reduced ? { node: <Curve x={m.elapsed} max={m.duration} series={[{ f: prog }]} marks={[FRACTIONS[1] * m.duration]} label={<Ut v={r1(m.pw)} u="px" />} end={<Ut v={m.duration} u="ms" />} unit="ms" /> } : undefined}
      units={`Dimensions in px at 1×, drawn at ${Z}×. Both edges ride the one curve.`}
    />
  );
}
