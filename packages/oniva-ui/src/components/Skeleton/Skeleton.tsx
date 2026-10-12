import * as stylex from '@stylexjs/stylex';
import { media } from '../../tokens/media.stylex';
import { mergeSx } from '../../internal/sx';
import type { HTMLAttributes, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { useInView } from '../../motion/InView/useInView';
import { radius } from '../../tokens/radius.stylex';

const shimmer = stylex.keyframes({
  from: { transform: 'translateX(-100%)' },
  to: { transform: 'translateX(100%)' },
});

const styles = stylex.create({
  base: {
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    display: 'block',
    overflow: 'hidden',
    position: 'relative',
    '::after': {
      animationDuration: '1.6s',
      animationIterationCount: 'infinite',
      animationName: { default: shimmer, [media.reducedMotion]: 'none' },
      // eslint-disable-next-line @stylexjs/valid-styles -- var() lets an ancestor release/pause the loop
      animationPlayState: 'var(--oniva-play, running)',
      animationTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)',
      backgroundImage: `linear-gradient(90deg, transparent 0%, ${colors['--oniva-color-surface-hover']} 50%, transparent 100%)`,
      content: '""',
      inset: 0,
      position: 'absolute',
    },
  },
  text: { borderRadius: radius['--oniva-radius-xs'], height: 14, width: '100%' },
  rect: { borderRadius: radius['--oniva-radius-lg'], height: 80, width: '100%' },
  circle: { borderRadius: radius['--oniva-radius-full'], height: 40, width: 40 },
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
  const { ref: viewRef, inView } = useInView<HTMLSpanElement>({ once: false });
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
        ...(width !== undefined && { width }),
        ...(height !== undefined && { height }),
        ...(!inView && { '--oniva-play': 'paused' }),
      })}
    />
  );
}
