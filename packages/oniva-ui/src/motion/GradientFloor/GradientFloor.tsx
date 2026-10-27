import * as stylex from '@stylexjs/stylex';
import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import { mergeRefs } from '../../internal/n3-hooks';
import { mergeSx } from '../../internal/sx';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { media } from '../../tokens/media.stylex';
import { radius } from '../../tokens/radius.stylex';
import { useInView } from '../InView/useInView';

// Both layers repeat every half of their own width, so shifting by -50% loops without a seam.
const drift = stylex.keyframes({
  from: { transform: 'translate3d(0, 0, 0)' },
  to: { transform: 'translate3d(-50%, 0, 0)' },
});
// Peaks and valleys rise and fall against each other: the two morph keyframes run out of phase.
const riseA = stylex.keyframes({
  '0%': { transform: 'scaleY(0.82)' },
  '50%': { transform: 'scaleY(1.08)' },
  '100%': { transform: 'scaleY(0.82)' },
});
const riseB = stylex.keyframes({
  '0%': { transform: 'scaleY(1.05)' },
  '50%': { transform: 'scaleY(0.8)' },
  '100%': { transform: 'scaleY(1.05)' },
});

const styles = stylex.create({
  root: {
    backgroundColor: `var(--oniva-gf-bg, ${colors['--oniva-color-bg']})`,
    borderRadius: radius['--oniva-radius-card'],
    isolation: 'isolate',
    minHeight: 240,
    overflow: 'hidden',
    position: 'relative',
  },
  floor: {
    bottom: 0,
    height: '60%',
    insetInline: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 0,
  },
  morph: {
    animationDuration: 'calc(var(--oniva-gf-speed, 3s) * 2)',
    animationIterationCount: 'infinite',
    animationName: { default: riseA, [media.reducedMotion]: 'none' },
    animationPlayState: { default: 'running', '[data-paused]': 'paused' },
    animationTimingFunction: 'ease-in-out',
    height: '100%',
    transformOrigin: '50% 100%',
    width: '100%',
  },
  morphB: { animationName: { default: riseB, [media.reducedMotion]: 'none' } },
  strip: {
    animationDuration: 'calc(var(--oniva-gf-speed, 3s) * 6)',
    animationIterationCount: 'infinite',
    animationName: { default: drift, [media.reducedMotion]: 'none' },
    animationPlayState: { default: 'running', '[data-paused]': 'paused' },
    animationTimingFunction: 'linear',
    backgroundRepeat: 'repeat-x',
    backgroundSize: '50% 100%',
    height: '100%',
    insetInlineStart: 0,
    position: 'absolute',
    width: '200%',
    willChange: 'transform',
  },
  color: {
    backgroundImage:
      'radial-gradient(ellipse 25% 100% at 25% 100%, var(--oniva-gf-c0, transparent) 0%, var(--oniva-gf-c1, transparent) 45%, var(--oniva-gf-c2, transparent) 78%, transparent 100%), radial-gradient(ellipse 24% 66% at 75% 100%, var(--oniva-gf-c1, transparent) 0%, var(--oniva-gf-c2, transparent) 55%, transparent 100%)',
    opacity: 0.8,
  },
  light: {
    animationDuration: 'calc(var(--oniva-gf-speed, 3s) * 9)',
    backgroundImage: `radial-gradient(ellipse 25% 100% at 25% 100%, color-mix(in srgb, ${colors['--oniva-color-on-solid']} 60%, transparent) 0%, color-mix(in srgb, ${colors['--oniva-color-on-solid']} 22%, transparent) 45%, color-mix(in srgb, ${colors['--oniva-color-on-solid']} 6%, transparent) 78%, transparent 100%), radial-gradient(ellipse 24% 66% at 75% 100%, color-mix(in srgb, ${colors['--oniva-color-on-solid']} 22%, transparent) 0%, color-mix(in srgb, ${colors['--oniva-color-on-solid']} 6%, transparent) 55%, transparent 100%)`,
    // eslint-disable-next-line @stylexjs/valid-styles -- plus-lighter is not in StyleX's blend-mode list
    mixBlendMode: 'plus-lighter',
  },
  still: { animationName: 'none' },
  content: { position: 'relative', zIndex: 1 },
});

export interface GradientFloorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Content rendered above the floor. Keep body text away from the bright crest. */
  children?: ReactNode;
  /** Three CSS colours from the crest down. Default is the active accent ramp, so it follows accent themes and dark mode. */
  colors?: [string, string, string];
  /** Seconds per morph beat; `0` keeps the shape still. Default 3. */
  speed?: number;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/**
 * A colour gradient that glows up from the bottom edge: a colour layer and a lighter plus-lighter layer whose peaks
 * and valleys rise and fall against each other while both drift sideways. Decorative (`aria-hidden`), only
 * transform animates, runs only while on screen, still under reduced motion. Give the root a height.
 */
export function GradientFloor({ children, colors: stops, speed = 3, className, xstyle, ref, ...rest }: GradientFloorProps) {
  const { ref: viewRef, inView } = useInView<HTMLDivElement>({ once: false });
  const vars = {
    '--oniva-gf-speed': `${Math.max(speed, 0.1)}s`,
    ...(stops
      ? { '--oniva-gf-c0': stops[0], '--oniva-gf-c1': stops[1], '--oniva-gf-c2': stops[2] }
      : {
          '--oniva-gf-c0': accent['--oniva-accent-300'],
          '--oniva-gf-c1': accent['--oniva-accent-500'],
          '--oniva-gf-c2': accent['--oniva-accent-700'],
        }),
  } as CSSProperties;
  const still = speed <= 0;
  const paused = inView ? undefined : '';
  return (
    <div {...rest} ref={mergeRefs(viewRef, ref)} {...mergeSx(stylex.props(styles.root, xstyle), className, vars)}>
      <div aria-hidden="true" {...stylex.props(styles.floor)}>
        <div data-paused={paused} {...stylex.props(styles.morph, still && styles.still)}>
          <div data-paused={paused} {...stylex.props(styles.strip, styles.color, still && styles.still)} />
        </div>
        <div data-paused={paused} {...stylex.props(styles.morph, styles.morphB, still && styles.still)} style={{ position: 'absolute', inset: 0 }}>
          <div data-paused={paused} {...stylex.props(styles.strip, styles.light, still && styles.still)} />
        </div>
      </div>
      <div {...stylex.props(styles.content)}>{children}</div>
    </div>
  );
}
