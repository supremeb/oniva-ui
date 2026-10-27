import * as stylex from '@stylexjs/stylex';
import { ArrowUp, Check, CornerDownLeft, Command, Loader2, Pause, Play, Sparkles, X, Zap } from 'lucide-react';
import { useEffect, useId, useRef, type Ref } from 'react';
import { Button, TextArea, TextField } from 'react-aria-components';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { focus } from '../../internal/focus';
import { mergeSx, sxClass } from '../../internal/sx';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { Shimmer } from '../../motion/Shimmer';
import { useGlide, useLeaving } from '../../internal/w1-r2-motion';
import { LiveRegion, Tag, formatDuration, useAnnouncer, useControlled, useNow, w1 } from '../../internal/w1-agent-ui';

export type SteerStatus = 'running' | 'paused' | 'done';
export interface SteerNote {
  id: string;
  text: string;
  /** Set once the agent took the note in. */
  picked?: 'next' | 'now';
}
export interface SteerStep {
  id: string;
  title: string;
  status?: 'done' | 'active' | 'pending';
  /** Finished steps: how long it took, e.g. `12s`. */
  duration?: string;
  /** Epoch ms when it became active. */
  startedAt?: number;
  notes?: SteerNote[];
}

const checkPop = stylex.keyframes({ from: { opacity: 0, transform: 'scale(0.5)' }, to: { opacity: 1, transform: 'scale(1)' } });
const checkAnim = stylex.create({ pop: { animationDuration: motion['--oniva-motion-dur-slow'], animationFillMode: 'backwards', animationName: checkPop, animationTimingFunction: motion['--oniva-motion-ease-spring'], display: 'inline-flex' } });
const leave = stylex.keyframes({ from: { opacity: 1, transform: 'none' }, to: { opacity: 0, transform: 'translateX(8px)' } });

const styles = stylex.create({
  root: { containerType: 'inline-size', gap: 0, maxWidth: 520, overflow: 'hidden', padding: 0 },
  head: { alignItems: 'center', display: 'flex', gap: 10, padding: 14 },
  headIcon: { color: colors['--oniva-color-accent-text'], display: 'inline-flex', flexShrink: 0 },
  running: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'inline-flex', fontSize: font['--oniva-font-size-13'], gap: 6 },
  dot: { backgroundColor: colors['--oniva-color-accent-text'], borderRadius: radius['--oniva-radius-full'], display: 'inline-block', height: 8, width: 8 },
  section: { borderTopColor: colors['--oniva-color-border'], borderTopStyle: 'solid', borderTopWidth: 1, display: 'flex', flexDirection: 'column', gap: 8, padding: 14 },
  secLabel: { alignItems: 'center', display: 'flex', gap: 6 },
  chip: { backgroundColor: colors['--oniva-color-surface-tertiary'], borderRadius: radius['--oniva-radius-sm'], color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-11'], fontVariantNumeric: 'tabular-nums', paddingBlock: 1, paddingInline: 6 },
  keys: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'flex', flexWrap: 'wrap', fontSize: font['--oniva-font-size-12'], gap: 12 },
  keyGroup: { alignItems: 'center', display: 'inline-flex', gap: 4 },
  kbd: { alignItems: 'center', borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-sm'], borderStyle: 'solid', borderWidth: 1, display: 'inline-flex', height: 18, justifyContent: 'center', minWidth: 18, paddingInline: 3 },
  nowBtn: { color: colors['--oniva-color-text'], gap: 4 },
  agent: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'] },
  steps: { borderTopColor: colors['--oniva-color-border'], borderTopStyle: 'solid', borderTopWidth: 1, display: 'flex', flexDirection: 'column', gap: 2, paddingBlock: 8, paddingInline: 14 },
  step: { display: 'flex', flexDirection: 'column', gap: 4, paddingBlock: 6 },
  stepRow: { alignItems: 'center', display: 'flex', gap: 8, minHeight: 24 },
  mark: { alignItems: 'center', borderRadius: radius['--oniva-radius-full'], display: 'inline-flex', flexShrink: 0, height: 18, justifyContent: 'center', width: 18 },
  markDone: { backgroundColor: accent['--oniva-accent-solid'], color: colors['--oniva-color-accent-fg'] },
  markActive: { color: colors['--oniva-color-accent-text'] },
  markPending: { borderColor: colors['--oniva-color-border-control'], borderStyle: 'dashed', borderWidth: 1, boxSizing: 'border-box' },
  mutedText: { color: colors['--oniva-color-text-muted'] },
  time: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], marginInlineStart: 'auto' },
  notes: { display: 'flex', flexDirection: 'column', gap: 4, marginInlineStart: 26 },
  note: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-accent-soft'],
    borderRadius: radius['--oniva-radius-md'],
    color: colors['--oniva-color-accent-soft-fg'],
    display: 'flex',
    gap: 6,
    minHeight: 28,
    paddingBlock: 4,
    paddingInline: 8,
  },
  queue: { display: 'flex', flexDirection: 'column', gap: 4, margin: 0, padding: 0 },
  leaving: {
    animationDuration: motion['--oniva-motion-dur-base'],
    animationFillMode: 'forwards',
    animationName: { default: leave, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    pointerEvents: 'none',
  },
  queued: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    borderInlineStartColor: colors['--oniva-color-accent-text'],
    borderInlineStartWidth: 2,
    display: 'flex',
    gap: 6,
    minHeight: 36,
    paddingInline: 8,
  },
  noteText: { flexGrow: 1, minWidth: 0, overflowWrap: 'anywhere' },
  small: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: radius['--oniva-radius-sm'],
    borderWidth: 0,
    color: 'inherit',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 3,
    height: { default: 24, '@media (pointer: coarse)': 32 },
    minWidth: 24,
    paddingInline: 4,
  },
  field: {
    alignItems: 'flex-end',
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: { default: colors['--oniva-color-border-control'], ':focus-within': colors['--oniva-color-border-active'] },
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    display: 'flex',
    gap: 6,
    paddingBlock: 6,
    paddingInline: 8,
  },
  textarea: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    flexGrow: 1,
    font: 'inherit',
    maxHeight: 120,
    minHeight: 22,
    outlineStyle: 'none',
    padding: 0,
    resize: 'none',
    width: '100%',
  },
  send: {
    alignItems: 'center',
    backgroundColor: { default: accent['--oniva-accent-solid'], ':disabled': colors['--oniva-color-disabled-from'] },
    borderRadius: radius['--oniva-radius-full'],
    borderWidth: 0,
    color: { default: colors['--oniva-color-accent-fg'], ':disabled': colors['--oniva-color-disabled-fg'] },
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    display: 'inline-flex',
    flexShrink: 0,
    height: { default: 28, '@media (pointer: coarse)': 36 },
    justifyContent: 'center',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, color',
    width: { default: 28, '@media (pointer: coarse)': 36 },
  },
  hint: { borderWidth: 0, clip: 'rect(0,0,0,0)', height: 1, margin: -1, overflow: 'hidden', padding: 0, position: 'absolute', whiteSpace: 'nowrap', width: 1 },
});

export interface AgentSteeringProps {
  /** What the agent is working on. */
  title: string;
  /** Agent or model name under the title. */
  agent?: string;
  steps: SteerStep[];
  /** Notes waiting for the next step. */
  queue?: SteerNote[];
  status?: SteerStatus;
  /** Run start (epoch ms or Date); the header clock ticks from here. */
  startedAt?: number | Date;
  /** Enter in the field. */
  onQueue?: (text: string) => void;
  /** Mod+Enter in the field, or "Now" on a queued note. */
  onInterrupt?: (text: string, queuedId?: string) => void;
  onRemove?: (id: string) => void;
  onPause?: () => void;
  onResume?: () => void;
  draft?: string;
  onDraftChange?: (text: string) => void;
  placeholder?: string;
  /** Clock override (epoch ms). */
  now?: number;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Steer a running agent: queue a note for the next step, or interrupt right away. */
export function AgentSteering({
  title,
  agent,
  steps,
  queue = [],
  status = 'running',
  startedAt,
  onQueue,
  onInterrupt,
  onRemove,
  onPause,
  onResume,
  draft,
  onDraftChange,
  placeholder = 'Steer the agent…',
  now,
  className,
  xstyle,
  ref,
}: AgentSteeringProps) {
  const [text, setText] = useControlled<string>(draft, '', onDraftChange);
  const [msg, say] = useAnnouncer();
  const hintId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const t = useNow(now, status === 'running');
  useGlide(rootRef, { duration: 620, enter: true, flash: 'color-mix(in srgb, var(--oniva-color-accent-text) 28%, transparent)' });
  const noteIds = new Set(steps.flatMap((x) => (x.notes ?? []).map((n) => n.id)));
  const shownQueue = useLeaving(queue, 220, noteIds);
  const stepNo = Math.max(0, steps.findIndex((x) => x.status === 'active') + 1);
  const start = startedAt instanceof Date ? startedAt.getTime() : startedAt;

  // Announce notes the agent picks up (not the ones present on first render).
  const seen = useRef<Set<string> | null>(null);
  const pickedKey = steps.flatMap((s) => s.notes ?? []).filter((n) => n.picked).map((n) => `${n.id}\u0000${n.text}`).join('\u0001');
  useEffect(() => {
    const picked = pickedKey ? pickedKey.split('\u0001').map((p) => p.split('\u0000') as [string, string]) : [];
    if (seen.current === null) {
      seen.current = new Set(picked.map(([id]) => id));
      return;
    }
    for (const [id, txt] of picked) {
      if (!seen.current.has(id)) {
        seen.current.add(id);
        say(`The agent picked up: ${txt}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickedKey]);

  const canQueue = text.trim().length > 0 && status !== 'done';
  const submit = (immediate: boolean) => {
    const v = text.trim();
    if (!v || status === 'done') return;
    if (immediate && onInterrupt) {
      onInterrupt(v);
      say('Interrupting the agent with your note.');
    } else if (onQueue) {
      onQueue(v);
      say('Note queued for the next step.');
    } else return;
    setText('');
  };

  return (
    <div
      {...mergeSx(stylex.props(w1.root, styles.root, xstyle), className)}
      ref={(el) => {
        rootRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) ref.current = el;
      }}
    >
      <div {...stylex.props(styles.head)}>
        <span aria-hidden="true" {...stylex.props(styles.headIcon)}><Sparkles size={16} /></span>
        <div {...stylex.props(w1.grow)}>
          <h3 {...stylex.props(w1.title)}>{title}</h3>
          {(agent || stepNo > 0) && (
            <div {...stylex.props(styles.agent)}>
              {agent}
              {agent && stepNo > 0 && ' \u00b7 '}
              {stepNo > 0 && `Step ${stepNo} of ${steps.length}`}
            </div>
          )}
        </div>
        {status === 'running' && (
          <span {...stylex.props(styles.running, w1.num)}>
            <span aria-hidden="true" {...stylex.props(styles.dot)} />
            Running{start != null && ` \u00b7 ${formatDuration(t - start)}`}
          </span>
        )}
        {status !== 'running' && start != null && <span {...stylex.props(w1.muted, w1.num)}>{formatDuration(t - start)}</span>}
        {status === 'paused' && <Tag tone="warning">Paused</Tag>}
        {status === 'done' && <Tag tone="success">Done</Tag>}
        {status === 'running' && onPause && (
          <Button onPress={onPause} className={() => sxClass(stylex.props(w1.iconBtn, focus.ring))} aria-label="Pause">
            <Pause size={14} aria-hidden="true" />
          </Button>
        )}
        {status === 'paused' && onResume && (
          <Button onPress={onResume} className={() => sxClass(stylex.props(w1.iconBtn, focus.ring))} aria-label="Resume">
            <Play size={14} aria-hidden="true" />
          </Button>
        )}
      </div>
      <ol aria-label="Plan" {...stylex.props(w1.list, styles.steps)}>
        {steps.map((s) => {
          const st = s.status ?? 'pending';
          return (
            <li key={s.id} aria-current={st === 'active' ? 'step' : undefined} {...stylex.props(styles.step)}>
              <div {...stylex.props(styles.stepRow)}>
                <span aria-hidden="true" {...stylex.props(styles.mark, st === 'done' && styles.markDone, st === 'active' && styles.markActive, st === 'pending' && styles.markPending)}>
                  {st === 'done' && <span {...stylex.props(checkAnim.pop)}><Check size={11} /></span>}
                  {st === 'active' && <Loader2 size={14} {...stylex.props(status === 'running' && w1.spin)} />}
                </span>
                <span {...stylex.props(st === 'pending' && styles.mutedText)}>{st === 'active' && status === 'running' ? <Shimmer>{s.title}</Shimmer> : s.title}</span>
                <span {...stylex.props(w1.srOnly)}>{st === 'done' ? ', done' : st === 'active' ? ', in progress' : ', pending'}</span>
                {st === 'done' && s.duration && <span {...stylex.props(styles.time, w1.num)}>{s.duration}</span>}
                {st === 'active' && s.startedAt != null && <span {...stylex.props(styles.time, w1.num)}>{formatDuration(t - s.startedAt)}</span>}
              </div>
              <AnimatedHeight isOpen={!!s.notes && s.notes.length > 0}>
                <ul {...stylex.props(w1.list, styles.notes)}>
                  {(s.notes ?? []).map((n) => (
                    <li key={n.id} data-flip-id={n.id} data-glide-land="" data-glide-flash={n.picked === 'now' ? '' : undefined} data-glide-enter="" {...stylex.props(styles.note)}>
                      <Zap size={12} aria-hidden="true" />
                      <span {...stylex.props(styles.noteText)}>{n.text}</span>
                      <span {...stylex.props(w1.num)}>{n.picked === 'now' ? 'Applied now' : 'Next step'}</span>
                    </li>
                  ))}
                </ul>
              </AnimatedHeight>
            </li>
          );
        })}
      </ol>
      <AnimatedHeight isOpen={queue.length > 0}>
        <div {...stylex.props(styles.section)}>
        <div {...stylex.props(styles.secLabel)}>
          <span {...stylex.props(w1.label)}>Queued for the next step</span>
          <span {...stylex.props(styles.chip)}>{queue.length}</span>
        </div>
        <ul aria-label="Queued notes" {...stylex.props(w1.list, styles.queue)}>
          {shownQueue.map(({ item: n, leaving }) => (
            <li key={n.id} data-flip-id={leaving ? undefined : n.id} data-glide-enter="" aria-hidden={leaving || undefined} {...stylex.props(styles.queued, !leaving && w1.rise, leaving && styles.leaving)}>
              <span {...stylex.props(styles.noteText)}>{n.text}</span>
              {onInterrupt && status !== 'done' && !leaving && (
                <Button
                  onPress={() => {
                    onInterrupt(n.text, n.id);
                    say('Interrupting with a queued note.');
                  }}
                  className={() => sxClass(stylex.props(styles.small, styles.nowBtn, focus.ring))}
                >
                  <Zap size={12} aria-hidden="true" />
                  Now
                </Button>
              )}
              {onRemove && !leaving && (
                <Button aria-label={`Remove “${n.text}”`} onPress={() => onRemove(n.id)} className={() => sxClass(stylex.props(styles.small, focus.ring))}>
                  <X size={13} aria-hidden="true" />
                </Button>
              )}
            </li>
          ))}
        </ul>
        </div>
      </AnimatedHeight>
      {status !== 'done' && (
        <div {...stylex.props(styles.section)}>
          <TextField aria-label="Steer the agent" aria-describedby={hintId} value={text} onChange={setText}>
            <div {...stylex.props(styles.field)}>
              <TextArea
                rows={1}
                placeholder={placeholder}
                className={() => sxClass(stylex.props(styles.textarea))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    submit(e.metaKey || e.ctrlKey);
                  } else if (e.key === 'Escape') setText('');
                }}
              />
              <Button aria-label="Queue for the next step" isDisabled={!canQueue} onPress={() => submit(false)} className={() => sxClass(stylex.props(styles.send, focus.ring))}>
                <ArrowUp size={14} aria-hidden="true" />
              </Button>
            </div>
          </TextField>
          <p id={hintId} {...stylex.props(styles.hint)}>
            Enter queues for the next step{onInterrupt ? ', ⌘/Ctrl Enter applies it now' : ''}. Shift Enter adds a line.
          </p>
          <div aria-hidden="true" {...stylex.props(styles.keys)}>
            <span {...stylex.props(styles.keyGroup)}><kbd {...stylex.props(styles.kbd)}><CornerDownLeft size={11} /></kbd> next step</span>
            {onInterrupt && <span {...stylex.props(styles.keyGroup)}><kbd {...stylex.props(styles.kbd)}><Command size={11} /></kbd><kbd {...stylex.props(styles.kbd)}><CornerDownLeft size={11} /></kbd> interrupt now</span>}
          </div>
        </div>
      )}
      <LiveRegion message={msg} />
    </div>
  );
}
