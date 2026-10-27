import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { prefersReducedMotion } from './motion-hooks';

const EASE = 'cubic-bezier(0.77, 0, 0.175, 1)';
const ENTER = 'cubic-bezier(0.23, 1, 0.32, 1)';

/**
 * FLIP for absolutely-positioned boxes (position + size change) marked `data-flip-id`.
 * The box glides with transform only (translate + scale, origin 0 0); its first child gets the inverse scale
 * so labels never distort. New ids fade/scale in from 0.96. Measures offset* (unaffected by running transforms).
 * No-op under reduced motion and in jsdom.
 */
export function useRectFlip(root: RefObject<HTMLElement | null>, duration = 250) {
  const prev = useRef(new Map<string, { x: number; y: number; w: number; h: number }>());
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const next = new Map<string, { x: number; y: number; w: number; h: number }>();
    const reduce = prefersReducedMotion();
    const first = prev.current.size === 0;
    el.querySelectorAll<HTMLElement>('[data-flip-id]').forEach((n) => {
      const id = n.dataset.flipId!;
      const r = { x: n.offsetLeft, y: n.offsetTop, w: n.offsetWidth, h: n.offsetHeight };
      next.set(id, r);
      if (reduce || first || typeof n.animate !== 'function' || r.w === 0) return;
      const p = prev.current.get(id);
      const inner = n.firstElementChild as HTMLElement | null;
      if (!p) {
        if (n.hasAttribute('data-flip-noenter')) return;
        n.animate([{ opacity: 0, transform: 'scale(0.96)' }, { opacity: 1, transform: 'none' }], { duration: 200, easing: ENTER });
        return;
      }
      const dx = p.x - r.x;
      const dy = p.y - r.y;
      const sx = p.w / r.w;
      const sy = p.h / r.h;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(sx - 1) < 0.005 && Math.abs(sy - 1) < 0.005) return;
      const opts = { duration, easing: EASE };
      n.animate([{ transformOrigin: '0 0', transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` }, { transformOrigin: '0 0', transform: 'none' }], opts);
      inner?.animate([{ transformOrigin: '0 0', transform: `scale(${1 / sx}, ${1 / sy})` }, { transformOrigin: '0 0', transform: 'none' }], opts);
    });
    prev.current = next;
  });
}

/* ------------------------------------------------------------------ */
/* Motion pass round 2 (R3): list FLIP that can skip a render, folding  */
/* ghosts for removed rows, mount-with-fold for optional rows           */
/* ------------------------------------------------------------------ */

const canAnimateNow = () => !prefersReducedMotion() && typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function';

/**
 * Like `useFlip` (children marked `data-flip-id` glide from their old box with transform only) but a render can opt
 * out: set `skip.current = true` before the render in which rows only *finished* a layout change that already played
 * (e.g. a folded row was unmounted), so nothing glides back.
 */
export function useListFlip(root: RefObject<HTMLElement | null>, skip: { current: boolean }, duration = 280) {
  const prev = useRef(new Map<string, DOMRect>());
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const next = new Map<string, DOMRect>();
    const reduce = prefersReducedMotion();
    const skipped = skip.current;
    skip.current = false;
    el.querySelectorAll<HTMLElement>('[data-flip-id]').forEach((n) => {
      const id = n.dataset.flipId!;
      const r = n.getBoundingClientRect();
      next.set(id, r);
      const p = prev.current.get(id);
      if (!p || reduce || skipped || typeof n.animate !== 'function') return;
      const dx = p.left - r.left;
      const dy = p.top - r.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      n.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'backwards' });
    });
    prev.current = next;
  });
}

export interface FoldEntry<T> {
  item: T;
  /** Removed from the source list; folding away, unmounted after `ms`. */
  gone: boolean;
}

/**
 * Keeps removed items rendered (gone = true) for `ms` so they can fold away before they leave; new items append.
 * `onSettle` runs when the ghosts are dropped. Without animation support removal is immediate.
 */
export function useFoldingList<T extends { id: string }>(items: T[], ms = 300, onSettle?: () => void): Array<FoldEntry<T>> {
  const [list, setList] = useState<Array<FoldEntry<T>>>(() => items.map((item) => ({ item, gone: false })));
  const key = items.map((i) => i.id).join('|');
  const settle = useRef(onSettle);
  settle.current = onSettle;
  useLayoutEffect(() => {
    const animate = canAnimateNow();
    setList((prev) => {
      const out: Array<FoldEntry<T>> = items.map((item) => ({ item, gone: false }));
      if (!animate) return out;
      // Ghosts (removed or still folding) keep their old slot: right after the nearest earlier row that is still live.
      prev.forEach((e, pi) => {
        if (items.some((i) => i.id === e.item.id)) return;
        let at = 0;
        for (let k = pi - 1; k >= 0; k--) {
          const at2 = out.findIndex((o) => !o.gone && o.item.id === prev[k]!.item.id);
          if (at2 >= 0) {
            at = at2 + 1;
            break;
          }
        }
        while (at < out.length && out[at]!.gone) at++;
        out.splice(at, 0, { item: e.item, gone: true });
      });
      return out;
    });
    if (!animate) return;
    const t = window.setTimeout(() => {
      setList((l) => (l.some((e) => e.gone) ? l.filter((e) => !e.gone) : l));
      settle.current?.();
    }, ms);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  // Always show the live item objects (status, titles) – the list state only decides which ids stay and which fold.
  return list.map((e) => (e.gone ? e : { item: items.find((i) => i.id === e.item.id) ?? e.item, gone: false }));
}

/** `mounted` stays true while a closing row folds (ms); `shown` flips a frame after mount so opening animates. */
export function useFoldMount(open: boolean, ms = 300) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(open);
  useEffect(() => {
    if (open) {
      setMounted(true);
      if (!canAnimateNow()) return setShown(true);
      const raf = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(raf);
    }
    setShown(false);
    if (!canAnimateNow()) return setMounted(false);
    const t = window.setTimeout(() => setMounted(false), ms);
    return () => window.clearTimeout(t);
  }, [open, ms]);
  return { mounted: mounted || open, shown: open && (shown || !canAnimateNow()) };
}
