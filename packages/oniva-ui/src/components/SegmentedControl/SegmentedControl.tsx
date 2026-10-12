import * as stylex from '@stylexjs/stylex';
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps as AriaRadioProps,
} from 'react-aria-components';
import { createContext, use, type ReactNode, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { cx, ff } from '../../internal/forms-field';

const styles = stylex.create({
  track: {
    alignItems: 'center',
    backgroundColor: colors.surfaceInset,
    borderRadius: radius.lg,
    boxSizing: 'border-box',
    display: 'inline-flex',
    fontFamily: font.sans,
    gap: 2,
    padding: 4,
  },
  full: { display: 'flex', width: '100%' },
  item: {
    alignItems: 'center',
    borderRadius: radius.md,
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'inline-flex',
    flexGrow: 0,
    fontSize: font.size14,
    gap: 6,
    justifyContent: 'center',
    lineHeight: font.lh14,
    paddingBlock: 4,
    paddingInline: 10,
    transitionDuration: motion.durBase,
    transitionProperty: 'background-color, color, box-shadow',
    transitionTimingFunction: motion.easeStandard,
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  itemSm: { fontSize: font.size13, height: 24, paddingInline: 8 },
  itemMd: { height: 28 },
  fullItem: { flexGrow: 1 },
  off: { color: colors.textMuted, fontWeight: font.weightRegular },
  offHover: { color: colors.text },
  on: {
    backgroundColor: colors.surface,
    boxShadow: shadow.xs,
    color: colors.text,
    fontWeight: font.weightMedium,
  },
  disabled: { cursor: 'not-allowed', opacity: 0.5 },
});

const SizeCtx = createContext<{ size: 'sm' | 'md'; full: boolean }>({ size: 'md', full: false });

export interface SegmentedControlProps
  extends Omit<AriaRadioGroupProps, 'className' | 'style' | 'children' | 'orientation'> {
  size?: 'sm' | 'md';
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
  const sx = stylex.props(styles.track, fullWidth && styles.full, xstyle);
  return (
    <AriaRadioGroup {...rest} ref={ref} orientation="horizontal" className={cx(sx.className, className)}>
      <SizeCtx value={{ size, full: fullWidth }}>{children}</SizeCtx>
    </AriaRadioGroup>
  );
}

export interface SegmentedControlItemProps
  extends Omit<AriaRadioProps, 'className' | 'style' | 'children'> {
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
