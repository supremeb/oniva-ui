import * as stylex from '@stylexjs/stylex';
import { line } from 'd3-shape';
import type { Ref } from 'react';
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
import { chartMotion, svgText, toneStyle, tones } from '../../internal/charts-styles';
import { XLabels, YGrid } from '../_shared/Axes';
import { layoutCartesian } from '../_shared/cartesian';
import { ChartFrame } from '../_shared/ChartFrame';

export interface LineChartProps {
  data: ChartDatum[];
  index: string;
  series: ChartSeries[];
  curve?: CurveType;
  /** Draw a dot on every data point. */
  dots?: boolean;
  valueFormat?: ValueFormat;
  height?: number;
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  /** Fix the y-axis range instead of 0..max. */
  domain?: [number, number];
  label?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function LineChart({
  data,
  index,
  series,
  curve = 'monotone',
  dots = true,
  valueFormat = 'number',
  height = 240,
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  domain,
  label,
  className,
  xstyle,
  ref,
}: LineChartProps) {
  const fmt = makeFormatter(valueFormat);
  const axisFmt = makeAxisFormatter(valueFormat);
  return (
    <ChartFrame
      label={label ?? `Line chart of ${series.map((s) => s.label ?? s.key).join(', ')} by ${index}`}
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
        const L = layoutCartesian({
          data,
          index,
          series,
          width,
          height: h,
          showXAxis,
          showYAxis,
          domain,
          headroom: 1.05,
        });
        return (
          <>
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
            {series.map((s, i) => {
              const d =
                line<[number, number]>()
                  .x((_, k) => L.x(k))
                  .y((p) => L.y(p[1]))
                  .curve(curveFor(curve))(L.layers[i]!.points) ?? '';
              return (
                <g key={s.key} {...stylex.props(toneStyle(seriesTone(s, i)))}>
                  <path
                    d={d}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.25}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength={1}
                    {...stylex.props(chartMotion.draw)}
                  />
                  {dots &&
                    L.layers[i]!.points.map((p, k) => (
                      <circle
                        key={k}
                        cx={L.x(k)}
                        cy={L.y(p[1])}
                        r={3.5}
                        fill="currentColor"
                        strokeWidth={2}
                        {...stylex.props(svgText.dotRing, chartMotion.pop)}
                        style={{ animationDelay: `${300 + k * 30}ms` }}
                      />
                    ))}
                </g>
              );
            })}
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
                {...bind(
                  {
                    title: L.categories[i],
                    rows: series.map((s, si) => ({
                      label: s.label ?? s.key,
                      value: fmt(Number(d[s.key]) || 0),
                      tone: seriesTone(s, si),
                    })),
                  },
                  `${L.categories[i]}: ${series.map((s) => `${s.label ?? s.key} ${fmt(Number(d[s.key]) || 0)}`).join(', ')}`,
                )}
              />
            ))}
          </>
        );
      }}
    </ChartFrame>
  );
}
