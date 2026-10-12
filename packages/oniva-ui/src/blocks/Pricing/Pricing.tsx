import * as stylex from '@stylexjs/stylex';
import { Check } from 'lucide-react';
import { useState } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { SectionHead } from '../../internal/blocks-parts';
import { bs } from '../../internal/blocks-styles';
import { mergeSx } from '../../internal/sx';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import { SegmentedControl, SegmentedControlItem } from '../../components/SegmentedControl/SegmentedControl';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';

const NARROW = '@media (max-width: 860px)';

const styles = stylex.create({
  toggle: { display: 'flex', justifyContent: 'center', marginBottom: 32 },
  grid: { alignItems: 'stretch', display: 'grid', gap: 16, gridTemplateColumns: { default: 'repeat(3, 1fr)', [NARROW]: '1fr' } },
  plan: { display: 'flex', flexDirection: 'column', gap: 20, height: '100%' },
  featured: { borderColor: colors['--oniva-color-border-active'], borderWidth: 2 },
  top: { alignItems: 'center', display: 'flex', justifyContent: 'space-between' },
  price: { alignItems: 'baseline', display: 'flex', gap: 6 },
  amount: {
    fontSize: font['--oniva-font-size-48'],
    fontWeight: font['--oniva-font-weight-semibold'],
    letterSpacing: font['--oniva-font-track-hero'],
  },
  per: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-14'] },
  list: { display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 10, listStyle: 'none', margin: 0, padding: 0 },
  li: { alignItems: 'flex-start', display: 'flex', fontSize: font['--oniva-font-size-14'], gap: 8 },
  check: { color: colors['--oniva-color-success-solid'], flexShrink: 0, marginTop: 2 },
});

export interface PricingPlan {
  name: string;
  /** Monthly price when billed monthly. */
  monthly: number;
  /** Per-month price when billed yearly. */
  yearly: number;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

export const defaultPlans: PricingPlan[] = [
  { name: 'Starter', monthly: 29, yearly: 24, description: 'For solo builders shipping a first agent.', features: ['3 agents', '10k traced runs / mo', '7-day trace history', 'Email alerts'], cta: 'Start free' },
  { name: 'Team', monthly: 99, yearly: 79, description: 'For teams running agents in production.', features: ['Unlimited agents', '500k traced runs / mo', '90-day trace history', 'Budgets and guardrails', 'Slack and PagerDuty'], cta: 'Start 14-day trial', featured: true },
  { name: 'Scale', monthly: 399, yearly: 329, description: 'For companies with compliance needs.', features: ['Everything in Team', 'SSO and SCIM', 'Regional data residency', 'Audit log export', 'Dedicated support'], cta: 'Talk to sales' },
];

export interface PricingProps extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'title'> {
  plans?: PricingPlan[];
  defaultBilling?: 'monthly' | 'yearly';
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function Pricing({ plans = defaultPlans, defaultBilling = 'monthly', className, xstyle, ref, ...rest }: PricingProps) {
  const [billing, setBilling] = useState<string>(defaultBilling);
  const sx = stylex.props(bs.section, xstyle);
  return (
    <section ref={ref} {...rest} {...mergeSx(sx, className)}>
      <div {...stylex.props(bs.inner)}>
        <SectionHead center eyebrow="Pricing" title="Simple plans that scale with your agents" lead="Pay for traced runs, not seats. Switch plans any time." />
        <div {...stylex.props(styles.toggle)}>
          <SegmentedControl aria-label="Billing period" value={billing} onChange={setBilling}>
            <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
            <SegmentedControlItem value="yearly">Yearly (save 20%)</SegmentedControlItem>
          </SegmentedControl>
        </div>
        <div {...stylex.props(styles.grid)}>
          {plans.map((p) => (
            <div key={p.name} {...stylex.props(bs.card, styles.plan, p.featured && styles.featured)}>
              <div {...stylex.props(styles.top)}>
                <h3 {...stylex.props(bs.h3)}>{p.name}</h3>
                {p.featured && <Badge variant="accent">Most popular</Badge>}
              </div>
              <p {...stylex.props(bs.p)}>{p.description}</p>
              <div {...stylex.props(styles.price)}>
                <AnimatedNumber xstyle={styles.amount} value={billing === 'yearly' ? p.yearly : p.monthly} format={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }} />
                <span {...stylex.props(styles.per)}>/ month{billing === 'yearly' ? ', billed yearly' : ''}</span>
              </div>
              <ul {...stylex.props(styles.list)}>
                {p.features.map((f) => (
                  <li key={f} {...stylex.props(styles.li)}>
                    <Check size={16} aria-hidden="true" {...stylex.props(styles.check)} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant={p.featured ? 'primary' : 'secondary'}>{p.cta}</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
