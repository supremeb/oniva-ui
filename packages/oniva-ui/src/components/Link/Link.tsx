import * as stylex from '@stylexjs/stylex';
import { Link as AriaLink, type LinkProps as AriaLinkProps } from 'react-aria-components';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  base: {
    borderRadius: radius.xs,
    cursor: { default: 'pointer', '[data-disabled]': 'not-allowed' },
    fontFamily: 'inherit',
    fontWeight: font.weightMedium,
    outlineColor: colors.focusRing,
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    textDecorationLine: { default: 'none', ':hover': 'underline' },
    textDecorationThickness: 1,
    textUnderlineOffset: 3,
    transitionDuration: motion.durBase,
    transitionProperty: 'color',
    transitionTimingFunction: motion.easeStandard,
  },
  accent: { color: { default: colors.accentSoftFg, ':hover': colors.text } },
  muted: { color: { default: colors.textMuted, ':hover': colors.text } },
  inherit: { color: 'inherit' },
  underline: { textDecorationLine: 'underline' },
  disabled: { color: colors.textDisabled, textDecorationLine: 'none' },
});

export interface LinkProps extends Omit<AriaLinkProps, 'className' | 'style' | 'children'> {
  tone?: 'accent' | 'muted' | 'inherit';
  /** Always underline (default only on hover). */
  underline?: boolean;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLAnchorElement>;
}

export function Link({
  tone = 'accent',
  underline = false,
  className,
  style,
  xstyle,
  ref,
  ...rest
}: LinkProps) {
  const sx = stylex.props(
    styles.base,
    styles[tone],
    underline && styles.underline,
    rest.isDisabled && styles.disabled,
    xstyle,
  );
  return <AriaLink {...rest} ref={ref} {...mergeSx(sx, className, style)} />;
}
