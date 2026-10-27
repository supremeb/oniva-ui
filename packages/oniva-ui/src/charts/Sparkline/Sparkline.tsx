import * as stylex from '@stylexjs/stylex';
import { area, line } from 'd3-shape';
import { useId, useState, type PointerEvent, type Ref } from 'react';
import { curveFor, svgId, type CurveType } from '../../internal/charts-math';
import { media } from '../../tokens/media.stylex';
import { colors } from '../../tokens/colors.stylex';
import { chartMotion, toneStyle } from '../../internal/charts-styles';

const styles = stylex.create({
  svg: { display: 'block', flexShrink: 0, overflow: 'visible' },
  hoverG: {
    opacity: 0,
    pointerEvents: 'none',
    transitionDuration: { default: '90ms', [media.reducedMotion]: '0.01ms' },
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
  },
  hoverOn: { opacity: 1 },
  hoverText: {
    fontSize: 10,
    fontVariantNumeric: 'tabular-nums',
    fill: colors['--oniva-color-text'],
  },
});

export interface SparklineProps {
  data: number[];
  variant?: 'line' | 'area' | 'bar';
  /** 1-based palette index (chart1..chart10). */
  tone?: number;
  width?: number;
  height?: number;
  curve?: CurveType;
  /** Accessible label; defaults to a trend summary. */
  label?: string;
  /** Change to replay the draw-in (defaults to the point count). */
  drawKey?: string | number;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<SVGSVGElement>;
}

/** Tiny inline trend chart for KPI cards and table cells. */
export function Sparkline({
  data,
  variant = 'area',
  tone = 1,
  width = 96,
  height = 32,
  curve = 'monotone',
  label,
  drawKey,
  className,
  xstyle,
  ref,
}: SparklineProps) {
  const id = svgId('spark', useId());
  const n = data.length;
  const [hi, setHi] = useState<number | null>(null);
  const [seen, setSeen] = useState(0);
  if (hi != null && hi !== seen) setSeen(hi);
  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (!r.width || n < 1) return;
    const f = ((e.clientX - r.left) / r.width) * width;
    setHi(Math.max(0, Math.min(n - 1, Math.round(((f - 2) / (width - 4 || 1)) * (n - 1)))));
  };
  const min = Math.min(...data, 0);
  const max = Math.max(...data, 1);
  const pad = 2;
  const x = (i: number) =>
    pad + (n > 1 ? (i * (width - pad * 2)) / (n - 1) : (width - pad * 2) / 2);
  const y = (v: number) => height - pad - ((v - min) / (max - min || 1)) * (height - pad * 2);
  const first = data[0] ?? 0;
  const last = data[n - 1] ?? 0;
  const summary =
    label ?? `Trend of ${n} points, ${last >= first ? 'up' : 'down'} from ${first} to ${last}`;
  const sx = stylex.props(styles.svg, toneStyle(tone), xstyle);
  const dLine =
    line<number>()
      .x((_, i) => x(i))
      .y((v) => y(v))
      .curve(curveFor(curve))(data) ?? '';
  const dArea =
    area<number>()
      .x((_, i) => x(i))
      .y0(height - pad)
      .y1((v) => y(v))
      .curve(curveFor(curve))(data) ?? '';
  const bw = Math.max(2, ((width - pad * 2) / Math.max(n, 1)) * 0.62);
  return (
    <svg
      ref={ref}
      role="img"
      aria-label={summary}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      onPointerMove={variant === 'bar' ? undefined : onMove}
      onPointerLeave={() => setHi(null)}
      {...sx}
      className={[sx.className, className].filter(Boolean).join(' ')}
    >
      {variant === 'area' && (
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity={0.35} />
            <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
          </linearGradient>
        </defs>
      )}
      {variant === 'area' && (
        <path
          key={`a${drawKey ?? n}`}
          d={dArea}
          fill={`url(#${id})`}
          {...stylex.props(chartMotion.fade)}
        />
      )}
      {variant !== 'bar' && (
        <path
          key={`l${drawKey ?? n}`}
          d={dLine}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          {...stylex.props(chartMotion.draw)}
        />
      )}
      {variant === 'bar' &&
        data.map((v, i) => (
          <rect
            key={i}
            x={x(i) - bw / 2}
            y={y(v)}
            width={bw}
            height={Math.max(2, height - pad - y(v))}
            rx={Math.min(3, bw / 2)}
            fill="currentColor"
            {...stylex.props(chartMotion.grow)}
            style={{ animationDelay: `${i * 25}ms` }}
          />
        ))}
      {variant !== 'bar' && n > 0 && (
        <g
          aria-hidden="true"
          {...stylex.props(styles.hoverG, hi != null && styles.hoverOn)}
          style={{ transform: `translate(${x(seen)}px, ${y(data[seen] ?? 0)}px)` }}
        >
          <circle r={3} fill="currentColor" />
          <text y={-8} textAnchor="middle" {...stylex.props(styles.hoverText)}>
            {data[seen]}
          </text>
        </g>
      )}
    </svg>
  );
}
