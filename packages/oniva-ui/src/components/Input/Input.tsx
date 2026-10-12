import * as stylex from '@stylexjs/stylex';
import {
  FieldError,
  Input as AriaInput,
  Label,
  Text,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult,
} from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    gap: 6,
  },
  label: {
    color: colors.text,
    fontSize: font.size14,
    fontWeight: font.weightMedium,
    lineHeight: font.lh14,
  },
  field: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: {
      default: colors.border,
      ':hover': colors.borderHover,
      ':focus-within': colors.focusRing,
    },
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: {
      default: shadow.xs,
      ':focus-within': `0 0 0 3px color-mix(in srgb, ${colors.focusRing} 25%, transparent)`,
    },
    boxSizing: 'border-box',
    display: 'flex',
    gap: 6,
    transitionDuration: motion.durBase,
    transitionProperty: 'border-color, box-shadow, background-color',
    transitionTimingFunction: motion.easeStandard,
  },
  invalid: {
    backgroundColor: colors.errorBg,
    borderColor: {
      default: colors.errorBorder,
      ':hover': colors.errorBorder,
      ':focus-within': colors.errorBorder,
    },
    boxShadow: {
      default: shadow.xs,
      ':focus-within': `0 0 0 3px color-mix(in srgb, ${colors.errorBorder} 25%, transparent)`,
    },
  },
  disabled: {
    backgroundColor: colors.surfaceHover,
    borderColor: colors.border,
    boxShadow: 'none',
    color: colors.textDisabled,
  },
  sm: { height: 32, paddingInline: 8 },
  md: { height: 38, paddingInline: 10 },
  lg: { height: 44, paddingInline: 12 },
  input: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: { default: colors.text, ':disabled': colors.textDisabled },
    cursor: { default: 'text', ':disabled': 'not-allowed' },
    flexGrow: 1,
    fontFamily: 'inherit',
    fontSize: font.size14,
    fontWeight: font.weightRegular,
    height: '100%',
    lineHeight: font.lh14,
    minWidth: 0,
    outline: 'none',
    padding: 0,
    '::placeholder': { color: colors.textPlaceholder },
  },
  adornment: {
    alignItems: 'center',
    color: colors.textMuted,
    display: 'inline-flex',
    flexShrink: 0,
  },
  description: { color: colors.textMuted, fontSize: font.size13, lineHeight: font.lh13 },
  error: { color: colors.textError, fontSize: font.size13, lineHeight: font.lh13 },
});

export interface InputProps extends Omit<AriaTextFieldProps, 'className' | 'style' | 'children'> {
  label?: ReactNode;
  description?: ReactNode;
  /** Custom error content, or a function receiving validation state (RAC). */
  errorMessage?: string | ((v: ValidationResult) => string);
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Leading adornment (icon or text). Decorative. */
  prefix?: ReactNode;
  /** Trailing adornment (icon, unit, or button). */
  suffix?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLInputElement>;
}

export function Input({
  label,
  description,
  errorMessage,
  placeholder,
  size = 'md',
  prefix,
  suffix,
  className,
  xstyle,
  ref,
  ...rest
}: InputProps) {
  const root = stylex.props(styles.root, xstyle);
  return (
    <AriaTextField
      {...rest}
      {...root}
      className={[root.className, className].filter(Boolean).join(' ')}
    >
      {({ isInvalid, isDisabled }) => (
        <>
          {label != null && <Label {...stylex.props(styles.label)}>{label}</Label>}
          <div
            {...stylex.props(
              styles.field,
              styles[size],
              isInvalid && styles.invalid,
              isDisabled && styles.disabled,
            )}
          >
            {prefix != null && (
              <span aria-hidden="true" {...stylex.props(styles.adornment)}>
                {prefix}
              </span>
            )}
            <AriaInput ref={ref} placeholder={placeholder} {...stylex.props(styles.input)} />
            {suffix != null && <span {...stylex.props(styles.adornment)}>{suffix}</span>}
          </div>
          {description != null && (
            <Text slot="description" {...stylex.props(styles.description)}>
              {description}
            </Text>
          )}
          <FieldError {...stylex.props(styles.error)}>{errorMessage}</FieldError>
        </>
      )}
    </AriaTextField>
  );
}
