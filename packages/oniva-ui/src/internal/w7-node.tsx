import * as stylex from '@stylexjs/stylex';
import type { CSSProperties, ReactNode } from 'react';
import { colors } from '../tokens/colors.stylex';
import { media } from '../tokens/media.stylex';
import { motion } from '../tokens/motion.stylex';
import { loop } from './w7-scene';

/**
 * Motion wrapper for a node in a diagram scene: staggered rise-in on mount, hover lift (pointer devices),
 * a nudge each time a travelling pulse lands on it (`receiveDelay` + `period` mirror the beam), and an optional breathing halo.
 */

const rise = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(6px) scale(0.96)', filter: 'blur(3px)' },
  to: { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
});
const receive = stylex.keyframes({
  '0%, 66%, 100%': { transform: 'scale(1)' },
  '74%': { transform: 'scale(1.07)' },
  '86%': { transform: 'scale(1)' },
});
const breathe = stylex.keyframes({
  '0%, 100%': { opacity: 0.25, transform: 'scale(0.92)' },
  '50%': { opacity: 0.7, transform: 'scale(1.06)' },
});

const styles = stylex.create({
  enter: {
    animationDuration: motion['--oniva-motion-dur-sheet'],
    animationFillMode: 'backwards',
    animationName: { default: rise, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'inline-flex',
  },
  lift: {
    display: 'inline-flex',
    position: 'relative',
    transform: { default: 'none', [media.hover]: 'translateY(-4%)' },
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  receive: {
    animationName: { default: receive, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'inline-flex',
  },
  halo: {
    animationDuration: '3.6s',
    animationName: { default: breathe, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
    backgroundColor: colors['--oniva-color-accent-soft'],
    borderRadius: '30%',
    filter: 'blur(10px)',
    inset: '-12%',
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: -1,
  },
});

export function NodeMotion({
  order = 0,
  receiveDelay,
  period = 3,
  halo,
  children,
}: {
  order?: number;
  receiveDelay?: number;
  period?: number;
  halo?: boolean;
  children: ReactNode;
}) {
  const hasReceive = receiveDelay != null;
  return (
    <span {...stylex.props(styles.enter)} style={{ animationDelay: `${order * 80}ms` }}>
      <span {...stylex.props(styles.lift)}>
        {halo && <span aria-hidden="true" {...stylex.props(styles.halo, loop.run)} />}
        <span
          {...stylex.props(styles.receive, hasReceive && loop.run)}
          style={
            (hasReceive
              ? { animationDuration: `${period}s`, animationDelay: `${receiveDelay}s` }
              : { animationName: 'none' }) as CSSProperties
          }
        >
          {children}
        </span>
      </span>
    </span>
  );
}
