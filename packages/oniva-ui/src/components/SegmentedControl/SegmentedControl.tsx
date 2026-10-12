import * as stylex from '@stylexjs/stylex';
import type { ControlSize } from '../../internal/types';
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps as AriaRadioProps,
  RadioGroupStateContext,
} from 'react-aria-components';
import { createContext, use, type ReactNode, type Ref, type RefObject } from 'react';
import { useObjectRef } from 'react-aria';
import { SlidingIndicator } from '../../motion/SlidingIndicator';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { cx, ff } from '../../internal/forms-field';

const styles = stylex.create({
  track: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-lg'],
    boxSizing: 'border-box',
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    gap: 2,
    padding: 4,
    position: 'relative',
  },
  indicator: {
    backgroundColor: colors['--oniva-color-surface'],
    borderRadius: radius['--oniva-radius-sm'],
    boxShadow: shadow['--oniva-shadow-xs'],
    transitionTimingFunction: motion['--oniva-motion-ease-in-out'],
  },
  full: { display: 'flex', width: '100%' },
  item: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-sm'],
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'inline-flex',
    flexGrow: 0,
    fontSize: font['--oniva-font-size-14'],
    gap: 6,
    justifyContent: 'center',
    lineHeight: font['--oniva-font-lh-14'],
    paddingBlock: 4,
    paddingInline: 10,
    position: 'relative',
    touchAction: 'manipulation',
    transform: {
      default: 'none',
      ':active:not([data-disabled])': `scale(${motion['--oniva-motion-press-scale']})`,
    },
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'color, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    zIndex: 1,
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  itemSm: { fontSize: font['--oniva-font-size-13'], height: 24, paddingInline: 8 },
  itemMd: { height: 28 },
  fullItem: { flexGrow: 1 },
  off: {
    color: colors['--oniva-color-text-muted'],
    fontWeight: font['--oniva-font-weight-regular'],
  },
  offHover: { color: colors['--oniva-color-text'] },
  on: {
    color: colors['--oniva-color-text'],
    fontWeight: font['--oniva-font-weight-medium'],
  },
  disabled: { cursor: 'not-allowed', opacity: 0.5 },
});

const SizeCtx = createContext<{ size: 'sm' | 'md'; full: boolean }>({ size: 'md', full: false });

function SegIndicator({ containerRef }: { containerRef: RefObject<HTMLElement | null> }) {
  const value = use(RadioGroupStateContext)?.selectedValue;
  return (
    <SlidingIndicator
      containerRef={containerRef}
      activeKey={value}
      selector='[data-selected="true"]'
      xstyle={styles.indicator}
    />
  );
}

export interface SegmentedControlProps extends Omit<
  AriaRadioGroupProps,
  'className' | 'style' | 'children' | 'orientation'
> {
  size?: Extract<ControlSize, 'sm' | 'md'>;
  /** Stretch to container width with equal segments. */
  fullWidth?: boolean;
  children?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function SegmentedControl({
  size = 'md',
  fullWidth = false,
  children,
  className,
  xstyle,
  ref,
  ...rest
}: SegmentedControlProps) {
  const objRef = useObjectRef(ref);
  const sx = stylex.props(styles.track, fullWidth && styles.full, xstyle);
  return (
    <AriaRadioGroup
      {...rest}
      ref={objRef}
      orientation="horizontal"
      className={cx(sx.className, className)}
    >
      <SegIndicator containerRef={objRef} />
      <SizeCtx value={{ size, full: fullWidth }}>{children}</SizeCtx>
    </AriaRadioGroup>
  );
}

export interface SegmentedControlItemProps extends Omit<
  AriaRadioProps,
  'className' | 'style' | 'children'
> {
  children?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLLabelElement>;
}

export function SegmentedControlItem({
  children,
  className,
  xstyle,
  ref,
  ...rest
}: SegmentedControlItemProps) {
  const { size, full } = use(SizeCtx);
  return (
    <AriaRadio
      {...rest}
      ref={ref}
      className={({ isSelected, isHovered, isDisabled, isFocusVisible }) =>
        cx(
          stylex.props(
            styles.item,
            size === 'sm' ? styles.itemSm : styles.itemMd,
            full && styles.fullItem,
            isSelected ? styles.on : styles.off,
            !isSelected && isHovered && styles.offHover,
            isFocusVisible && ff.focusRing,
            isDisabled && styles.disabled,
            xstyle,
          ).className,
          className,
        )
      }
    >
      {children}
    </AriaRadio>
  );
}
