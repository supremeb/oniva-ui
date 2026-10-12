import { useLocale } from 'react-aria';
import * as stylex from '@stylexjs/stylex';
import { area, line } from 'd3-shape';
import { useMemo, type Ref } from 'react';
import {
  curveFor,
  makeAxisFormatter,
  makeFormatter,
  seriesTone,
  type ChartDatum,
  type ChartSeries,
  type CurveType,
  type ValueFormat,
} from '../../internal/charts-math';
import { intlOptionsFor, useTweenedData } from '../../internal/charts-motion';
import { chartMotion, svgText, toneStyle, tones } from '../../internal/charts-styles';
import { fillUrl, glowUrl, SeriesDefs, type ChartFill } from '../_shared/ChartDefs';
import { Crosshair, useScrub } from '../_shared/Crosshair';
import { tipRows } from '../_shared/tipRows';
import { XLabels, YGrid } from '../_shared/Axes';
import { layoutCartesian } from '../_shared/cartesian';
import { ChartFrame } from '../_shared/ChartFrame';

export interface AreaChartProps {
  data: ChartDatum[];
  /** Key of the category field (x axis). */
  index: string;
  series: ChartSeries[];
  /** Stack series; `'percent'` normalises to 100%. */
  stacked?: boolean | 'percent';
  curve?: CurveType;
  /** Gradient fade under each line (default true). Shorthand for `fill`. */
  gradient?: boolean;
  /** Fill treatment: solid, gradient, or an SVG pattern (dots, lines, grid). Overrides `gradient`. */
  fill?: ChartFill;
  /** Soft blur glow behind the lines. */
  glow?: boolean;
  valueFormat?: ValueFormat;
  height?: number;
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  /** Accessible summary. */
  label?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function AreaChart({
  data,
  index,
  series,
  stacked = false,
  curve = 'monotone',
  gradient = true,
  fill: fillProp,
  glow = false,
  valueFormat = 'number',
  height = 240,
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  label,
  className,
  xstyle,
  ref,
}: AreaChartProps) {
  const { locale } = useLocale();
  const fmt = makeFormatter(valueFormat, locale);
  const intl = intlOptionsFor(valueFormat);
  const fill: ChartFill = fillProp ?? (gradient ? 'gradient' : 'solid');
  const seriesKeys = useMemo(() => series.map((s) => s.key), [series]);
  const shown = useTweenedData(data, seriesKeys);
  const { hi, wrap } = useScrub();
  const axisFmt =
    stacked === 'percent'
      ? (n: number) => `${Math.round(n * 100)}%`
      : makeAxisFormatter(valueFormat);
  const summary =
    label ??
    `${stacked ? 'Stacked area' : 'Area'} chart of ${series.map((s) => s.label ?? s.key).join(', ')} by ${index}`;
  return (
    <ChartFrame
      label={summary}
      height={height}
      className={className}
      xstyle={xstyle}
      ref={ref}
      dataTable={{
        columns: [index, ...series.map((s) => s.label ?? s.key)],
        rows: data.map((d) => [String(d[index]), ...series.map((s) => fmt(Number(d[s.key]) || 0))]),
      }}
    >
      {({ width, height: h, bind, id }) => {
        const L = layoutCartesian({
          data: shown,
          index,
          series,
          width,
          height: h,
          stacked,
          showXAxis,
          showYAxis,
        });
        const areaGen = (li: number) =>
          area<[number, number]>()
            .x((_, i) => L.x(i))
            .y0((p) => L.y(p[0]))
            .y1((p) => L.y(p[1]))
            .curve(curveFor(curve))(L.layers[li]!.points) ?? '';
        const lineGen = (li: number) =>
          line<[number, number]>()
            .x((_, i) => L.x(i))
            .y((p) => L.y(p[1]))
            .curve(curveFor(curve))(L.layers[li]!.points) ?? '';
        return (
          <>
            <SeriesDefs id={id} series={series} fill={fill} glow={glow} gradient={stacked ? [0.55, 0.25] : [0.4, 0.02]} />
            <YGrid
              ticks={L.ticks}
              y={L.y}
              x1={L.left}
              x2={L.left + L.innerW}
              format={axisFmt}
              labels={showYAxis}
              grid={showGrid}
            />
            {showXAxis && <XLabels items={L.categories} x={L.x} y={L.baseY + 18} />}
            {[...series].reverse().map((s, ri) => {
              const i = series.length - 1 - ri;
              return (
                <g key={s.key} {...stylex.props(toneStyle(seriesTone(s, i)))}>
                  <path
                    d={areaGen(i)}
                    fill={fillUrl(id, i, fill)}
                    fillOpacity={fill !== 'solid' ? 1 : stacked ? 0.8 : 0.15}
                    stroke="none"
                    {...stylex.props(chartMotion.wipe)}
                  />
                  <path
                    d={lineGen(i)}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength={1}
                    filter={glowUrl(id, glow)}
                    {...stylex.props(chartMotion.draw)}
                  />
                </g>
              );
            })}
            <Crosshair
              x={hi != null ? L.x(hi) : null}
              top={L.top}
              bottom={L.baseY}
              series={series}
              ys={hi != null ? L.layers.map((l) => L.y(l.points[hi]?.[1] ?? 0)) : []}
            />
            {data.map((d, i) => (
              <rect
                key={i}
                x={Math.max(L.left, L.x(i) - L.step / 2)}
                y={L.top}
                width={
                  Math.min(L.left + L.innerW, L.x(i) + L.step / 2) -
                  Math.max(L.left, L.x(i) - L.step / 2)
                }
                height={L.innerH}
                {...stylex.props(tones.cursor, svgText.band)}
                {...wrap(
                  bind(
                    {
                      title: L.categories[i],
                      rows: tipRows(series, d, fmt, intl),
                      anchor: { x: L.x(i), y: Math.max(64, Math.min(...L.layers.map((l) => L.y(l.points[i]?.[1] ?? 0)))) },
                    },
                    `${L.categories[i]}: ${series.map((s) => `${s.label ?? s.key} ${fmt(Number(d[s.key]) || 0)}`).join(', ')}`,
                  ),
                  i,
                )}
              />
            ))}
          </>
        );
      }}
    </ChartFrame>
  );
}
