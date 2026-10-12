import * as stylex from '@stylexjs/stylex';
import { media } from '../tokens/media.stylex';
import { motion } from '../tokens/motion.stylex';

/**
 * Shared motion style presets. Compose with `stylex.props(base, motionStyles.pressScale, ..., xstyle)`.
 * Nothing here animates anything but transform / opacity / filter(blur<=4px).
 */

export const motionStyles = stylex.create({
  /** Scale on pointer press only (`:active`), 120ms ease-out. Keyboard Space/Enter is not scaled. */
  pressScale: {
    transform: {
      default: 'none',
      ':active:not([data-disabled]):not(:disabled)': `scale(${motion['--oniva-motion-press-scale']})`,
    },
    transitionDuration: motion['--oniva-motion-dur-press'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    touchAction: 'manipulation',
  },
  /** For the `usePressScale` hook (non-button elements): driven by `data-pressed`. */
  pressScaleData: {
    transform: {
      default: 'none',
      '[data-pressed]': `scale(${motion['--oniva-motion-press-scale']})`,
    },
    transitionDuration: motion['--oniva-motion-dur-press'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    touchAction: 'manipulation',
  },
  /** Scale from the trigger: RAC sets `--trigger-anchor-point` on popovers; falls back to placement. */
  originAware: {
    transformOrigin: 'var(--trigger-anchor-point, center)',
  },
  originTop: { transformOrigin: 'bottom center' }, // popover placed above trigger
  originBottom: { transformOrigin: 'top center' }, // placed below trigger
  originLeft: { transformOrigin: 'right center' },
  originRight: { transformOrigin: 'left center' },
});

const fadeIn = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const fadeOut = stylex.keyframes({ from: { opacity: 1 }, to: { opacity: 0 } });
const scaleIn = stylex.keyframes({
  from: { opacity: 0, transform: `scale(${motion['--oniva-motion-pop-scale']})` },
  to: { opacity: 1, transform: 'scale(1)' },
});
const scaleOut = stylex.keyframes({
  from: { opacity: 1, transform: 'scale(1)' },
  to: { opacity: 0, transform: 'scale(0.98)' },
});
const slideUpIn = stylex.keyframes({
  from: { opacity: 0, transform: `translateY(${motion['--oniva-motion-travel']})` },
  to: { opacity: 1, transform: 'translateY(0)' },
});
const slideDownOut = stylex.keyframes({
  from: { opacity: 1, transform: 'translateY(0)' },
  to: { opacity: 0, transform: 'translateY(4px)' },
});
const blurIn = stylex.keyframes({
  from: { filter: 'blur(2px)', opacity: 0, transform: 'translateY(4px)' },
  to: { filter: 'blur(0)', opacity: 1, transform: 'translateY(0)' },
});
const blurOut = stylex.keyframes({
  from: { filter: 'blur(0)', opacity: 1 },
  to: { filter: 'blur(2px)', opacity: 0 },
});


/**
 * Enter/exit presets keyed on `data-state="entering" | "exiting"` (set by `Presence`) or RAC's
 * `data-entering` / `data-exiting`. Pick one preset per surface; reduced motion => animation none
 * for the transform presets (token collapse leaves fade presets as a ~0ms fade).
 * Usage: `stylex.props(enterExit.scale, xstyle)`.
 */
export const enterExit = stylex.create({
  fade: {
    animationDuration: {
      default: null,
      '[data-state="entering"]': motion['--oniva-motion-dur-enter'],
      '[data-entering]': motion['--oniva-motion-dur-enter'],
      '[data-state="exiting"]': motion['--oniva-motion-dur-fast'],
      '[data-exiting]': motion['--oniva-motion-dur-fast'],
    },
    animationFillMode: 'both',
    animationName: {
      default: null,
      '[data-state="entering"]': fadeIn,
      '[data-entering]': fadeIn,
      '[data-state="exiting"]': fadeOut,
      '[data-exiting]': fadeOut,
    },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  scale: {
    animationDuration: {
      default: null,
      '[data-state="entering"]': motion['--oniva-motion-dur-enter'],
      '[data-entering]': motion['--oniva-motion-dur-enter'],
      '[data-state="exiting"]': motion['--oniva-motion-dur-fast'],
      '[data-exiting]': motion['--oniva-motion-dur-fast'],
    },
    animationFillMode: 'both',
    animationName: {
      default: null,
      '[data-state="entering"]': { default: scaleIn, [media.reducedMotion]: fadeIn },
      '[data-entering]': { default: scaleIn, [media.reducedMotion]: fadeIn },
      '[data-state="exiting"]': { default: scaleOut, [media.reducedMotion]: fadeOut },
      '[data-exiting]': { default: scaleOut, [media.reducedMotion]: fadeOut },
    },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  slide: {
    animationDuration: {
      default: null,
      '[data-state="entering"]': motion['--oniva-motion-dur-enter'],
      '[data-entering]': motion['--oniva-motion-dur-enter'],
      '[data-state="exiting"]': motion['--oniva-motion-dur-fast'],
      '[data-exiting]': motion['--oniva-motion-dur-fast'],
    },
    animationFillMode: 'both',
    animationName: {
      default: null,
      '[data-state="entering"]': { default: slideUpIn, [media.reducedMotion]: fadeIn },
      '[data-entering]': { default: slideUpIn, [media.reducedMotion]: fadeIn },
      '[data-state="exiting"]': { default: slideDownOut, [media.reducedMotion]: fadeOut },
      '[data-exiting]': { default: slideDownOut, [media.reducedMotion]: fadeOut },
    },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  blur: {
    animationDuration: {
      default: null,
      '[data-state="entering"]': motion['--oniva-motion-dur-slow'],
      '[data-entering]': motion['--oniva-motion-dur-slow'],
      '[data-state="exiting"]': motion['--oniva-motion-dur-fast'],
      '[data-exiting]': motion['--oniva-motion-dur-fast'],
    },
    animationFillMode: 'both',
    animationName: {
      default: null,
      '[data-state="entering"]': { default: blurIn, [media.reducedMotion]: fadeIn },
      '[data-entering]': { default: blurIn, [media.reducedMotion]: fadeIn },
      '[data-state="exiting"]': { default: blurOut, [media.reducedMotion]: fadeOut },
      '[data-exiting]': { default: blurOut, [media.reducedMotion]: fadeOut },
    },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
});

export type EnterExitPreset = 'fade' | 'scale' | 'slide' | 'blur';
