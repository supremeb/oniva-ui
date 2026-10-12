import * as stylex from '@stylexjs/stylex';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useEffect, useState, type ReactNode, type Ref } from 'react';
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
import { TextShimmer } from '../TextShimmer';

const styles = stylex.create({
  root: { fontFamily: font.sans },
  trigger: {
    borderRadius: 8,
    color: colors.textMuted,
    paddingBlock: 4,
    width: 'auto',
  },
  elapsed: { fontVariantNumeric: 'tabular-nums', fontWeight: font.weightRegular },
  panel: {
    borderInlineStartColor: colors.border,
    borderInlineStartStyle: 'solid',
    borderInlineStartWidth: 2,
    color: colors.textMuted,
    fontSize: font.size13,
    lineHeight: font.lh13,
    marginBlockStart: 4,
    marginInlineStart: 9,
    paddingBlock: 4,
    paddingInlineStart: 14,
    whiteSpace: 'pre-wrap',
  },
});

export interface AgentThinkingProps
  extends Omit<DisclosureProps, 'className' | 'style' | 'children'> {
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
  const sx = stylex.props(styles.root, xstyle);
  return (
    <Disclosure
      {...rest}
      ref={ref}
      className={[sx.className, className].filter(Boolean).join(' ')}
    >
      {({ isExpanded }) => (
        <>
          <Heading level={3} {...stylex.props(aiStyles.heading)}>
            <AriaButton
              slot="trigger"
              className={() => stylex.props(aiStyles.triggerReset, styles.trigger).className ?? ''}
            >
              <Sparkles size={14} aria-hidden="true" />
              {isThinking ? (
                <TextShimmer>Thinking…</TextShimmer>
              ) : (
                <span>Thought for {formatDuration(elapsed)}</span>
              )}
              {isThinking && <span {...stylex.props(styles.elapsed)}>{formatDuration(elapsed)}</span>}
              <ChevronRight
                size={14}
                aria-hidden="true"
                {...stylex.props(aiStyles.chevron, isExpanded && aiStyles.chevronOpen)}
              />
            </AriaButton>
          </Heading>
          <DisclosurePanel>
            <div {...stylex.props(styles.panel)}>{children}</div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
