import * as stylex from '@stylexjs/stylex';
import { Check, Copy, GitBranch, RotateCcw, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState, type HTMLAttributes, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { IconButton } from '../../components/IconButton';
import { IconSwap, useCopy } from '../../internal/n1-ai';
import { mergeSx } from '../../internal/sx';

const styles = stylex.create({
  root: { alignItems: 'center', display: 'inline-flex', gap: 2 },
  active: { color: colors['--oniva-color-accent-soft-fg'] },
});

export type MessageFeedback = 'like' | 'dislike' | null;

export interface MessageActionsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
  /** Plain text copied by the copy action. */
  text: string;
  onRegenerate?: () => void;
  onShare?: () => void;
  onBranch?: () => void;
  /** Controlled feedback value; uncontrolled when omitted. */
  feedback?: MessageFeedback;
  onFeedback?: (value: MessageFeedback) => void;
  /** Show like / dislike buttons. Default true. */
  showFeedback?: boolean;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Action row under an assistant message: copy (icon swap), regenerate, like / dislike, share, branch. */
export function MessageActions({ text, onRegenerate, onShare, onBranch, feedback, onFeedback, showFeedback = true, className, xstyle, ref, ...rest }: MessageActionsProps) {
  const { copied, copy } = useCopy(text);
  const [inner, setInner] = useState<MessageFeedback>(null);
  const value = feedback === undefined ? inner : feedback;
  const set = (v: Exclude<MessageFeedback, null>) => {
    const next = value === v ? null : v;
    setInner(next);
    onFeedback?.(next);
  };
  const sx = stylex.props(styles.root, xstyle);
  return (
    <div {...rest} ref={ref} role="toolbar" aria-label="Message actions" {...mergeSx(sx, className)}>
      <IconButton size="xs" variant="ghost" aria-label={copied ? 'Copied' : 'Copy'} onPress={copy}>
        <IconSwap on={copied} a={<Copy size={14} />} b={<Check size={14} />} />
      </IconButton>
      {onRegenerate && (
        <IconButton size="xs" variant="ghost" aria-label="Regenerate" onPress={onRegenerate}>
          <RotateCcw size={14} />
        </IconButton>
      )}
      {showFeedback && (
        <>
          <IconButton size="xs" variant="ghost" aria-label="Good response" aria-pressed={value === 'like'} onPress={() => set('like')} xstyle={value === 'like' ? styles.active : undefined}>
            <ThumbsUp size={14} fill={value === 'like' ? 'currentColor' : 'none'} />
          </IconButton>
          <IconButton size="xs" variant="ghost" aria-label="Bad response" aria-pressed={value === 'dislike'} onPress={() => set('dislike')} xstyle={value === 'dislike' ? styles.active : undefined}>
            <ThumbsDown size={14} fill={value === 'dislike' ? 'currentColor' : 'none'} />
          </IconButton>
        </>
      )}
      {onShare && (
        <IconButton size="xs" variant="ghost" aria-label="Share" onPress={onShare}>
          <Share2 size={14} />
        </IconButton>
      )}
      {onBranch && (
        <IconButton size="xs" variant="ghost" aria-label="Branch from here" onPress={onBranch}>
          <GitBranch size={14} />
        </IconButton>
      )}
    </div>
  );
}
