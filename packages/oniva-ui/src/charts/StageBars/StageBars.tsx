import * as stylex from '@stylexjs/stylex';
import { scaleLinear } from 'd3-scale';
import type { Ref } from 'react';
import { roundedRectPath } from '../../internal/charts-math';
import { chartMotion, svgText, toneStyle, tones } from '../../internal/charts-styles';
import { ChartFrame } from '../_shared/ChartFrame';

export interface Stage {
  id: string;
  label: string;
  tone?: number;
}
export interface StageSegment {
  stage: string;
  /** Minutes from the start of the session. */
  start: number;
  end: number;
}

export interface StageBarsProps {
  /** Rows, top to bottom (e.g. Awake, REM, Light, Deep). */
  stages: Stage[];
  segments: StageSegment[];
  /** Label for minute 0, e.g. "11:10 PM"; used with `startMinutes` to print axis times. */
  startClock?: { hour: number; minute: number };
  /** Total minutes (default: end of last segment). */
  total?: number;
  height?: number;
  label?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const clock = (start: { hour: number; minute: number }, add: number) => {
  const t = (start.hour * 60 + start.minute + add) % 1440;
  const h = Math.floor(t / 60);
  return `${h % 12 || 12}${t % 60 ? `:${String(t % 60).padStart(2, '0')}` : ''} ${h < 12 ? 'AM' : 'PM'}`;
};
const dur = (m: number) => `${Math.floor(m / 60)}h ${m % 60}m`;

/** Hypnogram-style stage timeline: one row per stage, rounded blocks across time. */
export function StageBars({
  stages,
  segments,
  startClock,
  total,
  height,
  label,
  className,
  xstyle,
  ref,
}: StageBarsProps) {
  const T = total ?? Math.max(...segments.map((s) => s.end));
  const rowH = 34;
  const byStage = (id: string) =>
    segments.filter((s) => s.stage === id).reduce((a, s) => a + (s.end - s.start), 0);
  return (
    <ChartFrame
      label={
        label ??
        `Stage timeline over ${dur(T)}: ${stages.map((s) => `${s.label} ${dur(byStage(s.id))}`).join(', ')}`
      }
      height={height ?? stages.length * rowH + 30}
      className={className}
      xstyle={xstyle}
      ref={ref}
      dataTable={{
        columns: ['Stage', 'Start (min)', 'End (min)'],
        rows: segments.map((s) => [
          stages.find((x) => x.id === s.stage)?.label ?? s.stage,
          s.start,
          s.end,
        ]),
      }}
    >
      {({ width, bind }) => {
        const left = Math.max(...stages.map((s) => s.label.length)) * 6.6 + 14;
        const x = scaleLinear()
          .domain([0, T])
          .range([left, width - 6]);
        const ticks = Array.from({ length: Math.floor(T / 120) + 1 }, (_, i) => i * 120);
        return (
          <>
            {stages.map((s, i) => (
              <g key={s.id}>
                <rect
                  x={left}
                  y={i * rowH}
                  width={width - 6 - left}
                  height={rowH - 6}
                  rx={8}
                  fill="currentColor"
                  fillOpacity={0.5}
                  {...stylex.props(tones.track)}
                />
                <text
                  x={left - 10}
                  y={i * rowH + (rowH - 6) / 2}
                  dy="0.32em"
                  textAnchor="end"
                  {...stylex.props(svgText.axis)}
                >
                  {s.label}
                </text>
              </g>
            ))}
            {segments.map((seg, k) => {
              const i = stages.findIndex((s) => s.id === seg.stage);
              if (i < 0) return null;
              const st = stages[i]!;
              const x0 = x(seg.start);
              const w = Math.max(3, x(seg.end) - x0 - 1);
              return (
                <path
                  key={k}
                  d={roundedRectPath(x0, i * rowH, w, rowH - 6, [8, 8, 8, 8])}
                  fill="currentColor"
                  {...stylex.props(toneStyle(st.tone ?? i + 1), svgText.hit, chartMotion.fade)}
                  style={{ animationDelay: `${k * 25}ms` }}
                  {...bind(
                    {
                      title: st.label,
                      rows: [
                        {
                          label: 'Duration',
                          value: dur(seg.end - seg.start),
                          tone: st.tone ?? i + 1,
                        },
                        ...(startClock
                          ? [
                              {
                                label: 'Time',
                                value: `${clock(startClock, seg.start)} – ${clock(startClock, seg.end)}`,
                              },
                            ]
                          : []),
                      ],
                    },
                    `${st.label}: ${dur(seg.end - seg.start)}`,
                  )}
                />
              );
            })}
            {ticks.map((t) => (
              <text
                key={t}
                x={x(t)}
                y={stages.length * rowH + 14}
                textAnchor="middle"
                {...stylex.props(svgText.axis)}
              >
                {startClock ? clock(startClock, t) : `${t / 60}h`}
              </text>
            ))}
          </>
        );
      }}
    </ChartFrame>
  );
}
