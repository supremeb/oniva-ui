import { useLocale } from 'react-aria';
import * as stylex from '@stylexjs/stylex';
import type { Ref } from 'react';
import { makeFormatter, roundedRectPath, type ValueFormat } from '../../internal/charts-math';
import { chartMotion, svgText, toneStyle } from '../../internal/charts-styles';
import { ChartFrame } from '../_shared/ChartFrame';

export interface FunnelStep {
  label: string;
  value: number;
}

export interface FunnelChartProps {
  steps: FunnelStep[];
  /** 1-based palette index for the bars. */
  tone?: number;
  valueFormat?: ValueFormat;
  height?: number;
  label?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Horizontal conversion funnel: bars shrink with value, ribbons show drop-off, % of first step labelled. */
export function FunnelChart({
  steps,
  tone = 5,
  valueFormat = 'compact',
  height = 260,
  label,
  className,
  xstyle,
  ref,
}: FunnelChartProps) {
  const { locale } = useLocale();
  const fmt = makeFormatter(valueFormat, locale);
  const first = steps[0]?.value || 1;
  return (
    <ChartFrame
      label={label ?? `Funnel: ${steps.map((s) => `${s.label} ${fmt(s.value)}`).join(' to ')}`}
      height={height}
      className={className}
      xstyle={xstyle}
      ref={ref}
      dataTable={{
        columns: ['Step', 'Value', 'Of first step'],
        rows: steps.map((s) => [s.label, fmt(s.value), `${((s.value / first) * 100).toFixed(1)}%`]),
      }}
    >
      {({ width, height: h, bind }) => {
        const n = steps.length;
        const top = 40;
        const bottom = 36;
        const innerH = h - top - bottom;
        const gapW = Math.max(12, Math.min(48, width * 0.06));
        const bw = (width - gapW * (n - 1)) / n;
        const bx = (i: number) => i * (bw + gapW);
        const bh = (v: number) => Math.max(6, (v / first) * innerH);
        const mid = top + innerH / 2;
        return (
          <g {...stylex.props(toneStyle(tone))}>
            {steps.slice(0, -1).map((s, i) => {
              const a = bh(s.value) / 2;
              const b = bh(steps[i + 1]!.value) / 2;
              const x1 = bx(i) + bw;
              const x2 = bx(i + 1);
              return (
                <path
                  key={i}
                  d={`M${x1},${mid - a}C${x1 + gapW / 2},${mid - a} ${x2 - gapW / 2},${mid - b} ${x2},${mid - b}V${mid + b}C${x2 - gapW / 2},${mid + b} ${x1 + gapW / 2},${mid + a} ${x1},${mid + a}Z`}
                  fill="currentColor"
                  fillOpacity={0.16}
                  {...stylex.props(chartMotion.fade)}
                />
              );
            })}
            {steps.map((s, i) => {
              const hh = bh(s.value);
              const pct = (s.value / first) * 100;
              return (
                <g key={s.label}>
                  <path
                    d={roundedRectPath(bx(i), mid - hh / 2, bw, hh, [8, 8, 8, 8])}
                    fill="currentColor"
                    fillOpacity={1 - i * (0.5 / Math.max(1, n - 1))}
                    {...stylex.props(chartMotion.growX, svgText.hit)}
                    style={{ animationDelay: `${i * 80}ms` }}
                    {...bind(
                      {
                        title: s.label,
                        rows: [
                          { label: 'Count', value: fmt(s.value), tone },
                          { label: 'Of first step', value: `${pct.toFixed(1)}%` },
                          ...(i > 0
                            ? [
                                {
                                  label: 'From previous',
                                  value: `${((s.value / steps[i - 1]!.value) * 100).toFixed(1)}%`,
                                },
                              ]
                            : []),
                        ],
                      },
                      `${s.label}: ${fmt(s.value)}, ${pct.toFixed(1)}% of first step`,
                    )}
                  />
                  <text
                    x={bx(i) + bw / 2}
                    y={top - 22}
                    textAnchor="middle"
                    {...stylex.props(svgText.strong)}
                    fontSize={15}
                  >
                    {fmt(s.value)}
                  </text>
                  <text
                    x={bx(i) + bw / 2}
                    y={top - 6}
                    textAnchor="middle"
                    {...stylex.props(svgText.axis)}
                  >
                    {i === 0 ? '100%' : `${pct.toFixed(1)}%`}
                  </text>
                  <text
                    x={bx(i) + bw / 2}
                    y={h - 12}
                    textAnchor="middle"
                    {...stylex.props(svgText.axis)}
                  >
                    {s.label}
                  </text>
                </g>
              );
            })}
          </g>
        );
      }}
    </ChartFrame>
  );
}
