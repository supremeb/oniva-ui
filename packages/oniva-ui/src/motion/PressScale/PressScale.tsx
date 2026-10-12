import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { motionStyles } from '../../internal/motion-styles';
import { mergeSx } from '../../internal/sx';
import { usePressScale } from './usePressScale';

export interface PressScaleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  isDisabled?: boolean;
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Wrapper that scales to 0.97 (120ms ease-out) while pointer-pressed. Keyboard presses do not scale. */
export function PressScale({ isDisabled, className, xstyle, ref, children, ...rest }: PressScaleProps) {
  const { pressProps } = usePressScale({ isDisabled });
  const sx = stylex.props(motionStyles.pressScaleData, xstyle);
  return (
    <div {...rest} {...pressProps} ref={ref} {...mergeSx(sx, className)}>
      {children}
    </div>
  );
}
