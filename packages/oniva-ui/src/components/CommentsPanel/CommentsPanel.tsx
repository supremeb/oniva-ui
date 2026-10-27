import * as stylex from '@stylexjs/stylex';
import { ArrowUp, Check, CircleCheck, ListFilter, Play } from 'lucide-react';
import { useMemo, useRef, useState, type FormEvent, type KeyboardEvent, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { mergeSx } from '../../internal/sx';
import { formatRelative } from '../../internal/w4-time';
import { useFlipKeyed } from '../../internal/w4-flip';
import { w4, w4Motion } from '../../internal/w4-styles';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { CloseButton } from '../CloseButton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '../DropdownMenu';
import { IconButton } from '../IconButton';
import { Tab, TabList, TabPanel, Tabs } from '../Tabs';
import { ToggleButton } from '../ToggleButton';

const appliedPop = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(0.8)', filter: 'blur(2px)' },
  to: { opacity: 1, transform: 'scale(1)', filter: 'blur(0)' },
});

const styles = stylex.create({
  root: { gap: 0, overflow: 'hidden' },
  head: { alignItems: 'center', display: 'flex', justifyContent: 'space-between', paddingBlockStart: 14, paddingInline: 16 },
  title: { fontSize: font['--oniva-font-size-16'], fontWeight: font['--oniva-font-weight-semibold'], margin: 0 },
  bar: { alignItems: 'center', display: 'flex', gap: 8, justifyContent: 'space-between', paddingBlock: 10, paddingInline: 16 },
  list: {
    borderBlockStartColor: colors['--oniva-color-separator'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    listStyle: 'none',
    margin: 0,
    maxHeight: 'var(--oniva-comments-max-height, 380px)',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    padding: 0,
  },
  item: {
    borderBlockStartColor: colors['--oniva-color-separator'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: { default: 1, ':first-child': 0 },
    display: 'flex',
    gap: 10,
    paddingBlock: 14,
    paddingInline: 16,
  },
  resolved: { color: colors['--oniva-color-text-muted'] },
  itemColor: {
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: 'color, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  appliedIn: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationFillMode: 'backwards',
    animationName: { default: appliedPop, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  main: { display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 4, minWidth: 0 },
  meta: { alignItems: 'center', display: 'flex', gap: 8, justifyContent: 'space-between', minHeight: 24 },
  metaEnd: { alignItems: 'center', display: 'flex', gap: 4, marginInlineEnd: -4 },
  name: { fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-medium'] },
  time: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'] },
  text: { fontSize: font['--oniva-font-size-14'], lineHeight: font['--oniva-font-lh-20'], margin: 0, overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' },
  cmd: { color: colors['--oniva-color-text-muted'] },
  run: { alignSelf: 'flex-start', marginBlockStart: 6 },
  applied: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    color: colors['--oniva-color-success-fg'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-13'],
    gap: 4,
    marginBlockStart: 6,
  },
  empty: { margin: 0, padding: 20, textAlign: 'center' },
  form: {
    alignItems: 'center',
    borderBlockStartColor: colors['--oniva-color-separator'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'flex',
    gap: 10,
    paddingBlock: 10,
    paddingInline: 16,
  },
  input: {
    backgroundColor: 'transparent',
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'none',
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    flexGrow: 1,
    font: 'inherit',
    fontSize: font['--oniva-font-size-14'],
    maxHeight: 120,
    minHeight: 32,
    minWidth: 0,
    paddingBlock: 6,
    paddingInline: 0,
    resize: 'none',
    '::placeholder': { color: colors['--oniva-color-text-placeholder'] },
  },
});

export interface CommentAuthor {
  name: string;
  avatar?: string;
}

export interface PanelComment {
  id: string;
  author: CommentAuthor;
  createdAt: Date | number | string;
  /** Text starting with `/edit` becomes a runnable edit. */
  text: string;
  resolved?: boolean;
}

export interface CommentsPanelProps {
  comments: PanelComment[];
  /** Author of new comments. */
  currentUser: CommentAuthor;
  /** Runs an edit; the button shows "Running…" until the promise settles. */
  onRunEdit?: (comment: PanelComment) => Promise<void> | void;
  /** Called with every new comment. */
  onAdd?: (comment: PanelComment) => void;
  /** Called when a comment is resolved or reopened. */
  onResolve?: (comment: PanelComment, resolved: boolean) => void;
  /** Shows a close button. */
  onClose?: () => void;
  title?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

type Filter = 'all' | 'open' | 'edits' | 'resolved';
type Sort = 'newest' | 'oldest';

const EDIT = /^\/edit\b\s*/i;
const time = (c: PanelComment) => new Date(c.createdAt).getTime();

/** Comment feed with filter tabs, sorting, resolve, runnable `/edit` commands and a composer. */
export function CommentsPanel({
  comments: initial,
  currentUser,
  onRunEdit,
  onAdd,
  onResolve,
  onClose,
  title = 'Comments',
  className,
  xstyle,
  ref,
}: CommentsPanelProps) {
  const fmt = useFormatters();
  const [comments, setComments] = useState(initial);
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('newest');
  const [running, setRunning] = useState<Set<string>>(() => new Set());
  const [applied, setApplied] = useState<Set<string>>(() => new Set());
  const [draft, setDraft] = useState('');

  const listRef = useRef<HTMLUListElement>(null);
  useFlipKeyed(listRef, filter);

  const counts = useMemo(
    () => ({
      all: comments.length,
      open: comments.filter((c) => !c.resolved).length,
      edits: comments.filter((c) => EDIT.test(c.text)).length,
      resolved: comments.filter((c) => c.resolved).length,
    }),
    [comments],
  );

  const shown = useMemo(() => {
    const list = comments.filter((c) =>
      filter === 'all' ? true : filter === 'edits' ? EDIT.test(c.text) : filter === 'resolved' ? c.resolved : !c.resolved,
    );
    return [...list].sort((a, b) => (sort === 'newest' ? time(b) - time(a) : time(a) - time(b)));
  }, [comments, filter, sort]);

  const add = (e?: FormEvent) => {
    e?.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const c: PanelComment = { id: `c-${Date.now()}-${comments.length}`, author: currentUser, createdAt: Date.now(), text };
    setComments((l) => [...l, c]);
    setDraft('');
    onAdd?.(c);
  };

  const run = async (c: PanelComment) => {
    setRunning((s) => new Set(s).add(c.id));
    try {
      await onRunEdit?.(c);
      setApplied((s) => new Set(s).add(c.id));
    } finally {
      setRunning((s) => {
        const n = new Set(s);
        n.delete(c.id);
        return n;
      });
    }
  };

  const toggleResolved = (c: PanelComment, resolved: boolean) => {
    setComments((l) => l.map((x) => (x.id === c.id ? { ...x, resolved } : x)));
    onResolve?.(c, resolved);
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) add(e);
  };

  return (
    <section ref={ref} aria-label={title} {...mergeSx(stylex.props(w4.card, styles.root, xstyle), className)}>
      <div {...stylex.props(styles.head)}>
        <h3 {...stylex.props(styles.title)}>{title}</h3>
        {onClose && <CloseButton size="sm" aria-label="Close comments" onPress={onClose} />}
      </div>
      <Tabs selectedKey={filter} onSelectionChange={(k) => setFilter(k as Filter)} variant="pill" size="sm">
        <div {...stylex.props(styles.bar)}>
          <TabList aria-label="Filter comments">
            <Tab id="all">All</Tab>
            <Tab id="open" count={counts.open}>Open</Tab>
            <Tab id="edits" count={counts.edits}>Edits</Tab>
            <Tab id="resolved" count={counts.resolved}>Resolved</Tab>
          </TabList>
          <DropdownMenu>
            <IconButton variant="ghost" size="sm" aria-label="Sort comments">
              <ListFilter size={16} />
            </IconButton>
            <DropdownMenuContent
              placement="bottom end"
              aria-label="Sort comments"
              selectionMode="single"
              selectedKeys={[sort]}
              onSelectionChange={(keys) => {
                const k = [...keys][0];
                if (k) setSort(k as Sort);
              }}
            >
              <DropdownMenuItem id="newest">Newest first</DropdownMenuItem>
              <DropdownMenuItem id="oldest">Oldest first</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <TabPanel id={filter}>
          {shown.length === 0 ? (
            <p {...stylex.props(w4.muted, styles.empty)}>No {filter === 'all' ? '' : `${filter} `}comments yet.</p>
          ) : (
            <ul ref={listRef} aria-live="polite" aria-label="Comments" tabIndex={0} {...stylex.props(styles.list, focus.inset)}>
              {shown.map((c, i) => {
                const edit = EDIT.test(c.text);
                const isRunning = running.has(c.id);
                return (
                  <li
                    key={c.id}
                    data-flip-id={c.id}
                    {...stylex.props(styles.item, styles.itemColor, w4Motion.fadeUp, c.resolved && styles.resolved)}
                    style={{ animationDelay: `${Math.min(i, 6) * 40}ms` }}
                  >
                    <Avatar size="sm" name={c.author.name} src={c.author.avatar} />
                    <div {...stylex.props(styles.main)}>
                      <div {...stylex.props(styles.meta)}>
                        <span {...stylex.props(styles.name)}>{c.author.name}</span>
                        <span {...stylex.props(styles.metaEnd)}>
                          <time dateTime={new Date(c.createdAt).toISOString()} {...stylex.props(styles.time)}>
                            {formatRelative(c.createdAt, fmt.locale)}
                          </time>
                          <ToggleButton
                            variant="ghost"
                            size="xs"
                            isIconOnly
                            aria-label={c.resolved ? 'Reopen comment' : 'Resolve comment'}
                            isSelected={!!c.resolved}
                            onChange={(v) => toggleResolved(c, v)}
                          >
                            <CircleCheck size={14} />
                          </ToggleButton>
                        </span>
                      </div>
                      {edit ? (
                        <>
                          <p {...stylex.props(styles.text)} title={c.text}>
                            <span {...stylex.props(styles.cmd)}>/Edit </span>
                            {c.text.replace(EDIT, '')}
                          </p>
                          {applied.has(c.id) ? (
                            <span role="status" {...stylex.props(styles.applied, styles.appliedIn)}>
                              <Check size={14} aria-hidden="true" /> Applied
                            </span>
                          ) : (
                            <div {...stylex.props(styles.run)}>
                              <Button size="sm" variant="secondary" isLoading={isRunning} startIcon={<Play size={12} fill="currentColor" />} onPress={() => run(c)}>
                                {isRunning ? 'Running…' : 'Run edit'}
                              </Button>
                            </div>
                          )}
                        </>
                      ) : (
                        <p {...stylex.props(styles.text)}>{c.text}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </TabPanel>
      </Tabs>
      <form onSubmit={add} {...stylex.props(styles.form)}>
        <Avatar size="sm" name={currentUser.name} src={currentUser.avatar} />
        <textarea
          aria-label="Add a comment"
          placeholder="Add a comment or /edit..."
          rows={1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          {...stylex.props(styles.input, focus.ring)}
        />
        <IconButton type="submit" variant="soft" aria-label="Send comment" isDisabled={!draft.trim()}>
          <ArrowUp size={16} />
        </IconButton>
      </form>
    </section>
  );
}
