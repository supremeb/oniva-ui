import * as stylex from '@stylexjs/stylex';
import { useState, type Ref } from 'react';
import {
  Checkbox as AriaCheckbox,
  CheckboxGroup as AriaCheckboxGroup,
  Label,
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
} from 'react-aria-components';
import { Check } from 'lucide-react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { Button } from '../../components/Button';

const styles = stylex.create({
  root: { display: 'flex', flexDirection: 'column', gap: 16, padding: 16 },
  title: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-semibold'],
  },
  group: { display: 'flex', flexDirection: 'column', gap: 8 },
  prompt: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
  },
  hint: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-regular'],
  },
  options: { display: 'flex', flexDirection: 'column', gap: 6 },
  option: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    gap: 10,
    paddingBlock: 10,
    paddingInline: 12,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, border-color',
  },
  hovered: {
    borderColor: colors['--oniva-color-border-hover'],
    backgroundColor: colors['--oniva-color-surface-hover'],
  },
  selected: {
    backgroundColor: colors['--oniva-color-accent-soft'],
    borderColor: colors['--oniva-color-focus-ring'],
  },
  focus: {
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 2,
    outlineStyle: 'solid',
    outlineWidth: 2,
  },
  mark: {
    alignItems: 'center',
    borderColor: colors['--oniva-color-border-control'],
    borderStyle: 'solid',
    borderWidth: 1.5,
    boxSizing: 'border-box',
    color: colors['--oniva-color-accent-fg'],
    display: 'inline-flex',
    flexShrink: 0,
    height: 18,
    justifyContent: 'center',
    width: 18,
  },
  markRadio: { borderRadius: radius['--oniva-radius-full'] },
  markCheck: { borderRadius: radius['--oniva-radius-xs'] },
  markOn: {
    backgroundColor: colors['--oniva-color-focus-ring'],
    borderColor: colors['--oniva-color-focus-ring'],
  },
  dot: {
    backgroundColor: colors['--oniva-color-accent-fg'],
    borderRadius: radius['--oniva-radius-full'],
    height: 6,
    width: 6,
  },
  text: { display: 'flex', flexDirection: 'column', gap: 1 },
  optLabel: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
  },
  optDesc: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'] },
  footer: { alignItems: 'center', display: 'flex', gap: 12, justifyContent: 'space-between' },
  count: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
  },
});

export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
}
export interface Question {
  id: string;
  prompt: string;
  options: QuestionOption[];
  /** Allow several answers. */
  multiple?: boolean;
}
export type QuestionnaireAnswers = Record<string, string[]>;

export interface QuestionnaireProps {
  title?: string;
  questions: Question[];
  onSubmit?: (answers: QuestionnaireAnswers) => void;
  submitLabel?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

function Option({ o, multiple }: { o: QuestionOption; multiple: boolean }) {
  const Comp = multiple ? AriaCheckbox : AriaRadio;
  return (
    <Comp
      value={o.id}
      className={(s: { isSelected: boolean; isHovered: boolean; isFocusVisible: boolean }) =>
        stylex.props(
          styles.option,
          s.isHovered && styles.hovered,
          s.isSelected && styles.selected,
          s.isFocusVisible && styles.focus,
        ).className ?? ''
      }
    >
      {(s: { isSelected: boolean }) => (
        <>
          <span
            {...stylex.props(
              styles.mark,
              multiple ? styles.markCheck : styles.markRadio,
              s.isSelected && styles.markOn,
            )}
          >
            {s.isSelected &&
              (multiple ? (
                <Check size={12} strokeWidth={3} aria-hidden="true" />
              ) : (
                <span {...stylex.props(styles.dot)} />
              ))}
          </span>
          <span {...stylex.props(styles.text)}>
            <span {...stylex.props(styles.optLabel)}>{o.label}</span>
            {o.description && <span {...stylex.props(styles.optDesc)}>{o.description}</span>}
          </span>
        </>
      )}
    </Comp>
  );
}

/** Plan-mode clarifying questions: single or multi-select option cards, then one Submit. */
export function Questionnaire({
  title = 'A few questions before I start',
  questions,
  onSubmit,
  submitLabel = 'Continue',
  xstyle,
  ref,
}: QuestionnaireProps) {
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({});
  const answered = questions.filter((q) => (answers[q.id]?.length ?? 0) > 0).length;
  const sx = stylex.props(aiStyles.panel, styles.root, xstyle);
  return (
    <div ref={ref} role="group" aria-label={title} className={sx.className} style={sx.style}>
      <span {...stylex.props(styles.title)}>{title}</span>
      {questions.map((q) => {
        const heading = (
          <Label {...stylex.props(styles.prompt)}>
            {q.prompt}{' '}
            {q.multiple && <span {...stylex.props(styles.hint)}>Select all that apply</span>}
          </Label>
        );
        const opts = (
          <div {...stylex.props(styles.options)}>
            {q.options.map((o) => (
              <Option key={o.id} o={o} multiple={Boolean(q.multiple)} />
            ))}
          </div>
        );
        return q.multiple ? (
          <AriaCheckboxGroup
            key={q.id}
            {...stylex.props(styles.group)}
            value={answers[q.id] ?? []}
            onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
          >
            {heading}
            {opts}
          </AriaCheckboxGroup>
        ) : (
          <AriaRadioGroup
            key={q.id}
            {...stylex.props(styles.group)}
            value={answers[q.id]?.[0] ?? null}
            onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: [v] }))}
          >
            {heading}
            {opts}
          </AriaRadioGroup>
        );
      })}
      <div {...stylex.props(styles.footer)}>
        <span {...stylex.props(styles.count)}>
          {answered} of {questions.length} answered
        </span>
        <Button isDisabled={answered < questions.length} onPress={() => onSubmit?.(answers)}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
