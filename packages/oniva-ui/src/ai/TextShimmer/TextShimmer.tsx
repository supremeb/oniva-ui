import * as stylex from '@stylexjs/stylex';
import { media } from '../../tokens/media.stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { mergeSx } from '../../internal/sx';

const sweep = stylex.keyframes({
  from: { backgroundPosition: '150% 0' },
  to: { backgroundPosition: '-50% 0' },
});

const styles = stylex.create({
  base: {
    animationDuration: '1800ms',
    animationIterationCount: 'infinite',
    animationName: {
      default: sweep,
      [media.reducedMotion]: 'none',
    },
    animationTimingFunction: 'linear',
    backgroundClip: 'text',
    backgroundImage: {
      default: `linear-gradient(100deg, ${colors['--oniva-color-text-muted']} 0%, ${colors['--oniva-color-text-muted']} 38%, ${colors['--oniva-color-text']} 50%, ${colors['--oniva-color-text-muted']} 62%, ${colors['--oniva-color-text-muted']} 100%)`,
      [media.reducedMotion]: 'none',
    },
    backgroundSize: '250% 100%',
    color: {
      default: 'transparent',
      [media.reducedMotion]: colors['--oniva-color-text-muted'],
    },
    display: 'inline-block',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: {
      default: 'transparent',
      [media.reducedMotion]: colors['--oniva-color-text-muted'],
    },
  },
});

export interface TextShimmerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

/** Text with a light sweep, for "Thinking…" style loading labels. Static under reduced motion. */
export function TextShimmer({ children, className, xstyle, ref, ...rest }: TextShimmerProps) {
  const sx = stylex.props(styles.base, xstyle);
  return (
    <span {...rest} ref={ref} {...mergeSx(sx, className)}>
      {children}
    </span>
  );
}
