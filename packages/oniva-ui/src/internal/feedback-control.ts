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
    transitionDuration: {
      default: motion['--oniva-motion-dur-base'],
      [media.reducedMotion]: '0.01ms',
    },
    transitionProperty: 'background-color, background-image, border-color, box-shadow, color, transform',
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
  primary: {
    borderColor: { default: 'transparent', '@media (forced-colors: active)': 'ButtonText' },
    backgroundImage: {
      default: `linear-gradient(180deg, ${accent['--oniva-accent-500']}, ${accent['--oniva-accent-600']})`,
      ':hover': `linear-gradient(180deg, ${accent['--oniva-accent-400']}, ${accent['--oniva-accent-500']})`,
      ':active': `linear-gradient(180deg, ${accent['--oniva-accent-600']}, ${accent['--oniva-accent-700']})`,
      ':disabled': `linear-gradient(180deg, ${colors['--oniva-color-disabled-from']}, ${colors['--oniva-color-disabled-to']})`,
    },
    boxShadow: { default: shadow['--oniva-shadow-accent-inset'], ':disabled': 'none' },
    color: {
      default: colors['--oniva-color-accent-fg'],
      ':disabled': colors['--oniva-color-disabled-fg'],
    },
  },
  danger: {
    borderColor: { default: 'transparent', '@media (forced-colors: active)': 'ButtonText' },
    backgroundImage: {
      default: `linear-gradient(180deg, ${colors['--oniva-color-danger-from']}, ${colors['--oniva-color-danger-to']})`,
      ':hover': `linear-gradient(180deg, ${colors['--oniva-color-danger-hover-from']}, ${colors['--oniva-color-danger-hover-to']})`,
      ':active': `linear-gradient(180deg, ${colors['--oniva-color-danger-active-from']}, ${colors['--oniva-color-danger-active-to']})`,
      ':disabled': `linear-gradient(180deg, ${colors['--oniva-color-disabled-from']}, ${colors['--oniva-color-disabled-to']})`,
    },
    boxShadow: { default: shadow['--oniva-shadow-danger-inset'], ':disabled': 'none' },
    color: {
      default: colors['--oniva-color-on-solid'],
      ':disabled': colors['--oniva-color-disabled-fg'],
    },
  },
  secondary: {
    backgroundColor: {
      default: colors['--oniva-color-surface'],
      ':hover': colors['--oniva-color-surface-hover'],
      ':active': colors['--oniva-color-surface-active'],
      ':disabled': colors['--oniva-color-surface-hover'],
    },
    borderColor: {
      default: colors['--oniva-color-border'],
      ':hover': colors['--oniva-color-border-hover'],
      ':active': colors['--oniva-color-border-active'],
      ':disabled': colors['--oniva-color-border'],
    },
    boxShadow: { default: shadow['--oniva-shadow-xs'], ':disabled': 'none' },
    color: {
      default: colors['--oniva-color-text'],
      ':disabled': colors['--oniva-color-text-disabled'],
    },
  },
  ghost: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colors['--oniva-color-surface-inset-hover'],
      ':active': colors['--oniva-color-surface-tertiary-hover'],
    },
    color: {
      default: colors['--oniva-color-text-muted'],
      ':hover': colors['--oniva-color-text'],
      ':disabled': colors['--oniva-color-text-disabled'],
    },
  },
  soft: {
    borderColor: { default: 'transparent', '@media (forced-colors: active)': 'ButtonText' },
    backgroundColor: {
      default: colors['--oniva-color-accent-soft'],
      ':hover': colors['--oniva-color-accent-soft-hover'],
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
