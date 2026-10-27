import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Tooltip } from 'oniva-ui';
import { Callout, Curve, easeAt, easeWords, firstEasing, markClass, Moments, Overlay, r1, scaleOf, SpecPage, stopsOf, Timeline, U, useCrisp, useScreenScale, Ut, VDim, within, oneCamera, type Stop } from '../kit/spec-kit';
import { captureEach, type StateSnapshot } from '../kit/sheet-states';
import styles from '../kit/spec.module.css';
import type { SpecProps } from '../types';

// Tooltip (components/Tooltip): RAC TooltipTrigger with a hover delay, a floating tooltip that scales from its trigger.
// Driver: the real Tooltip, rendered in place (its portal container is a div inside the subject), driven by synthetic
// pointer events on the trigger only. Each moment is a run: pointer in, wait for the tooltip to mount, hold its real
// CSS animation (pause + currentTime). Delay and close delay are timed on the running component (MutationObserver on the
// portal), enter and exit from the animations' own timing and keyframes.

// Layout of the subject, in px at 1× (the subject is held at screen scale 1: see useScreenScale below).
const W = 220, H = 100;
// Held fraction of the enter animation for the "entering" moment.
const ENTERING_AT = 0.1;
// react-aria's global tooltip warm-up is cleared by TOOLTIP_COOLDOWN = 500ms after a close (react-stately
// useTooltipTriggerState); oniva's own lastClosedAt window (WARM_MS) is 300ms (Tooltip.tsx). Wait past both between runs.
const COOLDOWN_WAIT = 700;
const LABELS = ['Hidden', 'Entering', 'Shown'] as const;

type Box = { x: number; y: number; w: number; h: number };
type Base = {
  trig: Box; tip: Box; ox: number; oy: number;
  /** open delay: the smallest of the timer firings seen (each run adds a little React/timer slop), to the nearest 10ms */
  delay: number; delayRaw: number; closeDelay: number;
  enterDur: number; exitDur: number; enterEase: string; exitEase: string;
  from: number; exitTo: number; fromOpacity: number;
  enterOp: Stop[]; exitOp: Stop[]; enterSc: Stop[]; exitSc: Stop[];
  reduced: boolean;
};
type Held = Base & { sel: number; elapsed: number; opacity: number; scale: number; mounted: boolean };

class Gone extends Error {}
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const to10 = (v: number) => Math.round(v / 10) * 10;

async function waitFor<T>(get: () => T | null | undefined | false, cap: number, alive: () => boolean): Promise<T> {
  const t0 = performance.now();
  for (;;) {
    if (!alive()) throw new Gone();
    const v = get();
    if (v) return v;
    if (performance.now() - t0 > cap) throw new Error('waitFor timed out');
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
  }
}

function useTooltipDriver() {
  const root = useRef<HTMLDivElement>(null);
  const [portal, setPortal] = useState<HTMLElement | null>(null);
  const [base, setBase] = useState<Base | null>(null);
  const [m, setM] = useState<Held | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [selected, setSelected] = useState(1);
  const [snapshots, setSnapshots] = useState<StateSnapshot[]>([]);
  const run = useRef({ id: 0, goto: (_i: number) => Promise.resolve() });
  const ref = useCallback((el: HTMLElement | null) => setPortal(el), []);

  useEffect(() => {
    if (!portal || !root.current) return;
    const r = root.current;
    let alive = true;
    let gen = 0;
    let token = 0;
    const ok = (g: number, t?: number) => () => alive && g === gen && r.isConnected && r.offsetWidth > 0 && (t === undefined || t === token);
    const trigger = () => r.querySelector<HTMLElement>('button')!;
    const tipEl = () => portal.querySelector<HTMLElement>('[role="tooltip"]');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Runs in flight, the moment last driven to, and the measured base once known (for the re-drive below).
    let busy = 0, cur = 1, held: Base | null = null;
    let redrive: ReturnType<typeof setTimeout> | undefined;

    // Synthetic pointer on the trigger only (drivers.md): pointerover/out, mouse type, move first so RAC reads the
    // modality as pointer. relatedTarget stays null: React skips an over event whose related target is one of its own nodes.
    const hover = () => {
      const t = trigger();
      const o = { bubbles: true, pointerType: 'mouse', pointerId: 7, isPrimary: true } as const;
      t.dispatchEvent(new PointerEvent('pointermove', o));
      t.dispatchEvent(new PointerEvent('pointerover', { ...o, relatedTarget: null }));
      t.dispatchEvent(new PointerEvent('pointermove', o));
    };
    const leave = () => {
      const t = trigger();
      t.dispatchEvent(new PointerEvent('pointerout', { bubbles: true, pointerType: 'mouse', pointerId: 7, isPrimary: true, relatedTarget: null }));
    };
    const reset = async (g: number, t?: number) => {
      leave();
      await waitFor(() => !tipEl(), 3000, ok(g, t));
      // always: a cancelled earlier run (React's development double-run) may have left react-aria warmed up
      await sleep(COOLDOWN_WAIT);
      if (!ok(g, t)()) throw new Gone();
    };
    // Timestamp of the tooltip's insertion into the portal (the open timer firing), not a frame later.
    const mountedAt = () => new Promise<number>((resolve, reject) => {
      const mo = new MutationObserver(() => { if (tipEl()) { mo.disconnect(); resolve(performance.now()); } });
      mo.observe(portal, { childList: true, subtree: true });
      setTimeout(() => { mo.disconnect(); reject(new Error('tooltip never mounted')); }, 2500);
    });
    const exitingAt = (el: HTMLElement) => new Promise<number>((resolve, reject) => {
      const mo = new MutationObserver(() => { if (el.hasAttribute('data-exiting')) { mo.disconnect(); resolve(performance.now()); } });
      mo.observe(el, { attributes: true, attributeFilter: ['data-exiting'] });
      setTimeout(() => { mo.disconnect(); reject(new Error('tooltip never exited')); }, 2500);
    });
    const cssAnim = (el: HTMLElement) => el.getAnimations().find((a) => a instanceof CSSAnimation) as CSSAnimation | undefined;
    const timeOf = (a: Animation) => Number(a.effect!.getComputedTiming().duration);
    const read = (el: HTMLElement | null) => {
      if (!el) return { opacity: 0, scale: 1, mounted: false };
      const c = getComputedStyle(el);
      return { opacity: parseFloat(c.opacity), scale: new DOMMatrixReadOnly(c.transform === 'none' ? undefined : c.transform).a, mounted: true };
    };

    const measure = async (g: number): Promise<Base> => {
      const alive_ = ok(g);
      // enter
      const p = mountedAt();
      const t0 = performance.now();
      hover();
      const tAt = await p;
      const el = await waitFor(tipEl, 1500, alive_);
      if (reduced) {
        await sleep(50);
        const trig = within(r, trigger()), tip = within(r, el);
        return { trig, tip, ox: 0, oy: 0, delay: to10(tAt - t0), delayRaw: tAt - t0, closeDelay: 0, enterDur: 0, exitDur: 0, enterEase: 'ease', exitEase: 'ease', from: 1, exitTo: 1, fromOpacity: 1, enterOp: [], exitOp: [], enterSc: [], exitSc: [], reduced: true };
      }
      const a = await waitFor(() => cssAnim(el), 1500, alive_);
      const cs = getComputedStyle(el);
      const enterDur = timeOf(a), enterEase = firstEasing(cs.animationTimingFunction);
      const enterOp = stopsOf(a, (k) => parseFloat(String(k.opacity))), enterSc = stopsOf(a, scaleOf);
      const [ox, oy] = cs.transformOrigin.split(' ').map(parseFloat) as [number, number];
      await Promise.all(el.getAnimations().map((x) => x.finished));
      await waitFor(() => !el.hasAttribute('data-entering'), 1500, alive_).catch(() => undefined);
      const trig = within(r, trigger()), tip = within(r, el);
      // exit
      const q = exitingAt(el);
      const t1 = performance.now();
      leave();
      const eAt = await q;
      const b = await waitFor(() => cssAnim(el), 1500, alive_);
      const exitDur = timeOf(b), exitEase = firstEasing(getComputedStyle(el).animationTimingFunction);
      const exitOp = stopsOf(b, (k) => parseFloat(String(k.opacity))), exitSc = stopsOf(b, scaleOf);
      await waitFor(() => !tipEl(), 3000, alive_);
      return {
        trig, tip, ox, oy, delay: to10(tAt - t0), delayRaw: tAt - t0, closeDelay: to10(eAt - t1), enterDur, exitDur, enterEase, exitEase,
        from: enterSc[0]!.v, exitTo: exitSc[exitSc.length - 1]!.v, fromOpacity: enterOp[0]!.v, enterOp, exitOp, enterSc, exitSc, reduced: false,
      };
    };

    // Re-drive the component to moment i (0 hidden, 1 entering, 2 shown) and return the time on the open clock.
    const goto = async (g: number, b: Base, i: number, t0k: number) => {
      const alive_ = ok(g, t0k);
      await reset(g, t0k);
      if (i === 0) { setM({ ...b, sel: 0, elapsed: 0, ...read(null) }); return 0; }
      const p = mountedAt();
      const t0 = performance.now();
      hover();
      const tAt = await p;
      b.delayRaw = Math.min(b.delayRaw, tAt - t0);
      b.delay = to10(b.delayRaw);
      const el = await waitFor(tipEl, 1500, alive_);
      if (b.reduced) { await sleep(50); setM({ ...b, sel: i, elapsed: b.delay, ...read(el) }); return b.delay; }
      await waitFor(() => cssAnim(el), 1500, alive_);
      const anims = el.getAnimations();
      let t: number;
      if (i === 1) {
        t = b.enterDur * ENTERING_AT;
        anims.forEach((x) => { x.pause(); x.currentTime = t; });
      } else {
        await Promise.all(anims.map((x) => x.finished));
        t = b.enterDur;
      }
      await new Promise<void>((res) => requestAnimationFrame(() => res()));
      if (!alive_()) throw new Gone();
      setM({ ...b, sel: i, elapsed: Math.round(b.delay + t), ...read(el) });
      return t;
    };

    const drive = async (g: number, b: Base, i: number) => {
      busy++; cur = i;
      try { return await goto(g, b, i, ++token); } finally { busy--; }
    };

    const prepare = async () => {
      const g = ++gen;
      setReady(false); setError(false);
      held = null; busy++;
      try {
        await document.fonts.ready;
        await new Promise<void>((res) => requestAnimationFrame(() => res()));
        if (!ok(g)()) return;
        await reset(g);
        r.getAnimations({ subtree: true }).forEach((a) => a.cancel());
        const b = await measure(g);
        if (!ok(g)()) return;
        setBase(b);
        if (!b.reduced) {
          const shots: StateSnapshot[] = [];
          for (const i of [0, 1, 2]) {
            const t = await drive(g, b, i);
            shots.push({ ...captureEach(r, 1, () => t)[0]!, time: t });
          }
          // times on the open clock, with the delay as measured over all the runs
          setSnapshots(oneCamera(shots.map((x) => ({ ...x, time: b.delay + x.time }))));
        }
        run.current = { id: g, goto: async (i: number) => { await drive(g, b, i); } };
        await drive(g, b, 1);
        held = b;
        setSelected(1);
        setReady(true);
      } catch (e) {
        if (e instanceof Gone || !alive || g !== gen) return;
        if (import.meta.env.DEV) console.warn('Spec capture failed:', e);
        setError(true);
      } finally { busy--; }
    };
    void prepare();
    // react-aria closes a tooltip when any ancestor of its trigger scrolls (the strip's row does, as it settles or the
    // reader moves along it). The poster holds a moment, so it drives the component back to it once the scrolling stops.
    const watch = new MutationObserver(() => {
      if (!held || busy || cur === 0 || tipEl()) return;
      clearTimeout(redrive);
      redrive = setTimeout(() => {
        if (!held || busy || tipEl() || !alive || !r.isConnected) return;
        void drive(gen, held, cur).catch(() => undefined);
      }, 400);
    });
    watch.observe(portal, { childList: true, subtree: true });
    const refresh = () => { void prepare(); };
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    motion.addEventListener('change', refresh);
    window.addEventListener('spec-theme', refresh);
    return () => {
      alive = false; gen++; watch.disconnect(); clearTimeout(redrive);
      motion.removeEventListener('change', refresh);
      window.removeEventListener('spec-theme', refresh);
      r.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    };
  }, [portal, attempt]);

  const select = (i: number) => {
    setSelected(i);
    const id = ++run.current.id;
    void run.current.goto(i).catch((e) => { if (!(e instanceof Gone) && id === run.current.id && import.meta.env.DEV) console.warn(e); });
  };
  return { root, ref, portal, base, m, ready, error, retry: () => setAttempt((v) => v + 1), selected, select, snapshots };
}

// Overlay over figure 1 (all in 1× px of the subject, times the drawing scale Z).
function Drawing({ m, z: Z }: { m: Held; z: number }) {
  const { ref, snap } = useCrisp();
  const { tip, trig, ox, oy, from } = m;
  const px = tip.x + ox, py = tip.y + oy;
  // the tooltip at its start scale, about its origin
  const g = { x: px + (tip.x - px) * from, y: py + (tip.y - py) * from, w: tip.w * from, h: tip.h * from };
  const gap = trig.y - (tip.y + tip.h);
  return (
    <Overlay w={W * Z} h={H * Z} svgRef={ref}>
      <rect x={snap(tip.x * Z, 'x')} y={snap(tip.y * Z, 'y')} width={snap((tip.x + tip.w) * Z, 'x') - snap(tip.x * Z, 'x')} height={snap((tip.y + tip.h) * Z, 'y') - snap(tip.y * Z, 'y')} rx={6 * Z} className={markClass.reference} data-part="n2" />
      <rect x={snap(g.x * Z, 'x')} y={snap(g.y * Z, 'y')} width={snap((g.x + g.w) * Z, 'x') - snap(g.x * Z, 'x')} height={snap((g.y + g.h) * Z, 'y') - snap(g.y * Z, 'y')} rx={6 * Z * from} className={markClass.ghost} data-part="n2" />
      <circle cx={px * Z} cy={py * Z} r={3.5} className={markClass.mark} data-part="n2" />
      <VDim snap={snap} y1={(tip.y + tip.h) * Z} y2={trig.y * Z} x={(tip.x + tip.w + 18) * Z} from={(tip.x + tip.w) * Z} label={<>{r1(gap)}</>} part="n2" />
      <Callout n={1} x={(trig.x + trig.w) * Z} y={(trig.y + trig.h / 2) * Z} dir="e" len={60} />
      <Callout n={2} x={g.x * Z} y={(g.y + g.h * 0.35) * Z} dir="w" len={60} />
      <Callout n={3} x={(tip.x + tip.w) * Z} y={(tip.y + tip.h * 0.3) * Z} dir="ne" len={34} />
    </Overlay>
  );
}

export function TooltipSpec({ theme }: SpecProps) {
  const drv = useTooltipDriver();
  // RAC places the tooltip from the trigger's on-screen rect but sizes it in layout px, so a scaled subject misplaces it
  // (drivers.md, "measures itself on screen"): hold the subject at screen scale 1 whatever the poster's own scale.
  const Z = useScreenScale(drv.root);
  const m = drv.m;
  const b = drv.base;
  const open = (t: number) => (b && !b.reduced ? (t < b.delay ? 0 : easeAt(Math.min(1, (t - b.delay) / b.enterDur), b.enterEase)) : 0);
  const close = (t: number) => (b && !b.reduced ? (t < b.closeDelay ? 1 : 1 - easeAt(Math.min(1, (t - b.closeDelay) / b.exitDur), b.exitEase)) : 0);
  const total = b && !b.reduced ? Math.max(b.delay + b.enterDur, b.closeDelay + b.exitDur) : 1;
  const openEnd = b && !b.reduced ? b.delay + b.enterDur : 1;
  const marks = b && !b.reduced ? [0, b.delay + b.enterDur * ENTERING_AT, b.delay + b.enterDur] : [];
  const pad = 14;
  const crop = b ? { x: Math.max(0, b.tip.x - pad), y: Math.max(0, b.tip.y - pad), w: Math.min(W, b.trig.x + b.trig.w + pad) - Math.max(0, b.tip.x - pad) + 0, h: b.trig.y + b.trig.h + pad - Math.max(0, b.tip.y - pad) } : undefined;
  const hold = m && b && !b.reduced;
  return (
    <SpecPage
      accent="tooltip" label="Tooltip specification" name="Tooltip" theme={theme}
      ready={drv.ready} error={drv.error} onRetry={drv.retry}
      drawing={<>
        <div className={styles.subject} style={{ width: W * Z, height: H * Z, pointerEvents: 'none' }}>
          <div style={{ transform: `scale(${Z})`, transformOrigin: '0 0', width: W, height: H }}>
            <div ref={drv.root} style={{ position: 'relative', width: W, height: H }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: 8 }}>
                <div>
                {drv.portal && (
                  <Tooltip content="Save draft" UNSTABLE_portalContainer={drv.portal}>
                    <Button variant="secondary">Save</Button>
                  </Tooltip>
                )}
                </div>
              </div>
              <div ref={drv.ref} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
              {/* the live component's real footprint (tooltip and trigger), for the overlap check: the subject box is
                  the whole stage otherwise, and every label would sit "on the component" */}
              {b && <div data-subject-root aria-hidden style={{ position: 'absolute', pointerEvents: 'none', left: Math.min(b.tip.x, b.trig.x), top: b.tip.y, width: Math.max(b.tip.x + b.tip.w, b.trig.x + b.trig.w) - Math.min(b.tip.x, b.trig.x), height: b.trig.y + b.trig.h - b.tip.y }} />}
            </div>
          </div>
        </div>
        {m && b && !b.reduced && <Drawing m={m} z={Z} />}
      </>}
      moments={hold && <Moments snapshots={drv.snapshots} labels={LABELS} selected={drv.selected} onSelect={drv.select} crop={crop}
        timeline={<Timeline value={m.elapsed} max={openEnd} f={open} marks={marks} selected={drv.selected} label={<Ut v={m.elapsed} u="ms" />} />} />}
      notes={m && b ? [
        { part: 'n1', head: `Nothing for ${b.delay}ms.`, body: <>Hover starts a timer; leave before it ends and no tooltip ever mounts. The trigger gives no sign meanwhile.</> },
        ...(b.reduced ? [] : [
          { part: 'n2' as const, head: 'It grows from its trigger.', body: <>Opacity and scale run from {b.from} to 1 about the arrow tip, over {b.enterDur}ms. Now: {Math.round(m.opacity * 100)}% opacity, scale {m.scale.toFixed(3)}.</> },
          { part: 'n3' as const, head: 'It leaves quicker.', body: <>After {b.closeDelay}ms it exits in {b.exitDur}ms, against {b.enterDur}ms in, on the same {b.exitEase === b.enterEase ? 'curve' : 'kind of curve'}.</> },
        ]),
      ] : []}
      spec={m && b ? [
        ['Trigger', 'Pointer hover, after the delay', 'n1'],
        ['Open delay', <><U v={b.delay} u="ms" /></>, 'n1'],
        ['Close delay', b.reduced ? 'Not measured' : <U v={b.closeDelay} u="ms" />, 'n3'],
        ['Animates', b.reduced ? 'Nothing' : 'opacity, scale', 'n2'],
        ['Enter', b.reduced ? 'None' : <><U v={b.enterDur} u="ms" />, scale {b.from} to 1</>, 'curve'],
        ['Exit', b.reduced ? 'None' : <><U v={b.exitDur} u="ms" />, scale 1 to {b.exitTo}</>, 'curve'],
        ['Easing', b.reduced ? 'None' : easeWords(b.enterEase), 'curve'],
        ['Reduced motion', 'The animations are switched off; the tooltip still waits its delay', 'none'],
      ] : []}
      fig2={b && !b.reduced && m ? { node: <Curve x={Math.min(m.elapsed, total)} max={total} marks={[b.delay]} series={[{ f: open }, { f: close, className: styles.easeAlt }]} end={<Ut v={total} u="ms" />} unit="ms" /> } : undefined}
      units={b ? `Dimensions in px at 1×, drawn at screen scale 1. Figure 2: solid, pointer in; grey, pointer out; both clocks start at 0` : ''}
    />
  );
}
