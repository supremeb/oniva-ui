import * as stylex from '@stylexjs/stylex';
import { CheckIcon, CopyIcon, RotateCcwIcon, ThumbsDownIcon, ThumbsUpIcon } from '../../icons/IconSet';
import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { Avatar } from '../../components/Avatar';
import { IconButton } from '../../components/IconButton';
import { Tooltip } from '../../components/Tooltip';
import { mergeSx } from '../../internal/sx';

const styles = stylex.create({
  root: { display: 'flex', fontFamily: font['--oniva-font-sans'], gap: 12, width: '100%' },
  user: { flexDirection: 'row-reverse' },
  col: { display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 },
  colUser: { alignItems: 'flex-end', maxWidth: '80%' },
  colAssistant: { flexGrow: 1 },
  bubble: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStartEndRadius: radius['--oniva-radius-xs'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-14'],
    lineHeight: font['--oniva-font-lh-16'],
    maxWidth: '100%',
    overflowWrap: 'anywhere',
    paddingBlock: 8,
    paddingInline: 14,
    whiteSpace: 'pre-wrap',
  },
  content: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-14'],
    lineHeight: font['--oniva-font-lh-16'],
    minWidth: 0,
    overflowWrap: 'anywhere',
  },
  meta: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
  },
  actions: { alignItems: 'center', display: 'flex', gap: 2, marginInlineStart: -6 },
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
  ok: { color: colors['--oniva-color-success-solid'] },
  pressed: { color: colors['--oniva-color-accent-soft-fg'] },
});

export interface MessageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'content'> {
  role: 'user' | 'assistant';
  /** Display name, used for the avatar fallback and accessible label. */
  name?: string;
  avatarSrc?: string;
  /** e.g. `10:42 AM`. */
  timestamp?: string;
  children?: ReactNode;
  /** Plain text copied by the copy action; the button is hidden when omitted. */
  copyText?: string;
  onRetry?: () => void;
  /** Thumbs feedback. Pass `feedback` to show the chosen state. */
  onFeedback?: (value: 'up' | 'down') => void;
  feedback?: 'up' | 'down' | null;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Chat message: right-aligned bubble for the user, avatar + free-form content (with actions) for the assistant. */
export function Message({
  role,
  name,
  avatarSrc,
  timestamp,
  children,
  copyText,
  onRetry,
  onFeedback,
  feedback,
  className,
  xstyle,
  ref,
  ...rest
}: MessageProps) {
  const [copied, setCopied] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(
    () => () => {
      clearTimeout(t.current);
    },
    [],
  );
  const isUser = role === 'user';
  const hasActions = !isUser && (copyText != null || onRetry || onFeedback);
  const sx = stylex.props(styles.root, isUser && styles.user, xstyle);
  return (
    <div
      role="article"
      aria-label={`${isUser ? (name ?? 'You') : (name ?? 'Assistant')} message`}
      {...rest}
      ref={ref}
      data-role={role}
      {...mergeSx(sx, className)}
    >
      {!isUser && <Avatar size="sm" name={name ?? 'Assistant'} src={avatarSrc} color="accent" />}
      <div {...stylex.props(styles.col, isUser ? styles.colUser : styles.colAssistant)}>
        {isUser ? (
          <div {...stylex.props(styles.bubble)}>{children}</div>
        ) : (
          <div {...stylex.props(styles.content)}>{children}</div>
        )}
        {timestamp && <span {...stylex.props(styles.meta)}>{timestamp}</span>}
        {hasActions && (
          <div role="group" aria-label="Message actions" {...stylex.props(styles.actions)}>
            <span role="status" {...stylex.props(styles.srOnly)}>
              {copied ? 'Copied to clipboard' : ''}
            </span>
            {copyText != null && (
              <Tooltip content={copied ? 'Copied' : 'Copy'}>
                <IconButton
                  variant="ghost"
                  size="xs"
                  aria-label={copied ? 'Copied' : 'Copy message'}
                  onPress={() => {
                    // Only confirm when the write actually succeeded (it rejects without permission or a secure context).
                    Promise.resolve(navigator.clipboard?.writeText(copyText)).then(
                      () => {
                        setCopied(true);
                        clearTimeout(t.current);
                        t.current = setTimeout(() => setCopied(false), 1600);
                      },
                      () => undefined,
                    );
                  }}
                >
                  {copied ? (
                    <CheckIcon size={14} aria-hidden="true" {...stylex.props(styles.ok)} />
                  ) : (
                    <CopyIcon size={14} aria-hidden="true" />
                  )}
                </IconButton>
              </Tooltip>
            )}
            {onRetry && (
              <Tooltip content="Retry">
                <IconButton variant="ghost" size="xs" aria-label="Regenerate response" onPress={onRetry}>
                  <RotateCcwIcon size={14} aria-hidden="true" />
                </IconButton>
              </Tooltip>
            )}
            {onFeedback && (
              <>
                <Tooltip content="Good response">
                  <IconButton
                    variant="ghost"
                    size="xs"
                    aria-label="Mark response as good"
                    aria-pressed={feedback === 'up'}
                    onPress={() => onFeedback('up')}
                  >
                    <ThumbsUpIcon
                      size={14}
                      aria-hidden="true"
                      {...stylex.props(feedback === 'up' && styles.pressed)}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip content="Bad response">
                  <IconButton
                    variant="ghost"
                    size="xs"
                    aria-label="Mark response as bad"
                    aria-pressed={feedback === 'down'}
                    onPress={() => onFeedback('down')}
                  >
                    <ThumbsDownIcon
                      size={14}
                      aria-hidden="true"
                      {...stylex.props(feedback === 'down' && styles.pressed)}
                    />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
