import * as stylex from '@stylexjs/stylex';
import { Check, RotateCcw, Split, X } from 'lucide-react';
import { useId, useLayoutEffect, useRef, useState, type ReactNode, type Ref } from 'react';
import { Button, ToggleButton } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { focus } from '../../internal/focus';
import { prefersReducedMotion } from '../../internal/motion-hooks';
import { useFormatters } from '../../internal/format';
import { mergeSx, sxClass } from '../../internal/sx';
import { LiveRegion, formatDuration, useAnnouncer, w1 } from '../../internal/w1-agent-ui';
import { VisuallyHidden } from '../../components/VisuallyHidden';

export type FanoutStatus = 'queued' | 'running' | 'retrying' | 'done' | 'failed';
export interface FanoutTask {
  id: string;
  label: string;
  status: FanoutStatus;
  worker?: string;
  /** Milliseconds from the start of the job. */
  start?: number;
  end?: number;
  cost?: number;
  attempts?: number;
  result?: string;
  error?: string;
}

const ORDER: FanoutStatus[] = ['queued', 'running', 'retrying', 'done', 'failed'];
const LABEL: Record<FanoutStatus, string> = { queued: 'Queued', running: 'Running', retrying: 'Retrying', done: 'Done', failed: 'Failed' };

const SW = { queued: 'swQueued', running: 'swRunning', retrying: 'swRetrying', done: 'swDone', failed: 'swFailed' } as const;
const wave = stylex.keyframes({ from: { opacity: 0, transform: 'scale(0.6)' }, to: { opacity: 1, transform: 'scale(1)' } });
const waveFade = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const breathe = stylex.keyframes({ '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.45 } });
const markIn = stylex.keyframes({ from: { opacity: 0, transform: 'scale(0.4)' }, to: { opacity: 1, transform: 'scale(1)' } });
const detailIn = stylex.keyframes({ from: { opacity: 0, transform: 'scale(0.97)' }, to: { opacity: 1, transform: 'scale(1)' } });
const runPulse = stylex.keyframes({ '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.8 } });
const sweep = stylex.keyframes({ from: { transform: 'translateX(-120%)' }, to: { transform: 'translateX(120%)' } });

const styles = stylex.create({
  root: { containerType: 'inline-size' },
  job: { color: colors['--oniva-color-text-muted'], fontWeight: font['--oniva-font-weight-regular'] },
  headIcon: { color: colors['--oniva-color-info-fg'], display: 'inline-flex', flexShrink: 0 },
  stats: { alignItems: 'baseline', color: colors['--oniva-color-text-muted'], display: 'flex', flexWrap: 'wrap', fontSize: font['--oniva-font-size-13'], fontVariantNumeric: 'tabular-nums', gap: 14, justifyContent: 'flex-end' },
  statStrong: { color: colors['--oniva-color-text'], fontWeight: font['--oniva-font-weight-medium'] },
  progress: { backgroundColor: colors['--oniva-color-chart-track'], height: 2, overflow: 'hidden', width: '100%' },
  fill: { backgroundColor: colors['--oniva-color-success-solid'], borderRadius: radius['--oniva-radius-full'], height: '100%', transformOrigin: 'left center', transform: 'scaleX(var(--p))', transitionDuration: motion['--oniva-motion-dur-slower'], transitionProperty: 'transform', transitionTimingFunction: motion['--oniva-motion-ease-out'], width: '100%' },
  grid: { display: 'flex', flexWrap: 'wrap', gap: { default: 6, '@container (max-width: 520px)': 4 }, padding: 10 },
  cell: {
    appearance: 'none',
    borderRadius: radius['--oniva-radius-xs'],
    borderWidth: 0,
    cursor: 'pointer',
    height: { default: 16, '@container (max-width: 520px)': 12 },
    margin: 0,
    overflow: 'hidden',
    animationDelay: 'calc(var(--i, 0) * 14ms)',
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationFillMode: 'backwards',
    animationName: { default: wave, [media.reducedMotion]: waveFade },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    padding: 0,
    position: 'relative',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'opacity, background-color, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: { default: 16, '@container (max-width: 520px)': 12 },
  },
  queued: { backgroundColor: colors['--oniva-color-surface-tertiary-hover'] },
  running: { backgroundColor: colors['--oniva-color-info-solid'] },
  mark: { alignItems: 'center', animationDuration: motion['--oniva-motion-dur-slow'], animationFillMode: 'backwards', animationName: { default: markIn, [media.reducedMotion]: 'none' }, animationTimingFunction: motion['--oniva-motion-ease-spring'], display: 'flex', inset: 0, justifyContent: 'center', position: 'absolute' },
  detail: { animationDuration: motion['--oniva-motion-dur-enter'], animationFillMode: 'backwards', animationName: { default: detailIn, [media.reducedMotion]: 'none' }, animationTimingFunction: motion['--oniva-motion-ease-out'], transformOrigin: 'top left' },
  runBeat: { animationDuration: '1.8s', animationIterationCount: 'infinite', animationName: { default: runPulse, [media.reducedMotion]: 'none' } },
  retrying: { animationDuration: '1.4s', animationIterationCount: 'infinite', animationName: { default: breathe, [media.reducedMotion]: 'none' }, backgroundColor: colors['--oniva-color-warning-solid'] },
  done: { backgroundColor: colors['--oniva-color-success-solid'], color: colors['--oniva-color-success-on-solid'] },
  failed: { backgroundColor: colors['--oniva-color-danger-solid'], color: colors['--oniva-color-danger-on-solid'] },
  shine: { animationDuration: '1.6s', animationIterationCount: 'infinite', animationName: { default: sweep, [media.reducedMotion]: 'none' }, backgroundImage: 'linear-gradient(90deg, transparent, color-mix(in srgb, white 55%, transparent), transparent)', inset: 0, position: 'absolute' },
  dim: { opacity: 0.18 },
  ringed: { outlineColor: colors['--oniva-color-text'], outlineOffset: 1, outlineStyle: 'solid', outlineWidth: 2 },
  tray: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 14, paddingBlock: 2, paddingInline: 10 },
  chip: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors['--oniva-color-text-muted'],
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-13'],
    fontVariantNumeric: 'tabular-nums',
    gap: 6,
    height: { default: 24, '@media (pointer: coarse)': 32 },
    opacity: { default: 1, '[data-selected]': 1 },
    padding: 0,
    textDecorationLine: { default: 'none', '[data-selected]': 'underline' },
  },
  chipCount: { color: colors['--oniva-color-text'], fontWeight: font['--oniva-font-weight-medium'] },
  swatch: { borderRadius: radius['--oniva-radius-xs'], flexShrink: 0, height: 8, width: 8 },
  swQueued: { backgroundColor: colors['--oniva-color-surface-tertiary-hover'] },
  swRunning: { backgroundColor: colors['--oniva-color-info-solid'] },
  swRetrying: { backgroundColor: colors['--oniva-color-warning-solid'] },
  swDone: { backgroundColor: colors['--oniva-color-success-solid'] },
  swFailed: { backgroundColor: colors['--oniva-color-danger-solid'] },
  details: { paddingBlock: 6, paddingInline: 10 },
  dTitle: { fontWeight: font['--oniva-font-weight-medium'] },
  dRow: { color: colors['--oniva-color-text-muted'], display: 'flex', flexWrap: 'wrap', fontSize: font['--oniva-font-size-12'], gap: 10, marginBlockStart: 4 },
  retry: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-danger-bg'],
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: colors['--oniva-color-danger-fg'],
    cursor: 'pointer',
    display: 'inline-flex',
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 5,
    height: 28,
    paddingInline: 10,
  },
});

export interface FanOutGridProps {
  tasks: FanoutTask[];
  /** What the whole job does, e.g. "Enrich 240 leads". */
  job?: string;
  /** How many workers run at once; defaults to the tasks running now. */
  workers?: number;
  /** Milliseconds from the start of the job. */
  now?: number;
  /** Shows "Retry failed" while tasks have failed. */
  onRetry?: (ids: string[]) => void;
  /** A task was pinned (click or Enter); `null` when released. */
  onSelect?: (task: FanoutTask | null) => void;
  formatCost?: (amount: number) => string;
  title?: string;
  /** Small mark before the title. */
  icon?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** A live grid with one cell per task of a fanned-out job: progress, cost, retries and details on focus. */
export function FanOutGrid({
  tasks,
  job,
  workers,
  now = 0,
  onRetry,
  onSelect,
  formatCost,
  title = 'Fan-out',
  icon,
  className,
  xstyle,
  ref,
}: FanOutGridProps) {
  const f = useFormatters();
  const detailId = useId();
  const gridRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [filter, setFilter] = useState<FanoutStatus | null>(null);
  const [msg, say] = useAnnouncer();
  const lastStep = useRef(0);
  const prevStatus = useRef<Map<string, FanoutStatus> | null>(null);
  // A cell that changes state pops once (done), shakes (failed) or settles (running).
  useLayoutEffect(() => {
    const el = gridRef.current;
    const before = prevStatus.current;
    prevStatus.current = new Map(tasks.map((x) => [x.id, x.status]));
    if (!el || !before || prefersReducedMotion()) return;
    el.querySelectorAll<HTMLElement>('[data-task]').forEach((c) => {
      const id = c.dataset.task!;
      const was = before.get(id);
      const now2 = c.dataset.status as FanoutStatus;
      if (was === undefined || was === now2 || typeof c.animate !== 'function') return;
      const ease = 'cubic-bezier(0.34, 1.45, 0.64, 1)';
      if (now2 === 'done') c.animate([{ transform: 'scale(0.7)' }, { transform: 'scale(1.25)', offset: 0.55 }, { transform: 'scale(1)' }], { duration: 320, easing: ease });
      else if (now2 === 'failed')
        c.animate(
          [{ transform: 'translateX(0)' }, { transform: 'translateX(-3px)', offset: 0.15 }, { transform: 'translateX(3px)', offset: 0.35 }, { transform: 'translateX(-2px)', offset: 0.55 }, { transform: 'translateX(1px)', offset: 0.75 }, { transform: 'translateX(0)' }],
          { duration: 360, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
        );
      else if (now2 === 'running') c.animate([{ transform: 'scale(0.8)' }, { transform: 'scale(1)' }], { duration: 220, easing: ease });
    });
  });
  const cost = formatCost ?? ((n: number) => f.currency(n, 'USD', { minimumFractionDigits: 2 }));

  const counts = Object.fromEntries(ORDER.map((s) => [s, 0])) as Record<FanoutStatus, number>;
  let spent = 0;
  const finished: number[] = [];
  for (const t of tasks) {
    counts[t.status]++;
    spent += t.cost ?? 0;
    if (t.status === 'done' && t.start != null && t.end != null) finished.push(t.end - t.start);
  }
  const total = tasks.length;
  const settled = counts.done + counts.failed;
  const ratio = total ? settled / total : 0;
  const slots = workers ?? Math.max(1, counts.running + counts.retrying);
  const remaining = total - settled;
  const left = finished.length >= 3 && remaining > 0 ? (finished.reduce((a, b) => a + b, 0) / finished.length) * Math.ceil(remaining / slots) : null;

  const step = Math.floor(ratio * 10);
  if (step !== lastStep.current) {
    lastStep.current = step;
    queueMicrotask(() => say(ratio >= 1 ? `Finished: ${counts.done} done, ${counts.failed} failed.` : `${f.percent(step / 10)} complete.`));
  }

  const current = tasks.find((t) => t.id === (pinned ?? active)) ?? null;
  const tab = pinned ?? active ?? tasks[0]?.id;

  const move = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const cells = [...(gridRef.current?.querySelectorAll<HTMLButtonElement>('button[data-cell]') ?? [])];
    const i = cells.findIndex((c) => c === document.activeElement);
    if (i < 0) return;
    const top = cells[0]?.offsetTop ?? 0;
    const cols = Math.max(1, cells.filter((c) => c.offsetTop === top).length);
    let n: number;
    if (e.key === 'ArrowRight') n = i + 1;
    else if (e.key === 'ArrowLeft') n = i - 1;
    else if (e.key === 'ArrowDown') n = i + cols;
    else if (e.key === 'ArrowUp') n = i - cols;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = cells.length - 1;
    else if (e.key === 'Escape') {
      if (pinned) {
        setPinned(null);
        onSelect?.(null);
      }
      return;
    } else return;
    e.preventDefault();
    cells[Math.min(cells.length - 1, Math.max(0, n))]?.focus();
  };

  const toggle = (t: FanoutTask) => {
    const next = pinned === t.id ? null : t.id;
    setPinned(next);
    onSelect?.(next ? t : null);
  };

  return (
    <div {...mergeSx(stylex.props(w1.root, styles.root, xstyle), className)} ref={ref}>
      <div {...stylex.props(w1.bar)}>
        {icon ?? <span aria-hidden="true" {...stylex.props(styles.headIcon)}><Split size={16} /></span>}
        <h3 {...stylex.props(w1.title)}>
          {title} {job && <span {...stylex.props(styles.job)}>{job}</span>}
        </h3>
        <span {...stylex.props(w1.grow)} />
        {onRetry && counts.failed > 0 && (
          <Button onPress={() => onRetry(tasks.filter((t) => t.status === 'failed').map((t) => t.id))} className={() => sxClass(stylex.props(styles.retry, focus.ring))}>
            <RotateCcw size={13} aria-hidden="true" />
            Retry failed
          </Button>
        )}
        <div {...stylex.props(styles.stats)}>
          <span {...stylex.props(styles.statStrong)}>{f.number(settled)} / {f.number(total)}</span>
          <span {...stylex.props(styles.statStrong)}>{cost(spent)}</span>
          <span>{left != null ? `~${formatDuration(left)} left` : 'Time left -'}</span>
        </div>
      </div>
      <VisuallyHidden>
        <div role="progressbar" aria-label={`${title} progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(ratio * 100)} {...stylex.props(styles.progress)}>
          <div style={{ ['--p' as string]: ratio }} {...stylex.props(styles.fill)} />
        </div>
      </VisuallyHidden>
      <div {...stylex.props(w1.tile)}>
        <div
          ref={gridRef}
          role="group"
          aria-label={`${title} tasks`}
          onKeyDown={move}
          {...stylex.props(styles.grid)}
        >
          {tasks.map((t, i) => {
            const dim = filter != null && t.status !== filter;
            return (
              <button
                key={t.id}
                type="button"
                data-cell=""
                data-task={t.id}
                data-status={t.status}
                style={{ ['--i' as string]: Math.min(i, 80) }}
                tabIndex={t.id === tab ? 0 : -1}
                aria-label={`${t.label}, ${LABEL[t.status].toLowerCase()}`}
                aria-describedby={current?.id === t.id ? detailId : undefined}
                aria-pressed={pinned === t.id}
                onFocus={() => setActive(t.id)}
                onMouseEnter={() => setActive(t.id)}
                onClick={() => toggle(t)}
                {...stylex.props(styles.cell, styles[t.status], t.status === 'running' && styles.runBeat, dim && styles.dim, pinned === t.id && styles.ringed, focus.ring)}
              >
                {(t.status === 'done' || t.status === 'failed') && (
                  <span key={t.status} aria-hidden="true" {...stylex.props(styles.mark)}>
                    {t.status === 'done' ? <Check size={11} strokeWidth={3} /> : <X size={11} strokeWidth={3} />}
                  </span>
                )}
                {t.status === 'running' && (
                  <span aria-hidden="true" style={{ animationDelay: `${(i % 7) * 180}ms` }} {...stylex.props(styles.shine)} />
                )}
              </button>
            );
          })}
        </div>
      <div {...stylex.props(styles.details)} id={detailId} aria-live="off">
        {current ? (
          <div key={current.id} {...stylex.props(styles.detail)}>
            <div {...stylex.props(styles.dTitle)}>{current.label}</div>
            <div {...stylex.props(styles.dRow, w1.num)}>
              <span>{LABEL[current.status]}</span>
              {current.worker && <span>{current.worker}</span>}
              {current.start != null && <span>{formatDuration((current.end ?? now) - current.start)}</span>}
              {(current.attempts ?? 1) >= 2 && <span>{current.attempts} attempts</span>}
              {current.cost != null && <span>{cost(current.cost)}</span>}
            </div>
            {(current.error ?? current.result) && <div {...stylex.props(w1.muted)}>{current.status === 'failed' ? current.error : current.result}</div>}
          </div>
        ) : null}
      </div>
      <div role="group" aria-label="Filter by state" {...stylex.props(styles.tray)}>
        {ORDER.map((s) => (
          <ToggleButton
            key={s}
            isSelected={filter === s}
            onChange={(sel) => setFilter(sel ? s : null)}
            className={() => sxClass(stylex.props(styles.chip, focus.ring))}
          >
            <span aria-hidden="true" {...stylex.props(styles.swatch, styles[SW[s]])} />
            <span {...stylex.props(styles.chipCount)}>{f.number(counts[s])}</span> {LABEL[s]}
          </ToggleButton>
        ))}
      </div>
      </div>
      <LiveRegion message={msg} />
    </div>
  );
}
