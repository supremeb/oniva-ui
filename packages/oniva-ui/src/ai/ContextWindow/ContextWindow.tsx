import * as stylex from '@stylexjs/stylex';
import { ArrowRight, Check, ChevronUp, Lock, Minimize2, X } from 'lucide-react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { compactNumber } from '../../internal/ai-motion';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { mergeSx } from '../../internal/sx';
import { Announcer, useAnnouncer, w2s } from '../../internal/w2-parts';
import { Button } from '../../components/Button';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { usePresence } from '../../motion/Presence';
import { enterExit } from '../../internal/motion-styles';
import { prefersReducedMotion } from '../../internal/motion-hooks';

const NARROW = '@container (max-width: 310px)';

const wave = stylex.keyframes({ '0%': { opacity: 1 }, '50%': { opacity: 0.25 }, '100%': { opacity: 1 } });

const styles = stylex.create({
  root: { containerType: 'inline-size', display: 'flex', flexDirection: 'column', fontFamily: font['--oniva-font-sans'], gap: 14, maxWidth: 360, padding: 16, width: '100%' },
  head: { alignItems: 'center', display: 'flex', gap: 8, justifyContent: 'space-between' },
  title: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-semibold'], margin: 0 },
  model: { maxWidth: { default: 'none', [NARROW]: 110 }, overflow: 'hidden', textOverflow: 'ellipsis' },
  big: { alignItems: 'baseline', display: 'flex', flexWrap: 'wrap', gap: 6 },
  num: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-24'], fontVariantNumeric: 'tabular-nums', fontWeight: font['--oniva-font-weight-semibold'], lineHeight: 1.1 },
  of: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], fontVariantNumeric: 'tabular-nums' },
  pct: { marginInlineStart: 'auto' },
  field: { display: 'grid', gap: 3, gridTemplateColumns: { default: 'repeat(var(--cw-cols, 36), minmax(0, 1fr))', [NARROW]: 'repeat(24, minmax(0, 1fr))' } },
  cell: {
    aspectRatio: '1',
    backgroundColor: colors['--oniva-color-chart-track'],
    borderRadius: 2,
    opacity: 1,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  cellFade: { opacity: 0.25 },
  cellWork: { animationDuration: '1.2s', animationIterationCount: 'infinite', animationName: { default: wave, [media.reducedMotion]: 'none' }, animationTimingFunction: 'ease-in-out' },
  c0: { backgroundColor: colors['--oniva-color-chart-1'] },
  c1: { backgroundColor: colors['--oniva-color-chart-4'] },
  c2: { backgroundColor: colors['--oniva-color-chart-6'] },
  c3: { backgroundColor: colors['--oniva-color-chart-8'] },
  c4: { backgroundColor: colors['--oniva-color-chart-5'] },
  c5: { backgroundColor: colors['--oniva-color-chart-9'] },
  c6: { backgroundColor: colors['--oniva-color-chart-3'] },
  list: { display: 'flex', flexDirection: 'column', gap: 2, listStyle: 'none', margin: 0, padding: 0 },
  row: { alignItems: 'center', display: 'flex', gap: 8, minHeight: { default: 32, '@media (pointer: coarse)': 40 }, opacity: 1, transitionDuration: motion['--oniva-motion-dur-base'], transitionProperty: 'opacity', paddingInline: 4 },
  rowDim: { opacity: 0.55 },
  swatch: { borderRadius: 2, flexShrink: 0, height: 8, width: 8 },
  name: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    cursor: 'default',
    display: 'inline-flex',
    flexGrow: 1,
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-13'],
    gap: 4,
    minWidth: 0,
    padding: 0,
    textAlign: 'start',
  },
  nameBtn: { cursor: 'pointer' },
  nameText: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  tokens: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums' },
  partTokens: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-13'], fontVariantNumeric: 'tabular-nums', textAlign: 'end' },
  chev: { color: colors['--oniva-color-text-muted'], flexShrink: 0, transitionDuration: motion['--oniva-motion-dur-base'], transitionProperty: 'transform', transitionTimingFunction: motion['--oniva-motion-ease-out'] },
  chevOpen: { transform: 'rotate(180deg)' },
  items: { display: 'flex', flexDirection: 'column', gap: 1, listStyle: 'none', margin: 0, paddingBlock: 2, paddingInlineEnd: 0, paddingInlineStart: 16 },
  item: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'flex', fontSize: font['--oniva-font-size-12'], gap: 6, minHeight: { default: 24, '@media (pointer: coarse)': 36 } },
  itemName: { flexGrow: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  compactLabel: { display: { default: 'inline', [NARROW]: 'none' } },
  tray: { alignItems: 'center', borderTopColor: colors['--oniva-color-border'], borderTopStyle: 'solid', borderTopWidth: 1, display: 'flex', gap: 8, justifyContent: 'space-between', marginBlockEnd: -16, marginInline: -16, minHeight: 36, paddingBlock: 12, paddingInline: 16 },
  trayText: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], minWidth: 0 },
  sr: { borderWidth: 0, clip: 'rect(0 0 0 0)', height: 1, margin: -1, overflow: 'hidden', padding: 0, position: 'absolute', whiteSpace: 'nowrap', width: 1 },
  trayWarn: { color: colors['--oniva-color-warning-fg'] },
  trayFull: { color: colors['--oniva-color-danger-fg'] },
  slot: { alignItems: 'center', display: 'grid', justifyItems: 'end', flexShrink: 0 },
  slotCell: { gridArea: '1 / 1' },
  slotBtn: {
    opacity: 1,
    transform: 'scale(1)',
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: 'opacity, transform, filter',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  slotBtnAway: { filter: 'blur(2px)', opacity: 0, pointerEvents: 'none', transform: 'scale(0.8)' },
  done: { alignItems: 'center', color: colors['--oniva-color-success-fg'], display: 'inline-flex', fontSize: font['--oniva-font-size-12'], gap: 4 },
});

/** Compact button that morphs into a green check and fades away; it returns only when `show` is true again. */
function CompactSlot({ done, show, button }: { done: boolean; show: boolean; button: ReactNode }) {
  const { mounted, presenceProps } = usePresence(done, { initial: true, exitTimeoutMs: 400 });
  const { ref: pref, ...pp } = presenceProps;
  const keepButton = show || mounted;
  if (!keepButton && !mounted) return null;
  return (
    <span {...stylex.props(styles.slot)}>
      {keepButton && (
        <span aria-hidden={done || undefined} inert={done || undefined} {...stylex.props(styles.slotCell, styles.slotBtn, (done || !show) && styles.slotBtnAway)}>
          {button}
        </span>
      )}
      {mounted && (
        <span role="status" {...pp} ref={pref as React.Ref<HTMLSpanElement>} {...stylex.props(styles.done, styles.slotCell, enterExit.blur)}>
          <Check size={12} aria-hidden="true" /> <span {...stylex.props(styles.compactLabel)}>Compacted</span>
        </span>
      )}
    </span>
  );
}

/** Items that fold away (grid rows 1fr -> 0fr) before they leave the list. Immediate without animation support. */
function useFolding<T extends { id: string }>(items: T[]) {
  const [list, setList] = useState(() => items.map((item) => ({ item, gone: false })));
  const key = items.map((i) => i.id).join('|');
  useLayoutEffect(() => {
    const canAnimate = !prefersReducedMotion() && typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function';
    setList((prev) => {
      const next = prev.flatMap((e) => {
        const cur = items.find((i) => i.id === e.item.id);
        if (cur) return [{ item: cur, gone: false }];
        return canAnimate ? [{ item: e.item, gone: true }] : [];
      });
      items.forEach((i) => {
        if (!next.some((e) => e.item.id === i.id)) next.push({ item: i, gone: false });
      });
      return next;
    });
    if (!canAnimate) return;
    const t = window.setTimeout(() => setList((l) => l.filter((e) => !e.gone)), 300);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  // Until the layout effect has run, show the live items (never a stale or missing row).
  return list.length === 0 && items.length > 0 ? items.map((item) => ({ item, gone: false })) : list;
}

function PartItems({ part, items, isOpen, label, onRemove, tokenText }: { part: ContextPart; items: ContextPartItem[]; isOpen: boolean; label: (it: ContextPartItem) => string; onRemove: (p: ContextPart, it: ContextPartItem) => void; tokenText: (n: number) => string }) {
  const rows = useFolding(items);
  return (
    <AnimatedHeight isOpen={isOpen}>
      <ul {...stylex.props(styles.items)}>
        {rows.map(({ item: it, gone }) => (
          <li key={it.id}>
            <AnimatedHeight isOpen={!gone}>
              <div {...stylex.props(styles.item)}>
                <span {...stylex.props(styles.itemName)}>{it.label}</span>
                <span {...stylex.props(styles.tokens)}>{tokenText(it.tokens)}</span>
                <Button size="xs" variant="ghost" isIconOnly aria-label={label(it)} isDisabled={gone} onPress={() => onRemove(part, it)}>
                  <X size={12} aria-hidden="true" />
                </Button>
              </div>
            </AnimatedHeight>
          </li>
        ))}
      </ul>
    </AnimatedHeight>
  );
}

const swatchStyles = [styles.c0, styles.c1, styles.c2, styles.c3, styles.c4, styles.c5, styles.c6];

export interface ContextPartItem {
  id: string;
  label: string;
  tokens: number;
}
export interface ContextPart {
  id: string;
  label: string;
  /** Leave out when `items` is given: tokens are summed. */
  tokens?: number;
  items?: ContextPartItem[];
  /** Cannot be compacted or removed (system prompt). */
  locked?: boolean;
  /** Shows a Compact button. */
  compact?: boolean;
  /** Palette slot 0-6; defaults to the part's position. */
  color?: number;
}

export interface ContextWindowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children' | 'title'> {
  parts: ContextPart[];
  /** Context window size in tokens. */
  limit: number;
  title?: string;
  model?: string;
  modelIcon?: ReactNode;
  /** With it the card shows exactly what you pass; without it removal lives inside the card. */
  onRemoveItem?: (partId: string, itemId: string) => void;
  /** Cells shimmer until the promise settles. Without it the part shrinks on its own. */
  onCompact?: (partId: string) => void | Promise<void>;
  action?: { label: string; onClick: () => void };
  /** Share of the limit from which the percentage turns amber. From 0.95 the window counts as full. */
  warnAt?: number;
  cells?: number;
  columns?: number;
  /** Parts with items that start expanded. */
  defaultOpen?: string[];
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const partTokens = (p: ContextPart, removed: string[], shrink: number) =>
  Math.round((p.items ? p.items.filter((i) => !removed.includes(`${p.id}/${i.id}`)).reduce((n, i) => n + i.tokens, 0) : (p.tokens ?? 0)) * shrink);

/** Number of cells each part gets (at least one when it has tokens; total never exceeds `cells`). */
export function allocateCells(tokens: number[], limit: number, cells: number): number[] {
  const per = limit / cells;
  const raw = tokens.map((t) => (t > 0 ? Math.max(1, Math.round(t / per)) : 0));
  let over = raw.reduce((n, c) => n + c, 0) - cells;
  for (let i = raw.length - 1; over > 0 && i >= 0; i = i > 0 ? i - 1 : raw.length - 1) {
    if (raw[i]! > 1) {
      raw[i]!--;
      over--;
    } else if (raw.every((c) => c <= 1)) break;
  }
  return raw;
}

/** What fills the model's context as a field of cells: hover a part to light it up, remove files, compact the conversation. */
export function ContextWindow({ parts, limit, title = 'Context window', model, modelIcon, onRemoveItem, onCompact, action, warnAt = 0.8, cells = 216, columns = 36, defaultOpen = [], className, xstyle, ref, ...rest }: ContextWindowProps) {
  const f = useFormatters();
  const [removed, setRemoved] = useState<string[]>([]);
  const [shrunk, setShrunk] = useState<Record<string, number>>({});
  const [open, setOpen] = useState<string[]>(defaultOpen);
  const [hover, setHover] = useState<string | null>(null);
  const [working, setWorking] = useState<string | null>(null);
  const [after, setAfter] = useState<Record<string, number>>({});
  const [flash, setFlash] = useState<string | null>(null);
  const { message, announce } = useAnnouncer();
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const removedList = onRemoveItem ? [] : removed;
  const tokens = parts.map((p) => partTokens(p, removedList, shrunk[p.id] ?? 1));
  const used = tokens.reduce((n, t) => n + t, 0);
  const ratio = limit ? used / limit : 0;
  const alloc = useMemo(() => allocateCells(tokens, limit, cells), [tokens.join(','), limit, cells]); // eslint-disable-line react-hooks/exhaustive-deps
  const owner: Array<number> = [];
  alloc.forEach((n, i) => {
    for (let k = 0; k < n; k++) owner.push(i);
  });
  const full = ratio >= 0.95;
  const warn = ratio >= warnAt;
  const left = Math.max(0, limit - used);

  const compact = async (p: ContextPart, i: number) => {
    setWorking(p.id);
    announce(`Compacting ${p.label}`);
    const before = tokens[i]!;
    if (onCompact) await onCompact(p.id);
    else await new Promise<void>((r) => timers.current.push(window.setTimeout(r, 900)));
    if (!onCompact) setShrunk((s) => ({ ...s, [p.id]: (s[p.id] ?? 1) * 0.3 }));
    setWorking(null);
    const afterTokens = Math.round(before * 0.3);
    setAfter((d) => ({ ...d, [p.id]: onCompact ? before : afterTokens }));
    setFlash(p.id);
    announce(`Compacted ${p.label}, saved about ${f.compact(before - afterTokens)} tokens`);
    timers.current.push(window.setTimeout(() => setFlash(null), 1800));
  };
  const remove = (p: ContextPart, it: ContextPartItem) => {
    if (onRemoveItem) onRemoveItem(p.id, it.id);
    else setRemoved((r) => [...r, `${p.id}/${it.id}`]);
    announce(`Removed ${it.label}`);
  };

  const sx = stylex.props(aiStyles.panel, styles.root, xstyle);
  const colsVar = { '--cw-cols': columns } as React.CSSProperties;
  const label = `${f.number(used)} of ${f.number(limit)} tokens used`;

  return (
    <div {...rest} ref={ref} role="group" aria-label={title} {...mergeSx(sx, className)}>
      <div {...stylex.props(styles.head)}>
        <h4 {...stylex.props(styles.title)}>{title}</h4>
        {model && (
          <span {...stylex.props(w2s.tag, w2s.tagNeutral, styles.model)}>
            {modelIcon}
            {model}
          </span>
        )}
      </div>
      <div {...stylex.props(styles.big)}>
        <span aria-hidden="true" {...stylex.props(styles.num)}>
          <AnimatedNumber value={hover ? (tokens[parts.findIndex((p) => p.id === hover)] ?? used) : used} format={{ maximumFractionDigits: 0 }} />
        </span>
        <span aria-hidden="true" {...stylex.props(styles.of)}>of {compactNumber(limit)}</span>
        <span {...stylex.props(w2s.tag, full ? w2s.tagDanger : warn ? w2s.tagWarning : w2s.tagNeutral, styles.pct)}>{f.percent(ratio)}</span>
      </div>
      <div aria-hidden="true" style={colsVar} {...stylex.props(styles.field)}>
        {Array.from({ length: cells }, (_, i) => {
          const o = owner[i];
          const p = o !== undefined ? parts[o] : undefined;
          return (
            <span
              key={i}
              style={{ transitionDelay: `${Math.min(i, 120) * 3}ms`, animationDelay: `${(i % 36) * 25}ms` }}
              {...stylex.props(styles.cell, o !== undefined && swatchStyles[(p?.color ?? o) % swatchStyles.length], !!hover && p?.id !== hover && styles.cellFade, p && working === p.id && styles.cellWork)}
            />
          );
        })}
      </div>
      <ul {...stylex.props(styles.list)}>
        {parts.map((p, i) => {
          const isOpen = open.includes(p.id);
          const t = tokens[i]!;
          const canCompact = !!p.compact && !p.locked && t > 0 && (after[p.id] === undefined || t > after[p.id]! * 1.05);
          return (
            <li key={p.id} onMouseEnter={() => setHover(p.id)} onMouseLeave={() => setHover(null)}>
              <div {...stylex.props(styles.row, !!hover && hover !== p.id && styles.rowDim)}>
                <span aria-hidden="true" {...stylex.props(styles.swatch, swatchStyles[(p.color ?? i) % swatchStyles.length])} />
                {p.items ? (
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen((o) => (isOpen ? o.filter((x) => x !== p.id) : [...o, p.id]))}
                    {...stylex.props(styles.name, styles.nameBtn, focus.ring)}
                  >
                    <span {...stylex.props(styles.nameText)}>{p.label}</span>
                    <ChevronUp size={12} aria-hidden="true" {...stylex.props(styles.chev, !isOpen && styles.chevOpen)} />
                  </button>
                ) : (
                  <span {...stylex.props(styles.name)}>
                    <span {...stylex.props(styles.nameText)}>{p.label}</span>
                    {p.locked && <Lock size={11} aria-label="Locked" />}
                  </span>
                )}
                <CompactSlot
                  done={flash === p.id}
                  show={canCompact}
                  button={
                    <Button size="xs" variant="secondary" isDisabled={working === p.id} aria-label={`Compact ${p.label}`} onPress={() => void compact(p, i)}>
                      <Minimize2 size={12} aria-hidden="true" /> <span {...stylex.props(styles.compactLabel)}>{working === p.id ? 'Compacting…' : 'Compact'}</span>
                    </Button>
                  }
                />
                <span {...stylex.props(styles.partTokens)}>{f.compact(t)}</span>
              </div>
              {p.items && (
                <PartItems part={p} items={p.items.filter((it) => !removedList.includes(`${p.id}/${it.id}`))} isOpen={isOpen} label={(it) => `Remove ${it.label}`} onRemove={remove} tokenText={(n) => f.compact(n)} />
              )}
            </li>
          );
        })}
      </ul>
      <div {...stylex.props(styles.tray)}>
        <span {...stylex.props(styles.trayText, full ? styles.trayFull : warn && styles.trayWarn)}>
          <span {...stylex.props(styles.sr)}>{label}. </span>
          {full ? 'Context is full' : `${f.compact(left)} left`}
        </span>
        {action && (
          <Button size="sm" variant="secondary" onPress={action.onClick}>
            {action.label} <ArrowRight size={12} aria-hidden="true" />
          </Button>
        )}
      </div>
      <Announcer message={message || label} />
    </div>
  );
}
