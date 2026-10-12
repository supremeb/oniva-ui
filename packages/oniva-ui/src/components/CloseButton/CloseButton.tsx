import * as stylex from '@stylexjs/stylex';
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components';
import { X } from 'lucide-react';
import type { CSSProperties, Ref } from 'react';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  base: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.surfaceInsetHover,
      ':active': colors.surfaceTertiaryHover,
    },
    borderWidth: 0,
    color: { default: colors.iconMuted, ':hover': colors.text },
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    justifyContent: 'center',
    outlineColor: colors.focusRing,
    outlineOffset: 1,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    padding: 0,
    transitionDuration: motion.durBase,
    transitionProperty: 'background-color, color',
    transitionTimingFunction: motion.easeStandard,
  },
  sm: { borderRadius: radius.sm, height: 24, width: 24 },
  md: { borderRadius: radius.md, height: 32, width: 32 },
});

export interface CloseButtonProps extends Omit<AriaButtonProps, 'className' | 'style' | 'children'> {
  size?: 'sm' | 'md';
  className?: string;
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLButtonElement>;
}

export function CloseButton({
  size = 'sm',
  className,
  style,
  xstyle,
  ref,
  'aria-label': ariaLabel = 'Close',
  ...rest
}: CloseButtonProps) {
  const sx = stylex.props(styles.base, styles[size], xstyle);
  return (
    <AriaButton {...rest} ref={ref} aria-label={ariaLabel} {...mergeSx(sx, className, style)}>
      <X size={size === 'sm' ? 14 : 16} aria-hidden="true" />
    </AriaButton>
  );
}
