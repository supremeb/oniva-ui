import * as stylex from '@stylexjs/stylex';
import { Activity, ArrowDown, ArrowUp, Minus } from 'lucide-react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const rowIn = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(4px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

const markPop = stylex.keyframes({
  '0%': { opacity: 0, transform: 'scale(0.8)' },
  '60%': { opacity: 1, transform: 'scale(1.1)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
});

const styles = stylex.create({
  card: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: 'none',
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    containerType: 'inline-size',
    fontFamily: font['--oniva-font-sans'],
    maxWidth: '100%',
    overflow: 'hidden',
    width: '100%',
  },
  head: {
    alignItems: 'center',
    borderBottomColor: colors['--oniva-color-separator'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    display: 'flex',
    gap: 8,
    justifyContent: 'space-between',
    paddingBlock: 12,
    paddingInline: 16,
  },
  heading: {
    alignItems: 'center',
    color: colors['--oniva-color-text'],
    display: 'flex',
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 8,
    lineHeight: font['--oniva-font-lh-14'],
    margin: 0,
    minWidth: 0,
  },
  ellipsis: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  list: { display: 'flex', flexDirection: 'column', margin: 0, padding: 0 },
  row: {
    alignItems: { default: 'center', '@container (max-width: 300px)': 'flex-start' },
    animationDelay: 'calc(120ms + var(--oniva-i, 0) * 70ms)',
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: { default: rowIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    borderTopColor: colors['--oniva-color-separator'],
    borderTopStyle: 'solid',
    borderTopWidth: { default: 1, ':first-child': 0 },
    columnGap: 12,
    display: 'grid',
    gridTemplateColumns: { default: 'minmax(0, 2fr) minmax(0, 3fr)', '@container (max-width: 300px)': 'minmax(0, 1fr)' },
    minHeight: 44,
    paddingBlock: 10,
    paddingInline: 16,
    rowGap: 2,
  },
  label: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    margin: 0,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  change: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-13'],
    fontVariantNumeric: 'tabular-nums',
    gap: 6,
    margin: 0,
    minWidth: 0,
  },
  text: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  mark: {
    animationDelay: 'calc(240ms + var(--oniva-i, 0) * 70ms)',
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: markPop, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    alignItems: 'center', borderRadius: radius['--oniva-radius-sm'], display: 'inline-flex', flexShrink: 0, height: 20, justifyContent: 'center', width: 20 },
  good: { backgroundColor: colors['--oniva-color-success-bg'], color: colors['--oniva-color-success-fg'] },
  bad: { backgroundColor: colors['--oniva-color-danger-bg'], color: colors['--oniva-color-danger-fg'] },
  neutral: { backgroundColor: colors['--oniva-color-surface-tertiary'], color: colors['--oniva-color-text-muted'] },
  period: { color: colors['--oniva-color-text-muted'], flexShrink: 0, fontSize: font['--oniva-font-size-12'] },
  icon: { color: colors['--oniva-color-icon-muted'], display: 'inline-flex' },
});

export type ChangeTone = 'good' | 'bad' | 'neutral';

export interface MetricChange {
  label: string;
  /** What happened, in words, e.g. "Up 6.1% to 18.2K". The text carries the meaning; the arrow is decorative. */
  change: string;
  /** `good` is green, `bad` red, anything else neutral (a gray dash). */
  tone?: ChangeTone;
  /** Arrow direction. Defaults to up for `good` and down for `bad`. */
  direction?: 'up' | 'down';
}

export interface ChangeSummaryProps {
  changes: MetricChange[];
  /** Heading in the tray. Default `What's changed`. */
  title?: string;
  /** Small text on the right of the heading, e.g. `This week`. */
  period?: string;
  /** Replaces the icon in front of the heading. */
  icon?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

/**
 * What moved since last time: one metric per row with a coloured trend, as a description list so each change is read
 * together with its metric. Rows fade in one after another (capped after 12); reduced motion shows them at once.
 */
export function ChangeSummary({ changes, title = "What's changed", period, icon, className, xstyle, ref }: ChangeSummaryProps) {
  const sx = stylex.props(styles.card, xstyle);
  return (
    <section ref={ref as Ref<HTMLElement>} aria-label={title} {...mergeSx(sx, className)}>
      <header {...stylex.props(styles.head)}>
        <h3 {...stylex.props(styles.heading)}>
          <span aria-hidden="true" {...stylex.props(styles.icon)}>
            {icon ?? <Activity size={16} />}
          </span>
          <span {...stylex.props(styles.ellipsis)}>{title}</span>
        </h3>
        {period && <span {...stylex.props(styles.period)}>{period}</span>}
      </header>
      {changes.length > 0 && (
        <dl {...stylex.props(styles.list)}>
          {changes.map((c, i) => {
            const tone: ChangeTone = c.tone === 'good' || c.tone === 'bad' ? c.tone : 'neutral';
            const dir = c.direction ?? (tone === 'bad' ? 'down' : 'up');
            const Icon = tone === 'neutral' ? Minus : dir === 'down' ? ArrowDown : ArrowUp;
            return (
              <div key={`${i}-${c.label}`} style={{ '--oniva-i': Math.min(i, 12) } as CSSProperties} {...stylex.props(styles.row)}>
                <dt {...stylex.props(styles.label)} title={c.label}>
                  {c.label}
                </dt>
                <dd {...stylex.props(styles.change)}>
                  <span aria-hidden="true" {...stylex.props(styles.mark, styles[tone])}>
                    <Icon size={12} strokeWidth={2.4} />
                  </span>
                  <span {...stylex.props(styles.text)} title={c.change}>
                    {c.change}
                  </span>
                </dd>
              </div>
            );
          })}
        </dl>
      )}
    </section>
  );
}
