import * as stylex from '@stylexjs/stylex';
import { scaleLinear } from 'd3-scale';
import { line as d3line, curveMonotoneX } from 'd3-shape';
import { useMemo, useState, type CSSProperties, type Ref } from 'react';
import { niceTicks } from '../../internal/charts-math';
import { useTween } from '../../internal/charts-motion';
import { chartMotion, svgText, toneStyle } from '../../internal/charts-styles';
import { useFormatters } from '../../internal/format';
import { mergeSx } from '../../internal/sx';
import { surface } from '../../internal/w6-surface';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Badge } from '../../components/Badge';
import { ChartFrame } from '../_shared/ChartFrame';

const styles = stylex.create({
  box: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-card'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    containerType: 'inline-size',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    maxWidth: '100%',
    overflow: 'hidden',
    width: '100%',
  },
  body: { display: 'flex', flexDirection: 'column', gap: 12, padding: 20, paddingBottom: 12 },
  foot: {
    alignItems: 'center',
    borderTopColor: colors['--oniva-color-border'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: font['--oniva-font-size-13'],
    gap: 8,
    justifyContent: 'space-between',
    paddingBlock: 12,
    paddingInline: 20,
  },
  valueRow: { alignItems: 'baseline', display: 'flex', flexWrap: 'wrap', gap: 8 },
  value: {
    fontSize: font['--oniva-font-size-24'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-semibold'],
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
  },
  label: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-medium'] },
  guide: {
    stroke: colors['--oniva-color-chart-cursor'],
    transform: 'translateX(var(--oniva-gx, 0px))',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: { default: 'transform', [media.reducedMotion]: 'none' },
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  dot: {
    fill: 'currentColor',
    stroke: colors['--oniva-color-surface-inner'],
    strokeWidth: 2,
    transform: 'translate(var(--oniva-dx, 0px), var(--oniva-dy, 0px))',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: { default: 'transform', [media.reducedMotion]: 'none' },
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  path: {
    fill: 'none',
    opacity: { default: 1, '[data-off]': 0 },
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 2,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: { default: 'opacity', [media.reducedMotion]: 'none' },
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  dotOff: { opacity: 0 },
  legendBtn: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: 6,
    color: colors['--oniva-color-text-muted'],
    cursor: 'pointer',
    display: 'inline-flex',
    font: 'inherit',
    gap: 6,
    opacity: { default: 1, '[aria-pressed="false"]': 0.45 },
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    padding: 0,
    transform: { default: 'scale(1)', ':active': 'scale(0.97)' },
    transitionDuration: motion['--oniva-motion-dur-press'],
    transitionProperty: { default: 'opacity, transform', [media.reducedMotion]: 'none' },
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  legend: { display: 'flex', flexWrap: 'wrap', gap: 12, listStyle: 'none', margin: 0, padding: 0 },
  legendItem: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'inline-flex', fontSize: font['--oniva-font-size-12'], gap: 6 },
  swatch: { backgroundColor: 'currentColor', borderRadius: 3, height: 8, width: 8 },
});

export interface KpiSeries {
  label: string;
  /** One value per entry in `labels`. */
  values: number[];
  /** 1-based palette index (1..10). Defaults to the series position. */
  tone?: number;
}

export interface KpiChartProps {
  /** Label above the number. */
  title: string;
  /** Headline value, already formatted. */
  value: string;
  /** Change against the previous period, in the same unit as the series (green when positive, red when negative). */
  delta?: number;
  /** One label per point; first, middle and last are shown on the axis. */
  labels: string[];
  /** Longer labels for the tooltip header; falls back to `labels`. */
  tooltipLabels?: string[];
  series: KpiSeries[];
  /** Formats axis, tooltip and delta values. Default compact (1.2k). */
  format?: (n: number) => string;
  /** Line under the chart. */
  footer?: string;
  /** Point that stays highlighted while nobody hovers. Default is the last point. */
  defaultIndex?: number;
  /** Plot height in px. Default 180. */
  height?: number;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

/**
 * Metric card with a multi-line chart. A pointer-following tooltip lists every series at the nearest point; the guide
 * and dots glide between points (transform only). Keyboard: Tab to the chart, Left/Right to step through the points,
 * Esc closes the tooltip. A polite live region reads the values of the current point.
 */
export function KpiChart({
  title,
  value,
  delta,
  labels,
  tooltipLabels,
  series,
  format,
  footer,
  defaultIndex,
  height = 170,
  className,
  xstyle,
  ref,
}: KpiChartProps) {
  const fmt = useFormatters();
  const f = format ?? fmt.compact;
  const n = labels.length;
  const rest = Math.min(Math.max(defaultIndex ?? n - 1, 0), Math.max(0, n - 1));
  const [hover, setHover] = useState<number | null>(null);
  const [off, setOff] = useState<Set<string>>(() => new Set());
  // Data changes morph: every value tweens from where it is on screen (snaps under reduced motion or when the shape changes).
  const flat = useMemo(() => series.flatMap((s) => s.values), [series]);
  const tw = useTween(flat, { duration: 450 });
  const shown = useMemo(() => {
    if (tw.length !== flat.length) return series;
    let at = 0;
    return series.map((s) => {
      const values = tw.slice(at, at + s.values.length);
      at += s.values.length;
      return { ...s, values };
    });
  }, [tw, flat.length, series]);
  const idx = hover ?? rest;
  const headLabel = (i: number) => tooltipLabels?.[i] ?? labels[i] ?? '';
  const summary = (i: number) => `${headLabel(i)}: ${series.map((s) => `${s.label} ${f(s.values[i] ?? 0)}`).join(', ')}`;
  const sx = stylex.props(styles.box, xstyle);

  return (
    <section ref={ref as Ref<HTMLElement>} aria-label={title} {...mergeSx(sx, className)}>
      <div {...stylex.props(styles.body)}>
        <div>
          <div {...stylex.props(styles.label)}>{title}</div>
          <div {...stylex.props(styles.valueRow)}>
            <span {...stylex.props(styles.value)}>{value}</span>
            {delta != null && (
              <Badge variant={delta >= 0 ? 'success' : 'danger'} shape="pill" size="sm">
                {delta >= 0 ? <ArrowUpRight size={12} aria-hidden="true" /> : <ArrowDownRight size={12} aria-hidden="true" />}
                {delta >= 0 ? '+' : '−'}
                {f(Math.abs(delta))}
              </Badge>
            )}
          </div>
        </div>
        <ChartFrame label={`${title}: ${series.map((s) => s.label).join(', ')} over ${labels[0] ?? ''} to ${labels[n - 1] ?? ''}`} height={height}>
          {({ width, height: h, bind }) => {
            const left = 36;
            const top = 8;
            const bottom = 22;
            const innerW = Math.max(10, width - left - 8);
            const innerH = Math.max(10, h - top - bottom);
            const max = Math.max(0, ...series.flatMap((s) => s.values));
            const nice = niceTicks(max, 2);
            const x = (i: number) => left + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
            const y = scaleLinear().domain(nice.domain).range([top + innerH, top]);
            const step = n <= 1 ? innerW : innerW / (n - 1);
            const path = d3line<number>()
              .x((_, i) => x(i))
              .y((v) => y(v))
              .curve(curveMonotoneX);
            const axisIdx = Array.from(new Set([0, Math.floor((n - 1) / 2), n - 1])).filter((i) => i >= 0);
            const tipFor = (i: number) => ({
              title: headLabel(i),
              rows: series
                .map((s, si) => ({ label: s.label, value: f(s.values[i] ?? 0), tone: s.tone ?? si + 1, v: s.values[i] ?? 0 }))
                .sort((a, b) => b.v - a.v)
                .map(({ v: _v, ...r }) => r),
            });
            return (
              <>
                <g aria-hidden="true">
                  {nice.ticks.map((t) => (
                    <g key={t}>
                      <line x1={left} x2={left + innerW} y1={y(t)} y2={y(t)} strokeDasharray={t === 0 ? undefined : '3 4'} {...stylex.props(svgText.grid)} />
                      <text x={left - 8} y={y(t)} dy="0.32em" textAnchor="end" {...stylex.props(svgText.axis)}>
                        {f(t)}
                      </text>
                    </g>
                  ))}
                  {axisIdx.map((i, k) => (
                    <text
                      key={i}
                      x={x(i)}
                      y={top + innerH + 16}
                      textAnchor={k === 0 && axisIdx.length > 1 ? 'start' : k === axisIdx.length - 1 && axisIdx.length > 1 ? 'end' : 'middle'}
                      {...stylex.props(svgText.axis)}
                    >
                      {labels[i]}
                    </text>
                  ))}
                  <line y1={top} y2={top + innerH} {...stylex.props(styles.guide)} style={{ '--oniva-gx': `${x(idx)}px` } as CSSProperties} />
                </g>
                {shown.map((s, si) => (
                  <path
                    key={s.label}
                    data-off={off.has(s.label) ? '' : undefined}
                    d={path(s.values) ?? ''}
                    pathLength={1}
                    aria-hidden="true"
                    {...stylex.props(toneStyle(s.tone ?? si + 1), styles.path, chartMotion.draw)}
                  />
                ))}
                <g aria-hidden="true">
                  {shown.map((s, si) => (
                    <circle
                      key={s.label}
                      r={4}
                      style={{ '--oniva-dx': `${x(idx)}px`, '--oniva-dy': `${y(s.values[idx] ?? 0)}px` } as CSSProperties}
                      {...stylex.props(toneStyle(s.tone ?? si + 1), styles.dot, off.has(s.label) && styles.dotOff)}
                    />
                  ))}
                </g>
                {labels.map((_, i) => {
                  const b = bind(tipFor(i), summary(i));
                  return (
                    <rect
                      key={i}
                      x={x(i) - step / 2}
                      y={top}
                      width={step}
                      height={innerH}
                      fill="transparent"
                      {...b}
                      onPointerEnter={() => setHover(i)}
                      onPointerLeave={() => {
                        b.onPointerLeave();
                        setHover(null);
                      }}
                      onFocus={(e) => {
                        b.onFocus(e);
                        setHover(i);
                      }}
                      onBlur={() => {
                        b.onBlur();
                        setHover(null);
                      }}
                      onKeyDown={(e) => {
                        b.onKeyDown(e);
                        if (e.key === 'Escape') setHover(null);
                      }}
                      {...stylex.props(svgText.hit)}
                    />
                  );
                })}
              </>
            );
          }}
        </ChartFrame>
        <span aria-live="polite" role="status" {...stylex.props(surface.sr)}>
          {hover != null ? summary(hover) : ''}
        </span>
      </div>
      <div {...stylex.props(styles.foot)}>
        {footer ? <span>{footer}</span> : null}
        <ul aria-label="Series" {...stylex.props(styles.legend)}>
          {series.map((s, si) => (
            <li key={s.label} {...stylex.props(styles.legendItem)}>
              <button
                type="button"
                aria-pressed={!off.has(s.label)}
                onClick={() =>
                  setOff((prev) => {
                    const next = new Set(prev);
                    if (next.has(s.label)) next.delete(s.label);
                    else if (next.size < series.length - 1) next.add(s.label);
                    return next;
                  })
                }
                {...stylex.props(styles.legendBtn)}
              >
                <span aria-hidden="true" {...stylex.props(toneStyle(s.tone ?? si + 1), styles.swatch)} />
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
