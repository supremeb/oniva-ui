import * as stylex from '@stylexjs/stylex';
import { scaleBand, scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import type { Ref } from 'react';
import {
  curveFor,
  makeAxisFormatter,
  makeFormatter,
  niceTicks,
  roundedRectPath,
  seriesTone,
  type ChartDatum,
  type ChartSeries,
  type CurveType,
  type ValueFormat,
} from '../../internal/charts-math';
import { chartMotion, svgText, toneStyle, tones } from '../../internal/charts-styles';
import { YGrid } from '../_shared/Axes';
import { ChartFrame } from '../_shared/ChartFrame';

export interface ComboChartProps {
  data: ChartDatum[];
  index: string;
  /** Series drawn as bars on the left axis. */
  bars: ChartSeries[];
  /** Series drawn as lines (right axis when `dualAxis`). */
  lines: ChartSeries[];
  barFormat?: ValueFormat;
  lineFormat?: ValueFormat;
  /** Give lines their own right-hand axis (default true). */
  dualAxis?: boolean;
  curve?: CurveType;
  height?: number;
  label?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function ComboChart({
  data,
  index,
  bars,
  lines,
  barFormat = 'currency',
  lineFormat = 'percent',
  dualAxis = true,
  curve = 'monotone',
  height = 260,
  label,
  className,
  xstyle,
  ref,
}: ComboChartProps) {
  const fb = makeFormatter(barFormat);
  const fl = makeFormatter(lineFormat);
  const all = [...bars, ...lines];
  return (
    <ChartFrame
      label={
        label ??
        `Combo chart: ${bars.map((s) => s.label ?? s.key).join(', ')} as bars, ${lines.map((s) => s.label ?? s.key).join(', ')} as lines, by ${index}`
      }
      height={height}
      className={className}
      xstyle={xstyle}
      ref={ref}
      dataTable={{
        columns: [index, ...all.map((s) => s.label ?? s.key)],
        rows: data.map((d) => [
          String(d[index]),
          ...bars.map((s) => fb(Number(d[s.key]) || 0)),
          ...lines.map((s) => fl(Number(d[s.key]) || 0)),
        ]),
      }}
    >
      {({ width, height: h, bind }) => {
        const left = 48;
        const right = dualAxis ? 44 : 12;
        const top = 10;
        const bottom = 28;
        const innerW = Math.max(10, width - left - right);
        const innerH = Math.max(10, h - top - bottom);
        const cats = data.map((d) => String(d[index]));
        const num = (d: ChartDatum, k: string) => Number(d[k]) || 0;
        const barMax = Math.max(0, ...data.flatMap((d) => bars.map((s) => num(d, s.key))));
        const lineMax = Math.max(0, ...data.flatMap((d) => lines.map((s) => num(d, s.key))));
        const bn = niceTicks(barMax, 4);
        const ln = dualAxis ? niceTicks(lineMax, 4) : bn;
        const yb = scaleLinear()
          .domain(bn.domain)
          .range([top + innerH, top]);
        const yl = dualAxis
          ? scaleLinear()
              .domain(ln.domain)
              .range([top + innerH, top])
          : yb;
        const cat = scaleBand<string>()
          .domain(cats)
          .range([left, left + innerW])
          .padding(0.3);
        const sub = scaleBand<string>()
          .domain(bars.map((s) => s.key))
          .range([0, cat.bandwidth()])
          .padding(bars.length > 1 ? 0.12 : 0);
        const cx = (i: number) => (cat(cats[i]!) ?? 0) + cat.bandwidth() / 2;
        const r = Math.min(6, sub.bandwidth() / 2);
        const lineTicks =
          ln.ticks.length === bn.ticks.length
            ? ln.ticks
            : bn.ticks.map(
                (_, i) =>
                  ln.domain[0] + ((ln.domain[1] - ln.domain[0]) * i) / (bn.ticks.length - 1),
              );
        return (
          <>
            <YGrid
              ticks={bn.ticks}
              y={yb}
              x1={left}
              x2={left + innerW}
              format={makeAxisFormatter(barFormat)}
            />
            {dualAxis && (
              <g aria-hidden="true">
                {lineTicks.map((t, i) => (
                  <text
                    key={i}
                    x={left + innerW + 8}
                    y={yb(bn.ticks[i] ?? 0)}
                    dy="0.32em"
                    {...stylex.props(svgText.axis)}
                  >
                    {makeAxisFormatter(lineFormat)(t)}
                  </text>
                ))}
              </g>
            )}
            <g aria-hidden="true">
              {cats.map((c, i) => (
                <text
                  key={c}
                  x={cx(i)}
                  y={top + innerH + 18}
                  textAnchor="middle"
                  {...stylex.props(svgText.axis)}
                >
                  {c}
                </text>
              ))}
            </g>
            {bars.map((s, si) => (
              <g key={s.key} {...stylex.props(toneStyle(seriesTone(s, si)))}>
                {data.map((d, i) => {
                  const v = num(d, s.key);
                  const x = (cat(cats[i]!) ?? 0) + (sub(s.key) ?? 0);
                  return (
                    <path
                      key={i}
                      d={roundedRectPath(x, yb(v), sub.bandwidth(), Math.max(1, yb(0) - yb(v)), [
                        r,
                        r,
                        0,
                        0,
                      ])}
                      fill="currentColor"
                      fillOpacity={0.9}
                      {...stylex.props(chartMotion.grow)}
                      style={{ animationDelay: `${i * 40}ms` }}
                    />
                  );
                })}
              </g>
            ))}
            {lines.map((s, li) => {
              const tone = seriesTone(s, bars.length + li);
              const d =
                line<ChartDatum>()
                  .x((_, i) => cx(i))
                  .y((p) => yl(num(p, s.key)))
                  .curve(curveFor(curve))(data) ?? '';
              return (
                <g key={s.key} {...stylex.props(toneStyle(tone))}>
                  <path
                    d={d}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    pathLength={1}
                    {...stylex.props(chartMotion.draw)}
                  />
                  {data.map((p, i) => (
                    <circle
                      key={i}
                      cx={cx(i)}
                      cy={yl(num(p, s.key))}
                      r={3.5}
                      fill="currentColor"
                      strokeWidth={2}
                      {...stylex.props(svgText.dotRing, chartMotion.pop)}
                      style={{ animationDelay: `${400 + i * 30}ms` }}
                    />
                  ))}
                </g>
              );
            })}
            {data.map((d, i) => (
              <rect
                key={i}
                x={cx(i) - cat.step() / 2}
                y={top}
                width={cat.step()}
                height={innerH}
                {...stylex.props(tones.cursor, svgText.band)}
                {...bind(
                  {
                    title: cats[i],
                    rows: [
                      ...bars.map((s, si) => ({
                        label: s.label ?? s.key,
                        value: fb(num(d, s.key)),
                        tone: seriesTone(s, si),
                      })),
                      ...lines.map((s, li) => ({
                        label: s.label ?? s.key,
                        value: fl(num(d, s.key)),
                        tone: seriesTone(s, bars.length + li),
                      })),
                    ],
                  },
                  `${cats[i]}: ${bars.map((s) => `${s.label ?? s.key} ${fb(num(d, s.key))}`).join(', ')}, ${lines.map((s) => `${s.label ?? s.key} ${fl(num(d, s.key))}`).join(', ')}`,
                )}
              />
            ))}
          </>
        );
      }}
    </ChartFrame>
  );
}
