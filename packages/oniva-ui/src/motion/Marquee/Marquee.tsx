import * as stylex from '@stylexjs/stylex';
import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import { useState } from 'react';
import { mergeRefs } from '../../internal/n3-hooks';
import { mergeSx } from '../../internal/sx';
import { media } from '../../tokens/media.stylex';
import { useInView } from '../InView/useInView';

const scrollX = stylex.keyframes({ from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-100%)' } });
const scrollY = stylex.keyframes({ from: { transform: 'translateY(0)' }, to: { transform: 'translateY(-100%)' } });

const styles = stylex.create({
  root: { display: 'flex', overflow: 'hidden' },
  rootX: { flexDirection: 'row' },
  rootY: { flexDirection: 'column' },
  fadeX: {
    maskImage: 'linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)',
    WebkitMaskImage: 'linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)',
  },
  fadeY: {
    maskImage: 'linear-gradient(to bottom, transparent, #000 10%, #000 90%, transparent)',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 10%, #000 90%, transparent)',
  },
  // Reduced motion: static row the user can scroll by hand.
  rootRm: { overflow: { default: 'hidden', [media.reducedMotion]: 'auto' } },
  copy: {
    alignItems: 'center',
    animationDuration: 'var(--marquee-dur, 30s)',
    animationIterationCount: 'infinite',
    animationPlayState: { default: 'running', '[data-paused]': 'paused' },
    animationTimingFunction: 'linear',
    display: 'flex',
    flexShrink: 0,
    gap: 'var(--marquee-gap, 16px)',
  },
  copyX: {
    animationName: { default: scrollX, [media.reducedMotion]: 'none' },
    flexDirection: 'row',
    minWidth: '100%',
    paddingInlineEnd: 'var(--marquee-gap, 16px)',
  },
  copyY: {
    animationName: { default: scrollY, [media.reducedMotion]: 'none' },
    flexDirection: 'column',
    minHeight: '100%',
    paddingBlockEnd: 'var(--marquee-gap, 16px)',
  },
  reverse: { animationDirection: 'reverse' },
  clone: { display: { default: null, [media.reducedMotion]: 'none' } },
});

export interface MarqueeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Seconds for one full loop. Default `30`. */
  duration?: number;
  /** Gap between items, px. Default `16`. */
  gap?: number;
  reverse?: boolean;
  vertical?: boolean;
  /** Pause while hovered or focused. Default `true`. */
  pauseOnHover?: boolean;
  /** Fade the edges with a mask. Default `true`. */
  fade?: boolean;
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Infinite CSS marquee (translate loop). Pauses on hover/focus and while offscreen; static + scrollable under reduced motion. */
export function Marquee({ duration = 30, gap = 16, reverse, vertical, pauseOnHover = true, fade = true, className, xstyle, ref, children, onPointerEnter, onPointerLeave, onFocus, onBlur, ...rest }: MarqueeProps) {
  const { ref: viewRef, inView } = useInView<HTMLDivElement>({ once: false });
  const [held, setHeld] = useState(false);
  const paused = !inView || (pauseOnHover && held);
  const sx = stylex.props(styles.root, vertical ? styles.rootY : styles.rootX, fade && (vertical ? styles.fadeY : styles.fadeX), styles.rootRm, xstyle);
  const vars = { '--marquee-dur': `${duration}s`, '--marquee-gap': `${gap}px` } as CSSProperties;
  const copy = (clone: boolean) => (
    <div
      aria-hidden={clone || undefined}
      data-paused={paused ? '' : undefined}
      {...stylex.props(styles.copy, vertical ? styles.copyY : styles.copyX, reverse && styles.reverse, clone && styles.clone)}
    >
      {children}
    </div>
  );
  return (
    <div
      {...rest}
      ref={mergeRefs(viewRef, ref)}
      onPointerEnter={(e) => {
        setHeld(true);
        onPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        setHeld(false);
        onPointerLeave?.(e);
      }}
      onFocus={(e) => {
        setHeld(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setHeld(false);
        onBlur?.(e);
      }}
      {...mergeSx(sx, className, vars)}
    >
      {copy(false)}
      {copy(true)}
    </div>
  );
}
