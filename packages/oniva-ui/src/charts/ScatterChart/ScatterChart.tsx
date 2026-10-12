import * as stylex from '@stylexjs/stylex';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import type { Ref } from 'react';
import {
  makeAxisFormatter,
  makeFormatter,
  niceTicks,
  type ChartDatum,
  type ValueFormat,
} from '../../internal/charts-math';
import { chartMotion, svgText, toneStyle } from '../../internal/charts-styles';
import { YGrid } from '../_shared/Axes';
import { ChartFrame } from '../_shared/ChartFrame';

export interface ScatterChartProps {
  data: ChartDatum[];
  xKey: string;
  yKey: string;
  /** Numeric field mapped to bubble area. Omit for uniform dots. */
  sizeKey?: string;
  /** Field that picks the palette colour (distinct values → chart1..). */
  groupKey?: string;
  /** Field used as the point name in tooltips. */
  nameKey?: string;
  xLabel?: string;
  yLabel?: string;
  xFormat?: ValueFormat;
  yFormat?: ValueFormat;
  sizeLabel?: string;
  height?: number;
  label?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function ScatterChart({
  data,
  xKey,
  yKey,
  sizeKey,
  groupKey,
  nameKey,
  xLabel,
  yLabel,
  xFormat = 'number',
  yFormat = 'number',
  sizeLabel,
  height = 300,
  label,
  className,
  xstyle,
  ref,
}: ScatterChartProps) {
  const fx = makeFormatter(xFormat);
  const fy = makeFormatter(yFormat);
  const groups = groupKey ? [...new Set(data.map((d) => String(d[groupKey])))] : [];
  const num = (d: ChartDatum, k: string) => Number(d[k]) || 0;
  return (
    <ChartFrame
      label={
        label ??
        `${sizeKey ? 'Bubble' : 'Scatter'} chart of ${yLabel ?? yKey} against ${xLabel ?? xKey}, ${data.length} points`
      }
      height={height}
      className={className}
      xstyle={xstyle}
      ref={ref}
      dataTable={{
        columns: [
          nameKey ?? 'Point',
          xLabel ?? xKey,
          yLabel ?? yKey,
          ...(sizeKey ? [sizeLabel ?? sizeKey] : []),
        ],
        rows: data.map((d, i) => [
          nameKey ? String(d[nameKey]) : `#${i + 1}`,
          fx(num(d, xKey)),
          fy(num(d, yKey)),
          ...(sizeKey ? [num(d, sizeKey)] : []),
        ]),
      }}
    >
      {({ width, height: h, bind }) => {
        const left = 52;
        const right = 16;
        const top = 12;
        const bottom = 44;
        const innerW = width - left - right;
        const innerH = h - top - bottom;
        const xt = niceTicks(Math.max(...data.map((d) => num(d, xKey))), 5);
        const yt = niceTicks(Math.max(...data.map((d) => num(d, yKey))), 4);
        const x = scaleLinear()
          .domain(xt.domain)
          .range([left, left + innerW]);
        const y = scaleLinear()
          .domain(yt.domain)
          .range([top + innerH, top]);
        const sMax = sizeKey ? Math.max(...data.map((d) => num(d, sizeKey))) : 1;
        const r = scaleSqrt()
          .domain([0, sMax])
          .range([4, Math.min(22, innerH / 10)]);
        const axx = makeAxisFormatter(xFormat);
        return (
          <>
            <YGrid
              ticks={yt.ticks}
              y={y}
              x1={left}
              x2={left + innerW}
              format={makeAxisFormatter(yFormat)}
            />
            <g aria-hidden="true">
              {xt.ticks.map((t) => (
                <text
                  key={t}
                  x={x(t)}
                  y={top + innerH + 18}
                  textAnchor="middle"
                  {...stylex.props(svgText.axis)}
                >
                  {axx(t)}
                </text>
              ))}
              {xLabel && (
                <text
                  x={left + innerW / 2}
                  y={h - 6}
                  textAnchor="middle"
                  {...stylex.props(svgText.axis)}
                >
                  {xLabel}
                </text>
              )}
              {yLabel && (
                <text
                  transform={`translate(12,${top + innerH / 2}) rotate(-90)`}
                  textAnchor="middle"
                  {...stylex.props(svgText.axis)}
                >
                  {yLabel}
                </text>
              )}
            </g>
            {data.map((d, i) => {
              const tone = groupKey ? groups.indexOf(String(d[groupKey])) + 1 : 6;
              const name = nameKey ? String(d[nameKey]) : `Point ${i + 1}`;
              return (
                <circle
                  key={i}
                  cx={x(num(d, xKey))}
                  cy={y(num(d, yKey))}
                  r={sizeKey ? r(num(d, sizeKey)) : 6}
                  fill="currentColor"
                  fillOpacity={sizeKey ? 0.55 : 0.85}
                  stroke="currentColor"
                  strokeWidth={1.5}
                  {...stylex.props(toneStyle(tone), svgText.hit, chartMotion.pop)}
                  style={{ animationDelay: `${i * 30}ms` }}
                  {...bind(
                    {
                      title: name,
                      rows: [
                        { label: xLabel ?? xKey, value: fx(num(d, xKey)), tone },
                        { label: yLabel ?? yKey, value: fy(num(d, yKey)) },
                        ...(sizeKey
                          ? [{ label: sizeLabel ?? sizeKey, value: num(d, sizeKey) }]
                          : []),
                      ],
                    },
                    `${name}: ${xLabel ?? xKey} ${fx(num(d, xKey))}, ${yLabel ?? yKey} ${fy(num(d, yKey))}`,
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
