import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { media } from '../../tokens/media.stylex';
import { mergeSx } from '../../internal/sx';
import { radius } from '../../tokens/radius.stylex';
import type { CSSProperties } from 'react';
import { useInView } from '../InView/useInView';

const sweep = stylex.keyframes({
  from: { backgroundPosition: '150% 0' },
  to: { backgroundPosition: '-50% 0' },
});

// All skeleton blocks pin one gradient to the viewport (background-attachment: fixed), so a single light sweep
// travels across every block together instead of each block pulsing on its own clock.
const skeletonSweep = stylex.keyframes({
  from: { backgroundPosition: '-60vw 0' },
  to: { backgroundPosition: '110vw 0' },
});

const styles = stylex.create({
  base: {
    animationDuration: 'var(--oniva-shimmer-dur, 2000ms)',
    animationIterationCount: 'infinite',
    animationName: { default: sweep, [media.reducedMotion]: 'none' },
    animationPlayState: { default: 'running', '[data-paused]': 'paused' },
    animationTimingFunction: 'linear',
    backgroundClip: 'text',
    backgroundImage: {
      default: `linear-gradient(100deg, ${colors['--oniva-color-text-muted']} 0%, ${colors['--oniva-color-text-muted']} 38%, ${colors['--oniva-color-text']} 50%, ${colors['--oniva-color-text-muted']} 62%, ${colors['--oniva-color-text-muted']} 100%)`,
      [media.reducedMotion]: 'none',
    },
    backgroundSize: '250% 100%',
    color: { default: 'transparent', [media.reducedMotion]: colors['--oniva-color-text-muted'] },
    display: 'inline-block',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: { default: 'transparent', [media.reducedMotion]: colors['--oniva-color-text-muted'] },
  },
  block: {
    animationDuration: '1800ms',
    animationIterationCount: 'infinite',
    animationName: { default: skeletonSweep, [media.reducedMotion]: 'none' },
    // eslint-disable-next-line @stylexjs/valid-styles -- var() lets an ancestor pause the loop offscreen
    animationPlayState: 'var(--oniva-play, running)',
    animationTimingFunction: 'linear',
    backgroundAttachment: 'fixed',
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    backgroundImage: {
      default: `linear-gradient(100deg, transparent 0%, ${colors['--oniva-color-surface-hover']} 50%, transparent 100%)`,
      [media.reducedMotion]: 'none',
    },
    backgroundRepeat: 'no-repeat',
    backgroundSize: '50vw 100%',
    display: 'block',
    flexShrink: 0,
  },
  circle: { borderRadius: radius['--oniva-radius-full'] },
  off: {
    animationName: 'none',
    backgroundImage: 'none',
    color: colors['--oniva-color-text-muted'],
    WebkitTextFillColor: colors['--oniva-color-text-muted'],
  },
});

export interface ShimmerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  /** Turn the sweep off (renders static muted text). Default `true`. */
  isActive?: boolean;
  /** Seconds for one pass of the highlight. Default `2`. */
  duration?: number;
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

/** Text shimmer (2s linear loop). Pauses while offscreen, static under reduced motion or `isActive={false}`. */
export function Shimmer({ isActive = true, duration, className, xstyle, ref, children, ...rest }: ShimmerProps) {
  const { ref: viewRef, inView } = useInView<HTMLSpanElement>({ once: false });
  const sx = stylex.props(styles.base, !isActive && styles.off, xstyle);
  return (
    <span
      {...rest}
      ref={(n) => {
        viewRef(n);
        if (typeof ref === 'function') ref(n);
        else if (ref) ref.current = n;
      }}
      data-paused={inView ? undefined : ''}
      {...mergeSx(sx, className, duration != null ? ({ '--oniva-shimmer-dur': `${duration}s` } as CSSProperties) : undefined)}
    >
      {children}
    </span>
  );
}

/** Alias of `Shimmer` for status labels ("Generating summary…"): real text with a highlight running through it. */
export const ShimmerText = Shimmer;

export interface ShimmerBlockProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style' | 'children'> {
  /** Width in px or any CSS length. Default `100%`. */
  width?: number | string;
  /** Height in px or any CSS length. Default `12`. */
  height?: number | string;
  /** Corner radius in px or any CSS length. Default is the `radius-sm` token. */
  radius?: number | string;
  /** Round shape that uses `width` for both sides (avatars). */
  isCircle?: boolean;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

/**
 * Skeleton block whose highlight is pinned to the viewport, so every `ShimmerBlock` on screen shares ONE sweep.
 * Decorative (`aria-hidden`): put `aria-busy` on the loading container. Static blocks under reduced motion.
 */
export function ShimmerBlock({ width = '100%', height = 12, radius: r, isCircle = false, className, xstyle, ref, ...rest }: ShimmerBlockProps) {
  const { ref: viewRef, inView } = useInView<HTMLSpanElement>({ once: false });
  const sx = stylex.props(styles.block, isCircle && styles.circle, xstyle);
  return (
    <span
      aria-hidden="true"
      {...rest}
      ref={(n) => {
        viewRef(n);
        if (typeof ref === 'function') ref(n);
        else if (ref) ref.current = n;
      }}
      {...mergeSx(sx, className, {
        width,
        height: isCircle ? width : height,
        borderRadius: isCircle ? undefined : (r ?? 'var(--oniva-radius-sm)'),
        ...(!inView && ({ '--oniva-play': 'paused' } as CSSProperties)),
      })}
    />
  );
}
