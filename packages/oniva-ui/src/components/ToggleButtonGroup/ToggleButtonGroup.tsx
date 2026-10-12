import * as stylex from '@stylexjs/stylex';
import {
  ToggleButtonGroup as AriaToggleButtonGroup,
  type ToggleButtonGroupProps as AriaToggleButtonGroupProps,
} from 'react-aria-components';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { ToggleGroupStyleContext, type ControlSize } from '../../internal/feedback-control';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  base: { alignItems: 'center', display: 'inline-flex', gap: 8 },
  segmented: {
    backgroundColor: colors.surfaceInset,
    borderRadius: radius.xl,
    gap: 2,
    padding: 2,
  },
  vertical: { alignItems: 'stretch', flexDirection: 'column' },
});

export interface ToggleButtonGroupProps
  extends Omit<AriaToggleButtonGroupProps, 'className' | 'style' | 'children'> {
  /** `segmented` = inset track with a raised selected tile. */
  variant?: 'secondary' | 'ghost' | 'soft' | 'segmented';
  size?: ControlSize;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Single/multiple selection group of ToggleButtons (RAC ToggleButtonGroup). */
export function ToggleButtonGroup({
  variant = 'segmented',
  size = 'md',
  className,
  style,
  xstyle,
  ref,
  children,
  ...rest
}: ToggleButtonGroupProps) {
  const sx = stylex.props(
    styles.base,
    variant === 'segmented' && styles.segmented,
    rest.orientation === 'vertical' && styles.vertical,
    xstyle,
  );
  return (
    <ToggleGroupStyleContext value={{ size, variant }}>
      <AriaToggleButtonGroup {...rest} ref={ref} {...mergeSx(sx, className, style)}>
        {children}
      </AriaToggleButtonGroup>
    </ToggleGroupStyleContext>
  );
}
