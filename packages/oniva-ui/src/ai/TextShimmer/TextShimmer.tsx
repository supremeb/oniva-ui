import * as stylex from '@stylexjs/stylex';
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
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
    animationTimingFunction: 'linear',
    backgroundClip: 'text',
    backgroundImage: {
      default: `linear-gradient(100deg, ${colors.textMuted} 0%, ${colors.textMuted} 38%, ${colors.text} 50%, ${colors.textMuted} 62%, ${colors.textMuted} 100%)`,
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
    backgroundSize: '250% 100%',
    color: {
      default: 'transparent',
      '@media (prefers-reduced-motion: reduce)': colors.textMuted,
    },
    display: 'inline-block',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: {
      default: 'transparent',
      '@media (prefers-reduced-motion: reduce)': colors.textMuted,
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
