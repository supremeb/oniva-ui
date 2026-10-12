import { useLocale } from 'react-aria';
import * as stylex from '@stylexjs/stylex';
import { arc, pie } from 'd3-shape';
import { useMemo, type ReactNode, type Ref } from 'react';
import { canObserve, intlOptionsFor, useTween } from '../../internal/charts-motion';
import { AnimatedNumber } from '../../motion/AnimatedNumber/AnimatedNumber';
import { useInView } from '../../motion/InView/useInView';
import { makeFormatter, type ValueFormat } from '../../internal/charts-math';
import { svgText, toneStyle } from '../../internal/charts-styles';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { ChartFrame } from '../_shared/ChartFrame';

const styles = stylex.create({
  center: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    inset: 0,
    justifyContent: 'center',
    pointerEvents: 'none',
    position: 'absolute',
  },
  value: {
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-24'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-medium'],
    letterSpacing: font['--oniva-font-track-hero'],
    lineHeight: font['--oniva-font-lh-24'],
  },
  caption: {
    color: colors['--oniva-color-text-muted'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
  },
  wrap: { position: 'relative' },
});

export interface DonutSlice {
  label: string;
  value: number;
  /** 1-based palette index; defaults to position. */
  tone?: number;
}

export interface DonutChartProps {
  data: DonutSlice[];
  /** `pie` fills the centre. */
  variant?: 'donut' | 'pie';
  /** Diameter in px. */
  size?: number;
  /** Ring thickness as a fraction of the radius (donut). */
  thickness?: number;
  /** Gap between slices in px. */
  gap?: number;
  valueFormat?: ValueFormat;
  /** Centre content (donut). Defaults to the total. */
  centerValue?: ReactNode;
  centerLabel?: ReactNode;
  label?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function DonutChart({
  data,
  variant = 'donut',
  size = 200,
  thickness = 0.32,
  gap = 3,
  valueFormat = 'number',
  centerValue,
  centerLabel = 'Total',
  label,
  className,
  xstyle,
  ref,
}: DonutChartProps) {
  const { locale } = useLocale();
  const fmt = makeFormatter(valueFormat, locale);
  const total = data.reduce((s, d) => s + d.value, 0);
  const intl = intlOptionsFor(valueFormat);
  const { ref: viewRef, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  /** Clockwise entrance sweep 0 -> 1 (once, on first in-view). */
  const sweepP = useTween([1], { fromZero: canObserve(), active: inView, duration: 700 })[0] ?? 1;
  /** Morph between periods: slice values tween, angles re-normalise every frame. */
  const morphed = useTween(
    useMemo(() => data.map((d) => d.value), [data]),
    { duration: 500 },
  );
  const tweened = useMemo(
    () => (morphed.length === data.length ? data.map((d, i) => ({ ...d, value: morphed[i]! })) : data),
    [data, morphed],
  );
  return (
    <div ref={viewRef} {...stylex.props(styles.wrap, xstyle)} style={{ height: size, width: size }}>
      <ChartFrame
        label={
          label ??
          `${variant === 'pie' ? 'Pie' : 'Donut'} chart: ${data.map((d) => `${d.label} ${fmt(d.value)}`).join(', ')}`
        }
        height={size}
        width={size}
        className={className}
        ref={ref}
        dataTable={{
          columns: ['Slice', 'Value', 'Share'],
          rows: data.map((d) => [
            d.label,
            fmt(d.value),
            `${Math.round((d.value / (total || 1)) * 100)}%`,
          ]),
        }}
      >
        {({ bind }) => {
          const R = size / 2 - 2;
          const inner = variant === 'pie' ? 0 : R * (1 - thickness);
          const slices = pie<DonutSlice>()
            .value((d) => d.value)
            .sort(null)
            .padAngle(gap / R)(tweened);
          const theta = sweepP * Math.PI * 2;
          const gen = arc<(typeof slices)[number]>()
            .innerRadius(inner)
            .outerRadius(R)
            .cornerRadius(variant === 'pie' ? 4 : Math.min(8, (R - inner) / 2));
          return (
            <g transform={`translate(${size / 2},${size / 2})`}>
              {slices.map((s0, i) => {
                const s = { ...s0, data: data[i] ?? s0.data };
                const clipped = { ...s0, startAngle: Math.min(s0.startAngle, theta), endAngle: Math.min(s0.endAngle, theta) };
                return (
                <path
                  key={i}
                  d={clipped.endAngle - clipped.startAngle > 0.0001 ? (gen(clipped) ?? '') : ''}
                  fill="currentColor"
                  {...stylex.props(toneStyle(s.data.tone ?? i + 1), svgText.hit)}
                  {...bind(
                    {
                      title: s.data.label,
                      rows: [
                        { label: 'Value', value: fmt(s.data.value), tone: s.data.tone ?? i + 1 },
                        {
                          label: 'Share',
                          value: `${Math.round((s.data.value / (total || 1)) * 100)}%`,
                        },
                      ],
                    },
                    `${s.data.label}: ${fmt(s.data.value)} (${Math.round((s.data.value / (total || 1)) * 100)}%)`,
                  )}
                />
                );
              })}
            </g>
          );
        }}
      </ChartFrame>
      {variant === 'donut' && (
        <div {...stylex.props(styles.center)}>
          <span {...stylex.props(styles.value)}>
            {centerValue ?? (intl ? <AnimatedNumber value={total} format={intl} /> : fmt(total))}
          </span>
          {centerLabel != null && <span {...stylex.props(styles.caption)}>{centerLabel}</span>}
        </div>
      )}
    </div>
  );
}

export type PieChartProps = Omit<DonutChartProps, 'variant'>;
export function PieChart(props: PieChartProps) {
  return <DonutChart {...props} variant="pie" />;
}
