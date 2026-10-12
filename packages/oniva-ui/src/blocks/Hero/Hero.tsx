import * as stylex from '@stylexjs/stylex';
import { ArrowRight } from 'lucide-react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { bs } from '../../internal/blocks-styles';
import { mergeSx } from '../../internal/sx';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

const NARROW = '@media (max-width: 720px)';

const rise = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(var(--oniva-motion-travel))' },
  to: { opacity: 1, transform: 'translateY(0)' },
});
const settle = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(16px) scale(0.98)' },
  to: { opacity: 1, transform: 'translateY(0) scale(1)' },
});

const styles = stylex.create({
  root: { backgroundColor: colors['--oniva-color-bg'] },
  center: { alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 20, textAlign: 'center' },
  split: {
    alignItems: 'center',
    display: 'grid',
    gap: 48,
    gridTemplateColumns: { default: '1fr 1fr', [NARROW]: '1fr' },
  },
  copy: { alignItems: 'flex-start', display: 'flex', flexDirection: 'column', gap: 20 },
  copyCenter: { alignItems: 'center', textAlign: 'center' },
  narrow: { maxWidth: 640 },
  enter: {
    animationDuration: motion['--oniva-motion-dur-slower'],
    animationFillMode: 'backwards',
    animationName: { default: rise, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-emphasized'],
  },
  d1: { animationDelay: '60ms' },
  d2: { animationDelay: '120ms' },
  d3: { animationDelay: '180ms' },
  shot: {
    animationDuration: motion['--oniva-motion-dur-slower'],
    animationFillMode: 'backwards',
    animationName: { default: settle, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-emphasized'],
    animationDelay: '200ms',
    marginTop: 48,
    width: '100%',
  },
  frame: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xxl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-xl'],
    boxSizing: 'border-box',
    padding: 12,
    textAlign: 'start',
  },
  dash: { display: 'grid', gap: 12, gridTemplateColumns: { default: '180px 1fr', [NARROW]: '1fr' } },
  sideNav: { display: { default: 'flex', [NARROW]: 'none' }, flexDirection: 'column', gap: 6, padding: 8 },
  navItem: {
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-md'],
    height: 28,
  },
  navActive: { backgroundColor: colors['--oniva-color-accent-soft'] },
  stats: { display: 'grid', gap: 12, gridTemplateColumns: { default: 'repeat(3, 1fr)', [NARROW]: '1fr 1fr' } },
  stat: { display: 'flex', flexDirection: 'column', gap: 4 },
  statLabel: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'] },
  statValue: {
    fontSize: font['--oniva-font-size-24'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-semibold'],
    letterSpacing: font['--oniva-font-track-hero'],
  },
  bars: { alignItems: 'flex-end', display: 'flex', gap: 6, height: 120, marginTop: 12 },
  bar: {
    backgroundColor: colors['--oniva-color-accent-soft'],
    borderRadius: radius['--oniva-radius-xs'],
    flex: '1 1 0%',
  },
  barH: (h: number) => ({ height: h }),
  shotSplit: { marginTop: 0 },
  barOn: { backgroundColor: colors['--oniva-color-chart-1'] },
  signup: { display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420, width: '100%' },
  signupRow: { alignItems: 'flex-end', display: 'flex', flexDirection: { default: 'row', [NARROW]: 'column' }, gap: 8 },
  grow: { flex: '1 1 0%', width: { default: 'auto', [NARROW]: '100%' } },
  fine: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], margin: 0 },
});

export type HeroVariant = 'centered' | 'split' | 'signup' | 'dashboard';

export interface HeroProps extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'title'> {
  variant?: HeroVariant;
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  primaryLabel?: string;
  secondaryLabel?: string;
  /** Right-hand visual for the `split` variant. Defaults to a product shot. */
  visual?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

const heights = [38, 52, 44, 66, 58, 80, 72, 96, 88, 110];

/** Product shot used by the `split` and `dashboard` variants (decorative). */
export function HeroProductShot() {
  return (
    <div role="img" aria-label="Oniva dashboard preview showing runs, success rate and weekly cost" {...stylex.props(styles.frame)}>
      <div aria-hidden="true" {...stylex.props(styles.dash)}>
        <div {...stylex.props(styles.sideNav)}>
          {[1, 0, 0, 0, 0].map((on, i) => (
            <div key={i} {...stylex.props(styles.navItem, on === 1 && styles.navActive)} />
          ))}
        </div>
        <div {...stylex.props(bs.tile)}>
          <div {...stylex.props(styles.stats)}>
            {[
              ['Agent runs', '48,210'],
              ['Success rate', '99.2%'],
              ['Spend / wk', '$1,284'],
            ].map(([l, v]) => (
              <div key={l} {...stylex.props(styles.stat)}>
                <span {...stylex.props(styles.statLabel)}>{l}</span>
                <span {...stylex.props(styles.statValue)}>{v}</span>
              </div>
            ))}
          </div>
          <div {...stylex.props(styles.bars)}>
            {heights.map((h, i) => (
              <div
                key={i}
                {...stylex.props(styles.bar, i > 6 && styles.barOn, styles.barH(h))}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero({
  variant = 'centered',
  eyebrow = 'Now with agent budgets',
  title = 'Run every AI workflow from one calm control room',
  description = 'Oniva monitors, routes and costs your production agents, so your team ships automations without babysitting them.',
  primaryLabel = 'Start free',
  secondaryLabel = 'Book a demo',
  visual,
  className,
  xstyle,
  ref,
  ...rest
}: HeroProps) {
  const sx = stylex.props(bs.section, styles.root, xstyle);
  const centered = variant !== 'split';
  const copy = (
    <div {...stylex.props(styles.copy, centered && styles.copyCenter, centered && styles.narrow)}>
      <div {...stylex.props(styles.enter)}>
        <Badge variant="accent" dot>
          {eyebrow}
        </Badge>
      </div>
      <h1 {...stylex.props(bs.h1, styles.enter, styles.d1)}>{title}</h1>
      <p {...stylex.props(bs.lead, styles.enter, styles.d2)}>{description}</p>
      {variant === 'signup' ? (
        <form
          {...stylex.props(styles.signup, styles.enter, styles.d3)}
          onSubmit={(e) => e.preventDefault()}
        >
          <div {...stylex.props(styles.signupRow)}>
            <Input
              xstyle={styles.grow}
              type="email"
              aria-label="Work email"
              placeholder="you@company.com"
              isRequired
            />
            <Button type="submit" endIcon={<ArrowRight size={16} />}>
              {primaryLabel}
            </Button>
          </div>
          <p {...stylex.props(styles.fine)}>Free for 14 days. No card required.</p>
        </form>
      ) : (
        <div {...stylex.props(bs.row, centered && bs.rowCenter, styles.enter, styles.d3)}>
          <Button size="lg" endIcon={<ArrowRight size={16} />}>
            {primaryLabel}
          </Button>
          <Button size="lg" variant="secondary">
            {secondaryLabel}
          </Button>
        </div>
      )}
    </div>
  );
  return (
    <section ref={ref} {...rest} {...mergeSx(sx, className)}>
      <div {...stylex.props(bs.inner)}>
        {variant === 'split' ? (
          <div {...stylex.props(styles.split)}>
            {copy}
            <div {...stylex.props(styles.shot, styles.shotSplit)}>
              {visual ?? <HeroProductShot />}
            </div>
          </div>
        ) : (
          <>
            <div {...stylex.props(styles.center)}>{copy}</div>
            {variant === 'dashboard' && (
              <div {...stylex.props(styles.shot)}>
                <HeroProductShot />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

