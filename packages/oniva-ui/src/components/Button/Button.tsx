import * as stylex from '@stylexjs/stylex';
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components';
import { Loader2 } from 'lucide-react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { mergeSx } from '../../internal/sx';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

const spin = stylex.keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

const styles = stylex.create({
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
  // ---- variants ----
  primary: {
    backgroundImage: {
      default: `linear-gradient(180deg, ${accent.accent500}, ${accent.accent600})`,
      ':hover': `linear-gradient(180deg, ${accent.accent400}, ${accent.accent500})`,
      ':active': `linear-gradient(180deg, ${accent.accent600}, ${accent.accent700})`,
      ':disabled': `linear-gradient(180deg, ${colors.disabledFrom}, ${colors.disabledTo})`,
    },
    boxShadow: { default: shadow.accentInset, ':disabled': 'none' },
    color: { default: colors.accentFg, ':disabled': colors.disabledFg },
  },
  danger: {
    backgroundImage: {
      default: `linear-gradient(180deg, ${colors.dangerFrom}, ${colors.dangerTo})`,
      ':hover': `linear-gradient(180deg, ${colors.dangerHoverFrom}, ${colors.dangerHoverTo})`,
      ':active': `linear-gradient(180deg, ${colors.dangerActiveFrom}, ${colors.dangerActiveTo})`,
      ':disabled': `linear-gradient(180deg, ${colors.disabledFrom}, ${colors.disabledTo})`,
    },
    boxShadow: { default: shadow.dangerInset, ':disabled': 'none' },
    color: { default: '#ffffff', ':disabled': colors.disabledFg },
  },
  secondary: {
    backgroundColor: {
      default: colors.surface,
      ':hover': colors.surfaceHover,
      ':active': colors.surfaceActive,
      ':disabled': colors.surfaceHover,
    },
    borderColor: {
      default: colors.border,
      ':hover': colors.borderHover,
      ':active': colors.borderActive,
      ':disabled': colors.border,
    },
    boxShadow: { default: shadow.xs, ':disabled': 'none' },
    color: { default: colors.text, ':disabled': colors.textDisabled },
  },
  ghost: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.surfaceInsetHover,
      ':active': colors.surfaceTertiaryHover,
    },
    color: { default: colors.textMuted, ':hover': colors.text, ':disabled': colors.textDisabled },
  },
  soft: {
    backgroundColor: {
      default: colors.accentSoft,
      ':hover': colors.accentSoftHover,
      ':active': colors.accentSoftActive,
      ':disabled': colors.accentSoftDisabled,
    },
    color: { default: colors.accentSoftFg, ':disabled': colors.accentSoftDisabledFg },
  },
  // ---- sizes ----
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
  pending: { cursor: 'progress' },
  content: { alignItems: 'center', display: 'inline-flex', gap: 6 },
  // opacity (not visibility) keeps the accessible name while the spinner shows
  contentHidden: { opacity: 0 },
  spinner: {
    alignItems: 'center',
    display: 'flex',
    inset: 0,
    justifyContent: 'center',
    position: 'absolute',
  },
  spinIcon: {
    animationDuration: '800ms',
    animationIterationCount: 'infinite',
    animationName: spin,
    animationTimingFunction: 'linear',
  },
});

const iconSize = { xs: 'iconXs', sm: 'iconSm', md: 'iconMd', lg: 'iconLg' } as const;

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'soft' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<AriaButtonProps, 'className' | 'style' | 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Square button for a single icon. Provide `aria-label`. */
  isIconOnly?: boolean;
  /** Shows a spinner, keeps width, and blocks presses (maps to RAC `isPending`). */
  isLoading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** StyleX overrides, applied last. */
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isIconOnly = false,
  isLoading = false,
  startIcon,
  endIcon,
  children,
  className,
  style,
  xstyle,
  ref,
  ...rest
}: ButtonProps) {
  const sx = stylex.props(
    styles.base,
    styles[variant],
    styles[size],
    isIconOnly && styles[iconSize[size]],
    isLoading && styles.pending,
    xstyle,
  );
  return (
    <AriaButton
      {...rest}
      ref={ref}
      isPending={isLoading || rest.isPending}
      {...mergeSx(sx, className, style)}
    >
      <span {...stylex.props(styles.content, isLoading && styles.contentHidden)}>
        {startIcon}
        {children}
        {endIcon}
      </span>
      {isLoading && (
        <span {...stylex.props(styles.spinner)} aria-hidden="true">
          <Loader2 size={size === 'xs' ? 12 : 16} {...stylex.props(styles.spinIcon)} />
        </span>
      )}
    </AriaButton>
  );
}
