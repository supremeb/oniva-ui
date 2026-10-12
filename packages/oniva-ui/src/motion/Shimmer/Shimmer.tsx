import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { media } from '../../tokens/media.stylex';
import { mergeSx } from '../../internal/sx';
import { useInView } from '../InView/useInView';

const sweep = stylex.keyframes({
  from: { backgroundPosition: '150% 0' },
  to: { backgroundPosition: '-50% 0' },
});

const styles = stylex.create({
  base: {
    animationDuration: '2000ms',
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
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

/** Text shimmer (2s linear loop). Pauses while offscreen, static under reduced motion or `isActive={false}`. */
export function Shimmer({ isActive = true, className, xstyle, ref, children, ...rest }: ShimmerProps) {
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
      {...mergeSx(sx, className)}
    >
      {children}
    </span>
  );
}
