import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { progressStyles } from './ProgressBar';

const styles = stylex.create({
  bar: {
    backgroundColor: colors.chartTrack,
    borderRadius: radius.full,
    display: 'flex',
    gap: 2,
    overflow: 'hidden',
    width: '100%',
  },
  seg: {
    height: '100%',
    transitionDuration: motion.durSlow,
    transitionProperty: 'width',
    transitionTimingFunction: motion.easeStandard,
  },
  legend: {
    color: colors.textMuted,
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: font.size12,
    gap: '4px 16px',
    lineHeight: font.lh12,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  legendItem: { alignItems: 'center', display: 'inline-flex', gap: 6 },
  dot: { borderRadius: radius.full, flexShrink: 0, height: 8, width: 8 },
  num: { color: colors.text, fontVariantNumeric: 'tabular-nums', fontWeight: font.weightMedium },
  c1: { backgroundColor: colors.chart1 },
  c2: { backgroundColor: colors.chart2 },
  c3: { backgroundColor: colors.chart3 },
  c4: { backgroundColor: colors.chart4 },
  c5: { backgroundColor: colors.chart5 },
  c6: { backgroundColor: colors.chart6 },
  c7: { backgroundColor: colors.chart7 },
  c8: { backgroundColor: colors.chart8 },
  c9: { backgroundColor: colors.chart9 },
  c10: { backgroundColor: colors.chart10 },
  success: { backgroundColor: colors.successSolid },
  warning: { backgroundColor: colors.warningSolid },
  danger: { backgroundColor: colors.dangerSolid },
  info: { backgroundColor: colors.infoSolid },
});

export type SegmentColor =
  | 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6' | 'c7' | 'c8' | 'c9' | 'c10'
  | 'success' | 'warning' | 'danger' | 'info';

export interface ProgressSegment {
  id: string;
  label: string;
  value: number;
  /** Chart token (c1-c10) or status color. Defaults cycle through the chart palette. */
  color?: SegmentColor;
  /** Optional formatted value for the legend (e.g. "420k"). */
  display?: string;
}

export interface ProgressSegmentsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children' | 'title'> {
  segments: ProgressSegment[];
  /** Total capacity (e.g. 1,000,000 tokens). Unfilled space stays as track. Defaults to sum. */
  max?: number;
  /** Heading shown above the bar, e.g. "Context window". */
  title?: ReactNode;
  /** Summary shown right of the title, e.g. "820k / 1M (82%)". Auto-generated when omitted and `max` is set. */
  summary?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  showLegend?: boolean;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const cycle: SegmentColor[] = ['c4', 'c1', 'c5', 'c3', 'c8', 'c2'];

/** Multi-segment stacked bar with legend, e.g. "Context window 820k / 1M (82%)". */
export function ProgressSegments({
  segments,
  max,
  title,
  summary,
  size = 'lg',
  showLegend = true,
  className,
  xstyle,
  ref,
  'aria-label': ariaLabel,
  ...rest
}: ProgressSegmentsProps) {
  const sum = segments.reduce((a, s) => a + s.value, 0);
  const total = max ?? sum;
  const pct = total > 0 ? Math.round((sum / total) * 100) : 0;
  const auto = max ? `${sum.toLocaleString('en-US')} / ${max.toLocaleString('en-US')} (${pct}%)` : undefined;
  const sx = stylex.props(progressStyles.root, xstyle);
  return (
    <div
      role="group"
      aria-label={ariaLabel ?? (typeof title === 'string' ? title : 'Usage breakdown')}
      {...rest}
      ref={ref}
      {...sx}
      className={[sx.className, className].filter(Boolean).join(' ')}
    >
      {(title || summary || auto) && (
        <div {...stylex.props(progressStyles.header)}>
          <span>{title}</span>
          <span {...stylex.props(progressStyles.value)}>{summary ?? auto}</span>
        </div>
      )}
      <div
        role="img"
        aria-label={segments
          .map((s) => `${s.label} ${s.display ?? s.value.toLocaleString('en-US')}`)
          .join(', ')}
        {...stylex.props(styles.bar, progressStyles[size])}
      >
        {segments.map((s, i) => (
          <div
            key={s.id}
            {...stylex.props(styles.seg, styles[s.color ?? cycle[i % cycle.length]!])}
            style={{ width: `${total > 0 ? (s.value / total) * 100 : 0}%` }}
          />
        ))}
      </div>
      {showLegend && (
        <ul {...stylex.props(styles.legend)}>
          {segments.map((s, i) => (
            <li key={s.id} {...stylex.props(styles.legendItem)}>
              <span
                aria-hidden="true"
                {...stylex.props(styles.dot, styles[s.color ?? cycle[i % cycle.length]!])}
              />
              {s.label}
              <span {...stylex.props(styles.num)}>{s.display ?? s.value.toLocaleString('en-US')}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
