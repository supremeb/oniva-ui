import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type Ref } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { Button } from 'react-aria-components';
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

const pillIn = stylex.keyframes({
  from: { filter: 'blur(3px)', opacity: 0, transform: 'scale(0.96)' },
  to: { filter: 'blur(0)', opacity: 1, transform: 'scale(1)' },
});
const pillFade = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const pulse = stylex.keyframes({ '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.55 } });

export type InputOTPStatus = 'idle' | 'verifying' | 'error' | 'success';

const styles = stylex.create({
  verifying: {
    animationDuration: '1200ms',
    animationDelay: 'calc(var(--oniva-i, 0) * 80ms)',
    animationIterationCount: 'infinite',
    animationName: { default: pulse, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
  },
  pill: {
    alignItems: 'center',
    animationDuration: '250ms',
    animationName: { default: pillIn, [media.reducedMotion]: pillFade },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundColor: colors['--oniva-color-success-bg'],
    borderColor: colors['--oniva-color-success-solid'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: colors['--oniva-color-success-fg'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 6,
    height: 48,
    paddingInline: 18,
  },
  hidden: { display: 'none' },
  centered: { alignItems: 'center', textAlign: 'center' },
  filled: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderColor: 'transparent',
    boxShadow: 'none',
    flexShrink: 0,
    height: 52,
    width: 46,
  },
  errLine: { alignItems: 'center', display: 'inline-flex', gap: 6 },
  resendRow: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    fontVariantNumeric: 'tabular-nums',
  },
  resendBtn: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: radius['--oniva-radius-sm'],
    color: colors['--oniva-color-accent-text'],
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: font['--oniva-font-weight-medium'],
    padding: 0,
    textDecoration: 'underline',
  },
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
    boxShadow: shadow['--oniva-elevation-recessed'],
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
  /** Letters and digits (shown uppercase) instead of digits only. Ignored when `allowedChars` is set. */
  numeric?: boolean;
  /**
   * Verification state: `verifying` pulses and locks the field, `error` shakes and shows the message,
   * `success` morphs the boxes into a "Verified" pill.
   */
  status?: InputOTPStatus;
  /** Text in the success pill. Default `Verified`. */
  successLabel?: string;
  /** `center` centres the boxes, error and resend lines (card compositions). Default `start`. */
  align?: 'start' | 'center';
  /** `filled` swaps the outlined slots for soft filled ones. Default `outline`. */
  variant?: 'outline' | 'filled';
  /** Clear the boxes shortly after an error shake. Default true. */
  clearOnError?: boolean;
  /** Shows "Didn't get a code?" with a countdown that becomes a Resend button. */
  onResend?: () => void;
  /** Seconds before resend is allowed. Default 30. */
  resendIn?: number;
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
  allowedChars: allowedProp,
  numeric = true,
  status = 'idle',
  successLabel = 'Verified',
  clearOnError = true,
  align = 'start',
  variant = 'outline',
  onResend,
  resendIn = 30,
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
  const root = stylex.props(ff.root, align === 'center' && styles.centered, xstyle);
  const allowedChars = allowedProp ?? (numeric ? /^\d*$/ : /^[a-z0-9]*$/i);
  const errored = status === 'error';

  const handle = (raw: string) => {
    // Paste / SMS autofill: drop anything not allowed ("123-456" -> "123456") instead of rejecting it all.
    const next = [...(numeric ? raw : raw.toUpperCase())].filter((c) => allowedChars.test(c)).join('');
    const v = next.slice(0, length);
    if (value === undefined) setInner(v);
    onChange?.(v);
    setDone(v.length === length && v.length > current.length);
    if (v.length === length && v !== current) onComplete?.(v);
  };

  // Calm clear after the shake so the next try starts empty.
  useEffect(() => {
    if (!errored || !clearOnError) return;
    const t = window.setTimeout(() => {
      if (value === undefined) setInner('');
      onChange?.('');
    }, 650);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errored, clearOnError]);

  return (
    <TextField
      {...rest}
      isInvalid={rest.isInvalid || errored || undefined}
      isDisabled={rest.isDisabled || status === 'success'}
      isReadOnly={rest.isReadOnly || status === 'verifying'}
      aria-busy={status === 'verifying' || undefined}
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
          errorMessage={errored && errorMessage == null ? "That code didn't work. Try again." : errorMessage}
          status={status}
          successLabel={successLabel}
          numeric={numeric}
          onResend={onResend}
          resendIn={resendIn}
          filled={variant === 'filled'}
          centered={align === 'center'}
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
  status: InputOTPStatus;
  successLabel: string;
  numeric: boolean;
  onResend?: () => void;
  resendIn: number;
  filled?: boolean;
  centered?: boolean;
}

function ResendRow({ onResend, seconds }: { onResend: () => void; seconds: number }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (left <= 0) return;
    const t = window.setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => window.clearTimeout(t);
  }, [left]);
  const mm = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
  return (
    <div {...stylex.props(styles.resendRow)}>
      Didn&apos;t get a code?{' '}
      {left > 0 ? (
        <span>Resend in {mm}</span>
      ) : (
        <Button
          onPress={() => {
            onResend();
            setLeft(seconds);
          }}
          {...stylex.props(styles.resendBtn)}
        >
          Resend code
        </Button>
      )}
    </div>
  );
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
  status,
  successLabel,
  numeric,
  onResend,
  resendIn,
  filled,
  centered,
}: OtpBodyProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const shake = useShake(isInvalid);
  const armed = useRef(false); // no digit roll-in for a pre-filled value on first paint
  useEffect(() => {
    armed.current = true;
  }, []);
  const sweeping = done && !isInvalid && current.length === length;
  const active = Math.min(current.length, length - 1);
  const errEl = (
        <FieldError {...stylex.props(ff.error)}>
          {centered
            ? (v: ValidationResult) => (
                <span {...stylex.props(styles.errLine)}>
                  <AlertCircle size={14} aria-hidden="true" />
                  {typeof errorMessage === 'function' ? errorMessage(v) : errorMessage}
                </span>
              )
            : errorMessage}
        </FieldError>
  );
  return (
    <>
      {label != null && <Label {...stylex.props(ff.label)}>{label}</Label>}
      <div
        ref={rowRef}
        onAnimationEnd={(e) => {
          if (e.target === e.currentTarget) shake.onAnimationEnd();
        }}
        {...stylex.props(styles.row, shake.shaking && shakeStyles.shake, status === 'success' && styles.hidden)}
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
                    filled && styles.filled,
                    isActive && styles.active,
                    isInvalid && styles.invalid,
                    isDisabled && styles.disabled,
                    sweeping && status !== 'verifying' && styles.success,
                    status === 'verifying' && styles.verifying,
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
          inputMode={numeric ? 'numeric' : 'text'}
          autoComplete="one-time-code"
          {...stylex.props(styles.input)}
        />
      </div>
      {status === 'success' && (
        <div role="status" {...stylex.props(styles.pill)}>
          <Check size={16} aria-hidden="true" />
          {successLabel}
        </div>
      )}
      {centered && errEl}
      {onResend && status !== 'success' && <ResendRow onResend={onResend} seconds={resendIn} />}
      {description != null && (
        <Text slot="description" {...stylex.props(ff.description)}>
          {description}
        </Text>
      )}
      {!centered && errEl}
    </>
  );
}
