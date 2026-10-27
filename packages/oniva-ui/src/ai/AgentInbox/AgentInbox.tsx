import * as stylex from '@stylexjs/stylex';
import { AlertTriangle, Check, Clock, Columns3, List as ListIcon, Loader2, Search, Sparkles, Wrench } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type Ref } from 'react';
import { Button, Disclosure, DisclosurePanel, Heading, Radio, RadioGroup } from 'react-aria-components';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { prefersReducedMotion } from '../../internal/motion-hooks';
import { mergeSx, sxClass } from '../../internal/sx';
import type { Tone } from '../../internal/types';
import { useFlip } from '../../internal/w1-flip';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { LiveRegion, formatDuration, useControlled, useNow, useWidth, w1 } from '../../internal/w1-agent-ui';

export type InboxStatus = 'running' | 'waiting' | 'done' | 'failed';
export type AgentInboxView = 'board' | 'list';

export interface InboxStep {
  label: string;
  time?: string;
}
export interface InboxTask {
  id: string;
  title: string;
  description?: string;
  agent: string;
  status: InboxStatus;
  /** Epoch ms; ticks a clock for running and waiting tasks. */
  startedAt?: number;
  /** Elapsed ms for finished tasks. */
  elapsed?: number;
  tools?: number;
  sources?: number;
  /** Oldest first. */
  steps?: InboxStep[];
}

const META: Record<InboxStatus, { label: string; tone: Tone }> = {
  running: { label: 'Running', tone: 'info' },
  waiting: { label: 'Needs you', tone: 'warning' },
  done: { label: 'Done', tone: 'success' },
  failed: { label: 'Failed', tone: 'danger' },
};
const COLS: { key: string; label: string; match: InboxStatus[] }[] = [
  { key: 'needs', label: 'Needs you', match: ['waiting', 'failed'] },
  { key: 'running', label: 'Running', match: ['running'] },
  { key: 'done', label: 'Done', match: ['done'] },
];

const styles = stylex.create({
  root: { containerType: 'inline-size' },
  crumb: { color: colors['--oniva-color-text-muted'], fontWeight: font['--oniva-font-weight-regular'] },
  switch: {
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-md'],
    display: 'inline-flex',
    gap: 2,
    padding: 2,
  },
  opt: {
    alignItems: 'center',
    backgroundColor: { default: 'transparent', '[data-selected]': colors['--oniva-color-surface-inner'] },
    borderRadius: radius['--oniva-radius-sm'],
    color: { default: colors['--oniva-color-text-muted'], '[data-selected]': colors['--oniva-color-text'] },
    cursor: 'pointer',
    display: 'inline-flex',
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 6,
    height: 24,
    paddingInline: 10,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, color',
  },
  action: {
    backgroundColor: accent['--oniva-accent-solid'],
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: colors['--oniva-color-accent-fg'],
    cursor: 'pointer',
    fontWeight: font['--oniva-font-weight-medium'],
    height: 28,
    paddingInline: 12,
  },
  board: { display: 'grid', gap: 8, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', alignItems: 'start' },
  stack: { display: 'flex', flexDirection: 'column', gap: 12 },
  col: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-xl'],
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    minWidth: 0,
    padding: 4,
  },
  colHead: { alignItems: 'center', display: 'flex', gap: 8, minHeight: 32, paddingInline: '10px 8px' },
  colIcon: { color: colors['--oniva-color-icon-muted'], flexShrink: 0 },
  colLabel: { flexGrow: 1, textAlign: 'center' },
  count: {
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    lineHeight: '18px',
    minWidth: 22,
    paddingInline: 6,
    textAlign: 'center',
  },
  cards: { display: 'flex', flexDirection: 'column', gap: 6 },
  tone_waiting: { color: colors['--oniva-color-warning-solid'] },
  tone_running: { color: colors['--oniva-color-info-solid'] },
  tone_done: { color: colors['--oniva-color-success-solid'] },
  tone_failed: { color: colors['--oniva-color-danger-solid'] },
  titleRow: { alignItems: 'center', display: 'flex', gap: 8, width: '100%' },
  sep: { alignSelf: 'stretch', backgroundColor: colors['--oniva-color-separator'], width: 1 },
  pair: { alignItems: 'center', display: 'inline-flex', gap: 5 },
  pairs: { alignItems: 'center', display: 'inline-flex', gap: 8, marginInlineStart: 'auto' },
  clock: { alignItems: 'center', display: 'inline-flex', gap: 6 },
  model: { fontWeight: font['--oniva-font-weight-regular'], color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'] },
  empty: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], paddingBlock: 12, textAlign: 'center' },
  card: { overflow: 'hidden' },
  head: { margin: 0 },
  trigger: {
    alignItems: 'flex-start',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: 'inherit',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    font: 'inherit',
    gap: 6,
    minHeight: { default: 44, '@media (pointer: coarse)': 56 },
    padding: 12,
    textAlign: 'start',
    width: '100%',
  },
  topRow: { alignItems: 'center', display: 'flex', gap: 6, width: '100%' },
  title: { fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-medium'], minWidth: 0 },
  desc: {
    color: colors['--oniva-color-text-muted'],
    display: '-webkit-box',
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-regular'],
    lineHeight: 1.45,
    overflow: 'hidden',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
  },
  meta: { fontWeight: font['--oniva-font-weight-regular'], alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'flex', fontSize: font['--oniva-font-size-13'], gap: 10, justifyContent: 'space-between', width: '100%' },
  chev: {
    color: colors['--oniva-color-icon-muted'],
    flexShrink: 0,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'transform',
  },
  chevOpen: { transform: 'rotate(90deg)' },
  panel: {
    borderTopColor: colors['--oniva-color-separator'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginInline: 12,
    paddingBlock: '10px 12px',
  },
  steps: { display: 'flex', flexDirection: 'column', gap: 6 },
  step: { alignItems: 'baseline', display: 'flex', gap: 8 },
  dot: {
    backgroundColor: colors['--oniva-color-icon-subtle'],
    borderRadius: radius['--oniva-radius-full'],
    flexShrink: 0,
    height: 6,
    marginBlockStart: 6,
    width: 6,
  },
  stepTime: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], marginInlineStart: 'auto', whiteSpace: 'nowrap' },
  btns: { display: 'flex', gap: 6, justifyContent: 'flex-end' },
  ghost: {
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    fontWeight: font['--oniva-font-weight-medium'],
    height: 28,
    paddingInline: 12,
  },
});

function StatusIcon({ status }: { status: InboxStatus }) {
  if (status === 'running') return <Loader2 size={14} aria-hidden="true" {...stylex.props(w1.spin)} />;
  if (status === 'done') return <Check size={14} aria-hidden="true" />;
  if (status === 'failed') return <AlertTriangle size={14} aria-hidden="true" />;
  return <Clock size={14} aria-hidden="true" />;
}

export interface AgentInboxProps {
  tasks: InboxTask[];
  /** Without a handler the task turns running inside the board. */
  onApprove?: (task: InboxTask) => void;
  /** Without a handler the task turns failed. */
  onReject?: (task: InboxTask) => void;
  /** Without a handler the task runs again and its clock starts over. */
  onRetry?: (task: InboxTask) => void;
  /** Shows an Open button on running and done tasks. */
  onOpen?: (task: InboxTask) => void;
  title?: string;
  /** A button in the bar, e.g. New task. */
  action?: { label: string; onClick: () => void };
  view?: AgentInboxView;
  defaultView?: AgentInboxView;
  /** Task ids that start expanded. */
  defaultOpen?: string[];
  onViewChange?: (view: AgentInboxView) => void;
  /** Clock override (epoch ms). */
  now?: number;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Background agent tasks grouped by what needs you, with live clocks, step history and next actions. */
export function AgentInbox({
  tasks,
  onApprove,
  onReject,
  onRetry,
  onOpen,
  title = 'Agent inbox',
  action,
  view,
  defaultView = 'board',
  defaultOpen,
  onViewChange,
  now,
  className,
  xstyle,
  ref,
}: AgentInboxProps) {
  const f = useFormatters();
  const rootRef = useRef<HTMLDivElement>(null);
  const [v, setV] = useControlled<AgentInboxView>(view, defaultView, onViewChange);
  const [local, setLocal] = useState<Record<string, { status: InboxStatus; startedAt?: number }>>({});
  const [open, setOpen] = useState<Set<string>>(() => new Set(defaultOpen));
  const w = useWidth(rootRef);
  const narrow = w > 0 && w < 620;
  const items = useMemo(
    () => tasks.map((t) => (local[t.id] ? { ...t, ...local[t.id]! } : t)),
    [tasks, local],
  );
  const t = useNow(now, items.some((x) => x.status === 'running' || x.status === 'waiting'));
  useFlip(rootRef);
  // A status change shows in place first; a beat later the card glides to its new column (FLIP).
  const [colOf, setColOf] = useState<Record<string, InboxStatus>>({});
  const colKey = (s: InboxStatus) => COLS.find((c) => c.match.includes(s))?.key;
  const seenIds = useRef<Set<string> | null>(null);
  useEffect(() => {
    const timers: number[] = [];
    const calm = prefersReducedMotion();
    setColOf((prev) => {
      const next: Record<string, InboxStatus> = {};
      let changed = false;
      for (const x of items) {
        const was = prev[x.id];
        if (!was || calm || colKey(was) === colKey(x.status)) next[x.id] = x.status;
        else {
          next[x.id] = was;
          timers.push(window.setTimeout(() => setColOf((p) => ({ ...p, [x.id]: x.status })), 340));
        }
        if (next[x.id] !== was) changed = true;
      }
      return changed || Object.keys(prev).length !== Object.keys(next).length ? next : prev;
    });
    return () => timers.forEach((t) => window.clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.map((x) => x.id + x.status).join()]);
  useEffect(() => {
    seenIds.current = new Set(items.map((x) => x.id));
  });
  const needs = items.filter((x) => x.status === 'waiting' || x.status === 'failed').length;
  const running = items.filter((x) => x.status === 'running').length;
  const set = (task: InboxTask, status: InboxStatus, restart = false) =>
    setLocal((l) => ({ ...l, [task.id]: { status, ...(restart ? { startedAt: Date.now() } : {}) } }));
  const close = (id: string) => setOpen((s) => { const n = new Set(s); n.delete(id); return n; });

  const card = (task: InboxTask) => {
    const meta = META[task.status];
    const clock = task.status === 'done' || task.status === 'failed' ? task.elapsed : task.startedAt != null ? t - task.startedAt : undefined;
    const isOpen = open.has(task.id);
    return (
      <div
        key={task.id}
        data-flip-id={task.id}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && isOpen) {
            close(task.id);
            e.currentTarget.querySelector<HTMLElement>('button[slot="trigger"]')?.focus();
          }
        }}
      >
      <Disclosure
        isExpanded={isOpen}
        onExpandedChange={(x) => setOpen((s) => { const n = new Set(s); if (x) n.add(task.id); else n.delete(task.id); return n; })}
        data-status={task.status}
        className={() => sxClass(stylex.props(w1.tile, styles.card, (seenIds.current === null || !seenIds.current.has(task.id)) && w1.rise))}
      >
        <Heading level={4} {...stylex.props(styles.head)}>
          <Button slot="trigger" className={() => sxClass(stylex.props(styles.trigger, focus.inset))}>
            <span {...stylex.props(styles.titleRow)}>
              <Sparkles size={14} aria-hidden="true" {...stylex.props(styles.colIcon, styles[`tone_${task.status}` as const])} />
              <span {...stylex.props(styles.title)}>{task.title}</span>
            </span>
            {task.description && <span {...stylex.props(styles.desc)}>{task.description}</span>}
            <span {...stylex.props(styles.meta, w1.num)}>
              <span {...stylex.props(styles.clock, styles[`tone_${task.status}` as const])}>
                <StatusIcon status={task.status} />
                <span {...stylex.props(w1.srOnly)}>{meta.label}</span>
                {clock != null && <span {...stylex.props(w1.muted)}>{formatDuration(clock)}</span>}
              </span>
              {(task.sources != null || task.tools != null) && (
                <span {...stylex.props(styles.pairs)}>
                  {task.sources != null && (
                    <span {...stylex.props(styles.pair)} aria-label={f.plural(task.sources, { one: '# source', other: '# sources' })}>
                      <Search size={13} aria-hidden="true" />{task.sources}
                    </span>
                  )}
                  {task.sources != null && task.tools != null && <span aria-hidden="true" {...stylex.props(styles.sep)} />}
                  {task.tools != null && (
                    <span {...stylex.props(styles.pair)} aria-label={f.plural(task.tools, { one: '# tool call', other: '# tool calls' })}>
                      <Wrench size={13} aria-hidden="true" />{task.tools}
                    </span>
                  )}
                </span>
              )}
            </span>
          </Button>
        </Heading>
        <DisclosurePanel>
          <div {...stylex.props(styles.panel)}>
            <span {...stylex.props(styles.model)}>{task.agent}</span>
            {task.steps && task.steps.length > 0 && (
              <ol aria-label="Last steps" {...stylex.props(w1.list, styles.steps)}>
                {task.steps.map((s, i) => (
                  <li key={i} style={{ animationDelay: `${Math.min(i, 5) * 40}ms` }} {...stylex.props(styles.step, w1.rise)}>
                    <span aria-hidden="true" {...stylex.props(styles.dot)} />
                    <span>{s.label}</span>
                    {s.time && <span {...stylex.props(styles.stepTime)}>{s.time}</span>}
                  </li>
                ))}
              </ol>
            )}
            <div {...stylex.props(styles.btns)}>
              {task.status === 'waiting' && (
                <>
                  <Button className={() => sxClass(stylex.props(styles.ghost, focus.ring))} onPress={() => (onReject ? onReject(task) : set(task, 'failed'))}>Reject</Button>
                  <Button className={() => sxClass(stylex.props(styles.action, focus.ring))} onPress={() => (onApprove ? onApprove(task) : set(task, 'running', true))}>Approve</Button>
                </>
              )}
              {task.status === 'failed' && (
                <Button className={() => sxClass(stylex.props(styles.action, focus.ring))} onPress={() => (onRetry ? onRetry(task) : set(task, 'running', true))}>Retry</Button>
              )}
              {onOpen && (task.status === 'running' || task.status === 'done') && (
                <Button className={() => sxClass(stylex.props(styles.ghost, focus.ring))} onPress={() => onOpen(task)}>Open</Button>
              )}
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>
      </div>
    );
  };

  const layout = narrow || v === 'list' ? 'list' : 'board';
  return (
    <div {...mergeSx(stylex.props(w1.root, styles.root, xstyle), className)} ref={(el) => { rootRef.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el; }}>
      <div {...stylex.props(w1.bar)}>
        <h3 {...stylex.props(w1.title)}>
          <span {...stylex.props(styles.crumb)}>Agents / </span>
          {title}
        </h3>
        <span {...stylex.props(w1.grow)} />
        {action && (
          <Button className={() => sxClass(stylex.props(styles.action, focus.ring))} onPress={action.onClick}>
            {action.label}
          </Button>
        )}
        {!narrow && (
          <RadioGroup aria-label="Layout" orientation="horizontal" value={v} onChange={(x) => setV(x as AgentInboxView)}>
            <div {...stylex.props(styles.switch)}>
              <Radio value="board" className={() => sxClass(stylex.props(styles.opt, focus.ring))}>
                <Columns3 size={14} aria-hidden="true" {...stylex.props(styles.pair)} />Board
              </Radio>
              <Radio value="list" className={() => sxClass(stylex.props(styles.opt, focus.ring))}>
                <ListIcon size={14} aria-hidden="true" {...stylex.props(styles.pair)} />List
              </Radio>
            </div>
          </RadioGroup>
        )}
      </div>
      <div {...stylex.props(layout === 'board' ? styles.board : styles.stack)}>
        {COLS.map((c) => {
          const list = items.filter((x) => c.match.includes(colOf[x.id] ?? x.status));
          return (
            <section key={c.key} aria-label={c.label} {...stylex.props(styles.col)}>
              <div {...stylex.props(styles.colHead)}>
                <Sparkles size={14} aria-hidden="true" {...stylex.props(styles.colIcon, styles[`tone_${c.key === 'needs' ? 'waiting' : c.key as 'running' | 'done'}` as const])} />
                <span {...stylex.props(w1.label, styles.colLabel)}>{c.label}</span>
                <span {...stylex.props(styles.count, w1.num)}><AnimatedNumber value={list.length} /></span>
              </div>
              <div {...stylex.props(styles.cards)}>
                {list.length === 0 ? <div {...stylex.props(styles.empty)}>Nothing here.</div> : list.map(card)}
              </div>
            </section>
          );
        })}
      </div>
      <LiveRegion message={`${f.plural(needs, { one: '# task needs you', other: '# tasks need you' })}, ${running} running.`} />
    </div>
  );
}
