import * as stylex from '@stylexjs/stylex';
import { media } from '../tokens/media.stylex';
import { createContext } from 'react';
import { accent } from '../tokens/accent.stylex';
import type { ButtonSize } from './types';
import { colors } from '../tokens/colors.stylex';
import { font } from '../tokens/font.stylex';
import { motion } from '../tokens/motion.stylex';
import { radius } from '../tokens/radius.stylex';
import { shadow } from '../tokens/shadow.stylex';

/** Button styles, shared by Button, ToggleButton, LinkButton. Single source: edit here. Compose with focus.ring. */
export const controlStyles = stylex.create({
  base: {
    alignItems: 'center',
    appearance: 'none',
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 6,
    justifyContent: 'center',
    lineHeight: font['--oniva-font-lh-14'],
    position: 'relative',
    textDecoration: 'none',
    // Colour / shadow ease on dur-base; the press scale rides the shorter dur-press (last entry = transform).
    transitionDuration: {
      default: `${motion['--oniva-motion-dur-base']}, ${motion['--oniva-motion-dur-base']}, ${motion['--oniva-motion-dur-base']}, ${motion['--oniva-motion-dur-base']}, ${motion['--oniva-motion-dur-press']}`,
      [media.reducedMotion]: '0.01ms',
    },
    transitionProperty: 'background-color, border-color, box-shadow, color, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    // Pointer-only press feedback (:active); 0.97 per Emil. Disabled / pending buttons don't scale.
    transform: {
      default: 'none',
      ':active:not(:disabled):not([data-disabled]):not([data-pending])': `scale(${motion['--oniva-motion-press-scale']})`,
    },
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  // Raised, flat fill: accent colour carries identity (no gradient, no inner highlight). Hover lifts a touch,
  // press flattens (never more shadow). Disabled is flat.
  primary: {
    backgroundColor: {
      default: accent['--oniva-accent-solid'],
      ':hover': { default: null, [media.hover]: accent['--oniva-accent-solid-hover'] },
      ':active': accent['--oniva-accent-solid-active'],
      ':disabled': colors['--oniva-color-disabled-from'],
    },
    borderColor: { default: 'transparent', '@media (forced-colors: active)': 'ButtonText' },
    boxShadow: {
      default: shadow['--oniva-elevation-solid'],
      ':hover': { default: null, [media.hover]: shadow['--oniva-elevation-solid-hover'] },
      ':active': shadow['--oniva-elevation-solid-pressed'],
      ':disabled': 'none',
    },
    color: {
      // accent ramp directly: `color-accent-fg` is resolved at :root in light mode, so non-blue accents kept white text
      default: accent['--oniva-accent-on-solid'],
      ':disabled': colors['--oniva-color-disabled-fg'],
    },
  },
  danger: {
    backgroundColor: {
      default: colors['--oniva-color-danger-from'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-danger-hover-from'] },
      ':active': colors['--oniva-color-danger-active-from'],
      ':disabled': colors['--oniva-color-disabled-from'],
    },
    borderColor: { default: 'transparent', '@media (forced-colors: active)': 'ButtonText' },
    boxShadow: {
      default: shadow['--oniva-elevation-solid'],
      ':hover': { default: null, [media.hover]: shadow['--oniva-elevation-solid-hover'] },
      ':active': shadow['--oniva-elevation-solid-pressed'],
      ':disabled': 'none',
    },
    color: {
      default: colors['--oniva-color-on-solid'],
      ':disabled': colors['--oniva-color-disabled-fg'],
    },
  },
  secondary: {
    backgroundColor: {
      default: colors['--oniva-color-surface'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-hover'] },
      ':active': colors['--oniva-color-surface-active'],
      ':disabled': colors['--oniva-color-surface-hover'],
    },
    borderColor: {
      default: colors['--oniva-color-border'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-border-hover'] },
      ':active': colors['--oniva-color-border-active'],
      ':disabled': colors['--oniva-color-border'],
    },
    boxShadow: {
      default: shadow['--oniva-elevation-control'],
      ':hover': { default: null, [media.hover]: shadow['--oniva-elevation-control-hover'] },
      ':active': shadow['--oniva-elevation-control-pressed'],
      ':disabled': 'none',
    },
    color: {
      default: colors['--oniva-color-text'],
      ':disabled': colors['--oniva-color-text-disabled'],
    },
  },
  ghost: {
    boxShadow: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-inset-hover'] },
      ':active': colors['--oniva-color-surface-tertiary-hover'],
    },
    color: {
      default: colors['--oniva-color-text-muted'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-text'] },
      ':disabled': colors['--oniva-color-text-disabled'],
    },
  },
  soft: {
    borderColor: { default: 'transparent', '@media (forced-colors: active)': 'ButtonText' },
    backgroundColor: {
      default: colors['--oniva-color-accent-soft'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-accent-soft-hover'] },
      ':active': colors['--oniva-color-accent-soft-active'],
      ':disabled': colors['--oniva-color-accent-soft-disabled'],
    },
    color: {
      default: colors['--oniva-color-accent-soft-fg'],
      ':disabled': colors['--oniva-color-accent-soft-disabled-fg'],
    },
  },
  xs: {
    borderRadius: radius['--oniva-radius-xs'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-semibold'],
    height: 24,
    letterSpacing: font['--oniva-font-track-caption'],
    lineHeight: font['--oniva-font-lh-12'],
    paddingInline: 8,
  },
  sm: { borderRadius: radius['--oniva-radius-md'], height: 32, paddingInline: 10 },
  md: { borderRadius: radius['--oniva-radius-lg'], height: 36, paddingInline: 12 },
  lg: { borderRadius: radius['--oniva-radius-lg'], height: 40, paddingInline: 16 },
  iconXs: { paddingInline: 0, width: 24 },
  iconSm: { paddingInline: 0, width: 32 },
  iconMd: { paddingInline: 0, width: 36 },
  iconLg: { paddingInline: 0, width: 40 },
  disabled: { cursor: 'not-allowed', opacity: 0.5 },
});

export const controlIconSize = {
  xs: 'iconXs',
  sm: 'iconSm',
  md: 'iconMd',
  lg: 'iconLg',
} as const;

export type ControlVariant = 'primary' | 'secondary' | 'ghost' | 'soft';
export type { ButtonSize, Tone as StatusTone } from './types';

/** Lets ToggleButtonGroup pass size/variant/attached styling down to its ToggleButtons. */
export interface ToggleGroupContextValue {
  size?: ButtonSize;
  variant?: ControlVariant | 'segmented';
  /** Segmented single-select: a SlidingIndicator draws the selected tile. */
  slide?: boolean;
}
export const ToggleGroupStyleContext = createContext<ToggleGroupContextValue>({});
