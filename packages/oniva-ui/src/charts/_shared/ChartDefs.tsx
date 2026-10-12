import * as stylex from '@stylexjs/stylex';
import { seriesTone, type ChartSeries } from '../../internal/charts-math';
import { toneStyle } from '../../internal/charts-styles';

/** Fill treatment for series shapes: flat colour, vertical gradient, or an SVG pattern (dots / diagonal lines / grid). */
export type ChartFill = 'solid' | 'gradient' | 'dots' | 'lines' | 'grid';

/** `fill` value for series `i` (pattern/gradient ids come from `SeriesDefs`). */
export const fillUrl = (id: string, i: number, fill: ChartFill) =>
  fill === 'solid' ? 'currentColor' : `url(#${id}-f${i})`;
export const glowUrl = (id: string, glow?: boolean) => (glow ? `url(#${id}-glow)` : undefined);

interface SeriesDefsProps {
  id: string;
  series: ChartSeries[];
  fill: ChartFill;
  glow?: boolean;
  /** Gradient stop opacities [top, bottom]. */
  gradient?: [number, number];
}

/**
 * Shared `<defs>` library: per-series fill (gradient or pattern, tinted with the series tone via `currentColor`)
 * plus an optional blur glow filter. Reference with `fillUrl()` / `glowUrl()`.
 */
export function SeriesDefs({ id, series, fill, glow, gradient = [0.55, 0.04] }: SeriesDefsProps) {
  return (
    <defs>
      {fill !== 'solid' &&
        series.map((s, i) => {
          const tone = stylex.props(toneStyle(seriesTone(s, i)));
          const pid = `${id}-f${i}`;
          if (fill === 'gradient') {
            return (
              <linearGradient key={pid} id={pid} x1="0" x2="0" y1="0" y2="1" {...tone}>
                <stop offset="0%" stopColor="currentColor" stopOpacity={gradient[0]} />
                <stop offset="100%" stopColor="currentColor" stopOpacity={gradient[1]} />
              </linearGradient>
            );
          }
          return (
            <pattern
              key={pid}
              id={pid}
              width={8}
              height={8}
              patternUnits="userSpaceOnUse"
              patternTransform={fill === 'lines' ? 'rotate(45)' : undefined}
              {...tone}
            >
              <rect width={8} height={8} fill="currentColor" fillOpacity={0.14} />
              {fill === 'dots' && (
                <circle cx={4} cy={4} r={1.3} fill="currentColor" fillOpacity={0.9} />
              )}
              {fill === 'lines' && (
                <rect width={8} height={2} fill="currentColor" fillOpacity={0.85} />
              )}
              {fill === 'grid' && (
                <path
                  d="M0 .5H8M.5 0V8"
                  stroke="currentColor"
                  strokeOpacity={0.55}
                  strokeWidth={1}
                  fill="none"
                />
              )}
            </pattern>
          );
        })}
      {glow && (
        <filter
          id={`${id}-glow`}
          filterUnits="userSpaceOnUse"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation={3} result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      )}
    </defs>
  );
}
