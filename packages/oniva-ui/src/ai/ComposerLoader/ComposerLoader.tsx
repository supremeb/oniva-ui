import * as stylex from '@stylexjs/stylex';
import { media } from '../../tokens/media.stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { radius } from '../../tokens/radius.stylex';
import { mergeSx } from '../../internal/sx';

const orbit = stylex.keyframes({
  from: { transform: 'translate(-50%, -50%) rotate(0deg)' },
  to: { transform: 'translate(-50%, -50%) rotate(360deg)' },
});
const breathe = stylex.keyframes({
  '0%': { opacity: 0.35 },
  '50%': { opacity: 0.7 },
  '100%': { opacity: 0.35 },
});

const styles = stylex.create({
  root: {
    borderRadius: radius['--oniva-radius-card'],
    boxSizing: 'border-box',
    isolation: 'isolate',
    padding: 1.5,
    position: 'relative',
  },
  layer: {
    borderRadius: 'inherit',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    position: 'absolute',
  },
  ring: { backgroundColor: colors['--oniva-color-border'] },
  glow: {
    animationDuration: '2400ms',
    animationIterationCount: 'infinite',
    animationName: { default: breathe, [media.reducedMotion]: 'none' },
    filter: 'blur(10px)',
    inset: -2,
    opacity: { default: 0.45, [media.reducedMotion]: 0.3 },
    zIndex: -1,
  },
  orbit: {
    // A square far larger than the box so the rotating wedge always sweeps the full perimeter.
    animationDuration: '3200ms',
    animationIterationCount: 'infinite',
    animationName: { default: orbit, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'linear',
    aspectRatio: '1 / 1',
    backgroundImage: `conic-gradient(from 0deg, transparent 0deg, transparent 230deg, ${colors['--oniva-color-chart-4']} 285deg, ${colors['--oniva-color-chart-5']} 325deg, ${colors['--oniva-color-chart-3']} 350deg, transparent 360deg)`,
    insetBlockStart: '50%',
    insetInlineStart: '50%',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    width: '240%',
  },
  inner: {
    backgroundColor: colors['--oniva-color-surface'],
    borderRadius: 'inherit',
    position: 'relative',
  },
});

export interface ComposerLoaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Show the orbiting light. When false the wrapper is a plain hairline border. */
  active?: boolean;
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Wraps a composer with a light that orbits its border while the agent works.
 * Pure CSS (rotating conic-gradient behind an inset surface); static under reduced motion.
 */
export function ComposerLoader({
  active = true,
  children,
  className,
  xstyle,
  ref,
  ...rest
}: ComposerLoaderProps) {
  const sx = stylex.props(styles.root, xstyle);
  return (
    <div {...rest} ref={ref} data-active={active || undefined} {...mergeSx(sx, className)}>
      {active && (
        <span aria-hidden="true" {...stylex.props(styles.layer, styles.glow)}>
          <span {...stylex.props(styles.orbit)} />
        </span>
      )}
      <span aria-hidden="true" {...stylex.props(styles.layer, styles.ring)}>
        {active && <span {...stylex.props(styles.orbit)} />}
      </span>
      <div {...stylex.props(styles.inner)}>{children}</div>
    </div>
  );
}
