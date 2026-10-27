import * as stylex from '@stylexjs/stylex';
import { Check } from 'lucide-react';
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from 'react';
import { Radio, RadioGroup } from 'react-aria-components';
import { SlidingIndicator } from '../../motion/SlidingIndicator';
import { prefersReducedMotion } from '../../internal/motion-hooks';
import { focus } from '../../internal/focus';
import { mergeSx } from '../../internal/sx';
import { shakeStyles } from '../../internal/controls-motion';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { Button } from '../Button';
import { Input, type InputProps } from '../Input';
import { VisuallyHidden } from '../VisuallyHidden';

const slideNext = stylex.keyframes({
  from: { opacity: 0, transform: 'translateX(16px)' },
  to: { opacity: 1, transform: 'translateX(0)' },
});
const slideBack = stylex.keyframes({
  from: { opacity: 0, transform: 'translateX(-16px)' },
  to: { opacity: 1, transform: 'translateX(0)' },
});
const fade = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const pop = stylex.keyframes({
  '0%': { opacity: 0, transform: 'scale(0.6)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
});

const styles = stylex.create({
  root: {
    containerType: 'inline-size',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    gap: 0,
    width: '100%',
  },
  rail: {
    display: 'flex',
    gap: 12,
    listStyle: 'none',
    margin: 0,
    paddingBlockStart: 16,
    paddingInline: 24,
  },
  railItem: { display: 'flex', flexBasis: 0, flexGrow: 1, flexDirection: 'column', gap: 10, minWidth: 0 },
  railBar: {
    backgroundColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-full'],
    height: 2,
    overflow: 'hidden',
  },
  railFill: {
    backgroundColor: accent['--oniva-accent-solid'],
    display: 'block',
    height: '100%',
    transform: { default: 'scaleX(0)', '[data-on]': 'scaleX(1)' },
    transformOrigin: 'left',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  railLabel: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderRadius: radius['--oniva-radius-sm'],
    borderWidth: 0,
    color: { default: colors['--oniva-color-text-muted'], '[aria-current="step"]': colors['--oniva-color-text'] },
    cursor: 'default',
    display: 'flex',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 8,
    letterSpacing: '0.06em',
    minWidth: 0,
    padding: 0,
    textTransform: 'uppercase',
  },
  railClickable: { cursor: 'pointer' },
  railNum: {
    color: { default: colors['--oniva-color-text-muted'], '[data-on]': colors['--oniva-color-accent-text'] },
    fontVariantNumeric: 'tabular-nums',
  },
  railText: {
    display: { default: 'inline', '@container (max-width: 480px)': 'none' },
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  body: { display: 'flex', flexDirection: 'column', padding: 24 },
  card: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: 'none',
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    overflow: 'hidden',
    padding: 0,
  },
  stage: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: {
      default: slideNext,
      '[data-dir="back"]': slideBack,
      [media.reducedMotion]: fade,
    },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  heading: {
    fontSize: font['--oniva-font-size-18'],
    fontWeight: font['--oniva-font-weight-semibold'],
    lineHeight: font['--oniva-font-lh-18'],
    margin: 0,
    outline: 'none',
  },
  desc: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-14'],
    lineHeight: font['--oniva-font-lh-14'],
    margin: 0,
    marginBlockStart: 4,
  },
  footer: {
    alignItems: 'center',
    borderBlockStartColor: colors['--oniva-color-border'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'flex',
    gap: 8,
    justifyContent: 'space-between',
    paddingBlock: 12,
    paddingInline: 16,
  },
  footerEnd: { alignItems: 'center', display: 'flex', gap: 12 },
  submitError: { color: colors['--oniva-color-text-error'], fontSize: font['--oniva-font-size-13'] },
  ring: {
    backgroundColor: 'transparent',
    borderColor: colors['--oniva-color-accent-text'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: `0 0 0 1px ${colors['--oniva-color-accent-text']}`,
    boxSizing: 'border-box',
    zIndex: 2,
  },
  choices: { position: 'relative', display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' },
  choice: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: {
      default: colors['--oniva-color-border'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-border-hover'] },
    },
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 2,
    outlineStyle: { default: 'none', '[data-focus-visible]': 'solid' },
    outlineWidth: 2,
    padding: 14,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'border-color, box-shadow',
  },
  choiceTop: { alignItems: 'baseline', display: 'flex', gap: 8, justifyContent: 'space-between' },
  choiceTitle: { fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-semibold'] },
  choiceAside: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    fontVariantNumeric: 'tabular-nums',
  },
  choiceDesc: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'] },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors['--oniva-color-accent-soft'],
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-accent-soft-fg'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    paddingBlock: 1,
    paddingInline: 8,
  },
  review: { display: 'flex', flexDirection: 'column', margin: 0 },
  reviewRow: {
    alignItems: 'baseline',
    borderBlockEndColor: colors['--oniva-color-border'],
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    display: 'flex',
    gap: 12,
    justifyContent: 'space-between',
    paddingBlock: 10,
  },
  reviewLabel: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-14'] },
  reviewValue: { fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-medium'], margin: 0 },
  edit: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors['--oniva-color-accent-text'],
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-13'],
    marginInlineStart: 12,
    textDecoration: 'underline',
  },
  success: { alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 10, padding: 24, paddingBlock: 40, textAlign: 'center' },
  successIcon: {
    alignItems: 'center',
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationName: { default: pop, [media.reducedMotion]: fade },
    animationTimingFunction: motion['--oniva-motion-ease-spring'],
    backgroundColor: colors['--oniva-color-success-bg'],
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-success-fg'],
    display: 'flex',
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
});

export type StepperFormErrors = Record<string, string | undefined>;

export interface StepperFormContext<V> {
  values: V;
  /** Merge a patch into the shared values. */
  setValues: (patch: Partial<V>) => void;
  errors: StepperFormErrors;
  /** Jump to a step by id or index (steps before the current one only skip validation going back). */
  goTo: (step: string | number) => void;
  next: () => void;
}

export interface StepperFormStep<V> {
  id: string;
  title: string;
  heading?: ReactNode;
  description?: ReactNode;
  render: (ctx: StepperFormContext<V>) => ReactNode;
  /** Return a message per field name. Any message blocks Continue. */
  validate?: (values: V) => StepperFormErrors;
}

export interface StepperFormProps<V extends object> {
  steps: StepperFormStep<V>[];
  initialValues: V;
  /** Runs on the last step. A thrown error is shown next to the button. */
  onComplete?: (values: V) => void | Promise<void>;
  initialStep?: number;
  /** Controlled step index; pair with `onStepChange`. */
  step?: number;
  onStepChange?: (step: number) => void;
  submitLabel?: string;
  submittingLabel?: string;
  continueLabel?: string;
  backLabel?: string;
  /** Replaces the steps once complete. Defaults to a simple done panel. */
  renderSuccess?: (values: V, reset: () => void) => ReactNode;
  'aria-label'?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormCtx = createContext<StepperFormContext<any> | null>(null);

/** Access values / errors / navigation from inside a step. */
export function useStepperForm<V = Record<string, unknown>>(): StepperFormContext<V> {
  const c = use(FormCtx);
  if (!c) throw new Error('useStepperForm must be used inside <StepperForm>');
  return c as StepperFormContext<V>;
}

export function StepperForm<V extends object>({
  steps,
  initialValues,
  onComplete,
  initialStep = 0,
  step: stepProp,
  onStepChange,
  submitLabel = 'Finish',
  submittingLabel = 'Creating…',
  continueLabel = 'Continue',
  backLabel = 'Back',
  renderSuccess,
  'aria-label': ariaLabel = 'Setup steps',
  className,
  xstyle,
  ref,
}: StepperFormProps<V>) {
  const [innerStep, setInnerStep] = useState(initialStep);
  const index = stepProp ?? innerStep;
  const [values, setAll] = useState<V>(initialValues);
  const [errors, setErrors] = useState<StepperFormErrors>({});
  const [dir, setDir] = useState<'next' | 'back'>('next');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [announce, setAnnounce] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardH = useRef<number | null>(null);
  const mounted = useRef(false);
  const current = steps[index]!;
  const last = index === steps.length - 1;

  // The card glides to the height of each step (WAAPI on the clipped card; interruptible).
  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const next = el.offsetHeight;
    const prev = cardH.current;
    cardH.current = next;
    if (prev == null || Math.abs(prev - next) < 2 || prefersReducedMotion() || typeof el.animate !== 'function') return;
    const a = el.animate([{ height: `${prev}px` }, { height: `${next}px` }], {
      duration: 280,
      easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    });
    return () => a.cancel();
  }, [index, done]);

  const setStep = useCallback(
    (n: number) => {
      const clamped = Math.max(0, Math.min(steps.length - 1, n));
      setDir(clamped >= index ? 'next' : 'back');
      if (stepProp === undefined) setInnerStep(clamped);
      onStepChange?.(clamped);
    },
    [index, onStepChange, stepProp, steps.length],
  );

  // Focus the new step's heading and announce it (not on first paint).
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    setAnnounce(`Step ${index + 1} of ${steps.length}: ${current.title}`);
  }, [index, steps.length, current.title]);

  const setValues = useCallback((patch: Partial<V>) => {
    setAll((v) => ({ ...v, ...patch }));
    setErrors((e) => {
      const next = { ...e };
      for (const k of Object.keys(patch)) delete next[k];
      return next;
    });
  }, []);

  const validate = (): boolean => {
    const found = current.validate?.(values) ?? {};
    const messages = Object.entries(found).filter(([, m]) => m);
    setErrors(found);
    if (messages.length === 0) return true;
    setAnnounce(messages.map(([, m]) => m).join('. '));
    requestAnimationFrame(() => stageRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
    return false;
  };

  const next = () => {
    if (!validate()) return;
    if (!last) return setStep(index + 1);
    void (async () => {
      setSubmitting(true);
      setSubmitError(null);
      try {
        await onComplete?.(values);
        setDone(true);
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : String(err));
      } finally {
        setSubmitting(false);
      }
    })();
  };

  const goTo = (target: string | number) => {
    const i = typeof target === 'number' ? target : steps.findIndex((s) => s.id === target);
    if (i >= 0) setStep(i);
  };

  const reset = () => {
    setAll(initialValues);
    setErrors({});
    setDone(false);
    setStep(0);
  };

  const ctx: StepperFormContext<V> = { values, setValues, errors, goTo, next };
  const root = stylex.props(styles.root, xstyle);

  return (
    <div ref={ref} {...mergeSx(root, className)}>
      <FormCtx value={ctx}>
        <div ref={cardRef} {...stylex.props(styles.card)}>
          {done ? (
            (renderSuccess?.(values, reset) ?? (
              <StepperFormSuccess title="All set" description="Your setup is complete." />
            ))
          ) : (
            <>
              <ol aria-label={ariaLabel} {...stylex.props(styles.rail)}>
                {steps.map((s, i) => {
                  const on = i <= index;
                  const clickable = i < index && !submitting;
                  return (
                    <li key={s.id} {...stylex.props(styles.railItem)}>
                      <span aria-hidden="true" {...stylex.props(styles.railBar)}>
                        <span data-on={on ? '' : undefined} {...stylex.props(styles.railFill)} />
                      </span>
                      <button
                        type="button"
                        aria-current={i === index ? 'step' : undefined}
                        aria-label={`Step ${i + 1}: ${s.title}`}
                        disabled={!clickable}
                        onClick={() => clickable && setStep(i)}
                        {...stylex.props(styles.railLabel, clickable && styles.railClickable, focus.ring)}
                      >
                        <span data-on={on ? '' : undefined} {...stylex.props(styles.railNum)}>
                          {i + 1}
                        </span>
                        <span {...stylex.props(styles.railText)}>{s.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              <div key={current.id} ref={stageRef} data-dir={dir} {...stylex.props(styles.stage, styles.body)}>
                <div>
                  <h2 ref={headingRef} tabIndex={-1} {...stylex.props(styles.heading)}>
                    {current.heading ?? current.title}
                  </h2>
                  {current.description != null && <p {...stylex.props(styles.desc)}>{current.description}</p>}
                </div>
                {current.render(ctx)}
              </div>
              <div {...stylex.props(styles.footer)}>
                {index > 0 ? (
                  <Button variant="ghost" onPress={() => setStep(index - 1)} isDisabled={submitting}>
                    {backLabel}
                  </Button>
                ) : (
                  <span />
                )}
                <div {...stylex.props(styles.footerEnd)}>
                  {submitError && (
                    <span role="alert" {...stylex.props(styles.submitError)}>
                      {submitError}
                    </span>
                  )}
                  <Button onPress={next} isLoading={submitting}>
                    {submitting ? submittingLabel : last ? submitLabel : continueLabel}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
        <VisuallyHidden>
          <span role="status" aria-live="polite">
            {announce}
          </span>
        </VisuallyHidden>
      </FormCtx>
    </div>
  );
}

export interface StepperFormInputProps<V = Record<string, unknown>>
  extends Omit<InputProps, 'value' | 'defaultValue' | 'onChange' | 'isInvalid' | 'errorMessage' | 'name'> {
  /** Field key in the shared values (and in `validate` results). */
  name: keyof V & string;
  /** Mark as optional in the label. */
  isOptional?: boolean;
  /** Called with the new text after the shared value is updated (e.g. to derive another field). */
  onValueChange?: (value: string) => void;
}

/** Text input wired to the form: reads/writes `values[name]` and shows `errors[name]` (shakes when it appears). */
export function StepperFormInput<V = Record<string, unknown>>({
  name,
  label,
  isOptional,
  onValueChange,
  xstyle,
  ...rest
}: StepperFormInputProps<V>) {
  const { values, setValues, errors } = useStepperForm<Record<string, unknown>>();
  const error = errors[name];
  return (
    <Input
      {...rest}
      name={name}
      label={
        isOptional ? (
          <>
            {label} <span {...stylex.props(styles.reviewLabel)}>(optional)</span>
          </>
        ) : (
          label
        )
      }
      value={String(values[name] ?? '')}
      onChange={(v) => {
        setValues({ [name]: v });
        onValueChange?.(v);
      }}
      isInvalid={error != null}
      errorMessage={error}
      xstyle={[error != null && shakeStyles.shake, xstyle] as unknown as stylex.StyleXStyles}
    />
  );
}

export interface StepperFormChoice {
  value: string;
  title: string;
  /** Right-aligned detail, e.g. a price. */
  aside?: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
}
export interface StepperFormChoicesProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: StepperFormChoice[];
}

/** Selectable plan-style cards as a radio group (arrow keys move and select). */
export function StepperFormChoices({ label, value, onChange, options }: StepperFormChoicesProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  return (
    <RadioGroup aria-label={label} value={value} onChange={onChange} orientation="horizontal">
      <div ref={gridRef} {...stylex.props(styles.choices)}>
        <SlidingIndicator containerRef={gridRef} activeKey={value} selector="[data-selected]" xstyle={styles.ring} />
        {options.map((o) => (
          <Radio key={o.value} value={o.value} {...stylex.props(styles.choice)}>
            <span {...stylex.props(styles.choiceTop)}>
              <span {...stylex.props(styles.choiceTitle)}>{o.title}</span>
              {o.aside != null && <span {...stylex.props(styles.choiceAside)}>{o.aside}</span>}
            </span>
            {o.description != null && <span {...stylex.props(styles.choiceDesc)}>{o.description}</span>}
            {o.badge != null && <span {...stylex.props(styles.badge)}>{o.badge}</span>}
          </Radio>
        ))}
      </div>
    </RadioGroup>
  );
}

export interface StepperFormReviewRow {
  label: string;
  value: ReactNode;
  /** Step id (or index) to jump to; shows an Edit link. */
  step?: string | number;
}
export function StepperFormReview({ rows, onEdit }: { rows: StepperFormReviewRow[]; onEdit?: (step: string | number) => void }) {
  return (
    <dl {...stylex.props(styles.review)}>
      {rows.map((r) => (
        <div key={r.label} {...stylex.props(styles.reviewRow)}>
          <dt {...stylex.props(styles.reviewLabel)}>{r.label}</dt>
          <dd {...stylex.props(styles.reviewValue)}>
            {r.value}
            {r.step != null && onEdit && (
              <button
                type="button"
                aria-label={`Edit ${r.label}`}
                onClick={() => onEdit(r.step!)}
                {...stylex.props(styles.edit, focus.ring)}
              >
                Edit
              </button>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function StepperFormSuccess({
  title,
  description,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div role="status" {...stylex.props(styles.success)}>
      <span aria-hidden="true" {...stylex.props(styles.successIcon)}>
        <Check size={24} />
      </span>
      <h2 {...stylex.props(styles.heading)}>{title}</h2>
      {description != null && <p {...stylex.props(styles.desc)}>{description}</p>}
      {children}
    </div>
  );
}
