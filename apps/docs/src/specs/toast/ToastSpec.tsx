import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { UNSAFE_PortalProvider } from 'react-aria';
import { ToastProvider, toastQueue, type ToastData } from 'oniva-ui';
import { Callout, Dim, easeWords, firstEasing, markClass, Moments, oneCamera, Overlay, r1, SpecPage, U, useCrisp, VDim, within } from '../kit/spec-kit';
import { captureEach, type StateSnapshot } from '../kit/sheet-states';
import styles from '../kit/spec.module.css';
import type { SpecProps } from '../types';

// Toast (components/Toast). The real ToastProvider renders a region fixed to the window; here it is mounted in a frame
// of its own with a queue of its own (so the page's other toasts are untouched), and the region is made absolute in the
// frame (see `regionRef`). Three toasts are added, then each moment is a run: the stack at rest, the pointer over it,
// and the front toast dragged past its swipe threshold.
//
// Driver notes (references/drivers.md):
//  - Pointer paths are synthetic events sent to the toast's own elements; the component reads only clientX differences
//    and compares them with its own offsetWidth (layout px), so the events carry layout-px distances and the poster can
//    be scaled by the page without changing a decision. (A real mouse over a scaled poster would not; the poster is inert.)
//  - react-aria renders the toast region in a portal on the page body: it is portalled into the frame instead
//    (UNSAFE_PortalProvider), so the moments copy it with the rest.
//  - setPointerCapture throws for a pointer id with no real pointer behind it: this driver's own id is let through as a
//    no-op while the poster is mounted, every other id is left alone, and the originals are put back on unmount.
//  - The stack expands on the region's `pointerenter`/`pointerleave`: dispatched on the region, never on the document.

// Toast.tsx: `SWIPE_RATIO` (a release past this share of the toast's width dismisses it) and `SWIPE_VELOCITY` (px/ms; with
// a drag of more than 10px, a release faster than this dismisses it). Library constants the component does not expose:
// the probe below shows each at work (released just under the ratio, just over it, and a short quick flick).
const SWIPE_RATIO = 0.45;
const SWIPE_VELOCITY = 0.11;
const FLICK_MIN_PX = 10;
const PID = 9101; // this driver's pointer id
const W = 520;
const H = 262;
const FRAME = 1; // the frame's border, in px
const SHOWN_PAST = 1.2; // the drag the "dismissing" moment holds, as a multiple of the threshold (the poster's choice)
const MOMENTS = ['Stacked', 'Expanded', 'Dismissing'] as const;

const CONTENT: ToastData[] = [
  { title: 'Report exported', description: 'usage-q3.csv, 2.4 MB', variant: 'default' },
  { title: 'Deploy finished', description: 'atlas-2 on Northwind Labs, 41 s', variant: 'info' },
  { title: 'Invoice sent', description: 'INV-2041 to Northwind Labs', variant: 'success' },
];

type Box = { x: number; y: number; w: number; h: number };
type Layer = { scale: number; ty: number; sx: number; opacity: number; fade: number; box: Box };
type Trans = { duration: number; easing: string };
type Probe = { under: number; over: number; flick: number; underKept: boolean; overLeft: boolean; flickLeft: boolean };
type Base = {
  stacked: Layer[]; expanded: Layer[]; width: number; threshold: number; gap: number; peek: number;
  move: Trans; exit: Trans; exitRemovedAt: number; probe: Probe; reducedProps: string; props: string; reduced: boolean;
};
type Now = { layers: Layer[]; dx: number };
type Held = Base & Now;

const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
const frames = async (n: number) => { for (let i = 0; i < n; i++) await frame(); };
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const until = async (test: () => boolean, cap = 2500) => {
  const t0 = performance.now();
  while (!test() && performance.now() - t0 < cap) await frame();
  return test();
};
const msOf = (v: string) => parseFloat(v) * (v.trim().endsWith('ms') ? 1 : 1000);

// What the slot's transition-property is under reduced motion, read from the stylesheet (this window may not be in it):
// the declaration in a reduced-motion media rule that targets one of the slot's classes (StyleX writes one class per property).
function reducedProps(el: HTMLElement) {
  const classes = new Set(el.className.split(/\s+/).filter(Boolean));
  let best: { value: string; rank: number } | null = null;
  const walk = (rules: CSSRuleList, on: boolean, inherited?: string, inheritedRank = 0) => {
    for (const r of Array.from(rules)) {
      const style = (r as CSSStyleRule).style as CSSStyleDeclaration | undefined;
      if (style) {
        const sel = (r as CSSStyleRule).selectorText;
        const cls = sel?.match(/^\.([\w-]+)/)?.[1] ?? inherited;
        const rank = sel ? (sel.match(/:not\(/g) ?? []).length : inheritedRank;
        const value = style.getPropertyValue('transition-property');
        if (on && cls && classes.has(cls) && value && (!best || rank >= best.rank)) best = { value, rank };
        const nested = (r as CSSStyleRule).cssRules;
        if (nested?.length) walk(nested, on, cls, rank);
      } else if ('cssRules' in r) {
        const text = 'media' in r ? (r as CSSMediaRule).media.mediaText : '';
        walk((r as CSSGroupingRule).cssRules, on || (text.includes('prefers-reduced-motion') && !/\bnot\b/.test(text)), inherited, inheritedRank);
      }
    }
  };
  for (const s of Array.from(document.styleSheets)) { try { walk(s.cssRules, false); } catch { /* cross-origin sheet */ } }
  return (best as { value: string } | null)?.value.replace(/,\s*/g, ', ') ?? '';
}

function SwipeRegions({ dx, width, threshold }: { dx: number; width: number; threshold: number }) {
  // Figure 2: the decision regions along the drag, with the current drag inside them. Drawn at its column's own width.
  const svg = useRef<SVGSVGElement>(null);
  const [cw, setCw] = useState(229);
  useLayoutEffect(() => {
    const el = svg.current?.parentElement;
    if (!el) return;
    const read = () => setCw((p) => (el.clientWidth && Math.abs(el.clientWidth - p) > 0.5 ? el.clientWidth : p));
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const L = 8, R = 8, PW = cw - L - R;
  const X = (v: number) => L + (PW * Math.max(0, Math.min(width, v))) / width;
  const A = { y: 22, h: 30 }; // lane A: the distance rule
  const B = { y: 72, h: 30 }; // lane B: the speed rule
  const axisY = 118;
  const at = X(dx);
  return (
    <svg ref={svg} className={styles.curve} viewBox={`0 0 ${cw} 146`} role="img" aria-label={`Dragged ${r1(dx)} px of ${r1(threshold)}.`}>
      <rect x={X(0)} y={A.y} width={X(threshold) - X(0)} height={A.h} className={styles.band} />
      <rect x={X(threshold)} y={A.y} width={X(width) - X(threshold)} height={A.h} className={styles.bandOn} />
      <rect x={X(0)} y={B.y} width={X(FLICK_MIN_PX) - X(0)} height={B.h} className={styles.band} />
      <rect x={X(FLICK_MIN_PX)} y={B.y} width={X(width) - X(FLICK_MIN_PX)} height={B.h} className={styles.bandOn} />
      <text x={X(width)} y={A.y - 6} textAnchor="end">Distance</text>
      <text x={X(width)} y={B.y - 6} textAnchor="end">Speed</text>
      <text x={X(threshold) - 6} y={A.y + A.h / 2 + 4} textAnchor="end">Snaps back</text>
      <text x={X(width) - 6} y={A.y + A.h / 2 + 4} textAnchor="end" className={styles.accentText}>Leaves</text>
      <text x={X(FLICK_MIN_PX) + 6} y={B.y + B.h / 2 + 4} className={styles.accentText}>{`over ${SWIPE_VELOCITY} px/ms`}</text>
      <path d={`M${X(0)} ${axisY}H${X(width)}`} className={styles.axis} />
      <line x1={X(threshold)} x2={X(threshold)} y1={A.y} y2={axisY} className={styles.referenceLine} />
      <line x1={X(FLICK_MIN_PX)} x2={X(FLICK_MIN_PX)} y1={B.y - 4} y2={axisY} className={styles.guide} />
      <line x1={at} x2={at} y1={A.y} y2={axisY} className={styles.guide} />
      <circle cx={at} cy={A.y + A.h / 2} r={3.5} className={styles.dot} />
      <text x={X(0)} y={axisY + 17}>0</text>
      <text x={X(threshold)} y={axisY + 17} textAnchor="middle">{r1(threshold)}</text>
      <text x={X(width)} y={axisY + 17} textAnchor="end">{r1(width)}</text>
      <text x={at} y={A.y - 6} textAnchor={at > X(width) - 30 ? 'end' : at < X(0) + 16 ? 'start' : 'middle'} className={styles.accentText}>{r1(dx)}</text>
    </svg>
  );
}

function Drawing({ m, selected }: { m: Held; selected: number }) {
  const { ref, snap } = useCrisp();
  const rest = m.stacked[0]!.box;
  const [front, second, third] = m.layers as [Layer, Layer, Layer];
  const T = m.threshold;
  const refX = rest.x + T;
  const fanned = second.scale > 0.99;
  const at = (l: Layer) => (fanned ? l.box.y + l.box.h / 2 : l.box.y + 4);
  return (
    <Overlay w={W} h={H} svgRef={ref}>
      {/* the swipe threshold: a reference at the rest edge plus the threshold, and the rest box as a ghost while it is dragged */}
      <line x1={snap(refX, 'x')} x2={snap(refX, 'x')} y1={0} y2={H} className={markClass.reference} data-part="n3 curve" />
      {selected === 2 && <rect x={snap(rest.x, 'x')} y={snap(rest.y, 'y')} width={snap(rest.x + rest.w, 'x') - snap(rest.x, 'x')} height={snap(rest.y + rest.h, 'y') - snap(rest.y, 'y')} rx={12} className={markClass.ghost} data-part="n3" />}
      <Dim snap={snap} x1={rest.x} x2={refX} y={H + 21} from={rest.y + rest.h} label={r1(T)} below part="n3 curve" />
      {/* layers 2 and 3 are fanned out when they are full size: then the gap between toasts is what is measured, otherwise the strip that shows */}
      {fanned
        ? <VDim snap={snap} y1={second.box.y + second.box.h} y2={front.box.y} x={rest.x - 22} from={rest.x} label={r1(m.gap)} left part="n2" />
        : <VDim snap={snap} y1={second.box.y} y2={front.box.y} x={rest.x - 22} from={rest.x} label={r1(front.box.y - second.box.y)} left part="n1" />}
      {fanned
        ? <Callout n={1} x={third.box.x + third.box.w} y={at(third)} dir="e" len={W - third.box.x - third.box.w + 34} />
        : <Callout n={1} x={third.box.x + third.box.w - 40} y={third.box.y} dir="ne" len={24} />}
      <Callout n={2} x={second.box.x + second.box.w} y={at(second)} dir="e" len={W - second.box.x - second.box.w + 34} />
      <Callout n={3} x={front.box.x} y={front.box.y + front.box.h / 2} dir="w" len={front.box.x + 34} />
    </Overlay>
  );
}

export function ToastSpec({ theme }: SpecProps) {
  const [queue] = useState(() => new (toastQueue.constructor as new (o: { maxVisibleToasts: number }) => typeof toastQueue)({ maxVisibleToasts: 5 }));
  const root = useRef<HTMLDivElement | null>(null);
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const frameRef = useCallback((el: HTMLDivElement | null) => { root.current = el; setHost(el); }, []);
  const regionEl = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ el: HTMLElement; x0: number; dx: number } | null>(null);
  const base = useRef<Base | null>(null);
  const [m, setM] = useState<Held | null>(null);
  const [ready, setReady] = useState(false);
  const [settled, setSettled] = useState(false);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [selected, setSelected] = useState(2);
  const [snapshots, setSnapshots] = useState<StateSnapshot[]>([]);
  const runner = useRef<(i: number) => Promise<void>>(async () => {});

  // The region is fixed to the window by the component; in this frame it has to sit in the frame instead. The inline
  // `position: absolute !important` wins over the library's atomic class and nothing else on the page is touched.
  const regionRef = useCallback((el: HTMLDivElement | null) => {
    regionEl.current = el;
    if (!el) return;
    el.style.setProperty('position', 'absolute', 'important');
    el.setAttribute('data-subject-root', '');
  }, []);

  useEffect(() => {
    // Let this driver's pointer id through setPointerCapture (see the header comment); put the originals back on unmount.
    const proto = Element.prototype;
    const { setPointerCapture: set, releasePointerCapture: rel, hasPointerCapture: has } = proto;
    proto.setPointerCapture = function (this: Element, id: number) { if (id !== PID) set.call(this, id); };
    proto.releasePointerCapture = function (this: Element, id: number) { if (id !== PID) rel.call(this, id); };
    proto.hasPointerCapture = function (this: Element, id: number) { return id === PID ? false : has.call(this, id); };
    return () => { proto.setPointerCapture = set; proto.releasePointerCapture = rel; proto.hasPointerCapture = has; };
  }, []);

  useEffect(() => {
    if (!host) return;
    let alive = true;
    const STALE = new Error('stale');
    const guard = () => { if (!alive || !root.current?.isConnected || !root.current.offsetWidth) throw STALE; };
    const r = root.current!;
    const region = () => regionEl.current!;
    const slots = () => Array.from(region().querySelectorAll<HTMLElement>('[data-state]'));
    const live = () => slots().filter((s) => s.dataset.state !== 'exiting').sort((a, b) => Number(b.style.zIndex) - Number(a.style.zIndex));
    const fire = (el: Element, type: string, init: PointerEventInit = {}) =>
      el.dispatchEvent(new PointerEvent(type, { bubbles: type !== 'pointerenter' && type !== 'pointerleave', cancelable: true, pointerId: PID, pointerType: 'mouse', isPrimary: true, button: 0, clientY: 200, ...init }));
    const settle = async () => {
      await frames(3);
      guard();
      await until(() => region().getAnimations({ subtree: true }).length === 0, 3000);
      await frame();
      guard();
    };
    const build = async () => {
      queue.clear();
      await frames(3);
      for (const c of CONTENT) { queue.add(c, {}); await frames(3); guard(); }
      if (!(await until(() => live().length === CONTENT.length && live().every((s) => s.dataset.state === 'open'), 3000))) throw new Error('stack did not form');
      await settle();
    };
    const read = (): Layer[] => live().map((s) => {
      const c = getComputedStyle(s);
      const t = new DOMMatrixReadOnly(c.transform === 'none' ? undefined : c.transform);
      const close = s.querySelector<HTMLElement>('button[aria-label="Dismiss notification"]')!;
      return { scale: t.a, ty: t.m42, sx: t.m41, opacity: parseFloat(c.opacity), fade: parseFloat(getComputedStyle(close).opacity), box: within(r, s) };
    });
    const front = () => live()[0]!;
    // A drag: down, steps of 8px a frame, then a slow last pixel so the release speed is far under the flick threshold.
    const dragTo = async (el: HTMLElement, x0: number, dx: number, how: 'slow' | 'flick' = 'slow') => {
      fire(el, 'pointerdown', { clientX: x0 });
      if (how === 'flick') {
        fire(el, 'pointermove', { clientX: x0 + 8 });
        await wait(5);
        fire(el, 'pointermove', { clientX: x0 + dx });
        return;
      }
      for (let x = 8; x < dx - 1; x += 8) { fire(el, 'pointermove', { clientX: x0 + x }); await frame(); guard(); }
      await wait(40);
      fire(el, 'pointermove', { clientX: x0 + dx - 1 });
      await wait(40);
      fire(el, 'pointermove', { clientX: x0 + dx });
      await wait(40);
      guard();
    };
    const release = (el: HTMLElement, x0: number, dx: number) => fire(el, 'pointerup', { clientX: x0 + dx });
    // Pointer over (or off) the stack. Returns the stack's own transform transition as it starts (its duration and curve).
    const hover = async (on: boolean): Promise<Trans | null> => {
      fire(region(), on ? 'pointerenter' : 'pointerleave');
      await frames(2);
      const a = region().getAnimations({ subtree: true }).find((x) => x instanceof CSSTransition && x.transitionProperty === 'transform');
      const t = a ? { duration: Math.round(Number(a.effect!.getComputedTiming().duration)), easing: firstEasing(String((a.effect as KeyframeEffect).getTiming().easing)) } : null;
      await settle();
      return t;
    };
    const letGo = async () => {
      const d = drag.current;
      if (!d) return;
      drag.current = null;
      fire(d.el, 'pointermove', { clientX: d.x0 });
      release(d.el, d.x0, 0);
      await settle();
    };
    const now = (): Now => { const layers = read(); return { layers, dx: layers[0]!.sx }; };

    // One moment, driven through the component's own handlers and held (the live component is what figure 1 shows).
    const run = async (i: number) => {
      guard();
      await letGo();
      if (i === 0) await hover(false);
      else {
        await hover(true);
        if (i === 2) {
          const el = front().firstElementChild as HTMLElement;
          const b = base.current!;
          const x0 = 300, dx = Math.round(b.threshold * SHOWN_PAST);
          await dragTo(el, x0, dx);
          drag.current = { el, x0, dx };
        }
      }
      guard();
    };
    // Picking a moment re-drives the live component. Picks made while a run is going are folded into the newest one.
    let busy = false, want = 2, have = 2;
    runner.current = async (i: number) => {
      want = i;
      if (busy) return;
      busy = true;
      try {
        while (have !== want && alive) { const t = want; await run(t); have = t; if (alive) setM({ ...base.current!, ...now() }); }
      } catch (e) { if (e !== STALE) throw e; } finally { busy = false; }
    };

    (async () => {
      try {
        await document.fonts.ready;
        await until(() => !!regionEl.current);
        await frame();
        guard();
        // 1. Probe the decisions: released just under the ratio, just over it, and a short quick flick.
        await build();
        const stacked = read();
        const width = front().offsetWidth;
        const threshold = SWIPE_RATIO * width;
        const move = await hover(true);
        if (!move) throw new Error('the stack did not move');
        const expanded = read();
        await hover(false);
        const el0 = front().firstElementChild as HTMLElement;
        const slot0 = front();
        const underPx = Math.floor(threshold) - 2;
        await dragTo(el0, 300, underPx);
        release(el0, 300, underPx);
        await frames(3);
        const underKept = slot0.dataset.state === 'open';
        await settle();
        const overPx = Math.ceil(threshold) + 2;
        await dragTo(el0, 300, overPx);
        const t0 = performance.now();
        release(el0, 300, overPx);
        await frames(3);
        const overLeft = slot0.dataset.state === 'exiting';
        // the exit, read while it runs: the exiting slot's own transition, and when the queue lets it go
        const cs = getComputedStyle(slot0);
        const exit: Trans = { duration: msOf(cs.transitionDuration.split(',')[0]!), easing: firstEasing(cs.transitionTimingFunction) };
        await until(() => !slot0.isConnected, 2000);
        const exitRemovedAt = Math.round(performance.now() - t0);
        guard();
        await build();
        const flickEl = front().firstElementChild as HTMLElement;
        const flickSlot = front();
        const flickPx = FLICK_MIN_PX + 20;
        await dragTo(flickEl, 300, flickPx, 'flick');
        release(flickEl, 300, flickPx);
        await frames(3);
        const flickLeft = flickSlot.dataset.state === 'exiting';
        await until(() => !flickSlot.isConnected, 2000);
        // 2. The stack as a fresh run reads it.
        await build();
        const slot = front();
        const cs2 = getComputedStyle(slot);
        const props = cs2.transitionProperty.replace(/,\s*/g, ', ');
        const gap = expanded.length > 1 ? r1(expanded[0]!.box.y - (expanded[1]!.box.y + expanded[1]!.box.h)) : 0;
        const peek = r1(stacked[0]!.box.y - stacked[1]!.box.y);
        const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
        base.current = {
          stacked, expanded, width, threshold, gap, peek, move, exit, exitRemovedAt, props,
          probe: { under: underPx, over: overPx, flick: flickPx, underKept, overLeft, flickLeft },
          reducedProps: reducedProps(slot), reduced,
        };
        // 3. The moments: each a run, copied, in one camera.
        const shots: StateSnapshot[] = [];
        for (let i = 0; i < MOMENTS.length; i++) {
          await run(i);
          const dxNow = i === 2 ? Math.round(threshold * SHOWN_PAST) : 0;
          shots.push(captureEach(r, 1, () => dxNow)[0]!);
          guard();
        }
        const held = { ...base.current, ...now() };
        if (!alive) return;
        setSnapshots(oneCamera(shots));
        setSelected(2);
        setM(held);
        setReady(true);
        await frame();
        if (alive) setSettled(true);
      } catch (e) {
        if (e === STALE || !alive) return;
        if (import.meta.env.DEV) console.warn('Spec capture failed:', e);
        setError(true);
      }
    })();
    return () => { alive = false; queue.clear(); };
  }, [attempt, queue, host]);

  const select = (i: number) => { setSelected(i); void runner.current(i); };
  const retry = () => { setError(false); setReady(false); setSettled(false); setAttempt((v) => v + 1); };
  const b = m;
  const pct = (v: number) => Math.round(v * 100);

  return (
    <SpecPage
      accent="toast" label="Toast specification" name="Toast" theme={theme}
      ready={ready} settled={settled} error={error} onRetry={retry}
      drawing={<>
        <div className={styles.subject} style={{ width: W, height: H }}>
          <div ref={frameRef} style={{ position: 'relative', width: W, height: H, boxSizing: 'border-box', overflow: 'hidden', border: `${FRAME}px solid var(--oniva-color-border)`, isolation: 'isolate', borderRadius: 14, pointerEvents: 'none' }}>
            {host && <UNSAFE_PortalProvider getContainer={() => host}><ToastProvider ref={regionRef} queue={queue} hotkey={null} aria-label="Notifications" /></UNSAFE_PortalProvider>}
          </div>
        </div>
        {b && !b.reduced && <Drawing m={b} selected={selected} />}
      </>}
      moments={b && !b.reduced && <Moments height={90} snapshots={snapshots} labels={MOMENTS} selected={selected} onSelect={select} timeline={null} crop={{ x: 120, y: 10, w: 400, h: 242 }} />}
      notes={b ? [
        { part: 'n1', head: 'Each layer steps back.', body: <>Toasts behind the front one scale to {pct(b.stacked[1]!.scale)}% then {pct(b.stacked[2]!.scale)}% and sit {-b.stacked[1]!.ty}px then {-b.stacked[2]!.ty}px higher, so {b.peek}px of each shows. Their text fades to {pct(b.stacked[1]!.fade)}%. Now: layer 2 at {pct(b.layers[1]!.scale)}%, {-r1(b.layers[1]!.ty)}px up.</> },
        { part: 'n2', head: 'Hover fans them out.', body: <>Over the stack every toast returns to {pct(b.expanded[1]!.scale)}% and moves up by the heights above it plus a {b.gap}px gap, so nothing is covered. Now: layer 2 is {-r1(b.layers[1]!.ty)}px up.</> },
        { part: 'n3', head: `A swipe past ${r1(b.threshold)}px leaves.`, body: <>The toast follows the pointer: {r1(b.dx)}px now. Let go past {pct(SWIPE_RATIO)}% of its {r1(b.width)}px width and it exits; at {b.probe.under}px it {b.probe.underKept ? 'sprang back' : 'left'}, at {b.probe.over}px it {b.probe.overLeft ? 'left' : 'sprang back'}.</> },
      ] : []}
      spec={b ? [
        ['Trigger', 'Pointer or focus on the stack; drag a toast', 'none'],
        ['Animates', b.props, 'n1'],
        ['Stack', <>{b.stacked.map((l) => pct(l.scale)).join(', ')}<span className={styles.unit}>%</span>, offset {b.stacked.map((l) => -r1(l.ty)).join(', ')}<span className={styles.unit}>px</span></>, 'n1'],
        ['Expanded', <>gap <U v={b.gap} u="px" />, all <U v={pct(b.expanded[0]!.scale)} u="%" /></>, 'n2'],
        ['Move', b.reduced ? 'None' : <><U v={b.move.duration} u="ms" />, {easeWords(b.move.easing)}</>, 'n2'],
        ['Swipe', <>past <U v={r1(b.threshold)} u="px" />, or a flick over <U v={SWIPE_VELOCITY} u="px/ms" />{b.probe.flickLeft ? '' : ' (not seen)'}</>, 'n3'],
        ['Exit', b.reduced ? 'None' : <><U v={b.exit.duration} u="ms" />, {easeWords(b.exit.easing)}; gone at <U v={b.exitRemovedAt} u="ms" /></>, 'n3'],
        ['Reduced motion', <>{b.reducedProps ? `Transitions ${b.reducedProps} only (stylesheet)` : 'Not read'}</>, 'none'],
      ] : []}
      fig2={b ? { node: <SwipeRegions dx={b.dx} width={b.width} threshold={b.threshold} /> } : undefined}
      units="Dimensions in px at 1×, drawn at 1×"
    />
  );
}
