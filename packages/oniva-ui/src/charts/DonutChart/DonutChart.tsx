import * as stylex from '@stylexjs/stylex';
import { arc, pie } from 'd3-shape';
import type { ReactNode, Ref } from 'react';
import { makeFormatter, type ValueFormat } from '../../internal/charts-math';
import { chartMotion, svgText, toneStyle } from '../../internal/charts-styles';
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
    color: colors.text,
    fontFamily: font.sans,
    fontSize: font.size24,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font.weightMedium,
    letterSpacing: font.trackHero,
    lineHeight: font.lh24,
  },
  caption: {
    color: colors.textMuted,
    fontFamily: font.sans,
    fontSize: font.size12,
    fontWeight: font.weightMedium,
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
  const fmt = makeFormatter(valueFormat);
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div {...stylex.props(styles.wrap, xstyle)} style={{ height: size, width: size }}>
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
            .padAngle(gap / R)(data);
          const gen = arc<(typeof slices)[number]>()
            .innerRadius(inner)
            .outerRadius(R)
            .cornerRadius(variant === 'pie' ? 4 : Math.min(8, (R - inner) / 2));
          return (
            <g transform={`translate(${size / 2},${size / 2})`}>
              {slices.map((s, i) => (
                <path
                  key={i}
                  d={gen(s) ?? ''}
                  fill="currentColor"
                  {...stylex.props(toneStyle(s.data.tone ?? i + 1), svgText.hit, chartMotion.pop)}
                  style={{ animationDelay: `${i * 70}ms` }}
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
              ))}
            </g>
          );
        }}
      </ChartFrame>
      {variant === 'donut' && (
        <div {...stylex.props(styles.center)}>
          <span {...stylex.props(styles.value)}>{centerValue ?? fmt(total)}</span>
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
