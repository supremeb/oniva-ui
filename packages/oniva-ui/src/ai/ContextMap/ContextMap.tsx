import * as stylex from '@stylexjs/stylex';
import { Map as MapIcon } from 'lucide-react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { prefersReducedMotion } from '../../internal/motion-hooks';
import { radius } from '../../tokens/radius.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { mergeSx } from '../../internal/sx';
import { useRectFlip } from '../../internal/w2-flip';
import { squarify } from '../../internal/w2-treemap';
import { w2s } from '../../internal/w2-parts';
import { SegmentedControl, SegmentedControlItem } from '../../components/SegmentedControl';
import { AnimatedNumber } from '../../motion/AnimatedNumber';

const NARROW = '@container (max-width: 480px)';

const rollIn = stylex.keyframes({ from: { opacity: 0, transform: 'translateY(70%)' }, to: { opacity: 1, transform: 'translateY(0)' } });
const rollOut = stylex.keyframes({ from: { opacity: 1, transform: 'translateY(0)' }, to: { opacity: 0, transform: 'translateY(-70%)' } });
const shrinkOut = stylex.keyframes({ from: { opacity: 1, transform: 'scale(1)' }, to: { opacity: 0, transform: 'scale(0.5)' } });
const sweep = stylex.keyframes({ '0%': { transform: 'translateX(-120%)' }, '60%, 100%': { transform: 'translateX(120%)' } });

const styles = stylex.create({
  rollWrap: { display: 'inline-grid', overflow: 'hidden', verticalAlign: 'bottom' },
  rollCell: { gridArea: '1 / 1', whiteSpace: 'pre-wrap' },
  rollIn: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: rollIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  rollOut: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'forwards',
    animationName: { default: rollOut, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    pointerEvents: 'none',
  },
  ghostBox: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'forwards',
    animationName: { default: shrinkOut, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    pointerEvents: 'none',
  },
  usedWrap: { display: 'inline-block', overflow: 'hidden', position: 'relative' },
  shine: {
    animationDuration: '3.2s',
    animationIterationCount: 'infinite',
    animationName: { default: sweep, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'linear',
    backgroundImage: 'linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%)',
    inset: 0,
    mixBlendMode: 'overlay',
    pointerEvents: 'none',
    position: 'absolute',
  },
  root: { containerType: 'inline-size', width: '100%', display: 'flex', flexDirection: 'column', fontFamily: font['--oniva-font-sans'], gap: 10, padding: 14 },
  tray: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8 },
  title: { alignItems: 'center', color: colors['--oniva-color-text'], display: 'inline-flex', fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-semibold'], gap: 6, margin: 0 },
  spacer: { flexGrow: 1 },
  nums: { alignItems: 'baseline', color: colors['--oniva-color-text-muted'], display: 'flex', flexBasis: { default: 'auto', [NARROW]: '100%' }, fontSize: font['--oniva-font-size-13'], fontVariantNumeric: 'tabular-nums', gap: 4, order: { default: 0, [NARROW]: 5 } },
  used: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-medium'] },
  status: { color: colors['--oniva-color-info-fg'], fontSize: font['--oniva-font-size-12'] },
  area: { height: { default: 260, [NARROW]: 200 }, listStyle: 'none', margin: 0, padding: 0, position: 'relative', width: '100%' },
  tileBox: {
    boxSizing: 'border-box',
    listStyle: 'none',
    padding: 1.5,
    position: 'absolute',
  },
  tile: {
    alignItems: 'flex-start',
    appearance: 'none',
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-12'],
    gap: 1,
    height: '100%',
    justifyContent: 'flex-start',
    opacity: { default: 1, ':hover': 0.92 },
    overflow: 'hidden',
    padding: 6,
    textAlign: 'start',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'opacity, box-shadow',
    width: '100%',
  },
  pinned: { boxShadow: `inset 0 0 0 2px ${colors['--oniva-color-text']}` },
  dim: { opacity: 0.55 },
  free: { backgroundColor: 'transparent', borderColor: colors['--oniva-color-border-control'], borderStyle: 'dashed', color: colors['--oniva-color-text-muted'] },
  tSub: { color: colors['--oniva-color-text-muted'], fontVariantNumeric: 'tabular-nums', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' },
  well: { backgroundColor: colors['--oniva-color-surface-inset'], borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-lg'], borderStyle: 'solid', borderWidth: 1, padding: 3 },
  pct: { backgroundColor: colors['--oniva-color-surface-inner'], borderRadius: radius['--oniva-radius-md'], color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-12'], marginInlineStart: 6, paddingBlock: 1, paddingInline: 6 },
  limitChip: { color: colors['--oniva-color-text-muted'], fontVariantNumeric: 'tabular-nums' },
  tLabel: { fontWeight: font['--oniva-font-weight-medium'], lineHeight: font['--oniva-font-lh-14'], overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' },
  system: { backgroundColor: `color-mix(in srgb, ${colors['--oniva-color-chart-10']} 24%, transparent)`, borderColor: `color-mix(in srgb, ${colors['--oniva-color-chart-10']} 55%, transparent)` },
  tools: { backgroundColor: `color-mix(in srgb, ${colors['--oniva-color-chart-9']} 24%, transparent)`, borderColor: `color-mix(in srgb, ${colors['--oniva-color-chart-9']} 55%, transparent)` },
  memory: { backgroundColor: `color-mix(in srgb, ${colors['--oniva-color-chart-1']} 24%, transparent)`, borderColor: `color-mix(in srgb, ${colors['--oniva-color-chart-1']} 55%, transparent)` },
  file: { backgroundColor: `color-mix(in srgb, ${colors['--oniva-color-chart-6']} 24%, transparent)`, borderColor: `color-mix(in srgb, ${colors['--oniva-color-chart-6']} 55%, transparent)` },
  chat: { backgroundColor: `color-mix(in srgb, ${colors['--oniva-color-chart-7']} 24%, transparent)`, borderColor: `color-mix(in srgb, ${colors['--oniva-color-chart-7']} 55%, transparent)` },
  result: { backgroundColor: `color-mix(in srgb, ${colors['--oniva-color-chart-3']} 24%, transparent)`, borderColor: `color-mix(in srgb, ${colors['--oniva-color-chart-3']} 55%, transparent)` },
  summary: { backgroundColor: colors['--oniva-color-accent-soft'], borderColor: colors['--oniva-color-border-active'], color: colors['--oniva-color-accent-soft-fg'] },
  info: { backgroundColor: colors['--oniva-color-surface-inner'], borderRadius: radius['--oniva-radius-md'], color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], lineHeight: font['--oniva-font-lh-16'], padding: 8 },
  infoStrong: { color: colors['--oniva-color-text'], fontWeight: font['--oniva-font-weight-medium'] },
  line: { color: colors['--oniva-color-text-subtle'], fontSize: font['--oniva-font-size-12'], minHeight: 18, paddingInline: 2 },
});

export type ContextBlockKind = 'system' | 'tools' | 'memory' | 'file' | 'chat' | 'result' | 'summary';

export interface ContextBlock {
  id: string;
  label: string;
  kind: ContextBlockKind;
  tokens: number;
  detail?: string;
  icon?: ReactNode;
  /** Listed in the details line when the block is hovered or pinned. */
  items?: Array<{ label: string }>;
}

export interface ContextCompaction {
  /** The blocks just before the last compaction. */
  before: ContextBlock[];
  /** Ids of before-blocks that were squeezed into the summary. */
  summarized?: string[];
  /** Ids of before-blocks that were dropped. */
  dropped?: string[];
  summary?: string;
}

export interface ContextMapProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children' | 'title' | 'onSelect'> {
  blocks: ContextBlock[];
  /** Context window size in tokens; what is left shows as dashed free space. */
  limit?: number;
  model?: string;
  modelIcon?: ReactNode;
  /** `null` shows "not compacted yet", `undefined` hides the line and the Before / After switch. */
  compaction?: ContextCompaction | null;
  view?: 'before' | 'after';
  onViewChange?: (view: 'before' | 'after') => void;
  /** A short status on the tray, e.g. "Compacting". */
  status?: string;
  /** A tile was clicked (`null` for the free space). */
  onSelect?: (block: ContextBlock | null) => void;
  title?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const FREE = '__free';

/** Text that changes rolls: the old line slides up and out, the new one comes in from below. */
function Roll({ text }: { text: string }) {
  const [prev, setPrev] = useState<{ text: string; n: number } | null>(null);
  const cur = useRef(text);
  const n = useRef(0);
  useLayoutEffect(() => {
    if (cur.current === text) return;
    const old = cur.current;
    cur.current = text;
    if (prefersReducedMotion()) return;
    setPrev({ text: old, n: ++n.current });
    const t = window.setTimeout(() => setPrev(null), 300);
    return () => window.clearTimeout(t);
  }, [text]);
  return (
    <span {...stylex.props(styles.rollWrap)}>
      {prev && <span key={`o${prev.n}`} aria-hidden="true" {...stylex.props(styles.rollCell, styles.rollOut)}>{prev.text}</span>}
      <span key={`i${n.current}`} {...stylex.props(styles.rollCell, prev && styles.rollIn)}>{text}</span>
    </span>
  );
}
const kindStyle = { system: styles.system, tools: styles.tools, memory: styles.memory, file: styles.file, chat: styles.chat, result: styles.result, summary: styles.summary } as const;
const kindLabel: Record<ContextBlockKind, string> = { system: 'System', tools: 'Tools', memory: 'Memory', file: 'File', chat: 'Chat', result: 'Tool result', summary: 'Summary' };

/** What fills an agent's context window as a living treemap: tiles glide as it grows, free space is dashed, and compaction squeezes old turns into a summary. */
export function ContextMap({ blocks, limit, model, modelIcon, compaction, view: viewProp, onViewChange, status, onSelect, title = 'Context', className, xstyle, ref, onKeyDown, ...rest }: ContextMapProps) {
  const f = useFormatters();
  const [viewState, setViewState] = useState<'before' | 'after'>('after');
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [size, setSize] = useState({ w: 480, h: 260 });
  const areaRef = useRef<HTMLUListElement | null>(null);
  useRectFlip(areaRef);
  const view = viewProp ?? viewState;
  const shown = compaction && view === 'before' ? compaction.before : blocks;

  useEffect(() => {
    const el = areaRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth || 480, h: el.clientHeight || 260 }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const used = shown.reduce((n, b) => n + b.tokens, 0);
  const free = limit ? Math.max(0, limit - used) : 0;
  const rects = useMemo(() => squarify([...shown.map((b) => ({ id: b.id, value: b.tokens })), { id: FREE, value: free }], size.w, size.h), [shown, free, size.w, size.h]);
  const byId = new Map(shown.map((b) => [b.id, b]));
  // Parts that leave shrink away where they were.
  const lastRects = useRef(new Map<string, { r: (typeof rects)[number]; b: ContextBlock | undefined; free: number }>());
  const [leavers, setLeavers] = useState<Array<{ r: (typeof rects)[number]; b: ContextBlock | undefined; free: number }>>([]);
  useLayoutEffect(() => {
    const now = new Set(rects.map((r) => r.id));
    const gone = [...lastRects.current.entries()].filter(([id]) => !now.has(id) && id !== FREE).map(([, v]) => v);
    lastRects.current = new Map(rects.map((r) => [r.id, { r, b: byId.get(r.id), free }]));
    if (!gone.length || prefersReducedMotion()) return;
    setLeavers(gone);
    const t = window.setTimeout(() => setLeavers([]), 320);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rects]);
  const activeId = pinned ?? hover;
  const active = activeId && activeId !== FREE ? byId.get(activeId) : undefined;
  const total = limit ?? used;

  useEffect(() => {
    if (pinned && pinned !== FREE && !byId.has(pinned)) setPinned(null);
  }, [pinned, shown]); // eslint-disable-line react-hooks/exhaustive-deps

  const pin = (id: string) => {
    const next = pinned === id ? null : id;
    setPinned(next);
    onSelect?.(next === null ? null : id === FREE ? null : (byId.get(id) ?? null));
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.key === 'Escape' && pinned) setPinned(null);
  };
  const sx = stylex.props(aiStyles.panel, styles.root, xstyle);

  return (
    <div {...rest} ref={ref} onKeyDown={onKey} {...mergeSx(sx, className)}>
      <div {...stylex.props(styles.tray)}>
        <h4 {...stylex.props(styles.title)}>
          <MapIcon size={14} aria-hidden="true" /> {title}
        </h4>
        {model && (
          <span {...stylex.props(w2s.tag, w2s.tagNeutral)}>
            {modelIcon}
            {model}
            {limit ? <span {...stylex.props(styles.limitChip)}>{f.compact(limit)}</span> : null}
          </span>
        )}
        {status && (
          <span role="status" {...stylex.props(styles.status)}>
            {status}
          </span>
        )}
        <span {...stylex.props(styles.spacer)} />
        {compaction !== undefined && (
          <SegmentedControl
            aria-label="Context view"
            size="sm"
            value={view}
            isDisabled={compaction === null}
            onChange={(v) => {
              if (viewProp === undefined) setViewState(v as 'before' | 'after');
              onViewChange?.(v as 'before' | 'after');
            }}
          >
            <SegmentedControlItem value="before">Before</SegmentedControlItem>
            <SegmentedControlItem value="after">After</SegmentedControlItem>
          </SegmentedControl>
        )}
        <span {...stylex.props(styles.nums)}>
          <span {...stylex.props(styles.used, styles.usedWrap)}>
            <AnimatedNumber value={used} format={{ maximumFractionDigits: 0 }} />
            <span aria-hidden="true" {...stylex.props(styles.shine)} />
          </span>
          {limit ? (
            <>
              <span aria-label={`of ${f.compact(limit)} tokens`}>/ {f.compact(limit)}</span>
              <span {...stylex.props(styles.pct)}>{f.percent(used / limit)}</span>
            </>
          ) : (
            <span>tokens</span>
          )}
        </span>
      </div>
      <div {...stylex.props(styles.well)}>
      <ul ref={areaRef} aria-label={`${title}: what fills the context window`} {...stylex.props(styles.area)}>
        {leavers.map(({ r, b }) => (
          <li key={`gone-${r.id}`} aria-hidden="true" style={{ left: `${(r.x / size.w) * 100}%`, top: `${(r.y / size.h) * 100}%`, width: `${(r.w / size.w) * 100}%`, height: `${(r.h / size.h) * 100}%` }} {...stylex.props(styles.tileBox, styles.ghostBox)}>
            <div {...stylex.props(styles.tile, b ? kindStyle[b.kind] : styles.free)}>
              <span {...stylex.props(styles.tLabel)}>{b?.label}</span>
            </div>
          </li>
        ))}
        {rects.map((r) => {
          const b = byId.get(r.id);
          const isFree = r.id === FREE;
          const wPx = r.w;
          const hPx = r.h;
          const roomy = wPx > 78 && hPx > 46;
          const tight = wPx > 52 && hPx > 30;
          const tokens = isFree ? free : (b?.tokens ?? 0);
          const name = isFree ? 'Free space' : b!.label;
          return (
            <li key={r.id} data-flip-id={r.id} style={{ left: `${(r.x / size.w) * 100}%`, top: `${(r.y / size.h) * 100}%`, width: `${(r.w / size.w) * 100}%`, height: `${(r.h / size.h) * 100}%` }} {...stylex.props(styles.tileBox)}>
              <button
                type="button"
                aria-pressed={pinned === r.id}
                aria-label={`${name}${isFree ? '' : `, ${kindLabel[b!.kind]}`}, ${f.number(tokens)} tokens`}
                title={`${name} · ${f.number(tokens)} tokens`}
                onMouseEnter={() => setHover(r.id)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(r.id)}
                onBlur={() => setHover(null)}
                onClick={() => pin(r.id)}
                {...stylex.props(styles.tile, focus.ring, isFree ? styles.free : kindStyle[b!.kind], !!activeId && activeId !== r.id && styles.dim, pinned === r.id && styles.pinned)}
              >
                {tight && (
                  <>
                    <span aria-hidden="true" {...stylex.props(styles.tLabel)}>{b?.icon}{name}</span>
                    {tight && <span aria-hidden="true" {...stylex.props(styles.tSub)}><Roll text={f.compact(tokens)} />{roomy && b && (b.kind === 'system' || b.kind === 'tools' || b.kind === 'file') ? ` · ${kindLabel[b.kind]}` : ''}</span>}
                  </>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      </div>
      <div aria-live="polite" {...stylex.props(!!activeId && styles.info)}>
        {active ? (
          <>
            <span {...stylex.props(styles.infoStrong)}>{active.label}</span> · {kindLabel[active.kind]} · {f.number(active.tokens)} tokens ({f.percent(active.tokens / (total || 1), 1)})
            {active.detail ? ` · ${active.detail}` : ''}
            {active.items?.length ? ` · ${active.items.map((i) => i.label).join(', ')}` : ''}
          </>
        ) : activeId === FREE ? (
          <>
            <span {...stylex.props(styles.infoStrong)}>Free space</span> · {f.number(free)} tokens left
          </>
        ) : null}
      </div>
      {compaction !== undefined && (
        <div {...stylex.props(styles.line)}>
          <Roll
            text={
              compaction === null
                ? 'Not compacted yet – once it is, compare before and after here.'
                : view === 'before'
                  ? `Before compaction: ${f.number(compaction.before.reduce((n, b) => n + b.tokens, 0))} tokens`
                  : `${compaction.summarized?.length ?? 0} summarized, ${compaction.dropped?.length ?? 0} dropped${compaction.summary ? `. ${compaction.summary}` : ''}`
            }
          />
        </div>
      )}
    </div>
  );
}
