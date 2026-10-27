import * as stylex from '@stylexjs/stylex';
import {
  Check,
  CircleDashed,
  Database,
  FileText,
  Loader2,
  Mail,
  Minus,
  PanelRight,
  Search,
  ShieldAlert,
  Square,
  X,
  XCircle,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { ToolCallCard, type ToolCallStatus } from '../../ai/ToolCallCard';
import { Badge, type BadgeVariant } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Kbd } from '../../components/Kbd';
import { ProgressBar } from '../../components/ProgressBar';
import { pluralize } from '../../internal/format';
import { ReviewDiff } from '../../internal/s3-diff';
import { s3, ScreenShell, type ScreenUser } from '../../internal/s3-shell';
import { m8, step as stepVar } from '../../internal/m8-motion';
import { Presence } from '../../motion/Presence';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { CrossFade } from '../../motion/CrossFade';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import {
  defaultRunDraft,
  defaultRunSteps,
  type RunDraft,
  type RunStep,
  type RunStepStatus,
} from './AgentRun.data';

const WIDE = '@container (min-width: 1000px)';
const TICK_MS = 1000;

const spin = stylex.keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

const styles = stylex.create({
  layout: {
    alignItems: 'start',
    display: 'grid',
    gap: 16,
    gridTemplateColumns: { default: 'minmax(0, 1fr)', [WIDE]: 'minmax(0, 1fr) 340px' },
  },
  main: { display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 },
  goal: { display: 'flex', flexDirection: 'column', gap: 10 },
  goalText: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    margin: 0,
  },
  steps: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  step: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: '28px minmax(0, 1fr)',
    paddingBlock: 10,
    position: 'relative',
  },
  rail: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  line: {
    backgroundColor: colors['--oniva-color-border'],
    flexGrow: 1,
    minHeight: 8,
    overflow: 'hidden',
    position: 'relative',
    width: 2,
    // The connector fills downward when its step finishes (scaleY from the top, never height).
    '::after': {
      backgroundColor: colors['--oniva-color-success-solid'],
      content: '""',
      inset: 0,
      position: 'absolute',
      transform: 'scaleY(0)',
      transformOrigin: 'top',
      transitionDuration: motion['--oniva-motion-dur-slower'],
      transitionProperty: 'transform',
      transitionTimingFunction: motion['--oniva-motion-ease-out-expo'],
    },
  },
  lineDone: { '::after': { transform: 'scaleY(1)' } },
  icon: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-full'],
    boxSizing: 'border-box',
    display: 'inline-flex',
    flexShrink: 0,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  iconPending: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    color: colors['--oniva-color-icon-muted'],
  },
  iconRunning: {
    backgroundColor: colors['--oniva-color-accent-soft'],
    color: colors['--oniva-color-accent-soft-fg'],
  },
  iconWaiting: {
    backgroundColor: colors['--oniva-color-warning-bg'],
    color: colors['--oniva-color-warning-fg'],
  },
  iconDone: {
    backgroundColor: colors['--oniva-color-success-solid'],
    color: colors['--oniva-color-success-on-solid'],
  },
  iconDenied: {
    backgroundColor: colors['--oniva-color-danger-bg'],
    color: colors['--oniva-color-danger-fg'],
  },
  spinning: {
    animationDuration: '900ms',
    animationIterationCount: 'infinite',
    animationName: { default: spin, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'linear',
  },
  body: { display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 },
  stepHead: { alignItems: 'baseline', display: 'flex', flexWrap: 'wrap', gap: 8, rowGap: 0 },
  stepTitle: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-20'],
    margin: 0,
  },
  stepTitleMuted: { color: colors['--oniva-color-text-muted'] },
  calls: { display: 'flex', flexDirection: 'column', gap: 6 },
  approval: {
    backgroundColor: colors['--oniva-color-warning-bg'],
    borderColor: colors['--oniva-color-warning-halo'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: 12,
  },
  approvalTitle: {
    alignItems: 'center',
    color: colors['--oniva-color-text'],
    display: 'flex',
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-semibold'],
    gap: 8,
    margin: 0,
  },
  approvalText: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-13'],
    margin: 0,
  },
  details: {
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    flexDirection: 'column',
    fontSize: font['--oniva-font-size-12'],
    gap: 2,
    margin: 0,
    paddingInlineStart: 18,
  },
  actions: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8 },
  hint: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-12'],
    gap: 4,
  },
  panel: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: { default: shadow['--oniva-elevation-overlay'], [WIDE]: 'none' },
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    insetBlock: { default: 8, [WIDE]: 'auto' },
    insetInlineEnd: { default: 8, [WIDE]: 'auto' },
    overflowY: 'auto',
    padding: 16,
    position: { default: 'fixed', [WIDE]: 'sticky' },
    top: { default: 8, [WIDE]: 0 },
    transform: { default: 'translateX(0)', [WIDE]: 'none' },
    transitionDuration: motion['--oniva-motion-dur-sheet'],
    transitionProperty: 'transform, visibility',
    transitionTimingFunction: motion['--oniva-motion-ease-drawer'],
    width: { default: 'min(360px, calc(100% - 16px))', [WIDE]: 'auto' },
    zIndex: { default: 20, [WIDE]: 'auto' },
  },
  scrim: {
    backgroundColor: colors['--oniva-color-overlay'],
    display: { default: 'block', [WIDE]: 'none' },
    inset: 0,
    position: 'fixed',
    zIndex: 15,
  },
  panelClosed: {
    transform: { default: 'translateX(calc(100% + 16px))', [WIDE]: 'none' },
    visibility: { default: 'hidden', [WIDE]: 'visible' },
  },
  panelHead: { alignItems: 'center', display: 'flex', justifyContent: 'space-between' },
  narrowOnly: { display: { default: 'inline-flex', [WIDE]: 'none' } },
  dl: {
    display: 'grid',
    gap: '6px 12px',
    gridTemplateColumns: 'auto minmax(0, 1fr)',
    margin: 0,
  },
  dt: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'] },
  dd: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-13'],
    margin: 0,
    textAlign: 'end',
  },
  draftBox: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-lg'],
    padding: 12,
  },
  topRow: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
});

const statusMeta: Record<RunStepStatus, { label: string; tone: BadgeVariant }> = {
  pending: { label: 'Queued', tone: 'neutral' },
  running: { label: 'Running', tone: 'accent' },
  waiting: { label: 'Needs approval', tone: 'warning' },
  done: { label: 'Done', tone: 'success' },
  denied: { label: 'Denied', tone: 'danger' },
  skipped: { label: 'Skipped', tone: 'neutral' },
  stopped: { label: 'Stopped', tone: 'neutral' },
};

type RunStatus = 'running' | 'waiting' | 'done' | 'stopped' | 'denied';
interface SimStep {
  status: RunStepStatus;
  shown: number;
  approved: boolean;
}

function initialSim(steps: RunStep[]): Record<string, SimStep> {
  return Object.fromEntries(
    steps.map((s) => [s.id, { status: 'pending' as RunStepStatus, shown: 0, approved: false }]),
  );
}

function toolIcon(name: string): ReactNode {
  if (/query|warehouse/.test(name)) return <Database size={14} />;
  if (/search/.test(name)) return <Search size={14} />;
  if (/mail|send/.test(name)) return <Mail size={14} />;
  return <FileText size={14} />;
}

function StatusIcon({ status }: { status: RunStepStatus }) {
  const base = [styles.icon, m8.pop];
  switch (status) {
    case 'running':
      return (
        <span aria-hidden="true" {...stylex.props(base, styles.iconRunning)}>
          <Loader2 size={16} {...stylex.props(styles.spinning)} />
        </span>
      );
    case 'waiting':
      return (
        <span aria-hidden="true" {...stylex.props(base, styles.iconWaiting)}>
          <ShieldAlert size={16} />
        </span>
      );
    case 'done':
      return (
        <span aria-hidden="true" {...stylex.props(base, styles.iconDone)}>
          <Check size={16} />
        </span>
      );
    case 'denied':
    case 'stopped':
      return (
        <span aria-hidden="true" {...stylex.props(base, styles.iconDenied)}>
          <XCircle size={16} />
        </span>
      );
    case 'skipped':
      return (
        <span aria-hidden="true" {...stylex.props(base, styles.iconPending)}>
          <Minus size={16} />
        </span>
      );
    default:
      return (
        <span aria-hidden="true" {...stylex.props(base, styles.iconPending)}>
          <CircleDashed size={16} />
        </span>
      );
  }
}

export interface AgentRunProps {
  /** Goal of the run, in the header and above the plan. */
  title?: string;
  steps?: RunStep[];
  /** Text the agent wrote, shown as an inline diff in the side panel. */
  draft?: RunDraft;
  /** Name of the agent in the run details. */
  agent?: string;
  /** Plays the built-in simulation on mount. Turn off and drive steps through `RunStep.status`. */
  autoRun?: boolean;
  onApprove?: (stepId: string) => void;
  onDeny?: (stepId: string) => void;
  onStop?: () => void;
  onDone?: () => void;
  /** Called with the label of a sidebar item. */
  onNavigate?: (label: string) => void;
  workspace?: string;
  user?: ScreenUser;
  /** Render the page title as an `h2` when the screen sits inside another page. */
  headingLevel?: 1 | 2;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export function AgentRun({
  title = 'Prepare the Q3 board update',
  steps = defaultRunSteps,
  draft = defaultRunDraft,
  agent = 'Board prep',
  autoRun = true,
  onApprove,
  onDeny,
  onStop,
  onDone,
  onNavigate,
  workspace = 'Northwind Labs',
  user = { name: 'Alex Morgan' },
  headingLevel = 1,
  className,
  ref,
}: AgentRunProps) {
  const [sim, setSim] = useState(() => initialSim(steps));
  const [stopped, setStopped] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const approveRef = useRef<HTMLButtonElement>(null);

  // reset the simulation when the plan itself changes
  const stepKey = steps.map((s) => s.id).join('|');
  const lastKey = useRef(stepKey);
  useEffect(() => {
    if (lastKey.current === stepKey) return;
    lastKey.current = stepKey;
    setSim(initialSim(steps));
    setStopped(false);
  }, [stepKey, steps]);

  const view = useMemo(() => {
    return steps.map((s) => {
      if (autoRun) {
        const v = sim[s.id] ?? { status: 'pending' as RunStepStatus, shown: 0, approved: false };
        return { step: s, status: v.status, shown: v.shown, approved: v.approved };
      }
      const status = s.status ?? 'pending';
      const shown = status === 'pending' || status === 'skipped' ? 0 : (s.calls?.length ?? 0);
      return { step: s, status, shown, approved: status === 'done' || status === 'running' };
    });
  }, [steps, sim, autoRun]);

  const done = view.filter((v) => v.status === 'done').length;
  const runStatus: RunStatus = view.some((v) => v.status === 'denied')
    ? 'denied'
    : view.some((v) => v.status === 'stopped') || (autoRun && stopped)
      ? 'stopped'
      : view.length > 0 && done === view.length
        ? 'done'
        : view.some((v) => v.status === 'waiting')
          ? 'waiting'
          : 'running';
  const current = view.findIndex((v) => v.status === 'running' || v.status === 'waiting');
  const callCount = view.reduce((n, v) => n + v.shown, 0);

  const doneFired = useRef(false);
  useEffect(() => {
    if (runStatus === 'done' && !doneFired.current) {
      doneFired.current = true;
      onDone?.();
    }
    if (runStatus !== 'done') doneFired.current = false;
  }, [runStatus, onDone]);

  // built-in simulation: one tick per second
  useEffect(() => {
    if (!autoRun || stopped) return;
    const idx = steps.findIndex((s) => sim[s.id]?.status !== 'done');
    if (idx < 0) return;
    const step = steps[idx]!;
    const cur = sim[step.id]!;
    if (cur.status === 'waiting' || cur.status === 'denied' || cur.status === 'stopped') return;
    const t = setTimeout(() => {
      setSim((prev) => {
        const p = prev[step.id]!;
        const len = step.calls?.length ?? 0;
        let next: SimStep = p;
        if (p.status === 'pending') next = { ...p, status: 'running', shown: len > 0 ? 1 : 0 };
        else if (p.status === 'running') {
          if (p.shown < len) next = { ...p, shown: p.shown + 1 };
          else if (step.approval && !p.approved) next = { ...p, status: 'waiting' };
          else next = { ...p, status: 'done' };
        }
        return { ...prev, [step.id]: next };
      });
    }, TICK_MS);
    return () => clearTimeout(t);
  }, [autoRun, stopped, sim, steps]);

  // bring the approval into reach without stealing focus from something else
  const waitingId = view.find((v) => v.status === 'waiting')?.step.id;
  useEffect(() => {
    if (!waitingId) return;
    const active = document.activeElement;
    if (!active || active === document.body || rootRef.current?.contains(active))
      approveRef.current?.focus({ preventScroll: false });
  }, [waitingId]);

  const approve = useCallback(
    (id: string) => {
      if (autoRun)
        setSim((p) => ({ ...p, [id]: { ...p[id]!, status: 'running', approved: true } }));
      onApprove?.(id);
    },
    [autoRun, onApprove],
  );
  const deny = useCallback(
    (id: string) => {
      if (autoRun) {
        setSim((p) => {
          const next = { ...p };
          let hit = false;
          for (const s of steps) {
            if (s.id === id) {
              next[id] = { ...p[id]!, status: 'denied' };
              hit = true;
            } else if (hit && next[s.id]!.status !== 'done')
              next[s.id] = { ...p[s.id]!, status: 'skipped' };
          }
          return next;
        });
      }
      onDeny?.(id);
    },
    [autoRun, onDeny, steps],
  );
  const stop = () => {
    if (autoRun) {
      setStopped(true);
      setSim((p) => {
        const next = { ...p };
        for (const s of steps) {
          const v = p[s.id]!;
          if (v.status === 'running' || v.status === 'waiting')
            next[s.id] = { ...v, status: 'stopped' };
          else if (v.status === 'pending') next[s.id] = { ...v, status: 'skipped' };
        }
        return next;
      });
    }
    onStop?.();
  };

  const onApprovalKey = (id: string) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      approve(id);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      deny(id);
    }
  };

  const overall =
    statusMeta[runStatus === 'denied' ? 'denied' : runStatus === 'stopped' ? 'stopped' : runStatus];
  const announce =
    runStatus === 'done'
      ? 'Run finished. Every step is done.'
      : runStatus === 'waiting'
        ? `Waiting for your approval on step ${current + 1} of ${view.length}.`
        : runStatus === 'denied'
          ? 'Approval denied. The run stopped.'
          : runStatus === 'stopped'
            ? 'Run stopped.'
            : current >= 0
              ? `Step ${current + 1} of ${view.length}: ${view[current]!.step.title}`
              : 'Run starting.';

  return (
    <ScreenShell
      ref={(el) => {
        rootRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) ref.current = el;
      }}
      className={className}
      workspace={workspace}
      user={user}
      active="Runs"
      title={title}
      headingLevel={headingLevel}
      onNavigate={onNavigate}
      actions={
        <>
          <Badge variant={overall.tone} dot>
            {overall.label}
          </Badge>
          <Button
            size="sm"
            variant="secondary"
            xstyle={styles.narrowOnly}
            startIcon={<PanelRight size={14} />}
            aria-expanded={panelOpen}
            aria-controls={panelId}
            onPress={() => setPanelOpen((o) => !o)}
          >
            Details
          </Button>
          <Button
            size="sm"
            variant="danger"
            startIcon={<Square size={12} />}
            isDisabled={runStatus !== 'running' && runStatus !== 'waiting'}
            onPress={stop}
          >
            Stop run
          </Button>
        </>
      }
    >
      <div role="status" aria-live="polite" {...stylex.props(s3.srOnly)}>
        {announce}
      </div>
      <div {...stylex.props(styles.layout)}>
        <div {...stylex.props(styles.main)}>
          <section aria-label="Plan" {...stylex.props(s3.card)}>
            <div {...stylex.props(styles.goal)}>
              <div {...stylex.props(styles.topRow)}>
                <h2 {...stylex.props(s3.h)}>Plan</h2>
                <span {...stylex.props(s3.muted, s3.num)}>
                  <AnimatedNumber value={done} /> of {view.length} steps done
                </span>
              </div>
              <ProgressBar
                aria-label="Run progress"
                value={done}
                minValue={0}
                maxValue={Math.max(view.length, 1)}
                size="sm"
                tone={
                  runStatus === 'denied' ? 'danger' : runStatus === 'done' ? 'success' : 'accent'
                }
              />
              <p {...stylex.props(styles.goalText)}>Goal: {title}</p>
            </div>
            <ol {...stylex.props(styles.steps)}>
              {view.map((v, i) => {
                const { step } = v;
                const calls = step.calls ?? [];
                const muted = v.status === 'pending' || v.status === 'skipped';
                return (
                  <li
                    key={step.id}
                    aria-current={i === current ? 'step' : undefined}
                    style={stepVar(i)}
                    {...stylex.props(styles.step, m8.rise)}
                  >
                    <div {...stylex.props(styles.rail)}>
                      <StatusIcon key={v.status} status={v.status} />
                      {i < view.length - 1 && (
                        <span
                          aria-hidden="true"
                          {...stylex.props(styles.line, v.status === 'done' && styles.lineDone)}
                        />
                      )}
                    </div>
                    <div {...stylex.props(styles.body)}>
                      <div {...stylex.props(styles.stepHead)}>
                        <h3 {...stylex.props(styles.stepTitle, muted && styles.stepTitleMuted)}>
                          {step.title}
                        </h3>
                        <Badge size="sm" variant={statusMeta[v.status].tone}>
                          <CrossFade
                            as="span"
                            contentKey={v.status}
                            duration={200}
                            blur={2}
                            morph="both"
                          >
                            {statusMeta[v.status].label}
                          </CrossFade>
                        </Badge>
                      </div>
                      {step.detail && <p {...stylex.props(s3.muted)}>{step.detail}</p>}
                      {calls.length > 0 && v.shown > 0 && (
                        <div {...stylex.props(styles.calls)}>
                          {calls.slice(0, v.shown).map((c, ci) => {
                            const last = ci === v.shown - 1;
                            const gated = !!step.approval && ci === calls.length - 1;
                            let status: ToolCallStatus = 'success';
                            if (v.status === 'running' && last)
                              status = gated && !v.approved ? 'pending' : 'running';
                            else if (v.status === 'waiting' && gated) status = 'pending';
                            else if ((v.status === 'denied' || v.status === 'stopped') && last)
                              status = 'error';
                            return (
                              <ToolCallCard
                                key={ci}
                                xstyle={m8.rise}
                                name={c.name}
                                summary={c.summary}
                                icon={toolIcon(c.name)}
                                args={c.args}
                                result={status === 'success' ? c.result : undefined}
                                status={status}
                                duration={status === 'success' ? c.duration : undefined}
                                error={
                                  status === 'error'
                                    ? v.status === 'denied'
                                      ? 'Denied before it ran.'
                                      : 'Stopped before it finished.'
                                    : undefined
                                }
                              />
                            );
                          })}
                        </div>
                      )}
                      {v.status === 'waiting' && step.approval && (
                        <div
                          role="group"
                          aria-label={`Approval needed: ${step.approval.title}`}
                          onKeyDown={onApprovalKey(step.id)}
                          {...stylex.props(styles.approval, m8.pop)}
                        >
                          <p {...stylex.props(styles.approvalTitle)}>
                            <ShieldAlert size={16} aria-hidden="true" />
                            {step.approval.title}
                            <Badge
                              size="sm"
                              variant={
                                step.approval.risk === 'high'
                                  ? 'danger'
                                  : step.approval.risk === 'medium'
                                    ? 'warning'
                                    : 'neutral'
                              }
                            >
                              {step.approval.risk} risk
                            </Badge>
                          </p>
                          <p {...stylex.props(styles.approvalText)}>{step.approval.description}</p>
                          {step.approval.details && (
                            <ul {...stylex.props(styles.details)}>
                              {step.approval.details.map((d) => (
                                <li key={d}>{d}</li>
                              ))}
                            </ul>
                          )}
                          <div {...stylex.props(styles.actions)}>
                            <Button
                              ref={approveRef}
                              size="sm"
                              startIcon={<Check size={14} />}
                              onPress={() => approve(step.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              startIcon={<X size={14} />}
                              onPress={() => deny(step.id)}
                            >
                              Deny
                            </Button>
                            <span {...stylex.props(styles.hint)}>
                              <Kbd>⌘↵</Kbd> approve · <Kbd>Esc</Kbd> deny
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>
        <Presence
          isPresent={panelOpen}
          preset="fade"
          initial={false}
          aria-hidden="true"
          onClick={() => setPanelOpen(false)}
          xstyle={styles.scrim}
        />
        <aside
          id={panelId}
          aria-label="Run details"
          {...stylex.props(styles.panel, !panelOpen && styles.panelClosed)}
          onKeyDown={(e) => e.key === 'Escape' && panelOpen && setPanelOpen(false)}
        >
          <div {...stylex.props(styles.panelHead)}>
            <h2 {...stylex.props(s3.h)}>Run details</h2>
            <Button
              size="xs"
              variant="ghost"
              isIconOnly
              aria-label="Close details"
              xstyle={styles.narrowOnly}
              onPress={() => setPanelOpen(false)}
            >
              <X size={14} />
            </Button>
          </div>
          <dl {...stylex.props(styles.dl)}>
            <dt {...stylex.props(styles.dt)}>Agent</dt>
            <dd {...stylex.props(styles.dd)}>{agent}</dd>
            <dt {...stylex.props(styles.dt)}>Status</dt>
            <dd {...stylex.props(styles.dd)}>{overall.label}</dd>
            <dt {...stylex.props(styles.dt)}>Trigger</dt>
            <dd {...stylex.props(styles.dd)}>Quarterly schedule</dd>
            <dt {...stylex.props(styles.dt)}>Progress</dt>
            <dd {...stylex.props(styles.dd, s3.num)}>
              {pluralize(done, { one: '# step', other: '# steps' })} of {view.length}
            </dd>
            <dt {...stylex.props(styles.dt)}>Tool calls</dt>
            <dd {...stylex.props(styles.dd, s3.num)}>
              <AnimatedNumber value={callCount} />
            </dd>
          </dl>
          <section aria-label={draft.label ?? 'Draft'} {...stylex.props(styles.draftBox)}>
            <h3 {...stylex.props(s3.h)}>{draft.label ?? 'Draft'}</h3>
            <ReviewDiff original={draft.original} suggested={draft.suggested} label={draft.label} />
          </section>
        </aside>
      </div>
    </ScreenShell>
  );
}
