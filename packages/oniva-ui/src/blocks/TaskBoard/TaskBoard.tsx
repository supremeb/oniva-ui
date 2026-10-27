import * as stylex from '@stylexjs/stylex';
import { ChevronRight, CircleDot, Clock, Eye, Inbox, ListFilter, Plus, Square, SquareCheck, Star, X } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { Avatar } from '../../components/Avatar/Avatar';
import { Button } from '../../components/Button/Button';
import { SearchField } from '../../components/SearchField/SearchField';
import { Switch } from '../../components/Switch/Switch';
import { ToggleButton } from '../../components/ToggleButton/ToggleButton';
import { focus } from '../../internal/focus';
import { pluralize, useFormatters } from '../../internal/format';
import { mergeSx } from '../../internal/sx';
import { w8 } from '../../internal/w8-styles';
import { useBoardFlip } from '../../internal/w8-flip';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const cardIn = stylex.keyframes({ from: { opacity: 0, transform: 'translateY(6px)' }, to: { opacity: 1, transform: 'translateY(0)' } });
const settle = stylex.keyframes({ '0%': { transform: 'scale(1.03)', boxShadow: '0 6px 16px rgba(0,0,0,0.12)' }, '100%': { transform: 'scale(1)', boxShadow: '0 0 0 rgba(0,0,0,0)' } });
const lineIn = stylex.keyframes({ from: { opacity: 0, transform: 'scaleX(0.6)' }, to: { opacity: 1, transform: 'scaleX(1)' } });
const enter = stylex.keyframes({ from: { opacity: 0, transform: 'translateX(12px)' }, to: { opacity: 1, transform: 'translateX(0)' } });

const styles = stylex.create({
  toolbar: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'flex', fontSize: font['--oniva-font-size-12'], gap: 6, marginBottom: 10 },
  crumb: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'inline-flex', gap: 6 },
  crumbNow: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-12'], fontWeight: font['--oniva-font-weight-medium'] },
  sub: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  search: { flexBasis: 140, flexGrow: 0, minWidth: 0, width: 160 },
  colIcon: { color: colors['--oniva-color-text-muted'], display: 'inline-flex', flexShrink: 0 },
  colTitleRow: { alignItems: 'center', display: 'flex', gap: 6 },
  cardHead: { alignItems: 'flex-start', display: 'flex', gap: 6, minWidth: 0 },
  chip: { alignItems: 'center', borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-md'], borderStyle: 'solid', borderWidth: 1, boxSizing: 'border-box', color: colors['--oniva-color-text-muted'], display: 'inline-flex', fontSize: font['--oniva-font-size-11'], gap: 4, lineHeight: 1.2, paddingBlock: 2, paddingInline: 5 },
  chipLate: { backgroundColor: colors['--oniva-color-danger-bg'], borderColor: 'transparent', color: colors['--oniva-color-danger-fg'] },
  dot: { backgroundColor: colors['--oniva-color-accent-text'], borderRadius: '50%', flexShrink: 0, height: 6, width: 6 },
  dotInfra: { backgroundColor: colors['--oniva-color-success-solid'] },
  dotBilling: { backgroundColor: colors['--oniva-color-warning-solid'] },
  layout: { alignItems: 'start', display: 'grid', gap: 16, gridTemplateColumns: { default: 'minmax(0, 1fr)', '@container (min-width: 900px)': 'minmax(0, 1fr) auto' } },
  scroller: { minWidth: 0, overflowX: 'auto', paddingBottom: 8 },
  board: { display: 'grid', gap: 8, gridAutoColumns: 'minmax(128px, 1fr)', gridAutoFlow: 'column' },
  col: { backgroundColor: colors['--oniva-color-surface-inset'], borderRadius: radius['--oniva-radius-xl'], display: 'flex', flexDirection: 'column', gap: 6, minHeight: 120, padding: 6 },
  colOver: { backgroundColor: colors['--oniva-color-accent-soft'] },
  colHead: { alignItems: 'center', display: 'flex', gap: 4, padding: '2px 4px 0' },
  colTitle: { fontSize: font['--oniva-font-size-12'], fontWeight: font['--oniva-font-weight-medium'], margin: 0 },
  topRow: { alignItems: 'center', display: 'flex', justifyContent: 'space-between', width: '100%' },
  created: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-11'] },
  heading: { fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-medium'], margin: 0 },
  count: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums' },
  card: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: { default: colors['--oniva-color-border'], ':hover': { default: null, [media.hover]: colors['--oniva-color-border-hover'] } },
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    padding: 10,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'border-color, opacity, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '100%',
  },
  cardNew: {
    animationDelay: 'calc(var(--i, 0) * 35ms)',
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationFillMode: 'backwards',
    animationName: { default: cardIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  cardSettle: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationName: { default: settle, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  cardCompact: { gap: 4, paddingBlock: 8 },
  cardSelected: { borderColor: colors['--oniva-color-border-active'] },
  dragging: { opacity: 0.45, transform: 'scale(0.97)' },
  dropLine: { backgroundColor: colors['--oniva-color-accent-text'], borderRadius: 2, height: 2, marginBlock: -5, animationDuration: motion['--oniva-motion-dur-base'], animationName: { default: lineIn, [media.reducedMotion]: 'none' }, animationTimingFunction: motion['--oniva-motion-ease-out'], transformOrigin: 'left center' },
  key: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-11'], fontVariantNumeric: 'tabular-nums' },
  cardTitle: { fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-medium'], lineHeight: 1.35, overflowWrap: 'anywhere' },
  meta: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 6 },
  grow: { flexGrow: 1 },
  panel: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationName: { default: enter, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    width: { default: '100%', '@container (min-width: 900px)': 320 },
  },
  group: { display: 'flex', flexDirection: 'column', gap: 6 },
  groupLabel: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], fontWeight: font['--oniva-font-weight-medium'] },
  addInput: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border-control'],
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: 'inherit',
    font: 'inherit',
    padding: '8px 10px',
    width: '100%',
  },
  empty: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], padding: 12, textAlign: 'center' },
  noWrap: { flexWrap: 'nowrap' },
});

export interface TaskStatus {
  id: string;
  label: string;
  /** Icon shown in the column header and on its cards. Defaults by id. */
  icon?: ReactNode;
}
export interface TaskLabel {
  id: string;
  label: string;
}
export interface TaskPerson {
  id: string;
  name: string;
}
export interface Task {
  id: string;
  title: string;
  status: string;
  /** 0 (none) to 4 (urgent). */
  priority: 0 | 1 | 2 | 3 | 4;
  labels?: string[];
  assignee?: string;
  /** ISO date (YYYY-MM-DD). */
  due?: string;
  /** ISO date shown as `Created <date>` at the bottom of the card. */
  created?: string;
}

const PRIORITY: { label: string; short: string }[] = [
  { label: 'No priority', short: '' },
  { label: 'Low', short: 'S' },
  { label: 'Medium', short: 'M' },
  { label: 'High', short: 'L' },
  { label: 'Urgent', short: 'XL' },
];

function statusIcon(s: TaskStatus | undefined, size = 12): ReactNode {
  if (s?.icon) return s.icon;
  const p = { size, 'aria-hidden': true } as const;
  switch (s?.id) {
    case 'review':
      return <Eye {...p} />;
    case 'next':
      return <Inbox {...p} />;
    case 'doing':
      return <CircleDot {...p} />;
    case 'done':
      return <SquareCheck {...p} />;
    default:
      return <Square {...p} />;
  }
}

function Bars({ level }: { level: number }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={i * 2.6} y={8 - i * 2.4} width="1.8" height={2 + i * 2.4} rx="0.5" fill="currentColor" opacity={i < level ? 1 : 0.3} />
      ))}
    </svg>
  );
}

export const defaultStatuses: TaskStatus[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'doing', label: 'In progress' },
  { id: 'review', label: 'In review' },
  { id: 'done', label: 'Done' },
];
export const defaultLabels: TaskLabel[] = [
  { id: 'agents', label: 'Agents' },
  { id: 'billing', label: 'Billing' },
  { id: 'infra', label: 'Infra' },
];
export const defaultPeople: TaskPerson[] = [
  { id: 'maya', name: 'Maya Ortiz' },
  { id: 'jonas', name: 'Jonas Weber' },
  { id: 'priya', name: 'Priya Nair' },
];
export const defaultTasks: Task[] = [
  { id: 'ONV-101', title: 'Per-agent budget caps in settings', status: 'backlog', priority: 3, labels: ['agents', 'billing'], assignee: 'maya', due: '2026-11-12' },
  { id: 'ONV-102', title: 'Replay link for failed runs', status: 'doing', priority: 4, labels: ['agents'], assignee: 'jonas', due: '2026-11-04' },
  { id: 'ONV-103', title: 'Retry policy for tool timeouts', status: 'doing', priority: 2, labels: ['infra'], assignee: 'priya' },
  { id: 'ONV-104', title: 'Audit log CSV export', status: 'review', priority: 2, labels: ['billing'], assignee: 'maya', due: '2026-11-09' },
  { id: 'ONV-105', title: 'Rotate staging API keys', status: 'done', priority: 1, labels: ['infra'], assignee: 'jonas' },
  { id: 'ONV-106', title: 'Invoice PDF layout polish', status: 'backlog', priority: 1, labels: ['billing'] },
];

export interface TaskBoardProps extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'onChange' | 'title' | 'defaultValue'> {
  /** Controlled tasks. */
  tasks?: Task[];
  /** Initial tasks when uncontrolled. */
  defaultTasks?: Task[];
  statuses?: TaskStatus[];
  labels?: TaskLabel[];
  people?: TaskPerson[];
  title?: string;
  /** Trail shown before the title, e.g. `['Oniva', 'Launch']`. */
  breadcrumb?: string[];
  /** Called with all tasks after every move, edit or add. */
  onChange?: (tasks: Task[]) => void;
  /** Reference ISO date used to flag overdue tasks. Defaults to today. */
  today?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function TaskBoard({
  tasks: tasksProp,
  defaultTasks: initial = defaultTasks,
  statuses = defaultStatuses,
  labels = defaultLabels,
  people = defaultPeople,
  title = 'Sprint board',
  breadcrumb = [],
  onChange,
  today,
  className,
  xstyle,
  ref,
  ...rest
}: TaskBoardProps) {
  const [inner, setInner] = useState(initial);
  const tasks = tasksProp ?? inner;
  const commit = (next: Task[]) => {
    if (tasksProp === undefined) setInner(next);
    onChange?.(next);
  };
  const { date } = useFormatters();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<string[]>([]);
  const [compact, setCompact] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [over, setOver] = useState<{ col: string; before: string | null } | null>(null);
  const [adding, setAdding] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [live, setLive] = useState('');
  const [settled, setSettled] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  useBoardFlip(boardRef);
  // Cards seen before skip the entrance, so moving between columns glides (FLIP) instead of fading in again.
  const seen = useRef(new Set<string>());
  useEffect(() => {
    tasks.forEach((t) => seen.current.add(t.id));
  });
  const uid = useId();
  const panelHead = useRef<HTMLHeadingElement>(null);
  const lastCard = useRef<HTMLElement | null>(null);
  const nowIso = today ?? new Date().toISOString().slice(0, 10);

  const visible = useMemo(
    () => tasks.filter((t) => (!query || t.title.toLowerCase().includes(query.toLowerCase()) || t.id.toLowerCase().includes(query.toLowerCase())) && (!active.length || active.every((a) => t.labels?.includes(a)))),
    [tasks, query, active],
  );
  const open = tasks.find((t) => t.id === openId) ?? null;
  useEffect(() => {
    if (open) panelHead.current?.focus();
  }, [open?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const patch = (id: string, p: Partial<Task>) => commit(tasks.map((t) => (t.id === id ? { ...t, ...p } : t)));
  const move = (id: string, status: string, before: string | null) => {
    const t = tasks.find((x) => x.id === id);
    if (!t || id === before) return;
    const rest2 = tasks.filter((x) => x.id !== id);
    const idx = before ? rest2.findIndex((x) => x.id === before) : -1;
    const moved = { ...t, status };
    const next = idx < 0 ? [...rest2, moved] : [...rest2.slice(0, idx), moved, ...rest2.slice(idx)];
    commit(next);
    setSettled(id);
    window.setTimeout(() => setSettled((c) => (c === id ? null : c)), 400);
    setLive(`${t.title} moved to ${statuses.find((s) => s.id === status)?.label ?? status}`);
  };
  const addTask = (status: string) => {
    const name = draft.trim();
    if (name) {
      const n = Math.max(100, ...tasks.map((t) => Number(t.id.replace(/\D/g, '')) || 0)) + 1;
      commit([...tasks, { id: `ONV-${n}`, title: name, status, priority: 0 }]);
    }
    setAdding(null);
    setDraft('');
  };
  const closePanel = () => {
    setOpenId(null);
    lastCard.current?.focus();
  };
  const sx = stylex.props(w8.root, xstyle);

  return (
    <section ref={ref} aria-label={title} {...rest} {...mergeSx(sx, className)}>
      <div {...stylex.props(w8.panel)}>
        <div {...stylex.props(styles.toolbar)}>
          <nav aria-label="Breadcrumb" {...stylex.props(styles.crumb)}>
            {breadcrumb.map((c) => (
              <span key={c} {...stylex.props(styles.crumb)}>
                {c}
                <ChevronRight size={12} aria-hidden="true" />
              </span>
            ))}
            <h2 {...stylex.props(styles.heading, styles.crumbNow)}>
              {title}
            </h2>
            <Star size={12} aria-hidden="true" />
          </nav>
        </div>
        <div {...stylex.props(styles.sub)}>
          <span {...stylex.props(styles.count, styles.grow)}>{pluralize(visible.length, { one: '# task', other: '# tasks' })}</span>
          <div role="group" aria-label="Filter by label" {...stylex.props(w8.row)}>
            <ListFilter size={14} aria-hidden="true" />
            {labels.map((l) => (
              <ToggleButton key={l.id} size="xs" variant="secondary" isSelected={active.includes(l.id)} onChange={(on) => setActive((a) => (on ? [...a, l.id] : a.filter((x) => x !== l.id)))}>
                {l.label}
              </ToggleButton>
            ))}
          </div>
          <SearchField aria-label="Search tasks" value={query} onChange={setQuery} shortcut={null} placeholder="Search" xstyle={styles.search} />
          <Switch size="sm" isSelected={compact} onChange={setCompact}>
            Compact
          </Switch>
        </div>
        <div {...stylex.props(styles.layout)}>
          <div {...stylex.props(styles.scroller)}>
            <div ref={boardRef} {...stylex.props(styles.board)}>
              {statuses.map((s) => {
                const col = visible.filter((t) => t.status === s.id);
                return (
                  <div
                    key={s.id}
                    role="group"
                    aria-label={`${s.label}, ${pluralize(col.length, { one: '# task', other: '# tasks' })}`}
                    onDragOver={(e) => {
                      if (!dragId) return;
                      e.preventDefault();
                      setOver((o) => (o?.col === s.id ? o : { col: s.id, before: null }));
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (dragId && over) move(dragId, s.id, over.before);
                      setDragId(null);
                      setOver(null);
                    }}
                    {...stylex.props(styles.col, over?.col === s.id && styles.colOver)}
                  >
                    <div {...stylex.props(styles.colHead)}>
                      <h3 {...stylex.props(styles.colTitle, styles.colTitleRow)}>
                        <span {...stylex.props(styles.colIcon)}>{statusIcon(s)}</span>
                        {s.label} <span {...stylex.props(styles.count)}>{col.length}</span>
                      </h3>
                      <Button size="xs" variant="ghost" isIconOnly aria-label={`Add task to ${s.label}`} onPress={() => setAdding(s.id)}>
                        <Plus size={14} aria-hidden="true" />
                      </Button>
                    </div>
                    {adding === s.id && (
                      <input
                        autoFocus
                        aria-label={`New task title in ${s.label}`}
                        placeholder="Task title, then Enter"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') addTask(s.id);
                          if (e.key === 'Escape') {
                            setAdding(null);
                            setDraft('');
                          }
                        }}
                        onBlur={() => addTask(s.id)}
                        {...stylex.props(styles.addInput, focus.ring)}
                      />
                    )}
                    {col.map((t, ci) => (
                      <div
                        key={t.id}
                        data-flip-id={t.id}
                        onDragOver={(e) => {
                          if (!dragId) return;
                          e.preventDefault();
                          e.stopPropagation();
                          setOver({ col: s.id, before: t.id });
                        }}
                      >
                        {over?.before === t.id && dragId !== t.id && <div {...stylex.props(styles.dropLine)} />}
                        <button
                          type="button"
                          draggable
                          aria-label={`${t.id} ${t.title}`}
                          aria-expanded={openId === t.id}
                          onClick={(e) => {
                            lastCard.current = e.currentTarget;
                            setOpenId(t.id);
                          }}
                          onDragStart={(e) => {
                            e.dataTransfer.effectAllowed = 'move';
                            setDragId(t.id);
                          }}
                          onDragEnd={() => {
                            setDragId(null);
                            setOver(null);
                          }}
                          {...stylex.props(w8.press, styles.card, compact && styles.cardCompact, openId === t.id && styles.cardSelected, dragId === t.id && styles.dragging, !seen.current.has(t.id) && styles.cardNew, settled === t.id && styles.cardSettle, focus.ring)}
                          style={{ '--i': Math.min(ci, 6) } as React.CSSProperties}
                        >
                          <span {...stylex.props(styles.topRow)}>
                            <span {...stylex.props(styles.key)}>{t.id}</span>
                            {t.assignee && <Avatar size="xs" name={people.find((p) => p.id === t.assignee)?.name ?? t.assignee} />}
                          </span>
                          <span {...stylex.props(styles.cardHead)}>
                            <span {...stylex.props(styles.colIcon)}>{statusIcon(s)}</span>
                            <span {...stylex.props(styles.cardTitle)}>{t.title}</span>
                          </span>
                          {!compact && (
                            <span {...stylex.props(styles.meta)}>
                              <span {...stylex.props(styles.chip)}>
                                <Bars level={t.priority} />
                                {PRIORITY[t.priority]!.short}
                              </span>
                              {t.due && (
                                <span {...stylex.props(styles.chip, t.due < nowIso && s.id !== statuses[statuses.length - 1]?.id && styles.chipLate)}>
                                  <Clock size={10} aria-hidden="true" />
                                  {t.due < nowIso && s.id !== statuses[statuses.length - 1]?.id ? 'Overdue ' : 'Due '}
                                  {date(new Date(`${t.due}T00:00:00`), { month: 'short', day: 'numeric' })}
                                </span>
                              )}
                              {t.labels?.map((l) => (
                                <span key={l} {...stylex.props(styles.chip)}>
                                  <span {...stylex.props(styles.dot, l === 'infra' && styles.dotInfra, l === 'billing' && styles.dotBilling)} aria-hidden="true" />
                                  {labels.find((x) => x.id === l)?.label ?? l}
                                </span>
                              ))}
                            </span>
                          )}
                          {!compact && t.created && <span {...stylex.props(styles.created)}>Created {date(new Date(`${t.created}T00:00:00`), { month: 'short', day: 'numeric' })}</span>}
                        </button>
                      </div>
                    ))}
                    {col.length === 0 && <p {...stylex.props(styles.empty)}>No tasks</p>}
                  </div>
                );
              })}
            </div>
          </div>
          {open && (
            <aside
              aria-label={`Task ${open.id}`}
              onKeyDown={(e) => e.key === 'Escape' && closePanel()}
              {...stylex.props(w8.tile, styles.panel)}
            >
              <div {...stylex.props(w8.row, w8.between, styles.noWrap)}>
                <span {...stylex.props(styles.key)}>{open.id}</span>
                <Button size="xs" variant="ghost" isIconOnly aria-label="Close task" onPress={closePanel}>
                  <X size={14} aria-hidden="true" />
                </Button>
              </div>
              <h3 ref={panelHead} tabIndex={-1} {...stylex.props(w8.title)}>
                {open.title}
              </h3>
              <Group id={`${uid}-st`} label="Status">
                {statuses.map((s) => (
                  <ToggleButton key={s.id} size="xs" variant="secondary" isSelected={open.status === s.id} onChange={() => move(open.id, s.id, null)}>
                    {s.label}
                  </ToggleButton>
                ))}
              </Group>
              <Group id={`${uid}-pr`} label="Priority">
                {PRIORITY.map((p, i) => (
                  <ToggleButton key={p.label} size="xs" variant="secondary" isSelected={open.priority === i} onChange={() => patch(open.id, { priority: i as Task['priority'] })}>
                    {p.label}
                  </ToggleButton>
                ))}
              </Group>
              <Group id={`${uid}-lb`} label="Labels">
                {labels.map((l) => (
                  <ToggleButton
                    key={l.id}
                    size="xs"
                    variant="soft"
                    isSelected={!!open.labels?.includes(l.id)}
                    onChange={(on) => patch(open.id, { labels: on ? [...(open.labels ?? []), l.id] : (open.labels ?? []).filter((x) => x !== l.id) })}
                  >
                    {l.label}
                  </ToggleButton>
                ))}
              </Group>
              <Group id={`${uid}-as`} label="Assignee">
                {people.map((p) => (
                  <ToggleButton key={p.id} size="xs" variant="secondary" isSelected={open.assignee === p.id} onChange={(on) => patch(open.id, { assignee: on ? p.id : undefined })}>
                    {p.name}
                  </ToggleButton>
                ))}
              </Group>
            </aside>
          )}
        </div>
        <p role="status" aria-live="polite" {...stylex.props(w8.srOnly)}>
          {live}
        </p>
      </div>
    </section>
  );
}

function Group({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-labelledby={id} {...stylex.props(styles.group)}>
      <span id={id} {...stylex.props(styles.groupLabel)}>
        {label}
      </span>
      <div {...stylex.props(w8.row)}>{children}</div>
    </div>
  );
}
