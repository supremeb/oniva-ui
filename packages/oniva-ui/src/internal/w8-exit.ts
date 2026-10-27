import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from './motion-hooks';

export interface Retained<T> {
  item: T;
  /** True while a removed item plays its exit; it is dropped from the list afterwards. */
  exiting: boolean;
}

/**
 * Keeps removed items in the list for `exitMs` flagged `exiting` so they can fold away instead of vanishing.
 * Live items keep their incoming order; exiting ones are appended. Skips the delay under reduced motion.
 */
export function useRetained<T>(items: T[], idOf: (t: T) => string, exitMs = 220): Retained<T>[] {
  const [gone, setGone] = useState<Map<string, T>>(new Map());
  const last = useRef<Map<string, T>>(new Map());
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const key = items.map(idOf).join('\u0000');
  useEffect(() => {
    const now = new Map(items.map((i) => [idOf(i), i]));
    const removed: [string, T][] = [];
    last.current.forEach((v, k) => {
      if (!now.has(k)) removed.push([k, v]);
    });
    last.current = now;
    now.forEach((_, k) => {
      const t = timers.current.get(k);
      if (t) clearTimeout(t);
      timers.current.delete(k);
    });
    setGone((g) => {
      const next = new Map(g);
      now.forEach((_, k) => next.delete(k));
      if (!prefersReducedMotion()) removed.forEach(([k, v]) => next.set(k, v));
      return next.size === g.size && removed.length === 0 && [...g.keys()].every((k) => next.has(k)) ? g : next;
    });
    if (!prefersReducedMotion()) {
      removed.forEach(([k]) => {
        timers.current.set(
          k,
          setTimeout(() => {
            timers.current.delete(k);
            setGone((g) => {
              const next = new Map(g);
              next.delete(k);
              return next;
            });
          }, exitMs),
        );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-run only when the id set changes
  }, [key, exitMs]);
  useEffect(() => {
    const t = timers.current;
    return () => t.forEach((x) => clearTimeout(x));
  }, []);
  const live = new Set(items.map(idOf));
  return [
    ...items.map((item) => ({ item, exiting: false })),
    ...[...gone].filter(([k]) => !live.has(k)).map(([, item]) => ({ item, exiting: true })),
  ];
}
