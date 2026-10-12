import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChartDatum, ValueFormat } from './charts-math';
import { useReducedMotion } from './motion-hooks';

/** Delay (ms) for item `i` of `n`: steps of <=40ms and the whole stagger capped at 300ms (enter anim <=400ms + 300 stays snappy). */
export function staggerDelay(i: number, n: number, step = 40, cap = 300): number {
  return Math.round(i * Math.min(step, cap / Math.max(1, n)));
}

/** True when IntersectionObserver exists, i.e. entrance animations can be gated on first in-view (false in SSR/jsdom). */
export const canObserve = () => typeof IntersectionObserver !== 'undefined';

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

/**
 * rAF lerp of a number array toward `target` (ease-out-quart). Interruptible: a new target starts from the
 * current on-screen value. With `fromZero` the first run sweeps up from 0 (entrance), gated on `active`.
 * Snaps under reduced motion or when the array length changes.
 */
export function useTween(
  target: number[],
  {
    duration = 450,
    fromZero = false,
    active = true,
  }: { duration?: number; fromZero?: boolean; active?: boolean } = {},
): number[] {
  const reduced = useReducedMotion();
  const [vals, setVals] = useState<number[]>(() => (fromZero ? target.map(() => 0) : target));
  const cur = useRef(vals);
  useEffect(() => {
    cur.current = vals;
  });
  const key = target.join(',');
  useEffect(() => {
    if (!active) return;
    const to = key === '' ? [] : key.split(',').map(Number);
    const from = cur.current.length === to.length ? cur.current : to;
    if (reduced || from.every((v, i) => v === to[i])) {
      setVals(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const e = easeOutQuart(p);
      setVals(from.map((f, i) => f + (to[i]! - f) * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [key, active, reduced, duration]);
  return vals;
}

/** Tweens the numeric `keys` of every row so cartesian charts morph smoothly when data changes (no entrance sweep). */
export function useTweenedData(data: ChartDatum[], keys: string[], duration = 400): ChartDatum[] {
  const flat = useMemo(() => data.flatMap((d) => keys.map((k) => Number(d[k]) || 0)), [data, keys]);
  const t = useTween(flat, { duration });
  return useMemo(() => {
    if (t.length !== flat.length) return data;
    return data.map((d, r) => {
      const o: ChartDatum = { ...d };
      keys.forEach((k, c) => {
        o[k] = t[r * keys.length + c]!;
      });
      return o;
    });
  }, [t, flat.length, data, keys]);
}

/** Maps a chart `ValueFormat` to Intl options for AnimatedNumber; `null` for custom formatter functions. */
export function intlOptionsFor(format: ValueFormat = 'number'): Intl.NumberFormatOptions | null {
  if (typeof format === 'function') return null;
  switch (format) {
    case 'compact':
      return { notation: 'compact', maximumFractionDigits: 1 };
    case 'currency':
      return { style: 'currency', currency: 'USD', maximumFractionDigits: 0 };
    case 'percent':
      return { style: 'unit', unit: 'percent', maximumFractionDigits: 0 };
    default:
      return { maximumFractionDigits: 1 };
  }
}
