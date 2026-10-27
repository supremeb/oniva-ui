import * as stylex from '@stylexjs/stylex';
import { GripVertical, Loader2, Sparkles } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState, type ReactNode, type Ref } from 'react';
import { useDrag, useDrop } from 'react-aria';
import { Switch } from 'react-aria-components';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { mergeSx, sxClass } from '../../internal/sx';
import { useGlide } from '../../internal/w1-r2-motion';
import { AgentAvatar } from '../AgentAvatar';
import { LiveRegion, Tag, useAnnouncer, useControlled, useNow, w1 } from '../../internal/w1-agent-ui';

export type DelegateMode = 'auto' | 'manual';
export interface DelegateAgent {
  id: string;
  name: string;
  model?: string;
  avatar?: ReactNode;
  /** Minutes left on the task it runs now. */
  current?: number;
  /** Cost per minute of work. */
  rate?: number;
}
export interface DelegateTask {
  id: string;
  title: string;
  /** Minutes. */
  estimate: number;
  tools?: ReactNode[];
  /** No agent: unassigned. */
  agentId?: string;
}

const MIME = 'application/x-oniva-delegate-task';

const timeIn = stylex.keyframes({ from: { filter: 'blur(2px)', opacity: 0, transform: 'translateY(3px) scale(0.9)' }, to: { filter: 'blur(0)', opacity: 1, transform: 'none' } });
const received = stylex.keyframes({ '0%': { opacity: 0.9 }, '100%': { opacity: 0 } });
const tagIn = stylex.keyframes({ from: { opacity: 0, transform: 'translateX(-6px)' }, to: { opacity: 1, transform: 'none' } });

const styles = stylex.create({
  root: { containerType: 'inline-size', gap: 0, maxWidth: 860, padding: 0 },
  hdr: { alignItems: 'center', borderColor: colors['--oniva-color-border'], borderStyle: 'solid', borderWidth: 0, borderBlockEndWidth: 1, display: 'flex', gap: 10, paddingBlock: 14, paddingInline: 20 },
  hdrIcon: { color: colors['--oniva-color-accent-text'], flexShrink: 0 },
  hdrSub: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'] },
  layout: { alignItems: 'start', display: 'grid', gap: 12, gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2.1fr)', padding: 16 },
  panel: { backgroundColor: colors['--oniva-color-surface-tertiary'], borderRadius: radius['--oniva-radius-lg'], padding: 10 },
  agentsHead: { alignItems: 'center', display: 'flex', justifyContent: 'space-between', paddingInline: 4 },
  sectionLabel: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'] },
  countChip: { backgroundColor: colors['--oniva-color-surface-inner'], borderRadius: radius['--oniva-radius-sm'], fontSize: font['--oniva-font-size-12'], minWidth: 20, paddingInline: 6, textAlign: 'center' },
  avatarBox: { alignItems: 'center', backgroundColor: colors['--oniva-color-surface-inner'], borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-md'], borderStyle: 'solid', borderWidth: 1, boxSizing: 'border-box', display: 'inline-flex', flexShrink: 0, height: 36, justifyContent: 'center', width: 36 },
  agentBody: { display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 6, minWidth: 0 },
  nameText: { fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-medium'] },
  chipBadge: { backgroundColor: colors['--oniva-color-surface-tertiary'], borderRadius: radius['--oniva-radius-sm'], fontSize: font['--oniva-font-size-12'], paddingBlock: 3, paddingInline: 8, whiteSpace: 'nowrap' },
  chipNew: { backgroundColor: colors['--oniva-color-accent-soft'], color: colors['--oniva-color-accent-soft-fg'] },
  chipFree: { backgroundColor: colors['--oniva-color-success-bg'], color: colors['--oniva-color-success-fg'] },
  topRight: { alignItems: 'center', display: 'inline-flex', gap: 6 },
  qchip: { alignItems: 'center', backgroundColor: colors['--oniva-color-accent-soft'], borderRadius: radius['--oniva-radius-md'], color: colors['--oniva-color-accent-soft-fg'], cursor: 'grab', display: 'inline-flex', gap: 6, minHeight: 28, minWidth: 0, paddingInline: 10 },
  cardBody: { display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 2, minWidth: 0 },
  cardMeta: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'flex', fontSize: font['--oniva-font-size-12'], gap: 6 },
  cardTitle: { fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-medium'] },
  section: { display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 },
  head: { alignItems: 'center', display: 'flex', gap: 6 },
  pile: { borderRadius: radius['--oniva-radius-lg'], display: 'flex', flexDirection: 'column', gap: 6, minHeight: 80 },
  agents: { display: 'flex', flexDirection: 'column', gap: 2 },
  agent: {
    position: 'relative',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    borderColor: { default: 'transparent', ':is([data-drop-target])': colors['--oniva-color-border-active'] },
    borderRadius: radius['--oniva-radius-lg'],
    boxShadow: 'none',
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
    padding: 10,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'border-color, background-color',
  },
  recv: {
    animationDuration: '900ms',
    animationFillMode: 'forwards',
    animationName: { default: received, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-out',
    backgroundColor: colors['--oniva-color-accent-soft-active'],
    borderRadius: 'inherit',
    inset: 0,
    pointerEvents: 'none',
    position: 'absolute',
  },
  timeKey: { animationDuration: motion['--oniva-motion-dur-slow'], animationName: { default: timeIn, [media.reducedMotion]: 'none' }, animationTimingFunction: motion['--oniva-motion-ease-out'], display: 'inline-block' },
  bar: { backgroundColor: 'transparent', borderRadius: radius['--oniva-radius-full'], height: 2, overflow: 'hidden', position: 'relative' },
  barNow: {
    backgroundColor: colors['--oniva-color-icon-muted'],
    borderRadius: 'inherit',
    inset: 0,
    position: 'absolute',
    transformOrigin: 'left center',
    transitionDuration: motion['--oniva-motion-dur-deliberate'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  barNew: { backgroundColor: colors['--oniva-color-accent-text'], opacity: 0.55 },
  modeTag: { animationDuration: motion['--oniva-motion-dur-enter'], animationFillMode: 'backwards', animationName: { default: tagIn, [media.reducedMotion]: 'none' }, animationTimingFunction: motion['--oniva-motion-ease-out'], display: 'inline-flex' },
  agentOver: { backgroundColor: colors['--oniva-color-accent-soft'] },
  agentSug: { backgroundColor: colors['--oniva-color-accent-soft'] },
  suggested: { borderColor: 'transparent' },
  agentTop: { alignItems: 'center', display: 'flex', gap: 8 },
  agentName: { display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 },
  model: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'] },
  key: { backgroundColor: colors['--oniva-color-kbd-bg'], borderRadius: radius['--oniva-radius-xs'], color: colors['--oniva-color-kbd-fg'], fontSize: font['--oniva-font-size-11'], paddingInline: 5 },
  queue: { display: 'flex', flexWrap: 'wrap', gap: 4, minHeight: 28 },
  card: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: { default: 'none', ':active': shadow['--oniva-elevation-floating'] },
    cursor: 'grab',
    display: 'flex',
    gap: 6,
    minHeight: 56,
    minWidth: 0,
    paddingBlock: 8,
    paddingInline: 8,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transform: { default: 'none', ':active': 'scale(1.03) rotate(-2deg)', [media.reducedMotion]: 'none' },
    transitionProperty: 'opacity, transform, border-color, box-shadow',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  dragging: { opacity: 0.45, transform: 'scale(0.98)' },
  marked: { borderColor: colors['--oniva-color-accent-text'], borderStyle: 'dashed' },
  grip: { color: colors['--oniva-color-icon-subtle'], flexShrink: 0 },
  tools: { color: colors['--oniva-color-icon-muted'], display: 'inline-flex', gap: 2 },
  empty: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], padding: 8, textAlign: 'center' },
  sw: { alignItems: 'center', cursor: 'pointer', display: 'inline-flex', gap: 6 },
  track: {
    backgroundColor: { default: colors['--oniva-color-border-control'], ':is([data-selected] *)': accent['--oniva-accent-solid'] },
    borderRadius: radius['--oniva-radius-full'],
    height: 18,
    padding: 2,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color',
    width: 32,
    boxSizing: 'border-box',
  },
  thumb: {
    backgroundColor: colors['--oniva-color-on-solid'],
    borderRadius: radius['--oniva-radius-full'],
    height: 14,
    transform: { default: 'translateX(0)', ':is([data-selected] *)': 'translateX(14px)' },
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: 14,
  },
});

interface CardProps {
  task: DelegateTask;
  variant?: 'card' | 'chip';
  marked?: boolean;
  agents: DelegateAgent[];
  onAssign: (taskId: string, agentId: string | null) => void;
  onDragging: (id: string | null) => void;
  dragging: boolean;
  minutes: string;
}

function TaskCard({ task, variant = 'card', marked, agents, onAssign, onDragging, dragging, minutes, active }: CardProps & { active?: boolean }) {
  const hint = useId();
  const { dragProps } = useDrag({
    getItems: () => [{ [MIME]: task.id, 'text/plain': task.title }],
    onDragStart: () => onDragging(task.id),
    onDragEnd: () => onDragging(null),
    getAllowedDropOperations: () => ['move'],
  });
  return (
    <div
      {...dragProps}
      role="button"
      tabIndex={0}
      aria-describedby={hint}
      data-flip-id={task.id}
      data-glide-enter=""
      data-glide-land=""
      data-dragging={dragging || undefined}
      aria-label={`${task.title}, ${minutes}${task.agentId ? `, assigned to ${agents.find((a) => a.id === task.agentId)?.name}` : ', unassigned'}`}
      onKeyDown={(e) => {
        dragProps.onKeyDownCapture?.(e as never);
        const n = Number(e.key);
        if (n >= 1 && n <= Math.min(9, agents.length)) {
          e.preventDefault();
          onAssign(task.id, agents[n - 1]!.id);
        }
      }}
      {...stylex.props(variant === 'chip' ? styles.qchip : styles.card, dragging && styles.dragging, marked && styles.marked, focus.ring)}
    >
      {variant === 'chip' ? (
        <>
          {active && <Loader2 size={13} aria-hidden="true" {...stylex.props(w1.spin)} />}
          <span {...stylex.props(w1.ellipsis)}>{task.title}</span>
        </>
      ) : (
        <>
          <GripVertical size={14} aria-hidden="true" {...stylex.props(styles.grip)} />
          <span {...stylex.props(styles.cardBody)}>
            <span {...stylex.props(styles.cardTitle, w1.ellipsis)}>{task.title}</span>
            <span {...stylex.props(styles.cardMeta, w1.num)}>
              {task.tools && task.tools.length > 0 && <span aria-hidden="true" {...stylex.props(styles.tools)}>{task.tools.slice(0, 3)}</span>}
              <span>~{minutes}</span>
            </span>
          </span>
        </>
      )}
      <span id={hint} {...stylex.props(w1.srOnly)}>
        Press Enter to pick up, then choose an agent. Or press 1 to {Math.min(9, agents.length)} to hand it over at once.
      </span>
    </div>
  );
}

interface ZoneProps {
  agent: DelegateAgent;
  index: number;
  tasks: DelegateTask[];
  dragId: string | null;
  suggestion: boolean;
  mins: (t: DelegateTask) => string;
  busyUntil: (a: DelegateAgent, extra?: DelegateTask) => string;
  minutesOf: (a: DelegateAgent, extra?: DelegateTask) => number;
  cost: (n: number) => string;
  taskById: (id: string) => DelegateTask | undefined;
  onAssign: (taskId: string, agentId: string | null) => void;
  setDrag: (id: string | null) => void;
  agents: DelegateAgent[];
  suggestedTask?: string;
}

function AgentZone({ agent, index, tasks, dragId, suggestion, mins, busyUntil, minutesOf, cost, taskById, onAssign, setDrag, agents, suggestedTask }: ZoneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [over, setOver] = useState(false);
  const { dropProps } = useDrop({
    ref,
    getDropOperation: (types) => (types.has(MIME) ? 'move' : 'cancel'),
    onDropEnter: () => setOver(true),
    onDropExit: () => setOver(false),
    onDrop: async (e) => {
      setOver(false);
      for (const item of e.items) {
        if (item.kind === 'text' && item.types.has(MIME)) onAssign(await item.getText(MIME), agent.id);
      }
    },
  });
  const dragged = dragId ? taskById(dragId) : undefined;
  const preview = (over || suggestion) && (dragged ?? (suggestedTask ? taskById(suggestedTask) : undefined));
  const prevCount = useRef<number | null>(null);
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    if (prevCount.current !== null && tasks.length > prevCount.current) setPulse((p) => p + 1);
    prevCount.current = tasks.length;
  }, [tasks.length]);
  const loadNow = Math.min(1, minutesOf(agent) / 120);
  const loadNew = Math.min(1, minutesOf(agent, preview || undefined) / 120);
  const free = tasks.length === 0 && !(agent.current && agent.current > 0);
  const total = tasks.reduce((s, t) => s + t.estimate, 0) * (agent.rate ?? 0);
  return (
    <section
      ref={ref}
      {...dropProps}
      aria-label={agent.name}
      data-drop-target={over || undefined}
      {...stylex.props(styles.agent, (over || suggestion) && styles.agentSug, over && styles.agentOver, suggestion && styles.suggested)}
    >
      {pulse > 0 && <span key={pulse} aria-hidden="true" {...stylex.props(styles.recv)} />}
      <span {...stylex.props(styles.avatarBox)}>{agent.avatar ?? <AgentAvatar name={agent.name} size={24} />}</span>
      <div {...stylex.props(styles.agentBody)}>
        <div {...stylex.props(styles.agentTop)}>
          <span {...stylex.props(styles.agentName)}>
            <span {...stylex.props(styles.nameText)}>
              {agent.name} {index < 9 && <kbd aria-hidden="true" {...stylex.props(styles.key)}>{index + 1}</kbd>}
            </span>
            {(agent.model || agent.rate != null) && (
              <span {...stylex.props(styles.model, w1.num)}>{[agent.model, agent.rate != null ? `${cost(agent.rate)}/min` : null].filter(Boolean).join(' ')}</span>
            )}
          </span>
          <span {...stylex.props(w1.grow)} />
          <span {...stylex.props(styles.topRight, w1.num)}>
            {preview && agent.rate != null && <span {...stylex.props(styles.chipBadge, styles.chipNew)}>+{cost(preview.estimate * agent.rate)}</span>}
            {free && !preview ? (
              <span {...stylex.props(styles.chipBadge, styles.chipFree)}>Free</span>
            ) : (
              <span {...stylex.props(styles.chipBadge, preview && styles.chipNew)}>
                {preview ? `+${preview.estimate}m until ` : 'Busy until '}
                <span key={preview ? busyUntil(agent, preview) : busyUntil(agent)} {...stylex.props(styles.timeKey)}>
                  {preview ? busyUntil(agent, preview) : busyUntil(agent)}
                </span>
              </span>
            )}
          </span>
        </div>
        <div aria-hidden="true" {...stylex.props(styles.bar)}>
          <span {...stylex.props(styles.barNow, styles.barNew)} style={{ transform: `scaleX(${loadNew})` }} />
          <span {...stylex.props(styles.barNow)} style={{ transform: `scaleX(${loadNow})` }} />
        </div>
        <ul aria-label={`${agent.name} queue`} {...stylex.props(w1.list, styles.queue)}>
          {tasks.length === 0 && dragId && <li {...stylex.props(styles.empty)}>Drop a task here.</li>}
          {tasks.map((t, i) => (
            <li key={t.id}>
              <TaskCard task={t} variant="chip" active={i === 0 && (agent.current ?? 0) > 0} agents={agents} onAssign={onAssign} onDragging={setDrag} dragging={dragId === t.id} minutes={mins(t)} />
            </li>
          ))}
        </ul>
        {agent.rate != null && tasks.length > 0 && <span {...stylex.props(w1.srOnly)}>Queue total {cost(total)}</span>}
      </div>
    </section>
  );
}

export interface DelegateBoardProps {
  agents: DelegateAgent[];
  tasks: DelegateTask[];
  /** Drop, keyboard pick or Auto. `null` means back to unassigned. Without it the board moves tasks itself. */
  onAssign?: (taskId: string, agentId: string | null) => void;
  mode?: DelegateMode;
  defaultMode?: DelegateMode;
  onModeChange?: (mode: DelegateMode) => void;
  /** A proposed hand-off: the agent lights up and previews its new time. */
  suggestion?: { taskId: string; agentId: string } | null;
  formatCost?: (amount: number) => string;
  /** Clock override (epoch ms). */
  now?: number;
  title?: string;
  /** Hint next to the title. */
  subtitle?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Hand tasks to agents by dragging, keyboard or Auto; each agent previews its new "busy until" time. */
export function DelegateBoard({
  agents,
  tasks,
  onAssign,
  mode,
  defaultMode = 'manual',
  onModeChange,
  suggestion,
  formatCost,
  now,
  title = 'Delegate',
  subtitle = 'Drag a task onto an agent',
  className,
  xstyle,
  ref,
}: DelegateBoardProps) {
  const f = useFormatters();
  const rootRef = useRef<HTMLDivElement>(null);
  const [m, setM] = useControlled<DelegateMode>(mode, defaultMode, onModeChange);
  const [local, setLocal] = useState<Record<string, string | null>>({});
  const [dragId, setDragId] = useState<string | null>(null);
  const [msg, say] = useAnnouncer();
  const t = useNow(now, true, 30_000);
  useGlide(rootRef, { duration: 340, lift: 0.06, enter: true, flash: 'color-mix(in srgb, var(--oniva-color-accent-text) 22%, transparent)' });
  const cost = formatCost ?? ((n: number) => f.currency(n, 'USD', { minimumFractionDigits: 2 }));
  const items = useMemo(() => tasks.map((x) => (x.id in local ? { ...x, agentId: local[x.id] ?? undefined } : x)), [tasks, local]);
  const taskById = (id: string) => items.find((x) => x.id === id);
  const queueOf = (a: DelegateAgent) => items.filter((x) => x.agentId === a.id);
  const unassigned = items.filter((x) => !x.agentId || !agents.some((a) => a.id === x.agentId));
  const mins = (x: DelegateTask) => `${f.number(x.estimate)} min`;
  const minutesFor = (a: DelegateAgent, extra?: DelegateTask) => (a.current ?? 0) + queueOf(a).reduce((s, x) => s + x.estimate, 0) + (extra && extra.agentId !== a.id ? extra.estimate : 0);
  const busyUntil = (a: DelegateAgent, extra?: DelegateTask) => f.date(t + minutesFor(a, extra) * 60_000, { hour: 'numeric', minute: '2-digit' });

  const rated = agents.filter((a) => a.rate != null);
  const queuedCost = rated.length ? rated.reduce((n, a) => n + queueOf(a).reduce((x, y) => x + y.estimate, 0) * (a.rate ?? 0), 0) : null;

  const assign = (taskId: string, agentId: string | null) => {
    const task = taskById(taskId);
    if (!task || (task.agentId ?? null) === agentId) return;
    if (onAssign) onAssign(taskId, agentId);
    else setLocal((l) => ({ ...l, [taskId]: agentId }));
    say(`${task.title} → ${agentId ? agents.find((a) => a.id === agentId)?.name : 'Unassigned'}`);
  };

  // Auto: hand the next unassigned task to the least busy agent, about one a second.
  const autoRef = useRef({ unassigned, agents, minutesFor, assign });
  autoRef.current = { unassigned, agents, minutesFor, assign };
  const hasWork = m === 'auto' && unassigned.length > 0 && agents.length > 0;
  useEffect(() => {
    if (!hasWork) return;
    const id = window.setInterval(() => {
      const { unassigned: u, agents: ag, minutesFor: mf, assign: as } = autoRef.current;
      const next = u[0];
      if (!next || !ag.length) return;
      const best = [...ag].sort((a, b) => mf(a) - mf(b))[0]!;
      as(next.id, best.id);
    }, 1000);
    return () => window.clearInterval(id);
  }, [hasWork]);

  const [pileOver, setPileOver] = useState(false);
  const pileRef = useRef<HTMLDivElement>(null);
  const { dropProps: pileDrop } = useDrop({
    ref: pileRef,
    getDropOperation: (types) => (types.has(MIME) ? 'move' : 'cancel'),
    onDropEnter: () => setPileOver(true),
    onDropExit: () => setPileOver(false),
    onDrop: async (e) => {
      setPileOver(false);
      for (const item of e.items) if (item.kind === 'text' && item.types.has(MIME)) assign(await item.getText(MIME), null);
    },
  });

  return (
    <div
      {...mergeSx(stylex.props(w1.root, styles.root, xstyle), className)}
      ref={(el) => {
        rootRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) ref.current = el;
      }}
    >
      <div {...stylex.props(styles.hdr)}>
        <Sparkles size={15} aria-hidden="true" {...stylex.props(styles.hdrIcon)} />
        <h3 {...stylex.props(w1.title)}>{title}</h3>
        <span {...stylex.props(styles.hdrSub)}>{subtitle}</span>
        <span {...stylex.props(w1.grow)} />
        <Switch isSelected={m === 'auto'} onChange={(on) => setM(on ? 'auto' : 'manual')} className={() => sxClass(stylex.props(styles.sw, focus.ring))}>
          <span>Auto</span>
          <div {...stylex.props(styles.track)}>
            <div {...stylex.props(styles.thumb)} />
          </div>
        </Switch>
      </div>
      <div {...stylex.props(styles.layout)}>
        <section aria-label="Unassigned" {...stylex.props(styles.section, styles.panel)}>
          <div {...stylex.props(styles.head)}>
            <span {...stylex.props(styles.sectionLabel)}>Unassigned</span>
            <span {...stylex.props(styles.countChip, w1.num)}>{f.number(unassigned.length)}</span>
          </div>
          <div ref={pileRef} {...pileDrop} {...stylex.props(styles.pile, pileOver && styles.agentOver)}>
            {unassigned.length === 0 && <div {...stylex.props(styles.empty)}>Everything is handed out.</div>}
            {unassigned.map((x) => (
              <TaskCard key={x.id} task={x} agents={agents} onAssign={assign} onDragging={setDragId} dragging={dragId === x.id} marked={suggestion?.taskId === x.id} minutes={mins(x)} />
            ))}
          </div>
        </section>
        <section aria-label="Agents" {...stylex.props(styles.section)}>
          <div {...stylex.props(styles.agentsHead)}>
            <span {...stylex.props(styles.head)}>
              <span {...stylex.props(styles.sectionLabel)}>Agents</span>
              {m === 'auto' && <span {...stylex.props(styles.modeTag)}><Tag tone="info" icon={<Sparkles size={11} aria-hidden="true" />}>Auto routing</Tag></span>}
            </span>
            {queuedCost != null && <span {...stylex.props(styles.sectionLabel, w1.num)}>{cost(queuedCost)} in queues</span>}
          </div>
          <div {...stylex.props(styles.agents)}>
            {agents.map((a, i) => (
              <AgentZone
                key={a.id}
                agent={a}
                index={i}
                tasks={queueOf(a)}
                dragId={dragId}
                suggestion={suggestion?.agentId === a.id}
                suggestedTask={suggestion?.taskId}
                mins={mins}
                busyUntil={busyUntil}
                minutesOf={minutesFor}
                cost={cost}
                taskById={taskById}
                onAssign={assign}
                setDrag={setDragId}
                agents={agents}
              />
            ))}
          </div>
        </section>
      </div>
      <LiveRegion message={msg} />
    </div>
  );
}
