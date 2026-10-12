import * as stylex from '@stylexjs/stylex';
import type { ControlSize } from '../../internal/types';
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
      ':hover': colors['--oniva-color-surface-inset-hover'],
      ':active': colors['--oniva-color-surface-tertiary-hover'],
    },
    borderWidth: 0,
    color: { default: colors['--oniva-color-icon-muted'], ':hover': colors['--oniva-color-text'] },
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    justifyContent: 'center',
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 1,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    padding: 0,
    touchAction: 'manipulation',
    transform: {
      default: 'none',
      ':active:not(:disabled)': `scale(${motion['--oniva-motion-press-scale']})`,
    },
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, color, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  sm: { borderRadius: radius['--oniva-radius-sm'], height: 24, width: 24 },
  md: { borderRadius: radius['--oniva-radius-md'], height: 32, width: 32 },
});

export interface CloseButtonProps extends Omit<
  AriaButtonProps,
  'className' | 'style' | 'children'
> {
  size?: Extract<ControlSize, 'sm' | 'md'>;
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
