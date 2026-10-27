import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactElement, Ref, SVGProps } from 'react';
import { fakeLogos } from '../../internal/blocks-logos';
import { bs } from '../../internal/blocks-styles';
import { focus } from '../../internal/focus';
import { useReducedMotion } from '../../internal/motion-hooks';
import { mergeSx } from '../../internal/sx';
import { useLoopScroller } from '../../internal/w8-loop';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const NARROW = '@media (max-width: 720px)';

const styles = stylex.create({
  section: { paddingBlock: { default: 48, [NARROW]: 32 } },
  caption: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    margin: 0,
    marginBottom: 24,
    textAlign: 'center',
  },
  grid: {
    alignItems: 'center',
    display: 'grid',
    gap: 24,
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  logo: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-md'],
    color: {
      default: colors['--oniva-color-text-muted'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-accent-text'] },
    },
    display: 'flex',
    fontSize: font['--oniva-font-size-16'],
    fontWeight: font['--oniva-font-weight-semibold'],
    gap: 8,
    justifyContent: 'center',
    textDecoration: 'none',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'color, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    minWidth: 0,
    whiteSpace: 'nowrap',
  },
  logoColor: { color: colors['--oniva-color-text'] },
  logoBig: { fontSize: font['--oniva-font-size-20'], gap: 10 },
  captionBig: { fontSize: font['--oniva-font-size-14'], marginBottom: 32 },
  item: { paddingInlineEnd: 'var(--logo-gap)' },
  rows: { display: 'flex', flexDirection: 'column', gap: 24 },
  viewport: {
    cursor: 'grab',
    maskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
    overflow: 'hidden',
    touchAction: 'pan-y',
    userSelect: 'none',
    WebkitMaskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
  },
  track: { alignItems: 'center', display: 'flex', width: 'max-content', willChange: 'transform' },
  copy: { alignItems: 'center', display: 'flex', flexShrink: 0, listStyle: 'none', margin: 0, padding: 0 },
  /** Reduced motion: a static, centered, wrapping row (one copy). */
  staticWrap: { display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', listStyle: 'none', margin: 0, padding: 0 },
});

export interface LogoCloudItem {
  name: string;
  Mark: (props: SVGProps<SVGSVGElement>) => ReactElement;
  /** Makes the logo a link (keyboard focus pauses and nudges the strip). */
  href?: string;
}

export interface LogoCloudProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** `grid` (static) or `marquee` (endless strip; static row under reduced motion). */
  variant?: 'grid' | 'marquee';
  caption?: string;
  /** Logos to show. Defaults to a fictional customer set. */
  logos?: LogoCloudItem[];
  /** Marquee: pixels per second. Default `40`. */
  speed?: number;
  /** Marquee: direction of the first row. Default `left`. */
  direction?: 'left' | 'right';
  /** Marquee: `2` splits logos across two rows moving in opposite directions. Default `1`. */
  rows?: 1 | 2;
  /** Marquee: gap between logos in px. Default `56`. */
  gap?: number;
  /** Marquee: ease to a stop while hovered or focused. Default `true`. */
  pauseOnHover?: boolean;
  /** Marquee: muted logos that lift to the accent on hover. `false` shows full-strength text. Default `true`. */
  grayscale?: boolean;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

function Logo({ logo, color, big = false }: { logo: LogoCloudItem; color: boolean; big?: boolean }) {
  const sx = stylex.props(styles.logo, !color && styles.logoColor, big && styles.logoBig, logo.href ? focus.ring : null);
  const inner = (
    <>
      <logo.Mark {...(big ? { width: 28, height: 28 } : {})} /> {logo.name}
    </>
  );
  return logo.href ? (
    <a href={logo.href} draggable={false} {...sx}>
      {inner}
    </a>
  ) : (
    <span {...sx}>{inner}</span>
  );
}

function LoopRow({ logos, speed, dir, gap, pauseOnHover, grayscale, animate, label }: {
  logos: LogoCloudItem[];
  speed: number;
  dir: 1 | -1;
  gap: number;
  pauseOnHover: boolean;
  grayscale: boolean;
  animate: boolean;
  label: string;
}) {
  const { rootRef, trackRef } = useLoopScroller<HTMLDivElement, HTMLDivElement>({ speed, direction: dir, pauseOnHover, disabled: !animate });
  const gapVars = { '--logo-gap': `${gap}px` } as React.CSSProperties;
  const items = (clone: boolean) =>
    logos.map((l) => (
      <li key={`${clone ? 'c' : 'o'}-${l.name}`} {...stylex.props(styles.item)}>
        <Logo logo={clone ? { ...l, href: undefined } : l} color={grayscale} big />
      </li>
    ));
  if (!animate) {
    return (
      <ul aria-label={label} {...stylex.props(styles.staticWrap)}>
        {logos.map((l) => (
          <li key={l.name}>
            <Logo logo={l} color={grayscale} big />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div ref={rootRef} {...mergeSx(stylex.props(styles.viewport), undefined, gapVars)}>
      <div ref={trackRef} {...stylex.props(styles.track)}>
        <ul data-loop-copy="" aria-label={label} {...stylex.props(styles.copy)}>
          {items(false)}
        </ul>
        <ul aria-hidden="true" inert {...stylex.props(styles.copy)}>
          {items(true)}
        </ul>
      </div>
    </div>
  );
}

export function LogoCloud({
  variant = 'grid',
  caption = 'Trusted by operations teams at fast-moving companies',
  logos = fakeLogos,
  speed = 40,
  direction = 'left',
  rows = 1,
  gap = 56,
  pauseOnHover = true,
  grayscale = true,
  className,
  xstyle,
  ref,
  ...rest
}: LogoCloudProps) {
  const reduced = useReducedMotion();
  const sx = stylex.props(bs.section, styles.section, xstyle);
  const dir: 1 | -1 = direction === 'left' ? 1 : -1;
  const lists: LogoCloudItem[][] = rows === 2 ? [logos.filter((_, i) => i % 2 === 0), logos.filter((_, i) => i % 2 === 1)] : [logos];
  return (
    <section ref={ref} aria-label="Customers" {...rest} {...mergeSx(sx, className)}>
      <div {...stylex.props(bs.inner)}>
        <p {...stylex.props(styles.caption, variant === 'marquee' && styles.captionBig)}>{caption}</p>
        {variant === 'grid' ? (
          <ul {...stylex.props(styles.grid)}>
            {logos.map((l) => (
              <li key={l.name}>
                <Logo logo={l} color={grayscale} />
              </li>
            ))}
          </ul>
        ) : (
          <div {...stylex.props(styles.rows)}>
            {lists.map((list, i) => (
              <LoopRow
                key={i}
                logos={list}
                speed={speed * (i % 2 ? 0.85 : 1)}
                dir={i % 2 ? ((-dir) as 1 | -1) : dir}
                gap={gap}
                pauseOnHover={pauseOnHover}
                grayscale={grayscale}
                animate={!reduced}
                label={rows === 2 ? `Customers, row ${i + 1}` : 'Customer logos'}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
