import * as stylex from '@stylexjs/stylex';
import { AlertTriangle, ChevronRight, Sparkles, Wrench, X } from 'lucide-react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { useFormatters } from '../../internal/format';
import { enterExit } from '../../internal/motion-styles';
import { usePresence } from '../../motion/Presence';
import { Shimmer } from '../../motion/Shimmer';
import { mergeSx } from '../../internal/sx';
import { prefersReducedMotion } from '../../internal/motion-hooks';
import { useRectFlip } from '../../internal/w2-flip';
import { Announcer, formatDuration, useAnnouncer, useNow, w2s } from '../../internal/w2-parts';
import { IconButton } from '../../components/IconButton';

const NARROW = '@container (max-width: 560px)';
const TINY = '@container (max-width: 360px)';

const slideIn = stylex.keyframes({
  from: { opacity: 0, transform: `translateY(${motion['--oniva-motion-travel']})` },
  to: { opacity: 1, transform: 'translateY(0)' },
});
const slideOut = stylex.keyframes({
  from: { opacity: 1, transform: 'translateY(0)' },
  to: { opacity: 0, transform: 'translateY(-4px)' },
});
const tickIn = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const sheen = stylex.keyframes({ from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(100%)' } });

const foldGhost = stylex.keyframes({
  from: { gridTemplateRows: '1fr', opacity: 1, transform: 'translateX(0)' },
  to: { gridTemplateRows: '0fr', opacity: 0, transform: 'translateX(-8px)' },
});

const styles = stylex.create({
  ghostRow: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'forwards',
    animationName: { default: foldGhost, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'grid',
    gridTemplateRows: '1fr',
    pointerEvents: 'none',
  },
  ghostInner: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'flex', fontSize: font['--oniva-font-size-13'], gap: 8, minHeight: 32, minWidth: 0, overflow: 'hidden', paddingBlock: 3 },
  root: { containerType: 'inline-size', fontFamily: font['--oniva-font-sans'], overflow: 'hidden', width: '100%' },
  bar: { alignItems: 'center', borderBottomColor: colors['--oniva-color-border'], borderBottomStyle: 'solid', borderBottomWidth: 1, display: 'flex', flexWrap: 'wrap', gap: 8, paddingBlock: 10, paddingInline: 14 },
  title: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-semibold'], margin: 0 },
  input: { color: colors['--oniva-color-text-muted'], flexGrow: 1, fontSize: font['--oniva-font-size-13'], minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  stats: { borderBottomColor: colors['--oniva-color-border'], borderBottomStyle: 'solid', borderBottomWidth: 1, display: 'grid', gridTemplateColumns: { default: 'repeat(6, minmax(0, 1fr))', [NARROW]: 'repeat(3, minmax(0, 1fr))' } },
  stat: { borderInlineStartColor: colors['--oniva-color-border'], borderInlineStartStyle: 'solid', borderInlineStartWidth: { default: 1, ':first-child': 0 }, display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, paddingBlock: 12, paddingInline: 16 },
  statLabel: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-11'], fontWeight: font['--oniva-font-weight-medium'], letterSpacing: font['--oniva-font-track-label'], textTransform: 'uppercase' },
  statValue: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-16'], fontVariantNumeric: 'tabular-nums', fontWeight: font['--oniva-font-weight-medium'] },
  headIcon: { color: colors['--oniva-color-accent-text'], display: 'inline-flex' },
  axis: { borderBottomColor: colors['--oniva-color-border'], borderBottomStyle: 'solid', borderBottomWidth: 1, display: { default: 'grid', [NARROW]: 'none' }, gridTemplateColumns: 'minmax(160px, 36%) minmax(0, 1fr)' },
  axisName: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'flex', fontSize: font['--oniva-font-size-11'], fontWeight: font['--oniva-font-weight-medium'], letterSpacing: font['--oniva-font-track-label'], paddingInline: 14, textTransform: 'uppercase' },
  ticks: { borderInlineStartColor: colors['--oniva-color-border'], borderInlineStartStyle: 'solid', borderInlineStartWidth: 1, color: colors['--oniva-color-text-muted'], display: 'flex', fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums', justifyContent: 'space-between', paddingBlock: 10, paddingInlineEnd: 2, paddingInlineStart: 8 },
  tree: { display: 'flex', flexDirection: 'column', paddingBlock: 0, paddingInline: 0 },
  avatar: { alignItems: 'center', backgroundColor: colors['--oniva-color-surface-inset'], borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-sm'], borderStyle: 'solid', borderWidth: 1, boxSizing: 'border-box', color: colors['--oniva-color-text-muted'], display: 'inline-flex', flexShrink: 0, height: 22, justifyContent: 'center', width: 22 },
  value: { alignItems: 'center', color: colors['--oniva-color-text'], display: 'flex', fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums', gap: 6, position: 'absolute', top: '50%', transform: 'translateY(-50%)', whiteSpace: 'nowrap' },
  row: {
    alignItems: 'center',
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: slideIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundColor: { default: 'transparent', ':hover': colors['--oniva-color-surface-hover'] },
    borderRadius: 0,
    columnGap: 0,
    cursor: 'pointer',
    display: 'grid',
    gridTemplateAreas: { default: '"name line"', [NARROW]: '"name" "line"' },
    gridTemplateColumns: { default: 'minmax(160px, 36%) minmax(0, 1fr)', [NARROW]: 'minmax(0, 1fr)' },
    minHeight: 38,
    outlineStyle: 'none',
    paddingBlock: 0,
    paddingInline: 0,
    rowGap: 0,
    transitionDuration: motion['--oniva-motion-dur-instant'],
    transitionProperty: 'background-color',
  },
  rowLeaving: {
    animationDuration: motion['--oniva-motion-dur-base'],
    animationFillMode: 'forwards',
    animationName: { default: slideOut, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    pointerEvents: 'none',
  },
  tick: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: tickIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  rowFocus: { boxShadow: { default: 'none', ':focus-visible': `inset 0 0 0 2px ${colors['--oniva-color-focus-ring']}` } },
  rowOpen: { backgroundColor: colors['--oniva-color-accent-soft'] },
  name: { alignItems: 'center', display: 'flex', gap: 6, gridArea: 'name', minWidth: 0, paddingInlineStart: 8 },
  chev: { alignItems: 'center', color: colors['--oniva-color-icon-muted'], display: 'inline-flex', flexShrink: 0, height: 16, justifyContent: 'center', transitionDuration: motion['--oniva-motion-dur-base'], transitionProperty: 'transform', transitionTimingFunction: motion['--oniva-motion-ease-out'], width: 16 },
  chevOpen: { transform: 'rotate(90deg)' },
  swatch: { borderRadius: radius['--oniva-radius-xs'], flexShrink: 0, height: 8, width: 8 },
  label: { color: colors['--oniva-color-text'], flexShrink: 1, fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-medium'], minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  detail: { color: colors['--oniva-color-text-muted'], display: { default: 'inline', [TINY]: 'none' }, fontSize: font['--oniva-font-size-12'], minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  line: {
    backgroundImage: `repeating-linear-gradient(to right, ${colors['--oniva-color-separator']} 0, ${colors['--oniva-color-separator']} 1px, transparent 1px, transparent 25%)`,
    alignSelf: 'stretch',
    borderInlineStartColor: { default: colors['--oniva-color-border'], [NARROW]: 'transparent' },
    borderInlineStartStyle: 'solid',
    borderInlineStartWidth: 1,
    gridArea: 'line',
    minHeight: 38,
    position: 'relative',
  },
  span: { borderRadius: radius['--oniva-radius-sm'], height: 10, minWidth: 3, overflow: 'hidden', position: 'absolute', top: 'calc(50% - 5px)' },
  kAgent: { backgroundColor: colors['--oniva-color-icon-muted'] },
  kSub: { backgroundColor: colors['--oniva-color-text-muted'] },
  kLlm: { backgroundColor: colors['--oniva-color-chart-3'] },
  kTool: { backgroundColor: colors['--oniva-color-chart-2'] },
  kFailed: { backgroundColor: colors['--oniva-color-danger-solid'] },
  shine: { animationDuration: '1.6s', animationIterationCount: 'infinite', animationName: { default: sheen, [media.reducedMotion]: 'none' }, animationTimingFunction: 'linear', backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)', inset: 0, position: 'absolute' },
  mark: { backgroundColor: colors['--oniva-color-surface-inner'], borderRadius: 1, height: 6, opacity: 0.8, position: 'absolute', top: 'calc(50% - 3px)', width: 2 },
  nowLine: { backgroundColor: colors['--oniva-color-accent-text'], bottom: 0, position: 'absolute', top: 0, width: 1 },
  cost: { color: colors['--oniva-color-text-muted'] },
  dialog: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    margin: 8,
    padding: 12,
    transformOrigin: 'top center',
  },
  dHead: { alignItems: 'center', display: 'flex', gap: 8 },
  dTitle: { color: colors['--oniva-color-text'], flexGrow: 1, fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-semibold'], margin: 0 },
  dl: { columnGap: 12, display: 'grid', fontSize: font['--oniva-font-size-12'], gridTemplateColumns: { default: 'repeat(4, minmax(0, auto))', [NARROW]: 'repeat(2, minmax(0, auto))' }, justifyContent: 'start', margin: 0, rowGap: 6 },
  dt: { color: colors['--oniva-color-text-muted'], margin: 0 },
  dd: { color: colors['--oniva-color-text'], fontVariantNumeric: 'tabular-nums', margin: 0 },
  pre: { backgroundColor: colors['--oniva-color-surface-inset'], borderRadius: radius['--oniva-radius-md'], color: colors['--oniva-color-text'], fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-12'], margin: 0, maxHeight: 120, overflow: 'auto', padding: 8, whiteSpace: 'pre-wrap' },
  err: { color: colors['--oniva-color-danger-fg'] },
});

export type SpanKind = 'agent' | 'subagent' | 'llm' | 'tool';
export type SpanStatus = 'running' | 'done' | 'failed';

export interface TraceSpan {
  id: string;
  name: string;
  kind: SpanKind;
  status: SpanStatus;
  /** Milliseconds from the start of the run. */
  start: number;
  /** Leave out while it runs. */
  end?: number;
  /** A few muted words after the name, e.g. the model or query. */
  detail?: string;
  icon?: ReactNode;
  model?: string;
  tokensIn?: number;
  tokensOut?: number;
  /** Dollars, the span's own. Agents add up their children. */
  cost?: number;
  input?: string;
  output?: string;
  error?: string;
  children?: TraceSpan[];
}

export interface TraceWaterfallProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children' | 'title'> {
  root: TraceSpan;
  /** Clock in ms from the start of the run. */
  now?: number;
  /** Epoch ms the run started; ticks its own clock while a span runs. */
  startedAt?: number;
  collapsed?: string[];
  defaultCollapsed?: string[];
  onCollapsedChange?: (collapsed: string[]) => void;
  openId?: string | null;
  defaultOpenId?: string | null;
  onOpenChange?: (id: string | null, span?: TraceSpan) => void;
  markSlowest?: boolean;
  /** Shortest axis, in ms. */
  minRange?: number;
  formatCost?: (amount: number) => string;
  title?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const STEPS = [10, 15, 20, 30, 45, 60, 90, 120, 180, 300, 600, 900, 1800, 3600, 7200, 14400, 28800, 86400].map((s) => s * 1000);
/** Smallest round axis length (ms) that holds `extent` with a little headroom, never below `min`. */
export function niceRange(extent: number, min = 10_000): number {
  const need = Math.max(min, extent * 1.04);
  return STEPS.find((s) => s >= need) ?? Math.ceil(need / 86_400_000) * 86_400_000;
}

interface Flat {
  leaving?: boolean;
  span: TraceSpan;
  level: number;
  parent?: string;
  start: number;
  end: number;
  tokensIn: number;
  tokensOut: number;
  cost: number;
  hasKids: boolean;
}

const kindStyle = { agent: styles.kAgent, subagent: styles.kSub, llm: styles.kLlm, tool: styles.kTool } as const;
const kindName = { agent: 'agent', subagent: 'sub-agent', llm: 'LLM call', tool: 'tool call' } as const;

/** Where the time and money of an agent run go: every LLM call, tool call and sub-agent as a bar on a live timeline, the slowest call marked, branches that fold. */
export function TraceWaterfall({
  root,
  now: nowProp,
  startedAt,
  collapsed: collapsedProp,
  defaultCollapsed = [],
  onCollapsedChange,
  openId: openProp,
  defaultOpenId = null,
  onOpenChange,
  markSlowest = true,
  minRange = 10_000,
  formatCost,
  title = 'Trace',
  className,
  xstyle,
  ref,
  ...rest
}: TraceWaterfallProps) {
  const f = useFormatters();
  const [collapsedState, setCollapsedState] = useState<string[]>(defaultCollapsed);
  const [openState, setOpenState] = useState<string | null>(defaultOpenId);
  const [focusId, setFocusId] = useState<string>(root.id);
  const [foldingId, setFoldingId] = useState<string | null>(null);
  const treeRef = useRef<HTMLDivElement | null>(null);
  useRectFlip(treeRef);
  useEffect(() => {
    if (!foldingId) return;
    const t = window.setTimeout(() => setFoldingId(null), 420);
    return () => window.clearTimeout(t);
  }, [foldingId]);
  const rowRefs = useRef(new Map<string, HTMLDivElement>());
  const { message, announce } = useAnnouncer();
  const collapsed = collapsedProp ?? collapsedState;
  const openId = openProp !== undefined ? openProp : openState;

  const anyRunning = useMemo(() => {
    const walk = (s: TraceSpan): boolean => s.status === 'running' || !!s.children?.some(walk);
    return walk(root);
  }, [root]);
  const clock = useNow(anyRunning && nowProp === undefined && startedAt !== undefined, 200);
  const nowMs = nowProp ?? (startedAt !== undefined ? Math.max(0, clock - startedAt) : undefined);

  const { rows, all, extent, slowest } = useMemo(() => {
    const out: Flat[] = [];
    const every: Flat[] = [];
    let maxEnd = 0;
    const visit = (s: TraceSpan, level: number, parent: string | undefined, hidden: boolean, leave = false): Flat => {
      const kids = s.children ?? [];
      const flat: Flat = { span: s, level, parent, start: s.start, end: 0, tokensIn: s.tokensIn ?? 0, tokensOut: s.tokensOut ?? 0, cost: s.cost ?? 0, hasKids: kids.length > 0, leaving: leave };
      if (!hidden) out.push(flat);
      every.push(flat);
      const hide = hidden || (collapsed.includes(s.id) && foldingId !== s.id);
      let kidEnd = s.start;
      for (const k of kids) {
        const kf = visit(k, level + 1, s.id, hide, leave || foldingId === s.id);
        kidEnd = Math.max(kidEnd, kf.end);
        flat.tokensIn += kids.length ? kf.tokensIn : 0;
        flat.tokensOut += kf.tokensOut;
        flat.cost += kf.cost;
      }
      const live = s.status === 'running';
      flat.end = s.end ?? (live ? Math.max(nowMs ?? kidEnd, kidEnd, s.start) : kidEnd);
      maxEnd = Math.max(maxEnd, flat.end);
      return flat;
    };
    visit(root, 0, undefined, false);
    let slow: Flat | undefined;
    for (const x of every) {
      if ((x.span.kind === 'llm' || x.span.kind === 'tool') && x.span.status === 'done' && (!slow || x.end - x.start > slow.end - slow.start)) slow = x;
    }
    return { rows: out, all: every, extent: maxEnd, slowest: slow?.span.id };
  }, [root, collapsed, nowMs, foldingId]);

  const range = niceRange(Math.max(extent, nowMs ?? 0), minRange);
  const money = formatCost ?? ((n: number) => f.currency(n, 'USD', { minimumFractionDigits: n < 1 ? 3 : 2, maximumFractionDigits: n < 1 ? 3 : 2 }));
  const rootFlat = all.find((x) => x.span.id === root.id)!;
  const state = anyRunning ? 'Live' : all.some((x) => x.span.status === 'failed') ? 'Failed' : 'Done';
  const sx = stylex.props(aiStyles.panel, styles.root, xstyle);
  const setCollapsed = (next: string[]) => {
    if (collapsedProp === undefined) setCollapsedState(next);
    onCollapsedChange?.(next);
  };
  const setOpen = (id: string | null) => {
    if (openProp === undefined) setOpenState(id);
    onOpenChange?.(id, id ? all.find((x) => x.span.id === id)?.span : undefined);
  };
  const toggleFold = (id: string) => {
    const is = collapsed.includes(id);
    setFoldingId(!is && !prefersReducedMotion() && typeof Element.prototype.animate === 'function' ? id : null);
    setCollapsed(is ? collapsed.filter((c) => c !== id) : [...collapsed, id]);
    announce(`${all.find((x) => x.span.id === id)?.span.name} ${is ? 'expanded' : 'collapsed'}`);
  };
  const focusRow = (id: string) => {
    setFocusId(id);
    rowRefs.current.get(id)?.focus();
  };
  const onRowKey = (e: KeyboardEvent<HTMLDivElement>, r: Flat, i: number) => {
    const id = r.span.id;
    const go = (j: number) => {
      if (!rows[j]) return;
      e.preventDefault();
      focusRow(rows[j]!.span.id);
    };
    if (e.key === 'ArrowDown') go(i + 1);
    else if (e.key === 'ArrowUp') go(i - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(rows.length - 1);
    else if (e.key === 'ArrowRight') {
      if (r.hasKids && collapsed.includes(id)) {
        e.preventDefault();
        toggleFold(id);
      }
      else if (r.hasKids) go(i + 1);
    } else if (e.key === 'ArrowLeft') {
      if (r.hasKids && !collapsed.includes(id)) {
        e.preventDefault();
        toggleFold(id);
      }
      else if (r.parent) {
        e.preventDefault();
        focusRow(r.parent);
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(openId === id ? null : id);
    }
  };

  const open = openId ? all.find((x) => x.span.id === openId) : undefined;

  // A new run: the previous run's rows close up a beat after each other, bottom first, before the new ones slide in.
  const lastRows = useRef<Array<{ id: string; name: string; level: number; kind: SpanKind; failed: boolean }>>([]);
  const lastRootId = useRef(root.id);
  const [ghostRows, setGhostRows] = useState<typeof lastRows.current>([]);
  useLayoutEffect(() => {
    if (lastRootId.current !== root.id) {
      lastRootId.current = root.id;
      if (!prefersReducedMotion() && typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function' && lastRows.current.length) {
        const g = lastRows.current;
        setGhostRows(g);
        const t = window.setTimeout(() => setGhostRows([]), Math.min(g.length, 7) * 30 + 360);
        lastRows.current = rows.map((r) => ({ id: r.span.id, name: r.span.name, level: r.level, kind: r.span.kind, failed: r.span.status === 'failed' }));
        return () => window.clearTimeout(t);
      }
    }
    lastRows.current = rows.map((r) => ({ id: r.span.id, name: r.span.name, level: r.level, kind: r.span.kind, failed: r.span.status === 'failed' }));
  }, [root.id, rows]);

  // The details window opens from the row's bar and closes the same way.
  const lastOpen = useRef(open);
  if (open) lastOpen.current = open;
  const dlg = usePresence(!!open, { initial: true });
  const canAnimate = !prefersReducedMotion() && typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function';
  const shownOpen = canAnimate ? (open ?? (dlg.mounted ? lastOpen.current : undefined)) : open;
  const tickCount = 4;
  const pct = (ms: number) => `${Math.min(100, Math.max(0, (ms / range) * 100))}%`;

  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      <div {...stylex.props(styles.bar)}>
        <Sparkles size={14} aria-hidden="true" {...stylex.props(styles.headIcon)} />
        <h4 {...stylex.props(styles.title)}>{title}</h4>
        <span {...stylex.props(styles.input)}>{root.input ?? root.name}</span>
        <span {...stylex.props(w2s.tag, state === 'Live' ? w2s.tagInfo : state === 'Failed' ? w2s.tagDanger : w2s.tagSuccess)}>
          <span aria-hidden="true" {...stylex.props(state === 'Live' && w2s.pulse)}>●</span> {state}
        </span>
      </div>
      <div {...stylex.props(styles.stats)}>
        {([
          ['Duration', <Shimmer key="d" isActive={anyRunning}>{formatDuration(rootFlat.end - rootFlat.start, anyRunning)}</Shimmer>],
          ['Cost', money(rootFlat.cost)],
          ['Tokens', f.compact(rootFlat.tokensIn + rootFlat.tokensOut)],
          ['LLM calls', all.filter((x) => x.span.kind === 'llm').length],
          ['Tool calls', all.filter((x) => x.span.kind === 'tool').length],
          ['Errors', all.filter((x) => x.span.status === 'failed').length],
        ] as [string, ReactNode][]).map(([k, v]) => (
          <div key={k} {...stylex.props(styles.stat)}>
            <span {...stylex.props(styles.statLabel)}>{k}</span>
            <span {...stylex.props(styles.statValue)}>{v}</span>
          </div>
        ))}
      </div>
      <div aria-hidden="true" {...stylex.props(styles.axis)}>
        <div {...stylex.props(styles.axisName)}>Span</div>
        <div {...stylex.props(styles.ticks)}>
          {Array.from({ length: tickCount + 1 }, (_, i) => (
            (() => { const t = formatDuration((range / tickCount) * i).replace(/^1ms$/, '0s'); return <span key={`${i}-${t}`} {...stylex.props(styles.tick)}>{t}</span>; })()
          ))}
        </div>
      </div>
      <div ref={treeRef} role="tree" aria-label={`${title}: spans`} {...stylex.props(styles.tree)}>
        {ghostRows.map((g, gi) => (
          <div key={`ghost-${g.id}`} aria-hidden="true" style={{ animationDelay: `${Math.min(ghostRows.length - 1 - gi, 6) * 30}ms` }} {...stylex.props(styles.ghostRow)}>
            <div style={{ paddingInlineStart: g.level * 14 + 16 }} {...stylex.props(styles.ghostInner)}>
              <span aria-hidden="true" {...stylex.props(styles.swatch, g.failed ? styles.kFailed : kindStyle[g.kind])} />
              <span {...stylex.props(styles.label)}>{g.name}</span>
            </div>
          </div>
        ))}
        {rows.map((r, i) => {
          const s = r.span;
          const live = s.status === 'running';
          const isOpen = openId === s.id;
          const folded = collapsed.includes(s.id);
          const dur = r.end - r.start;
          const label = `${s.name}, ${kindName[s.kind]}, ${s.status}, ${formatDuration(dur, live)}${r.cost ? `, ${money(r.cost)}` : ''}`;
          return (
            <div
              key={s.id}
              ref={(el) => {
                if (el) rowRefs.current.set(s.id, el);
                else rowRefs.current.delete(s.id);
              }}
              role="treeitem"
              aria-level={r.level + 1}
              aria-expanded={r.hasKids ? !folded : undefined}
              aria-selected={isOpen}
              aria-label={label}
              tabIndex={focusId === s.id || (!rows.some((x) => x.span.id === focusId) && i === 0) ? 0 : -1}
              onFocus={() => setFocusId(s.id)}
              onKeyDown={(e) => onRowKey(e, r, i)}
              onClick={() => setOpen(isOpen ? null : s.id)}
              data-flip-id={`row-${s.id}`}
              data-flip-noenter=""
              style={{ animationDelay: r.leaving ? `${Math.min(rows.filter((x) => x.leaving).length - 1 - rows.filter((x) => x.leaving).indexOf(r), 6) * 30}ms` : `${(ghostRows.length ? 160 : 0) + Math.min(i, 8) * 30}ms` }}
              {...stylex.props(styles.row, styles.rowFocus, isOpen && styles.rowOpen, r.leaving && styles.rowLeaving)}
            >
              <div style={{ paddingInlineStart: r.level * 14 }} {...stylex.props(styles.name)}>
                <span
                  aria-hidden="true"
                  onClick={(e) => {
                    if (r.hasKids) {
                      e.stopPropagation();
                      toggleFold(s.id);
                    }
                  }}
                  {...stylex.props(styles.chev, r.hasKids && !folded && styles.chevOpen)}
                >
                  {r.hasKids && <ChevronRight size={12} />}
                </span>
                <span aria-hidden="true" {...stylex.props(styles.avatar)}>{s.icon ?? (s.kind === 'tool' ? <Wrench size={12} /> : <Sparkles size={12} />)}</span>
                <span {...stylex.props(styles.label)} title={s.name}>{s.name}</span>
                {s.detail && <span {...stylex.props(styles.detail)}>{s.detail}</span>}
                {s.status === 'failed' && <AlertTriangle size={12} aria-hidden="true" {...stylex.props(styles.err)} />}
              </div>
              <div aria-hidden="true" {...stylex.props(styles.line)}>
                <span data-flip-id={`bar-${s.id}`} style={{ left: pct(r.start), width: `calc(${pct(r.end)} - ${pct(r.start)})` }} {...stylex.props(styles.span, s.status === 'failed' ? styles.kFailed : kindStyle[s.kind], folded && r.hasKids && styles.kAgent)}>
                  {live && <span {...stylex.props(styles.shine)} />}
                </span>
                {folded &&
                  s.children?.map((c) => {
                    const cf = all.find((x) => x.span.id === c.id)!;
                    return <span key={c.id} data-flip-id={`mark-${c.id}`} style={{ left: pct(cf.start) }} {...stylex.props(styles.mark)} />;
                  })}
                <span style={r.end / range > 0.78 ? { right: `calc(100% - ${pct(r.start)} + 8px)` } : { left: `calc(${pct(r.end)} + 8px)` }} {...stylex.props(styles.value)}>
                  <span><Shimmer isActive={live}>{formatDuration(dur, live)}</Shimmer></span>
                  {r.cost ? <span {...stylex.props(styles.cost)}>· {money(r.cost)}</span> : null}
                  {markSlowest && slowest === s.id && <span {...stylex.props(w2s.tag, w2s.tagWarning)}>Slowest</span>}
                </span>
                {anyRunning && nowMs !== undefined && <span data-flip-id={`now-${s.id}`} style={{ left: pct(nowMs) }} {...stylex.props(styles.nowLine)} />}
              </div>
            </div>
          );
        })}
      </div>
      {shownOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={`${shownOpen.span.name} details`}
          data-state={!canAnimate ? 'entering' : open ? (dlg.state === 'exiting' ? 'entering' : dlg.state) : 'exiting'}
          onAnimationEnd={canAnimate ? dlg.presenceProps.onAnimationEnd : undefined}
          style={{ transformOrigin: `${pct(shownOpen.start)} 0` }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.stopPropagation();
              setOpen(null);
              rowRefs.current.get(shownOpen.span.id)?.focus();
            }
          }}
          {...stylex.props(styles.dialog, enterExit.scale)}
        >
          <div {...stylex.props(styles.dHead)}>
            <h5 {...stylex.props(styles.dTitle)}>{shownOpen.span.name}</h5>
            <IconButton
              size="xs"
              variant="ghost"
              aria-label="Close details"
              onPress={() => {
                setOpen(null);
                rowRefs.current.get(shownOpen.span.id)?.focus();
              }}
            >
              <X size={12} aria-hidden="true" />
            </IconButton>
          </div>
          <dl {...stylex.props(styles.dl)}>
            <div><dt {...stylex.props(styles.dt)}>Kind</dt><dd {...stylex.props(styles.dd)}>{kindName[shownOpen.span.kind]}{shownOpen.span.model ? ` · ${shownOpen.span.model}` : ''}</dd></div>
            <div><dt {...stylex.props(styles.dt)}>Status</dt><dd {...stylex.props(styles.dd)}>{shownOpen.span.status}</dd></div>
            <div><dt {...stylex.props(styles.dt)}>Duration</dt><dd {...stylex.props(styles.dd)}>{formatDuration(shownOpen.end - shownOpen.start, shownOpen.span.status === 'running')}</dd></div>
            <div><dt {...stylex.props(styles.dt)}>Starts at</dt><dd {...stylex.props(styles.dd)}>{formatDuration(shownOpen.start)}</dd></div>
            {(shownOpen.tokensIn > 0 || shownOpen.tokensOut > 0) && (
              <div><dt {...stylex.props(styles.dt)}>Tokens in / out</dt><dd {...stylex.props(styles.dd)}>{f.number(shownOpen.tokensIn)} / {f.number(shownOpen.tokensOut)}</dd></div>
            )}
            {shownOpen.cost > 0 && <div><dt {...stylex.props(styles.dt)}>Cost</dt><dd {...stylex.props(styles.dd)}>{money(shownOpen.cost)}</dd></div>}
          </dl>
          {shownOpen.span.input && <pre aria-label="Input" tabIndex={0} {...stylex.props(styles.pre)}>{shownOpen.span.input}</pre>}
          {shownOpen.span.output && <pre aria-label="Output" tabIndex={0} {...stylex.props(styles.pre)}>{shownOpen.span.output}</pre>}
          {shownOpen.span.error && <pre aria-label="Error" tabIndex={0} {...stylex.props(styles.pre, styles.err)}>{shownOpen.span.error}</pre>}
        </div>
      )}
      <Announcer message={message || `Run ${state.toLowerCase()}`} />
    </div>
  );
}
