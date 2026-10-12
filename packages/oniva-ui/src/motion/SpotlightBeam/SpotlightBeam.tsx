import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { mergeRefs } from '../../internal/n3-hooks';
import { mergeSx } from '../../internal/sx';
import { accent } from '../../tokens/accent.stylex';
import { media } from '../../tokens/media.stylex';
import { useInView } from '../InView/useInView';

const sway = stylex.keyframes({
  from: { opacity: 0.55, transform: 'translateX(-50%) rotate(-5deg)' },
  to: { opacity: 1, transform: 'translateX(-50%) rotate(5deg)' },
});
const swayRev = stylex.keyframes({
  from: { opacity: 1, transform: 'translateX(-50%) rotate(6deg)' },
  to: { opacity: 0.5, transform: 'translateX(-50%) rotate(-6deg)' },
});

const beam = {
  animationDirection: 'alternate',
  animationDuration: '9s',
  animationIterationCount: 'infinite',
  animationPlayState: { default: 'running', '[data-paused]': 'paused' },
  animationTimingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)',
  clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0 100%)',
  filter: 'blur(24px)',
  height: '120%',
  left: '50%',
  pointerEvents: 'none',
  position: 'absolute',
  top: '-10%',
  transform: 'translateX(-50%)',
  transformOrigin: 'top center',
  willChange: 'transform, opacity',
} as const;

const styles = stylex.create({
  root: { isolation: 'isolate', overflow: 'hidden', position: 'relative' },
  main: {
    ...beam,
    animationName: { default: sway, [media.reducedMotion]: 'none' },
    backgroundImage: `linear-gradient(to bottom, color-mix(in srgb, ${accent['--oniva-accent-500']} 45%, transparent), transparent 85%)`,
    width: '70%',
  },
  side: {
    ...beam,
    animationName: { default: swayRev, [media.reducedMotion]: 'none' },
    backgroundImage: `linear-gradient(to bottom, color-mix(in srgb, ${accent['--oniva-accent-300']} 35%, transparent), transparent 70%)`,
    width: '45%',
    zIndex: -1,
  },
  content: { position: 'relative' },
});

export interface SpotlightBeamProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Hero background: two soft accent light cones swaying from the top (9s, transform/opacity). Pauses offscreen; static under reduced motion. */
export function SpotlightBeam({ className, xstyle, ref, children, ...rest }: SpotlightBeamProps) {
  const { ref: viewRef, inView } = useInView<HTMLDivElement>({ once: false });
  const paused = inView ? undefined : '';
  return (
    <div {...rest} ref={mergeRefs(viewRef, ref)} {...mergeSx(stylex.props(styles.root, xstyle), className)}>
      <span aria-hidden="true" data-paused={paused} {...stylex.props(styles.side)} />
      <span aria-hidden="true" data-paused={paused} {...stylex.props(styles.main)} />
      <div {...stylex.props(styles.content)}>{children}</div>
    </div>
  );
}
