import * as stylex from '@stylexjs/stylex';
import { Check, Pause, Pencil, Play, Plus, Search, Trash2, Undo2 } from 'lucide-react';
import { Fragment, useEffect, useRef, useState } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { Radio, RadioGroup } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { aib } from '../../internal/aib-styles';
import { useFormatters } from '../../internal/format';
import { mergeSx, sxClass } from '../../internal/sx';
import { Badge } from '../../components/Badge';
import { Switch } from '../../components/Switch';
import { useLeaving } from '../../internal/aib-leave';
import { Presence } from '../../motion/Presence';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { CrossFade } from '../../motion/CrossFade';



const styles = stylex.create({
  gRoot: { overflow: 'hidden' },
  gHead: { paddingBlock: 14, paddingBlockEnd: 10, paddingInline: 16 },
  gChips: { alignItems: 'center', display: 'flex', gap: 6, paddingBlockEnd: 10, paddingInline: 16 },
  gChipRow: { display: 'flex', flexGrow: 1, gap: 6, marginBlockEnd: 0, overflowX: 'auto' },
  gSearch: { paddingBlockEnd: 10, paddingInline: 16 },
  chipSq: { borderRadius: radius['--oniva-radius-md'] },
  gScroll: {
    borderBlockStartColor: colors['--oniva-color-separator'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    maxHeight: 300,
    overflowY: 'auto',
    paddingInline: 16,
  },
  gLabel: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    letterSpacing: '0.05em',
    margin: 0,
    paddingBlockEnd: 4,
    paddingBlockStart: 14,
    textTransform: 'uppercase',
  },
  gItem: { alignItems: 'flex-start', display: 'flex', gap: 10, paddingBlock: 9 },
  gText: { fontSize: font['--oniva-font-size-14'], lineHeight: font['--oniva-font-lh-20'] },
  gMeta: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 6, marginBlockStart: 2 },
  gActions: {
    opacity: {
      default: 0,
      [stylex.when.ancestor(':hover')]: 1,
      [stylex.when.ancestor(':focus-within')]: 1,
      '@media (hover: none)': 1,
    },
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'opacity',
  },
  gAdd: {
    alignItems: 'center',
    borderBlockStartColor: colors['--oniva-color-separator'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'flex',
    marginBlockStart: 0,
    paddingBlock: 6,
    paddingInline: 12,
  },
  gTray: {
    borderBlockStartColor: colors['--oniva-color-separator'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    marginBlockStart: 0,
    minHeight: 44,
    paddingInline: 16,
  },
  gRev: { flexDirection: 'row-reverse' },
  gRowGap: { paddingBlockEnd: 0 },
  list: { display: 'flex', flexDirection: 'column', gap: 0, listStyle: 'none', margin: 0, padding: 0 },
  item: { alignItems: 'flex-start', display: 'flex', gap: 10, padding: 12 },
  actions: { display: 'flex', flexShrink: 0, gap: 2 },
  empty: { padding: 16, textAlign: 'center' },
  scroll: { maxHeight: 360, overflowY: 'auto' },
  off: { opacity: 0.5, transitionDuration: motion['--oniva-motion-dur-base'], transitionProperty: 'opacity' },
  text: {
    fontWeight: 400,
    margin: 0,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  textPaused: { color: colors['--oniva-color-text-muted'] },
  rowGap: { paddingBlockEnd: 6 },
  inl: { display: 'inline-flex' },
  chips: { display: 'flex', gap: 6, marginBlockEnd: 8, overflowX: 'auto', paddingBlockEnd: 2 },
  chip: {
    alignItems: 'center',
    backgroundColor: {
      default: colors['--oniva-color-surface-inner'],
      ':hover': colors['--oniva-color-surface-hover'],
      ':is([data-selected])': colors['--oniva-color-accent-soft'],
    },
    borderColor: {
      default: colors['--oniva-color-border'],
      ':is([data-selected])': colors['--oniva-color-accent-text'],
    },
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: {
      default: colors['--oniva-color-text-muted'],
      ':is([data-selected])': colors['--oniva-color-accent-soft-fg'],
    },
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-12'],
    gap: 4,
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 1,
    outlineStyle: { default: 'none', ':is([data-focus-visible])': 'solid' },
    outlineWidth: 2,
    paddingBlock: 3,
    paddingInline: 10,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, border-color, color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  chipCount: { fontVariantNumeric: 'tabular-nums' },
  tray: { alignItems: 'center', display: 'flex', gap: 8, justifyContent: 'space-between', marginBlockStart: 8, minHeight: 28 },
  note: { margin: 0, paddingBlock: 6 },
  adder: { display: 'flex', gap: 6, marginBlockStart: 8 },
  noTop: { marginBlockStart: 0 },
  sr: { borderWidth: 0, clip: 'rect(0 0 0 0)', height: 1, margin: -1, overflow: 'hidden', padding: 0, position: 'absolute', whiteSpace: 'nowrap', width: 1 },
});

export interface AgentMemory {
  id: string;
  text: string;
  /** Where it was learned, e.g. `Chat · Oct 3`. */
  source?: string;
  category?: string;
  /** Pre-formatted date, shown after the source. */
  date?: string;
  /** Kept in the list but not used by the agent. */
  paused?: boolean;
}

export type MemoryPanelVariant = 'cards' | 'grouped';

export interface MemoryPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'title' | 'onChange' | 'onPause'> {
  memories: AgentMemory[];
  title?: string;
  onEdit?: (id: string, text: string) => void;
  /** Called right after the row folds away. Remove the item from `memories` here. */
  onForget?: (id: string) => void;
  /** Brings a forgotten memory back (Undo). Without it Undo is hidden. `index` is its old position. */
  onRestore?: (memory: AgentMemory, index: number) => void;
  onPause?: (id: string, paused: boolean) => void;
  /** Shows a "New memory" button. Add the returned memory to `memories`. */
  onAdd?: (memory: AgentMemory) => void;
  /** "Use memory" master switch. */
  isEnabled?: boolean;
  defaultEnabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  /** How long Undo stays available after forgetting, in ms. Default 5000. */
  undoFor?: number;
  /** `cards` (default): a tile per memory. `grouped`: flat rows under uppercase category labels, count chip, search, hover actions and a footer summary. */
  variant?: MemoryPanelVariant;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** What the agent remembers: master switch, category filters, inline edit, pause, forget with Undo and quick add. */
export function MemoryPanel({
  memories,
  title = 'Memory',
  onEdit,
  onForget,
  onRestore,
  onPause,
  onAdd,
  isEnabled,
  defaultEnabled = true,
  onEnabledChange,
  undoFor = 5000,
  variant = 'cards',
  className,
  xstyle,
  ref,
  ...rest
}: MemoryPanelProps) {
  const fmt = useFormatters();
  const grouped = variant === 'grouped';
  const [searching, setSearching] = useState(false);
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [innerEnabled, setInnerEnabled] = useState(defaultEnabled);
  const enabled = isEnabled ?? innerEnabled;
  const [filter, setFilter] = useState('all');
  const [pausedMap, setPausedMap] = useState<Record<string, boolean>>({});
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState('');
  const [undo, setUndo] = useState<{ memory: AgentMemory; index: number } | null>(null);
  const [live, setLive] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const latest = useRef(memories);
  useEffect(() => {
    latest.current = memories;
  });

  const { leaving, leave } = useLeaving((id) => {
    const index = latest.current.findIndex((m) => m.id === id);
    const memory = latest.current[index];
    onForget?.(id);
    if (memory && onRestore) {
      setUndo({ memory, index });
      setLive(`Forgot “${memory.text}”. Undo available.`);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setUndo(null);
        setLive('');
      }, undoFor);
    }
  }, 280);

  const categories = [...new Set(memories.map((m) => m.category).filter((c): c is string => !!c))];
  const active = filter === 'all' || categories.includes(filter) ? filter : 'all';
  const needle = q.trim().toLowerCase();
  const matches = (m: AgentMemory) => (active === 'all' || m.category === active) && (!needle || m.text.toLowerCase().includes(needle));
  const shown = memories.filter(matches);
  const isPaused = (m: AgentMemory) => pausedMap[m.id] ?? m.paused ?? false;

  const commit = (id: string) => {
    if (draft.trim()) onEdit?.(id, draft.trim());
    setEditing(null);
  };
  const add = () => {
    const text = newText.trim();
    if (!text) return;
    onAdd?.({
      id: `m-${Date.now()}`,
      text,
      category: active === 'all' ? categories[0] : active,
      source: 'You added',
      date: fmt.date(new Date(), { month: 'short', day: 'numeric' }),
    });
    setNewText('');
    setAdding(false);
    setLive('Memory added');
  };
  const sections = grouped ? [...categories, ...(memories.some((m) => !m.category) ? [''] : [])] : [''];
  const pausedCount = memories.filter(isPaused).length;

  return (
    <div {...rest} ref={ref} role="group" aria-label={title} {...mergeSx(stylex.props(grouped ? aiStyles.tile : aiStyles.panel, grouped ? styles.gRoot : aib.pad, xstyle), className)}>
      <div {...stylex.props(aib.head, grouped && styles.gHead)}>
        <h3 {...stylex.props(aib.title)}>{title}</h3>
        <Badge variant="neutral"><AnimatedNumber value={memories.length} />{grouped ? '' : ' saved'}</Badge>
        <span {...stylex.props(aib.grow)} />
        <Switch
          size="sm"
          xstyle={grouped ? styles.gRev : undefined}
          isSelected={enabled}
          onChange={(v) => {
            setInnerEnabled(v);
            onEnabledChange?.(v);
          }}
        >
          Use memory
        </Switch>
      </div>
      <AnimatedHeight isOpen={!enabled}>
        <p {...stylex.props(aib.meta, styles.note, grouped && styles.gSearch)}>Memory is off. Saved items are kept but not used in chats.</p>
      </AnimatedHeight>
      {categories.length > 1 && (
        <div {...stylex.props(grouped && styles.gChips)}>
        <RadioGroup aria-label="Filter by category" orientation="horizontal" value={active} onChange={setFilter} className={() => sxClass(stylex.props(styles.chips, grouped && styles.gChipRow))}>
          {['all', ...categories].map((c) => (
            <Radio key={c} value={c} className={() => sxClass(stylex.props(styles.chip, grouped && styles.chipSq))}>
              {c === 'all' ? 'All' : c}
              <span {...stylex.props(styles.chipCount)}>
                {fmt.number(c === 'all' ? memories.length : memories.filter((m) => m.category === c).length)}
              </span>
            </Radio>
          ))}
        </RadioGroup>
        {grouped && (
          <button type="button" aria-label="Search memories" aria-pressed={searching} onClick={() => { setSearching((v) => !v); setQ(''); }} {...stylex.props(aib.mini)}>
            <Search size={14} aria-hidden="true" />
          </button>
        )}
        </div>
      )}
      {grouped && searching && (
        <div {...stylex.props(styles.gSearch)}>
          <input autoFocus type="search" aria-label="Search memories" placeholder="Search memories" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Escape') { setSearching(false); setQ(''); } }} {...stylex.props(aib.field)} />
        </div>
      )}
      <div {...stylex.props(grouped ? styles.gScroll : styles.scroll, !enabled && styles.off)}>
        <ul {...stylex.props(styles.list)}>
          {sections.map((sec) => {
            const items = grouped ? memories.filter((m) => (m.category ?? '') === sec) : memories;
            const anyShown = items.some(matches);
            return (
              <Fragment key={sec || 'all'}>
                {grouped && anyShown && (
                  <li role="presentation"><h4 {...stylex.props(styles.gLabel)}>{sec || 'Other'}</h4></li>
                )}
                {items.map((m) => {
            const paused = isPaused(m);
            const visible = matches(m) && !leaving.has(m.id);
            return (
              <li key={m.id} style={{ display: 'contents' }}>
                <AnimatedHeight isOpen={visible}>
                <div {...stylex.props(styles.rowGap, grouped && styles.gRowGap, stylex.defaultMarker())}>
                <Presence isPresent={visible} preset="blur" xstyle={grouped ? styles.gItem : [aiStyles.tile, styles.item]}>
                  <div {...stylex.props(aib.grow)}>
                    {editing === m.id ? (
                      <input
                        autoFocus
                        aria-label="Edit memory"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commit(m.id);
                          if (e.key === 'Escape') setEditing(null);
                        }}
                        {...stylex.props(aib.field)}
                      />
                    ) : (
                      <p {...stylex.props(aib.name, styles.text, grouped && styles.gText, paused && styles.textPaused)}>{m.text}</p>
                    )}
                    <div {...stylex.props(aib.meta, grouped && styles.gMeta)}>
                      {(grouped ? [m.source, m.date] : [m.category, m.source, m.date]).filter(Boolean).join(' · ')}
                      <Presence isPresent={paused} preset="blur" initial={false} xstyle={styles.inl}>
                        {grouped ? <Badge variant="warning" size="sm">Paused</Badge> : ' · Paused'}
                      </Presence>
                    </div>
                  </div>
                  <div {...stylex.props(styles.actions, grouped && styles.gActions)}>
                    {editing === m.id ? (
                      <button type="button" aria-label="Save memory" onClick={() => commit(m.id)} {...stylex.props(aib.mini)}>
                        <Check size={14} />
                      </button>
                    ) : (
                      <button type="button" aria-label={`Edit memory: ${m.text}`} onClick={() => { setDraft(m.text); setEditing(m.id); }} {...stylex.props(aib.mini)}>
                        <Pencil size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      aria-label={`${paused ? 'Resume' : 'Pause'} memory: ${m.text}`}
                      aria-pressed={paused}
                      onClick={() => {
                        setPausedMap((s) => ({ ...s, [m.id]: !paused }));
                        onPause?.(m.id, !paused);
                      }}
                      {...stylex.props(aib.mini)}
                    >
                      <CrossFade as="span" contentKey={paused ? 'play' : 'pause'} duration={200}>
                        {paused ? <Play size={14} /> : <Pause size={14} />}
                      </CrossFade>
                    </button>
                    <button type="button" aria-label={`Forget memory: ${m.text}`} onClick={() => leave(m.id)} {...stylex.props(aib.mini)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </Presence>
                </div>
                </AnimatedHeight>
              </li>
            );
                })}
              </Fragment>
            );
          })}
        </ul>
        {shown.length === 0 && <p {...stylex.props(aib.meta, styles.empty)}>No memories yet. They appear as you chat.</p>}
      </div>
      {onAdd && (
        <div {...stylex.props(styles.adder, grouped && styles.gAdd)}>
          <CrossFade as="div" contentKey={adding ? 'edit' : 'btn'} duration={200}>
          {adding ? (
            <div {...stylex.props(styles.adder, styles.noTop)}>
              <input
                autoFocus
                aria-label="New memory"
                placeholder="What should it remember?"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') add();
                  if (e.key === 'Escape') setAdding(false);
                }}
                {...stylex.props(aib.field)}
              />
              <button type="button" aria-label="Save new memory" onClick={add} {...stylex.props(aib.mini)}>
                <Check size={14} />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setAdding(true)} {...stylex.props(aib.mini)}>
              <Plus size={14} aria-hidden="true" /> New memory
            </button>
          )}
          </CrossFade>
        </div>
      )}
      <div {...stylex.props(styles.tray, grouped && styles.gTray)}>
        <span {...stylex.props(aib.meta, aiStyles.num)}>
          <AnimatedNumber value={shown.length} /> {shown.length === 1 ? 'memory' : 'memories'}
          {pausedCount > 0 && (<> · <AnimatedNumber value={pausedCount} /> paused</>)}
        </span>
        <Presence isPresent={!!undo && !!onRestore} preset="blur" initial={false} xstyle={styles.inl}>
        {undo && onRestore && (
          <button
            type="button"
            onClick={() => {
              onRestore(undo.memory, undo.index);
              setUndo(null);
              setLive('Memory restored');
            }}
            {...stylex.props(aib.mini)}
          >
            <Undo2 size={14} aria-hidden="true" /> Undo
          </button>
        )}
        </Presence>
      </div>
      <span role="status" aria-live="polite" {...stylex.props(styles.sr)}>
        {live}
      </span>
    </div>
  );
}
