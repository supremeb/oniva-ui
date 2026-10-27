import { useLayoutEffect, useRef, type RefObject } from 'react';
import { prefersReducedMotion } from './motion-hooks';

/**
 * FLIP glide for `[data-flip-id]` children (transform only). Pattern copied from w1-flip, plus a `resetKey`:
 * when it changes (tab/filter switch that remounts rows) positions are re-measured without animating.
 * No-op under reduced motion and where WAAPI/layout is missing (jsdom).
 */
export function useFlipKeyed(root: RefObject<HTMLElement | null>, resetKey: unknown, duration = 280) {
  const prev = useRef(new Map<string, DOMRect>());
  const lastKey = useRef(resetKey);
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const skip = lastKey.current !== resetKey;
    lastKey.current = resetKey;
    const reduce = prefersReducedMotion();
    const next = new Map<string, DOMRect>();
    el.querySelectorAll<HTMLElement>('[data-flip-id]').forEach((n) => {
      const id = n.dataset.flipId!;
      const r = n.getBoundingClientRect();
      next.set(id, r);
      const p = prev.current.get(id);
      if (!p || skip || reduce || typeof n.animate !== 'function') return;
      const dx = p.left - r.left;
      const dy = p.top - r.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      n.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], {
        duration,
        easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
      });
    });
    prev.current = next;
  });
}
