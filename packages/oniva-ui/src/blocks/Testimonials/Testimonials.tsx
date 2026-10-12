import * as stylex from '@stylexjs/stylex';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { SectionHead } from '../../internal/blocks-parts';
import { bs } from '../../internal/blocks-styles';
import { mergeSx } from '../../internal/sx';
import { Avatar } from '../../components/Avatar/Avatar';
import { Button } from '../../components/Button/Button';
import { Stagger } from '../../motion/Stagger';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { media } from '../../tokens/media.stylex';

const NARROW = '@media (max-width: 860px)';

const fade = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(var(--oniva-motion-travel))' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

const styles = stylex.create({
  grid: { display: 'grid', gap: 16, gridTemplateColumns: { default: 'repeat(3, 1fr)', [NARROW]: '1fr' } },
  quote: { display: 'flex', flexDirection: 'column', gap: 20, height: '100%', justifyContent: 'space-between', margin: 0 },
  text: { fontSize: font['--oniva-font-size-16'], lineHeight: 1.55, margin: 0, textWrap: 'pretty' },
  who: { alignItems: 'center', display: 'flex', gap: 12 },
  name: { display: 'block', fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-semibold'] },
  role: { color: colors['--oniva-color-text-muted'], display: 'block', fontSize: font['--oniva-font-size-13'] },
  stage: { marginInline: 'auto', maxWidth: 720 },
  big: { fontSize: { default: font['--oniva-font-size-24'], [NARROW]: font['--oniva-font-size-20'] }, lineHeight: 1.4, margin: 0, textWrap: 'balance' },
  slide: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: fade, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    margin: 0,
    minHeight: 200,
  },
  nav: { alignItems: 'center', display: 'flex', gap: 8, justifyContent: 'space-between', marginTop: 24 },
  count: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], fontVariantNumeric: 'tabular-nums' },
});

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export const defaultTestimonials: Testimonial[] = [
  { quote: 'We retired three internal dashboards the week we switched. Every agent run is now one link in a support ticket.', name: 'Maya Ortiz', role: 'Head of Ops, Northwind Labs' },
  { quote: 'Budgets alone paid for Oniva. A looping agent used to cost us a weekend; now it pauses itself in minutes.', name: 'Jonas Weber', role: 'VP Engineering, Kestrel' },
  { quote: 'Our compliance review went from six weeks to four days because the audit trail was already there.', name: 'Priya Nair', role: 'Risk Lead, Halcyon' },
];

export interface TestimonialsProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  variant?: 'grid' | 'carousel';
  items?: Testimonial[];
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function Testimonials({ variant = 'grid', items = defaultTestimonials, className, xstyle, ref, ...rest }: TestimonialsProps) {
  const [i, setI] = useState(0);
  const sx = stylex.props(bs.section, xstyle);
  const go = (d: number) => setI((n) => (n + d + items.length) % items.length);
  const cur = items[i] ?? items[0]!;
  return (
    <section ref={ref} aria-labelledby="testimonials-title" {...rest} {...mergeSx(sx, className)}>
      <div {...stylex.props(bs.inner)}>
        <SectionHead titleId="testimonials-title" center eyebrow="Customers" title="Operators trust Oniva with production" />
        {variant === 'grid' ? (
          <Stagger xstyle={styles.grid}>
            {items.map((t) => (
              <figure key={t.name} {...stylex.props(bs.card, styles.quote)}>
                <blockquote {...stylex.props(styles.text)}>{`\u201C${t.quote}\u201D`}</blockquote>
                <figcaption {...stylex.props(styles.who)}>
                  <Avatar name={t.name} />
                  <span>
                    <span {...stylex.props(styles.name)}>{t.name}</span>
                    <span {...stylex.props(styles.role)}>{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </Stagger>
        ) : (
          <div {...stylex.props(styles.stage)} aria-roledescription="carousel" role="group" aria-label="Customer quotes">
            <div {...stylex.props(bs.card)} aria-live="polite">
              <figure key={i} {...stylex.props(styles.slide)}>
                <blockquote {...stylex.props(styles.big)}>{`\u201C${cur.quote}\u201D`}</blockquote>
                <figcaption {...stylex.props(styles.who)}>
                  <Avatar name={cur.name} size="lg" />
                  <span>
                    <span {...stylex.props(styles.name)}>{cur.name}</span>
                    <span {...stylex.props(styles.role)}>{cur.role}</span>
                  </span>
                </figcaption>
              </figure>
              <div {...stylex.props(styles.nav)}>
                <span {...stylex.props(styles.count)}>{i + 1} / {items.length}</span>
                <span {...stylex.props(bs.row)}>
                  <Button variant="secondary" isIconOnly aria-label="Previous quote" onPress={() => go(-1)}><ChevronLeft size={16} /></Button>
                  <Button variant="secondary" isIconOnly aria-label="Next quote" onPress={() => go(1)}><ChevronRight size={16} /></Button>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
