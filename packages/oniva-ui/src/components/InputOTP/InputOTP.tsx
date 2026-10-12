import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type Ref } from 'react';
import { shakeStyles, useShake } from '../../internal/controls-motion';
import { SlidingIndicator } from '../../motion/SlidingIndicator';
import { media } from '../../tokens/media.stylex';
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
import { mergeSx } from '../../internal/sx';

const digitIn = stylex.keyframes({
  from: { filter: 'blur(2px)', opacity: 0, transform: 'translateY(6px)' },
  to: { filter: 'blur(0)', opacity: 1, transform: 'translateY(0)' },
});
const digitFade = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const sweep = stylex.keyframes({
  '0%': { transform: 'translateY(0)' },
  '40%': { borderColor: colors['--oniva-color-success-solid'], transform: 'translateY(-3px)' },
  '100%': { transform: 'translateY(0)' },
});

const styles = stylex.create({
  digit: {
    animationDuration: '220ms',
    animationFillMode: 'backwards',
    animationName: { default: digitIn, [media.reducedMotion]: digitFade },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'inline-block',
  },
  ring: {
    backgroundColor: 'transparent',
    borderColor: colors['--oniva-color-focus-ring'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: `0 0 0 3px color-mix(in srgb, ${colors['--oniva-color-focus-ring']} 25%, transparent)`,
    boxSizing: 'border-box',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    zIndex: 2,
  },
  success: {
    animationDelay: 'calc(var(--oniva-i, 0) * 48ms)',
    animationDuration: '420ms',
    animationName: { default: sweep, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
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
  active: {},
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
  const [done, setDone] = useState(false);
  const current = value ?? inner;
  const root = stylex.props(ff.root, xstyle);

  const handle = (next: string) => {
    if (!allowedChars.test(next)) return;
    const v = next.slice(0, length);
    if (value === undefined) setInner(v);
    onChange?.(v);
    setDone(v.length === length && v.length > current.length);
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
        <OtpBody
          isInvalid={isInvalid}
          isDisabled={isDisabled}
          label={label}
          description={description}
          errorMessage={errorMessage}
          length={length}
          separatorAt={separatorAt}
          current={current}
          focused={focused}
          done={done}
          inputRef={ref}
        />
      )}
    </TextField>
  );
}

interface OtpBodyProps {
  isInvalid: boolean;
  isDisabled: boolean;
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: string | ((v: ValidationResult) => string);
  length: number;
  separatorAt?: number;
  current: string;
  focused: boolean;
  done: boolean;
  inputRef?: Ref<HTMLInputElement>;
}

function OtpBody({
  isInvalid,
  isDisabled,
  label,
  description,
  errorMessage,
  length,
  separatorAt,
  current,
  focused,
  done,
  inputRef,
}: OtpBodyProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const shake = useShake(isInvalid);
  const armed = useRef(false); // no digit roll-in for a pre-filled value on first paint
  useEffect(() => {
    armed.current = true;
  }, []);
  const sweeping = done && !isInvalid && current.length === length;
  const active = Math.min(current.length, length - 1);
  return (
    <>
      {label != null && <Label {...stylex.props(ff.label)}>{label}</Label>}
      <div
        ref={rowRef}
        onAnimationEnd={(e) => {
          if (e.target === e.currentTarget) shake.onAnimationEnd();
        }}
        {...stylex.props(styles.row, shake.shaking && shakeStyles.shake)}
      >
        {focused && !isDisabled && (
          <SlidingIndicator
            containerRef={rowRef}
            activeKey={active}
            selector='[data-active]'
            xstyle={styles.ring}
          />
        )}
        {Array.from({ length }, (_, i) => {
          const isActive = focused && i === active;
          return (
            <span key={i} {...stylex.props(styles.contents)}>
              <span
                aria-hidden="true"
                data-slot={i}
                data-active={isActive ? '' : undefined}
                {...mergeSx(
                  stylex.props(
                    styles.slot,
                    isActive && styles.active,
                    isInvalid && styles.invalid,
                    isDisabled && styles.disabled,
                    sweeping && styles.success,
                  ),
                  undefined,
                  { '--oniva-i': i } as CSSProperties,
                )}
              >
                {current[i] != null ? (
                  <span
                    key={current[i]}
                    {...stylex.props(armed.current && styles.digit)}
                  >
                    {current[i]}
                  </span>
                ) : isActive && current.length < length ? (
                  <span {...stylex.props(styles.caret)} />
                ) : null}
              </span>
              {separatorAt != null && i + 1 === separatorAt && i + 1 < length && (
                <span aria-hidden="true" {...stylex.props(styles.sep)} />
              )}
            </span>
          );
        })}
        <Input
          ref={inputRef}
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
  );
}
