import * as stylex from '@stylexjs/stylex';
import { Check, Minus } from 'lucide-react';
import { Checkbox as AriaCheckbox, type CheckboxProps as AriaCheckboxProps } from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { cx, ff } from '../../internal/forms-field';

const styles = stylex.create({
  root: {
    alignItems: 'flex-start',
    color: colors.text,
    cursor: 'pointer',
    display: 'flex',
    fontFamily: font.sans,
    fontSize: font.size14,
    fontWeight: font.weightMedium,
    gap: 10,
    lineHeight: font.lh14,
  },
  rootDisabled: { cursor: 'not-allowed', opacity: 0.5 },
  box: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.borderControl,
    borderRadius: radius.xs,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow.xs,
    boxSizing: 'border-box',
    color: colors.accentFg,
    display: 'inline-flex',
    flexShrink: 0,
    height: 16,
    justifyContent: 'center',
    marginTop: 2,
    transitionDuration: motion.durBase,
    transitionProperty: 'background-color, border-color, box-shadow',
    transitionTimingFunction: motion.easeStandard,
    width: 16,
  },
  boxHover: { borderColor: colors.borderActive },
  boxOn: {
    backgroundImage: `linear-gradient(180deg, ${accent.accent500}, ${accent.accent600})`,
    borderColor: 'transparent',
    boxShadow: shadow.accentInset,
  },
  boxInvalid: { borderColor: colors.errorBorder },
  text: { display: 'flex', flexDirection: 'column', gap: 2 },
  desc: { fontWeight: font.weightRegular },
});

export interface CheckboxProps extends Omit<AriaCheckboxProps, 'className' | 'style' | 'children'> {
  children?: ReactNode;
  description?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLLabelElement>;
}

export function Checkbox({ children, description, className, xstyle, ref, ...rest }: CheckboxProps) {
  return (
    <AriaCheckbox
      {...rest}
      ref={ref}
      className={({ isDisabled }) =>
        cx(stylex.props(styles.root, isDisabled && styles.rootDisabled, xstyle).className, className)
      }
    >
      {({ isSelected, isIndeterminate, isFocusVisible, isHovered, isInvalid }) => (
        <>
          <span
            aria-hidden="true"
            {...stylex.props(
              styles.box,
              isHovered && !isSelected && !isIndeterminate && styles.boxHover,
              (isSelected || isIndeterminate) && styles.boxOn,
              isInvalid && styles.boxInvalid,
              isFocusVisible && ff.focusRing,
            )}
          >
            {isIndeterminate ? (
              <Minus size={12} strokeWidth={3} />
            ) : isSelected ? (
              <Check size={12} strokeWidth={3} />
            ) : null}
          </span>
          {(children != null || description != null) && (
            <span {...stylex.props(styles.text)}>
              {children}
              {description != null && (
                <span {...stylex.props(ff.description, styles.desc)}>{description}</span>
              )}
            </span>
          )}
        </>
      )}
    </AriaCheckbox>
  );
}
