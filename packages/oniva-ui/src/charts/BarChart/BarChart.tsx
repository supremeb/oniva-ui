import * as stylex from '@stylexjs/stylex';
import { scaleBand, scaleLinear } from 'd3-scale';
import { stack, stackOffsetExpand, stackOffsetNone } from 'd3-shape';
import type { Ref } from 'react';
import {
  makeAxisFormatter,
  makeFormatter,
  niceTicks,
  roundedRectPath,
  seriesTone,
  type ChartDatum,
  type ChartSeries,
  type ValueFormat,
} from '../../internal/charts-math';
import { chartMotion, svgText, toneStyle, tones } from '../../internal/charts-styles';
import { ChartFrame } from '../_shared/ChartFrame';

export interface BarChartProps {
  data: ChartDatum[];
  index: string;
  series: ChartSeries[];
  orientation?: 'vertical' | 'horizontal';
  /** How multiple series combine. */
  layout?: 'grouped' | 'stacked' | 'percent';
  /** Render a full-height rounded track behind each bar (BoardUI "Steps" style). */
  track?: boolean;
  /** Corner radius of bars in px. */
  barRadius?: number;
  /** Space between category bands, 0..1. */
  padding?: number;
  valueFormat?: ValueFormat;
  height?: number;
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  label?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function BarChart({
  data,
  index,
  series,
  orientation = 'vertical',
  layout = 'grouped',
  track = false,
  barRadius = 8,
  padding,
  valueFormat = 'number',
  height = 240,
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  label,
  className,
  xstyle,
  ref,
}: BarChartProps) {
  const fmt = makeFormatter(valueFormat);
  const horizontal = orientation === 'horizontal';
  const pad = padding ?? (track ? 0.14 : 0.32);
  const axisFmt =
    layout === 'percent'
      ? (n: number) => `${Math.round(n * 100)}%`
      : makeAxisFormatter(valueFormat);
  return (
    <ChartFrame
      label={
        label ??
        `${horizontal ? 'Horizontal bar' : 'Bar'} chart of ${series.map((s) => s.label ?? s.key).join(', ')} by ${index}`
      }
      height={height}
      className={className}
      xstyle={xstyle}
      ref={ref}
      dataTable={{
        columns: [index, ...series.map((s) => s.label ?? s.key)],
        rows: data.map((d) => [String(d[index]), ...series.map((s) => fmt(Number(d[s.key]) || 0))]),
      }}
    >
      {({ width, height: h, bind }) => {
        const categories = data.map((d) => String(d[index]));
        const keys = series.map((s) => s.key);
        const value = (d: ChartDatum, k: string) => Number(d[k]) || 0;
        const stacked = layout !== 'grouped';
        const layers = stacked
          ? stack<ChartDatum>()
              .keys(keys)
              .value(value)
              .offset(layout === 'percent' ? stackOffsetExpand : stackOffsetNone)(data)
              .map((s) => s.map((p) => [p[0], p[1]] as [number, number]))
          : keys.map((k) => data.map((d) => [0, value(d, k)] as [number, number]));
        const rawMax = Math.max(0, ...layers.flatMap((l) => l.map((p) => p[1])));
        const nice =
          layout === 'percent'
            ? { ticks: [0, 0.25, 0.5, 0.75, 1], domain: [0, 1] as [number, number] }
            : niceTicks(rawMax, 4);

        const maxLabel = Math.max(...categories.map((c) => c.length));
        const left = horizontal
          ? showYAxis
            ? Math.min(140, maxLabel * 6.4 + 16)
            : 8
          : showYAxis
            ? 48
            : 8;
        const top = 8;
        const right = 12;
        const bottom = showXAxis ? 28 : 8;
        const innerW = Math.max(10, width - left - right);
        const innerH = Math.max(10, h - top - bottom);

        const cat = scaleBand<string>()
          .domain(categories)
          .range(horizontal ? [top, top + innerH] : [left, left + innerW])
          .padding(pad);
        const val = scaleLinear()
          .domain(nice.domain)
          .range(horizontal ? [left, left + innerW] : [top + innerH, top]);
        const sub = scaleBand<string>()
          .domain(keys)
          .range([0, cat.bandwidth()])
          .padding(layout === 'grouped' && keys.length > 1 ? 0.12 : 0);
        const r = Math.min(barRadius, cat.bandwidth() / 2);
        const grid = nice.ticks;

        return (
          <>
            <g aria-hidden="true">
              {showGrid &&
                !track &&
                grid.map((t) => (
                  <line
                    key={t}
                    {...(horizontal
                      ? { x1: val(t), x2: val(t), y1: top, y2: top + innerH }
                      : { x1: left, x2: left + innerW, y1: val(t), y2: val(t) })}
                    strokeDasharray={t === 0 ? undefined : '3 4'}
                    {...stylex.props(svgText.grid)}
                  />
                ))}
              {showYAxis &&
                !horizontal &&
                grid.map((t) => (
                  <text
                    key={t}
                    x={left - 8}
                    y={val(t)}
                    dy="0.32em"
                    textAnchor="end"
                    {...stylex.props(svgText.axis)}
                  >
                    {axisFmt(t)}
                  </text>
                ))}
              {showXAxis &&
                horizontal &&
                grid.map((t) => (
                  <text
                    key={t}
                    x={val(t)}
                    y={top + innerH + 18}
                    textAnchor="middle"
                    {...stylex.props(svgText.axis)}
                  >
                    {axisFmt(t)}
                  </text>
                ))}
              {showXAxis &&
                !horizontal &&
                categories.map((c) => (
                  <text
                    key={c}
                    x={(cat(c) ?? 0) + cat.bandwidth() / 2}
                    y={top + innerH + 18}
                    textAnchor="middle"
                    {...stylex.props(svgText.axis)}
                  >
                    {c}
                  </text>
                ))}
              {showYAxis &&
                horizontal &&
                categories.map((c) => (
                  <text
                    key={c}
                    x={left - 10}
                    y={(cat(c) ?? 0) + cat.bandwidth() / 2}
                    dy="0.32em"
                    textAnchor="end"
                    {...stylex.props(svgText.axis)}
                  >
                    {c}
                  </text>
                ))}
            </g>
            {track &&
              categories.map((c) => {
                const p = cat(c) ?? 0;
                const d = horizontal
                  ? roundedRectPath(left, p, innerW, cat.bandwidth(), [r, r, r, r])
                  : roundedRectPath(p, top, cat.bandwidth(), innerH, [r, r, r, r]);
                return <path key={c} d={d} fill="currentColor" {...stylex.props(tones.track)} />;
              })}
            {series.map((s, si) => (
              <g key={s.key} {...stylex.props(toneStyle(seriesTone(s, si)))}>
                {data.map((_, i) => {
                  const [v0, v1] = layers[si]![i]!;
                  if (v1 - v0 <= 0) return null;
                  const c = categories[i]!;
                  const base = (cat(c) ?? 0) + (layout === 'grouped' ? (sub(s.key) ?? 0) : 0);
                  const bw = layout === 'grouped' ? sub.bandwidth() : cat.bandwidth();
                  const isTop =
                    !stacked ||
                    si === layers.length - 1 ||
                    layers.slice(si + 1).every((l) => l[i]![1] - l[i]![0] <= 0);
                  const isBottom = !stacked || si === 0;
                  const rr = Math.min(r, bw / 2);
                  const cr = horizontal
                    ? ([isBottom ? rr : 0, isTop ? rr : 0, isTop ? rr : 0, isBottom ? rr : 0] as [
                        number,
                        number,
                        number,
                        number,
                      ])
                    : ([isTop ? rr : 0, isTop ? rr : 0, isBottom ? rr : 0, isBottom ? rr : 0] as [
                        number,
                        number,
                        number,
                        number,
                      ]);
                  const full = !stacked
                    ? ([rr, rr, rr, rr] as [number, number, number, number])
                    : cr;
                  const d = horizontal
                    ? roundedRectPath(val(v0), base, Math.max(1, val(v1) - val(v0)), bw, full)
                    : roundedRectPath(base, val(v1), bw, Math.max(1, val(v0) - val(v1)), full);
                  return (
                    <path
                      key={i}
                      d={d}
                      fill="currentColor"
                      {...stylex.props(horizontal ? chartMotion.growX : chartMotion.grow)}
                      style={{ animationDelay: `${i * 40 + si * 60}ms` }}
                    />
                  );
                })}
              </g>
            ))}
            {categories.map((c, i) => {
              const p = cat(c) ?? 0;
              const bw = cat.bandwidth();
              const extra = (cat.step() - bw) / 2;
              const d = data[i]!;
              return (
                <rect
                  key={c}
                  {...(horizontal
                    ? { x: left, y: p - extra, width: innerW, height: cat.step() }
                    : { x: p - extra, y: top, width: cat.step(), height: innerH })}
                  fill="transparent"
                  {...stylex.props(tones.cursor, svgText.hit)}
                  {...bind(
                    {
                      title: c,
                      rows: series.map((s, si) => ({
                        label: s.label ?? s.key,
                        value: fmt(value(d, s.key)),
                        tone: seriesTone(s, si),
                      })),
                    },
                    `${c}: ${series.map((s) => `${s.label ?? s.key} ${fmt(value(d, s.key))}`).join(', ')}`,
                  )}
                />
              );
            })}
          </>
        );
      }}
    </ChartFrame>
  );
}
