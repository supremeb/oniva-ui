import * as stylex from '@stylexjs/stylex';
import { CheckCircle2, ChevronDown, Send, Sparkles } from 'lucide-react';
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { mergeSx, sxClass } from '../../internal/sx';
import { formatRelative } from '../../internal/w4-time';
import { w4, w4Motion } from '../../internal/w4-styles';
import { Avatar } from '../Avatar';
import { CloseButton } from '../CloseButton';
import { IconButton } from '../IconButton';
import { usePresence } from '../../motion/Presence';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { Shimmer } from '../../motion/Shimmer';

const childIn = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(4px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});
const thinkOut = stylex.keyframes({
  from: { opacity: 1, transform: 'translateY(0)' },
  to: { opacity: 0, transform: 'translateY(-4px)' },
});

const styles = stylex.create({
  /** Message parts rise in one after another (author line, text, status). */
  stagger: {
    animationDelay: 'calc(var(--oniva-ct-d, 0ms) + var(--oniva-ct-i, 0) * 70ms)',
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: { default: childIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  thinkExit: {
    animationDuration: motion['--oniva-motion-dur-fast'],
    animationFillMode: 'forwards',
    animationName: { default: thinkOut, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  detailsFade: {
    opacity: { default: 0, '[data-open]': 1 },
    transform: { default: 'translateY(-4px)', '[data-open]': 'translateY(0)' },
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 420,
    overflow: 'hidden',
    width: '100%',
  },
  head: {
    alignItems: 'center',
    borderBlockEndColor: colors['--oniva-color-separator'],
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    display: 'flex',
    gap: 8,
    minHeight: 48,
    paddingBlock: 10,
    paddingInlineEnd: 10,
    paddingInlineStart: 16,
  },
  headTitle: {
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
    margin: 0,
  },
  count: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    marginInlineEnd: 'auto',
  },
  scroll: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    maxHeight: 'var(--oniva-thread-max-height, 340px)',
    minHeight: 'var(--oniva-thread-min-height, 0px)',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    paddingBlockEnd: 12,
    paddingBlockStart: 16,
    paddingInline: 16,
  },
  msg: { display: 'block', minWidth: 0 },
  main: { display: 'block', minWidth: 0 },
  meta: { alignItems: 'center', display: 'flex', gap: 8, minWidth: 0 },
  indent: { marginBlockStart: 4, marginInlineStart: 28 },
  statusRow: { marginBlockStart: 4, marginInlineStart: 22 },
  name: {
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
    minWidth: 0,
  },
  time: {
    color: colors['--oniva-color-text-subtle'],
    flexShrink: 0,
    fontSize: font['--oniva-font-size-12'],
    marginInlineStart: 'auto',
  },
  ok: { color: colors['--oniva-color-success-solid'], flexShrink: 0 },
  text: {
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-20'],
    margin: 0,
    overflowWrap: 'anywhere',
    whiteSpace: 'pre-wrap',
  },
  command: {
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-sm'],
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    marginInlineEnd: 4,
    paddingInline: 5,
  },
  mention: {
    color: colors['--oniva-color-accent-text'],
    fontWeight: font['--oniva-font-weight-medium'],
  },
  statusBtn: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 6,
    minHeight: 28,
    paddingInline: 6,
    width: 'fit-content',
  },
  chevron: {
    transform: 'none',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  chevronOpen: { transform: 'rotate(180deg)' },
  details: {
    borderInlineStartColor: colors['--oniva-color-border'],
    borderInlineStartStyle: 'solid',
    borderInlineStartWidth: 2,
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-18'],
    marginBlockStart: 4,
    marginInlineStart: 6,
    paddingInlineStart: 10,
  },
  form: {
    alignItems: 'center',
    display: 'flex',
    gap: 8,
    paddingBlockEnd: 10,
    paddingBlockStart: 4,
    paddingInlineEnd: 10,
    paddingInlineStart: 16,
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    flexGrow: 1,
    font: 'inherit',
    fontSize: font['--oniva-font-size-14'],
    minHeight: 36,
    minWidth: 0,
    paddingInline: 0,
    '::placeholder': { color: colors['--oniva-color-text-placeholder'] },
  },
  think: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'] },
});

export interface ThreadAuthor {
  name: string;
  avatar?: string;
  /** Marks the author as the assistant (sparkle badge instead of initials). */
  assistant?: boolean;
}

export interface ThreadMessage {
  id: string;
  author: ThreadAuthor;
  createdAt: Date | number | string;
  text: string;
  /** Assistant replies: a status line that folds `details` open. */
  status?: { label: string; details?: ReactNode };
}

export interface CommentThreadProps {
  messages: ThreadMessage[];
  /** Author of new replies. */
  currentUser: ThreadAuthor;
  /** Shown with a thinking state while an answer is on its way. */
  assistant?: ThreadAuthor;
  /** Return a message (or a promise of one) for the assistant to answer; nothing just posts. */
  onReply?: (text: string) => ThreadMessage | Promise<ThreadMessage | void> | void;
  /** Shows a close button. */
  onClose?: () => void;
  title?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

function Who({ author }: { author: ThreadAuthor }) {
  return author.assistant ? (
    <Avatar
      size="sm"
      color="accent"
      name={author.name}
      src={author.avatar}
      fallback={<Sparkles size={14} />}
    />
  ) : (
    <Avatar size="sm" name={author.name} src={author.avatar} />
  );
}

/** Render @mentions in accent. */
function Text({ text }: { text: string }) {
  const cmd = /^\/[\p{L}\p{N}_-]+/u.exec(text)?.[0];
  const parts = (cmd ? text.slice(cmd.length) : text).split(/(@[\p{L}\p{N}_]+)/u);
  return (
    <p {...stylex.props(styles.text)}>
      {cmd && <span {...stylex.props(styles.command)}>{cmd}</span>}
      {parts.map((p, i) =>
        p.startsWith('@') ? (
          <span key={i} {...stylex.props(styles.mention)}>
            {p}
          </span>
        ) : (
          p
        ),
      )}
    </p>
  );
}

/** One conversation with replies: an assistant reports what it did, folds details open and answers @mentions. */
export function CommentThread({
  messages: initial,
  currentUser,
  assistant,
  onReply,
  onClose,
  title = 'Comment',
  className,
  xstyle,
  ref,
}: CommentThreadProps) {
  const fmt = useFormatters();
  const uid = useId();
  const [messages, setMessages] = useState(initial);
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const think = usePresence(thinking && !!assistant);
  const listRef = useRef<HTMLDivElement>(null);
  const alive = useRef(true);
  useEffect(() => () => void (alive.current = false), []);
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, thinking]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || thinking) return;
    setDraft('');
    setMessages((m) => [
      ...m,
      { id: `${uid}-${m.length}`, author: currentUser, createdAt: Date.now(), text },
    ]);
    const result = onReply?.(text);
    if (!result) return;
    if (result instanceof Promise) setThinking(true);
    try {
      const reply = await result;
      if (reply && alive.current) setMessages((m) => [...m, reply]);
    } finally {
      if (alive.current) setThinking(false);
    }
  };

  return (
    <section
      ref={ref}
      aria-label={title}
      {...mergeSx(stylex.props(w4.card, styles.card, xstyle), className)}
    >
      <div {...stylex.props(styles.head)}>
        <h3 {...stylex.props(styles.headTitle)}>{title}</h3>
        <span {...stylex.props(styles.count)}>
          {messages.length} {messages.length === 1 ? 'message' : 'messages'}
        </span>
        {onClose && <CloseButton size="sm" aria-label="Close comment" onPress={onClose} />}
      </div>
      <div
        ref={listRef}
        role="log"
        aria-label={`${title} messages`}
        tabIndex={0}
        {...stylex.props(styles.scroll, focus.inset)}
      >
        {messages.map((m, i) => {
          const isOpen = open.has(m.id);
          return (
            <article
              key={m.id}
              aria-label={`${m.author.name}, ${formatRelative(m.createdAt, fmt.locale)}`}
              {...stylex.props(styles.msg)}
              style={{ ['--oniva-ct-d' as string]: `${Math.min(i, 6) * 40}ms` }}
            >
              <div {...stylex.props(styles.main)}>
                <div
                  {...stylex.props(styles.meta, styles.stagger)}
                  style={{ ['--oniva-ct-i' as string]: 1 }}
                >
                  <Who author={m.author} />
                  <span {...stylex.props(styles.name)}>{m.author.name}</span>
                  <time
                    dateTime={new Date(m.createdAt).toISOString()}
                    {...stylex.props(styles.time)}
                  >
                    {formatRelative(m.createdAt, fmt.locale)}
                  </time>
                </div>
                {m.text && (
                  <div
                    {...stylex.props(styles.stagger, styles.indent)}
                    style={{ ['--oniva-ct-i' as string]: 2 }}
                  >
                    <Text text={m.text} />
                  </div>
                )}
                {m.status && (
                  <div
                    {...stylex.props(styles.stagger, styles.statusRow)}
                    style={{ ['--oniva-ct-i' as string]: 3 }}
                  >
                    <AriaButton
                      aria-expanded={isOpen}
                      aria-controls={`${uid}-${m.id}-d`}
                      isDisabled={!m.status.details}
                      onPress={() =>
                        setOpen((s) => {
                          const n = new Set(s);
                          if (n.has(m.id)) n.delete(m.id);
                          else n.add(m.id);
                          return n;
                        })
                      }
                      className={() => sxClass(stylex.props(styles.statusBtn, focus.ring))}
                    >
                      <CheckCircle2 size={16} aria-hidden="true" {...stylex.props(styles.ok)} />
                      {m.status.label}
                      {m.status.details && (
                        <ChevronDown
                          size={14}
                          aria-hidden="true"
                          {...stylex.props(styles.chevron, isOpen && styles.chevronOpen)}
                        />
                      )}
                    </AriaButton>
                    {m.status.details && (
                      <AnimatedHeight isOpen={isOpen} id={`${uid}-${m.id}-d`}>
                        <div
                          {...stylex.props(styles.details, styles.detailsFade)}
                          data-open={isOpen ? '' : undefined}
                        >
                          {m.status.details}
                        </div>
                      </AnimatedHeight>
                    )}
                  </div>
                )}
              </div>
            </article>
          );
        })}
        {think.mounted && assistant && (
          <article
            {...think.presenceProps}
            aria-label={`${assistant.name} is thinking`}
            {...stylex.props(
              styles.msg,
              think.state === 'exiting' ? styles.thinkExit : w4Motion.fadeUp,
            )}
          >
            <Who author={{ ...assistant, assistant: true }} />
            <div {...stylex.props(styles.main)}>
              <span {...stylex.props(styles.name)}>{assistant.name}</span>
              <Shimmer {...stylex.props(styles.think)}>Thinking…</Shimmer>
            </div>
          </article>
        )}
      </div>
      <form onSubmit={submit} {...stylex.props(styles.form)}>
        <input
          aria-label="Reply"
          placeholder={assistant ? `Reply, or @${assistant.name.split(' ')[0]} to ask` : 'Reply'}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          {...stylex.props(styles.input, focus.ring)}
        />
        <IconButton
          type="submit"
          variant="soft"
          size="md"
          aria-label="Send reply"
          isDisabled={!draft.trim() || thinking}
        >
          <Send size={16} />
        </IconButton>
      </form>
    </section>
  );
}
