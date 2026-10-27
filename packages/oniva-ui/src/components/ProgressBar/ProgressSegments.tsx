import * as stylex from '@stylexjs/stylex';
import type { ControlSize } from '../../internal/types';
import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import { createFormatters, useFormatters } from '../../internal/format';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { progressStyles } from './ProgressBar';

const styles = stylex.create({
  bar: {
    backgroundColor: colors['--oniva-color-chart-track'],
    borderRadius: radius['--oniva-radius-full'],
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  /** Absolutely positioned full-width layer; `--oniva-off` / `--oniva-p` (0-1) place and size it via transform only. */
  seg: {
    height: '100%',
    insetBlockStart: 0,
    insetInlineStart: 0,
    position: 'absolute',
    transform: 'translateX(calc(var(--oniva-off, 0) * 100%)) scaleX(var(--oniva-p, 0))',
    transformOrigin: 'left center',
    transitionDuration: motion['--oniva-motion-dur-slower'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '100%',
  },
  legend: {
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: font['--oniva-font-size-12'],
    gap: '4px 16px',
    lineHeight: font['--oniva-font-lh-12'],
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  legendItem: { alignItems: 'center', display: 'inline-flex', gap: 6 },
  dot: { borderRadius: radius['--oniva-radius-full'], flexShrink: 0, height: 8, width: 8 },
  num: {
    color: colors['--oniva-color-text'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-medium'],
  },
  c1: { backgroundColor: colors['--oniva-color-chart-1'] },
  c2: { backgroundColor: colors['--oniva-color-chart-2'] },
  c3: { backgroundColor: colors['--oniva-color-chart-3'] },
  c4: { backgroundColor: colors['--oniva-color-chart-4'] },
  c5: { backgroundColor: colors['--oniva-color-chart-5'] },
  c6: { backgroundColor: colors['--oniva-color-chart-6'] },
  c7: { backgroundColor: colors['--oniva-color-chart-7'] },
  c8: { backgroundColor: colors['--oniva-color-chart-8'] },
  c9: { backgroundColor: colors['--oniva-color-chart-9'] },
  c10: { backgroundColor: colors['--oniva-color-chart-10'] },
  success: { backgroundColor: colors['--oniva-color-success-solid'] },
  warning: { backgroundColor: colors['--oniva-color-warning-solid'] },
  danger: { backgroundColor: colors['--oniva-color-danger-solid'] },
  info: { backgroundColor: colors['--oniva-color-info-solid'] },
});

export type SegmentColor =
  | 'c1'
  | 'c2'
  | 'c3'
  | 'c4'
  | 'c5'
  | 'c6'
  | 'c7'
  | 'c8'
  | 'c9'
  | 'c10'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export interface ProgressSegment {
  id: string;
  label: string;
  value: number;
  /** Chart token (c1-c10) or status color. Defaults cycle through the chart palette. */
  color?: SegmentColor;
  /** Optional formatted value for the legend (e.g. "420k"). */
  display?: string;
}

export interface ProgressSegmentsProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'style' | 'children' | 'title'
> {
  segments: ProgressSegment[];
  /** Total capacity (e.g. 1,000,000 tokens). Unfilled space stays as track. Defaults to sum. */
  max?: number;
  /** Heading shown above the bar, e.g. "Context window". */
  title?: ReactNode;
  /** Summary shown right of the title, e.g. "820k / 1M (82%)". Auto-generated when omitted and `max` is set. */
  summary?: ReactNode;
  size?: ControlSize;
  showLegend?: boolean;
  /** BCP 47 locale for numbers. Defaults to the active React Aria locale. */
  locale?: string;
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
  locale,
  className,
  xstyle,
  ref,
  'aria-label': ariaLabel,
  ...rest
}: ProgressSegmentsProps) {
  const ctxFmts = useFormatters();
  const f = locale ? createFormatters(locale) : ctxFmts;
  const sum = segments.reduce((a, s) => a + s.value, 0);
  const total = max ?? sum;
  const pct = total > 0 ? Math.round((sum / total) * 100) : 0;
  const auto = max ? `${f.number(sum)} / ${f.number(max)} (${f.percent(pct / 100)})` : undefined;
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
        aria-label={segments.map((s) => `${s.label} ${s.display ?? f.number(s.value)}`).join(', ')}
        {...stylex.props(styles.bar, progressStyles[size])}
      >
        {segments.map((s, i) => {
          const before = segments.slice(0, i).reduce((a, x) => a + x.value, 0);
          return (
            <div
              key={s.id}
              {...stylex.props(styles.seg, styles[s.color ?? cycle[i % cycle.length]!])}
              style={
                {
                  '--oniva-off': total > 0 ? before / total : 0,
                  '--oniva-p': total > 0 ? s.value / total : 0,
                } as CSSProperties
              }
            />
          );
        })}
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
              <span {...stylex.props(styles.num)}>{s.display ?? f.number(s.value)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
