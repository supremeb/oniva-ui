import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { radius } from '../../tokens/radius.stylex';

const shimmer = stylex.keyframes({
  from: { backgroundPosition: '200% 0' },
  to: { backgroundPosition: '-200% 0' },
});

const styles = stylex.create({
  base: {
    animationDuration: '1.6s',
    animationIterationCount: 'infinite',
    animationName: { default: shimmer, '@media (prefers-reduced-motion: reduce)': 'none' },
    animationTimingFunction: 'linear',
    backgroundColor: colors.surfaceTertiary,
    backgroundImage: `linear-gradient(90deg, transparent 0%, ${colors.surfaceHover} 50%, transparent 100%)`,
    backgroundSize: '200% 100%',
    display: 'block',
  },
  text: { borderRadius: radius.xs, height: 14, width: '100%' },
  rect: { borderRadius: radius.lg, height: 80, width: '100%' },
  circle: { borderRadius: radius.full, height: 40, width: 40 },
});

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style' | 'children'> {
  variant?: 'text' | 'rect' | 'circle';
  /** Width in px or any CSS length. */
  width?: number | string;
  height?: number | string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

/** Loading placeholder with a shimmer. Static under prefers-reduced-motion. */
export function Skeleton({
  variant = 'text',
  width,
  height,
  className,
  xstyle,
  ref,
  ...rest
}: SkeletonProps) {
  const sx = stylex.props(styles.base, styles[variant], xstyle);
  return (
    <span
      aria-hidden="true"
      {...rest}
      ref={ref}
      className={[sx.className, className].filter(Boolean).join(' ')}
      style={{ ...(sx.style as object), ...(width !== undefined && { width }), ...(height !== undefined && { height }) }}
    />
  );
}
