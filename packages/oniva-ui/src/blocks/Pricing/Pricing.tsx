import * as stylex from '@stylexjs/stylex';
import { Check, ChevronDown, X } from 'lucide-react';
import { useId, useState } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { SectionHead } from '../../internal/blocks-parts';
import { bs } from '../../internal/blocks-styles';
import { mergeSx } from '../../internal/sx';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { focus } from '../../internal/focus';
import { motion } from '../../tokens/motion.stylex';
import { media } from '../../tokens/media.stylex';
import { SegmentedControl, SegmentedControlItem } from '../../components/SegmentedControl/SegmentedControl';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';

const NARROW = '@media (max-width: 860px)';

const swap = stylex.keyframes({ from: { opacity: 0, transform: 'translateY(4px)', filter: 'blur(2px)' }, to: { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' } });

const styles = stylex.create({
  toggle: { display: 'flex', justifyContent: 'center', marginBottom: 32 },
  grid: { alignItems: 'stretch', display: 'grid', gap: 16, gridTemplateColumns: { default: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', [NARROW]: 'minmax(0, 1fr)' } },
  plan: { display: 'flex', flexDirection: 'column', gap: 20, height: '100%', minWidth: 0, overflowWrap: 'anywhere' },
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
  cross: { color: colors['--oniva-color-text-muted'], flexShrink: 0, marginTop: 2 },
  liOff: { color: colors['--oniva-color-text-muted'] },
  limits: { display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(96px, 1fr))', margin: 0 },
  limit: { backgroundColor: colors['--oniva-color-surface'], borderRadius: 10, margin: 0, padding: '8px 10px' },
  limitK: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'] },
  limitV: { fontSize: font['--oniva-font-size-14'], fontVariantNumeric: 'tabular-nums', fontWeight: font['--oniva-font-weight-semibold'], margin: 0 },
  more: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: { default: colors['--oniva-color-text-muted'], ':hover': { default: null, [media.hover]: colors['--oniva-color-text'] } },
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-13'],
    gap: 4,
    padding: 0,
  },
  chev: {
    transform: 'rotate(0deg)',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-in-out'],
  },
  chevOpen: { transform: 'rotate(180deg)' },
  detailList: { display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', margin: 0, paddingBlock: 4, paddingInline: 0 },
  sr: { borderWidth: 0, clip: 'rect(0 0 0 0)', height: 1, margin: -1, overflow: 'hidden', padding: 0, position: 'absolute', whiteSpace: 'nowrap', width: 1 },
  perSwap: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationName: { default: swap, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  plan_: {
    transform: { default: 'translateY(0)', ':hover': { default: null, [media.hover]: 'translateY(-2px)' } },
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  detailLi: {
    opacity: { default: 0, '[data-open]': 1 },
    transform: { default: 'translateY(-4px)', '[data-open]': 'translateY(0)' },
    transitionDelay: { default: '0ms', '[data-open]': 'calc(var(--i, 0) * 35ms)' },
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: { default: 'opacity, transform', [media.reducedMotion]: 'none' },
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  mid: { display: 'flex', flexDirection: 'column', gap: 12 },
  // compact variant (product-screen density)
  cHead: { alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20, textAlign: 'center' },
  cTitle: { fontSize: font['--oniva-font-size-18'], fontWeight: font['--oniva-font-weight-medium'], margin: 0 },
  cLead: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], margin: 0 },
  cToggle: { display: 'flex', justifyContent: 'center', marginBottom: 20 },
  cGrid: { alignItems: 'stretch', display: 'grid', gap: 12, gridTemplateColumns: { default: 'repeat(3, minmax(0, 1fr))', '@media (max-width: 860px)': 'minmax(0, 1fr)' } },
  cCard: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    minWidth: 0,
    padding: 16,
  },
  cFeatured: { borderColor: colors['--oniva-color-border-active'] },
  cName: { fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-medium'], margin: 0 },
  cAmount: { fontSize: font['--oniva-font-size-20'], fontVariantNumeric: 'tabular-nums', fontWeight: font['--oniva-font-weight-semibold'] },
  cPer: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'] },
  cRule: { borderTopColor: colors['--oniva-color-border'], borderTopStyle: 'solid', borderTopWidth: 1, margin: 0 },
  cLimits: { display: 'flex', flexDirection: 'column', gap: 8, margin: 0 },
  cLimit: { alignItems: 'center', display: 'flex', fontSize: font['--oniva-font-size-13'], justifyContent: 'space-between', margin: 0 },
  cLimitK: { color: colors['--oniva-color-text-muted'] },
  cLimitV: { fontVariantNumeric: 'tabular-nums', fontWeight: font['--oniva-font-weight-medium'], margin: 0 },
  cFeat: { display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 8, listStyle: 'none', margin: 0, padding: 0 },
  cLi: { alignItems: 'center', display: 'flex', fontSize: font['--oniva-font-size-13'], gap: 8 },
  cMore: { alignSelf: 'center' },
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
  /** Headline limits shown as small tiles, e.g. `{ label: 'Agents', value: '3' }`. */
  limits?: { label: string; value: string }[];
  /** Features that are not part of this plan (shown struck from the list and announced as not included). */
  excluded?: string[];
  /** Longer feature list that folds open under "Show details". */
  details?: string[];
  /** Called when the plan button is pressed. */
  onSelect?: (plan: PricingPlan, billing: 'monthly' | 'yearly') => void;
}

export const defaultPlans: PricingPlan[] = [
  { name: 'Starter', monthly: 29, yearly: 24, description: 'For solo builders shipping a first agent.', features: ['3 agents', '10k traced runs / mo', '7-day trace history', 'Email alerts'], cta: 'Start free', limits: [{ label: 'Agents', value: '3' }, { label: 'Runs / mo', value: '10k' }], excluded: ['Budgets and guardrails'], details: ['Community support', 'Public run links', 'CSV export of traces'] },
  { name: 'Team', monthly: 99, yearly: 79, description: 'For teams running agents in production.', features: ['Unlimited agents', '500k traced runs / mo', '90-day trace history', 'Budgets and guardrails', 'Slack and PagerDuty'], cta: 'Start 14-day trial', featured: true },
  { name: 'Scale', monthly: 399, yearly: 329, description: 'For companies with compliance needs.', features: ['Everything in Team', 'SSO and SCIM', 'Regional data residency', 'Audit log export', 'Dedicated support'], cta: 'Talk to sales', limits: [{ label: 'Agents', value: 'Unlimited' }, { label: 'Runs / mo', value: 'Custom' }], details: ['99.9% uptime SLA', 'Bring your own model keys', 'Private networking'] },
];

export interface PricingProps extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'title'> {
  plans?: PricingPlan[];
  defaultBilling?: 'monthly' | 'yearly';
  /** Section heading. */
  title?: string;
  /** Line under the heading. */
  subtitle?: string;
  /** ISO currency code for prices. Default `USD`. */
  currency?: string;
  /** `compact` renders dense product-screen cards (limits as rows, details open). Default `default`. */
  variant?: 'default' | 'compact';
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

function PlanDetails({ plan, defaultOpen = false, compact = false }: { plan: PricingPlan; defaultOpen?: boolean; compact?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div {...stylex.props(styles.mid)}>
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)} {...stylex.props(styles.more, compact && styles.cMore, focus.ring)}>
        {open ? 'Hide details' : 'Show details'}
        <ChevronDown size={14} aria-hidden="true" {...stylex.props(styles.chev, open && styles.chevOpen)} />
      </button>
      <AnimatedHeight isOpen={open}>
        <ul id={id} inert={!open} {...stylex.props(styles.detailList)}>
          {plan.details!.map((f, i) => (
            <li key={f} data-open={open ? '' : undefined} style={{ '--i': Math.min(i, 5) } as React.CSSProperties} {...stylex.props(styles.li, styles.detailLi)}>
              <Check size={16} aria-hidden="true" {...stylex.props(styles.check)} />
              {f}
            </li>
          ))}
        </ul>
      </AnimatedHeight>
    </div>
  );
}

export function Pricing({ plans = defaultPlans, defaultBilling = 'monthly', title = 'Simple plans that scale with your agents', subtitle = 'Pay for traced runs, not seats. Switch plans any time.', currency = 'USD', variant = 'default', className, xstyle, ref, ...rest }: PricingProps) {
  const [billing, setBilling] = useState<string>(defaultBilling);
  const sx = stylex.props(bs.section, xstyle);
  if (variant === 'compact') {
    return (
      <section ref={ref} {...rest} {...mergeSx(sx, className)}>
        <div {...stylex.props(bs.inner)}>
          <div {...stylex.props(styles.cHead)}>
            <h2 {...stylex.props(styles.cTitle)}>{title}</h2>
            <p {...stylex.props(styles.cLead)}>{subtitle}</p>
          </div>
          <div {...stylex.props(styles.cToggle)}>
            <SegmentedControl size="sm" aria-label="Billing period" value={billing} onChange={setBilling}>
              <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
              <SegmentedControlItem value="yearly">Yearly</SegmentedControlItem>
            </SegmentedControl>
          </div>
          <div {...stylex.props(styles.cGrid)}>
            {plans.map((p) => (
              <div key={p.name} {...stylex.props(styles.cCard, p.featured && styles.cFeatured)}>
                <div>
                  <div {...stylex.props(styles.top)}>
                    <h3 {...stylex.props(styles.cName)}>{p.name}</h3>
                    {p.featured && <Badge variant="accent" size="sm">Popular</Badge>}
                  </div>
                  <div {...stylex.props(styles.price)}>
                    <AnimatedNumber xstyle={styles.cAmount} value={billing === 'yearly' ? p.yearly : p.monthly} format={{ style: 'currency', currency, maximumFractionDigits: 0 }} />
                    <span key={billing} {...stylex.props(styles.cPer, styles.perSwap)}>/ month{billing === 'yearly' ? ', billed yearly' : ''}</span>
                  </div>
                </div>
                <hr {...stylex.props(styles.cRule)} />
                {p.limits?.length ? (
                  <dl {...stylex.props(styles.cLimits)}>
                    {p.limits.map((l) => (
                      <div key={l.label} {...stylex.props(styles.cLimit)}>
                        <dt {...stylex.props(styles.cLimitK)}>{l.label}</dt>
                        <dd {...stylex.props(styles.cLimitV)}>{l.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                <Button size="sm" variant={p.featured ? 'primary' : 'secondary'} onPress={() => p.onSelect?.(p, billing as 'monthly' | 'yearly')}>
                  {p.cta}
                </Button>
                {p.details?.length ? <PlanDetails plan={p} defaultOpen compact /> : null}
                <ul {...stylex.props(styles.cFeat)}>
                  {p.features.map((f) => (
                    <li key={f} {...stylex.props(styles.cLi)}>
                      <Check size={14} aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                  {p.excluded?.map((f) => (
                    <li key={f} {...stylex.props(styles.cLi, styles.liOff)}>
                      <X size={14} aria-hidden="true" />
                      <span {...stylex.props(styles.sr)}>Not included: </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section ref={ref} {...rest} {...mergeSx(sx, className)}>
      <div {...stylex.props(bs.inner)}>
        <SectionHead center eyebrow="Pricing" title={title} lead={subtitle} />
        <div {...stylex.props(styles.toggle)}>
          <SegmentedControl aria-label="Billing period" value={billing} onChange={setBilling}>
            <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
            <SegmentedControlItem value="yearly">Yearly (save 20%)</SegmentedControlItem>
          </SegmentedControl>
        </div>
        <div {...stylex.props(styles.grid)}>
          {plans.map((p) => (
            <div key={p.name} {...stylex.props(bs.card, styles.plan, styles.plan_, p.featured && styles.featured)}>
              <div {...stylex.props(styles.top)}>
                <h3 {...stylex.props(bs.h3)}>{p.name}</h3>
                {p.featured && <Badge variant="accent">Most popular</Badge>}
              </div>
              <p {...stylex.props(bs.p)}>{p.description}</p>
              <div {...stylex.props(styles.price)}>
                <AnimatedNumber xstyle={styles.amount} value={billing === 'yearly' ? p.yearly : p.monthly} format={{ style: 'currency', currency, maximumFractionDigits: 0 }} />
                <span key={billing} {...stylex.props(styles.per, styles.perSwap)}>/ month{billing === 'yearly' ? ', billed yearly' : ''}</span>
              </div>
              {p.limits?.length ? (
                <dl {...stylex.props(styles.limits)}>
                  {p.limits.map((l) => (
                    <div key={l.label} {...stylex.props(styles.limit)}>
                      <dt {...stylex.props(styles.limitK)}>{l.label}</dt>
                      <dd {...stylex.props(styles.limitV)}>{l.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              <ul {...stylex.props(styles.list)}>
                {p.features.map((f) => (
                  <li key={f} {...stylex.props(styles.li)}>
                    <Check size={16} aria-hidden="true" {...stylex.props(styles.check)} />
                    {f}
                  </li>
                ))}
                {p.excluded?.map((f) => (
                  <li key={f} {...stylex.props(styles.li, styles.liOff)}>
                    <X size={16} aria-hidden="true" {...stylex.props(styles.cross)} />
                    <span {...stylex.props(styles.sr)}>Not included: </span>
                    {f}
                  </li>
                ))}
              </ul>
              {p.details?.length ? <PlanDetails plan={p} /> : null}
              <Button variant={p.featured ? 'primary' : 'secondary'} onPress={() => p.onSelect?.(p, billing as 'monthly' | 'yearly')}>
                {p.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
