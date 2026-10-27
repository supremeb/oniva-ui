import * as stylex from '@stylexjs/stylex';
import { media } from '../tokens/media.stylex';
import { motion } from '../tokens/motion.stylex';

/**
 * Loop 7 / worker m3: small one-shot and looping motion presets for the AI folder.
 * Everything animates transform / opacity / blur(<=4px) / background-position only.
 * Reduced motion: keyframes drop to `none` (static end state); loops freeze.
 * Delay per item via `--oniva-i` (set inline: style={{ '--oniva-i': i }}).
 */

const rise = stylex.keyframes({
  from: { filter: 'blur(2px)', opacity: 0, transform: 'translateY(6px)' },
  to: { filter: 'blur(0)', opacity: 1, transform: 'translateY(0)' },
});
const pop = stylex.keyframes({
  from: { filter: 'blur(2px)', opacity: 0, transform: 'scale(0.8)' },
  to: { filter: 'blur(0)', opacity: 1, transform: 'scale(1)' },
});
const fillIn = stylex.keyframes({
  from: { opacity: 0.2, transform: 'scaleY(0.3)' },
  to: { opacity: 1, transform: 'scaleY(1)' },
});
const ring = stylex.keyframes({
  '0%': { opacity: 0.45, transform: 'scale(1)' },
  '100%': { opacity: 0, transform: 'scale(1.8)' },
});
const trace = stylex.keyframes({
  from: { backgroundPosition: '0 50%' },
  to: { backgroundPosition: '-12px 50%' },
});
const breathe = stylex.keyframes({
  '0%, 100%': { opacity: 1, transform: 'scale(1)' },
  '50%': { opacity: 0.55, transform: 'scale(0.86)' },
});
const wave = stylex.keyframes({
  '0%, 100%': { transform: 'translateY(0)' },
  '50%': { transform: 'translateY(-3px)' },
});
const launch = stylex.keyframes({
  '0%': { opacity: 1, transform: 'translateY(0)' },
  '45%': { opacity: 0, transform: 'translateY(-10px)' },
  '55%': { opacity: 0, transform: 'translateY(10px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});
const slideAway = stylex.keyframes({
  from: { opacity: 1, transform: 'translateX(0)' },
  to: { opacity: 0, transform: 'translateX(24px)' },
});
const checkDraw = stylex.keyframes({
  from: { strokeDashoffset: 24 },
  to: { strokeDashoffset: 0 },
});
const thumbPop = stylex.keyframes({
  '0%': { transform: 'scale(1)' },
  '40%': { transform: 'scale(1.35) rotate(-8deg)' },
  '100%': { transform: 'scale(1) rotate(0)' },
});
const slideInRight = stylex.keyframes({
  from: { opacity: 0, transform: 'translateX(12px)' },
  to: { opacity: 1, transform: 'translateX(0)' },
});

const wordIn = stylex.keyframes({
  from: { filter: 'blur(3px)', opacity: 0 },
  to: { filter: 'blur(0)', opacity: 1 },
});

const base = {
  animationFillMode: 'backwards',
  animationTimingFunction: motion['--oniva-motion-ease-out'],
} as const;

export const m3 = stylex.create({
  /** Streamed word fades in out of a light blur (apply to word spans; mount only). */
  word: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationFillMode: 'backwards',
    animationName: { default: wordIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'inline-block',
    whiteSpace: 'pre',
  },
  /** Fade + blur + 6px rise on mount; stagger with `--oniva-i`. */
  rise: {
    ...base,
    animationDelay: 'calc(var(--oniva-i, 0) * 35ms)',
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationName: { default: rise, [media.reducedMotion]: 'none' },
  },
  /** Scale 0.8 -> 1 + blur on mount (icons, badges, bulbs). */
  pop: {
    ...base,
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationName: { default: pop, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-spring'],
  },
  /** Meter segments fill from the baseline one after another. */
  seg: {
    ...base,
    animationDelay: 'calc(var(--oniva-i, 0) * 30ms)',
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationName: { default: fillIn, [media.reducedMotion]: 'none' },
    transformOrigin: 'bottom center',
  },
  slideIn: {
    ...base,
    animationDelay: 'calc(var(--oniva-i, 0) * 35ms)',
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationName: { default: slideInRight, [media.reducedMotion]: 'none' },
  },
  /** Expanding ring behind a live control (recording mic). */
  ring: {
    animationDuration: '1400ms',
    animationIterationCount: { default: 'infinite', [media.reducedMotion]: 0 },
    animationName: ring,
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    borderRadius: '50%',
    insetBlock: 0,
    insetInline: 0,
    pointerEvents: 'none',
    position: 'absolute',
    boxShadow: '0 0 0 2px currentColor',
  },
  /** Scrolling dotted trace (recording). */
  trace: {
    animationDuration: '600ms',
    animationIterationCount: { default: 'infinite', [media.reducedMotion]: 0 },
    animationName: trace,
    animationTimingFunction: 'linear',
    backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1.5px)',
    backgroundRepeat: 'repeat-x',
    backgroundSize: '6px 6px',
    color: 'currentColor',
    height: 6,
    opacity: 0.5,
    width: 36,
  },
  /** Subtle breathing pulse for live items. */
  breathe: {
    animationDuration: '1800ms',
    animationIterationCount: { default: 'infinite', [media.reducedMotion]: 0 },
    animationName: breathe,
    animationTimingFunction: motion['--oniva-motion-ease-in-out'],
  },
  wave: {
    animationDuration: '700ms',
    animationIterationCount: { default: 3, [media.reducedMotion]: 0 },
    animationName: wave,
    animationTimingFunction: motion['--oniva-motion-ease-in-out'],
  },
  /** Arrow leaves upward and a fresh one settles in (send). Toggle via a key/data attr. */
  launch: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationName: { default: launch, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  slideAway: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationFillMode: 'forwards',
    animationName: { default: slideAway, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  /** SVG path draw (apply to a path with strokeDasharray 24). */
  draw: {
    animationDelay: '60ms',
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: checkDraw, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    strokeDasharray: 24,
  },
  thumbPop: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationName: { default: thumbPop, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-spring'],
  },
  /** Press scale for non-RAC pressables (native buttons only; pointer :active). */
  press: {
    transform: { default: 'none', ':active:not(:disabled)': `scale(${motion['--oniva-motion-press-scale']})` },
    transitionDuration: motion['--oniva-motion-dur-press'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    touchAction: 'manipulation',
  },
  /** Hover lift for cards (hover-capable devices only). */
  lift: {
    transform: { default: 'none', ':hover': { default: null, [media.hover]: 'translateY(-2px)' } },
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'transform, box-shadow',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
});
