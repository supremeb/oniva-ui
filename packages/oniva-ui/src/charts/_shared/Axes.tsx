import * as stylex from '@stylexjs/stylex';
import { svgText } from '../../internal/charts-styles';

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** Horizontal grid lines + left value labels. `y` maps a value to a pixel. */
export function YGrid({
  ticks,
  y,
  x1,
  x2,
  format,
  labels = true,
  grid = true,
}: {
  ticks: number[];
  y: (v: number) => number;
  x1: number;
  x2: number;
  format: (n: number) => string;
  labels?: boolean;
  grid?: boolean;
}) {
  return (
    <g aria-hidden="true">
      {ticks.map((t) => (
        <g key={t}>
          {grid && (
            <line
              x1={x1}
              x2={x2}
              y1={y(t)}
              y2={y(t)}
              strokeDasharray={t === 0 ? undefined : '3 4'}
              strokeWidth={1}
              {...stylex.props(svgText.grid)}
            />
          )}
          {labels && (
            <text x={x1 - 8} y={y(t)} dy="0.32em" textAnchor="end" {...stylex.props(svgText.axis)}>
              {format(t)}
            </text>
          )}
        </g>
      ))}
    </g>
  );
}

/** Category labels along the bottom. Thins labels automatically when crowded. */
export function XLabels({
  items,
  x,
  y,
  minGap = 44,
}: {
  items: string[];
  x: (i: number) => number;
  y: number;
  minGap?: number;
}) {
  const n = items.length;
  const span = n > 1 ? Math.abs(x(1) - x(0)) : minGap;
  const step = Math.max(1, Math.ceil(minGap / Math.max(span, 1)));
  return (
    <g aria-hidden="true">
      {items.map((t, i) =>
        i % step === 0 ? (
          <text key={i} x={x(i)} y={y} textAnchor="middle" {...stylex.props(svgText.axis)}>
            {t}
          </text>
        ) : null,
      )}
    </g>
  );
}
