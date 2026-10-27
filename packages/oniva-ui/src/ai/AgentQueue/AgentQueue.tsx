import * as stylex from '@stylexjs/stylex';
import { ArrowUpToLine, Check, Minus, Pause, Play, Plus, RotateCw, Rows3, X } from 'lucide-react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type Ref } from 'react';
import { Button, Dialog, Popover, ToggleButton } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { mergeSx, sxClass } from '../../internal/sx';
import { flyGhost, useFlip } from '../../internal/w1-flip';
import { useEase } from '../../internal/w1-r2-motion';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { AgentAvatar } from '../AgentAvatar';
import { LiveRegion, Tag, formatDuration, useAnnouncer, useControlled, useNow, useWidth, w1 } from '../../internal/w1-agent-ui';

export type QueueKind = 'llm' | 'tool' | 'agent' | 'human';
export type QueueStatus = 'queued' | 'running' | 'done' | 'failed';
export interface QueueJob {
  id: string;
  name: string;
  kind: QueueKind;
  status: QueueStatus;
  /** Epoch ms (or your own clock; then pass `now`). */
  enqueuedAt: number;
  priority?: 'high' | 'normal' | 'low';
  startedAt?: number;
  endedAt?: number;
  /** Id of the worker running it. */
  worker?: string;
  /** 0 to 1 while running. */
  progress?: number;
  /** Expected run time in ms, used when `progress` is missing. */
  estimate?: number;
  attempt?: number;
  maxAttempts?: number;
  detail?: string;
  icon?: ReactNode;
  error?: string;
}
export interface QueueWorker {
  id: string;
  name: string;
  detail?: string;
  icon?: ReactNode;
}
export interface QueueRateLimit {
  from: number;
  until: number;
  label?: string;
}

const KIND: Record<QueueKind, { label: string }> = {
  llm: { label: 'Model call' },
  tool: { label: 'Tool call' },
  agent: { label: 'Sub-agent' },
  human: { label: 'Human review' },
};

const revealRight = stylex.keyframes({ from: { clipPath: 'inset(0 100% 0 0)' }, to: { clipPath: 'inset(0 0 0 0)' } });

const styles = stylex.create({
  draw: {
    animationDuration: '700ms',
    animationFillMode: 'backwards',
    animationName: { default: revealRight, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  root: { containerType: 'inline-size', gap: 0, maxWidth: 880, overflow: 'hidden', padding: 0, position: 'relative' },
  head: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8, minHeight: 28, padding: 14 },
  headIcon: { color: colors['--oniva-color-accent-text'], display: 'inline-flex' },
  divider: { borderTopColor: colors['--oniva-color-border'], borderTopStyle: 'solid', borderTopWidth: 1 },
  body: { display: 'grid', gap: 16, gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.8fr) minmax(0, 0.6fr)', padding: 16 },
  bodyNarrow: { gridTemplateColumns: 'minmax(0, 1fr)' },
  secHead: { alignItems: 'baseline', display: 'flex', gap: 6 },
  secCount: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-13'], fontVariantNumeric: 'tabular-nums', fontWeight: font['--oniva-font-weight-medium'] },
  workerRow: { alignItems: 'center', borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-lg'], borderStyle: 'solid', borderWidth: 1, boxSizing: 'border-box', display: 'grid', gap: 8, gridTemplateColumns: 'minmax(72px, 0.8fr) minmax(0, 1.5fr)', padding: 6 },
  workerName: { alignItems: 'center', display: 'flex', fontWeight: font['--oniva-font-weight-medium'], gap: 8, minWidth: 0, paddingInlineStart: 4 },
  finStack: { display: 'flex', flexDirection: 'column', gap: 8 },
  finCard: { borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-lg'], borderStyle: 'solid', borderWidth: 1, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 6, padding: 10 },
  finHead: { alignItems: 'center', display: 'flex', gap: 8 },
  finChip: { alignItems: 'center', borderRadius: radius['--oniva-radius-md'], display: 'inline-flex', height: 22, justifyContent: 'center', width: 22 },
  finOk: { backgroundColor: colors['--oniva-color-success-bg'], color: colors['--oniva-color-success-fg'] },
  finBad: { backgroundColor: colors['--oniva-color-danger-bg'], color: colors['--oniva-color-danger-fg'] },
  chart: { display: 'flex', flexDirection: 'column', gap: 6, padding: 16 },
  name: { color: colors['--oniva-color-text-muted'], fontWeight: font['--oniva-font-weight-regular'] },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' },
  statsNarrow: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  stat: { borderInlineStartColor: colors['--oniva-color-border'], borderInlineStartStyle: 'solid', borderInlineStartWidth: { default: 1, ':first-child': 0 }, display: 'flex', flexDirection: 'column-reverse', gap: 4, paddingBlock: 12, paddingInline: 16 },
  statUnit: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-regular'] },
  statValue: { fontSize: font['--oniva-font-size-18'], fontVariantNumeric: 'tabular-nums', fontWeight: font['--oniva-font-weight-semibold'] },
  warn: { color: colors['--oniva-color-warning-fg'] },
  flow: { display: 'contents' },
  flowNarrow: { gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)' },
  panel: { display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 },
  span2: {},
  rail: { display: 'flex', flexDirection: 'column', gap: 4, margin: 0, padding: 0, listStyle: 'none' },
  job: {
    alignItems: 'center',
    appearance: 'none',
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'flex',
    font: 'inherit',
    gap: 6,
    minHeight: 30,
    overflow: 'hidden',
    paddingInline: 8,
    position: 'relative',
    textAlign: 'start',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'background-color, color, border-color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '100%',
  },
  llm: { backgroundColor: colors['--oniva-color-purple-bg'], color: colors['--oniva-color-purple-fg'] },
  tool: { backgroundColor: colors['--oniva-color-cyan-bg'], color: colors['--oniva-color-cyan-fg'] },
  agent: { backgroundColor: colors['--oniva-color-surface-tertiary'], color: colors['--oniva-color-text'] },
  human: { backgroundColor: colors['--oniva-color-info-bg'], color: colors['--oniva-color-info-fg'] },
  bar: {
    backgroundColor: 'color-mix(in srgb, currentColor 10%, transparent)',
    inset: 0,
    position: 'absolute',
    transform: 'scaleX(var(--p, 0))',
    boxShadow: 'inset -2px 0 6px -3px currentColor',
    transformOrigin: 'left center',
    transitionDuration: motion['--oniva-motion-dur-slower'],
    transitionProperty: 'transform',
    transitionTimingFunction: 'linear',
  },
  paused: { backgroundColor: colors['--oniva-color-warning-bg'], color: colors['--oniva-color-warning-fg'] },
  failedJob: { backgroundColor: colors['--oniva-color-danger-bg'], color: colors['--oniva-color-danger-fg'] },
  jobIcon: { display: 'inline-flex', position: 'relative' },
  jobText: { flexGrow: 1, minWidth: 0, position: 'relative' },
  jobMeta: { fontSize: font['--oniva-font-size-11'], fontVariantNumeric: 'tabular-nums', position: 'relative', whiteSpace: 'nowrap' },
  slot: {},
  slotHead: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'flex', fontSize: font['--oniva-font-size-11'], gap: 6 },
  idle: { alignItems: 'center', borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-md'], borderStyle: 'dashed', borderWidth: 1, color: colors['--oniva-color-text-muted'], display: 'flex', fontSize: font['--oniva-font-size-12'], minHeight: 30, paddingInline: 8 },
  big: { fontSize: font['--oniva-font-size-18'], fontVariantNumeric: 'tabular-nums', fontWeight: font['--oniva-font-weight-semibold'] },
  svg: { display: 'block', height: 110, width: '100%' },
  line: { fill: 'none', stroke: colors['--oniva-color-accent-text'], strokeWidth: 1.5 },
  area: { fill: colors['--oniva-color-accent-soft'], opacity: 0.8 },
  limitBand: { fill: colors['--oniva-color-warning-bg'] },
  limitLine: { stroke: colors['--oniva-color-warning-solid'], strokeDasharray: '3 3', strokeWidth: 1 },
  step: { alignItems: 'center', display: 'inline-flex', gap: 2 },
  btn: {
    alignItems: 'center',
    backgroundColor: { default: colors['--oniva-color-surface-tertiary'], '[data-pressed]': colors['--oniva-color-surface-tertiary-hover'], '[data-selected]': colors['--oniva-color-warning-bg'] },
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: { default: colors['--oniva-color-text'], '[data-selected]': colors['--oniva-color-warning-fg'] },
    cursor: 'pointer',
    display: 'inline-flex',
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 5,
    height: { default: 28, '@media (pointer: coarse)': 36 },
    justifyContent: 'center',
    minWidth: 28,
    paddingInline: 8,
  },
  pop: { display: 'flex', flexDirection: 'column', gap: 8 },
  popHead: { alignItems: 'center', display: 'flex', gap: 8, justifyContent: 'space-between' },
  kv: { color: colors['--oniva-color-text-muted'], display: 'grid', fontSize: font['--oniva-font-size-12'], gap: 2, gridTemplateColumns: 'auto 1fr', columnGap: 10, margin: 0 },
  kvv: { color: colors['--oniva-color-text'], margin: 0, fontVariantNumeric: 'tabular-nums' },
  popBtns: { display: 'flex', gap: 6 },
  count: { color: colors['--oniva-color-text-muted'], fontVariantNumeric: 'tabular-nums', minWidth: 20, textAlign: 'center' },
});

export interface AgentQueueProps {
  /** Waiting, running and recently finished jobs. */
  jobs: QueueJob[];
  /** The slots; their number is the concurrency. */
  workers: QueueWorker[];
  /** Clock on the same scale as job times. Without it the queue ticks Date.now. */
  now?: number;
  /** Stretches when the provider rate-limits: running jobs pause in amber with a countdown. */
  rateLimits?: QueueRateLimit[];
  paused?: boolean;
  /** Shows a Pause / Resume button. */
  onPausedChange?: (paused: boolean) => void;
  /** Shows a stepper for the number of workers. */
  onConcurrencyChange?: (workers: number) => void;
  minConcurrency?: number;
  maxConcurrency?: number;
  /** A depth that means trouble: a dashed line on the chart; above it Waiting turns amber. */
  backpressure?: number;
  /** How far back the depth chart looks, in ms. Default 2 minutes. */
  window?: number;
  /** Counts since the start, when `jobs` only holds the recent ones. */
  totals?: { done?: number; failed?: number };
  openId?: string | null;
  defaultOpenId?: string | null;
  onOpenChange?: (id: string | null, job?: QueueJob) => void;
  /** Shows "Move to front" in a pinned card. */
  onPromote?: (job: QueueJob) => void;
  /** Shows "Cancel" in a pinned card. */
  onCancel?: (job: QueueJob) => void;
  title?: string;
  /** The queue's name, muted next to the title. */
  name?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const prio = { high: 0, normal: 1, low: 2 } as const;

/** Live job queue: waiting jobs flow into worker slots, land in Done or Failed, and a depth chart shows backlog. */
export function AgentQueue({
  jobs,
  workers,
  now,
  rateLimits = [],
  paused = false,
  onPausedChange,
  onConcurrencyChange,
  minConcurrency = 1,
  maxConcurrency = 8,
  backpressure,
  window: win = 120_000,
  totals,
  openId,
  defaultOpenId = null,
  onOpenChange,
  onPromote,
  onCancel,
  title = 'Queue',
  name,
  className,
  xstyle,
  ref,
}: AgentQueueProps) {
  const f = useFormatters();
  const rootRef = useRef<HTMLDivElement>(null);
  const w = useWidth(rootRef);
  const narrow = w > 0 && w < 600;
  const t = useNow(now, jobs.some((j) => j.status === 'running' || j.status === 'queued'), 500);
  const [open, setOpen] = useControlled<string | null>(openId, defaultOpenId, undefined);
  const [msg, say] = useAnnouncer();
  const [rove, setRove] = useState<string | null>(null);
  const refs = useRef(new Map<string, HTMLButtonElement>());
  useFlip(rootRef);
  const finRef = useRef<HTMLElement>(null);
  const memo = useRef({ status: new Map<string, QueueStatus>(), rect: new Map<string, DOMRect>() });
  // Finished jobs fly into Done (green) or Failed (shake, red) from the slot they ran in.
  useLayoutEffect(() => {
    const m = memo.current;
    const root = rootRef.current;
    const fin = finRef.current;
    for (const j of jobs) {
      if (m.status.get(j.id) === 'running' && (j.status === 'done' || j.status === 'failed') && root && fin) {
        const from = m.rect.get(j.id);
        const ok = j.status === 'done';
        if (from)
          flyGhost(root, {
            from,
            to: fin.getBoundingClientRect(),
            text: j.name,
            background: ok ? 'var(--oniva-color-success-bg)' : 'var(--oniva-color-danger-bg)',
            color: ok ? 'var(--oniva-color-success-fg)' : 'var(--oniva-color-danger-fg)',
            shake: !ok,
          });
      }
    }
    m.status = new Map(jobs.map((j) => [j.id, j.status]));
    m.rect = new Map();
    refs.current.forEach((el, id) => m.rect.set(id, el.getBoundingClientRect()));
  });
  // A high-priority job lands at the back first, then glides past the others.
  const known = useRef<Set<string> | null>(null);
  const [arriving, setArriving] = useState<Set<string>>(new Set());
  useEffect(() => {
    const ids = new Set(jobs.map((j) => j.id));
    if (known.current) {
      const fresh = jobs.filter((j) => !known.current!.has(j.id) && j.status === 'queued' && j.priority === 'high').map((j) => j.id);
      if (fresh.length) {
        setArriving((a) => new Set([...a, ...fresh]));
        const id = window.setTimeout(() => setArriving((a) => new Set([...a].filter((x) => !fresh.includes(x)))), 420);
        known.current = ids;
        return () => window.clearTimeout(id);
      }
    }
    known.current = ids;
  }, [jobs]);

  const queued = useMemo(
    () => {
      const p = (j: QueueJob) => (arriving.has(j.id) ? 3 : prio[j.priority ?? 'normal']);
      return jobs.filter((j) => j.status === 'queued').sort((a, b) => p(a) - p(b) || a.enqueuedAt - b.enqueuedAt);
    },
    [jobs, arriving],
  );
  const running = jobs.filter((j) => j.status === 'running');
  const done = totals?.done ?? jobs.filter((j) => j.status === 'done').length;
  const failed = totals?.failed ?? jobs.filter((j) => j.status === 'failed').length;
  const limit = rateLimits.find((r) => t >= r.from && t < r.until);
  const isPaused = paused || !!limit;
  const over = backpressure != null && queued.length > backpressure;

  // Keyboard order: running jobs by slot, then the queue from the front.
  const order = useMemo(() => {
    const slots = workers.map((wk) => running.find((j) => j.worker === wk.id)).filter((j): j is QueueJob => !!j);
    return [...slots, ...running.filter((j) => !slots.includes(j)), ...queued].map((j) => j.id);
  }, [workers, running, queued]);
  const tabId = rove && order.includes(rove) ? rove : order[0];

  const focusId = (id: string | undefined) => {
    if (!id) return;
    setRove(id);
    refs.current.get(id)?.focus();
  };
  const onKey = (e: React.KeyboardEvent, id: string) => {
    const i = order.indexOf(id);
    const k = e.key;
    if (k === 'ArrowDown' || k === 'ArrowRight') focusId(order[Math.min(order.length - 1, i + 1)]);
    else if (k === 'ArrowUp' || k === 'ArrowLeft') focusId(order[Math.max(0, i - 1)]);
    else if (k === 'Home') focusId(order[0]);
    else if (k === 'End') focusId(order[order.length - 1]);
    else return;
    e.preventDefault();
  };

  // Announce rate limits and failures.
  const prevLimit = useRef(false);
  const prevFailed = useRef<Set<string> | null>(null);
  useEffect(() => {
    if (!!limit !== prevLimit.current) {
      prevLimit.current = !!limit;
      say(limit ? `Rate limited${limit.label ? `: ${limit.label}` : ''}. Workers paused.` : 'Rate limit ended. Workers resumed.');
    }
    const ids = new Set(jobs.filter((j) => j.status === 'failed').map((j) => j.id));
    if (prevFailed.current) for (const id of ids) if (!prevFailed.current.has(id)) say(`Failed: ${jobs.find((j) => j.id === id)?.name}`);
    prevFailed.current = ids;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!limit, jobs]);
  const crossed = useRef(false);
  useEffect(() => {
    if (over !== crossed.current) {
      crossed.current = over;
      say(over ? `Backlog above ${backpressure}.` : 'Backlog back under the limit.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [over]);

  // Depth chart.
  const N = 48;
  const depthAt = (ts: number) => jobs.filter((j) => j.enqueuedAt <= ts && (j.startedAt != null ? j.startedAt > ts : j.status === 'queued' || (j.endedAt != null && j.endedAt > ts))).length;
  const series = Array.from({ length: N + 1 }, (_, i) => depthAt(t - win + (win * i) / N));
  const peak = Math.max(...series);
  const avg = series.reduce((a, b) => a + b, 0) / series.length;
  const yMaxTarget = Math.max(peak, backpressure ?? 0, 4);
  const yMax = useEase(yMaxTarget, 6);
  const px = (i: number) => (i / N) * 100;
  const py = (v: number) => 34 - (v / yMax) * 32;
  const line = series.map((v, i) => `${i ? 'L' : 'M'} ${px(i)} ${py(v)}`).join(' ');
  const xOf = (ms: number) => Math.min(100, Math.max(0, ((ms - (t - win)) / win) * 100));

  const pinned = open ? jobs.find((j) => j.id === open) : undefined;
  const pinOpen = (j: QueueJob | null) => {
    setOpen(j?.id ?? null);
    onOpenChange?.(j?.id ?? null, j ?? undefined);
  };

  const jobEl = (j: QueueJob, extra?: { progress?: number }) => {
    const state = j.status === 'failed' ? styles.failedJob : j.status === 'running' && isPaused ? styles.paused : styles[j.kind];
    const waited = formatDuration(((j.startedAt ?? t) - j.enqueuedAt));
    const ran = j.startedAt != null ? formatDuration((j.endedAt ?? t) - j.startedAt) : null;
    const pos = queued.indexOf(j) + 1;
    const label = `${j.name}, ${KIND[j.kind].label.toLowerCase()}, ${j.status === 'queued' ? `waiting ${waited}, place ${pos} in line` : j.status === 'running' ? `running ${ran}${isPaused ? ', paused' : ''}` : j.status}${j.priority === 'high' ? ', high priority' : ''}${(j.attempt ?? 1) > 1 ? `, attempt ${j.attempt}` : ''}`;
    return (
      <button
        key={j.id}
        type="button"
        ref={(el) => { if (el) refs.current.set(j.id, el); else refs.current.delete(j.id); }}
        data-flip-id={j.id}
        data-status={j.status}
        tabIndex={j.id === tabId ? 0 : -1}
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open === j.id}
        onFocus={() => setRove(j.id)}
        onKeyDown={(e) => onKey(e, j.id)}
        onClick={() => pinOpen(open === j.id ? null : j)}
        {...stylex.props(styles.job, state, focus.inset)}
      >
        {j.status === 'running' && !isPaused && <span aria-hidden="true" {...stylex.props(w1.sheen)} />}
        {extra?.progress != null && (
          <span aria-hidden="true" style={{ ['--p' as string]: extra.progress }} {...stylex.props(styles.bar)} />
        )}
        {j.icon && <span aria-hidden="true" {...stylex.props(styles.jobIcon)}>{j.icon}</span>}
        <span {...stylex.props(styles.jobText, w1.ellipsis)}>{j.name}</span>
        {j.priority === 'high' && <span aria-hidden="true" {...stylex.props(styles.jobMeta)}>High</span>}
        {(j.attempt ?? 1) > 1 && (
          <span aria-hidden="true" {...stylex.props(styles.jobMeta)}>
            <RotateCw size={10} /> {j.attempt}
          </span>
        )}
        <span aria-hidden="true" {...stylex.props(styles.jobMeta)}>
          {j.status === 'queued' ? waited : j.status === 'running' && isPaused && limit ? `Paused ${formatDuration(limit.until - t)}` : ran}
        </span>
      </button>
    );
  };

  const progressOf = (j: QueueJob) => (j.progress != null ? j.progress : j.estimate && j.startedAt != null ? Math.min(0.97, (t - j.startedAt) / j.estimate) : 0.4);

  return (
    <div
      {...mergeSx(stylex.props(w1.root, styles.root, xstyle), className)}
      ref={(el) => { rootRef.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el; }}
    >
      <div {...stylex.props(styles.head)}>
        <span aria-hidden="true" {...stylex.props(styles.headIcon)}><Rows3 size={16} /></span>
        <h3 {...stylex.props(w1.title)}>
          {title} {name && <span {...stylex.props(styles.name)}>{name}</span>}
        </h3>
        <span {...stylex.props(w1.grow)} />
        {limit && <Tag tone="warning">Rate limited{limit.label ? `: ${limit.label}` : ''}</Tag>}
        {onConcurrencyChange && (
          <span role="group" aria-label="Workers" {...stylex.props(styles.step)}>
            <Button aria-label="Fewer workers" isDisabled={workers.length <= minConcurrency} onPress={() => onConcurrencyChange(workers.length - 1)} className={() => sxClass(stylex.props(styles.btn, focus.ring))}>
              <Minus size={13} aria-hidden="true" />
            </Button>
            <span aria-live="polite" {...stylex.props(styles.count)}>{workers.length}</span>
            <Button aria-label="More workers" isDisabled={workers.length >= maxConcurrency} onPress={() => onConcurrencyChange(workers.length + 1)} className={() => sxClass(stylex.props(styles.btn, focus.ring))}>
              <Plus size={13} aria-hidden="true" />
            </Button>
          </span>
        )}
        {onPausedChange && (
          <ToggleButton isSelected={paused} onChange={onPausedChange} className={() => sxClass(stylex.props(styles.btn, focus.ring))}>
            {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
            {paused ? 'Resume' : 'Pause'}
          </ToggleButton>
        )}
      </div>
      <div {...stylex.props(styles.stats, styles.divider, narrow && styles.statsNarrow)}>
        <div {...stylex.props(styles.stat)}>
          <span {...stylex.props(styles.statValue, over && styles.warn)}><AnimatedNumber value={queued.length} /></span>
          <span {...stylex.props(w1.label)}>Waiting</span>
        </div>
        <div {...stylex.props(styles.stat)}>
          <span {...stylex.props(styles.statValue)}>{f.number(running.length)}<span {...stylex.props(styles.statUnit)}>/{f.number(workers.length)}</span></span>
          <span {...stylex.props(w1.label)}>Running</span>
        </div>
        <div {...stylex.props(styles.stat)}>
          <span {...stylex.props(styles.statValue)}><AnimatedNumber value={done} /></span>
          <span {...stylex.props(w1.label)}>Done</span>
        </div>
        <div {...stylex.props(styles.stat)}>
          <span {...stylex.props(styles.statValue)}><AnimatedNumber value={failed} /></span>
          <span {...stylex.props(w1.label)}>Failed</span>
        </div>
      </div>
      <div {...stylex.props(styles.body, styles.divider, narrow && styles.bodyNarrow)}>
        <section aria-label="Waiting" {...stylex.props(styles.panel)}>
          <span {...stylex.props(styles.secHead)}><span {...stylex.props(w1.label)}>Queue</span><span {...stylex.props(styles.secCount)}>{f.number(queued.length)}</span></span>
          <ul {...stylex.props(styles.rail)}>
            {queued.length === 0 && <li {...stylex.props(styles.idle)}>Nothing waiting.</li>}
            {queued.slice(0, 8).map((j) => <li key={j.id} {...stylex.props(w1.rise)}>{jobEl(j)}</li>)}
          </ul>
          {queued.length > 8 && <span {...stylex.props(w1.muted, w1.num)}>+{f.number(queued.length - 8)} more</span>}
        </section>
        <section aria-label="Workers" {...stylex.props(styles.panel)}>
          <span {...stylex.props(styles.secHead)}><span {...stylex.props(w1.label)}>Workers</span><span {...stylex.props(styles.secCount)}>{f.number(running.length)}/{f.number(workers.length)}</span></span>
          <ul {...stylex.props(styles.rail)}>
            {workers.map((wk) => {
              const job = running.find((j) => j.worker === wk.id);
              return (
                <li key={wk.id} {...stylex.props(styles.workerRow)}>
                  <span {...stylex.props(styles.workerName)}>
                    {wk.icon ?? <AgentAvatar name={wk.name} size={20} />}
                    <span {...stylex.props(w1.ellipsis)}>{wk.name}</span>
                  </span>
                  {job ? jobEl(job, { progress: progressOf(job) }) : <span {...stylex.props(styles.idle)}>Free</span>}
                </li>
              );
            })}
          </ul>
        </section>
        <section ref={finRef} aria-label="Finished" {...stylex.props(styles.finStack)}>
          <div {...stylex.props(styles.finCard)}>
            <span {...stylex.props(styles.finHead)}><span aria-hidden="true" {...stylex.props(styles.finChip, styles.finOk)}><Check size={13} /></span><span {...stylex.props(w1.label)}>Done</span></span>
            <span {...stylex.props(styles.big)}>{f.number(done)}</span>
          </div>
          <div {...stylex.props(styles.finCard)}>
            <span {...stylex.props(styles.finHead)}><span aria-hidden="true" {...stylex.props(styles.finChip, styles.finBad)}><X size={13} /></span><span {...stylex.props(w1.label)}>Failed</span></span>
            <span {...stylex.props(styles.big, failed > 0 && styles.warn)}>{f.number(failed)}</span>
          </div>
        </section>
      </div>
      <div {...stylex.props(styles.chart, styles.divider)}>
        <span {...stylex.props(w1.label)}>Queue depth, last {formatDuration(win)}</span>
        <svg role="img" viewBox="0 0 100 36" preserveAspectRatio="none" aria-label={`Queue depth: ${queued.length} waiting now, peak ${peak}, average ${f.number(avg, { maximumFractionDigits: 1 })}${rateLimits.length ? `, ${rateLimits.length} rate-limited stretches` : ''}`} {...stylex.props(styles.svg)}>
          {rateLimits.map((r, i) => (
            <rect key={i} x={xOf(r.from)} y={0} width={Math.max(0, xOf(r.until) - xOf(r.from))} height={36} {...stylex.props(styles.limitBand)} />
          ))}
          <g {...stylex.props(styles.draw)}>
            <path d={`${line} L 100 36 L 0 36 Z`} {...stylex.props(styles.area)} />
            <path d={line} vectorEffect="non-scaling-stroke" {...stylex.props(styles.line)} />
          </g>
          {backpressure != null && <line x1={0} x2={100} y1={py(backpressure)} y2={py(backpressure)} vectorEffect="non-scaling-stroke" {...stylex.props(styles.limitLine)} />}
        </svg>
      </div>
      <Popover isOpen={!!pinned} onOpenChange={(o) => { if (!o) pinOpen(null); }} triggerRef={{ current: pinned ? refs.current.get(pinned.id) ?? null : null }} placement="bottom start">
        <Dialog aria-label={pinned ? `${pinned.name} details` : 'Job details'} className={sxClass(stylex.props(w1.popover))}>
          {pinned && (
            <div {...stylex.props(styles.pop)}>
              <div {...stylex.props(styles.popHead)}>
                <strong>{pinned.name}</strong>
                <Button aria-label="Close" onPress={() => pinOpen(null)} className={() => sxClass(stylex.props(w1.iconBtn, focus.ring))}>
                  <X size={14} aria-hidden="true" />
                </Button>
              </div>
              <dl {...stylex.props(styles.kv)}>
                <dt>Kind</dt><dd {...stylex.props(styles.kvv)}>{KIND[pinned.kind].label}</dd>
                <dt>Status</dt><dd {...stylex.props(styles.kvv)}>{pinned.status}</dd>
                <dt>Waited</dt><dd {...stylex.props(styles.kvv)}>{formatDuration((pinned.startedAt ?? t) - pinned.enqueuedAt)}</dd>
                {pinned.startedAt != null && <><dt>Ran</dt><dd {...stylex.props(styles.kvv)}>{formatDuration((pinned.endedAt ?? t) - pinned.startedAt)}</dd></>}
                {pinned.attempt != null && <><dt>Attempt</dt><dd {...stylex.props(styles.kvv)}>{pinned.attempt}{pinned.maxAttempts ? ` of ${pinned.maxAttempts}` : ''}</dd></>}
              </dl>
              {(pinned.error ?? pinned.detail) && <span {...stylex.props(w1.muted)}>{pinned.error ?? pinned.detail}</span>}
              {pinned.status === 'queued' && (onPromote || onCancel) && (
                <div {...stylex.props(styles.popBtns)}>
                  {onPromote && <Button onPress={() => { onPromote(pinned); pinOpen(null); }} className={() => sxClass(stylex.props(styles.btn, focus.ring))}><ArrowUpToLine size={13} aria-hidden="true" />Move to front</Button>}
                  {onCancel && <Button onPress={() => { onCancel(pinned); pinOpen(null); }} className={() => sxClass(stylex.props(styles.btn, focus.ring))}>Cancel</Button>}
                </div>
              )}
            </div>
          )}
        </Dialog>
      </Popover>
      <LiveRegion message={msg} />
    </div>
  );
}
