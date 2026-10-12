import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, Ref } from 'react';
import { fakeLogos } from '../../internal/blocks-logos';
import { bs } from '../../internal/blocks-styles';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';

const NARROW = '@media (max-width: 720px)';

const scroll = stylex.keyframes({
  from: { transform: 'translateX(0)' },
  to: { transform: 'translateX(-50%)' },
});

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
    gridTemplateColumns: { default: 'repeat(4, 1fr)', [NARROW]: 'repeat(2, 1fr)' },
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  logo: {
    alignItems: 'center',
    color: colors['--oniva-color-text-subtle'],
    display: 'flex',
    fontSize: font['--oniva-font-size-16'],
    fontWeight: font['--oniva-font-weight-semibold'],
    gap: 8,
    justifyContent: 'center',
    opacity: 0.9,
    whiteSpace: 'nowrap',
  },
  marqueeWrap: {
    maskImage: 'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
    overflow: 'hidden',
  },
  track: {
    alignItems: 'center',
    animationDuration: '40s',
    animationIterationCount: 'infinite',
    animationName: { default: scroll, [media.reducedMotion]: 'none' },
    animationPlayState: { default: 'running', ':hover': 'paused' },
    animationTimingFunction: 'linear',
    display: 'flex',
    gap: 56,
    listStyle: 'none',
    margin: 0,
    paddingInlineEnd: 56,
    paddingInlineStart: 0,
    paddingBlock: 0,
    width: 'max-content',
  },
  /** Reduced motion: no scrolling, show a static wrapped row instead. */
  trackStatic: {
    flexWrap: { default: 'nowrap', [media.reducedMotion]: 'wrap' },
    justifyContent: { default: 'flex-start', [media.reducedMotion]: 'center' },
    width: { default: 'max-content', [media.reducedMotion]: 'auto' },
  },
  dup: { display: { default: 'flex', [media.reducedMotion]: 'none' } },
  wrapStatic: {
    maskImage: { default: 'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)', [media.reducedMotion]: 'none' },
  },
});

export interface LogoCloudProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** `grid` (static) or `marquee` (infinite carousel; static row under reduced motion). */
  variant?: 'grid' | 'marquee';
  caption?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function LogoCloud({
  variant = 'grid',
  caption = 'Trusted by operations teams at fast-moving companies',
  className,
  xstyle,
  ref,
  ...rest
}: LogoCloudProps) {
  const sx = stylex.props(bs.section, styles.section, xstyle);
  return (
    <section ref={ref} aria-label="Customers" {...rest} {...mergeSx(sx, className)}>
      <div {...stylex.props(bs.inner)}>
        <p {...stylex.props(styles.caption)}>{caption}</p>
        {variant === 'grid' ? (
          <ul {...stylex.props(styles.grid)}>
            {fakeLogos.map(({ name, Mark }) => (
              <li key={name} {...stylex.props(styles.logo)}>
                <Mark /> {name}
              </li>
            ))}
          </ul>
        ) : (
          <div {...stylex.props(styles.marqueeWrap, styles.wrapStatic)}>
            <ul {...stylex.props(styles.track, styles.trackStatic)}>
              {fakeLogos.map(({ name, Mark }) => (
                <li key={name} {...stylex.props(styles.logo)}>
                  <Mark /> {name}
                </li>
              ))}
              {fakeLogos.map(({ name, Mark }) => (
                <li key={`${name}-2`} aria-hidden="true" {...stylex.props(styles.logo, styles.dup)}>
                  <Mark /> {name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
