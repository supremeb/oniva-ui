import * as stylex from '@stylexjs/stylex';
import { createContext } from 'react';
import { accent } from '../tokens/accent.stylex';
import { colors } from '../tokens/colors.stylex';
import { font } from '../tokens/font.stylex';
import { motion } from '../tokens/motion.stylex';
import { radius } from '../tokens/radius.stylex';
import { shadow } from '../tokens/shadow.stylex';

/**
 * Button-equivalent control styles (same size + variant tokens as `Button`), reused by
 * ToggleButton and LinkButton. Button itself keeps its styles private, so these mirror them.
 */
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
    fontFamily: font.sans,
    fontSize: font.size14,
    fontWeight: font.weightMedium,
    gap: 6,
    justifyContent: 'center',
    lineHeight: font.lh14,
    outlineColor: colors.focusRing,
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    position: 'relative',
    textDecoration: 'none',
    transitionDuration: motion.durBase,
    transitionProperty: 'background-color, background-image, border-color, box-shadow, color',
    transitionTimingFunction: motion.easeStandard,
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  primary: {
    backgroundImage: {
      default: `linear-gradient(180deg, ${accent.accent500}, ${accent.accent600})`,
      ':hover': `linear-gradient(180deg, ${accent.accent400}, ${accent.accent500})`,
      ':active': `linear-gradient(180deg, ${accent.accent600}, ${accent.accent700})`,
    },
    boxShadow: shadow.accentInset,
    color: colors.accentFg,
  },
  secondary: {
    backgroundColor: {
      default: colors.surface,
      ':hover': colors.surfaceHover,
      ':active': colors.surfaceActive,
    },
    borderColor: { default: colors.border, ':hover': colors.borderHover },
    boxShadow: shadow.xs,
    color: colors.text,
  },
  ghost: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.surfaceInsetHover,
      ':active': colors.surfaceTertiaryHover,
    },
    color: { default: colors.textMuted, ':hover': colors.text },
  },
  soft: {
    backgroundColor: {
      default: colors.accentSoft,
      ':hover': colors.accentSoftHover,
      ':active': colors.accentSoftActive,
    },
    color: colors.accentSoftFg,
  },
  xs: {
    borderRadius: radius.xs,
    fontSize: font.size12,
    fontWeight: font.weightSemibold,
    height: 24,
    letterSpacing: font.trackCaption,
    lineHeight: font.lh12,
    paddingInline: 8,
  },
  sm: { borderRadius: radius.md, height: 32, paddingInline: 10 },
  md: { borderRadius: radius.lg, height: 36, paddingInline: 12 },
  lg: { borderRadius: radius.lg, height: 40, paddingInline: 16 },
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
export type ControlSize = 'xs' | 'sm' | 'md' | 'lg';

/** Lets ToggleButtonGroup pass size/variant/attached styling down to its ToggleButtons. */
export interface ToggleGroupContextValue {
  size?: ControlSize;
  variant?: ControlVariant | 'segmented';
}
export const ToggleGroupStyleContext = createContext<ToggleGroupContextValue>({});

/** Semantic status palette shared by Alert / Tag / Progress. */
export type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
