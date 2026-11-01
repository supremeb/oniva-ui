import * as stylex from '@stylexjs/stylex';
import { ChevronRightIcon, SparklesIcon } from '../../icons/IconSet';
import { useEffect, useRef, useState, type ReactNode, type Ref } from 'react';
import {
  Button as AriaButton,
  Disclosure,
  DisclosurePanel,
  Heading,
  type DisclosureProps,
} from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { formatDuration } from '../../internal/ai-motion';
import { VisuallyHidden } from '../../components/VisuallyHidden';
import { AnimatedHeight } from '../../motion/AnimatedHeight/AnimatedHeight';
import { Shimmer } from '../../motion/Shimmer/Shimmer';

const styles = stylex.create({
  root: { fontFamily: font['--oniva-font-sans'] },
  trigger: {
    borderRadius: 8,
    color: colors['--oniva-color-text-muted'],
    paddingBlock: 2,
    width: 'auto',
  },
  triggerDisabled: { color: colors['--oniva-color-text-disabled'], cursor: 'default' },
  // Nothing to expand: the label stays at full strength but is not clickable.
  triggerStatic: { cursor: 'default' },
  // RAC hides the collapsed panel with [hidden]; keep it rendered so AnimatedHeight can animate.
  panelHost: { contentVisibility: 'visible', display: 'block' },
  elapsed: { fontVariantNumeric: 'tabular-nums', fontWeight: font['--oniva-font-weight-regular'] },
  panel: {
    borderInlineStartColor: colors['--oniva-color-border'],
    borderInlineStartStyle: 'solid',
    borderInlineStartWidth: 2,
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-13'],
    marginBlockStart: 2,
    marginInlineStart: 9,
    paddingBlock: 2,
    minWidth: 0,
    overflowWrap: 'anywhere',
    paddingInlineStart: 14,
    whiteSpace: 'pre-line',
  },
});

export interface AgentThinkingProps extends Omit<
  DisclosureProps,
  'className' | 'style' | 'children'
> {
  /** Still reasoning: shows the shimmer label and a live timer. */
  isThinking?: boolean;
  /** Elapsed seconds. Omit to let the component count up while `isThinking`. */
  seconds?: number;
  /** Reasoning text shown when expanded. */
  children?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Collapsible reasoning block: shimmering "Thinking…" with elapsed seconds, then "Thought for 12s". */
export function AgentThinking({
  isThinking = false,
  seconds,
  children,
  className,
  xstyle,
  ref,
  ...rest
}: AgentThinkingProps) {
  const [auto, setAuto] = useState(0);
  useEffect(() => {
    if (!isThinking || seconds !== undefined) return;
    const id = setInterval(() => setAuto((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isThinking, seconds]);
  const elapsed = seconds ?? auto;
  // Announce the hand-off from "Thinking…" to "Thought for Ns" once, not every timer tick.
  const [announcement, setAnnouncement] = useState('');
  const wasThinking = useRef(isThinking);
  useEffect(() => {
    if (wasThinking.current && !isThinking) setAnnouncement(`Thought for ${formatDuration(elapsed)}`);
    if (isThinking) setAnnouncement('');
    wasThinking.current = isThinking;
  }, [isThinking, elapsed]);
  const content = typeof children === 'string' ? children.trim() : children;
  const isEmpty = content === undefined || content === null || content === false || content === '';
  const label = (
    <>
      <SparklesIcon size={14} aria-hidden="true" />
      {isThinking ? <Shimmer>Thinking…</Shimmer> : <span>Thought for {formatDuration(elapsed)}</span>}
      {isThinking && <span {...stylex.props(styles.elapsed)}>{formatDuration(elapsed)}</span>}
    </>
  );
  const sx = stylex.props(styles.root, xstyle);
  return (
    <Disclosure {...rest} ref={ref} className={[sx.className, className].filter(Boolean).join(' ')}>
      {({ isExpanded }) => (
        <>
          <Heading level={3} {...stylex.props(aiStyles.heading)}>
            {isEmpty ? (
              // Nothing to expand: a static label, not a button pointing at a missing panel.
              <div {...stylex.props(aiStyles.triggerReset, styles.trigger, styles.triggerStatic)}>
                {label}
              </div>
            ) : (
              <AriaButton
                slot="trigger"
                className={() =>
                  stylex.props(
                    aiStyles.triggerReset,
                    styles.trigger,
                    rest.isDisabled && styles.triggerDisabled,
                  ).className ?? ''
                }
              >
                {label}
                <ChevronRightIcon
                  size={14}
                  aria-hidden="true"
                  {...stylex.props(aiStyles.chevron, isExpanded && aiStyles.chevronOpen)}
                />
              </AriaButton>
            )}
          </Heading>
          {!isEmpty && (
            <DisclosurePanel {...stylex.props(styles.panelHost)}>
              <AnimatedHeight isOpen={isExpanded}>
                <div {...stylex.props(styles.panel)}>{content}</div>
              </AnimatedHeight>
            </DisclosurePanel>
          )}
          <VisuallyHidden>
            <span role="status">{announcement}</span>
          </VisuallyHidden>
        </>
      )}
    </Disclosure>
  );
}
