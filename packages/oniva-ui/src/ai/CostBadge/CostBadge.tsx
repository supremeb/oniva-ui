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
    lineHeight: font['--oniva-font-lh-16'],
    paddingBlock: 2,
    paddingInline: 8,
  },
  sep: { color: colors['--oniva-color-text-subtle'] },
  meter: { display: 'flex', flexDirection: 'column', gap: 10, padding: 14 },
  top: { alignItems: 'baseline', display: 'flex', gap: 12, justifyContent: 'space-between' },
  // The rolling digit cells are 1.2em tall; a taller inherited line-height pushes the separators and currency sign off the digits.
  big: { fontSize: font['--oniva-font-size-24'], fontWeight: font['--oniva-font-weight-semibold'], lineHeight: 1, paddingBlock: 4 },
  title: { minWidth: 0 },
  period: { textAlign: 'end' },
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
  legend: { columnGap: 16, display: 'flex', flexWrap: 'wrap', rowGap: 4 },
  overText: { color: colors['--oniva-color-danger-fg'] },
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

/** `12.4k tokens`; English keeps the short `k`/`M` suffixes, other locales use their own compact notation. */
function tokenLabel(tokens: number, locale: string): string {
  if (tokens === 1) return '1 token';
  const english = new Intl.Locale(locale).language === 'en';
  const short = english ? compactNumber(tokens) : new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(tokens);
  return `${short} tokens`;
}

/** Compact `$0.043 · 12.4k tokens` chip for a message or run. */
export function CostBadge({ cost, tokens, locale, currency = 'USD', className, xstyle, ref, ...rest }: CostBadgeProps) {
  const fmt = useFormatters();
  const loc = locale ?? fmt.locale;
  // Three decimals read well for per-message costs; a run in the hundreds drops to cents so the chip stays short.
  const decimals = Math.abs(cost) >= 100 ? 2 : 3;
  // A real but sub-tenth-of-a-cent cost must not read as free.
  const subMin = cost > 0 && cost < 0.0005;
  return (
    <span {...rest} ref={ref} {...mergeSx(stylex.props(styles.badge, xstyle), className)}>
      {subMin ? (
        <span>{`<${new Intl.NumberFormat(loc, { style: 'currency', currency, minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(0.001)}`}</span>
      ) : (
        <AnimatedNumber
          value={cost}
          locale={loc}
          format={{ style: 'currency', currency, minimumFractionDigits: decimals, maximumFractionDigits: decimals }}
        />
      )}
      {tokens != null && (
        <>
          <span aria-hidden="true" {...stylex.props(styles.sep)}>·</span>
          <span>{tokenLabel(tokens, loc)}</span>
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
  const overBudget = spent > budget;
  // A zero or missing budget must not turn the bar into NaN: any spend is "over", no spend is empty.
  const pct = budget > 0 ? Math.max(0, Math.min(1, spent / budget)) : spent > 0 ? 1 : 0;
  const tone = overBudget ? styles.over : pct >= 0.8 ? styles.warn : styles.ok;
  const fmt = useFormatters();
  const loc = locale ?? fmt.locale;
  const money = (n: number, opts?: Intl.NumberFormatOptions) => new Intl.NumberFormat(loc, { style: 'currency', currency, ...opts }).format(n);
  const usd = { style: 'currency', currency } as const;
  return (
    <div {...rest} ref={ref} {...mergeSx(stylex.props(aiStyles.tile, styles.meter, xstyle), className)}>
      <div {...stylex.props(styles.top)}>
        <span {...stylex.props(aib.name, styles.title)}>{title}</span>
        {period && <span {...stylex.props(aib.meta, styles.period)}>{period}</span>}
      </div>
      <div {...stylex.props(styles.top)}>
        <AnimatedNumber value={spent} locale={loc} format={{ ...usd, maximumFractionDigits: 2 }} {...stylex.props(styles.big, aiStyles.num)} />
        <span {...stylex.props(aib.meta, aiStyles.num, styles.period)}>
          of {money(budget, { maximumFractionDigits: 0 })}
          {overBudget && <span {...stylex.props(styles.overText)}>{` · ${money(spent - budget)} over`}</span>}
        </span>
      </div>
      <div
        role="meter"
        aria-label={`${title} usage`}
        aria-valuemin={0}
        aria-valuemax={budget}
        aria-valuenow={Math.min(spent, budget)}
        aria-valuetext={`${money(spent)} of ${money(budget)}${overBudget ? `, ${money(spent - budget)} over budget` : ''}`}
        {...stylex.props(styles.track)}
      >
        <div {...stylex.props(styles.fill, tone)} style={{ transform: `scaleX(${pct})` }} />
      </div>
      {breakdown.length > 0 && (
        <div {...stylex.props(styles.legend)}>
          {breakdown.map((b) => (
            <span key={b.label} {...stylex.props(aib.meta, aiStyles.num)}>
              {b.label} {money(b.value)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
