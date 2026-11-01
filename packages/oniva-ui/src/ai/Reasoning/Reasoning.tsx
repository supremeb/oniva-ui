import * as stylex from '@stylexjs/stylex';
import { BrainIcon, ChevronRightIcon } from '../../icons/IconSet';
import { Children, useEffect, useId, useRef, useState, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { formatDuration } from '../../internal/ai-motion';
import { useElapsed } from '../../internal/n1-ai';
import { mergeSx } from '../../internal/sx';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { TextShimmer } from '../TextShimmer';

const styles = stylex.create({
  root: { display: 'flex', flexDirection: 'column', fontFamily: font['--oniva-font-sans'], position: 'relative' },
  trigger: {
    alignSelf: 'flex-start',
    color: colors['--oniva-color-text-muted'],
    gap: 6,
    paddingBlock: 4,
    paddingInline: 0,
    width: 'auto',
  },
  body: {
    borderInlineStartColor: colors['--oniva-color-border'],
    borderInlineStartStyle: 'solid',
    borderInlineStartWidth: 2,
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-18'],
    marginBlockStart: 4,
    marginInlineStart: 7,
    paddingBlock: 2,
    overflowWrap: 'anywhere',
    paddingInlineStart: 14,
    whiteSpace: 'pre-wrap',
  },
  srOnly: {
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

export interface ReasoningProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
  /** While true the panel opens and the label shimmers; when it flips false it closes after `closeDelayMs`. */
  isStreaming?: boolean;
  /** Seconds spent thinking. Measured automatically when omitted. */
  duration?: number;
  defaultOpen?: boolean;
  closeDelayMs?: number;
  /** Reasoning text. */
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Collapsible model reasoning: opens while streaming, auto-closes after ("Thought for 12s"). A manual toggle wins. */
export function Reasoning({
  isStreaming = false,
  duration,
  defaultOpen,
  closeDelayMs = 900,
  children,
  className,
  xstyle,
  ref,
  ...rest
}: ReasoningProps) {
  const [open, setOpen] = useState(defaultOpen ?? isStreaming);
  const touched = useRef(false);
  const measured = useElapsed(isStreaming);
  const was = useRef(isStreaming);
  const [streamed, setStreamed] = useState(isStreaming);
  const uid = useId();
  const triggerId = `${uid}-trigger`;
  const hasBody = Children.toArray(children).some((c) => c !== '');

  useEffect(() => {
    if (isStreaming) {
      touched.current = false;
      setOpen(true);
      setStreamed(true);
      was.current = true;
      return;
    }
    if (!was.current) return;
    was.current = false;
    const id = setTimeout(() => {
      if (!touched.current) setOpen(false);
    }, closeDelayMs);
    return () => clearTimeout(id);
  }, [isStreaming, closeDelayMs]);

  const secs = duration ?? measured;
  const label = isStreaming ? (
    <TextShimmer>Thinking…</TextShimmer>
  ) : secs > 0 ? (
    `Thought for ${formatDuration(secs)}`
  ) : (
    'Thought for a few seconds'
  );
  const doneLabel = secs > 0 ? `Thought for ${formatDuration(secs)}` : 'Thought for a few seconds';
  const sx = stylex.props(styles.root, xstyle);
  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      <button
        id={triggerId}
        type="button"
        aria-expanded={open}
        aria-controls={uid}
        onClick={() => {
          touched.current = true;
          setOpen((o) => !o);
        }}
        {...stylex.props(aiStyles.triggerReset, styles.trigger)}
      >
        <BrainIcon size={14} aria-hidden="true" />
        <span>{label}</span>
        <ChevronRightIcon size={14} aria-hidden="true" {...stylex.props(aiStyles.chevron, open && aiStyles.chevronOpen)} />
      </button>
      <span role="status" {...stylex.props(styles.srOnly)}>
        {streamed && !isStreaming ? doneLabel : ''}
      </span>
      <AnimatedHeight isOpen={open} id={uid} role="region" aria-labelledby={triggerId}>
        {hasBody ? <div {...stylex.props(styles.body)}>{children}</div> : null}
      </AnimatedHeight>
    </div>
  );
}
