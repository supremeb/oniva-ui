import { useLayoutEffect, useRef } from 'react';
import type { HTMLAttributes, ReactNode, Ref, RefObject } from 'react';
import { mergeRefs } from '../../internal/n3-hooks';
import { prefersReducedMotion } from '../../internal/motion-hooks';

const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

export interface UseLayoutGlideOptions {
  /** Glide length in ms. Default 280. */
  duration?: number;
  /** Fade + rise in items that were not there on the previous render (filters, search, new rows). Default `true`. */
  enter?: boolean;
}

/**
 * FLIP for lists: children marked `data-glide-id="..."` inside `root` glide (transform only) from their old box to
 * their new one after every render; items that newly appear fade and rise in. The very first render and reduced motion
 * are no-ops, as are environments without layout (jsdom has no `animate`).
 */
export function useLayoutGlide(root: RefObject<HTMLElement | null>, { duration = 280, enter = true }: UseLayoutGlideOptions = {}) {
  const prev = useRef<Map<string, DOMRect> | null>(null);
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const next = new Map<string, DOMRect>();
    const reduce = prefersReducedMotion();
    el.querySelectorAll<HTMLElement>('[data-glide-id]').forEach((n) => {
      const id = n.dataset.glideId!;
      const r = n.getBoundingClientRect();
      next.set(id, r);
      const p = prev.current?.get(id);
      if (!prev.current || reduce || typeof n.animate !== 'function') return;
      if (!p) {
        if (enter) n.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: Math.min(duration, 220), easing: EASE });
        return;
      }
      const dx = p.left - r.left;
      const dy = p.top - r.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      n.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration, easing: EASE });
    });
    prev.current = next;
  });
}

export interface LayoutGlideProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, UseLayoutGlideOptions {
  /** Children carrying `data-glide-id` glide when their position changes. */
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/** Wrapper around `useLayoutGlide`: a plain `div` whose `data-glide-id` descendants glide to their new place. */
export function LayoutGlide({ duration, enter, ref, children, ...rest }: LayoutGlideProps) {
  const inner = useRef<HTMLDivElement | null>(null);
  useLayoutGlide(inner, { duration, enter });
  return (
    <div {...rest} ref={mergeRefs(inner, ref)}>
      {children}
    </div>
  );
}
