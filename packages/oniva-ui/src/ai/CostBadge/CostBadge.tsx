import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, Ref } from 'react';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { compactNumber } from '../../internal/ai-motion';
import { aiStyles } from '../../internal/ai-styles';
import { aib } from '../../internal/aib-styles';
import { useFormatters } from '../../internal/format';
import { mergeSx } from '../../internal/sx';
import { AnimatedNumber } from '../../motion/AnimatedNumber';

const styles = stylex.create({
  badge: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-text-muted'],
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 6,
    paddingBlock: 2,
    paddingInline: 8,
  },
  sep: { color: colors['--oniva-color-text-subtle'] },
  meter: { display: 'flex', flexDirection: 'column', gap: 10, padding: 14 },
  top: { alignItems: 'baseline', display: 'flex', justifyContent: 'space-between' },
  big: { fontSize: font['--oniva-font-size-24'], fontWeight: font['--oniva-font-weight-semibold'], lineHeight: font['--oniva-font-lh-32'] },
  track: {
    backgroundColor: colors['--oniva-color-chart-track'],
    borderRadius: radius['--oniva-radius-full'],
    display: 'flex',
    height: 8,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    transformOrigin: 'left center',
    transitionDuration: motion['--oniva-motion-dur-deliberate'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '100%',
  },
  warn: { backgroundColor: colors['--oniva-color-warning-solid'] },
  ok: { backgroundColor: accent['--oniva-accent-500'] },
  over: { backgroundColor: colors['--oniva-color-danger-solid'] },
  legend: { display: 'flex', flexWrap: 'wrap', gap: 16 },
});

export interface CostBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  /** Cost in USD. */
  cost: number;
  tokens?: number;
  /** BCP 47 locale for number formatting. Defaults to the active locale. */
  locale?: string;
  /** ISO 4217 currency code. Default `USD`. */
  currency?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

/** Compact `$0.043 · 12.4k tokens` chip for a message or run. */
export function CostBadge({ cost, tokens, locale, currency = 'USD', className, xstyle, ref, ...rest }: CostBadgeProps) {
  const fmt = useFormatters();
  const loc = locale ?? fmt.locale;
  return (
    <span {...rest} ref={ref} {...mergeSx(stylex.props(styles.badge, xstyle), className)}>
      <AnimatedNumber value={cost} locale={loc} format={{ style: 'currency', currency, minimumFractionDigits: 3, maximumFractionDigits: 3 }} />
      {tokens != null && (
        <>
          <span aria-hidden="true" {...stylex.props(styles.sep)}>·</span>
          <span>{compactNumber(tokens)} tokens</span>
        </>
      )}
    </span>
  );
}

export interface UsageMeterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'title'> {
  title?: string;
  /** Spend so far (USD). */
  spent: number;
  /** Budget cap (USD). */
  budget: number;
  /** Period caption, e.g. `Oct 1 - Oct 31`. */
  period?: string;
  breakdown?: { label: string; value: number }[];
  /** BCP 47 locale for number formatting. Defaults to the active locale. */
  locale?: string;
  /** ISO 4217 currency code. Default `USD`. */
  currency?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Budget meter: animated spend figure, bar that scales with usage, per-model breakdown. */
export function UsageMeter({
  title = 'API spend',
  spent,
  budget,
  period,
  breakdown = [],
  locale,
  currency = 'USD',
  className,
  xstyle,
  ref,
  ...rest
}: UsageMeterProps) {
  const pct = Math.min(1, spent / budget);
  const tone = spent > budget ? styles.over : pct >= 0.8 ? styles.warn : styles.ok;
  const fmt = useFormatters();
  const loc = locale ?? fmt.locale;
  const money = (n: number, opts?: Intl.NumberFormatOptions) => new Intl.NumberFormat(loc, { style: 'currency', currency, ...opts }).format(n);
  const usd = { style: 'currency', currency } as const;
  return (
    <div {...rest} ref={ref} {...mergeSx(stylex.props(aiStyles.tile, styles.meter, xstyle), className)}>
      <div {...stylex.props(styles.top)}>
        <span {...stylex.props(aib.name)}>{title}</span>
        {period && <span {...stylex.props(aib.meta)}>{period}</span>}
      </div>
      <div {...stylex.props(styles.top)}>
        <AnimatedNumber value={spent} locale={loc} format={{ ...usd, maximumFractionDigits: 2 }} {...stylex.props(styles.big, aiStyles.num)} />
        <span {...stylex.props(aib.meta, aiStyles.num)}>of {money(budget, { maximumFractionDigits: 0 })}</span>
      </div>
      <div
        role="meter"
        aria-label={`${title} usage`}
        aria-valuemin={0}
        aria-valuemax={budget}
        aria-valuenow={spent}
        aria-valuetext={`${money(spent)} of ${money(budget)}`}
        {...stylex.props(styles.track)}
      >
        <div {...stylex.props(styles.fill, tone)} style={{ transform: `scaleX(${pct})` }} />
      </div>
      {breakdown.length > 0 && (
        <div {...stylex.props(styles.legend)}>
          {breakdown.map((b) => (
            <span key={b.label} {...stylex.props(aib.meta, aiStyles.num)}>
              {b.label} ${b.value.toFixed(2)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
