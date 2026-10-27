import * as stylex from '@stylexjs/stylex';
import { AlertTriangle, Ban, Check, ChevronDown, Circle, Clock, Loader2, Sparkles } from 'lucide-react';
import { useLayoutEffect, useRef, useState, type ReactNode, type Ref } from 'react';
import { prefersReducedMotion } from '../../internal/motion-hooks';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { useGlide, useLeaving } from '../../internal/w1-r2-motion';
import { media } from '../../tokens/media.stylex';
import { Button, Dialog, DialogTrigger, Popover } from 'react-aria-components';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { mergeSx, sxClass } from '../../internal/sx';
import type { Tone } from '../../internal/types';
import { AgentAvatar } from '../AgentAvatar';
import { LiveRegion, Tag, formatDuration, useControlled, useNow, w1 } from '../../internal/w1-agent-ui';

export type TreeStatus = 'queued' | 'running' | 'waiting' | 'done' | 'failed' | 'stopped';
export type TreeAction = 'approve' | 'reject' | 'retry' | 'dismiss';

export interface TreeAgent {
  id: string;
  name: string;
  task: string;
  model?: string;
  /** Replaces the initials avatar. */
  avatar?: ReactNode;
  /** Small marks of the tools it uses, shown as overlapping tiles. */
  tools?: ReactNode[];
  status: TreeStatus;
  /** What a waiting agent needs you to decide. */
  ask?: string;
  /** What went wrong for a failed agent. */
  error?: string;
  /** The agent's own cost; branches add up their children. */
  cost?: number;
  started?: number;
  ended?: number;
  children?: TreeAgent[];
}

const STATUS: Record<TreeStatus, { label: string; tone: Tone }> = {
  queued: { label: 'Queued', tone: 'neutral' },
  running: { label: 'Running', tone: 'info' },
  waiting: { label: 'Needs you', tone: 'warning' },
  done: { label: 'Done', tone: 'success' },
  failed: { label: 'Failed', tone: 'danger' },
  stopped: { label: 'Stopped', tone: 'neutral' },
};


const drawDown = stylex.keyframes({ from: { transform: 'scaleY(0)' }, to: { transform: 'scaleY(1)' } });
const drawAcross = stylex.keyframes({ from: { transform: 'scaleX(0)' }, to: { transform: 'scaleX(1)' } });
const glyphIn = stylex.keyframes({ from: { filter: 'blur(2px)', opacity: 0, transform: 'scale(0.6)' }, to: { filter: 'blur(0)', opacity: 1, transform: 'none' } });
const goneOut = stylex.keyframes({ from: { opacity: 1 }, to: { opacity: 0 } });
const sweepPos = stylex.keyframes({ from: { backgroundPosition: '120% 0' }, to: { backgroundPosition: '-120% 0' } });

/** True while this agent or anything below it is still running (its cost still climbs). */
function branchRunning(a: TreeAgent): boolean {
  return a.status === 'running' || (a.children ?? []).some(branchRunning);
}

const styles = stylex.create({
  costLive: {
    animationDuration: '2s',
    animationIterationCount: 'infinite',
    animationName: { default: sweepPos, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'linear',
    backgroundClip: 'text',
    backgroundImage: `linear-gradient(100deg, ${colors['--oniva-color-text-muted']} 35%, ${colors['--oniva-color-text']} 50%, ${colors['--oniva-color-text-muted']} 65%)`,
    backgroundSize: '250% 100%',
    color: { default: 'transparent', [media.reducedMotion]: 'inherit' },
    WebkitBackgroundClip: 'text',
  },
  root: { containerType: 'inline-size' },
  tree: { display: 'flex', flexDirection: 'column', gap: 8, paddingBlock: 8 },
  headIcon: { color: colors['--oniva-color-accent-text'], flexShrink: 0 },
  rowGroup: { alignItems: 'flex-start', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', listStyle: 'none', margin: 0, padding: 0, paddingBlockStart: 16, position: 'relative', '::before': { backgroundColor: colors['--oniva-color-border-hover'], content: '""', height: 16, insetBlockStart: 0, insetInlineStart: '50%', position: 'absolute', width: 1 } },
  col: { flex: '0 1 250px', minWidth: 0, paddingBlockStart: 16, paddingInline: 6, position: 'relative', '::before': { borderColor: colors['--oniva-color-border-hover'], borderStyle: 'solid', borderWidth: 0, borderBlockStartWidth: 1, content: '""', height: 0, insetBlockStart: 0, insetInlineEnd: 0, insetInlineStart: 0, position: 'absolute' }, '::after': { backgroundColor: colors['--oniva-color-border-hover'], content: '""', height: 16, insetBlockStart: 0, insetInlineStart: '50%', position: 'absolute', width: 1 } },
  colFirst: { '::before': { insetInlineStart: '50%' } },
  colLast: { '::before': { insetInlineEnd: '50%' } },
  colSolo: { '::before': { display: 'none' } },
  rootCard: { marginInline: 'auto', maxWidth: 280, width: '100%' },
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    listStyle: 'none',
    margin: 0,
    marginInlineStart: 16,
    padding: 0,
    paddingBlockStart: 8,
    paddingInlineStart: 14,
  },
  item: { listStyle: 'none', margin: 0, padding: 0, position: 'relative' },
  child: {
    '::before': {
      animationDuration: motion['--oniva-motion-dur-slow'],
      animationFillMode: 'backwards',
      animationName: { default: drawDown, [media.reducedMotion]: 'none' },
      animationTimingFunction: motion['--oniva-motion-ease-out'],
      backgroundColor: colors['--oniva-color-border-hover'],
      content: '""',
      height: 'calc(100% + 8px)',
      insetBlockStart: -8,
      insetInlineStart: -14,
      position: 'absolute',
      transformOrigin: 'top',
      width: 1,
    },
  },
  lastChild: { '::before': { height: 30 } },
  stub: {
    position: 'relative',
    '::before': {
      animationDuration: motion['--oniva-motion-dur-slow'],
      animationFillMode: 'backwards',
      animationName: { default: drawAcross, [media.reducedMotion]: 'none' },
      animationTimingFunction: motion['--oniva-motion-ease-out'],
      backgroundColor: colors['--oniva-color-border-hover'],
      content: '""',
      height: 1,
      insetBlockStart: 22,
      insetInlineStart: -14,
      position: 'absolute',
      transformOrigin: 'left',
      width: 14,
    },
  },
  kid: { transitionDuration: motion['--oniva-motion-dur-base'], transitionProperty: 'opacity', transitionTimingFunction: motion['--oniva-motion-ease-out'] },
  leaving: { animationDuration: motion['--oniva-motion-dur-base'], animationFillMode: 'forwards', animationName: { default: goneOut, [media.reducedMotion]: 'none' }, animationTimingFunction: motion['--oniva-motion-ease-out'], pointerEvents: 'none' },
  glyphSwap: { animationDuration: motion['--oniva-motion-dur-enter'], animationName: { default: glyphIn, [media.reducedMotion]: 'none' }, animationTimingFunction: motion['--oniva-motion-ease-spring'], display: 'inline-flex' },
  muted: { borderStyle: 'dashed' },
  card: { display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0, padding: 10 },
  top: { alignItems: 'flex-start', display: 'flex', gap: 8, minWidth: 0 },
  body: { display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 0, minWidth: 0 },
  head: { alignItems: 'center', display: 'flex', gap: 6, justifyContent: 'space-between', minWidth: 0 },
  taskRow: { alignItems: 'flex-start', display: 'flex', gap: 6, minWidth: 0 },
  foot: { alignItems: 'center', display: 'flex', fontSize: font['--oniva-font-size-12'], gap: 6, justifyContent: 'space-between', minHeight: 20 },
  costTxt: { color: colors['--oniva-color-text'], fontWeight: font['--oniva-font-weight-medium'] },
  fold2: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'inline-flex', fontSize: font['--oniva-font-size-12'], gap: 2, height: 22, paddingInline: 4, width: 'auto' },
  totalsRun: { color: colors['--oniva-color-info-fg'] },
  name: { fontWeight: font['--oniva-font-weight-semibold'] },
  nameBtn: { textDecoration: { default: 'none', ':hover': 'underline' } },
  model: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'] },
  task: { color: colors['--oniva-color-text'], display: '-webkit-box', fontSize: font['--oniva-font-size-13'], lineHeight: 1.4, overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, minWidth: 0 },
  meta: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'flex', flexShrink: 0, flexWrap: 'wrap', fontSize: font['--oniva-font-size-12'], gap: 8, justifyContent: 'flex-end' },
  popText: { margin: 0, marginBlockStart: 4 },
  tools: { display: 'inline-flex', flexShrink: 0, marginBlockStart: 1 },
  tool: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-sm'],
    borderStyle: 'solid',
    borderWidth: 1,
    display: 'inline-flex',
    height: 18,
    justifyContent: 'center',
    marginInlineStart: { default: -4, ':first-child': 0 },
    width: 18,
  },
  chip: {
    appearance: 'none',
    borderWidth: 0,
    borderRadius: radius['--oniva-radius-full'],
    cursor: 'pointer',
    font: 'inherit',
    fontSize: font['--oniva-font-size-11'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: '18px',
    paddingInline: 8,
  },
  chipWarn: { backgroundColor: colors['--oniva-color-warning-bg'], color: colors['--oniva-color-warning-fg'] },
  chipErr: { backgroundColor: colors['--oniva-color-danger-bg'], color: colors['--oniva-color-danger-fg'] },
  fold: {
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-in-out'],
  },
  foldOpen: { transform: 'rotate(180deg)' },
  pop: { display: 'flex', flexDirection: 'column', gap: 10, outlineStyle: 'none' },
  actions: { display: 'flex', gap: 6, justifyContent: 'flex-end' },
  act: {
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    fontWeight: font['--oniva-font-weight-medium'],
    height: 28,
    paddingInline: 10,
  },
  actPrimary: { backgroundColor: accent['--oniva-accent-solid'], color: colors['--oniva-color-accent-fg'] },
  totals: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'flex', flexWrap: 'wrap', fontSize: font['--oniva-font-size-12'], gap: 10 },
});

function StatusTag({ status }: { status: TreeStatus }) {
  const { tone, label } = STATUS[status];
  const icon =
    status === 'running' ? <Loader2 size={11} aria-hidden="true" {...stylex.props(w1.spin)} />
    : status === 'done' ? <Check size={11} aria-hidden="true" />
    : status === 'failed' ? <AlertTriangle size={11} aria-hidden="true" />
    : status === 'waiting' ? <Clock size={11} aria-hidden="true" />
    : status === 'stopped' ? <Ban size={11} aria-hidden="true" />
    : <Circle size={11} aria-hidden="true" />;
  return (
    <span key={status} data-status={status} {...stylex.props(styles.glyphSwap)}>
      <Tag tone={tone} icon={icon}>{label}</Tag>
    </span>
  );
}

/** Own cost plus all descendants. */
export function branchCost(a: TreeAgent): number {
  return (a.cost ?? 0) + (a.children ?? []).reduce((s, c) => s + branchCost(c), 0);
}
function walk(a: TreeAgent, fn: (x: TreeAgent) => void) {
  fn(a);
  a.children?.forEach((c) => walk(c, fn));
}

interface Ctx {
  now: number;
  collapsed: string[];
  toggle: (id: string) => void;
  cost: (n: number) => string;
  onSelect?: (a: TreeAgent) => void;
  onResolve?: (a: TreeAgent, action: TreeAction) => void;
}

function Node({ agent, ctx, depth, last = true, index = 0, leaving = false, hide = false, hideDelay = 0 }: { agent: TreeAgent; ctx: Ctx; depth: number; last?: boolean; index?: number; leaving?: boolean; hide?: boolean; hideDelay?: number }) {
  const kids = agent.children ?? [];
  const shownKids = useLeaving(kids, 200);
  const folded = ctx.collapsed.includes(agent.id);
  // A folded branch stays mounted while it fades and closes, then unmounts.
  const [linger, setLinger] = useState(false);
  const wasFolded = useRef(folded);
  useLayoutEffect(() => {
    let id = 0;
    if (folded && !wasFolded.current && !prefersReducedMotion() && typeof Element.prototype.animate === 'function') {
      setLinger(true);
      id = window.setTimeout(() => setLinger(false), 380);
    }
    wasFolded.current = folded;
    return () => window.clearTimeout(id);
  }, [folded]);
  const st = STATUS[agent.status];
  const end = agent.ended ?? ctx.now;
  const dur = agent.started != null && agent.status !== 'queued' ? formatDuration(end - agent.started) : null;
  const cost = branchCost(agent);
  const label = `${agent.name}, ${st.label}`;
  const muted = agent.status === 'queued' || agent.status === 'stopped';
  const popBody = (close: () => void) => {
    const act = (a: TreeAction) => {
      ctx.onResolve?.(agent, a);
      close();
    };
    return (
      <div {...stylex.props(styles.pop)}>
        <div>
          <div {...stylex.props(w1.label)}>{agent.name}</div>
          <p {...stylex.props(styles.popText)}>{(agent.status === 'waiting' ? agent.ask : agent.error) ?? st.label}</p>
        </div>
        <div {...stylex.props(styles.actions)}>
          {agent.status === 'waiting' ? (
            <>
              <Button autoFocus onPress={() => act('approve')} className={() => sxClass(stylex.props(styles.act, styles.actPrimary, focus.ring))}>Approve</Button>
              <Button onPress={() => act('reject')} className={() => sxClass(stylex.props(styles.act, focus.ring))}>Reject</Button>
            </>
          ) : (
            <>
              <Button autoFocus onPress={() => act('retry')} className={() => sxClass(stylex.props(styles.act, styles.actPrimary, focus.ring))}>Retry</Button>
              <Button onPress={() => act('dismiss')} className={() => sxClass(stylex.props(styles.act, focus.ring))}>Dismiss</Button>
            </>
          )}
        </div>
      </div>
    );
  };
  return (
    <li
      role="treeitem"
      aria-level={depth + 1}
      aria-expanded={kids.length ? !folded : undefined}
      aria-label={label}
      style={{ opacity: hide ? 0 : undefined, transitionDelay: hide ? `${hideDelay}ms` : undefined }}
      {...stylex.props(styles.item, styles.kid, depth === 1 && styles.col, depth === 1 && index === 0 && styles.colFirst, depth === 1 && last && styles.colLast, depth === 1 && index === 0 && last && styles.colSolo, depth > 1 && styles.child, depth > 1 && last && styles.lastChild, leaving && styles.leaving)}
    >
      <div data-flip-id={leaving ? undefined : agent.id} style={{ animationDelay: depth > 0 ? `${100 + Math.min(index, 5) * 45}ms` : undefined }} {...stylex.props(w1.tile, styles.card, depth === 0 && styles.rootCard, depth > 1 && styles.stub, w1.rise, muted && styles.muted)}>
        <div {...stylex.props(styles.top)}>
          {agent.avatar ?? <AgentAvatar name={agent.name} size={28} />}
          <div {...stylex.props(styles.body)}>
            <div {...stylex.props(styles.head)}>
              {ctx.onSelect ? (
                <Button onPress={() => ctx.onSelect?.(agent)} className={() => sxClass(stylex.props(w1.reset, styles.name, styles.nameBtn, focus.ring))}>
                  {agent.name}
                </Button>
              ) : (
                <span {...stylex.props(styles.name)}>{agent.name}</span>
              )}
              {agent.status === 'waiting' ? (
                <DialogTrigger>
                  <Button className={() => sxClass(stylex.props(styles.chip, styles.chipWarn, focus.ring))}>Needs you</Button>
                  <Popover placement="bottom start">
                    <Dialog aria-label={`${agent.name} needs you`} className={sxClass(stylex.props(w1.popover))}>
                      {({ close }) => popBody(close)}
                    </Dialog>
                  </Popover>
                </DialogTrigger>
              ) : agent.status === 'failed' ? (
                <DialogTrigger>
                  <Button className={() => sxClass(stylex.props(styles.chip, styles.chipErr, focus.ring))}>Failed</Button>
                  <Popover placement="bottom start">
                    <Dialog aria-label={`${agent.name} failed`} className={sxClass(stylex.props(w1.popover))}>
                      {({ close }) => popBody(close)}
                    </Dialog>
                  </Popover>
                </DialogTrigger>
              ) : (
                <StatusTag status={agent.status} />
              )}
            </div>
            {agent.model && <span {...stylex.props(styles.model)}>{agent.model}</span>}
          </div>
        </div>
        <div {...stylex.props(styles.taskRow)}>
          {agent.tools && agent.tools.length > 0 && (
            <span aria-hidden="true" {...stylex.props(styles.tools)}>
              {agent.tools.slice(0, 3).map((t, i) => (
                <span key={i} {...stylex.props(styles.tool)}>{t}</span>
              ))}
            </span>
          )}
          <span {...stylex.props(styles.task)}>{agent.task}</span>
        </div>
        <div {...stylex.props(styles.foot, w1.num)}>
          <span {...stylex.props(styles.meta)}>
            {cost > 0 && <span {...stylex.props(styles.costTxt, branchRunning(agent) && styles.costLive)}>{ctx.cost(cost)}</span>}
            {cost > 0 && dur && <span aria-hidden="true">·</span>}
            {dur && <span>{dur}</span>}
          </span>
          {kids.length > 0 && (
            <Button
              aria-label={`${folded ? 'Show' : 'Hide'} ${f(kids.length)} of ${agent.name}`}
              aria-expanded={!folded}
              onPress={() => ctx.toggle(agent.id)}
              className={() => sxClass(stylex.props(w1.iconBtn, styles.fold2, focus.ring))}
            >
              {kids.length}
              <ChevronDown size={13} aria-hidden="true" {...stylex.props(styles.fold, folded && styles.foldOpen)} />
            </Button>
          )}
        </div>
      </div>
      {kids.length > 0 && (
        <AnimatedHeight isOpen={!folded}>
          {(!folded || linger) && (
          <ul role="group" {...stylex.props(depth === 0 ? styles.rowGroup : styles.group)}>
            {shownKids.map(({ item: c, leaving: gone }, i) => (
              <Node
                key={c.id}
                agent={c}
                ctx={ctx}
                depth={depth + 1}
                last={i === shownKids.length - 1}
                index={i}
                leaving={gone}
                hide={folded}
                hideDelay={(shownKids.length - 1 - i) * 35}
              />
            ))}
          </ul>
          )}
        </AnimatedHeight>
      )}
    </li>
  );
  function f(n: number) {
    return `${n} sub-agent${n === 1 ? '' : 's'}`;
  }
}

export interface AgentTreeProps {
  root: TreeAgent;
  collapsed?: string[];
  defaultCollapsed?: string[];
  onCollapsedChange?: (collapsed: string[]) => void;
  /** Makes agent names clickable. */
  onSelect?: (agent: TreeAgent) => void;
  onResolve?: (agent: TreeAgent, action: TreeAction) => void;
  /** Clock for running times (epoch ms). Without it the tree ticks every second while an agent runs. */
  now?: number;
  formatCost?: (amount: number) => string;
  title?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Orchestrator and sub-agents as a live, foldable tree with status, cost roll-ups and time. */
export function AgentTree({
  root,
  collapsed,
  defaultCollapsed = [],
  onCollapsedChange,
  onSelect,
  onResolve,
  now,
  formatCost,
  title = 'Agents',
  className,
  xstyle,
  ref,
}: AgentTreeProps) {
  const f = useFormatters();
  const treeRef = useRef<HTMLUListElement>(null);
  useGlide(treeRef, { duration: 320, stagger: 30 });
  const [col, setCol] = useControlled<string[]>(collapsed, defaultCollapsed, onCollapsedChange);
  const counts = { total: 0, running: 0, waiting: 0, failed: 0 };
  walk(root, (a) => {
    counts.total++;
    if (a.status === 'running') counts.running++;
    if (a.status === 'waiting') counts.waiting++;
    if (a.status === 'failed') counts.failed++;
  });
  const t = useNow(now, counts.running > 0);
  const cost = formatCost ?? ((n: number) => f.currency(n, 'USD', { minimumFractionDigits: 2 }));
  const ctx: Ctx = {
    now: t,
    collapsed: col,
    toggle: (id) => setCol(col.includes(id) ? col.filter((x) => x !== id) : [...col, id]),
    cost,
    onSelect,
    onResolve,
  };
  const summary = `${f.plural(counts.total, { one: '# agent', other: '# agents' })}, ${counts.running} running, ${counts.waiting} need you, ${counts.failed} failed, ${cost(branchCost(root))}`;
  return (
    <div {...mergeSx(stylex.props(w1.root, styles.root, xstyle), className)} ref={ref}>
      <div {...stylex.props(w1.bar)}>
        <Sparkles size={14} aria-hidden="true" {...stylex.props(styles.headIcon)} />
        <h3 {...stylex.props(w1.title)}>{title}</h3>
        <span {...stylex.props(w1.grow)} />
        <span aria-hidden="true" {...stylex.props(styles.totals, w1.num)}>
          <span>{f.plural(counts.total, { one: '# agent', other: '# agents' })}</span>
          {counts.running > 0 && <span {...stylex.props(styles.totalsRun)}>{counts.running} running</span>}
          {counts.waiting > 0 && <span>{counts.waiting} needs you</span>}
          {counts.failed > 0 && <span>{counts.failed} failed</span>}
          <strong {...stylex.props(counts.running > 0 && styles.costLive)}>{cost(branchCost(root))}</strong>
        </span>
      </div>
      <ul ref={treeRef} role="tree" aria-label={title} {...stylex.props(w1.list, styles.tree)}>
        <Node agent={root} ctx={ctx} depth={0} />
      </ul>
      <LiveRegion message={summary} />
    </div>
  );
}
