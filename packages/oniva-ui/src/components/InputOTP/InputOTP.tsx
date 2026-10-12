import * as stylex from '@stylexjs/stylex';
import { useState, type ReactNode, type Ref } from 'react';
import {
  FieldError,
  Input,
  Label,
  Text,
  TextField,
  type TextFieldProps,
  type ValidationResult,
} from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { cx, ff } from '../../internal/forms-field';

const styles = stylex.create({
  contents: { display: 'contents' },
  row: {
    alignItems: 'center',
    display: 'flex',
    gap: 8,
    position: 'relative',
    width: 'fit-content',
  },
  slot: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-xs'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    display: 'flex',
    fontSize: font['--oniva-font-size-20'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-semibold'],
    height: 48,
    justifyContent: 'center',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'border-color, box-shadow',
    width: 40,
  },
  active: {
    borderColor: colors['--oniva-color-focus-ring'],
    boxShadow: `0 0 0 3px color-mix(in srgb, ${colors['--oniva-color-focus-ring']} 25%, transparent)`,
  },
  invalid: {
    backgroundColor: colors['--oniva-color-error-bg'],
    borderColor: colors['--oniva-color-error-border'],
  },
  disabled: {
    backgroundColor: colors['--oniva-color-surface-hover'],
    color: colors['--oniva-color-text-disabled'],
  },
  caret: {
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    animationName: stylex.keyframes({ '0%, 49%': { opacity: 1 }, '50%, 100%': { opacity: 0 } }),
    backgroundColor: colors['--oniva-color-text'],
    height: 20,
    width: 1,
  },
  sep: { backgroundColor: colors['--oniva-color-border-control'], height: 2, width: 8 },
  input: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    caretColor: 'transparent',
    color: 'transparent',
    cursor: 'text',
    height: '100%',
    inset: 0,
    opacity: 0,
    outline: 'none',
    position: 'absolute',
    width: '100%',
  },
});

export interface InputOTPProps extends Omit<
  TextFieldProps,
  'pattern' | 'className' | 'style' | 'children' | 'value' | 'defaultValue' | 'onChange'
> {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: string | ((v: ValidationResult) => string);
  /** Number of characters. Default 6. */
  length?: number;
  /** Insert a dash after this many slots (e.g. 3 for 123-456). */
  separatorAt?: number;
  /** Allowed characters; default digits only. */
  allowedChars?: RegExp;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Called once all slots are filled. */
  onComplete?: (value: string) => void;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLInputElement>;
}

/** One-time-code input: a single hidden native input drives visual slots (paste + autofill friendly). */
export function InputOTP({
  label,
  description,
  errorMessage,
  length = 6,
  separatorAt,
  allowedChars = /^\d*$/,
  value,
  defaultValue = '',
  onChange,
  onComplete,
  className,
  xstyle,
  ref,
  ...rest
}: InputOTPProps) {
  const [inner, setInner] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const current = value ?? inner;
  const root = stylex.props(ff.root, xstyle);

  const handle = (next: string) => {
    if (!allowedChars.test(next)) return;
    const v = next.slice(0, length);
    if (value === undefined) setInner(v);
    onChange?.(v);
    if (v.length === length) onComplete?.(v);
  };

  return (
    <TextField
      {...rest}
      value={current}
      onChange={handle}
      onFocusChange={setFocused}
      className={cx(root.className, className)}
    >
      {({ isInvalid, isDisabled }) => (
        <>
          {label != null && <Label {...stylex.props(ff.label)}>{label}</Label>}
          <div {...stylex.props(styles.row)}>
            {Array.from({ length }, (_, i) => {
              const isActive = focused && i === Math.min(current.length, length - 1);
              return (
                <span key={i} {...stylex.props(styles.contents)}>
                  <span
                    aria-hidden="true"
                    data-slot={i}
                    {...stylex.props(
                      styles.slot,
                      isActive && styles.active,
                      isInvalid && styles.invalid,
                      isDisabled && styles.disabled,
                    )}
                  >
                    {current[i] ??
                      (isActive && current.length < length ? (
                        <span {...stylex.props(styles.caret)} />
                      ) : null)}
                  </span>
                  {separatorAt != null && i + 1 === separatorAt && i + 1 < length && (
                    <span aria-hidden="true" {...stylex.props(styles.sep)} />
                  )}
                </span>
              );
            })}
            <Input
              ref={ref}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={length}
              {...stylex.props(styles.input)}
            />
          </div>
          {description != null && (
            <Text slot="description" {...stylex.props(ff.description)}>
              {description}
            </Text>
          )}
          <FieldError {...stylex.props(ff.error)}>{errorMessage}</FieldError>
        </>
      )}
    </TextField>
  );
}
