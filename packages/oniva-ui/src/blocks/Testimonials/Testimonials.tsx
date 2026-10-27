import * as stylex from '@stylexjs/stylex';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Star, BadgeCheck } from 'lucide-react';
import { focus } from '../../internal/focus';
import { useReducedMotion } from '../../internal/motion-hooks';
import { useLoopScroller } from '../../internal/w8-loop';
import { radius } from '../../tokens/radius.stylex';
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
  grid: { display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))' },
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
  /** Photo URL; without one the initials are shown. */
  avatar?: string;
  /** 1-5; adds a star row with a text label. */
  rating?: number;
  verified?: boolean;
}

export const defaultTestimonials: Testimonial[] = [
  { quote: 'We retired three internal dashboards the week we switched. Every agent run is now one link in a support ticket.', name: 'Maya Ortiz', role: 'Head of Ops, Northwind Labs' },
  { quote: 'Budgets alone paid for Oniva. A looping agent used to cost us a weekend; now it pauses itself in minutes.', name: 'Jonas Weber', role: 'VP Engineering, Kestrel' },
  { quote: 'Our compliance review went from six weeks to four days because the audit trail was already there.', name: 'Priya Nair', role: 'Risk Lead, Halcyon' },
];

export const defaultWallTestimonials: Testimonial[] = [
  ...defaultTestimonials.map((t, i) => ({ ...t, rating: 5, verified: i === 1 })),
  { quote: 'Handoffs between agents used to vanish. Now every one is a row we can replay and sign off.', name: 'Elena Brandt', role: 'Platform Lead, Fieldnote', rating: 5 },
  { quote: 'We cut our monthly model bill by a third once budgets were per agent instead of per team.', name: 'Tomas Reyes', role: 'CFO, Ledgerline', rating: 4, verified: true },
  { quote: 'Onboarding took an afternoon. The trace view alone convinced our security team.', name: 'Amara Okafor', role: 'Head of Security, Brightloop', rating: 5 },
  { quote: 'Being model-agnostic meant we could swap providers without rewriting a single workflow.', name: 'Kenji Mori', role: 'Staff Engineer, Tessel', rating: 5, verified: true },
  { quote: 'Support tickets that needed an engineer now close with a replay link and a one-line fix.', name: 'Sofia Lindqvist', role: 'Support Ops, Orbit & Co', rating: 5 },
  { quote: 'The approval queue gave our risk team the control they needed to say yes to automation.', name: 'Daniel Achterberg', role: 'Risk Lead, Parallel', rating: 4 },
  { quote: 'Our agents finally have a paper trail. Audits stopped being a scramble.', name: 'Noor Haddad', role: 'Compliance, Quill', rating: 5 },
  { quote: 'I stopped getting paged for looping runs. The budget guardrails just handle it.', name: 'Luca Ferrari', role: 'SRE, Kestrel', rating: 5, verified: true },
  { quote: 'Cost per resolved ticket is down 41% and I can show exactly why.', name: 'Grace Whitfield', role: 'VP Support, Northwind Labs', rating: 5 },
];

const wallStyles = stylex.create({
  wall: {
    containerType: 'inline-size',
    display: 'grid',
    gap: 16,
    height: 'var(--tw-height, 560px)',
    maskImage: 'linear-gradient(to bottom, transparent, #000 96px, #000 calc(100% - 96px), transparent)',
    overflow: 'hidden',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 96px, #000 calc(100% - 96px), transparent)',
  },
  wall1: { gridTemplateColumns: 'minmax(0, 1fr)' },
  wall2: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  wall3: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
  col: { cursor: 'grab', minWidth: 0, overflow: 'hidden', touchAction: 'pan-x pan-y', userSelect: 'none' },
  track: { display: 'flex', flexDirection: 'column', willChange: 'transform' },
  copy: { display: 'flex', flexDirection: 'column', gap: 16, paddingBlockEnd: 16 },
  static: { columnGap: 16, columnCount: 3, display: 'block', height: 'auto', maskImage: 'none', overflow: 'visible', WebkitMaskImage: 'none' },
  staticItem: { breakInside: 'avoid', marginBottom: 16 },
  card: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    margin: 0,
    outlineOffset: -2,
    padding: 20,
    opacity: { default: 1, '[data-dim]': 0.55 },
    transform: { default: 'translateY(0)', ':hover': { default: null, [media.hover]: 'translateY(-3px)' } },
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'transform, box-shadow, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  quote: { fontSize: { default: font['--oniva-font-size-16'], '@container (max-width: 480px)': font['--oniva-font-size-14'] }, lineHeight: 1.5, margin: 0, textWrap: 'pretty' },
  stars: { color: colors['--oniva-color-text-muted'], display: 'inline-flex', gap: 2 },
  starOff: { color: colors['--oniva-color-border-control'] },
  nameRow: { alignItems: 'center', display: 'flex', gap: 4, minWidth: 0 },
  nameText: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  roleText: { display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  check: { color: colors['--oniva-color-text-muted'], flexShrink: 0 },
  meta: { minWidth: 0 },
});

function WallCard({ t, dim }: { t: Testimonial; dim?: boolean }) {
  return (
    <figure tabIndex={0} data-card={t.name} data-dim={dim ? '' : undefined} {...stylex.props(wallStyles.card, focus.inset)}>
      {t.rating ? (
        <span role="img" aria-label={`Rated ${t.rating} out of 5`} {...stylex.props(wallStyles.stars)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} size={14} aria-hidden="true" fill="currentColor" {...stylex.props(n > t.rating! && wallStyles.starOff)} />
          ))}
        </span>
      ) : null}
      <blockquote {...stylex.props(wallStyles.quote)}>{`\u201C${t.quote}\u201D`}</blockquote>
      <figcaption {...stylex.props(styles.who)}>
        <Avatar name={t.name} src={t.avatar} />
        <span {...stylex.props(wallStyles.meta)}>
          <span {...stylex.props(styles.name, wallStyles.nameRow)}>
            <span {...stylex.props(wallStyles.nameText)}>{t.name}</span>
            {t.verified ? <BadgeCheck size={14} role="img" aria-label="Verified customer" {...stylex.props(wallStyles.check)} /> : null}
          </span>
          <span {...stylex.props(styles.role, wallStyles.roleText)}>{t.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

function WallColumn({ items, speed, dir, startAt, pauseOnHover, animate, hot }: { hot: string | null; items: Testimonial[]; speed: number; dir: 1 | -1; startAt: number; pauseOnHover: boolean; animate: boolean }) {
  const { rootRef, trackRef } = useLoopScroller<HTMLDivElement, HTMLDivElement>({ axis: 'y', speed, direction: dir, pauseOnHover, disabled: !animate, startAt });
  return (
    <div ref={rootRef} {...stylex.props(wallStyles.col)}>
      <div ref={trackRef} {...stylex.props(wallStyles.track)}>
        <div data-loop-copy="" {...stylex.props(wallStyles.copy)}>
          {items.map((t) => (
            <WallCard key={t.name} t={t} dim={hot != null && hot !== t.name} />
          ))}
        </div>
        <div aria-hidden="true" inert {...stylex.props(wallStyles.copy)}>
          {items.map((t) => (
            <WallCard key={t.name} t={t} dim={hot != null && hot !== t.name} />
          ))}
        </div>
      </div>
    </div>
  );
}

const FACTORS = [1, 0.85, 1.15];

function TestimonialWall({ items, columns, speed, pauseOnHover, height, label }: { items: Testimonial[]; columns: 1 | 2 | 3; speed: number; pauseOnHover: boolean; height: number; label: string }) {
  const reduced = useReducedMotion();
  const [hot, setHot] = useState<string | null>(null);
  const [cols, setCols] = useState<1 | 2 | 3>(columns);
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => {
      const w = e?.contentRect.width ?? 1000;
      setCols(Math.min(columns, w < 480 ? 1 : w < 740 ? 2 : 3) as 1 | 2 | 3);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [el, columns]);
  const lists = Array.from({ length: cols }, (_, c) => items.filter((_, i) => i % cols === c));
  const vars = { '--tw-height': `${height}px` } as React.CSSProperties;
  return (
    <div
      ref={setEl}
      role="region"
      aria-label={label}
      onPointerOver={(e) => setHot((e.target as HTMLElement).closest<HTMLElement>('[data-card]')?.dataset.card ?? null)}
      onPointerLeave={() => setHot(null)}
      {...mergeSx(stylex.props(wallStyles.wall, cols === 1 ? wallStyles.wall1 : cols === 2 ? wallStyles.wall2 : wallStyles.wall3, reduced && wallStyles.static), undefined, vars)}
    >
      {reduced
        ? items.map((t) => (
            <div key={t.name} {...stylex.props(wallStyles.staticItem)}>
              <WallCard t={t} />
            </div>
          ))
        : lists.map((list, c) => (
            <WallColumn key={c} hot={hot} items={list} speed={speed * (FACTORS[c] ?? 1)} dir={c % 2 ? -1 : 1} startAt={(c * 0.31) % 1} pauseOnHover={pauseOnHover} animate />
          ))}
    </div>
  );
}

export interface TestimonialsProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  variant?: 'grid' | 'carousel' | 'wall';
  /** Wall: max columns (drops to 2 below 740px and 1 below 480px of its own width). Default 3. */
  columns?: 1 | 2 | 3;
  /** Wall: pixels per second of the first column. Default 28. */
  speed?: number;
  /** Wall: ease the hovered column to a stop. Default true. */
  pauseOnHover?: boolean;
  /** Wall: height in px. Default 560. */
  wallHeight?: number;
  /** Accessible name of the wall. */
  wallLabel?: string;
  items?: Testimonial[];
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function Testimonials({ variant = 'grid', items: itemsProp, columns = 3, speed = 28, pauseOnHover = true, wallHeight = 560, wallLabel = 'What customers say', className, xstyle, ref, ...rest }: TestimonialsProps) {
  const items = itemsProp ?? (variant === 'wall' ? defaultWallTestimonials : defaultTestimonials);
  const [i, setI] = useState(0);
  const sx = stylex.props(bs.section, xstyle);
  const go = (d: number) => setI((n) => (n + d + items.length) % items.length);
  const cur = items[i] ?? items[0]!;
  return (
    <section ref={ref} aria-labelledby="testimonials-title" {...rest} {...mergeSx(sx, className)}>
      <div {...stylex.props(bs.inner)}>
        <SectionHead titleId="testimonials-title" center eyebrow="Customers" title="Operators trust Oniva with production" />
        {variant === 'wall' ? (
          <TestimonialWall items={items} columns={columns} speed={speed} pauseOnHover={pauseOnHover} height={wallHeight} label={wallLabel} />
        ) : variant === 'grid' ? (
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
