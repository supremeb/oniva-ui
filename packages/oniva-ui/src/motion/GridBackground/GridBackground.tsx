import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import { mergeRefs } from '../../internal/n3-hooks';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { useInView } from '../InView/useInView';

export type GridDirection = 'up' | 'down' | 'left' | 'right' | 'diagonal';

// One cell per loop in the chosen direction: the lines layer is one cell larger on every side, so the loop is seamless.
const drift = stylex.keyframes({
  from: { transform: 'translate3d(0, 0, 0)' },
  to: { transform: 'translate3d(var(--oniva-gb-dx, 0px), var(--oniva-gb-dy, 0px), 0)' },
});
const reveal = stylex.keyframes({
  from: { clipPath: 'circle(0% at 50% 50%)' },
  to: { clipPath: 'circle(150% at 50% 50%)' },
});

const styles = stylex.create({
  root: { isolation: 'isolate', overflow: 'hidden', position: 'relative' },
  // Edge fade: a still radial mask so the drifting lines dissolve toward the sides.
  grid: {
    inset: 0,
    maskImage: 'radial-gradient(ellipse at center, #000 20%, transparent var(--oniva-gb-fade, 70%))',
    pointerEvents: 'none',
    position: 'absolute',
    WebkitMaskImage: 'radial-gradient(ellipse at center, #000 20%, transparent var(--oniva-gb-fade, 70%))',
    zIndex: 0,
  },
  reveal: {
    inset: 0,
    overflow: 'hidden',
    position: 'absolute',
  },
  revealHidden: { clipPath: { default: 'circle(0% at 50% 50%)', [media.reducedMotion]: 'none' } },
  revealRun: {
    animationDuration: '1400ms',
    animationFillMode: 'both',
    animationName: { default: reveal, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out-expo'],
  },
  lines: {
    animationDuration: 'var(--oniva-gb-speed, 3s)',
    animationIterationCount: 'infinite',
    animationName: { default: drift, [media.reducedMotion]: 'none' },
    animationPlayState: { default: 'running', '[data-paused]': 'paused' },
    animationTimingFunction: 'linear',
    backgroundImage: `linear-gradient(to right, var(--oniva-gb-line, ${colors['--oniva-color-border-hover']}) 1px, transparent 1px), linear-gradient(to bottom, var(--oniva-gb-line, ${colors['--oniva-color-border-hover']}) 1px, transparent 1px)`,
    backgroundSize: 'var(--oniva-gb-size, 48px) var(--oniva-gb-size, 48px)',
    inset: 'calc(var(--oniva-gb-size, 48px) * -1)',
    position: 'absolute',
    willChange: 'transform',
  },
  still: { animationName: 'none' },
  content: { position: 'relative', zIndex: 1 },
});

const offsets: Record<GridDirection, [number, number]> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
  diagonal: [-1, 1],
};

export interface GridBackgroundProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Content rendered above the grid. */
  children?: ReactNode;
  /** Cell size in px. Default 48. */
  size?: number;
  /** Line colour (any CSS colour). Defaults to the `border` token, so it follows light/dark and accents. */
  lineColor?: string;
  /** Seconds per cell; `0` keeps the grid still. Default 3. */
  speed?: number;
  /** Drift direction; `diagonal` runs from top right to bottom left. Default `diagonal`. */
  direction?: GridDirection;
  /** Uncover the grid with a circle growing from the centre the first time it is 20% in view. Default `true`. */
  reveal?: boolean;
  /** Radius of the edge fade, in % of the distance to the corners. Default 70. */
  fade?: number;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/**
 * A fine line grid that drifts one cell per loop behind your content and fades out toward the edges.
 * Decorative (`aria-hidden`, no pointer events); only `transform` animates; pauses offscreen; still and revealed
 * at once under reduced motion.
 */
export function GridBackground({
  children,
  size = 48,
  lineColor,
  speed = 3,
  direction = 'diagonal',
  reveal: doReveal = true,
  fade = 70,
  className,
  xstyle,
  ref,
  ...rest
}: GridBackgroundProps) {
  const { ref: viewRef, inView } = useInView<HTMLDivElement>({ once: false, threshold: 0.2 });
  const [shown, setShown] = useState(!doReveal);
  useEffect(() => {
    if (!doReveal || inView) setShown(true);
  }, [doReveal, inView]);
  const [dx, dy] = offsets[direction] ?? offsets.diagonal;
  const vars = {
    '--oniva-gb-size': `${size}px`,
    '--oniva-gb-dx': `${dx * size}px`,
    '--oniva-gb-dy': `${dy * size}px`,
    '--oniva-gb-speed': `${Math.max(speed, 0.1)}s`,
    '--oniva-gb-fade': `${fade}%`,
    ...(lineColor && { '--oniva-gb-line': lineColor }),
  } as CSSProperties;
  const sx = stylex.props(styles.root, xstyle);
  return (
    <div
      {...rest}
      ref={mergeRefs(viewRef, ref)}
      data-shown={shown ? '' : undefined}
      data-paused={inView ? undefined : ''}
      {...mergeSx(sx, className, vars)}
    >
      <div aria-hidden="true" {...stylex.props(styles.grid)}>
        <div {...stylex.props(styles.reveal, doReveal && (shown ? styles.revealRun : styles.revealHidden))}>
          <div data-paused={inView ? undefined : ''} {...stylex.props(styles.lines, speed <= 0 && styles.still)} />
        </div>
      </div>
      <div {...stylex.props(styles.content)}>{children}</div>
    </div>
  );
}
