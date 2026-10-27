import * as stylex from '@stylexjs/stylex';
import {
  ToggleButtonGroup as AriaToggleButtonGroup,
  ToggleGroupStateContext,
  type ToggleButtonGroupProps as AriaToggleButtonGroupProps,
} from 'react-aria-components';
import { use, type CSSProperties, type ReactNode, type Ref, type RefObject } from 'react';
import { useObjectRef } from 'react-aria';
import { SlidingIndicator } from '../../motion/SlidingIndicator';
import { ToggleGroupStyleContext, type ButtonSize } from '../../internal/feedback-control';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

const styles = stylex.create({
  base: { alignItems: 'center', display: 'inline-flex', gap: 8 },
  segmented: {
    position: 'relative',
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-xl'],
    boxShadow: shadow['--oniva-elevation-recessed'],
    gap: 2,
    padding: 2,
  },
  indicator: {
    backgroundColor: colors['--oniva-color-segment-selected'],
    borderRadius: radius['--oniva-radius-lg'],
    boxShadow: shadow['--oniva-elevation-raised'],
    transitionTimingFunction: motion['--oniva-motion-ease-in-out'],
  },
  vertical: { alignItems: 'stretch', flexDirection: 'column' },
});

function GroupIndicator({ containerRef }: { containerRef: RefObject<HTMLElement | null> }) {
  const keys = use(ToggleGroupStateContext)?.selectedKeys;
  return (
    <SlidingIndicator
      containerRef={containerRef}
      activeKey={keys ? [...keys].join('|') : ''}
      selector='[data-selected="true"]'
      xstyle={styles.indicator}
    />
  );
}

export interface ToggleButtonGroupProps extends Omit<
  AriaToggleButtonGroupProps,
  'className' | 'style' | 'children'
> {
  /** `segmented` = inset track with a raised selected tile. */
  variant?: 'secondary' | 'ghost' | 'soft' | 'segmented';
  size?: ButtonSize;
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
  const objRef = useObjectRef(ref);
  const slide = variant === 'segmented' && rest.selectionMode !== 'multiple' && rest.orientation !== 'vertical';
  const sx = stylex.props(
    styles.base,
    variant === 'segmented' && styles.segmented,
    rest.orientation === 'vertical' && styles.vertical,
    xstyle,
  );
  return (
    <ToggleGroupStyleContext value={{ size, variant, slide }}>
      <AriaToggleButtonGroup {...rest} ref={objRef} {...mergeSx(sx, className, style)}>
        {slide && <GroupIndicator containerRef={objRef} />}
        {children}
      </AriaToggleButtonGroup>
    </ToggleGroupStyleContext>
  );
}
