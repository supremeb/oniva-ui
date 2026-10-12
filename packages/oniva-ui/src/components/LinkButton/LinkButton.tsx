import * as stylex from '@stylexjs/stylex';
import { focus } from '../../internal/focus';
import { Link as AriaLink, type LinkProps as AriaLinkProps } from 'react-aria-components';
import type { CSSProperties, ReactNode, Ref } from 'react';
import {
  controlIconSize,
  controlStyles,
  type ButtonSize,
  type ControlVariant,
} from '../../internal/feedback-control';
import { mergeSx } from '../../internal/sx';

export interface LinkButtonProps extends Omit<AriaLinkProps, 'className' | 'style' | 'children'> {
  variant?: ControlVariant;
  size?: ButtonSize;
  isIconOnly?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLAnchorElement>;
}

/** An anchor styled as a Button (same variants + sizes). Use for navigation that looks like an action. */
export function LinkButton({
  variant = 'secondary',
  size = 'md',
  isIconOnly = false,
  startIcon,
  endIcon,
  children,
  className,
  style,
  xstyle,
  ref,
  ...rest
}: LinkButtonProps) {
  const sx = stylex.props(
    controlStyles.base,
    focus.ring,
    controlStyles[variant],
    controlStyles[size],
    isIconOnly && controlStyles[controlIconSize[size]],
    rest.isDisabled && controlStyles.disabled,
    xstyle,
  );
  return (
    <AriaLink {...rest} ref={ref} {...mergeSx(sx, className, style)}>
      {startIcon}
      {children}
      {endIcon}
    </AriaLink>
  );
}
