import * as stylex from '@stylexjs/stylex';
import { Check, ChevronDown, X } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode, type Ref } from 'react';
import { Button as AriaButton, Keyboard as AriaKeyboard } from 'react-aria-components';
import { useFlip } from '../../internal/w1-flip';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { mergeSx } from '../../internal/sx';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { VisuallyHidden } from '../VisuallyHidden';

const chipIn = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(0.9)' },
  to: { opacity: 1, transform: 'scale(1)' },
});
const chipOut = stylex.keyframes({
  from: { opacity: 1, transform: 'scale(1)' },
  to: { opacity: 0, transform: 'scale(0.9)' },
});
const chipFade = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });

const styles = stylex.create({
  root: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-sans'],
    maxWidth: 420,
    overflow: 'hidden',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    paddingBlock: 14,
    paddingInline: 16,
  },
  title: {
    fontSize: font['--oniva-font-size-16'],
    fontWeight: font['--oniva-font-weight-medium'],
    margin: 0,
  },
  clear: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderRadius: radius['--oniva-radius-sm'],
    borderWidth: 0,
    color: colors['--oniva-color-text-muted'],
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    paddingBlock: 2,
    paddingInline: 6,
  },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 6, listStyle: 'none', margin: 0, paddingBlockEnd: 12, paddingInline: 16 },
  item: { listStyle: 'none' },
  chipOut: {
    animationDuration: motion['--oniva-motion-dur-fast'],
    animationFillMode: 'forwards',
    animationName: { default: chipOut, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    opacity: { default: null, [media.reducedMotion]: 0 },
    pointerEvents: 'none',
  },
  chip: {
    alignItems: 'center',
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationName: { default: chipIn, [media.reducedMotion]: chipFade },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-md'],
    color: colors['--oniva-color-text'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 2,
    paddingBlock: 4,
    paddingInlineEnd: 4,
    paddingInlineStart: 10,
  },
  chipX: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-overlay-hover'] },
    },
    borderRadius: radius['--oniva-radius-full'],
    borderWidth: 0,
    color: 'inherit',
    cursor: 'pointer',
    display: 'inline-flex',
    height: 20,
    justifyContent: 'center',
    padding: 0,
    width: 20,
  },
  list: {
    borderTopColor: colors['--oniva-color-border'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    listStyle: 'none',
    margin: 0,
    padding: 6,
  },
  groupHead: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-hover'] },
    },
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'flex',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 8,
    minHeight: 40,
    paddingInline: 10,
    textAlign: 'start',
    width: '100%',
  },
  grow: { flexGrow: 1 },
  badge: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-regular'],
  },
  groupCount: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-regular'],
    marginInlineStart: 8,
  },
  hintsEnd: { marginInlineStart: 'auto' },
  chevron: {
    color: colors['--oniva-color-icon-muted'],
    transform: { default: 'rotate(-90deg)', '[data-open]': 'rotate(0deg)' },
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  option: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-hover'] },
    },
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'flex',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-14'],
    gap: 10,
    minHeight: 34,
    paddingInlineEnd: 10,
    paddingInlineStart: 30,
    textAlign: 'start',
    width: '100%',
  },
  box: {
    alignItems: 'center',
    backgroundColor: { default: 'transparent', '[data-checked]': accent['--oniva-accent-solid'] },
    borderColor: {
      default: colors['--oniva-color-border-control'],
      '[data-checked]': accent['--oniva-accent-solid'],
    },
    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: colors['--oniva-color-accent-fg'],
    display: 'flex',
    flexShrink: 0,
    height: 16,
    justifyContent: 'center',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, border-color',
    width: 16,
  },
  tick: {
    opacity: { default: 0, '[data-checked]': 1 },
    transform: { default: 'scale(0.6)', '[data-checked]': 'scale(1)' },
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-spring'],
  },
  count: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    fontVariantNumeric: 'tabular-nums',
  },
  hints: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderTopColor: colors['--oniva-color-border'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: font['--oniva-font-size-12'],
    gap: 14,
    paddingBlock: 10,
    paddingInline: 16,
  },
  kbd: {
    backgroundColor: colors['--oniva-color-kbd-bg'],
    borderRadius: 4,
    color: colors['--oniva-color-text-on-tertiary'],
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-11'],
    marginInlineEnd: 4,
    paddingBlock: 1,
    paddingInline: 5,
  },
});

export interface FilterMenuOption {
  id: string;
  label: string;
  /** Optional result count shown at the end of the row (locale formatted). */
  count?: number;
}
export interface FilterMenuGroup {
  id: string;
  label: string;
  options: FilterMenuOption[];
  /** Prefix for this group's chips, e.g. `Stage: `. */
  chipPrefix?: string;
}
export type FilterMenuValue = Record<string, string[]>;

export interface FilterMenuProps {
  groups: FilterMenuGroup[];
  /** Picked option ids per group (controlled). */
  value?: FilterMenuValue;
  defaultValue?: FilterMenuValue;
  onChange?: (value: FilterMenuValue) => void;
  /** Group ids that start open. Defaults to the first group. */
  defaultOpen?: string[];
  title?: ReactNode;
  /** Show the keyboard hints footer. Default true. */
  hasHints?: boolean;
  /** Localisation overrides. */
  labels?: { clearAll?: string; filterCount?: (n: number) => string; remove?: (label: string) => string; hints?: { move?: string; pick?: string; open?: string } };
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

type Row = { key: string; kind: 'group'; group: string } | { key: string; kind: 'option'; group: string; option: string };

/**
 * Grouped multi-select filters: collapsible groups of checkbox options, removable chips for what's picked,
 * Clear all and one roving tab stop with full arrow-key control.
 */
export function FilterMenu({
  groups,
  value,
  defaultValue = {},
  onChange,
  defaultOpen,
  title = 'Filters',
  hasHints = true,
  labels,
  className,
  xstyle,
  ref,
}: FilterMenuProps) {
  const fmt = useFormatters();
  const uid = useId();
  const [inner, setInner] = useState<FilterMenuValue>(defaultValue);
  const picked = value ?? inner;
  const [open, setOpen] = useState<string[]>(defaultOpen ?? (groups[0] ? [groups[0].id] : []));
  const [active, setActive] = useState<string>(groups[0] ? `g:${groups[0].id}` : '');
  const [announce, setAnnounce] = useState('');
  const listRef = useRef<HTMLUListElement>(null);

  const commit = (next: FilterMenuValue) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
  };
  const toggle = (g: FilterMenuGroup, o: FilterMenuOption) => {
    const cur = picked[g.id] ?? [];
    const on = cur.includes(o.id);
    const next = { ...picked, [g.id]: on ? cur.filter((x) => x !== o.id) : [...cur, o.id] };
    if (next[g.id]!.length === 0) delete next[g.id];
    commit(next);
    setAnnounce(`${on ? 'Removed' : 'Added'} filter ${g.chipPrefix ?? ''}${o.label}`);
  };
  const clearAll = () => {
    commit({});
    setAnnounce('All filters cleared');
  };

  const chips = useMemo(
    () =>
      groups.flatMap((g) =>
        (picked[g.id] ?? [])
          .map((id) => ({ g, o: g.options.find((o) => o.id === id) }))
          .filter((c): c is { g: FilterMenuGroup; o: FilterMenuOption } => c.o != null),
      ),
    [groups, picked],
  );

  // Removed chips linger as inert ghosts while they shrink away; the rest FLIP into place.
  const chipsRef = useRef<HTMLUListElement>(null);
  useFlip(chipsRef, 220);
  const prevChips = useRef(chips);
  const [ghostChips, setGhostChips] = useState<{ c: (typeof chips)[number]; index: number }[]>([]);
  useEffect(() => {
    const canAnimate = typeof Element !== 'undefined' && typeof Element.prototype.getAnimations === 'function';
    const keyOf = (c: (typeof chips)[number]) => `${c.g.id}:${c.o.id}`;
    const now = new Set(chips.map(keyOf));
    const gone = prevChips.current.map((c, index) => ({ c, index })).filter((x) => !now.has(keyOf(x.c)));
    prevChips.current = chips;
    if (!canAnimate || gone.length === 0) return;
    setGhostChips((cur) => [...cur, ...gone]);
    const t = setTimeout(
      () => setGhostChips((cur) => cur.filter((x) => !gone.some((g) => keyOf(g.c) === keyOf(x.c)))),
      130,
    );
    return () => clearTimeout(t);
  }, [chips]);
  const shownChips: { g: FilterMenuGroup; o: FilterMenuOption; ghost?: boolean }[] = chips.map((c) => ({ ...c }));
  for (const x of ghostChips) shownChips.splice(Math.min(x.index, shownChips.length), 0, { ...x.c, ghost: true });

  const rows: Row[] = groups.flatMap((g) => [
    { key: `g:${g.id}`, kind: 'group' as const, group: g.id },
    ...(open.includes(g.id)
      ? g.options.map((o) => ({ key: `o:${g.id}:${o.id}`, kind: 'option' as const, group: g.id, option: o.id }))
      : []),
  ]);
  const focusRow = (key: string) => {
    setActive(key);
    listRef.current?.querySelector<HTMLElement>(`[data-row="${CSS.escape(key)}"]`)?.focus();
  };
  const toggleGroup = (id: string, force?: boolean) =>
    setOpen((cur) => {
      const isOpen = cur.includes(id);
      const want = force ?? !isOpen;
      return want === isOpen ? cur : want ? [...cur, id] : cur.filter((x) => x !== id);
    });

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const idx = rows.findIndex((r) => r.key === active);
    const row = rows[idx];
    if (!row) return;
    const go = (i: number) => {
      const t = rows[Math.max(0, Math.min(rows.length - 1, i))];
      if (t) focusRow(t.key);
    };
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        return go(idx + 1);
      case 'ArrowUp':
        e.preventDefault();
        return go(idx - 1);
      case 'Home':
        e.preventDefault();
        return go(0);
      case 'End':
        e.preventDefault();
        return go(rows.length - 1);
      case 'ArrowRight':
        if (row.kind === 'group') {
          e.preventDefault();
          if (!open.includes(row.group)) toggleGroup(row.group, true);
          else go(idx + 1);
        }
        return;
      case 'ArrowLeft':
        e.preventDefault();
        if (row.kind === 'option') focusRow(`g:${row.group}`);
        else toggleGroup(row.group, false);
        return;
    }
  };

  const sx = stylex.props(styles.root, xstyle);
  const hint = labels?.hints;
  return (
    <div ref={ref} {...mergeSx(sx, className)}>
      <div {...stylex.props(styles.header)}>
        <h3 {...stylex.props(styles.title)}>{title}</h3>
        {chips.length > 0 && (
          <AriaButton onPress={clearAll} {...stylex.props(styles.clear, focus.ring)}>
            {labels?.clearAll ?? 'Clear all'}
          </AriaButton>
        )}
      </div>
      <AnimatedHeight isOpen={chips.length > 0}>
        <ul ref={chipsRef} aria-label="Active filters" {...stylex.props(styles.chips)}>
          {shownChips.map(({ g, o, ghost }) => (
            <li
              key={`${g.id}:${o.id}`}
              data-flip-id={`${g.id}:${o.id}`}
              aria-hidden={ghost || undefined}
              inert={ghost || undefined}
              {...stylex.props(styles.chip, ghost && styles.chipOut)}
            >
              {g.chipPrefix}
              {o.label}
              <AriaButton
                aria-label={labels?.remove ? labels.remove(o.label) : `Remove filter ${g.chipPrefix ?? ''}${o.label}`}
                onPress={() => toggle(g, o)}
                {...stylex.props(styles.chipX, focus.ring)}
              >
                <X size={12} aria-hidden="true" />
              </AriaButton>
            </li>
          ))}
        </ul>
      </AnimatedHeight>
      <ul ref={listRef} aria-label={typeof title === 'string' ? title : 'Filters'} onKeyDown={onKeyDown} {...stylex.props(styles.list)}>
        {groups.map((g) => {
          const isOpen = open.includes(g.id);
          const n = picked[g.id]?.length ?? 0;
          const gKey = `g:${g.id}`;
          const panel = `${uid}-${g.id}`;
          return (
            <li key={g.id} {...stylex.props(styles.item)}>
              <button
                type="button"
                data-row={gKey}
                data-open={isOpen ? '' : undefined}
                aria-expanded={isOpen}
                aria-controls={panel}
                tabIndex={active === gKey ? 0 : -1}
                onFocus={() => setActive(gKey)}
                onClick={() => toggleGroup(g.id)}
                {...stylex.props(styles.groupHead, focus.inset)}
              >
                <ChevronDown size={16} aria-hidden="true" data-open={isOpen ? '' : undefined} {...stylex.props(styles.chevron)} />
                <span {...stylex.props(styles.grow)}>
                  {g.label}
                  <span {...stylex.props(styles.groupCount)}>{fmt.number(g.options.length)}</span>
                </span>
                {n > 0 && <span {...stylex.props(styles.badge)}>{labels?.filterCount ? labels.filterCount(n) : `${fmt.number(n)} ${n === 1 ? 'filter' : 'filters'}`}</span>}
              </button>
              <AnimatedHeight isOpen={isOpen} id={panel} role="group" aria-label={g.label}>
                {g.options.map((o) => {
                  const key = `o:${g.id}:${o.id}`;
                  const checked = (picked[g.id] ?? []).includes(o.id);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      role="checkbox"
                      aria-checked={checked}
                      data-row={key}
                      data-checked={checked ? '' : undefined}
                      tabIndex={isOpen && active === key ? 0 : -1}
                      onFocus={() => setActive(key)}
                      onClick={() => toggle(g, o)}
                      {...stylex.props(styles.option, focus.inset)}
                    >
                      <span aria-hidden="true" data-checked={checked ? '' : undefined} {...stylex.props(styles.box)}>
                        <Check size={12} strokeWidth={3} data-checked={checked ? '' : undefined} {...stylex.props(styles.tick)} />
                      </span>
                      <span {...stylex.props(styles.grow)}>{o.label}</span>
                      {o.count != null && <span {...stylex.props(styles.count)}>{fmt.number(o.count)}</span>}
                    </button>
                  );
                })}
              </AnimatedHeight>
            </li>
          );
        })}
      </ul>
      {hasHints && (
        <div aria-hidden="true" {...stylex.props(styles.hints)}>
          <span>
            <AriaKeyboard {...stylex.props(styles.kbd)}>↑↓</AriaKeyboard>
            {hint?.move ?? 'to navigate'}
          </span>
          <span {...stylex.props(styles.hintsEnd)}>
            <AriaKeyboard {...stylex.props(styles.kbd)}>↵</AriaKeyboard>
            {hint?.pick ?? 'to select'}
          </span>
          {hint?.open ? (
            <span>
              <AriaKeyboard {...stylex.props(styles.kbd)}>←→</AriaKeyboard>
              {hint.open}
            </span>
          ) : null}
        </div>
      )}
      <VisuallyHidden>
        <span role="status" aria-live="polite">
          {announce}
        </span>
      </VisuallyHidden>
    </div>
  );
}
