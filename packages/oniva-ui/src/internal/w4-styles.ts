import * as stylex from '@stylexjs/stylex';
import { colors } from '../tokens/colors.stylex';
import { font } from '../tokens/font.stylex';
import { media } from '../tokens/media.stylex';
import { motion } from '../tokens/motion.stylex';
import { radius } from '../tokens/radius.stylex';
import { shadow } from '../tokens/shadow.stylex';

/** Shared surfaces for the loop-7 W4 cards (tray + white inner card, quiet type). */
export const w4 = stylex.create({
  tray: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xxl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    gap: 8,
    maxWidth: '100%',
    padding: 8,
    width: '100%',
  },
  trayHead: {
    alignItems: 'center',
    display: 'flex',
    gap: 8,
    justifyContent: 'space-between',
    paddingBlock: 2,
    paddingInline: 6,
  },
  trayTitle: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-semibold'],
    lineHeight: font['--oniva-font-lh-20'],
    margin: 0,
  },
  card: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-card'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-sans'],
  },
  muted: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-18'],
  },
  num: { fontVariantNumeric: 'tabular-nums' },
  clamp1: {
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  reset: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: 'inherit',
    cursor: 'pointer',
    font: 'inherit',
    margin: 0,
    padding: 0,
    textAlign: 'start',
  },
  /** Row hover: only on devices that hover. */
  rowHover: {
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-inset-hover'] },
    },
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
});

/** Fade-up one-shot entry used for list rows. Reduced motion: no animation. */
const fadeUp = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(6px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});
export const w4Motion = stylex.create({
  fadeUp: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationFillMode: 'backwards',
    animationName: { default: fadeUp, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
});
