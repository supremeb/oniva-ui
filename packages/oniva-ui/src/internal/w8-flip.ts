import { useLayoutEffect, useRef, type RefObject } from 'react';
import { prefersReducedMotion } from './motion-hooks';

/**
 * FLIP for children marked `data-flip-id` inside `root` (pattern of w1-flip, with a gentle spring-like settle).
 * Boxes are measured after every render; moved elements animate from their old offset to rest using transform only.
 * Offsets are read relative to the scroller (`root`) so horizontal scroll of the board does not read as movement.
 * No-op under reduced motion and where layout does not exist (jsdom).
 */
export function useBoardFlip(root: RefObject<HTMLElement | null>, duration = 300) {
  const prev = useRef(new Map<string, { x: number; y: number }>());
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const base = el.getBoundingClientRect();
    const next = new Map<string, { x: number; y: number }>();
    const reduce = prefersReducedMotion();
    el.querySelectorAll<HTMLElement>('[data-flip-id]').forEach((n) => {
      const id = n.dataset.flipId!;
      const r = n.getBoundingClientRect();
      const pos = { x: r.left - base.left, y: r.top - base.top };
      next.set(id, pos);
      const p = prev.current.get(id);
      if (!p || reduce || typeof n.animate !== 'function') return;
      const dx = p.x - pos.x;
      const dy = p.y - pos.y;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      n.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], {
        duration,
        easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
      });
    });
    prev.current = next;
  });
}
