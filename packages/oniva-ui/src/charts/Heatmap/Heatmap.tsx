import * as stylex from '@stylexjs/stylex';
import type { Ref } from 'react';
import { clamp } from '../../internal/charts-math';
import { chartMotion, svgText, toneStyle, tones } from '../../internal/charts-styles';
import { ChartFrame } from '../_shared/ChartFrame';

const LEVELS = [0.22, 0.42, 0.68, 1];
function level(v: number, max: number) {
  if (v <= 0) return -1;
  return Math.min(3, Math.floor((v / (max || 1)) * 4 - 1e-9));
}

export interface HeatmapProps {
  /** `values[row][col]`. */
  values: number[][];
  rows: string[];
  columns: string[];
  tone?: number;
  /** Unit shown in tooltips, e.g. "commits". */
  unit?: string;
  height?: number;
  label?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Matrix heatmap (e.g. activity by weekday and hour). Intensity scales the tone's opacity. */
export function Heatmap({
  values,
  rows,
  columns,
  tone = 5,
  unit = '',
  height,
  label,
  className,
  xstyle,
  ref,
}: HeatmapProps) {
  const max = Math.max(1, ...values.flat());
  const rowH = 26;
  return (
    <ChartFrame
      label={
        label ??
        `Heatmap of ${rows.length} rows by ${columns.length} columns, peak ${max}${unit ? ` ${unit}` : ''}`
      }
      height={height ?? rows.length * rowH + 28}
      className={className}
      xstyle={xstyle}
      ref={ref}
      dataTable={{
        columns: ['', ...columns],
        rows: rows.map((r, i) => [r, ...columns.map((_, j) => values[i]?.[j] ?? 0)]),
      }}
    >
      {({ width, bind }) => {
        const left = Math.max(...rows.map((r) => r.length)) * 6.5 + 12;
        const gap = 4;
        const cw = (width - left - gap * (columns.length - 1)) / columns.length;
        return (
          <g>
            {columns.map((c, j) => (
              <text
                key={c}
                x={left + j * (cw + gap) + cw / 2}
                y={rows.length * rowH + 16}
                textAnchor="middle"
                {...stylex.props(svgText.axis)}
              >
                {c}
              </text>
            ))}
            {rows.map((r, i) => (
              <g key={r}>
                <text
                  x={left - 10}
                  y={i * rowH + (rowH - gap) / 2}
                  dy="0.32em"
                  textAnchor="end"
                  {...stylex.props(svgText.axis)}
                >
                  {r}
                </text>
                {columns.map((c, j) => {
                  const v = values[i]?.[j] ?? 0;
                  const lv = level(v, max);
                  return (
                    <rect
                      key={c}
                      x={left + j * (cw + gap)}
                      y={i * rowH}
                      width={Math.max(2, cw)}
                      height={rowH - gap}
                      rx={6}
                      fill="currentColor"
                      fillOpacity={lv < 0 ? 1 : LEVELS[lv]}
                      {...stylex.props(
                        lv < 0 ? tones.track : toneStyle(tone),
                        svgText.hit,
                        chartMotion.fade,
                      )}
                      style={{ animationDelay: `${(i + j) * 12}ms` }}
                      {...bind(
                        { title: `${r}, ${c}`, rows: [{ label: unit || 'Value', value: v, tone }] },
                        `${r}, ${c}: ${v}${unit ? ` ${unit}` : ''}`,
                      )}
                    />
                  );
                })}
              </g>
            ))}
          </g>
        );
      }}
    </ChartFrame>
  );
}

export interface ContributionDay {
  /** ISO date `YYYY-MM-DD`. */
  date: string;
  value: number;
}

export interface ContributionHeatmapProps {
  data: ContributionDay[];
  /** `yearly` = last 53 weeks, `monthly` = last 5 weeks, `weekly` = last 7 days. */
  range?: 'weekly' | 'monthly' | 'yearly';
  tone?: number;
  /** Singular noun for tooltips. */
  unit?: string;
  showLegend?: boolean;
  label?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const parse = (s: string) => {
  const [y, m, d] = s.split('-').map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d));
};
const fullDate = (d: Date) =>
  `${DOW[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;

/** GitHub-style contribution calendar with Weekly / Monthly / Yearly ranges. */
export function ContributionHeatmap({
  data,
  range = 'yearly',
  tone = 5,
  unit = 'contribution',
  showLegend = true,
  label,
  className,
  xstyle,
  ref,
}: ContributionHeatmapProps) {
  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));
  const days = range === 'weekly' ? 7 : range === 'monthly' ? 35 : 371;
  const slice = sorted.slice(-days);
  const total = slice.reduce((s, d) => s + d.value, 0);
  const max = Math.max(1, ...slice.map((d) => d.value));
  const weekly = range === 'weekly';
  const startDow = !weekly && slice[0] ? parse(slice[0].date).getUTCDay() : 0;
  const weeks = weekly ? slice.length : Math.ceil((slice.length + startDow) / 7);
  const rowsN = weekly ? 1 : 7;
  const gap = range === 'yearly' ? 3 : 5;
  return (
    <ChartFrame
      label={
        label ??
        `Contribution calendar, ${total} ${unit}${total === 1 ? '' : 's'} over the last ${range === 'yearly' ? 'year' : range === 'monthly' ? '5 weeks' : '7 days'}`
      }
      height={(w) => {
        const left = weekly ? 0 : range === 'yearly' ? 30 : 34;
        const cell = clamp((w - left - gap * (weeks - 1)) / weeks, 4, weekly ? 56 : 28);
        return (weekly ? 8 : 22) + rowsN * (cell + gap) + (weekly ? 22 : 0) + (showLegend ? 28 : 0);
      }}
      className={className}
      xstyle={xstyle}
      ref={ref}
      dataTable={{ columns: ['Date', unit], rows: slice.map((d) => [d.date, d.value]) }}
    >
      {({ width, bind }) => {
        const left = weekly ? 0 : range === 'yearly' ? 30 : 34;
        const cell = clamp((width - left - gap * (weeks - 1)) / weeks, 4, weekly ? 56 : 28);
        const top = weekly ? 8 : 22;
        const monthMarks: { col: number; text: string }[] = [];
        let lastMonth = -1;
        slice.forEach((d, i) => {
          const dt = parse(d.date);
          const col = Math.floor((i + startDow) / 7);
          if (dt.getUTCMonth() !== lastMonth && (dt.getUTCDate() <= 7 || i === 0)) {
            if (!monthMarks.length || col - monthMarks[monthMarks.length - 1]!.col >= 3)
              monthMarks.push({ col, text: MONTHS[dt.getUTCMonth()]! });
            lastMonth = dt.getUTCMonth();
          }
        });
        const gridW = weeks * (cell + gap) - gap;
        return (
          <>
            {!weekly &&
              monthMarks.map((m) => (
                <text
                  key={m.col}
                  x={left + m.col * (cell + gap)}
                  y={12}
                  {...stylex.props(svgText.axis)}
                >
                  {m.text}
                </text>
              ))}
            {!weekly &&
              [1, 3, 5].map((d) => (
                <text
                  key={d}
                  x={left - 8}
                  y={top + d * (cell + gap) + cell / 2}
                  dy="0.32em"
                  textAnchor="end"
                  {...stylex.props(svgText.axis)}
                >
                  {DOW[d]}
                </text>
              ))}
            {weekly &&
              slice.map((d, i) => (
                <text
                  key={d.date}
                  x={i * (cell + gap) + cell / 2}
                  y={top + cell + gap + 12}
                  textAnchor="middle"
                  {...stylex.props(svgText.axis)}
                >
                  {DOW[parse(d.date).getUTCDay()]}
                </text>
              ))}
            {slice.map((d, i) => {
              const idx = i + startDow;
              const col = weekly ? i : Math.floor(idx / 7);
              const row = weekly ? 0 : idx % 7;
              const lv = level(d.value, max);
              const dt = parse(d.date);
              return (
                <rect
                  key={d.date}
                  x={left + col * (cell + gap)}
                  y={top + row * (cell + gap)}
                  width={cell}
                  height={cell}
                  rx={Math.min(5, cell / 3)}
                  fill="currentColor"
                  fillOpacity={lv < 0 ? 1 : LEVELS[lv]}
                  {...stylex.props(
                    lv < 0 ? tones.track : toneStyle(tone),
                    svgText.hit,
                    chartMotion.fade,
                  )}
                  style={{ animationDelay: `${col * 8}ms` }}
                  {...bind(
                    { title: fullDate(dt), rows: [{ label: `${unit}s`, value: d.value, tone }] },
                    `${fullDate(dt)}: ${d.value} ${unit}${d.value === 1 ? '' : 's'}`,
                  )}
                />
              );
            })}
            {showLegend && (
              <g
                aria-hidden="true"
                transform={`translate(${Math.max(left, left + gridW - 148)},${top + rowsN * (cell + gap) + 6 + (weekly ? 22 : 0)})`}
              >
                <text x={0} y={10} {...stylex.props(svgText.axis)}>
                  Less
                </text>
                {[-1, 0, 1, 2, 3].map((l, k) => (
                  <rect
                    key={l}
                    x={32 + k * 17}
                    y={0}
                    width={12}
                    height={12}
                    rx={4}
                    fill="currentColor"
                    fillOpacity={l < 0 ? 1 : LEVELS[l]}
                    {...stylex.props(l < 0 ? tones.track : toneStyle(tone))}
                  />
                ))}
                <text x={32 + 5 * 17 + 4} y={10} {...stylex.props(svgText.axis)}>
                  More
                </text>
              </g>
            )}
          </>
        );
      }}
    </ChartFrame>
  );
}
