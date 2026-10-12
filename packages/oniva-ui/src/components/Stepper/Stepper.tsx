import * as stylex from '@stylexjs/stylex';
import { focus } from '../../internal/focus';
import { Button as AriaButton } from 'react-aria-components';
import { Check } from 'lucide-react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { mergeSx } from '../../internal/sx';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

const styles = stylex.create({
  root: {
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  rootH: { alignItems: 'flex-start', flexDirection: 'row', gap: 12, width: '100%' },
  rootV: { flexDirection: 'column' },
  step: { display: 'flex', minWidth: 0 },
  stepH: { alignItems: 'center', flexGrow: 1, gap: 12 },
  stepHLast: { flexGrow: 0 },
  stepV: { flexDirection: 'row', gap: 12 },
  rail: { alignItems: 'center', display: 'flex', flexDirection: 'column', flexShrink: 0, gap: 4 },
  btn: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderRadius: radius['--oniva-radius-lg'],
    borderWidth: 0,
    color: 'inherit',
    cursor: { default: 'pointer', ':disabled': 'default' },
    display: 'flex',
    font: 'inherit',
    gap: 12,
    padding: 0,
    textAlign: 'start',
  },
  btnV: { alignItems: 'flex-start' },
  group: { alignItems: 'center', display: 'flex', gap: 12 },
  circle: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: font['--oniva-font-size-13'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-semibold'],
    height: 32,
    justifyContent: 'center',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, border-color, color, box-shadow',
    width: 32,
  },
  complete: {
    backgroundImage: `linear-gradient(180deg, ${accent['--oniva-accent-500']}, ${accent['--oniva-accent-600']})`,
    borderColor: 'transparent',
    boxShadow: shadow['--oniva-shadow-accent-inset'],
    color: colors['--oniva-color-accent-fg'],
  },
  current: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: accent['--oniva-accent-500'],
    boxShadow: `0 0 0 4px ${colors['--oniva-color-accent-tint']}`,
    color: colors['--oniva-color-accent-soft-fg'],
  },
  upcoming: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderColor: colors['--oniva-color-border'],
    color: colors['--oniva-color-text-muted'],
  },
  text: { display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 },
  textV: { paddingBottom: 24, paddingTop: 5 },
  title: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-14'],
  },
  titleIdle: { color: colors['--oniva-color-text-muted'] },
  desc: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-13'],
  },
  line: {
    backgroundColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-full'],
    flexShrink: 0,
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'background-color',
  },
  lineH: { flexGrow: 1, height: 2, minWidth: 16 },
  lineV: { flexGrow: 1, minHeight: 16, width: 2 },
  lineDone: { backgroundColor: accent['--oniva-accent-500'] },
  vh: {
    borderWidth: 0,
    clipPath: 'inset(50%)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
  },
});

export interface StepperStep {
  id: string | number;
  title: string;
  description?: string;
  icon?: ReactNode;
}

export interface StepperProps {
  steps: StepperStep[];
  /** Index of the current step (0-based). Earlier steps are complete. */
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
  /** Makes completed (and current) steps pressable, e.g. to go back. */
  onStepPress?: (index: number) => void;
  'aria-label'?: string;
  className?: string;
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLOListElement>;
}

export function Stepper({
  steps,
  currentStep,
  orientation = 'horizontal',
  onStepPress,
  'aria-label': ariaLabel = 'Progress',
  className,
  style,
  xstyle,
  ref,
}: StepperProps) {
  const vertical = orientation === 'vertical';
  const sx = stylex.props(styles.root, vertical ? styles.rootV : styles.rootH, xstyle);
  return (
    <ol ref={ref} aria-label={ariaLabel} {...mergeSx(sx, className, style)}>
      {steps.map((step, i) => {
        const status = i < currentStep ? 'complete' : i === currentStep ? 'current' : 'upcoming';
        const last = i === steps.length - 1;
        const pressable = !!onStepPress && i <= currentStep;
        const circle = (
          <span {...stylex.props(styles.circle, styles[status])}>
            {status === 'complete' ? <Check size={16} aria-hidden="true" /> : (step.icon ?? i + 1)}
          </span>
        );
        const text = (
          <span {...stylex.props(styles.text, vertical && styles.textV)}>
            <span {...stylex.props(styles.title, status === 'upcoming' && styles.titleIdle)}>
              {step.title}
            </span>
            {step.description && <span {...stylex.props(styles.desc)}>{step.description}</span>}
            <span {...stylex.props(styles.vh)}>
              {status === 'complete'
                ? ', completed'
                : status === 'current'
                  ? ', current step'
                  : ', not started'}
            </span>
          </span>
        );
        const body = vertical ? (
          <>
            <span {...stylex.props(styles.rail)}>
              {circle}
              {!last && (
                <span
                  aria-hidden="true"
                  {...stylex.props(
                    styles.line,
                    styles.lineV,
                    status === 'complete' && styles.lineDone,
                  )}
                />
              )}
            </span>
            {text}
          </>
        ) : (
          <>
            <span {...stylex.props(styles.group)}>
              {circle}
              {text}
            </span>
            {!last && (
              <span
                aria-hidden="true"
                {...stylex.props(
                  styles.line,
                  styles.lineH,
                  status === 'complete' && styles.lineDone,
                )}
              />
            )}
          </>
        );
        return (
          <li
            key={step.id}
            aria-current={status === 'current' ? 'step' : undefined}
            {...stylex.props(
              styles.step,
              vertical ? styles.stepV : styles.stepH,
              !vertical && last && styles.stepHLast,
            )}
          >
            {pressable ? (
              <AriaButton
                onPress={() => onStepPress(i)}
                {...stylex.props(styles.btn, focus.ring, vertical && styles.btnV)}
              >
                {body}
              </AriaButton>
            ) : (
              body
            )}
          </li>
        );
      })}
    </ol>
  );
}
