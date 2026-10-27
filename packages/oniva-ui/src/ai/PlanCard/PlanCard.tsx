import * as stylex from '@stylexjs/stylex';
import { ArrowDown, ArrowUp, Check, CircleAlert, ListChecks, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState, type HTMLAttributes, type KeyboardEvent, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { useFormatters } from '../../internal/format';
import { useListFlip, useFoldingList, useFoldMount } from '../../internal/w2-flip';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { enterExit } from '../../internal/motion-styles';
import { mergeSx } from '../../internal/sx';
import { formatDuration, useAnnouncer, useNow, w2s } from '../../internal/w2-parts';
import { VisuallyHidden } from '../../components/VisuallyHidden';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Spinner } from '../../components/Spinner';

const drawIcon = stylex.keyframes({ from: { strokeDashoffset: 24 }, to: { strokeDashoffset: 0 } });
const fadeUp = stylex.keyframes({ from: { opacity: 0, transform: 'translateY(6px)' }, to: { opacity: 1, transform: 'translateY(0)' } });

const styles = stylex.create({
  draw: {
    animationDelay: '60ms',
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: { default: drawIcon, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    strokeDasharray: 24,
  },
  fresh: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: fadeUp, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  fold: {
    display: 'grid',
    gridTemplateRows: { default: '1fr', '[data-gone]': '0fr' },
    opacity: { default: 1, '[data-gone]': 0 },
    transitionDuration: motion['--oniva-motion-dur-height'],
    transitionProperty: 'grid-template-rows, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  foldInner: { minHeight: 0, overflow: { default: 'visible', '[data-gone]': 'hidden' } },
  seg: {
    backgroundColor: colors['--oniva-color-success-solid'],
    borderRadius: radius['--oniva-radius-full'],
    height: '100%',
    transformOrigin: 'left center',
    transform: { default: 'scaleX(0)', '[data-fill="1"]': 'scaleX(1)', '[data-fill="half"]': 'scaleX(0.5)' },
    transitionDuration: motion['--oniva-motion-dur-deliberate'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  segTrack: { backgroundColor: colors['--oniva-color-chart-track'], borderRadius: radius['--oniva-radius-full'], flexBasis: 0, flexGrow: 1, height: 3, overflow: 'hidden' },
  progress: { display: 'flex', gap: 3, marginBlockStart: -4 },
  eyebrow: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'flex', flexGrow: 1, fontSize: font['--oniva-font-size-12'], gap: 6 },
  headStack: { alignItems: 'stretch', flexDirection: 'column', gap: 4 },
  tlTitle: { fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-medium'] },
  tlRoot: { gap: 14 },
  tlItem: { position: 'relative' },
  tlLine: { backgroundColor: colors['--oniva-color-border'], bottom: -6, insetInlineStart: 14, position: 'absolute', top: 28, width: 1 },
  tlDetailRow: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8 },
  tlFoot: { borderTopColor: colors['--oniva-color-border'], borderTopStyle: 'solid', borderTopWidth: 1, marginBlockEnd: -14, marginInline: -14, paddingBlock: 12, paddingInline: 14 },
  swap: { alignItems: 'center', display: 'inline-flex', gap: 8 },
  root: { display: 'flex', flexDirection: 'column', gap: 12, padding: 14 },
  head: { alignItems: 'center', color: colors['--oniva-color-text'], display: 'flex', gap: 8 },
  title: { flexGrow: 1, fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-semibold'], margin: 0 },
  estimate: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'] },
  list: { display: 'flex', flexDirection: 'column', listStyle: 'none', marginBlockEnd: -8, marginBlockStart: 0, marginInline: 0, padding: 0 },
  itemPad: { marginInline: 0, paddingBlockEnd: 8, paddingInline: 0 },
  item: {
    alignItems: 'flex-start',
    borderRadius: radius['--oniva-radius-md'],
    display: 'grid',
    gap: 10,
    gridTemplateColumns: '22px minmax(0, 1fr) auto',
    marginInline: -4,
    outlineStyle: 'none',
    paddingBlock: 2,
    paddingInline: 4,
  },
  itemLi: { borderRadius: radius['--oniva-radius-md'], marginInline: -4, outlineStyle: 'none', paddingInline: 4 },
  itemFocus: { boxShadow: { default: 'none', ':focus-visible': `0 0 0 2px ${colors['--oniva-color-focus-ring']}` } },
  num: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-accent-soft'],
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-accent-soft-fg'],
    display: 'flex',
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-semibold'],
    height: 22,
    justifyContent: 'center',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'background-color, color, box-shadow',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: 22,
  },
  numRing: { boxShadow: `inset 0 0 0 1px ${colors['--oniva-color-border-control']}` },
  numDone: { backgroundColor: colors['--oniva-color-surface-inset'], color: colors['--oniva-color-success-fg'] },
  numFailed: { backgroundColor: colors['--oniva-color-danger-bg'], color: colors['--oniva-color-danger-fg'] },
  numActive: { backgroundColor: 'transparent' },
  stepTitle: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-medium'], lineHeight: font['--oniva-font-lh-18'] },
  stepPending: { color: colors['--oniva-color-text-muted'] },
  detail: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], lineHeight: font['--oniva-font-lh-16'], margin: 0 },
  err: { color: colors['--oniva-color-danger-fg'], fontSize: font['--oniva-font-size-12'], lineHeight: font['--oniva-font-lh-16'], margin: 0 },
  time: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums', paddingBlockStart: 2 },
  tool: { marginInlineStart: 6 },
  tools: { alignItems: 'center', display: 'flex', gap: 2 },
  add: { alignItems: 'center', display: 'flex', gap: 8 },
  foot: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8 },
  runState: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], fontVariantNumeric: 'tabular-nums' },
  approved: { alignItems: 'center', color: colors['--oniva-color-success-fg'], display: 'inline-flex', fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-medium'], gap: 6 },
});

export type PlanStepStatus = 'pending' | 'active' | 'done' | 'failed';

export interface PlanStep {
  id: string;
  title: string;
  detail?: string;
  /** Tool the step uses, shown as a chip. */
  tool?: string;
  /** Run state, set while the plan runs. */
  status?: PlanStepStatus;
  /** Milliseconds. Leave out to have it measured from when the step turned active. */
  duration?: number;
  error?: string;
}

export interface PlanCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children' | 'title' | 'onChange'> {
  title?: string;
  steps: PlanStep[];
  /** Review and edit (default), executing, or finished. Step state is read from `steps` while running. */
  status?: 'draft' | 'running' | 'done';
  /** Short estimate shown in review, e.g. "~2 min". */
  estimate?: string;
  /** Called with the (possibly edited) steps when the plan is approved. */
  onApprove?: (steps: PlanStep[]) => void;
  /** "Run plan" pressed: gets the steps in their final order. Replaces Approve plan and its label. */
  onRun?: (steps: PlanStep[]) => void;
  onCancel?: () => void;
  /** Shows "Retry from here" under failed steps. */
  onRetry?: (stepId: string) => void;
  /** Called when edits are saved and on every reorder, removal or addition. */
  onChange?: (steps: PlanStep[]) => void;
  /** `timeline`: eyebrow + title header, connector line between steps, detail and tool on one line, footer status row. */
  layout?: 'default' | 'timeline';
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

function Marker({ step, index }: { step: PlanStep; index: number }) {
  const s = step.status ?? 'pending';
  const lead = { 'data-state': 'entering' as const };
  if (s === 'active') return <span {...lead} {...stylex.props(styles.num, styles.numActive, enterExit.blur)}><Spinner size="xs" label="Running" /></span>;
  if (s === 'done') return <span {...lead} {...stylex.props(styles.num, styles.numDone, enterExit.blur)}><Check size={13} aria-label="Done" {...stylex.props(styles.draw)} /></span>;
  if (s === 'failed') return <span {...lead} {...stylex.props(styles.num, styles.numFailed, enterExit.blur)}><CircleAlert size={13} aria-label="Failed" /></span>;
  return <span aria-hidden="true" {...stylex.props(styles.num, styles.numRing)}>{index + 1}</span>;
}

function StepTime({ step, nowMs, since }: { step: PlanStep; nowMs: number; since: number | undefined }) {
  if (step.duration !== undefined) return <span {...stylex.props(styles.time)}>{formatDuration(step.duration)}</span>;
  if (step.status === 'active' && since !== undefined) return <span {...stylex.props(styles.time)}>{formatDuration(Math.max(0, nowMs - since), true)}</span>;
  return null;
}

/** Proposed multi-step plan. Rename, reorder (buttons or Alt+arrows), remove and add steps, run it, then watch live step timers and retry from a failed step. */
export function PlanCard({ title = 'Proposed plan', steps, status = 'draft', estimate, onApprove, onRun, onCancel, onRetry, onChange, layout = 'default', className, xstyle, ref, ...rest }: PlanCardProps) {
  const f = useFormatters();
  const [local, setLocal] = useState(steps);
  const [editing, setEditing] = useState(false);
  const [approved, setApproved] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const { message, announce } = useAnnouncer();
  const draft = status === 'draft';
  const items = draft ? local : steps;
  const nextId = useRef(1);
  const itemEls = useRef(new Map<string, HTMLLIElement>());

  // Back to draft (e.g. a failed run reset): start from the steps the parent passes.
  const prevStatus = useRef(status);
  useEffect(() => {
    if (prevStatus.current !== 'draft' && status === 'draft') setLocal(steps);
    prevStatus.current = status;
  }, [status, steps]);

  // Track when each step turned active, for the live timers.
  const activeSince = useRef(new Map<string, number>());
  const running = items.some((s) => s.status === 'active');
  const now = useNow(running, 100);
  for (const s of items) {
    if (s.status === 'active' && !activeSince.current.has(s.id)) activeSince.current.set(s.id, Date.now());
    if (s.status !== 'active') activeSince.current.delete(s.id);
  }
  const runStart = useRef<number | undefined>(undefined);
  if (status === 'running' && runStart.current === undefined) runStart.current = Date.now();
  if (status === 'draft') runStart.current = undefined;
  const [doneIn, setDoneIn] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (status === 'done' && runStart.current !== undefined) setDoneIn(Date.now() - runStart.current);
    if (status === 'draft') setDoneIn(undefined);
  }, [status]);

  const commit = (next: PlanStep[], say?: string) => {
    setLocal(next);
    onChange?.(next);
    if (say) announce(say);
  };
  const move = (i: number, delta: number) => {
    const j = i + delta;
    if (j < 0 || j >= local.length) return;
    const next = [...local];
    [next[i], next[j]] = [next[j]!, next[i]!];
    commit(next, `Moved "${local[i]!.title}" to position ${j + 1} of ${local.length}`);
    const id = local[i]!.id;
    requestAnimationFrame(() => itemEls.current.get(id)?.focus());
  };
  const remove = (i: number) => {
    const gone = local[i]!;
    commit(local.filter((_, k) => k !== i), `Removed "${gone.title}"`);
    const neighbour = local[i + 1] ?? local[i - 1];
    if (neighbour) requestAnimationFrame(() => itemEls.current.get(neighbour.id)?.focus());
  };
  const add = () => {
    const t = draftTitle.trim();
    if (!t) return;
    commit([...local, { id: `new-${nextId.current++}`, title: t }], `Added "${t}"`);
    setDraftTitle('');
  };
  const onItemKey = (e: KeyboardEvent<HTMLLIElement>, i: number) => {
    if (e.target !== e.currentTarget) return;
    if (e.altKey && e.key === 'ArrowUp') {
      e.preventDefault();
      move(i, -1);
    }
    else if (e.altKey && e.key === 'ArrowDown') {
      e.preventDefault();
      move(i, 1);
    }
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      itemEls.current.get(local[i + 1]?.id ?? '')?.focus();
    }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      itemEls.current.get(local[i - 1]?.id ?? '')?.focus();
    }
    else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      remove(i);
    }
    else if (e.key === 'Enter') {
      e.preventDefault();
      setEditing(true);
    }
  };

  const listRef = useRef<HTMLOListElement | null>(null);
  const skipFlip = useRef(false);
  useListFlip(listRef, skipFlip);
  const rows = useFoldingList(items, 300, () => {
    skipFlip.current = true;
  });
  const addRow = useFoldMount(editing && draft);
  // Steps that arrived after the first render fade up into place.
  const knownIds = useRef<Set<string> | null>(null);
  const [fresh, setFresh] = useState<string[]>([]);
  useEffect(() => {
    const ids = items.map((x) => x.id);
    if (knownIds.current) {
      const add = ids.filter((id) => !knownIds.current!.has(id));
      if (add.length) {
        setFresh((f) => [...f, ...add]);
        const t = window.setTimeout(() => setFresh((f) => f.filter((id) => !add.includes(id))), 500);
        knownIds.current = new Set(ids);
        return () => window.clearTimeout(t);
      }
    }
    knownIds.current = new Set(ids);
  }, [items]);
  const doneCount = items.filter((s) => s.status === 'done').length;
  const tl = layout === 'timeline';
  const sx = stylex.props(aiStyles.panel, styles.root, tl && styles.tlRoot, xstyle);
  const total = items.reduce((n, s) => n + (s.duration ?? (s.status === 'active' ? 0 : 0)), 0);

  return (
    <section {...rest} ref={ref} aria-label={title} {...mergeSx(sx, className)}>
      {tl ? (
        <div {...stylex.props(styles.head, styles.headStack)}>
          <span {...stylex.props(styles.eyebrow)}>
            <ListChecks size={14} aria-hidden="true" />
            Plan · {f.number(items.length)} {items.length === 1 ? 'step' : 'steps'}
            {draft && estimate && <span {...stylex.props(styles.estimate)}>· {estimate}</span>}
          </span>
          <h4 {...stylex.props(styles.title, styles.tlTitle)}>{title}</h4>
        </div>
      ) : (
        <div {...stylex.props(styles.head)}>
          <ListChecks size={16} aria-hidden="true" />
          <h4 {...stylex.props(styles.title)}>{title}</h4>
          {draft && estimate && <span {...stylex.props(styles.estimate)}>{estimate}</span>}
        </div>
      )}
      {!draft && !tl && (
        <div aria-hidden="true" {...stylex.props(styles.progress)}>
          {items.map((x) => (
            <span key={x.id} {...stylex.props(styles.segTrack)}>
              <span data-fill={x.status === 'done' ? '1' : x.status === 'active' ? 'half' : '0'} {...stylex.props(styles.seg)} />
            </span>
          ))}
        </div>
      )}
      <ol ref={listRef} {...stylex.props(styles.list)}>
        {rows.map(({ item: s, gone }) => {
          const i = items.findIndex((x) => x.id === s.id);
          return (
          <li
            key={s.id}
            data-flip-id={s.id}
            ref={(el) => {
              if (el) itemEls.current.set(s.id, el);
              else itemEls.current.delete(s.id);
            }}
            tabIndex={draft && !editing && !gone ? 0 : undefined}
            aria-current={s.status === 'active' ? 'step' : undefined}
            aria-keyshortcuts={draft && !editing ? 'Alt+ArrowUp Alt+ArrowDown Delete' : undefined}
            onKeyDown={draft && !editing ? (e) => onItemKey(e, i) : undefined}
            data-gone={gone ? '' : undefined}
            aria-hidden={gone || undefined}
            {...stylex.props(styles.fold, styles.itemLi, fresh.includes(s.id) && styles.fresh, draft && !editing && styles.itemFocus)}
          >
            <div data-gone={gone ? '' : undefined} {...stylex.props(styles.foldInner)}>
            <div {...stylex.props(styles.item, styles.itemPad, tl && styles.tlItem)}>
            {tl && i < items.length - 1 && <span aria-hidden="true" {...stylex.props(styles.tlLine)} />}
            <Marker key={s.status ?? 'pending'} step={s} index={i} />
            <div>
              {editing && draft ? (
                <Input
                  size="sm"
                  aria-label={`Step ${i + 1}`}
                  value={s.title}
                  onChange={(v) => setLocal((prev) => prev.map((p) => (p.id === s.id ? { ...p, title: v } : p)))}
                />
              ) : (
                <span {...stylex.props(styles.stepTitle, !draft && (s.status ?? 'pending') === 'pending' && styles.stepPending)}>
                  {s.title}
                  {s.tool && !tl && <span {...stylex.props(w2s.tag, w2s.tagNeutral, w2s.mono, styles.tool)}>{s.tool}</span>}
                </span>
              )}
              {tl && !editing && (s.detail || s.tool) ? (
                <p {...stylex.props(styles.detail, styles.tlDetailRow)}>
                  {s.detail}
                  {s.tool && <span {...stylex.props(w2s.tag, w2s.tagNeutral, w2s.mono)}>{s.tool}</span>}
                </p>
              ) : (
                s.detail && !editing && <p {...stylex.props(styles.detail)}>{s.detail}</p>
              )}
              {s.status === 'failed' && (
                <>
                  <p {...stylex.props(styles.err)}>{s.error ?? 'This step failed.'}</p>
                  {onRetry && (
                    <Button size="xs" variant="secondary" onPress={() => onRetry(s.id)}>
                      <RotateCcw size={12} aria-hidden="true" /> Retry from here
                    </Button>
                  )}
                </>
              )}
            </div>
            {editing && draft ? (
              <span {...stylex.props(styles.tools)}>
                <Button size="xs" variant="ghost" isIconOnly aria-label={`Move step ${i + 1} up`} isDisabled={i === 0} onPress={() => move(i, -1)}><ArrowUp size={12} aria-hidden="true" /></Button>
                <Button size="xs" variant="ghost" isIconOnly aria-label={`Move step ${i + 1} down`} isDisabled={i === items.length - 1} onPress={() => move(i, 1)}><ArrowDown size={12} aria-hidden="true" /></Button>
                <Button size="xs" variant="ghost" isIconOnly aria-label={`Remove step ${i + 1}`} onPress={() => remove(i)}><Trash2 size={12} aria-hidden="true" /></Button>
              </span>
            ) : (
              !draft && <StepTime step={s} nowMs={now} since={activeSince.current.get(s.id)} />
            )}
            </div>
            </div>
          </li>
        );
        })}
      </ol>
      {addRow.mounted && (
        <AnimatedHeight isOpen={addRow.shown}>
          <div {...stylex.props(styles.add)}>
            <Input size="sm" aria-label="Add a step" placeholder="Add a step" value={draftTitle} onChange={setDraftTitle} onKeyDown={(e) => e.key === 'Enter' && add()} />
            <Button size="sm" variant="secondary" isDisabled={!draftTitle.trim()} onPress={add}><Plus size={14} aria-hidden="true" /> Add</Button>
          </div>
        </AnimatedHeight>
      )}
      <div {...stylex.props(styles.foot, tl && styles.tlFoot)}>
        <span key={status === 'draft' ? (approved ? 'approved' : editing ? 'edit' : 'draft') : status} data-state="entering" {...stylex.props(styles.swap, enterExit.blur)}>
        {status === 'running' ? (
          <>
            <span {...stylex.props(styles.runState)}>
              Running · {f.number(doneCount)} of {f.number(items.length)}{runStart.current ? ` · ${formatDuration(Math.max(0, now - runStart.current), true)}` : ''}
            </span>
            {onCancel && <Button size="sm" variant="ghost" onPress={onCancel}>Cancel</Button>}
          </>
        ) : status === 'done' ? (
          <span role="status" data-state="entering" {...stylex.props(styles.approved, enterExit.blur)}>
            <Check size={14} aria-hidden="true" /> {doneIn !== undefined ? `Done in ${formatDuration(doneIn)}` : total ? `Done in ${formatDuration(total)}` : 'Done'}
          </span>
        ) : approved ? (
          <span role="status" data-state="entering" {...stylex.props(styles.approved, enterExit.blur)}>
            <Check size={14} aria-hidden="true" /> Plan approved
          </span>
        ) : editing ? (
          <Button size="sm" onPress={() => { setEditing(false); onChange?.(local); }}>Save changes</Button>
        ) : (
          <>
            <Button
              size="sm"
              onPress={() => {
                if (onRun) onRun(local);
                else {
                  setApproved(true);
                  onApprove?.(local);
                }
              }}
            >
              {onRun ? 'Run plan' : 'Approve plan'}
            </Button>
            <Button size="sm" variant="secondary" onPress={() => setEditing(true)}>
              <Pencil size={14} aria-hidden="true" /> Edit
            </Button>
            {onCancel && <Button size="sm" variant="ghost" onPress={onCancel}>Cancel</Button>}
          </>
        )}
        </span>
      </div>
      <VisuallyHidden>
        <span aria-live="polite">{message}</span>
      </VisuallyHidden>
    </section>
  );
}
