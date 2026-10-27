import * as stylex from '@stylexjs/stylex';
import { media } from '../tokens/media.stylex';
import type { ControlSize } from './types';
import { colors } from '../tokens/colors.stylex';
import { font } from '../tokens/font.stylex';
import { motion } from '../tokens/motion.stylex';
import { radius } from '../tokens/radius.stylex';
import { shadow } from '../tokens/shadow.stylex';

/** Shared field styling (Group A — Forms). Mirrors the Input exemplar. */
export const ff = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    gap: 6,
  },
  label: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-14'],
  },
  description: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-13'],
  },
  error: {
    color: colors['--oniva-color-text-error'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-13'],
  },
  control: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: {
      default: colors['--oniva-color-border'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-border-hover'] },
      ':focus-within': colors['--oniva-color-focus-ring'],
    },
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    // inputs hold text, so they are recessed wells (inner top shadow only); focus swaps it for the halo
    boxShadow: {
      default: shadow['--oniva-elevation-recessed'],
      ':focus-within': `0 0 0 3px color-mix(in srgb, ${colors['--oniva-color-focus-ring']} 25%, transparent)`,
    },
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    gap: 6,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'border-color, box-shadow, background-color',
    transitionTimingFunction: motion['--oniva-motion-ease-standard'],
  },
  invalid: {
    backgroundColor: colors['--oniva-color-error-bg'],
    borderColor: {
      default: colors['--oniva-color-error-border'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-error-border'] },
      ':focus-within': colors['--oniva-color-error-border'],
    },
    boxShadow: {
      default: shadow['--oniva-elevation-recessed'],
      ':focus-within': `0 0 0 3px color-mix(in srgb, ${colors['--oniva-color-error-border']} 25%, transparent)`,
    },
  },
  disabled: {
    backgroundColor: colors['--oniva-color-surface-hover'],
    boxShadow: 'none',
    color: colors['--oniva-color-text-disabled'],
    cursor: 'not-allowed',
  },
  sm: { minHeight: 32, paddingInline: 8 },
  md: { minHeight: 38, paddingInline: 10 },
  lg: { minHeight: 44, paddingInline: 12 },
  bare: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: {
      default: colors['--oniva-color-text'],
      ':disabled': colors['--oniva-color-text-disabled'],
    },
    cursor: { default: 'text', ':disabled': 'not-allowed' },
    flexGrow: 1,
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-regular'],
    lineHeight: font['--oniva-font-lh-14'],
    minWidth: 0,
    outline: 'none',
    padding: 0,
    '::placeholder': { color: colors['--oniva-color-text-placeholder'] },
  },
  adornment: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'inline-flex',
    flexShrink: 0,
  },
  focusRing: {
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 2,
    outlineStyle: 'solid',
    outlineWidth: 2,
  },
  tabular: { fontVariantNumeric: 'tabular-nums' },
});

export type FieldSize = ControlSize;

/** className merge helper for RAC className callbacks. */
export function cx(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(' ');
}
