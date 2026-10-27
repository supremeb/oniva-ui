import { useEffect, useLayoutEffect, type RefObject } from 'react';

/**
 * Measured beam engine for IntegrationBeam: curves are read from the real tile positions (ResizeObserver),
 * sync cycles send one pulse per beam (left wave -> hub glow -> right wave), the layout flip between
 * side-by-side and stacked glides tiles (FLIP) and morphs the curves (rAF blend). The loop only runs while `live`.
 */

export const BEAM_TRAVEL = 1500;
export const BEAM_STAGGER = 280;
export const BEAM_REST = 1500;
export const BEAM_MORPH = 460;
export const BEAM_STACK_BELOW = 460;
const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';
const easeOut = (t: number) => 1 - (1 - t) ** 5;
const easeInOut = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

export const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

type Point = { x: number; y: number };
type Curve = number[];

export interface BeamEngineRefs {
  root: RefObject<HTMLElement | null>;
  svg: RefObject<SVGSVGElement | null>;
  hub: RefObject<HTMLElement | null>;
  hubRing: RefObject<HTMLElement | null>;
  tools: RefObject<(HTMLElement | null)[]>;
  rings: RefObject<(HTMLElement | null)[]>;
  lines: RefObject<(SVGPathElement | null)[]>;
  pulses: RefObject<(SVGGElement | null)[]>;
  grads: RefObject<(SVGLinearGradientElement | null)[]>;
}

export interface BeamEngineOptions {
  n: number;
  nLeft: number;
  live: boolean;
  reduced: boolean;
  off: RefObject<ReadonlySet<number>>;
  onSyncing: (syncing: boolean) => void;
}

export function useBeamEngine(refs: BeamEngineRefs, { n, nLeft, live, reduced, off, onSyncing }: BeamEngineOptions) {
  useIsoLayoutEffect(() => {
    const root = refs.root.current;
    const svg = refs.svg.current;
    const hub = refs.hub.current;
    if (!root || !svg || !hub) return;
    const reduce = reduced || (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const lines = refs.lines.current;
    const pulses = refs.pulses.current;
    const grads = refs.grads.current;
    const toolEls = refs.tools.current;

    let shown: Curve[] = [];
    let from: Curve[] = [];
    let to: Curve[] = [];
    let morphStart = 0;
    let lastPos: Point[] | null = null;
    let lastStack: boolean | null = null;
    const lengths: number[] = [];
    const flips: Animation[] = [];

    const centerOf = (el: HTMLElement): Point => {
      let x = el.offsetWidth / 2;
      let y = el.offsetHeight / 2;
      let e: HTMLElement | null = el;
      while (e && e !== root) {
        x += e.offsetLeft;
        y += e.offsetTop;
        e = e.offsetParent as HTMLElement | null;
      }
      return { x, y };
    };

    const curve = (a: Point, b: Point, stack: boolean): Curve => {
      if (stack) {
        const my = (a.y + b.y) / 2;
        return [a.x, a.y, a.x, my, b.x, my, b.x, b.y];
      }
      const mx = (a.x + b.x) / 2;
      return [a.x, a.y, mx, a.y, mx, b.y, b.x, b.y];
    };

    const draw = (curves: Curve[]) => {
      shown = curves;
      curves.forEach((c, i) => {
        const d = `M${c[0]} ${c[1]}C${c[2]} ${c[3]} ${c[4]} ${c[5]} ${c[6]} ${c[7]}`;
        const line = lines[i];
        if (!line) return;
        line.setAttribute('d', d);
        pulses[i]?.querySelectorAll('path').forEach((p) => p.setAttribute('d', d));
        lengths[i] = line.getTotalLength?.() ?? 0;
      });
    };

    const measure = () => {
      const w = root.clientWidth;
      const h = root.clientHeight;
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      const stack = w > 0 && w < BEAM_STACK_BELOW;
      const els = [...toolEls.slice(0, n), hub];
      if (els.some((el) => !el)) return;
      const pos = els.map((el) => centerOf(el!));
      const c = pos[n]!;
      const target = pos.slice(0, n).map((p, i) => (i < nLeft ? curve(p, c, stack) : curve(c, p, stack)));

      if (lastPos && lastStack !== null && stack !== lastStack && !reduce && typeof hub.animate === 'function') {
        els.forEach((el, i) => {
          const dx = lastPos![i]!.x - pos[i]!.x;
          const dy = lastPos![i]!.y - pos[i]!.y;
          if (dx || dy) flips.push(el!.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: BEAM_MORPH, easing: EASE }));
        });
        from = shown.length === n ? shown : target;
        to = target;
        morphStart = performance.now();
        kick();
      } else if (morphStart) {
        to = target;
      } else {
        draw(target);
      }
      lastPos = pos;
      lastStack = stack;
    };

    const pulseStart: (number | null)[] = Array(n).fill(null);
    let queue: { beam: number; at: number }[] = [];
    let nextCycle = 0;
    let syncFrom = 0;
    let syncTo = 0;
    let wasSyncing = false;
    let raf = 0;

    const hide = (i: number) => {
      pulseStart[i] = null;
      const g = pulses[i];
      if (g) g.style.opacity = '0';
    };

    const ring = (el: HTMLElement | null | undefined) =>
      el?.animate?.(
        [
          { opacity: 0, transform: 'scale(0.96)' },
          { opacity: 1, transform: 'scale(1)', offset: 0.3 },
          { opacity: 0, transform: 'scale(1.14)' },
        ],
        { duration: 760, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
      );

    const planCycle = (now: number) => {
      const skip = off.current;
      const ins = Array.from({ length: nLeft }, (_, i) => i).filter((i) => !skip.has(i));
      const outs = Array.from({ length: n - nLeft }, (_, i) => nLeft + i).filter((i) => !skip.has(i));
      if (!ins.length && !outs.length) {
        nextCycle = now + BEAM_REST;
        return;
      }
      const tOut = ins.length ? now + BEAM_TRAVEL : now;
      queue = [...ins.map((beam, k) => ({ beam, at: now + k * BEAM_STAGGER })), ...outs.map((beam, k) => ({ beam, at: tOut + k * BEAM_STAGGER }))];
      const end = Math.max(...queue.map((q) => q.at)) + BEAM_TRAVEL;
      syncFrom = ins.length ? tOut : now;
      syncTo = end;
      nextCycle = end + BEAM_REST;
    };

    const paint = (i: number, t: number) => {
      const line = lines[i];
      const g = pulses[i];
      const grad = grads[i];
      if (!line || !g || !grad) return;
      const L = lengths[i] || 0;
      const seg = Math.min(84, L * 0.42);
      const head = easeInOut(t) * (L + seg);
      g.querySelectorAll('path').forEach((p) => {
        p.style.strokeDasharray = `${seg} ${L + seg}`;
        p.style.strokeDashoffset = `${seg - head}`;
      });
      const a = line.getPointAtLength(Math.max(0, Math.min(L, head - seg)));
      const b = line.getPointAtLength(Math.max(0, Math.min(L, head)));
      grad.setAttribute('x1', `${a.x}`);
      grad.setAttribute('y1', `${a.y}`);
      grad.setAttribute('x2', `${b.x + (b.x === a.x && b.y === a.y ? 0.01 : 0)}`);
      grad.setAttribute('y2', `${b.y}`);
      g.style.opacity = '1';
    };

    const running = live && !reduce;
    const frame = (now: number) => {
      raf = 0;
      if (morphStart) {
        const t = Math.min(1, (now - morphStart) / BEAM_MORPH);
        const e = easeOut(t);
        draw(to.map((c, i) => c.map((v, k) => (from[i]?.[k] ?? v) + (v - (from[i]?.[k] ?? v)) * e)));
        if (t >= 1) morphStart = 0;
      }
      if (running) {
        if (now >= nextCycle) planCycle(now);
        queue = queue.filter((q) => {
          if (q.at > now) return true;
          if (!off.current.has(q.beam) && pulseStart[q.beam] === null) pulseStart[q.beam] = q.at;
          return false;
        });
        for (let i = 0; i < n; i++) {
          const start = pulseStart[i];
          if (start === null || start === undefined) continue;
          if (off.current.has(i)) {
            hide(i);
            continue;
          }
          const t = (now - start) / BEAM_TRAVEL;
          if (t >= 1) {
            hide(i);
            ring(i < nLeft ? refs.hubRing.current : refs.rings.current[i]);
            continue;
          }
          paint(i, t);
        }
        const isSyncing = now >= syncFrom && now < syncTo;
        if (isSyncing !== wasSyncing) {
          wasSyncing = isSyncing;
          onSyncing(isSyncing);
        }
      }
      if (morphStart || running) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    measure();
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    ro?.observe(root);
    if (running) {
      nextCycle = performance.now() + 400;
      kick();
    }

    return () => {
      ro?.disconnect();
      cancelAnimationFrame(raf);
      flips.forEach((a) => a.cancel());
      for (let i = 0; i < n; i++) hide(i);
      if (wasSyncing) onSyncing(false);
    };
  }, [n, nLeft, live, reduced]);
}
