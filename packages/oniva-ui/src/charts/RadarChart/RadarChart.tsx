import { useLocale } from 'react-aria';
import * as stylex from '@stylexjs/stylex';
import type { Ref } from 'react';
import {
  makeFormatter,
  seriesTone,
  type ChartDatum,
  type ChartSeries,
  type ValueFormat,
} from '../../internal/charts-math';
import { chartMotion, svgText, toneStyle } from '../../internal/charts-styles';
import { ChartFrame } from '../_shared/ChartFrame';

export interface RadarChartProps {
  data: ChartDatum[];
  /** Key of the axis-name field. */
  index: string;
  /** One polygon per series; pass two to compare. */
  series: ChartSeries[];
  /** Value at the outer ring (default: max of the data, rounded up to 10). */
  max?: number;
  levels?: number;
  valueFormat?: ValueFormat;
  height?: number;
  label?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function RadarChart({
  data,
  index,
  series,
  max,
  levels = 4,
  valueFormat = 'number',
  height = 300,
  label,
  className,
  xstyle,
  ref,
}: RadarChartProps) {
  const { locale } = useLocale();
  const fmt = makeFormatter(valueFormat, locale);
  const n = data.length;
  const num = (d: ChartDatum, k: string) => Number(d[k]) || 0;
  const top =
    max ??
    Math.ceil(Math.max(1, ...data.flatMap((d) => series.map((s) => num(d, s.key)))) / 10) * 10;
  return (
    <ChartFrame
      label={
        label ??
        `Radar chart comparing ${series.map((s) => s.label ?? s.key).join(' and ')} across ${data.map((d) => d[index]).join(', ')}`
      }
      height={height}
      className={className}
      xstyle={xstyle}
      ref={ref}
      dataTable={{
        columns: [index, ...series.map((s) => s.label ?? s.key)],
        rows: data.map((d) => [String(d[index]), ...series.map((s) => fmt(num(d, s.key)))]),
      }}
    >
      {({ width, height: h, bind }) => {
        const cx = width / 2;
        const cy = h / 2;
        const R = Math.max(40, Math.min(width / 2 - 56, h / 2 - 28));
        const ang = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
        const pt = (i: number, v: number): [number, number] => [
          cx + Math.cos(ang(i)) * R * (v / top),
          cy + Math.sin(ang(i)) * R * (v / top),
        ];
        const ring = (f: number) =>
          Array.from({ length: n }, (_, i) => pt(i, top * f).join(',')).join(' ');
        return (
          <>
            <g aria-hidden="true" fill="none" strokeWidth={1}>
              {Array.from({ length: levels }, (_, l) => (
                <polygon
                  key={l}
                  points={ring((l + 1) / levels)}
                  strokeDasharray={l === levels - 1 ? undefined : '3 4'}
                  {...stylex.props(svgText.grid)}
                />
              ))}
              {data.map((_, i) => (
                <line
                  key={i}
                  x1={cx}
                  y1={cy}
                  x2={pt(i, top)[0]}
                  y2={pt(i, top)[1]}
                  {...stylex.props(svgText.grid)}
                />
              ))}
              {data.map((d, i) => {
                const [lx, ly] = [
                  cx + Math.cos(ang(i)) * (R + 16),
                  cy + Math.sin(ang(i)) * (R + 16),
                ];
                const c = Math.cos(ang(i));
                return (
                  <text
                    key={i}
                    x={lx}
                    y={ly}
                    dy="0.32em"
                    textAnchor={Math.abs(c) < 0.2 ? 'middle' : c > 0 ? 'start' : 'end'}
                    stroke="none"
                    {...stylex.props(svgText.axis)}
                  >
                    {String(d[index])}
                  </text>
                );
              })}
            </g>
            {series.map((s, si) => {
              const tone = seriesTone(s, si);
              const pts = data.map((d, i) => pt(i, num(d, s.key)));
              return (
                <g key={s.key} {...stylex.props(toneStyle(tone))}>
                  <polygon
                    points={pts.map((p) => p.join(',')).join(' ')}
                    fill="currentColor"
                    fillOpacity={0.18}
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinejoin="round"
                    {...stylex.props(chartMotion.pop)}
                  />
                  {pts.map((p, i) => (
                    <circle
                      key={i}
                      cx={p[0]}
                      cy={p[1]}
                      r={4}
                      fill="currentColor"
                      strokeWidth={2}
                      {...stylex.props(svgText.dotRing, svgText.hit)}
                      {...bind(
                        {
                          title: String(data[i]![index]),
                          rows: series.map((o, oi) => ({
                            label: o.label ?? o.key,
                            value: fmt(num(data[i]!, o.key)),
                            tone: seriesTone(o, oi),
                          })),
                        },
                        `${data[i]![index]}: ${series.map((o) => `${o.label ?? o.key} ${fmt(num(data[i]!, o.key))}`).join(', ')}`,
                      )}
                    />
                  ))}
                </g>
              );
            })}
          </>
        );
      }}
    </ChartFrame>
  );
}
