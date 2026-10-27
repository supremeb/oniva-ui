import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';

/** Drafting primitives: hairlines, dimension lines from a datum, tabular figures with lighter units. All flat. */
export const d = stylex.create({
  svg: { display: 'block', fontVariantNumeric: 'tabular-nums', height: 'auto', overflow: 'visible', width: '100%' },
  hair: { fill: 'none', stroke: colors['--oniva-color-border-hover'], strokeWidth: 1 },
  faint: { fill: 'none', stroke: colors['--oniva-color-border'], strokeWidth: 1 },
  dash: { fill: 'none', stroke: colors['--oniva-color-border-hover'], strokeDasharray: '3 3', strokeWidth: 1 },
  dim: { fill: 'none', stroke: colors['--oniva-color-text-muted'], strokeWidth: 1 },
  ink: { fill: 'none', stroke: colors['--oniva-color-text'], strokeWidth: 1.25 },
  inkFill: { fill: colors['--oniva-color-text'], stroke: 'none' },
  tick: { fill: colors['--oniva-color-text-muted'], stroke: 'none' },
  text: { fill: colors['--oniva-color-text-muted'], fontFamily: font['--oniva-font-sans'], fontSize: 11 },
  num: { fill: colors['--oniva-color-text'], fontFamily: font['--oniva-font-sans'], fontSize: 11 },
  unit: { fill: colors['--oniva-color-text-subtle'], opacity: 0.7 },
  mono: { fontFamily: font['--oniva-font-mono'], fontSize: 10.5 },
  ghost: { fill: 'none', stroke: colors['--oniva-color-border-hover'], strokeDasharray: '2 3', strokeWidth: 1 },
});

const vec = { vectorEffect: 'non-scaling-stroke' } as const;

/** A figure with its unit set lighter. */
export function U({ v, u }: { v: ReactNode; u: string }) {
  return (
    <>
      {v}
      <tspan {...stylex.props(d.unit)}>{u}</tspan>
    </>
  );
}

/** Horizontal dimension: extension lines drop from `from`, a line between, a slash at each end, the figure above or below. */
export function HDim({ x1, x2, y, from, label, below = false, hide = false }: { x1: number; x2: number; y: number; from: number; label?: ReactNode; below?: boolean; hide?: boolean }) {
  const s = 3;
  const dir = from < y ? 1 : -1;
  return (
    <g aria-hidden="true">
      <path d={`M${x1} ${from}V${y + dir * 3}M${x2} ${from}V${y + dir * 3}`} {...stylex.props(d.hair)} {...vec} />
      <path d={`M${x1} ${y}H${x2}M${x1 - s} ${y + s}L${x1 + s} ${y - s}M${x2 - s} ${y + s}L${x2 + s} ${y - s}`} {...stylex.props(d.dim)} {...vec} />
      {!hide && label != null && (
        <text x={(x1 + x2) / 2} y={below ? y + 14 : y - 5} textAnchor="middle" {...stylex.props(d.text)}>
          {label}
        </text>
      )}
    </g>
  );
}

/** Vertical dimension: extension lines run sideways from `from`, a line between, a slash at each end, the figure beside it. */
export function VDim({ y1, y2, x, from, label, left = false }: { y1: number; y2: number; x: number; from: number; label?: ReactNode; left?: boolean }) {
  const s = 3;
  const dir = from < x ? 1 : -1;
  return (
    <g aria-hidden="true">
      <path d={`M${from} ${y1}H${x + dir * 3}M${from} ${y2}H${x + dir * 3}`} {...stylex.props(d.hair)} {...vec} />
      <path d={`M${x} ${y1}V${y2}M${x - s} ${y1 + s}L${x + s} ${y1 - s}M${x - s} ${y2 + s}L${x + s} ${y2 - s}`} {...stylex.props(d.dim)} {...vec} />
      {label != null && (
        <text x={left ? x - 6 : x + 6} y={(y1 + y2) / 2} dominantBaseline="central" textAnchor={left ? 'end' : 'start'} {...stylex.props(d.text)}>
          {label}
        </text>
      )}
    </g>
  );
}

export const vectorEffect = vec;
