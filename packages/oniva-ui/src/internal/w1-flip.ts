import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { prefersReducedMotion } from './motion-hooks';

/**
 * FLIP glide for children marked `data-flip-id` inside `root`. Runs after every render:
 * elements whose box moved since the last render animate from their old position (transform only).
 * No-op under prefers-reduced-motion and in environments without layout (jsdom).
 */
export function useFlip(root: RefObject<HTMLElement | null>, duration = 280, stagger = 0) {
  const prev = useRef(new Map<string, DOMRect>());
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const next = new Map<string, DOMRect>();
    const reduce = prefersReducedMotion();
    let moved = 0;
    el.querySelectorAll<HTMLElement>('[data-flip-id]').forEach((n) => {
      const id = n.dataset.flipId!;
      const r = n.getBoundingClientRect();
      next.set(id, r);
      const p = prev.current.get(id);
      if (!p || reduce || typeof n.animate !== 'function') return;
      const dx = p.left - r.left;
      const dy = p.top - r.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      n.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], {
        duration,
        delay: Math.min(moved++, 8) * stagger,
        easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
        fill: 'backwards',
      });
    });
    prev.current = next;
  });
}

/* ------------------------------------------------------------------ */
/* Motion pass (loop 7 wave 3): springs, live clock, flying ghosts     */
/* ------------------------------------------------------------------ */

export interface SpringPt {
  x: number;
  y: number;
}

/**
 * Glides a set of points to their targets on a spring (one requestAnimationFrame loop that sleeps once everything
 * has settled). New ids start at `spawn(id)` (e.g. the node they are linked to) and slide out from there.
 * Under prefers-reduced-motion or without rAF the targets are returned as they are.
 */
export function useSpringMap(
  target: Map<string, SpringPt>,
  spawn?: (id: string) => SpringPt | undefined,
  opts: { stiffness?: number; damping?: number } = {},
): Map<string, SpringPt> {
  const { stiffness = 170, damping = 21 } = opts;
  const [disp, setDisp] = useState<Map<string, SpringPt>>(() => new Map(target));
  const st = useRef(new Map<string, { x: number; y: number; vx: number; vy: number }>());
  const raf = useRef(0);
  const goal = useRef(target);
  const spawnRef = useRef(spawn);
  spawnRef.current = spawn;
  const key = [...target].map(([id, p]) => `${id}:${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('|');
  goal.current = target;

  useLayoutEffect(() => {
    goal.current = target;
    const s = st.current;
    const canAnimate = !prefersReducedMotion() && typeof requestAnimationFrame === 'function';
    for (const id of [...s.keys()]) if (!target.has(id)) s.delete(id);
    const first = s.size === 0;
    target.forEach((p, id) => {
      if (s.has(id)) return;
      const from = canAnimate && !first ? (spawnRef.current?.(id) ?? p) : p;
      s.set(id, { x: from.x, y: from.y, vx: 0, vy: 0 });
    });
    if (!canAnimate) {
      s.forEach((v, id) => {
        const p = target.get(id)!;
        v.x = p.x;
        v.y = p.y;
        v.vx = 0;
        v.vy = 0;
      });
      setDisp(new Map(target));
      return;
    }
    const snapshot = () => new Map([...s].map(([id, v]) => [id, { x: v.x, y: v.y }] as const));
    setDisp(snapshot());
    if (raf.current) return;
    let last = performance.now();
    const tick = (ts: number) => {
      const dt = Math.min(0.032, Math.max(0.001, (ts - last) / 1000));
      last = ts;
      let moving = false;
      s.forEach((v, id) => {
        const p = goal.current.get(id);
        if (!p) return;
        v.vx += (-stiffness * (v.x - p.x) - damping * v.vx) * dt;
        v.vy += (-stiffness * (v.y - p.y) - damping * v.vy) * dt;
        v.x += v.vx * dt;
        v.y += v.vy * dt;
        if (Math.abs(v.x - p.x) < 0.15 && Math.abs(v.y - p.y) < 0.15 && Math.abs(v.vx) < 1 && Math.abs(v.vy) < 1) {
          v.x = p.x;
          v.y = p.y;
          v.vx = 0;
          v.vy = 0;
        } else moving = true;
      });
      setDisp(snapshot());
      raf.current = moving ? requestAnimationFrame(tick) : 0;
    };
    raf.current = requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, stiffness, damping]);

  useLayoutEffect(
    () => () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = 0;
    },
    [],
  );
  return disp;
}

/**
 * A clock that moves smoothly. Uncontrolled: follows Date.now every animation frame (throttled to ~20 fps, asleep in
 * hidden tabs). Controlled: glides from the last shown value to the new `now` instead of jumping. Reduced motion or no
 * rAF: ticks once a second / follows `now` as it is.
 */
export function useLiveNow(now: number | undefined, enabled = true): number {
  const [t, setT] = useState(() => now ?? Date.now());
  const shown = useRef(t);
  useEffect(() => {
    if (!enabled && now === undefined) return;
    const canAnimate = !prefersReducedMotion() && typeof requestAnimationFrame === 'function';
    const put = (v: number) => {
      shown.current = v;
      setT(v);
    };
    if (!canAnimate) {
      if (now !== undefined) {
        put(now);
        return;
      }
      put(Date.now());
      const id = window.setInterval(() => put(Date.now()), 1000);
      return () => window.clearInterval(id);
    }
    let raf = 0;
    if (now !== undefined) {
      const from = shown.current;
      if (from === now) return;
      const jump = Math.abs(now - from);
      const dur = jump > 5000 ? 600 : 1000;
      const start = performance.now();
      const step = (ts: number) => {
        const k = Math.min(1, (ts - start) / dur);
        const e = jump > 5000 ? 1 - Math.pow(1 - k, 3) : k;
        put(from + (now - from) * e);
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    } else {
      let last = 0;
      const step = (ts: number) => {
        if (ts - last >= 50) {
          last = ts;
          put(Date.now());
        }
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(raf);
  }, [now, enabled]);
  return t;
}

/**
 * Flies a short-lived copy of an element from `from` to `to` (both viewport rects) inside a positioned `root`.
 * `shake` plays a quick sideways shake first (failures). Transform and opacity only; removed when done.
 */
export function flyGhost(
  root: HTMLElement,
  o: { from: DOMRect; to: DOMRect; text: string; background: string; color: string; shake?: boolean },
): void {
  if (prefersReducedMotion() || typeof root.animate !== 'function') return;
  const rr = root.getBoundingClientRect();
  const g = document.createElement('div');
  g.setAttribute('aria-hidden', 'true');
  Object.assign(g.style, {
    position: 'absolute',
    left: `${o.from.left - rr.left}px`,
    top: `${o.from.top - rr.top}px`,
    width: `${o.from.width}px`,
    height: `${o.from.height}px`,
    background: o.background,
    color: o.color,
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    paddingInline: '8px',
    fontSize: '12px',
    pointerEvents: 'none',
    zIndex: '6',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    willChange: 'transform, opacity',
  });
  g.textContent = o.text;
  root.appendChild(g);
  const dx = o.to.left + o.to.width / 2 - (o.from.left + o.from.width / 2);
  const dy = o.to.top + o.to.height / 2 - (o.from.top + o.from.height / 2);
  const end = { transform: `translate(${dx}px, ${dy}px) scale(0.5)`, opacity: 0 };
  const frames: Keyframe[] = o.shake
    ? [
        { transform: 'translateX(0)', opacity: 1, offset: 0 },
        { transform: 'translateX(-4px)', opacity: 1, offset: 0.08 },
        { transform: 'translateX(4px)', opacity: 1, offset: 0.16 },
        { transform: 'translateX(-3px)', opacity: 1, offset: 0.24 },
        { transform: 'translateX(2px)', opacity: 1, offset: 0.32 },
        { transform: 'translateX(0)', opacity: 1, offset: 0.4 },
        { ...end, offset: 1 },
      ]
    : [{ transform: 'translate(0, 0) scale(1)', opacity: 1, offset: 0 }, { transform: 'translate(0, 0) scale(1)', opacity: 1, offset: 0.2 }, { ...end, offset: 1 }];
  const a = g.animate(frames, { duration: o.shake ? 900 : 650, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'forwards' });
  const done = () => g.remove();
  a.onfinish = done;
  a.oncancel = done;
}
