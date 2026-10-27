import * as stylex from '@stylexjs/stylex';
import { Sparkles } from 'lucide-react';
import { useRef, useState, type ReactNode, type Ref } from 'react';
import { Button, Dialog, DialogTrigger, Popover } from 'react-aria-components';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { mergeSx, sxClass } from '../../internal/sx';
import { AgentAvatar } from '../AgentAvatar';
import { LiveRegion, formatDuration, useWidth, w1 } from '../../internal/w1-agent-ui';
import { useLiveNow } from '../../internal/w1-flip';

export type LaneStatus = 'done' | 'running' | 'waiting' | 'failed';

export interface LaneAgent {
  id: string;
  name: string;
  model?: string;
  avatar?: ReactNode;
}
export interface LaneTask {
  id: string;
  agentId: string;
  title: string;
  status: LaneStatus;
  /** Epoch ms. */
  start: number;
  /** Epoch ms; without it the block reaches "now". */
  end?: number;
  /** Id of the next agent's task this one hands over to. */
  handoffTo?: string;
  /** One sentence on what needs deciding (waiting tasks). */
  ask?: string;
  /** Two or three short points on what got done. */
  summary?: string[];
  /** Up to three small marks of the apps the task works in. */
  tools?: ReactNode[];
}

const LANE_H = 70;
const fadeIn = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const LABEL: Record<LaneStatus, string> = { done: 'done', running: 'running', waiting: 'needs you', failed: 'failed' };

const styles = stylex.create({
  root: { containerType: 'inline-size', maxWidth: 760 },
  grid: { display: 'grid', gridTemplateColumns: 'var(--lane-label, 180px) minmax(0, 1fr)' },
  names: { display: 'flex', flexDirection: 'column' },
  nameRow: { alignItems: 'center', display: 'flex', gap: 10, paddingInlineStart: 16, height: LANE_H, minWidth: 0, paddingInlineEnd: 8 },
  nameText: { display: 'flex', flexDirection: 'column', minWidth: 0 },
  model: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'] },
  plane: { overflow: 'hidden', position: 'relative' },
  lane: { borderBottomColor: colors['--oniva-color-border'], borderBottomStyle: 'solid', borderBottomWidth: { default: 1, ':last-of-type': 0 }, height: LANE_H, margin: 0, padding: 0, position: 'relative', listStyle: 'none' },
  gridLine: { backgroundColor: colors['--oniva-color-border'], bottom: 0, opacity: 0.6, position: 'absolute', top: 0, width: 1 },
  svg: { height: '100%', inset: 0, pointerEvents: 'none', position: 'absolute', width: '100%' },
  curve: { fill: 'none', stroke: colors['--oniva-color-info-solid'], strokeWidth: 1.5, opacity: 0.7, strokeDasharray: '3 3' },
  axis: { color: colors['--oniva-color-text-muted'], display: 'flex', fontSize: font['--oniva-font-size-12'], height: 30, alignItems: 'center', justifyContent: 'space-between', paddingInlineEnd: 4 },
  panel: { backgroundColor: colors['--oniva-color-surface-inner'], borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-lg'], borderStyle: 'solid', borderWidth: 1, overflow: 'hidden' },
  head: { alignItems: 'center', borderBottomColor: colors['--oniva-color-border'], borderBottomStyle: 'solid', borderBottomWidth: 1, display: 'flex', flexWrap: 'wrap', gap: 10, paddingBlock: 12, paddingInline: 16 },
  headTitle: { fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-medium'], margin: 0 },
  stat: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'inline-flex', fontSize: font['--oniva-font-size-13'], gap: 6 },
  dot: { borderRadius: radius['--oniva-radius-full'], height: 6, width: 6 },
  dotRun: { backgroundColor: colors['--oniva-color-info-solid'] },
  dotWait: { backgroundColor: colors['--oniva-color-warning-solid'] },
  statWait: { color: colors['--oniva-color-warning-fg'] },
  chip: { backgroundColor: colors['--oniva-color-surface-tertiary'], borderRadius: radius['--oniva-radius-md'], color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], paddingBlock: 3, paddingInline: 8 },
  inline: { alignItems: 'center', display: 'flex', gap: 6, minWidth: 0 },
  miniTag: { backgroundColor: colors['--oniva-color-surface-tertiary'], borderRadius: radius['--oniva-radius-sm'], color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-11'], paddingBlock: 1, paddingInline: 6, whiteSpace: 'nowrap' },
  miniWait: { backgroundColor: colors['--oniva-color-warning-bg'], color: colors['--oniva-color-warning-fg'] },
  nowChip: { backgroundColor: colors['--oniva-color-info-bg'], borderRadius: radius['--oniva-radius-sm'], color: colors['--oniva-color-info-fg'], fontSize: font['--oniva-font-size-11'], fontWeight: font['--oniva-font-weight-medium'], paddingBlock: 2, paddingInline: 6 },
  block: {
    alignItems: 'center',
    appearance: 'none',
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'flex',
    font: 'inherit',
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 6,
    height: 40,
    insetBlockStart: 15,
    left: 0,
    minWidth: 28,
    overflow: 'hidden',
    paddingInline: 8,
    position: 'absolute',
    textAlign: 'start',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transform: 'translateX(calc(var(--x) * var(--pw, 0) * 0.01px))',
    transitionProperty: 'background-color, border-color, color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: fadeIn,
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    whiteSpace: 'nowrap',
    width: 'var(--w)',
    zIndex: 1,
  },
  done: { backgroundColor: colors['--oniva-color-success-bg'], borderColor: colors['--oniva-color-success-solid'], color: colors['--oniva-color-success-fg'] },
  running: { backgroundColor: colors['--oniva-color-info-bg'], borderColor: colors['--oniva-color-info-solid'], color: colors['--oniva-color-info-fg'] },
  waiting: { backgroundColor: colors['--oniva-color-warning-bg'], borderColor: colors['--oniva-color-warning-solid'], color: colors['--oniva-color-warning-fg'] },
  failed: { backgroundColor: colors['--oniva-color-danger-bg'], borderColor: colors['--oniva-color-danger-solid'], color: colors['--oniva-color-danger-fg'] },
  toolRow: { display: 'inline-flex', flexShrink: 0 },
  tool: { alignItems: 'center', backgroundColor: colors['--oniva-color-surface-inner'], borderRadius: radius['--oniva-radius-xs'], color: colors['--oniva-color-text-muted'], display: 'inline-flex', height: 16, justifyContent: 'center', marginInlineEnd: -2, width: 16 },
  pop: { display: 'flex', flexDirection: 'column', gap: 8 },
  points: { margin: 0, paddingInlineStart: 16 },
  btns: { display: 'flex', gap: 6 },
  btn: { backgroundColor: colors['--oniva-color-surface-tertiary'], borderRadius: radius['--oniva-radius-md'], borderWidth: 0, color: colors['--oniva-color-text'], cursor: 'pointer', fontWeight: font['--oniva-font-weight-medium'], height: 28, paddingInline: 12 },
  btnPrimary: { backgroundColor: accent['--oniva-accent-solid'], color: colors['--oniva-color-accent-fg'] },
});

export interface AgentLanesProps {
  agents: LaneAgent[];
  tasks: LaneTask[];
  /** How much time the lanes show, in ms. Default 30 minutes. */
  span?: number;
  /** A clock you control (epoch ms). Without it the lanes follow real time every second. */
  now?: number;
  /** Without handlers the lanes change the task status themselves. */
  onApprove?: (task: LaneTask) => void;
  onReject?: (task: LaneTask) => void;
  /** Shows an Open button in the popover of blocks that don't wait. */
  onOpen?: (task: LaneTask) => void;
  title?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** One lane per agent on a live timeline: tasks grow into "now", hand-offs are drawn, approvals sit on the block. */
export function AgentLanes({
  agents,
  tasks,
  span = 30 * 60_000,
  now,
  onApprove,
  onReject,
  onOpen,
  title = 'Agents',
  className,
  xstyle,
  ref,
}: AgentLanesProps) {
  const f = useFormatters();
  const rootRef = useRef<HTMLDivElement>(null);
  const w = useWidth(rootRef);
  const planeRef = useRef<HTMLDivElement>(null);
  const pw = useWidth(planeRef);
  const narrow = w > 0 && w < 520;
  const [local, setLocal] = useState<Record<string, LaneStatus>>({});
  const items = tasks.map((t) => (local[t.id] ? { ...t, status: local[t.id]! } : t));
  const t = useLiveNow(now, true);
  const from = t - span;
  const pct = (ms: number) => Math.min(100, Math.max(0, ((ms - from) / span) * 100));
  const laneIndex = new Map(agents.map((a, i) => [a.id, i]));
  const byId = new Map(items.map((x) => [x.id, x]));
  const waiting = items.filter((x) => x.status === 'waiting').length;
  const running = items.filter((x) => x.status === 'running').length;
  const fmt = (ms: number) => f.date(ms, { hour: 'numeric', minute: '2-digit' });

  const curves = items.flatMap((x) => {
    const to = x.handoffTo ? byId.get(x.handoffTo) : undefined;
    const i = laneIndex.get(x.agentId);
    const j = to ? laneIndex.get(to.agentId) : undefined;
    if (!to || i == null || j == null) return [];
    const x1 = pct(x.end ?? t);
    const x2 = pct(to.start);
    if (x2 < 0.01 && x1 < 0.01) return [];
    const y1 = i * LANE_H + LANE_H / 2;
    const y2 = j * LANE_H + LANE_H / 2;
    const mid = (x1 + x2) / 2;
    return [{ id: x.id, d: `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}` }];
  });

  const resolve = (x: LaneTask, ok: boolean) => {
    const handler = ok ? onApprove : onReject;
    if (handler) handler(x);
    else setLocal((l) => ({ ...l, [x.id]: ok ? 'running' : 'failed' }));
  };

  return (
    <div
      {...mergeSx(stylex.props(w1.root, styles.root, xstyle), className, { ['--lane-label' as string]: narrow ? '40px' : '180px' })}
      ref={(el) => { rootRef.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el; }}
    >
      <div {...stylex.props(styles.panel)}>
      <div {...stylex.props(styles.head)}>
        <Sparkles size={14} aria-hidden="true" />
        <h3 {...stylex.props(styles.headTitle)}>{title}</h3>
        {running > 0 && <span {...stylex.props(styles.stat)}><span aria-hidden="true" {...stylex.props(styles.dot, styles.dotRun)} />{running} running</span>}
        {waiting > 0 && <span {...stylex.props(styles.stat, styles.statWait)}><span aria-hidden="true" {...stylex.props(styles.dot, styles.dotWait)} />{waiting} needs you</span>}
        <span {...stylex.props(w1.grow)} />
        <span {...stylex.props(styles.chip)}>Last {Math.round(span / 60_000)}m</span>
      </div>
      <div aria-hidden="true" {...stylex.props(styles.axis, w1.num)} style={{ marginInlineStart: narrow ? 40 : 180 }}>
        {[5, 4, 3, 2, 1].map((k) => <span key={k}>{'\u2212'}{Math.round((span * k) / 6 / 60_000)}m</span>)}
        <span {...stylex.props(styles.nowChip)}>now</span>
      </div>
      <div {...stylex.props(styles.grid)}>
        <div {...stylex.props(styles.names)}>
          {agents.map((a) => {
            const busy = items.some((x) => x.agentId === a.id && (x.status === 'running' || x.status === 'waiting'));
            const wait = items.some((x) => x.agentId === a.id && x.status === 'waiting');
            return (
              <div key={a.id} {...stylex.props(styles.nameRow)}>
                {a.avatar ?? <AgentAvatar name={a.name} size={28} status={wait ? 'waiting' : busy ? 'working' : undefined} />}
                {!narrow && (
                  <span {...stylex.props(styles.nameText)}>
                    <span {...stylex.props(styles.inline)}>
                      <span {...stylex.props(w1.ellipsis)}>{a.name}</span>
                      {(wait || !busy) && <span {...stylex.props(styles.miniTag, wait && styles.miniWait)}>{wait ? 'Needs you' : 'Idle'}</span>}
                    </span>
                    <span {...stylex.props(styles.model, w1.ellipsis)}>{a.model ?? (busy ? 'Working' : '')}</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div ref={planeRef} {...stylex.props(styles.plane)}>
          {[25, 50, 75].map((p) => (
            <span key={p} aria-hidden="true" {...stylex.props(styles.gridLine)} style={{ left: `${p}%` }} />
          ))}
          <svg aria-hidden="true" viewBox={`0 0 100 ${agents.length * LANE_H}`} preserveAspectRatio="none" {...stylex.props(styles.svg)}>
            {curves.map((c) => (
              <path key={c.id} d={c.d} vectorEffect="non-scaling-stroke" {...stylex.props(styles.curve)} />
            ))}
          </svg>
          {agents.map((a) => (
            <ul key={a.id} aria-label={a.name} {...stylex.props(styles.lane)}>
              {items
                .filter((x) => x.agentId === a.id && (x.end ?? t) > from)
                .map((x) => {
                  const left = pct(x.start);
                  const right = pct(x.end ?? t);
                  // Blocks fade out as they reach the left edge of the window.
                  const edge = Math.min(1, Math.max(0, right / 6));
                  const label = `${a.name}: ${x.title}, ${LABEL[x.status]}, ${fmt(x.start)}${x.end ? ` to ${fmt(x.end)}` : `, ${formatDuration(t - x.start)} so far`}`;
                  return (
                    <li key={x.id} {...stylex.props(w1.list)}>
                      <DialogTrigger>
                        <Button
                          aria-label={label}
                          data-status={x.status}
                          style={{ ['--x' as string]: left, ['--pw' as string]: pw, left: pw ? 0 : `${left}%`, ['--w' as string]: `${Math.max(right - left, 0)}%`, opacity: edge }}
                          className={() => sxClass(stylex.props(styles.block, styles[x.status], focus.ring))}
                        >
                          {x.status === 'running' && <span aria-hidden="true" {...stylex.props(w1.sheen)} />}
                          {x.status === 'waiting' && <span aria-hidden="true" {...stylex.props(w1.pulseRing)} />}
                          {x.tools && x.tools.length > 0 && (
                            <span aria-hidden="true" {...stylex.props(styles.toolRow)}>
                              {x.tools.slice(0, 3).map((tl, k) => <span key={k} {...stylex.props(styles.tool)}>{tl}</span>)}
                            </span>
                          )}
                          <span {...stylex.props(w1.ellipsis)}>{x.title}</span>
                        </Button>
                        <Popover placement="bottom start">
                          <Dialog aria-label={x.status === 'waiting' ? `Decision: ${x.title}` : x.title} className={sxClass(stylex.props(w1.popover))}>
                            {({ close }) => (
                              <div {...stylex.props(styles.pop)}>
                                <strong>{x.title}</strong>
                                {x.status === 'waiting' ? (
                                  <>
                                    <span>{x.ask ?? 'This task needs your decision.'}</span>
                                    <div {...stylex.props(styles.btns)}>
                                      <Button autoFocus onPress={() => { resolve(x, true); close(); }} className={() => sxClass(stylex.props(styles.btn, styles.btnPrimary, focus.ring))}>Approve</Button>
                                      <Button onPress={() => { resolve(x, false); close(); }} className={() => sxClass(stylex.props(styles.btn, focus.ring))}>Reject</Button>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    {x.summary && x.summary.length > 0 && (
                                      <ul {...stylex.props(styles.points)}>{x.summary.map((s, k) => <li key={k}>{s}</li>)}</ul>
                                    )}
                                    <span {...stylex.props(w1.muted, w1.num)}>{fmt(x.start)} · {formatDuration((x.end ?? t) - x.start)}</span>
                                    {onOpen && (
                                      <div {...stylex.props(styles.btns)}>
                                        <Button autoFocus onPress={() => { onOpen(x); close(); }} className={() => sxClass(stylex.props(styles.btn, focus.ring))}>Open</Button>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </Dialog>
                        </Popover>
                      </DialogTrigger>
                    </li>
                  );
                })}
            </ul>
          ))}
        </div>
      </div>
      </div>
      <LiveRegion message={`${f.plural(waiting, { one: '# task needs', other: '# tasks need' })} a decision.`} />
    </div>
  );
}
