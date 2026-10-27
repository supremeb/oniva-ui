import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, type RefObject } from 'react';
import { prefersReducedMotion } from './motion-hooks';
import { media } from '../tokens/media.stylex';
import { motion } from '../tokens/motion.stylex';

const draw = stylex.keyframes({ from: { strokeDashoffset: 16 }, to: { strokeDashoffset: 0 } });
const pop = stylex.keyframes({
  '0%': { transform: 'scale(0.8)' },
  '60%': { transform: 'scale(1.12)' },
  '100%': { transform: 'scale(1)' },
});
const rise = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(4px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

export const w4Parts = stylex.create({
  tick: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: draw, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    strokeDasharray: 16,
  },
  pop: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationName: { default: pop, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  /** Strike line that draws across the text (background-size, not text-decoration). Add `strikeOn` for the done state. */
  strike: {
    backgroundImage: 'linear-gradient(currentColor, currentColor)',
    backgroundPosition: '0 58%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '0% 1px',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'color, background-size',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  strikeOn: { backgroundSize: '100% 1px' },
  rise: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationFillMode: 'backwards',
    animationName: { default: rise, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
});

/** Check mark that draws itself (stroke-dashoffset). */
export function DrawnCheck({ size = 12, strokeWidth = 2.4 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" {...stylex.props(w4Parts.tick)} />
    </svg>
  );
}

/** Pops `ref` (scale 1 -> 1.18 -> 1, WAAPI) whenever `value` changes after mount. No-op under reduced motion / jsdom. */
export function usePopOnChange(ref: RefObject<HTMLElement | null>, value: unknown) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = ref.current;
    if (!el || typeof el.animate !== 'function' || prefersReducedMotion()) return;
    el.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.18)', offset: 0.4 }, { transform: 'scale(1)' }],
      { duration: 300, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
    );
  }, [value, ref]);
}
