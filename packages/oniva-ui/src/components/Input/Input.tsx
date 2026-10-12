import * as stylex from '@stylexjs/stylex';
import { media } from '../../tokens/media.stylex';
import type { ControlSize } from '../../internal/types';
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
import { ShakeDiv } from '../../internal/controls-motion';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    gap: 6,
  },
  label: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-14'],
  },
  field: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: {
      default: colors['--oniva-color-border'],
      ':hover': colors['--oniva-color-border-hover'],
      ':focus-within': colors['--oniva-color-focus-ring'],
    },
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-xs'],
    boxSizing: 'border-box',
    display: 'flex',
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 1,
    outlineStyle: { default: 'none', ':focus-within': 'solid' },
    outlineWidth: 2,
    gap: 6,
    transitionDuration: {
      default: motion['--oniva-motion-dur-base'],
      [media.reducedMotion]: '0.01ms',
    },
    transitionProperty: 'border-color, box-shadow, background-color',
    transitionTimingFunction: motion['--oniva-motion-ease-standard'],
  },
  invalid: {
    backgroundColor: colors['--oniva-color-error-bg'],
    borderColor: {
      default: colors['--oniva-color-error-border'],
      ':hover': colors['--oniva-color-error-border'],
      ':focus-within': colors['--oniva-color-error-border'],
    },
    outlineColor: colors['--oniva-color-error-border'],
  },
  disabled: {
    backgroundColor: colors['--oniva-color-surface-hover'],
    borderColor: colors['--oniva-color-border'],
    boxShadow: 'none',
    color: colors['--oniva-color-text-disabled'],
  },
  sm: { height: 32, paddingInline: 8 },
  md: { height: 38, paddingInline: 10 },
  lg: { height: 44, paddingInline: 12 },
  input: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: {
      default: colors['--oniva-color-text'],
      ':disabled': colors['--oniva-color-text-disabled'],
    },
    cursor: { default: 'text', ':disabled': 'not-allowed' },
    flexGrow: 1,
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-regular'],
    height: '100%',
    lineHeight: font['--oniva-font-lh-14'],
    minWidth: 0,
    outline: 'none',
    padding: 0,
    '::placeholder': { color: colors['--oniva-color-text-placeholder'] },
  },
  adornment: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'inline-flex',
    flexShrink: 0,
  },
  description: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-13'],
  },
  error: {
    color: colors['--oniva-color-text-error'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-13'],
  },
});

export interface InputProps extends Omit<AriaTextFieldProps, 'className' | 'style' | 'children'> {
  label?: ReactNode;
  description?: ReactNode;
  /** Custom error content, or a function receiving validation state (RAC). */
  errorMessage?: string | ((v: ValidationResult) => string);
  placeholder?: string;
  size?: ControlSize;
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
          <ShakeDiv
            isInvalid={isInvalid}
            styles={[styles.field, styles[size], isInvalid && styles.invalid, isDisabled && styles.disabled]}
          >
            {prefix != null && (
              <span aria-hidden="true" {...stylex.props(styles.adornment)}>
                {prefix}
              </span>
            )}
            <AriaInput ref={ref} placeholder={placeholder} {...stylex.props(styles.input)} />
            {suffix != null && <span {...stylex.props(styles.adornment)}>{suffix}</span>}
          </ShakeDiv>
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
