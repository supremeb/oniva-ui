import * as stylex from '@stylexjs/stylex';
import { focus } from '../../internal/focus';
import { Link as AriaLink, type LinkProps as AriaLinkProps } from 'react-aria-components';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  base: {
    borderRadius: radius['--oniva-radius-xs'],
    cursor: { default: 'pointer', '[data-disabled]': 'not-allowed' },
    fontFamily: 'inherit',
    fontWeight: font['--oniva-font-weight-medium'],
    textDecorationLine: { default: 'none', ':hover': 'underline' },
    textDecorationThickness: 1,
    textUnderlineOffset: 3,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'color',
    transitionTimingFunction: motion['--oniva-motion-ease-standard'],
  },
  accent: {
    color: {
      default: colors['--oniva-color-accent-soft-fg'],
      ':hover': colors['--oniva-color-text'],
    },
  },
  muted: {
    color: { default: colors['--oniva-color-text-muted'], ':hover': colors['--oniva-color-text'] },
  },
  inherit: { color: 'inherit' },
  underline: { textDecorationLine: 'underline' },
  disabled: { color: colors['--oniva-color-text-disabled'], textDecorationLine: 'none' },
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
    focus.ring,
    styles[tone],
    underline && styles.underline,
    rest.isDisabled && styles.disabled,
    xstyle,
  );
  return <AriaLink {...rest} ref={ref} {...mergeSx(sx, className, style)} />;
}
