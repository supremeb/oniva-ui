import * as stylex from '@stylexjs/stylex';
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
    fontFamily: font.sans,
    gap: 6,
  },
  label: {
    color: colors.text,
    fontSize: font.size14,
    fontWeight: font.weightMedium,
    lineHeight: font.lh14,
  },
  description: { color: colors.textMuted, fontSize: font.size13, lineHeight: font.lh13 },
  error: { color: colors.textError, fontSize: font.size13, lineHeight: font.lh13 },
  control: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: {
      default: colors.border,
      ':hover': colors.borderHover,
      ':focus-within': colors.focusRing,
    },
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: {
      default: shadow.xs,
      ':focus-within': `0 0 0 3px color-mix(in srgb, ${colors.focusRing} 25%, transparent)`,
    },
    boxSizing: 'border-box',
    color: colors.text,
    display: 'flex',
    fontFamily: font.sans,
    gap: 6,
    transitionDuration: motion.durBase,
    transitionProperty: 'border-color, box-shadow, background-color',
    transitionTimingFunction: motion.easeStandard,
  },
  invalid: {
    backgroundColor: colors.errorBg,
    borderColor: {
      default: colors.errorBorder,
      ':hover': colors.errorBorder,
      ':focus-within': colors.errorBorder,
    },
    boxShadow: {
      default: shadow.xs,
      ':focus-within': `0 0 0 3px color-mix(in srgb, ${colors.errorBorder} 25%, transparent)`,
    },
  },
  disabled: {
    backgroundColor: colors.surfaceHover,
    boxShadow: 'none',
    color: colors.textDisabled,
    cursor: 'not-allowed',
  },
  sm: { height: 32, paddingInline: 8 },
  md: { height: 38, paddingInline: 10 },
  lg: { height: 44, paddingInline: 12 },
  bare: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: { default: colors.text, ':disabled': colors.textDisabled },
    cursor: { default: 'text', ':disabled': 'not-allowed' },
    flexGrow: 1,
    fontFamily: 'inherit',
    fontSize: font.size14,
    fontWeight: font.weightRegular,
    lineHeight: font.lh14,
    minWidth: 0,
    outline: 'none',
    padding: 0,
    '::placeholder': { color: colors.textPlaceholder },
  },
  adornment: {
    alignItems: 'center',
    color: colors.textMuted,
    display: 'inline-flex',
    flexShrink: 0,
  },
  focusRing: {
    outlineColor: colors.focusRing,
    outlineOffset: 2,
    outlineStyle: 'solid',
    outlineWidth: 2,
  },
  tabular: { fontVariantNumeric: 'tabular-nums' },
});

export type FieldSize = 'sm' | 'md' | 'lg';

/** className merge helper for RAC className callbacks. */
export function cx(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(' ');
}
