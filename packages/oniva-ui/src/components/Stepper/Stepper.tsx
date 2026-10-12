import * as stylex from '@stylexjs/stylex';
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
  root: { display: 'flex', fontFamily: font.sans, listStyle: 'none', margin: 0, padding: 0 },
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
    borderRadius: radius.lg,
    borderWidth: 0,
    color: 'inherit',
    cursor: { default: 'pointer', ':disabled': 'default' },
    display: 'flex',
    font: 'inherit',
    gap: 12,
    outlineColor: colors.focusRing,
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    padding: 0,
    textAlign: 'start',
  },
  btnV: { alignItems: 'flex-start' },
  group: { alignItems: 'center', display: 'flex', gap: 12 },
  circle: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: font.size13,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font.weightSemibold,
    height: 32,
    justifyContent: 'center',
    transitionDuration: motion.durBase,
    transitionProperty: 'background-color, border-color, color, box-shadow',
    width: 32,
  },
  complete: {
    backgroundImage: `linear-gradient(180deg, ${accent.accent500}, ${accent.accent600})`,
    borderColor: 'transparent',
    boxShadow: shadow.accentInset,
    color: colors.accentFg,
  },
  current: {
    backgroundColor: colors.surface,
    borderColor: accent.accent500,
    boxShadow: `0 0 0 4px ${colors.accentTint}`,
    color: colors.accentSoftFg,
  },
  upcoming: { backgroundColor: colors.surfaceInset, borderColor: colors.border, color: colors.textMuted },
  text: { display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 },
  textV: { paddingBottom: 24, paddingTop: 5 },
  title: { color: colors.text, fontSize: font.size14, fontWeight: font.weightMedium, lineHeight: font.lh14 },
  titleIdle: { color: colors.textMuted },
  desc: { color: colors.textMuted, fontSize: font.size13, lineHeight: font.lh13 },
  line: {
    backgroundColor: colors.border,
    borderRadius: radius.full,
    flexShrink: 0,
    transitionDuration: motion.durSlow,
    transitionProperty: 'background-color',
  },
  lineH: { flexGrow: 1, height: 2, minWidth: 16 },
  lineV: { flexGrow: 1, minHeight: 16, width: 2 },
  lineDone: { backgroundColor: accent.accent500 },
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
            <span {...stylex.props(styles.title, status === 'upcoming' && styles.titleIdle)}>{step.title}</span>
            {step.description && <span {...stylex.props(styles.desc)}>{step.description}</span>}
            <span {...stylex.props(styles.vh)}>{status === 'complete' ? ', completed' : status === 'current' ? ', current step' : ', not started'}</span>
          </span>
        );
        const body = vertical ? (
          <>
            <span {...stylex.props(styles.rail)}>
              {circle}
              {!last && <span aria-hidden="true" {...stylex.props(styles.line, styles.lineV, status === 'complete' && styles.lineDone)} />}
            </span>
            {text}
          </>
        ) : (
          <>
            <span {...stylex.props(styles.group)}>
              {circle}
              {text}
            </span>
            {!last && <span aria-hidden="true" {...stylex.props(styles.line, styles.lineH, status === 'complete' && styles.lineDone)} />}
          </>
        );
        return (
          <li
            key={step.id}
            aria-current={status === 'current' ? 'step' : undefined}
            {...stylex.props(styles.step, vertical ? styles.stepV : styles.stepH, !vertical && last && styles.stepHLast)}
          >
            {pressable ? (
              <AriaButton onPress={() => onStepPress(i)} {...stylex.props(styles.btn, vertical && styles.btnV)}>
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
