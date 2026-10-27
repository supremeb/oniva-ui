import * as stylex from '@stylexjs/stylex';
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { prefersReducedMotion } from './motion-hooks';
import { media } from '../tokens/media.stylex';
import { motion } from '../tokens/motion.stylex';

/**
 * Screen-level motion presets (loop 7, worker m8). Everything here is CSS keyframes on opacity/transform/filter(blur<=4px);
 * reduced motion removes the animation (travel tokens also collapse to 0, durations to ~0).
 */
const rise = stylex.keyframes({
  from: { opacity: 0, transform: `translateY(${motion['--oniva-motion-travel']})` },
  to: { opacity: 1, transform: 'translateY(0)' },
});
const view = stylex.keyframes({
  from: {
    filter: 'blur(2px)',
    opacity: 0,
    transform: `translateY(${motion['--oniva-motion-travel']})`,
  },
  to: { filter: 'blur(0)', opacity: 1, transform: 'translateY(0)' },
});
const fade = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const pop = stylex.keyframes({
  from: { opacity: 0, transform: `scale(${motion['--oniva-motion-pop-scale']}) translateY(4px)` },
  to: { opacity: 1, transform: 'scale(1) translateY(0)' },
});
const slideX = stylex.keyframes({
  from: { opacity: 0, transform: 'translateX(var(--oniva-m8-dir, 24px))' },
  to: { opacity: 1, transform: 'translateX(0)' },
});
const grow = stylex.keyframes({ from: { transform: 'scaleX(0)' }, to: { transform: 'scaleX(1)' } });
const leave = stylex.keyframes({
  from: { opacity: 1, transform: 'scale(1)' },
  to: { opacity: 0, transform: 'scale(0.98)' },
});
const pulse = stylex.keyframes({ '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.45 } });

export const m8 = stylex.create({
  /** List/grid entry: rise + fade, delayed by `--oniva-i` steps (cap in JS via `step`). */
  rise: {
    animationDelay: `calc(var(--oniva-i, 0) * ${motion['--oniva-motion-stagger']})`,
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: rise, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  /** Keyed view/tab swap: new content sharpens in from a 2px blur with a small rise. */
  view: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationFillMode: 'backwards',
    animationName: { default: view, [media.reducedMotion]: fade },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  fade: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: fade, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  pop: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationFillMode: 'backwards',
    animationName: { default: pop, [media.reducedMotion]: fade },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  /** Horizontal step slide: `--oniva-m8-dir` is +24px (forward) or -24px (back). */
  slideX: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: slideX, [media.reducedMotion]: fade },
    animationTimingFunction: motion['--oniva-motion-ease-out-expo'],
  },
  /** Fill bars: scaleX from the inline start, never width. */
  grow: {
    animationDuration: motion['--oniva-motion-dur-slower'],
    animationFillMode: 'backwards',
    animationName: { default: grow, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out-expo'],
    transformOrigin: 'left center',
  },
  /** Live items breathe subtly; frozen under reduced motion. */
  pulse: {
    animationDuration: '1800ms',
    animationIterationCount: 'infinite',
    animationName: { default: pulse, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
  },
  /** Filtered-out item: fades + scales to 0.98 in place before it unmounts (see `useExitList`). */
  exit: {
    animationDuration: motion['--oniva-motion-dur-base'],
    animationFillMode: 'forwards',
    animationName: { default: leave, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    pointerEvents: 'none',
  },
  contents: { display: 'contents' },
});

/** Inline custom property for staggered entry: `style={step(i)}`; delays stop growing after `max` steps. */
export const step = (i: number, max = 6) => ({ '--oniva-i': Math.min(i, max) }) as CSSProperties;

export interface ExitRow<T> {
  item: T;
  /** True while a removed item plays its exit in its old slot. */
  exiting: boolean;
}

/**
 * Like a plain list, but items that leave (filter/search) stay mounted in their old slot for `ms`
 * flagged `exiting` so they can fade out (`m8.exit`) before unmounting. Skipped under reduced motion.
 */
export function useExitList<T>(items: T[], idOf: (t: T) => string, ms = 160): ExitRow<T>[] {
  const [rows, setRows] = useState<ExitRow<T>[]>(() =>
    items.map((item) => ({ item, exiting: false })),
  );
  const rowsRef = useRef(rows);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const key = items.map(idOf).join('\u0000');
  useLayoutEffect(() => {
    const next = new Set(items.map(idOf));
    const prev = rowsRef.current;
    const out: ExitRow<T>[] = items.map((item) => ({ item, exiting: false }));
    if (!prefersReducedMotion()) {
      let anchor = -1;
      for (const r of prev) {
        const id = idOf(r.item);
        if (next.has(id)) {
          anchor = out.findIndex((o) => !o.exiting && idOf(o.item) === id);
        } else {
          out.splice(anchor + 1, 0, { item: r.item, exiting: true });
          anchor += 1;
          if (!timers.current.has(id)) {
            timers.current.set(
              id,
              setTimeout(() => {
                timers.current.delete(id);
                setRows((cur) => {
                  const kept = cur.filter((c) => !(c.exiting && idOf(c.item) === id));
                  rowsRef.current = kept;
                  return kept;
                });
              }, ms),
            );
          }
        }
      }
    }
    next.forEach((id) => {
      const t = timers.current.get(id);
      if (t) {
        clearTimeout(t);
        timers.current.delete(id);
      }
    });
    rowsRef.current = out;
    setRows(out);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-run only when the id set changes
  }, [key, ms]);
  useLayoutEffect(() => {
    const t = timers.current;
    return () => t.forEach((x) => clearTimeout(x));
  }, []);
  return rows;
}
