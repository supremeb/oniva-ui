import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { prefersReducedMotion } from './motion-hooks';

const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

export interface GlideOptions {
  duration?: number;
  stagger?: number;
  /** Moved elements also start a little larger and settle (drop). */
  lift?: number;
  /** Elements marked `data-glide-enter` that did not exist last render rise in (transform + opacity). */
  enter?: boolean;
  /** Colour (CSS) a moved `data-glide-land` element flashes after it landed; a new `data-glide-flash` element flashes at once. */
  flash?: string;
}

/**
 * FLIP glide (transform only) for `[data-flip-id]` children, with optional drop-settle scale, enter rise for new ids and
 * a soft landing flash. Runs after every render, no-ops under prefers-reduced-motion and without layout (jsdom).
 * Elements that moved between parents are matched by id, so a chip handed to another lane glides there.
 */
export function useGlide(root: RefObject<HTMLElement | null>, o: GlideOptions = {}) {
  const { duration = 300, stagger = 0, lift = 0, enter = false, flash } = o;
  const prev = useRef<Map<string, DOMRect> | null>(null);
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const next = new Map<string, DOMRect>();
    const reduce = prefersReducedMotion();
    const first = prev.current === null;
    let moved = 0;
    el.querySelectorAll<HTMLElement>('[data-flip-id]').forEach((n) => {
      const id = n.dataset.flipId!;
      const r = n.getBoundingClientRect();
      next.set(id, r);
      if (reduce || typeof n.animate !== 'function' || first) return;
      const p = prev.current!.get(id);
      if (!p) {
        if (enter && n.hasAttribute('data-glide-enter')) {
          n.animate([{ opacity: 0, transform: 'translateY(6px) scale(0.96)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: EASE, fill: 'backwards' });
        }
        if (flash && n.hasAttribute('data-glide-flash')) n.animate([{ backgroundColor: flash }, { backgroundColor: 'transparent' }], { duration: 900, easing: 'ease-out' });
        return;
      }
      const dx = p.left - r.left;
      const dy = p.top - r.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      const delay = Math.min(moved++, 8) * stagger;
      const from = `translate(${dx}px, ${dy}px)${lift ? ` scale(${1 + lift})` : ''}`;
      const a = n.animate([{ transform: from }, { transform: 'none' }], { duration, delay, easing: EASE, fill: 'backwards' });
      if (flash && n.hasAttribute('data-glide-land')) {
        a.finished
          .then(() => {
            if (n.isConnected) n.animate([{ backgroundColor: flash }, { backgroundColor: 'transparent' }], { duration: 900, easing: 'ease-out' });
          })
          .catch(() => undefined);
      }
    });
    prev.current = next;
  });
}

export interface Leaving<T> {
  item: T;
  leaving: boolean;
}

/**
 * Keeps removed items rendered for `ms` (flagged `leaving`) so they can fade out where they were.
 * Ids in `exclude` (e.g. items that moved elsewhere) are not kept. Instant under reduced motion.
 */
export function useLeaving<T extends { id: string }>(items: T[], ms = 150, exclude?: Set<string>): Leaving<T>[] {
  const [gone, setGone] = useState<{ item: T; index: number }[]>([]);
  const prev = useRef<T[] | null>(null);
  const timers = useRef(new Set<number>());
  useLayoutEffect(() => {
    const before = prev.current;
    prev.current = items;
    if (!before || prefersReducedMotion()) return;
    const ids = new Set(items.map((i) => i.id));
    const removed = before.map((item, index) => ({ item, index })).filter((r) => !ids.has(r.item.id) && !exclude?.has(r.item.id));
    if (!removed.length) return;
    setGone((g) => [...g.filter((x) => !removed.some((r) => r.item.id === x.item.id)), ...removed]);
    const t = window.setTimeout(() => {
      timers.current.delete(t);
      setGone((g) => g.filter((x) => !removed.some((r) => r.item.id === x.item.id)));
    }, ms);
    timers.current.add(t);
  }, [items, ms, exclude]);
  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current.clear();
    },
    [],
  );
  const ids = new Set(items.map((i) => i.id));
  const out: Leaving<T>[] = items.map((item) => ({ item, leaving: false }));
  [...gone]
    .filter((g) => !ids.has(g.item.id))
    .sort((a, b) => a.index - b.index)
    .forEach((g) => out.splice(Math.min(g.index, out.length), 0, { item: g.item, leaving: true }));
  return out;
}

/**
 * Eases a number toward its target on an exponential curve (one rAF loop that sleeps when settled).
 * Returns the target as it is under prefers-reduced-motion or without rAF.
 */
export function useEase(target: number, rate = 9): number {
  const [v, setV] = useState(target);
  const cur = useRef(target);
  useEffect(() => {
    if (prefersReducedMotion() || typeof requestAnimationFrame !== 'function') {
      cur.current = target;
      setV(target);
      return;
    }
    let raf = 0;
    let last = performance.now();
    const tick = (ts: number) => {
      const dt = Math.min(0.05, (ts - last) / 1000);
      last = ts;
      cur.current += (target - cur.current) * (1 - Math.exp(-rate * dt));
      if (Math.abs(target - cur.current) < 0.002) cur.current = target;
      setV(cur.current);
      if (cur.current !== target) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, rate]);
  return v;
}
