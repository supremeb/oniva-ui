import * as stylex from '@stylexjs/stylex';
import { Check, ClipboardCheck, Link2, Pencil, SkipForward, Sparkles, Undo2, X } from 'lucide-react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { prefersReducedMotion } from '../../internal/motion-hooks';
import { enterExit } from '../../internal/motion-styles';
import { mergeSx } from '../../internal/sx';
import { useListFlip } from '../../internal/w2-flip';
import { Announcer, FlaggedSpans, flagIds, flaggedToString, useAnnouncer, useNow, type FlaggedText, w2s } from '../../internal/w2-parts';
import { Button } from '../../components/Button';
import { Kbd } from '../../components/Kbd';
import { SegmentedControl, SegmentedControlItem } from '../../components/SegmentedControl';
import { FileDiff } from '../FileDiff';

const WIDE = '@container (min-width: 640px)';
const TINY = '@container (max-width: 420px)';

const closeRow = stylex.keyframes({
  from: { gridTemplateRows: '1fr', opacity: 1, transform: 'translateY(0)' },
  to: { gridTemplateRows: '0fr', opacity: 0, transform: 'translateY(-4px)' },
});

const arrive = stylex.keyframes({
  from: { backgroundColor: colors['--oniva-color-accent-soft'], gridTemplateRows: '0fr', opacity: 0 },
  '35%': { backgroundColor: colors['--oniva-color-accent-soft'], gridTemplateRows: '1fr', opacity: 1 },
  to: { backgroundColor: 'transparent', gridTemplateRows: '1fr', opacity: 1 },
});
const noteIn = stylex.keyframes({ from: { opacity: 0, transform: 'scale(0.96)' }, to: { opacity: 1, transform: 'scale(1)' } });

const styles = stylex.create({
  arrive: {
    animationDuration: '1400ms',
    animationFillMode: 'backwards',
    animationName: { default: arrive, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    borderRadius: radius['--oniva-radius-md'],
    display: 'grid',
    gridTemplateRows: '1fr',
  },
  arriveInner: { minHeight: 0 },
  note: {
    animationDelay: '90ms',
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: noteIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    transformOrigin: 'top left',
  },
  ghost: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'forwards',
    animationName: { default: closeRow, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'grid',
    gridTemplateRows: '1fr',
    pointerEvents: 'none',
  },
  ghostInner: { minHeight: 0, overflow: 'hidden' },
  ghostMark: { color: colors['--oniva-color-text-muted'], fontSize: 12 },
  root: { containerType: 'inline-size', fontFamily: font['--oniva-font-sans'], outlineStyle: 'none', overflow: 'hidden', width: '100%' },
  bar: { alignItems: 'center', borderBottomColor: colors['--oniva-color-border'], borderBottomStyle: 'solid', borderBottomWidth: 1, display: 'flex', flexWrap: 'wrap', gap: 10, paddingBlock: 10, paddingInline: 14 },
  title: { alignItems: 'center', color: colors['--oniva-color-text'], display: 'inline-flex', fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-semibold'], gap: 6, margin: 0 },
  progress: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'flex', flexGrow: 1, fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums', gap: 8, minWidth: 120 },
  track: { backgroundColor: colors['--oniva-color-chart-track'], borderRadius: radius['--oniva-radius-full'], flexGrow: 1, height: 4, maxWidth: 160, overflow: 'hidden' },
  fill: { backgroundColor: colors['--oniva-color-success-solid'], display: 'block', height: '100%', transformOrigin: 'left center', transitionDuration: motion['--oniva-motion-dur-slower'], transitionProperty: 'transform', transitionTimingFunction: motion['--oniva-motion-ease-out'], width: '100%' },
  work: { display: 'grid', gridTemplateColumns: { default: 'minmax(0, 1fr)', [WIDE]: '240px minmax(0, 1fr)' }, height: { default: 'auto', [WIDE]: 'var(--oniva-review-height, 460px)' } },
  queueCol: { borderBottomColor: colors['--oniva-color-border'], borderBottomStyle: { default: 'solid', [WIDE]: 'none' }, borderBottomWidth: 1, borderInlineEndColor: colors['--oniva-color-border'], borderInlineEndStyle: { default: 'none', [WIDE]: 'solid' }, borderInlineEndWidth: 1, display: 'flex', flexDirection: 'column', minHeight: 0, minWidth: 0 },
  tabs: { borderBottomColor: colors['--oniva-color-border'], borderBottomStyle: 'solid', borderBottomWidth: 1, paddingBlock: 8, paddingInline: 10 },
  cnt: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-11'], fontVariantNumeric: 'tabular-nums', marginInlineStart: 4 },
  oldest: { color: colors['--oniva-color-text-muted'] },
  avatar: { alignItems: 'center', backgroundColor: colors['--oniva-color-surface-inset'], borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-md'], borderStyle: 'solid', borderWidth: 1, boxSizing: 'border-box', color: colors['--oniva-color-text-muted'], display: 'inline-flex', flexShrink: 0, height: 28, justifyContent: 'center', width: 28 },
  avatarLg: { height: 36, width: 36 },
  qText: { display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 },
  dTop: { alignItems: 'center', display: 'flex', gap: 10 },
  dWho: { alignItems: 'center', color: colors['--oniva-color-text'], display: 'flex', flexWrap: 'wrap', fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-medium'], gap: 6 },
  dModel: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'] },
  why: { color: colors['--oniva-color-text'], fontWeight: font['--oniva-font-weight-medium'] },
  links: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'flex', flexWrap: 'wrap', fontSize: font['--oniva-font-size-12'], gap: 14 },
  link: { alignItems: 'center', display: 'inline-flex', gap: 5 },
  hint: { opacity: 0.8, display: { default: 'inline-flex', [TINY]: 'none' } },
  queue: { display: 'flex', flexDirection: 'column', gap: 2, listStyle: 'none', margin: 0, maxHeight: { default: 132, [WIDE]: 'none' }, minHeight: 0, flexGrow: 1, overflowY: 'auto', padding: 6 },
  qRow: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: { default: 'transparent', ':hover': colors['--oniva-color-surface-hover'] },
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'grid',
    fontFamily: 'inherit',
    columnGap: 10,
    rowGap: 0,
    gridTemplateColumns: 'auto minmax(0, 1fr) auto',
    paddingBlock: 8,
    paddingInline: 8,
    textAlign: 'start',
    width: '100%',
  },
  qCurrent: { backgroundColor: colors['--oniva-color-accent-soft'] },
  qTitle: { fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-medium'], overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  qMeta: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  wait: { fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums' },
  waitOk: { color: colors['--oniva-color-text-muted'] },
  waitWarn: { color: colors['--oniva-color-warning-fg'] },
  waitLate: { color: colors['--oniva-color-danger-fg'] },
  detail: { display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0, outlineStyle: 'none', overflowY: 'auto', padding: 14 },
  dHead: { display: 'flex', flexDirection: 'column', gap: 4 },
  dTitle: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-16'], fontWeight: font['--oniva-font-weight-semibold'], lineHeight: font['--oniva-font-lh-20'], margin: 0 },
  reasoning: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], lineHeight: font['--oniva-font-lh-18'], margin: 0 },
  sec: { display: 'flex', flexDirection: 'column', gap: 6 },
  secTitle: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-11'], fontWeight: font['--oniva-font-weight-medium'], letterSpacing: font['--oniva-font-track-label'], margin: 0, textTransform: 'uppercase' },
  fields: { backgroundColor: colors['--oniva-color-surface-inset'], borderRadius: radius['--oniva-radius-md'], columnGap: 12, display: 'grid', fontSize: font['--oniva-font-size-13'], gridTemplateColumns: 'minmax(80px, auto) minmax(0, 1fr)', margin: 0, padding: 10, rowGap: 6 },
  fk: { color: colors['--oniva-color-text-muted'], margin: 0 },
  fv: { color: colors['--oniva-color-text'], fontVariantNumeric: 'tabular-nums', margin: 0, overflowWrap: 'anywhere' },
  body: { backgroundColor: colors['--oniva-color-surface-inset'], borderRadius: radius['--oniva-radius-md'], color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-13'], lineHeight: font['--oniva-font-lh-18'], margin: 0, padding: 10, whiteSpace: 'pre-wrap' },
  code: { fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-12'], overflowX: 'auto', whiteSpace: 'pre' },
  cAdd: { backgroundColor: colors['--oniva-color-success-bg'], display: 'block' },
  cDel: { backgroundColor: colors['--oniva-color-error-bg'], display: 'block' },
  cCtx: { display: 'block' },
  edit: { backgroundColor: colors['--oniva-color-surface-inner'], borderColor: { default: colors['--oniva-color-border-control'], ':focus': colors['--oniva-color-text'] }, borderRadius: radius['--oniva-radius-md'], borderStyle: 'solid', borderWidth: 1, boxSizing: 'border-box', color: colors['--oniva-color-text'], fontFamily: 'inherit', fontSize: font['--oniva-font-size-13'], lineHeight: font['--oniva-font-lh-18'], minHeight: 96, outlineStyle: 'none', padding: 8, resize: 'vertical', width: '100%' },
  input: { backgroundColor: colors['--oniva-color-surface-inner'], borderColor: { default: colors['--oniva-color-border-control'], ':focus': colors['--oniva-color-text'] }, borderRadius: radius['--oniva-radius-sm'], borderStyle: 'solid', borderWidth: 1, boxSizing: 'border-box', color: colors['--oniva-color-text'], fontFamily: 'inherit', fontSize: font['--oniva-font-size-13'], outlineStyle: 'none', padding: 4, width: '100%' },
  steps: { display: 'flex', flexDirection: 'column', gap: 6, margin: 0, paddingInlineStart: 22 },
  step: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-13'] },
  stepFlag: { color: colors['--oniva-color-warning-fg'] },
  stepDetail: { color: colors['--oniva-color-text-muted'], display: 'block', fontSize: font['--oniva-font-size-12'] },
  actions: { alignItems: 'center', borderTopColor: colors['--oniva-color-border'], borderTopStyle: 'solid', borderTopWidth: 1, display: 'flex', flexWrap: 'wrap', gap: 6, marginBlockStart: 'auto', paddingBlockStart: 10 },
  grow: { flexGrow: { default: 0, [TINY]: 1 } },
  icon: { display: { default: 'inline', [TINY]: 'none' } },
  flagCount: { color: colors['--oniva-color-text-muted'], display: { default: 'inline', [TINY]: 'none' }, fontSize: font['--oniva-font-size-12'], marginInlineStart: 'auto' },
  reasons: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 6 },
  empty: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'flex', flexDirection: 'column', fontSize: font['--oniva-font-size-13'], gap: 8, justifyContent: 'center', padding: 32, textAlign: 'center' },
});

export type ReviewRisk = 'high' | 'medium' | 'low';
export type ReviewFilter = 'all' | 'high' | 'unsure';

export interface ReviewField {
  label: string;
  value: FlaggedText;
}
export interface ReviewFile {
  path: string;
  added?: number;
  removed?: number;
  /** Unified diff starting at the first `@@` hunk header. */
  diff?: string;
}
export interface ReviewStep {
  title: string;
  tool?: string;
  detail?: string;
  /** Marks the step as one the agent is unsure about. */
  flagged?: boolean;
}
export interface ReviewItem {
  id: string;
  title: string;
  agent: string;
  model?: string;
  icon?: ReactNode;
  type: string;
  risk: ReviewRisk;
  /** 0 to 1. */
  confidence: number;
  /** Epoch ms the item started waiting. */
  createdAt: number;
  reasoning?: string;
  fields?: ReviewField[];
  body?: FlaggedText;
  bodyLabel?: string;
  /** `code` shows the body as a diff. */
  format?: 'text' | 'code';
  files?: ReviewFile[];
  steps?: ReviewStep[];
  /** Related references shown under the detail (a PR, a run). */
  links?: { label: string; icon?: ReactNode }[];
}
export interface ReviewResult {
  decision: 'approved' | 'rejected';
  reason?: string;
  /** Edited body, only if the reviewer changed it. */
  text?: string;
  /** Edited fields (label to value), only if the reviewer changed them. */
  fields?: Record<string, string>;
}

export interface ReviewCenterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children' | 'title'> {
  items: ReviewItem[];
  onDecide?: (item: ReviewItem, result: ReviewResult) => void;
  onUndo?: (item: ReviewItem, result: ReviewResult) => void;
  onSkip?: (item: ReviewItem) => void;
  /** Reviewed before (e.g. today); the header counts on from here. */
  reviewed?: number;
  total?: number;
  /** How long an item may wait, in ms. Waiting turns amber at 75% and red past it. */
  sla?: number;
  /** Clock (epoch ms). Ticks every 10s by default. */
  now?: number;
  /** Below this confidence an item is Unsure. */
  lowConfidence?: number;
  reasons?: string[];
  order?: 'risk' | 'oldest' | 'given';
  filter?: ReviewFilter;
  defaultFilter?: ReviewFilter;
  onFilterChange?: (filter: ReviewFilter) => void;
  title?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const riskRank = { high: 0, medium: 1, low: 2 } as const;

function CodeBody({ text }: { text: string }) {
  return (
    <pre tabIndex={0} aria-label="Changes" {...stylex.props(styles.body, styles.code)}>
      {text.split('\n').map((l, i) => (
        <span key={i} {...stylex.props(l.startsWith('+') ? styles.cAdd : l.startsWith('-') ? styles.cDel : styles.cCtx)}>{l || ' '}</span>
      ))}
    </pre>
  );
}

/** A focused workspace for what agents want to do: queue sorted by risk, one item at a time with shaky spans marked, and Approve, Edit, Reject and Skip on single keys. */
export function ReviewCenter({
  items,
  onDecide,
  onUndo,
  onSkip,
  reviewed = 0,
  total,
  sla = 1_800_000,
  now: nowProp,
  lowConfidence = 0.7,
  reasons = ['Wrong info', 'Tone', 'Not allowed', 'Other'],
  order = 'risk',
  filter: filterProp,
  defaultFilter = 'all',
  onFilterChange,
  title = 'Review center',
  className,
  xstyle,
  ref,
  onKeyDown,
  ...rest
}: ReviewCenterProps) {
  const f = useFormatters();
  const now = useNow(true, 10_000, nowProp);
  const [decided, setDecided] = useState<Record<string, ReviewResult>>({});
  const [history, setHistory] = useState<string[]>([]);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [filterState, setFilterState] = useState<ReviewFilter>(defaultFilter);
  const [selected, setSelected] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [draftBody, setDraftBody] = useState('');
  const [draftFields, setDraftFields] = useState<Record<string, string>>({});
  const [flag, setFlag] = useState<string | null>(null);
  const { message, announce } = useAnnouncer();
  const rootEl = useRef<HTMLDivElement | null>(null);
  const detailEl = useRef<HTMLDivElement | null>(null);
  const rowEls = useRef(new Map<string, HTMLButtonElement>());
  const refocus = useRef(false);
  const [leaving, setLeaving] = useState(false);
  const navDir = useRef(0);
  const skipFlip = useRef(false);
  const queueEl = useRef<HTMLUListElement | null>(null);
  const [ghosts, setGhosts] = useState<{ item: ReviewItem; at: number; ok: boolean }[]>([]);
  const filter = filterProp ?? filterState;

  const waiting = items.filter((i) => !decided[i.id]);
  const unsure = (i: ReviewItem) => i.confidence < lowConfidence;
  const queue = useMemo(() => {
    const list = waiting.filter((i) => (filter === 'high' ? i.risk === 'high' : filter === 'unsure' ? i.confidence < lowConfidence : true));
    if (order === 'given') return list;
    return [...list].sort((a, b) => (order === 'risk' && riskRank[a.risk] !== riskRank[b.risk] ? riskRank[a.risk] - riskRank[b.risk] : a.createdAt - b.createdAt));
  }, [waiting, filter, order, lowConfidence]);

  const current = queue.find((i) => i.id === selected) ?? queue[0];
  const index = current ? queue.indexOf(current) : -1;
  // The item that takes the stage slides in from the direction of travel (J/K) or from just below (after a decision), a beat later.
  useLayoutEffect(() => {
    const el = detailEl.current;
    const dir = navDir.current;
    navDir.current = 0;
    if (!el || !dir || prefersReducedMotion() || typeof el.animate !== 'function') return;
    el.animate([{ opacity: 0, transform: `translateY(${dir >= 0 ? 8 : -8}px)` }, { opacity: 1, transform: 'translateY(0)' }], { delay: dir === 1 ? 40 : 0, duration: 220, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'backwards' });
  }, [current?.id]);
  // Items that arrive after the first render open their row at their sorted spot with a soft highlight.
  const knownIds = useRef<Set<string> | null>(null);
  const [fresh, setFresh] = useState<string[]>([]);
  useEffect(() => {
    const ids = items.map((x) => x.id);
    if (knownIds.current) {
      const add = ids.filter((id) => !knownIds.current!.has(id));
      if (add.length) {
        setFresh((f) => [...f, ...add]);
        window.setTimeout(() => setFresh((f) => f.filter((id) => !add.includes(id))), 1500);
      }
    }
    knownIds.current = new Set(ids);
  }, [items]);
  useListFlip(queueEl, skipFlip, 260);
  const oldest = waiting.length ? waiting.reduce((a, b) => (b.createdAt < a.createdAt ? b : a)) : undefined;
  const doneCount = reviewed + Object.keys(decided).length;
  const all = total ?? reviewed + items.length;

  useEffect(() => {
    if (refocus.current && current) {
      refocus.current = false;
      rowEls.current.get(current.id)?.focus();
    }
  }, [current]);

  const reset = () => {
    setEditing(false);
    setRejecting(false);
    setFlag(null);
  };
  const select = (id: string) => {
    setSelected(id);
    reset();
  };
  const go = (delta: number) => {
    if (!queue.length) return;
    const next = queue[(index + delta + queue.length) % queue.length]!;
    navDir.current = delta;
    select(next.id);
    rowEls.current.get(next.id)?.scrollIntoView?.({ block: 'nearest' });
  };

  const decide = (item: ReviewItem, result: ReviewResult) => {
    if (leaving) return;
    const animated = !prefersReducedMotion() && typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function';
    const commit = () => {
      setDecided((d) => ({ ...d, [item.id]: result }));
      if (animated && index >= 0) {
        setGhosts((g) => [...g, { item, at: queue.indexOf(item), ok: result.decision === 'approved' }]);
        window.setTimeout(() => setGhosts((g) => g.filter((x) => x.item.id !== item.id)), 340);
      }
      setHistory((h) => [...h, item.id]);
      const nextItem = queue[index + 1] ?? queue[index - 1];
      navDir.current = 1;
      setSelected(nextItem?.id ?? null);
      refocus.current = true;
      setLeaving(false);
      reset();
    };
    onDecide?.(item, result);
    announce(`${result.decision === 'approved' ? 'Approved' : 'Rejected'}: ${item.title}. ${doneCount + 1} of ${all} reviewed.`);
    if (!animated || index < 0) return commit();
    // The decided item fades up a few pixels first; the next one follows a beat later (see the detail effect).
    setLeaving(true);
    detailEl.current?.animate([{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-6px)' }], { duration: 150, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'forwards' });
    window.setTimeout(commit, 150);
  };
  /** The pressed button flashes the tint of its decision. */
  const flashTint = (e: { target: EventTarget | null }, tone: 'success' | 'danger') => {
    const btn = (e.target as HTMLElement | null)?.closest?.('button');
    if (!btn || prefersReducedMotion() || typeof btn.animate !== 'function') return;
    const tint = tone === 'success' ? 'var(--oniva-color-success-solid)' : 'var(--oniva-color-danger-solid)';
    btn.animate([{ backgroundColor: tint, boxShadow: `0 0 0 3px ${tint}` }, {}], { duration: 420, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
  };
  const approve = () => {
    if (!current) return;
    const result: ReviewResult = { decision: 'approved' };
    if (editing) {
      if (current.body !== undefined && draftBody !== flaggedToString(current.body)) result.text = draftBody;
      const changed = Object.fromEntries(Object.entries(draftFields).filter(([k, v]) => flaggedToString(current.fields?.find((x) => x.label === k)?.value ?? '') !== v));
      if (Object.keys(changed).length) result.fields = changed;
    }
    decide(current, result);
  };
  const reject = (reason?: string) => current && decide(current, { decision: 'rejected', ...(reason ? { reason } : {}) });
  const startEdit = () => {
    if (!current || (current.body === undefined && !current.fields?.length)) return;
    setDraftBody(current.body !== undefined ? flaggedToString(current.body) : '');
    setDraftFields(Object.fromEntries((current.fields ?? []).map((x) => [x.label, flaggedToString(x.value)])));
    setRejecting(false);
    setEditing(true);
  };
  const skip = () => {
    if (!current) return;
    setSkipped((s) => (s.includes(current.id) ? s : [...s, current.id]));
    onSkip?.(current);
    announce(`Skipped: ${current.title}`);
    go(1);
  };
  const undo = () => {
    const id = history[history.length - 1];
    if (!id) return;
    const item = items.find((i) => i.id === id);
    const result = decided[id];
    setHistory((h) => h.slice(0, -1));
    setDecided((d) => {
      const rest2 = { ...d };
      delete rest2[id];
      return rest2;
    });
    setSelected(id);
    reset();
    if (item && result) onUndo?.(item, result);
    announce(`Undone: ${item?.title ?? 'last decision'}`);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const t = e.target as HTMLElement;
    const typing = t.tagName === 'TEXTAREA' || t.tagName === 'INPUT';
    const mod = e.metaKey || e.ctrlKey;
    if (typing) {
      if (e.key === 'Escape' && editing) {
        e.preventDefault();
        setEditing(false);
      } else if (e.key === 'Enter' && mod && editing) {
        e.preventDefault();
        approve();
      }
      return;
    }
    if (mod && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      undo();
      return;
    }
    if (mod || e.altKey) return;
    const k = e.key.toLowerCase();
    if (e.key === 'Escape') {
      if (flag) setFlag(null);
      else reset();
    } else if (rejecting && /^[1-9]$/.test(k)) {
      const r = reasons[Number(k) - 1];
      if (r) {
        e.preventDefault();
        reject(r);
      }
    } else if (k === 'a') {
      e.preventDefault();
      approve();
    }
    else if (k === 'e') {
      e.preventDefault();
      startEdit();
    }
    else if (k === 'r') {
      e.preventDefault();
      if (current) {
        setEditing(false);
        setRejecting(true);
      }
    }
    else if (k === 's') {
      e.preventDefault();
      skip();
    }
    else if (k === 'j' || (e.key === 'ArrowDown' && !t.closest('[role="radiogroup"]') && t.tagName !== 'BUTTON')) {
      e.preventDefault();
      go(1);
    }
    else if (k === 'k' || (e.key === 'ArrowUp' && t.tagName !== 'BUTTON')) {
      e.preventDefault();
      go(-1);
    }
    else if (k === 'z') {
      e.preventDefault();
      undo();
    }
    else if (k === 'f') {
      const ids = flagIds(detailEl.current);
      if (ids.length) {
        e.preventDefault();
        setFlag(ids[(flag ? ids.indexOf(flag) + 1 : 0) % ids.length] ?? null);
      }
    }
  };

  const waitInfo = (item: ReviewItem) => {
    const ms = Math.max(0, now - item.createdAt);
    const m = Math.floor(ms / 60_000);
    const text = m < 1 ? '<1m' : m < 60 ? `${m}m` : `${Math.floor(m / 60)}h ${m % 60}m`;
    const tone = ms >= sla ? styles.waitLate : ms >= sla * 0.75 ? styles.waitWarn : styles.waitOk;
    return { text, tone, label: `waiting ${m < 1 ? 'less than a minute' : text}${ms >= sla ? ', overdue' : ''}` };
  };

  const sx = stylex.props(aiStyles.panel, styles.root, xstyle);
  const setRefs = (el: HTMLDivElement | null) => {
    rootEl.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) (ref as { current: HTMLDivElement | null }).current = el;
  };
  const flagTotal = current ? flagIds(detailEl.current).length : 0;

  return (
    <div {...rest} ref={setRefs} tabIndex={-1} onKeyDown={onKey} {...mergeSx(sx, className)}>
      <div {...stylex.props(styles.bar)}>
        <h4 {...stylex.props(styles.title)}>
          <ClipboardCheck size={14} aria-hidden="true" /> {title}
        </h4>
        <div {...stylex.props(styles.progress)}>
          <span aria-hidden="true" {...stylex.props(styles.track)}>
            <span style={{ transform: `scaleX(${all ? Math.min(1, doneCount / all) : 0})` }} {...stylex.props(styles.fill)} />
          </span>
          <span>{f.number(doneCount)} of {f.number(all)} reviewed</span>
          {oldest && <span {...stylex.props(styles.oldest)}>· oldest <span {...stylex.props(waitInfo(oldest).tone === styles.waitOk ? styles.waitWarn : waitInfo(oldest).tone)}>{waitInfo(oldest).text}</span></span>}
        </div>
      </div>
      <div {...stylex.props(styles.work)}>
        <div {...stylex.props(styles.queueCol)}>
        <div {...stylex.props(styles.tabs)}>
        <SegmentedControl
          aria-label="Filter queue"
          size="sm"
          value={filter}
          onChange={(v) => {
            if (filterProp === undefined) setFilterState(v as ReviewFilter);
            onFilterChange?.(v as ReviewFilter);
          }}
        >
          <SegmentedControlItem value="all">All <span aria-hidden="true" {...stylex.props(styles.cnt)}>{waiting.length}</span></SegmentedControlItem>
          <SegmentedControlItem value="high">High risk <span aria-hidden="true" {...stylex.props(styles.cnt)}>{waiting.filter((i) => i.risk === 'high').length}</span></SegmentedControlItem>
          <SegmentedControlItem value="unsure">Unsure <span aria-hidden="true" {...stylex.props(styles.cnt)}>{waiting.filter(unsure).length}</span></SegmentedControlItem>
        </SegmentedControl>
        </div>
        <ul ref={queueEl} aria-label="Review queue" {...stylex.props(styles.queue)}>
          {(() => {
            const list: ({ item: ReviewItem; ghost?: { ok: boolean } })[] = queue.map((item) => ({ item }));
            for (const g of ghosts) list.splice(Math.min(g.at, list.length), 0, { item: g.item, ghost: { ok: g.ok } });
            return list;
          })().map(({ item, ghost }) => {
            if (ghost) {
              return (
                <li key={item.id} aria-hidden="true" {...stylex.props(styles.ghost)}>
                  <div {...stylex.props(styles.ghostInner)}>
                    <div {...stylex.props(styles.qRow)}>
                      <span {...stylex.props(styles.avatar)}>{item.icon ?? <Sparkles size={14} />}</span>
                      <span {...stylex.props(styles.qTitle)}>{item.title}</span>
                      <span {...stylex.props(styles.ghostMark)}>{ghost.ok ? <Check size={12} /> : <X size={12} />}</span>
                    </div>
                  </div>
                </li>
              );
            }
            const w = waitInfo(item);
            const isCur = item.id === current?.id;
            return (
              <li key={item.id} data-flip-id={item.id} {...stylex.props(fresh.includes(item.id) && styles.arrive)}>
                <div {...stylex.props(fresh.includes(item.id) && styles.arriveInner)}>
                <button
                  type="button"
                  ref={(el) => {
                    if (el) rowEls.current.set(item.id, el);
                    else rowEls.current.delete(item.id);
                  }}
                  aria-current={isCur ? 'true' : undefined}
                  aria-label={`${item.title}, ${item.type}, ${item.risk} risk, ${f.percent(item.confidence)} confident, ${w.label}${skipped.includes(item.id) ? ', skipped' : ''}`}
                  onClick={() => select(item.id)}
                  {...stylex.props(styles.qRow, focus.inset, isCur && styles.qCurrent)}
                >
                  <span aria-hidden="true" {...stylex.props(styles.avatar)}>{item.icon ?? <Sparkles size={14} />}</span>
                  <span aria-hidden="true" {...stylex.props(styles.qText)}>
                    <span {...stylex.props(styles.qTitle)}>{item.title}</span>
                    <span {...stylex.props(styles.qMeta)}>{item.type}</span>
                  </span>
                  <span aria-hidden="true" {...stylex.props(styles.wait, w.tone)}>{skipped.includes(item.id) ? 'skipped' : w.text}</span>
                </button>
                </div>
              </li>
            );
          })}
        </ul>
        </div>
        {current ? (
          <div key={current.id} ref={detailEl} data-state="entering" aria-label="Current item" role="region" {...stylex.props(styles.detail, enterExit.slide)}>
            <div {...stylex.props(styles.dHead)}>
              <div {...stylex.props(styles.dTop)}>
                <span aria-hidden="true" {...stylex.props(styles.avatar, styles.avatarLg)}>{current.icon ?? <Sparkles size={16} />}</span>
                <div {...stylex.props(styles.qText)}>
                  <div {...stylex.props(styles.dWho)}>
                    <span>{current.agent}</span>
                    {current.risk !== 'low' && <span {...stylex.props(w2s.tag, current.risk === 'high' ? w2s.tagDanger : w2s.tagWarning)}>{current.risk === 'high' ? 'High risk' : 'Medium risk'}</span>}
                    <span {...stylex.props(w2s.tag, unsure(current) ? w2s.tagWarning : w2s.tagNeutral)}>{f.percent(current.confidence)} confident{unsure(current) ? ' · Unsure' : ''}</span>
                  </div>
                  <span {...stylex.props(styles.dModel)}>{current.model ?? current.type}</span>
                </div>
              </div>
              <h5 {...stylex.props(styles.dTitle)}>{current.title}</h5>
            </div>
            {current.reasoning && <p {...stylex.props(styles.reasoning, styles.note)}><span {...stylex.props(styles.why)}>Why </span>{current.reasoning}</p>}
            {current.fields && current.fields.length > 0 && (
              <dl {...stylex.props(styles.fields)}>
                {current.fields.map((fl, i) => (
                  <div key={fl.label} style={{ display: 'contents' }}>
                    <dt {...stylex.props(styles.fk)}>{fl.label}</dt>
                    <dd {...stylex.props(styles.fv)}>
                      {editing ? (
                        <input aria-label={fl.label} value={draftFields[fl.label] ?? ''} onChange={(e) => setDraftFields((d) => ({ ...d, [fl.label]: e.target.value }))} {...stylex.props(styles.input)} />
                      ) : (
                        <FlaggedSpans value={fl.value} idBase={`${current.id}-fld${i}`} openId={flag} onOpenChange={setFlag} />
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {current.body !== undefined && (
              <div {...stylex.props(styles.sec)}>
                <p {...stylex.props(styles.secTitle)}>{current.bodyLabel ?? 'Proposal'}</p>
                {editing ? (
                  <textarea aria-label={current.bodyLabel ?? 'Proposal'} value={draftBody} onChange={(e) => setDraftBody(e.target.value)} autoFocus {...stylex.props(styles.edit)} />
                ) : current.format === 'code' ? (
                  <CodeBody text={flaggedToString(current.body)} />
                ) : (
                  <p {...stylex.props(styles.body)}>
                    <FlaggedSpans value={current.body} idBase={`${current.id}-body`} openId={flag} onOpenChange={setFlag} />
                  </p>
                )}
              </div>
            )}
            {current.files && current.files.length > 0 && (
              <div {...stylex.props(styles.sec)}>
                <p {...stylex.props(styles.secTitle)}>{f.plural(current.files.length, { one: '# file changed', other: '# files changed' })}</p>
                {current.files.map((file) =>
                  file.diff ? <FileDiff key={file.path} fileName={file.path} diff={file.diff} /> : (
                    <div key={file.path} {...stylex.props(styles.body, w2s.mono)}>{file.path} +{file.added ?? 0} −{file.removed ?? 0}</div>
                  ),
                )}
              </div>
            )}
            {current.steps && current.steps.length > 0 && (
              <div {...stylex.props(styles.sec)}>
                <p {...stylex.props(styles.secTitle)}>Plan</p>
                <ol {...stylex.props(styles.steps)}>
                  {current.steps.map((s, i) => (
                    <li key={i} {...stylex.props(styles.step, s.flagged && styles.stepFlag)}>
                      {s.title}
                      {s.tool && <span {...stylex.props(w2s.mono, w2s.muted)}> · {s.tool}</span>}
                      {s.flagged && <span {...stylex.props(w2s.muted)}> (agent is unsure)</span>}
                      {s.detail && <span {...stylex.props(styles.stepDetail)}>{s.detail}</span>}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {current.links && current.links.length > 0 && (
              <div {...stylex.props(styles.links)}>
                {current.links.map((l) => <span key={l.label} {...stylex.props(styles.link)}>{l.icon ?? <Link2 size={13} aria-hidden="true" />}{l.label}</span>)}
              </div>
            )}
            <div {...stylex.props(styles.actions)}>
              {rejecting ? (
                <div role="group" aria-label="Reason for rejecting" {...stylex.props(styles.reasons)}>
                  {reasons.map((r, i) => (
                    <Button key={r} size="sm" variant="secondary" onPress={(e) => { flashTint(e, 'danger'); reject(r); }}>
                      <Kbd size="sm" aria-hidden="true" xstyle={styles.icon}>{i + 1}</Kbd> {r}
                    </Button>
                  ))}
                  <Button size="sm" variant="ghost" onPress={() => setRejecting(false)}>Cancel</Button>
                </div>
              ) : (
                <>
                  <Button size="sm" aria-keyshortcuts={editing ? 'Control+Enter Meta+Enter' : 'A'} xstyle={styles.grow} onPress={(e) => { flashTint(e, 'success'); approve(); }}>
                    <Check size={14} aria-hidden="true" {...stylex.props(styles.icon)} /> {editing ? 'Approve with edits' : 'Approve'}{!editing && <Kbd size="sm" aria-hidden="true" xstyle={styles.hint}>A</Kbd>}
                  </Button>
                  {editing ? (
                    <Button size="sm" variant="secondary" aria-keyshortcuts="Escape" xstyle={styles.grow} onPress={() => setEditing(false)}>Cancel</Button>
                  ) : (
                    <Button size="sm" variant="secondary" aria-keyshortcuts="E" isDisabled={current.body === undefined && !current.fields?.length} xstyle={styles.grow} onPress={startEdit}>
                      <Pencil size={14} aria-hidden="true" {...stylex.props(styles.icon)} /> Edit <Kbd size="sm" aria-hidden="true" xstyle={styles.hint}>E</Kbd>
                    </Button>
                  )}
                  <Button size="sm" variant="secondary" aria-keyshortcuts="R" xstyle={styles.grow} onPress={() => setRejecting(true)}>
                    <X size={14} aria-hidden="true" {...stylex.props(styles.icon)} /> Reject <Kbd size="sm" aria-hidden="true" xstyle={styles.hint}>R</Kbd>
                  </Button>
                  <Button size="sm" variant="ghost" aria-keyshortcuts="S" xstyle={styles.grow} onPress={skip}>
                    <SkipForward size={14} aria-hidden="true" {...stylex.props(styles.icon)} /> Skip <Kbd size="sm" aria-hidden="true" xstyle={styles.hint}>S</Kbd>
                  </Button>
                  {flagTotal > 0 && <span aria-hidden="true" {...stylex.props(styles.flagCount)}>{f.plural(flagTotal, { one: '# flag · F', other: '# flags · F' })}</span>}
                </>
              )}
            </div>
          </div>
        ) : (
          <div {...stylex.props(styles.empty)}>
            <Check size={20} aria-hidden="true" />
            <span>{waiting.length ? 'Nothing matches this filter.' : 'All caught up. Nothing is waiting for review.'}</span>
            {history.length > 0 && (
              <Button size="sm" variant="secondary" aria-keyshortcuts="Z" onPress={undo}>
                <Undo2 size={14} aria-hidden="true" /> Undo last
              </Button>
            )}
          </div>
        )}
      </div>
      <Announcer message={message} />
    </div>
  );
}
