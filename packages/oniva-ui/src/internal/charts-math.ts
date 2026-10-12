import { scaleLinear } from 'd3-scale';
import {
  curveBasis,
  curveLinear,
  curveMonotoneX,
  curveNatural,
  curveStep,
  type CurveFactory,
} from 'd3-shape';
import { useEffect, useRef, useState, type Ref, type RefObject } from 'react';

export type CurveType = 'linear' | 'monotone' | 'natural' | 'step' | 'basis';
const curves: Record<CurveType, CurveFactory> = {
  linear: curveLinear,
  monotone: curveMonotoneX,
  natural: curveNatural,
  step: curveStep,
  basis: curveBasis,
};
export const curveFor = (c: CurveType = 'monotone'): CurveFactory => curves[c];

/** Series definition shared by cartesian charts. `tone` is a 1-based palette index (chart1..chart10). */
export interface ChartSeries {
  key: string;
  label?: string;
  tone?: number;
}
export type ChartDatum = Record<string, string | number>;

export function seriesTone(s: ChartSeries, i: number): number {
  return s.tone ?? i + 1;
}

export type ValueFormat = 'number' | 'compact' | 'currency' | 'percent' | ((n: number) => string);
export function makeFormatter(format: ValueFormat = 'number', locale = 'en-US'): (n: number) => string {
  if (typeof format === 'function') return format;
  const f = {
    number: new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }),
    compact: new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }),
    currency: new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }),
    percent: new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }),
  }[format];
  return (n) => (format === 'percent' ? `${f.format(n)}%` : f.format(n));
}
/** Compact formatter for axis ticks ($12K, 1.2M). */
export function makeAxisFormatter(format: ValueFormat = 'number', locale = 'en-US'): (n: number) => string {
  if (typeof format === 'function') return format;
  if (format === 'currency') {
    const f = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    });
    return (n) => f.format(n);
  }
  if (format === 'number') return makeFormatter('compact', locale);
  return makeFormatter(format, locale);
}

/** Nice axis ticks from 0 (or `min`) to a rounded max. */
export function niceTicks(
  max: number,
  count = 4,
  min = 0,
): { ticks: number[]; domain: [number, number] } {
  const s = scaleLinear()
    .domain([min, max <= min ? min + 1 : max])
    .nice(count);
  return { ticks: s.ticks(count), domain: s.domain() as [number, number] };
}

export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const r of refs) {
      if (typeof r === 'function') r(node);
      else if (r) (r as { current: T | null }).current = node;
    }
  };
}

/** Observes an element's content-box width. Falls back to `fallback` until measured (SSR / jsdom). */
export function useChartDimensions(ref: RefObject<HTMLElement | null>, fallback = 480): number {
  const [width, setWidth] = useState(fallback);
  const last = useRef(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = (w: number) => {
      const next = Math.round(w);
      if (next > 0 && next !== last.current) {
        last.current = next;
        setWidth(next);
      }
    };
    measure(el.getBoundingClientRect().width);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) measure(e.contentRect.width);
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
    };
  }, [ref]);
  return width;
}

export const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Stable unique-ish id fragment for SVG gradient ids. */
export function svgId(prefix: string, reactId: string) {
  return `${prefix}-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

/** Rect path with independent corner radii `[tl, tr, br, bl]` (clamped to half the shortest side). */
export function roundedRectPath(
  x: number,
  y: number,
  w: number,
  h: number,
  r: [number, number, number, number],
): string {
  const m = Math.max(0, Math.min(w, h) / 2);
  const [tl, tr, br, bl] = r.map((v) => clamp(v, 0, m)) as [number, number, number, number];
  return `M${x + tl},${y}H${x + w - tr}${tr ? `A${tr},${tr} 0 0 1 ${x + w},${y + tr}` : ''}V${y + h - br}${br ? `A${br},${br} 0 0 1 ${x + w - br},${y + h}` : ''}H${x + bl}${bl ? `A${bl},${bl} 0 0 1 ${x},${y + h - bl}` : ''}V${y + tl}${tl ? `A${tl},${tl} 0 0 1 ${x + tl},${y}` : ''}Z`;
}
