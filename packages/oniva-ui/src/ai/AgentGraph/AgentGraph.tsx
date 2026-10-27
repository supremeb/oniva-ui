import * as stylex from '@stylexjs/stylex';
import { AlertTriangle, Clock, User } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ReactNode, type Ref } from 'react';
import { Button, Dialog, Popover } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { prefersReducedMotion } from '../../internal/motion-hooks';
import { mergeSx, sxClass } from '../../internal/sx';
import { AgentAvatar } from '../AgentAvatar';
import { LiveRegion, Tag, useAnnouncer, useNow, useWidth, w1 } from '../../internal/w1-agent-ui';
import { useSpringMap } from '../../internal/w1-flip';
import { useLeaving } from '../../internal/w1-r2-motion';
import { media } from '../../tokens/media.stylex';

const drawIn = stylex.keyframes({ from: { strokeDashoffset: 1 }, to: { strokeDashoffset: 0 } });
const popIn = stylex.keyframes({ from: { opacity: 0, transform: 'scale(0.8)' }, to: { opacity: 1, transform: 'scale(1)' } });
const fadeIn = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const shrinkAway = stylex.keyframes({ from: { opacity: 1, transform: 'scale(1)' }, to: { opacity: 0, transform: 'scale(0.4)' } });
const ripple = stylex.keyframes({ from: { opacity: 0.6, transform: 'scale(1)' }, to: { opacity: 0, transform: 'scale(1.9)' } });

export type GraphKind = 'agent' | 'tool' | 'user';
export type GraphStatus = 'idle' | 'working' | 'waiting' | 'error' | 'done';
export interface GraphNode {
  id: string;
  name: string;
  kind: GraphKind;
  /** Shorter label for narrow containers. */
  short?: string;
  icon?: ReactNode;
  /** Model for agents, what it is for tools. */
  detail?: string;
  status?: GraphStatus;
  /** What it is doing right now (shown in its card). */
  doing?: string;
  cost?: number;
  /** The agent in the middle. Defaults to the first agent. */
  lead?: boolean;
}
export interface GraphCall {
  id: string;
  from: string;
  to: string;
  /** Epoch ms. */
  at: number;
  status?: 'pending' | 'ok' | 'error';
  label?: string;
  ms?: number;
}

const STATUS_TEXT: Record<GraphStatus, string> = { idle: 'Idle', working: 'Working', waiting: 'Needs you', error: 'Failed', done: 'Done' };

const styles = stylex.create({
  root: { containerType: 'inline-size', maxWidth: 820 },
  plane: { backgroundColor: colors['--oniva-color-surface-inner'], borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-lg'], borderStyle: 'solid', borderWidth: 1, height: 'var(--gh)', overflow: 'hidden', position: 'relative' },
  svg: { height: '100%', inset: 0, pointerEvents: 'none', position: 'absolute', width: '100%' },
  link: {
    stroke: colors['--oniva-color-info-solid'],
    strokeLinecap: 'round',
    strokeOpacity: 0.45,
    strokeWidth: 'var(--lw)',
    strokeDasharray: 1,
    animationDelay: 'calc(var(--d, 0) * 1ms)',
    animationDuration: motion['--oniva-motion-dur-sheet'],
    animationFillMode: 'backwards',
    animationName: { default: drawIn, [media.reducedMotion]: fadeIn },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    transitionDuration: '700ms',
    transitionProperty: 'stroke-width, stroke-opacity, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  linkLit: { strokeOpacity: 1 },
  pulse: { fill: colors['--oniva-color-info-solid'] },
  pulseBack: { fill: colors['--oniva-color-surface-inner'], stroke: colors['--oniva-color-info-solid'], strokeWidth: 2 },
  pulseErr: { fill: colors['--oniva-color-surface-inner'], stroke: colors['--oniva-color-danger-solid'], strokeWidth: 2 },
  node: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    font: 'inherit',
    gap: 2,
    left: 0,
    margin: 0,
    maxWidth: 120,
    opacity: { default: 1, '[data-dim]': 0.4 },
    padding: 2,
    position: 'absolute',
    top: 0,
    transform: 'translate(calc(var(--x) * 1px - 50%), calc(var(--y) * 1px - 50%))',
    animationDelay: 'calc(var(--d, 0) * 1ms)',
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: fadeIn,
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    zIndex: 1,
  },
  face: {
    alignItems: 'center',
    animationDelay: 'calc(var(--d, 0) * 1ms)',
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: popIn, [media.reducedMotion]: fadeIn },
    animationTimingFunction: motion['--oniva-motion-ease-spring'],
    display: 'inline-flex',
    justifyContent: 'center',
    position: 'relative',
  },
  landing: {
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationName: { default: ripple, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    borderColor: colors['--oniva-color-info-solid'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 2,
    inset: -2,
    pointerEvents: 'none',
    position: 'absolute',
  },
  leaving: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'forwards',
    animationName: { default: shrinkAway, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    pointerEvents: 'none',
  },
  toolFace: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border-control'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-text-muted'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-semibold'],
    height: 'var(--ns)',
    justifyContent: 'center',
    width: 'var(--ns)',
  },
  userFace: { backgroundColor: colors['--oniva-color-text'], borderColor: 'transparent', color: colors['--oniva-color-bg'] },
  agentTile: { alignItems: 'center', backgroundColor: colors['--oniva-color-surface'], borderColor: colors['--oniva-color-border-control'], borderRadius: radius['--oniva-radius-lg'], borderStyle: 'solid', borderWidth: 1, display: 'inline-flex', height: 'calc(var(--ns) + 6px)', justifyContent: 'center', width: 'calc(var(--ns) + 6px)' },
  legend: { alignItems: 'center', bottom: 10, color: colors['--oniva-color-text-muted'], display: 'flex', flexWrap: 'wrap', fontSize: font['--oniva-font-size-12'], gap: 14, justifyContent: 'center', left: 0, pointerEvents: 'none', position: 'absolute', right: 0 },
  legendItem: { alignItems: 'center', display: 'inline-flex', gap: 6 },
  dInfo: { backgroundColor: colors['--oniva-color-info-solid'] },
  dOk: { backgroundColor: colors['--oniva-color-success-solid'] },
  dWarn: { backgroundColor: colors['--oniva-color-warning-solid'] },
  dErr: { backgroundColor: colors['--oniva-color-danger-solid'] },
  dash: { borderRadius: 2, height: 2, width: 14 },
  hCount: { color: colors['--oniva-color-text-muted'], fontVariantNumeric: 'tabular-nums' },
  hNum: { color: colors['--oniva-color-text'], fontWeight: font['--oniva-font-weight-medium'] },
  ring: { color: colors['--oniva-color-info-solid'], borderRadius: radius['--oniva-radius-full'] },
  ringWait: { animationDuration: '1.05s', color: colors['--oniva-color-warning-solid'], borderRadius: radius['--oniva-radius-full'] },
  ringErr: { color: colors['--oniva-color-danger-solid'], borderRadius: radius['--oniva-radius-full'] },
  label: { fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-medium'], maxWidth: 110, textAlign: 'center' },
  sub: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-11'], maxWidth: 110, textAlign: 'center' },
  state: { alignItems: 'center', display: 'inline-flex', fontSize: font['--oniva-font-size-11'], fontWeight: font['--oniva-font-weight-medium'], gap: 3 },
  wait: { color: colors['--oniva-color-warning-fg'] },
  err: { color: colors['--oniva-color-danger-fg'] },
  bar: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 6 },
  cardTitle: { alignItems: 'center', display: 'flex', gap: 8, justifyContent: 'space-between' },
  kv: { color: colors['--oniva-color-text-muted'], display: 'grid', fontSize: font['--oniva-font-size-12'], gap: 2, columnGap: 10, gridTemplateColumns: 'auto 1fr', margin: '8px 0 0' },
  kvv: { color: colors['--oniva-color-text'], margin: 0, fontVariantNumeric: 'tabular-nums' },
  calls: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], margin: 0, marginBlockStart: 8, paddingInlineStart: 16 },
});

interface Pt { x: number; y: number }
interface Pulse { key: string; a: Pt; b: Pt; kind: 'out' | 'back' | 'err' }

export interface AgentGraphProps {
  nodes: GraphNode[];
  /** Recent calls, newest last. A new id sends a pulse; its status turning ok/error sends the answer back. */
  calls?: GraphCall[];
  /** Links that are always there, even before their first call. */
  edges?: [string, string][];
  /** Clock override (epoch ms). */
  now?: number;
  /** How far back calls count towards link thickness. Default 20 s. */
  heatWindow?: number;
  /** A node was clicked (its card opens); `null` when the card closes. */
  onSelect?: (node: GraphNode | null) => void;
  /** Fixed height in px. */
  height?: number;
  formatCost?: (amount: number) => string;
  title?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Agents and the tools they call as a living network: pulses per call, busy links thicker, agents that breathe. */
export function AgentGraph({
  nodes,
  calls = [],
  edges = [],
  now,
  heatWindow = 20_000,
  onSelect,
  height,
  formatCost,
  title = 'Agent graph',
  className,
  xstyle,
  ref,
}: AgentGraphProps) {
  const f = useFormatters();
  const rootRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const measured = useWidth(planeRef);
  const W = measured || 640;
  const narrow = measured > 0 && measured < 520;
  const t = useNow(now, true, 1000);
  const H = height ?? Math.round(narrow ? Math.min(W * 1.2, 640) : Math.min(660, Math.max(540, W * 0.74)));
  const cost = formatCost ?? ((n: number) => f.currency(n, 'USD', { minimumFractionDigits: 2 }));
  const [sel, setSel] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [lit, setLit] = useState<Record<string, number>>({});
  const [msg, say] = useAnnouncer();
  const btns = useRef(new Map<string, HTMLButtonElement>());
  const intro = useRef(true);
  useEffect(() => {
    intro.current = false;
  }, []);
  const [landed, setLanded] = useState<Record<string, number>>({});

  // Layout: lead in the middle, agents on the inner orbit, tools/user on the outer orbit facing their agents.
  const pos = useMemo(() => {
    const out = new Map<string, Pt>();
    const agents = nodes.filter((n) => n.kind === 'agent');
    const lead = agents.find((n) => n.lead) ?? agents[0];
    const others = agents.filter((n) => n !== lead);
    const cx = W / 2;
    const cy = H * 0.47;
    const r1x = W * (narrow ? 0.24 : 0.23);
    const r1y = H * 0.23;
    const r2x = W * (narrow ? 0.38 : 0.4);
    const r2y = H * 0.36;
    if (lead) out.set(lead.id, { x: cx, y: cy });
    const ang = new Map<string, number>();
    others.forEach((n, i) => {
      const a = (others.length % 2 === 1 && others.length > 1 ? -Math.PI / 2 : 0) + (i * 2 * Math.PI) / Math.max(1, others.length);
      ang.set(n.id, a);
      out.set(n.id, { x: cx + r1x * Math.cos(a), y: cy + r1y * Math.sin(a) });
    });
    const links = new Map<string, Set<string>>();
    const add = (a: string, b: string) => {
      (links.get(a) ?? links.set(a, new Set()).get(a)!).add(b);
      (links.get(b) ?? links.set(b, new Set()).get(b)!).add(a);
    };
    edges.forEach(([a, b]) => add(a, b));
    calls.forEach((c) => add(c.from, c.to));
    const outer = nodes.filter((n) => n.kind !== 'agent');
    const target = (n: GraphNode) => {
      const as = [...(links.get(n.id) ?? [])].map((id) => ang.get(id)).filter((a): a is number => a != null);
      if (!as.length) return -Math.PI / 2;
      const sx = as.reduce((s, a) => s + Math.cos(a), 0);
      const sy = as.reduce((s, a) => s + Math.sin(a), 0);
      return Math.atan2(sy, sx);
    };
    const sorted = [...outer].sort((a, b) => ((target(a) + 2.5 * Math.PI) % (2 * Math.PI)) - ((target(b) + 2.5 * Math.PI) % (2 * Math.PI)));
    sorted.forEach((n, i) => {
      const a = -Math.PI / 2 + ((i + 0.5) * 2 * Math.PI) / Math.max(1, sorted.length);
      out.set(n.id, { x: cx + r2x * Math.cos(a), y: cy + r2y * Math.sin(a) });
    });
    return out;
  }, [nodes, calls, edges, W, H, narrow]);

  // Every node glides to its new place on a spring; a new one slides out of the first node it is linked to.
  const spawnAt = (id: string) => {
    const partner = [...edges, ...calls.map((c) => [c.from, c.to] as [string, string])]
      .map(([a, b]) => (a === id ? b : b === id ? a : null))
      .find((o): o is string => o != null && pos.has(o));
    const lead = nodes.find((n) => n.kind === 'agent');
    return pos.get(partner ?? lead?.id ?? '') ?? undefined;
  };
  const dpos = useSpringMap(pos, spawnAt);
  const lastPos = useRef(new Map<string, { x: number; y: number }>());
  dpos.forEach((v, id) => lastPos.current.set(id, v));
  const shownNodes = useLeaving(nodes, 260);
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const introDelay = (n: GraphNode, i: number) => (!intro.current ? 0 : n.kind === 'agent' ? (n.lead || i === 0 ? 0 : 90 + i * 40) : 200 + i * 35);
  const pairKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);
  const heat = new Map<string, number>();
  const pairs = new Set<string>();
  edges.forEach(([a, b]) => pairs.add(pairKey(a, b)));
  calls.forEach((c) => {
    const k = pairKey(c.from, c.to);
    pairs.add(k);
    if (t - c.at <= heatWindow) heat.set(k, (heat.get(k) ?? 0) + 1);
  });
  const maxHeat = Math.max(1, ...heat.values());

  // Pulses for new calls and for answers.
  const seen = useRef<Map<string, string | undefined>>(new Map());
  const first = useRef(true);
  useEffect(() => {
    const next: Pulse[] = [];
    const flash: Record<string, number> = {};
    for (const c of calls) {
      const a = pos.get(c.from);
      const b = pos.get(c.to);
      const had = seen.current.has(c.id);
      const prev = seen.current.get(c.id);
      if (a && b) {
        if (!had && t - c.at < 4000 && !first.current) next.push({ key: `${c.id}:out`, a, b, kind: 'out' });
        else if (!had && t - c.at < 4000 && first.current) next.push({ key: `${c.id}:out`, a, b, kind: 'out' });
        if (had && prev === 'pending' && c.status && c.status !== 'pending') {
          next.push({ key: `${c.id}:back`, a: b, b: a, kind: c.status === 'error' ? 'err' : 'back' });
          const land = c.from;
          window.setTimeout(() => setLanded((l) => ({ ...l, [land]: Date.now() })), 560);
        }
        if ((!had && t - c.at < 4000) || (had && prev !== c.status)) flash[pairKey(c.from, c.to)] = Date.now();
      }
      seen.current.set(c.id, c.status);
    }
    first.current = false;
    if (!next.length && !Object.keys(flash).length) return;
    if (prefersReducedMotion()) {
      setLit((l) => ({ ...l, ...flash }));
      const id = window.setTimeout(() => setLit({}), 900);
      return () => window.clearTimeout(id);
    }
    setPulses((p) => [...p, ...next]);
    setLit((l) => ({ ...l, ...flash }));
    const id = window.setTimeout(() => setLit({}), 900);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calls]);

  const cpm = (id: string) => {
    const m = new Map<string, number>();
    calls.forEach((c) => {
      if (t - c.at <= 60_000 && c.from === id) m.set(c.to, (m.get(c.to) ?? 0) + 1);
    });
    return m;
  };
  const totalCost = nodes.reduce((s, n) => s + (n.cost ?? 0), 0);
  const waiting = nodes.filter((n) => n.status === 'waiting');
  const failed = nodes.filter((n) => n.status === 'error');
  useEffect(() => {
    if (waiting.length) say(`${waiting.map((n) => n.name).join(', ')} needs you.`);
    else if (failed.length) say(`${failed.map((n) => n.name).join(', ')} failed.`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waiting.length, failed.length]);

  const open = (n: GraphNode | null) => {
    setSel(n?.id ?? null);
    onSelect?.(n);
  };
  const selNode = sel ? byId.get(sel) : undefined;
  const ns = narrow ? 30 : 40;
  const neighbors = (id: string) => {
    const s = new Set<string>([id]);
    pairs.forEach((k) => {
      const [a, b] = k.split('|');
      if (a === id) s.add(b!);
      if (b === id) s.add(a!);
    });
    return s;
  };
  const focusSet = hover ? neighbors(hover) : null;

  return (
    <div
      {...mergeSx(stylex.props(w1.root, styles.root, xstyle), className)}
      ref={(el) => { rootRef.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el; }}
    >
      <div {...stylex.props(w1.bar)}>
        <h3 {...stylex.props(w1.title)}>{title}</h3>
        <span {...stylex.props(w1.grow)} />
        <div {...stylex.props(styles.bar)}>
          {waiting.length > 0 && <Tag tone="warning" icon={<Clock size={11} aria-hidden="true" />}>{waiting.length} needs you</Tag>}
          {failed.length > 0 && <Tag tone="danger" icon={<AlertTriangle size={11} aria-hidden="true" />}>{failed.length} failed</Tag>}
          {!narrow && (
            <>
              <span {...stylex.props(styles.hCount)}><span {...stylex.props(styles.hNum)}>{nodes.filter((n) => n.kind === 'agent').length}</span> agents</span>
              <span {...stylex.props(styles.hCount)}><span {...stylex.props(styles.hNum)}>{nodes.filter((n) => n.kind === 'tool').length}</span> tools</span>
            </>
          )}
          <span {...stylex.props(styles.hCount)}>
            <span {...stylex.props(styles.hNum)}>{calls.filter((c) => t - c.at <= 60_000).length}</span> {calls.filter((c) => t - c.at <= 60_000).length === 1 ? 'call/min' : 'calls/min'}
          </span>
          {totalCost > 0 && <span {...stylex.props(styles.hNum, w1.num)}>{cost(totalCost)}</span>}
        </div>
      </div>
      <div ref={planeRef} {...mergeSx(stylex.props(styles.plane), undefined, { ['--gh' as string]: `${H}px`, ['--ns' as string]: `${ns}px` })}>
        <svg aria-hidden="true" viewBox={`0 0 ${W} ${H}`} {...stylex.props(styles.svg)}>
          {[...pairs].map((k) => {
            const [a, b] = k.split('|') as [string, string];
            const p = dpos.get(a) ?? pos.get(a);
            const q = dpos.get(b) ?? pos.get(b);
            if (!p || !q) return null;
            const h = heat.get(k) ?? 0;
            const dim = focusSet && !(focusSet.has(a) && focusSet.has(b));
            return (
              <line
                key={k}
                x1={p.x}
                y1={p.y}
                x2={q.x}
                y2={q.y}
                pathLength={1}
                style={{ ['--lw' as string]: 1.25 + 2.75 * (h / maxHeat), ['--d' as string]: intro.current ? 120 : 0, opacity: dim ? 0.25 : 1 }}
                {...stylex.props(styles.link, !!lit[k] && styles.linkLit)}
              />
            );
          })}
          {pulses.map((p) => (
            <PulseDot key={p.key} pulse={p} onDone={() => setPulses((l) => l.filter((x) => x.key !== p.key))} />
          ))}
        </svg>
        {shownNodes.map(({ item: n, leaving: gone }, ni) => {
          const p = gone ? lastPos.current.get(n.id) : (dpos.get(n.id) ?? pos.get(n.id));
          if (!p) return null;
          const st = n.status ?? 'idle';
          const label = `${n.name}, ${n.kind}, ${STATUS_TEXT[st].toLowerCase()}${n.doing ? `, ${n.doing}` : ''}, ${f.plural([...cpm(n.id).values()].reduce((a, b) => a + b, 0), { one: '# call', other: '# calls' })} in the last minute`;
          return (
            <button
              key={n.id}
              ref={(el) => { if (el) btns.current.set(n.id, el); else btns.current.delete(n.id); }}
              type="button"
              aria-label={label}
              aria-haspopup="dialog"
              aria-expanded={sel === n.id}
              data-dim={focusSet && !focusSet.has(n.id) ? '' : undefined}
              onClick={() => open(sel === n.id ? null : n)}
              onMouseEnter={() => setHover(n.id)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(n.id)}
              onBlur={() => setHover(null)}
              style={{ ['--x' as string]: Math.round(p.x * 10) / 10, ['--y' as string]: Math.round(p.y * 10) / 10, ['--d' as string]: introDelay(n, ni) }}
              {...stylex.props(styles.node, focus.ring, gone && styles.leaving)}
            >
              <span {...stylex.props(styles.face)}>
                {landed[n.id] ? <span key={landed[n.id]} aria-hidden="true" {...stylex.props(styles.landing)} /> : null}
                {n.kind === 'agent' ? (
                  <span {...stylex.props(styles.agentTile)}>{n.icon ?? <AgentAvatar name={n.name} size={ns - 14} />}</span>
                ) : n.kind === 'user' ? (
                  <span aria-hidden="true" {...stylex.props(styles.toolFace, styles.userFace)}>{n.icon ?? <User size={16} />}</span>
                ) : (
                  <span aria-hidden="true" {...stylex.props(styles.toolFace)}>{n.icon ?? n.name.slice(0, 2)}</span>
                )}
                {(st === 'working' || st === 'waiting' || st === 'error') && (
                  <span aria-hidden="true" {...stylex.props(w1.pulseRing, st === 'working' ? styles.ring : st === 'waiting' ? styles.ringWait : styles.ringErr)} />
                )}
              </span>
              <span aria-hidden="true" {...stylex.props(styles.label, w1.ellipsis)}>{narrow ? (n.short ?? n.name) : n.name}</span>
              {!narrow && n.detail && <span aria-hidden="true" {...stylex.props(styles.sub, w1.ellipsis)}>{n.detail}</span>}
              {(st === 'waiting' || st === 'error') && (
                <span aria-hidden="true" {...stylex.props(styles.state, st === 'waiting' ? styles.wait : styles.err)}>
                  {st === 'waiting' ? <Clock size={10} /> : <AlertTriangle size={10} />}
                  {STATUS_TEXT[st]}
                </span>
              )}
            </button>
          );
        })}
        <div aria-hidden="true" {...stylex.props(styles.legend)}>
          {([['Call', 'info'], ['Answer', 'success'], ['Needs you', 'warning'], ['Failed', 'danger']] as const).map(([l, tone]) => (
            <span key={l} {...stylex.props(styles.legendItem)}>
              <span {...stylex.props(styles.dash, tone === 'info' ? styles.dInfo : tone === 'success' ? styles.dOk : tone === 'warning' ? styles.dWarn : styles.dErr)} />
              {l}
            </span>
          ))}
        </div>
      </div>
      <Popover isOpen={!!selNode} onOpenChange={(o) => { if (!o) open(null); }} triggerRef={{ current: sel ? btns.current.get(sel) ?? null : null }} placement={narrow ? 'top' : 'right'}>
        <Dialog aria-label={selNode ? `${selNode.name} details` : 'Node details'} className={sxClass(stylex.props(w1.popover))}>
          {selNode && (
            <div>
              <div {...stylex.props(styles.cardTitle)}>
                <strong>{selNode.name}</strong>
                <Button autoFocus onPress={() => open(null)} className={() => sxClass(stylex.props(w1.iconBtn, focus.ring))} aria-label="Close">
                  ×
                </Button>
              </div>
              <dl {...stylex.props(styles.kv)}>
                <dt>Kind</dt><dd {...stylex.props(styles.kvv)}>{selNode.kind}</dd>
                <dt>Status</dt><dd {...stylex.props(styles.kvv)}>{STATUS_TEXT[selNode.status ?? 'idle']}</dd>
                {selNode.detail && <><dt>About</dt><dd {...stylex.props(styles.kvv)}>{selNode.detail}</dd></>}
                {selNode.doing && <><dt>Doing</dt><dd {...stylex.props(styles.kvv)}>{selNode.doing}</dd></>}
                {selNode.cost != null && <><dt>Cost</dt><dd {...stylex.props(styles.kvv)}>{cost(selNode.cost)}</dd></>}
              </dl>
              <ul {...stylex.props(styles.calls)}>
                {calls.filter((c) => c.from === selNode.id || c.to === selNode.id).slice(-3).reverse().map((c) => (
                  <li key={c.id}>{c.label ?? `${byId.get(c.from)?.name} → ${byId.get(c.to)?.name}`}{c.ms != null ? ` · ${c.ms} ms` : ''}{c.status === 'error' ? ' · failed' : ''}</li>
                ))}
              </ul>
            </div>
          )}
        </Dialog>
      </Popover>
      <ul {...stylex.props(w1.srOnly, w1.list)} aria-label="Agent graph summary">
        {nodes.map((n) => {
          const c = [...cpm(n.id)];
          return (
            <li key={n.id}>
              {n.name}: {STATUS_TEXT[n.status ?? 'idle']}
              {c.length ? `, called ${c.map(([id, k]) => `${byId.get(id)?.name} ${k} times`).join(', ')} in the last minute` : ''}
              {n.cost != null ? `, ${cost(n.cost)}` : ''}
            </li>
          );
        })}
      </ul>
      <LiveRegion message={msg} />
    </div>
  );
}

function PulseDot({ pulse, onDone }: { pulse: Pulse; onDone: () => void }) {
  const ref = useRef<SVGCircleElement>(null);
  const tailRefs = useRef<(SVGCircleElement | null)[]>([]);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof el.animate !== 'function') {
      onDone();
      return;
    }
    const run = (node: Element, delay: number, from: number, to: number) =>
      node.animate(
        [
          { transform: `translate(${pulse.a.x}px, ${pulse.a.y}px)`, opacity: from },
          { transform: `translate(${pulse.b.x}px, ${pulse.b.y}px)`, opacity: to },
        ],
        { duration: 650, delay, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'both' },
      );
    const a = run(el, 0, 1, 0.9);
    // Short tail: three smaller, fainter dots trailing the head along the same link.
    const tails = tailRefs.current.map((t, i) => (t ? run(t, (i + 1) * 45, 0.5 - i * 0.15, 0) : null));
    a.onfinish = onDone;
    return () => {
      a.cancel();
      tails.forEach((t) => t?.cancel());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const cls = pulse.kind === 'out' ? styles.pulse : pulse.kind === 'err' ? styles.pulseErr : styles.pulseBack;
  return (
    <g>
      {pulse.kind === 'out' &&
        [0, 1, 2].map((i) => (
          <circle key={i} ref={(n) => { tailRefs.current[i] = n; }} r={3.4 - i * 0.7} cx={0} cy={0} opacity={0} {...stylex.props(cls)} />
        ))}
      <circle ref={ref} r={4} cx={0} cy={0} {...stylex.props(cls)} />
    </g>
  );
}
