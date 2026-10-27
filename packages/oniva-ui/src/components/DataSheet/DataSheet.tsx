import * as stylex from '@stylexjs/stylex';
import { ArrowDown, ArrowUp, Check, Plus, Redo2, Undo2 } from 'lucide-react';
import { Button, ListBox, ListBoxItem } from 'react-aria-components';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { CheckboxBox } from '../../internal/checkbox-box';
import { useFormatters } from '../../internal/format';
import { fp } from '../../internal/forms-popover';
import { FormsPopover } from '../../internal/forms-listbox';
import { mergeSx, sxClass } from '../../internal/sx';
import { Tooltip } from '../Tooltip/Tooltip';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import {
  canRedo,
  canUndo,
  checkState,
  cellAddress,
  commit,
  commitRows,
  createState,
  parseTSV,
  redo,
  toTSV,
  undo,
  type CellChange,
  inRange,
  makeRange,
  moveCell,
  nextSort,
  rangeCellCount,
  sortRows,
  tabCell,
  toggleChecked,
  type CellPos,
  type Direction,
  type Range,
  type SheetState,
} from './sheet-model';
import { editText, isColEditable, parseCellInput, parseDate } from './sheet-edit';
import type { DataSheetProps, SheetColumn, SheetRow, TagTone } from './types';

const styles = stylex.create({
  card: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-card'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: 'none',
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    overflow: 'hidden',
    width: '100%',
  },
  titleRow: {
    alignItems: 'center',
    display: 'flex',
    gap: 10,
    justifyContent: 'space-between',
    paddingBlock: 12,
    paddingInline: 16,
  },
  titleLeft: { alignItems: 'center', display: 'flex', gap: 10, minWidth: 0 },
  iconTile: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-accent-soft'],
    borderRadius: radius['--oniva-radius-xs'],
    color: colors['--oniva-color-accent-soft-fg'],
    display: 'inline-flex',
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  title: {
    fontSize: font['--oniva-font-size-16'],
    fontWeight: font['--oniva-font-weight-medium'],
    margin: 0,
  },
  actions: { display: 'flex', gap: 2 },
  iconButton: {
    alignItems: 'center',
    backgroundColor: { default: 'transparent', ':hover:not(:disabled)': colors['--oniva-color-surface-hover'] },
    borderRadius: radius['--oniva-radius-sm'],
    borderWidth: 0,
    color: { default: colors['--oniva-color-text-muted'], ':disabled': colors['--oniva-color-text-disabled'] },
    cursor: { default: 'pointer', ':disabled': 'default' },
    display: 'inline-flex',
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  scroll: { overflowX: 'auto' },
  grid: {
    outlineStyle: 'none',
    userSelect: 'none',
  },
  row: {
    borderTopColor: colors['--oniva-color-separator'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    display: 'grid',
    minHeight: 44,
  },
  rowChecked: { backgroundColor: colors['--oniva-color-surface-hover'] },
  template: (t: string) => ({ gridTemplateColumns: t }),
  headerRow: { minHeight: 40 },
  cell: {
    alignItems: 'center',
    boxSizing: 'border-box',
    display: 'flex',
    minWidth: 0,
    paddingInline: 12,
    position: 'relative',
  },
  checkCell: { justifyContent: 'center', paddingInline: 0 },
  checkButton: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    cursor: 'pointer',
    display: 'inline-flex',
    height: 28,
    justifyContent: 'center',
    padding: 0,
    width: 28,
  },
  inRange: { backgroundColor: colors['--oniva-color-accent-soft'] },
  active: {
    boxShadow: `inset 0 0 0 2px ${accent['--oniva-accent-focus']}`,
    zIndex: 1,
  },
  headerButton: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: { default: colors['--oniva-color-text-muted'], ':hover': colors['--oniva-color-text'] },
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 6,
    padding: 0,
  },
  headerIcon: { display: 'inline-flex', flexShrink: 0 },
  sortArrow: {
    display: 'inline-flex',
    opacity: { default: 0, ':is([data-sort])': 1 },
    transform: { default: 'rotate(0deg)', ':is([data-sort="desc"])': 'rotate(180deg)' },
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  titleCell: { alignItems: 'center', display: 'flex', fontWeight: font['--oniva-font-weight-medium'], gap: 8, minWidth: 0 },
  logo: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-xs'],
    color: colors['--oniva-color-text-on-tertiary'],
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-semibold'],
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  ellipsis: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  pill: {
    borderRadius: radius['--oniva-radius-xs'],
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
    paddingBlock: 2,
    paddingInline: 8,
    whiteSpace: 'nowrap',
  },
  blue: { backgroundColor: colors['--oniva-color-info-bg'], color: colors['--oniva-color-info-fg'] },
  violet: { backgroundColor: colors['--oniva-color-purple-bg'], color: colors['--oniva-color-purple-fg'] },
  pink: { backgroundColor: colors['--oniva-color-danger-bg'], color: colors['--oniva-color-danger-fg'] },
  green: { backgroundColor: colors['--oniva-color-success-bg'], color: colors['--oniva-color-success-fg'] },
  amber: { backgroundColor: colors['--oniva-color-warning-bg'], color: colors['--oniva-color-warning-fg'] },
  gray: { backgroundColor: colors['--oniva-color-surface-tertiary'], color: colors['--oniva-color-text-muted'] },
  link: {
    color: { default: colors['--oniva-color-text-muted'], ':hover': colors['--oniva-color-text'] },
    textDecorationLine: 'underline',
    textDecorationColor: colors['--oniva-color-border-hover'],
    textUnderlineOffset: 3,
  },
  number: { fontVariantNumeric: 'tabular-nums', justifyContent: 'flex-end', textAlign: 'right' },
  headerNumber: { justifyContent: 'flex-end' },
  footer: {
    alignItems: 'center',
    borderTopColor: colors['--oniva-color-separator'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: 44,
    paddingInline: 12,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: { default: 'transparent', ':hover:not(:disabled)': colors['--oniva-color-surface-hover'] },
    borderRadius: radius['--oniva-radius-sm'],
    borderWidth: 0,
    color: colors['--oniva-color-text-muted'],
    cursor: { default: 'pointer', ':disabled': 'default' },
    display: 'inline-flex',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-14'],
    gap: 6,
    height: 32,
    paddingInline: 8,
  },
  srOnly: {
    borderWidth: 0,
    clipPath: 'inset(50%)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
  },
  hidden: { opacity: 0 },
  editor: {
    appearance: 'none',
    backgroundColor: colors['--oniva-color-surface'],
    borderWidth: 0,
    boxShadow: `inset 0 0 0 2px ${accent['--oniva-accent-focus']}`,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    fontFamily: 'inherit',
    fontSize: 'inherit',
    inset: 0,
    margin: 0,
    outlineStyle: 'none',
    paddingBlock: 0,
    paddingInline: 12,
    position: 'absolute',
    width: '100%',
    zIndex: 2,
  },
  editorNumber: { fontVariantNumeric: 'tabular-nums', textAlign: 'right' },
  editorInvalid: { boxShadow: `inset 0 0 0 2px ${colors['--oniva-color-danger-solid']}` },
  pickerInput: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderBottomColor: colors['--oniva-color-separator'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    borderWidth: 0,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    display: 'block',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-14'],
    height: 36,
    outlineStyle: 'none',
    paddingInline: 12,
    width: '100%',
  },
  createText: { color: colors['--oniva-color-text-muted'] },
  status: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    fontVariantNumeric: 'tabular-nums',
    paddingInline: 4,
  },
});

const PILL_TONES: TagTone[] = ['blue', 'violet', 'pink', 'green', 'amber', 'gray'];

interface Editing {
  rowId: string;
  col: number;
  draft: string;
  invalid: boolean;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function plural(n: number, noun: string): string {
  return `${n} ${noun}${n === 1 ? '' : 's'}`;
}

interface TagPickerProps {
  triggerRef: RefObject<HTMLElement | null>;
  col: SheetColumn;
  current: string;
  options: string[];
  draft: string;
  tagTones?: Record<string, TagTone>;
  onDraft: (v: string) => void;
  onPick: (v: string, move: 'down' | 'next' | null) => void;
  onCancel: () => void;
}

/** Listbox popover anchored to the edited tag cell; the input keeps focus (virtual highlight). */
function TagPicker({ triggerRef, col, current, options, draft, tagTones, onDraft, onPick, onCancel }: TagPickerProps) {
  const q = draft.trim();
  const filtered = options.filter((o) => o.toLowerCase().includes(q.toLowerCase()));
  const canCreate = !col.options && q !== '' && !options.some((o) => o.toLowerCase() === q.toLowerCase());
  const items: { id: string; label: string; create?: boolean }[] = [
    ...filtered.map((o) => ({ id: `opt:${o}`, label: o })),
    ...(canCreate ? [{ id: 'create', label: q, create: true }] : []),
  ];
  const [hl, setHl] = useState(0);
  const index = Math.min(hl, Math.max(0, items.length - 1));
  const pickAt = (i: number, move: 'down' | 'next' | null) => {
    const it = items[i];
    if (it) onPick(it.label, move);
    else onCancel();
  };

  return (
    <FormsPopover
      isOpen
      triggerRef={triggerRef}
      placement="bottom start"
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <div
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            onCancel();
          }
          e.stopPropagation();
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          role="combobox"
          aria-expanded="true"
          aria-autocomplete="list"
          aria-label={`${col.label} options`}
          placeholder={col.options ? 'Search' : 'Search or create'}
          value={draft}
          onChange={(e) => {
            setHl(0);
            onDraft(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setHl(Math.min(items.length - 1, index + 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setHl(Math.max(0, index - 1));
            } else if (e.key === 'Enter') {
              e.preventDefault();
              pickAt(index, 'down');
            } else if (e.key === 'Tab') {
              e.preventDefault();
              pickAt(index, 'next');
            }
          }}
          {...stylex.props(styles.pickerInput)}
        />
        <ListBox aria-label={`${col.label} options`} selectionMode="none" items={items} className={sxClass(stylex.props(fp.listbox))}
          onAction={(key) => pickAt(items.findIndex((i) => i.id === key), null)}
        >
          {(item) => (
            <ListBoxItem
              id={item.id}
              textValue={item.create ? `Create '${item.label}'` : item.label}
              className={() =>
                sxClass(stylex.props(fp.item, items[index]?.id === item.id && fp.itemFocused))
              }
            >
              {item.create ? (
                <span {...stylex.props(fp.itemLabel, styles.createText)}>Create '{item.label}'</span>
              ) : (
                <>
                  <span {...stylex.props(fp.itemLabel)}>
                    <span
                      data-tone={toneFor(item.label, tagTones)}
                      {...stylex.props(styles.pill, styles[toneFor(item.label, tagTones)])}
                    >
                      {item.label}
                    </span>
                  </span>
                  {item.label === current ? <Check size={16} aria-hidden="true" {...stylex.props(fp.check)} /> : null}
                </>
              )}
            </ListBoxItem>
          )}
        </ListBox>
      </div>
    </FormsPopover>
  );
}

/** Fallback tone (stable per label) when `tagTones` has no entry. */
function toneFor(label: string, tones?: Record<string, TagTone>): TagTone {
  const hit = tones?.[label];
  if (hit) return hit;
  let h = 0;
  for (const ch of label) h = (h * 31 + ch.charCodeAt(0)) % PILL_TONES.length;
  return PILL_TONES[h] as TagTone;
}

export function DataSheet({
  title,
  icon,
  columns,
  rows,
  tagTones,
  editable = true,
  onRowsChange,
  onSelectionChange,
  addRowLabel = 'Add row',
  className,
  xstyle,
  ref,
}: DataSheetProps) {
  const fmt = useFormatters();
  const gridId = useId();
  const gridRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<SheetState>(() => createState(rows, columns.length));
  const dragging = useRef(false);
  const [editing, setEditing] = useState<Editing | null>(null);
  const editRef = useRef<Editing | null>(null);
  const editCellRef = useRef<HTMLDivElement | null>(null);
  const wasEditing = useRef(false);
  const rowSeq = useRef(0);
  const [live, setLive] = useState({ text: '', n: 0 });
  const announce = (text: string) => setLive((l) => ({ text, n: l.n + 1 }));
  const setEdit = (v: Editing | null) => {
    editRef.current = v;
    setEditing(v);
  };

  const view = useMemo(() => sortRows(state.rows, columns, state.sort), [state.rows, state.sort, columns]);
  const colCount = columns.length;

  const posOf = useCallback(
    (p: { rowId: string; col: number } | null): CellPos | null => {
      if (!p) return null;
      const row = view.findIndex((r) => r.id === p.rowId);
      return row < 0 ? null : { row, col: Math.min(p.col, colCount - 1) };
    },
    [view, colCount],
  );
  const activePos = posOf(state.active);
  const anchorPos = posOf(state.anchor) ?? activePos;
  const range: Range | null = activePos && anchorPos ? makeRange(anchorPos, activePos) : null;

  /* ----- callbacks to the host ----- */
  const firstRows = useRef(true);
  useEffect(() => {
    if (firstRows.current) {
      firstRows.current = false;
      return;
    }
    onRowsChange?.(state.rows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.rows]);
  const firstSel = useRef(true);
  useEffect(() => {
    if (firstSel.current) {
      firstSel.current = false;
      return;
    }
    onSelectionChange?.(state.checked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.checked]);

  /* ----- selection ----- */
  const select = useCallback(
    (pos: CellPos, extend: boolean) => {
      const row = view[pos.row];
      if (!row) return;
      setState((s) => {
        const target = { rowId: row.id, col: pos.col };
        return { ...s, active: target, anchor: extend ? (s.anchor ?? target) : target };
      });
    },
    [view],
  );

  /* ----- editing ----- */
  useEffect(() => {
    if (wasEditing.current && !editing) gridRef.current?.focus();
    wasEditing.current = !!editing;
  }, [editing]);

  const startEdit = (pos: CellPos, initial?: string) => {
    const row = view[pos.row];
    const col = columns[pos.col];
    if (!row || !col || !isColEditable(col, editable)) return;
    const draft = col.type === 'tag' ? (initial ?? '') : (initial ?? editText(row[col.key], col));
    setEdit({ rowId: row.id, col: pos.col, draft, invalid: false });
  };

  /** Save (or cancel) the open editor. Returns false when validation keeps it open. */
  const finishEdit = (save: boolean, move: 'down' | 'up' | 'next' | 'prev' | null, picked?: string): boolean => {
    const ed = editRef.current;
    if (!ed) return true;
    const pos = posOf({ rowId: ed.rowId, col: ed.col });
    const col = columns[ed.col];
    if (!pos || !col) {
      setEdit(null);
      return true;
    }
    let changes: CellChange[] = [];
    if (save) {
      const parsed = parseCellInput(picked ?? ed.draft, col);
      if (!parsed.ok) {
        setEdit({ ...ed, invalid: true });
        return false;
      }
      changes = [{ rowId: ed.rowId, key: col.key, value: parsed.value }];
    }
    setEdit(null);
    let target: CellPos | null = null;
    if (move === 'down') target = moveCell(pos, 'down', view.length, colCount);
    else if (move === 'up') target = moveCell(pos, 'up', view.length, colCount);
    else if (move === 'next') target = tabCell(pos, false, view.length, colCount);
    else if (move === 'prev') target = tabCell(pos, true, view.length, colCount);
    const targetRow = target ? view[target.row] : undefined;
    setState((s) => {
      let next = changes.length ? commit(s, changes, 'Edit') : s;
      if (target && targetRow) {
        const t = { rowId: targetRow.id, col: target.col };
        next = { ...next, active: t, anchor: t };
      }
      return next;
    });
    if (changes.length) announce(`Edited ${cellAddress(pos.row, pos.col)}`);
    return true;
  };

  const clearRange = (): boolean => {
    if (!editable || !range) return false;
    const changes: CellChange[] = [];
    for (let r = range.r1; r <= range.r2; r++) {
      for (let c = range.c1; c <= range.c2; c++) {
        const col = columns[c];
        const row = view[r];
        if (row && col && isColEditable(col, editable)) changes.push({ rowId: row.id, key: col.key, value: undefined });
      }
    }
    if (!changes.length) return false;
    setState((s) => commit(s, changes, 'Clear'));
    announce(`Cleared ${plural(changes.length, 'cell')}`);
    return true;
  };

  const fixSelection = (s: SheetState): SheetState => {
    const has = (p: SheetState['active']) => !!p && s.rows.some((r) => r.id === p.rowId);
    if (has(s.active) && has(s.anchor)) return s;
    const first = s.rows[0];
    const t = first ? { rowId: first.id, col: 0 } : null;
    return { ...s, active: t, anchor: t };
  };
  const doUndo = () => {
    if (!canUndo(state)) return;
    setEdit(null);
    setState((s) => fixSelection(undo(s)));
    announce('Undid edit');
  };
  const doRedo = () => {
    if (!canRedo(state)) return;
    setEdit(null);
    setState((s) => fixSelection(redo(s)));
    announce('Redid edit');
  };

  const addRow = () => {
    if (!editable) return;
    const id = `row-${Date.now().toString(36)}-${++rowSeq.current}`;
    const t = { rowId: id, col: 0 };
    setState((s) => ({ ...commitRows(s, [...s.rows, { id }], 'Add row'), active: t, anchor: t }));
    announce('Added row');
    if (isColEditable(columns[0], editable)) setEdit({ rowId: id, col: 0, draft: '', invalid: false });
  };

  /* ----- clipboard ----- */
  const copyColumns = useMemo(
    () =>
      columns.map((c) =>
        c.type === 'date' && !c.format
          ? {
              ...c,
              format: (v: unknown) => {
                const d = parseDate(v);
                return d ? fmt.date(d) : '';
              },
            }
          : c,
      ),
    [columns, fmt],
  );
  const inEditor = (e: { target: EventTarget }) => !!(e.target as HTMLElement).closest('input, textarea');

  const onCopy = (e: ClipboardEvent<HTMLDivElement>) => {
    if (inEditor(e) || !range) return;
    const tsv = toTSV(view, copyColumns, range);
    const html = `<table><tbody>${parseTSV(tsv)
      .map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`)
      .join('')}</tbody></table>`;
    e.clipboardData.setData('text/plain', tsv);
    e.clipboardData.setData('text/html', html);
    e.preventDefault();
  };
  const onCut = (e: ClipboardEvent<HTMLDivElement>) => {
    if (inEditor(e) || !range) return;
    onCopy(e);
    if (editable) clearRange();
  };
  const onPaste = (e: ClipboardEvent<HTMLDivElement>) => {
    if (inEditor(e)) return;
    e.preventDefault();
    if (!editable || !activePos) return;
    const matrix = parseTSV(e.clipboardData.getData('text/plain'));
    const changes: CellChange[] = [];
    matrix.forEach((cells, i) => {
      cells.forEach((text, j) => {
        const row = view[activePos.row + i];
        const col = columns[activePos.col + j];
        if (!row || !col || !isColEditable(col, editable)) return;
        const parsed = parseCellInput(text, col);
        if (parsed.ok) changes.push({ rowId: row.id, key: col.key, value: parsed.value });
      });
    });
    if (!changes.length) {
      announce('Nothing pasted');
      return;
    }
    setState((s) => commit(s, changes, 'Paste'));
    announce(`Pasted ${plural(changes.length, 'cell')}`);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('[role="checkbox"], a, input, textarea')) return;
    const mod = e.metaKey || e.ctrlKey;
    const key = e.key.toLowerCase();
    if (mod && key === 'z') {
      e.preventDefault();
      if (e.shiftKey) doRedo();
      else doUndo();
      return;
    }
    if (e.ctrlKey && key === 'y') {
      e.preventDefault();
      doRedo();
      return;
    }
    if (!activePos) return;
    if (e.key === 'Enter' || e.key === 'F2') {
      e.preventDefault();
      startEdit(activePos);
      return;
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      clearRange();
      return;
    }
    if (e.key.length === 1 && !mod && !e.altKey) {
      e.preventDefault();
      startEdit(activePos, e.key);
      return;
    }
    const lastR = view.length - 1;
    const lastC = colCount - 1;
    const arrow: Record<string, Direction | undefined> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    };
    let next: CellPos | null = null;
    if (arrow[e.key]) next = moveCell(activePos, arrow[e.key] as Direction, view.length, colCount, mod);
    else if (e.key === 'Tab') {
      const t = tabCell(activePos, e.shiftKey, view.length, colCount);
      // Let focus leave the grid at either end.
      if (t.row === activePos.row && t.col === activePos.col) return;
      next = t;
      select(next, false);
      e.preventDefault();
      return;
    } else if (e.key === 'Home') next = { row: mod ? 0 : activePos.row, col: 0 };
    else if (e.key === 'End') next = { row: mod ? lastR : activePos.row, col: lastC };
    else if (mod && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      const first = view[0];
      const last = view[lastR];
      if (!first || !last) return;
      setState((s) => ({ ...s, anchor: { rowId: first.id, col: 0 }, active: { rowId: last.id, col: lastC } }));
      return;
    } else if (e.key === 'Escape') {
      setState((s) => ({ ...s, anchor: s.active }));
      return;
    }
    if (next) {
      e.preventDefault();
      select(next, e.shiftKey);
    }
  };

  const onCellMouseDown = (e: MouseEvent, pos: CellPos) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('a') && (e.metaKey || e.ctrlKey)) return;
    if (editRef.current && !finishEdit(true, null)) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    gridRef.current?.focus();
    dragging.current = true;
    select(pos, e.shiftKey);
  };
  useEffect(() => {
    const up = () => {
      dragging.current = false;
    };
    window.addEventListener('mouseup', up);
    return () => window.removeEventListener('mouseup', up);
  }, []);

  /* ----- sort & checks ----- */
  const toggleSort = (key: string) => setState((s) => ({ ...s, sort: nextSort(s.sort, key) }));
  const allState = checkState(state.checked, state.rows);
  const toggleAll = () =>
    setState((s) => ({ ...s, checked: checkState(s.checked, s.rows) === 'all' ? [] : s.rows.map((r) => r.id) }));

  const template = useMemo(
    () => ['44px', ...columns.map((c) => `minmax(${c.width ?? 160}px, 1fr)`)].join(' '),
    [columns],
  );

  /* ----- status ----- */
  let status = '';
  if (state.checked.length > 0) status = fmt.plural(state.checked.length, { one: '# row selected', other: '# rows selected' });
  else if (range && rangeCellCount(range) > 1) status = fmt.plural(rangeCellCount(range), { one: '# value', other: '# values' });
  else if (range) status = cellAddress(range.r1, range.c1);

  const activeRow = activePos ? view[activePos.row] : null;
  const cellId = (rowId: string, col: number) => `${gridId}-${rowId}-${col}`;

  const renderValue = (row: SheetRow, col: SheetColumn): ReactNode => {
    const value = row[col.key];
    const text = col.format
      ? col.format(value)
      : col.type === 'date'
        ? (() => {
            const d = parseDate(value);
            return d ? fmt.date(d) : '';
          })()
        : col.type === 'number' && typeof value === 'number'
          ? fmt.number(value)
          : value === undefined || value === null
            ? ''
            : String(value);
    switch (col.type) {
      case 'title':
        return (
          <span {...stylex.props(styles.titleCell)}>
            <span aria-hidden="true" {...stylex.props(styles.logo)}>
              {row.logo ?? (text ? text.charAt(0).toUpperCase() : '')}
            </span>
            <span {...stylex.props(styles.ellipsis)}>{text}</span>
          </span>
        );
      case 'tag':
        return text ? (
          <span {...stylex.props(styles.pill, styles[toneFor(text, tagTones)])} data-tone={toneFor(text, tagTones)}>
            {text}
          </span>
        ) : null;
      case 'link':
        return text ? (
          <a
            href={/^[a-z]+:/i.test(text) ? text : `https://${text}`}
            tabIndex={-1}
            target="_blank"
            rel="noreferrer noopener"
            onClick={(e) => {
              if (!(e.metaKey || e.ctrlKey)) e.preventDefault();
            }}
            {...stylex.props(styles.link, styles.ellipsis)}
          >
            {text}
          </a>
        ) : null;
      default:
        return <span {...stylex.props(styles.ellipsis)}>{text}</span>;
    }
  };

  const merged = mergeSx(stylex.props(styles.card, xstyle), className);

  return (
    <div ref={ref} {...merged}>
      <div {...stylex.props(styles.titleRow)}>
        <div {...stylex.props(styles.titleLeft)}>
          {icon ? (
            <span aria-hidden="true" {...stylex.props(styles.iconTile)}>
              {icon}
            </span>
          ) : null}
          <h3 {...stylex.props(styles.title)}>{title}</h3>
        </div>
        <div {...stylex.props(styles.actions)}>
          <Tooltip content="Undo (⌘Z)" showArrow={false}>
            <Button aria-label="Undo" isDisabled={!canUndo(state)} onPress={doUndo} {...stylex.props(styles.iconButton)}>
              <Undo2 size={16} aria-hidden="true" />
            </Button>
          </Tooltip>
          <Tooltip content="Redo (⌘⇧Z)" showArrow={false}>
            <Button aria-label="Redo" isDisabled={!canRedo(state)} onPress={doRedo} {...stylex.props(styles.iconButton)}>
              <Redo2 size={16} aria-hidden="true" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <div {...stylex.props(styles.scroll)}>
        <div
          ref={gridRef}
          role="grid"
          aria-label={title}
          aria-multiselectable="true"
          aria-rowcount={view.length + 1}
          aria-colcount={colCount + 1}
          aria-readonly={editable ? undefined : true}
          aria-activedescendant={activeRow && activePos ? cellId(activeRow.id, activePos.col) : undefined}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onCopy={onCopy}
          onCut={onCut}
          onPaste={onPaste}
          {...stylex.props(styles.grid)}
        >
          <div role="row" aria-rowindex={1} {...stylex.props(styles.row, styles.headerRow, styles.template(template))}>
            <div role="columnheader" {...stylex.props(styles.cell, styles.checkCell)}>
              <button
                type="button"
                role="checkbox"
                aria-checked={allState === 'all' ? true : allState === 'some' ? 'mixed' : false}
                aria-label="Select all rows"
                onClick={toggleAll}
                {...stylex.props(styles.checkButton)}
              >
                <CheckboxBox isSelected={allState === 'all'} isIndeterminate={allState === 'some'} density="compact" />
              </button>
            </div>
            {columns.map((col) => {
              const dir = state.sort?.key === col.key ? state.sort.dir : undefined;
              return (
                <div
                  key={col.key}
                  role="columnheader"
                  aria-sort={dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none'}
                  {...stylex.props(styles.cell, col.type === 'number' && styles.headerNumber)}
                >
                  <button type="button" onClick={() => toggleSort(col.key)} {...stylex.props(styles.headerButton)}>
                    {col.icon ? (
                      <span aria-hidden="true" {...stylex.props(styles.headerIcon)}>
                        {col.icon}
                      </span>
                    ) : null}
                    {col.label}
                    <span aria-hidden="true" data-sort={dir} {...stylex.props(styles.sortArrow)}>
                      {dir === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {view.map((row, r) => {
            const isChecked = state.checked.includes(row.id);
            const nameCol = columns.find((c) => c.type === 'title') ?? columns[0];
            return (
              <div
                key={row.id}
                role="row"
                aria-rowindex={r + 2}
                aria-selected={isChecked || undefined}
                {...stylex.props(styles.row, styles.template(template), isChecked && styles.rowChecked)}
              >
                <div role="gridcell" {...stylex.props(styles.cell, styles.checkCell)}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={isChecked}
                    aria-label={`Select ${nameCol ? String(row[nameCol.key] ?? row.id) : row.id}`}
                    onClick={() => setState((s) => ({ ...s, checked: toggleChecked(s.checked, row.id) }))}
                    {...stylex.props(styles.checkButton)}
                  >
                    <CheckboxBox isSelected={isChecked} density="compact" />
                  </button>
                </div>
                {columns.map((col, c) => {
                  const selected = !!range && inRange(range, r, c);
                  const isActive = activePos?.row === r && activePos.col === c;
                  const isEditing = editing?.rowId === row.id && editing.col === c;
                  const isTag = col.type === 'tag';
                  return (
                    <div
                      key={col.key}
                      ref={isEditing ? editCellRef : undefined}
                      id={cellId(row.id, c)}
                      role="gridcell"
                      aria-selected={selected}
                      aria-colindex={c + 2}
                      data-active={isActive ? '' : undefined}
                      onMouseDown={(e) => onCellMouseDown(e, { row: r, col: c })}
                      onMouseEnter={() => {
                        if (dragging.current) select({ row: r, col: c }, true);
                      }}
                      onDoubleClick={() => startEdit({ row: r, col: c })}
                      {...stylex.props(
                        styles.cell,
                        col.type === 'number' && styles.number,
                        selected && styles.inRange,
                        isActive && styles.active,
                      )}
                    >
                      {isEditing && !isTag ? (
                        <>
                          <span aria-hidden="true" {...stylex.props(styles.hidden)}>
                            {renderValue(row, col)}
                          </span>
                          <input
                            autoFocus
                            aria-label={`${col.label} ${cellAddress(r, c)}`}
                            aria-invalid={editing.invalid || undefined}
                            inputMode={col.type === 'number' ? 'decimal' : undefined}
                            value={editing.draft}
                            onChange={(e) => setEdit({ ...editing, draft: e.target.value, invalid: false })}
                            onFocus={(e) => {
                              const n = e.currentTarget.value.length;
                              e.currentTarget.setSelectionRange(n, n);
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onBlur={() => {
                              if (editRef.current && !finishEdit(true, null)) finishEdit(false, null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                finishEdit(true, e.shiftKey ? 'up' : 'down');
                              } else if (e.key === 'Tab') {
                                e.preventDefault();
                                finishEdit(true, e.shiftKey ? 'prev' : 'next');
                              } else if (e.key === 'Escape') {
                                e.preventDefault();
                                finishEdit(false, null);
                              }
                              e.stopPropagation();
                            }}
                            {...stylex.props(
                              styles.editor,
                              col.type === 'number' && styles.editorNumber,
                              editing.invalid && styles.editorInvalid,
                            )}
                          />
                        </>
                      ) : (
                        renderValue(row, col)
                      )}
                      {isEditing && isTag ? (
                        <TagPicker
                          triggerRef={editCellRef}
                          col={col}
                          current={String(row[col.key] ?? '')}
                          options={
                            col.options ??
                            Array.from(new Set(state.rows.map((x) => x[col.key]).filter((v): v is string => typeof v === 'string' && v !== '')))
                          }
                          draft={editing.draft}
                          tagTones={tagTones}
                          onDraft={(draft) => setEdit({ ...editing, draft })}
                          onPick={(v, move) => finishEdit(true, move === 'down' ? 'down' : move === 'next' ? 'next' : null, v)}
                          onCancel={() => finishEdit(false, null)}
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div {...stylex.props(styles.footer)}>
        <button type="button" disabled={!editable} onClick={addRow} {...stylex.props(styles.addButton)}>
          <Plus size={16} aria-hidden="true" />
          {addRowLabel}
        </button>
        <span role="status" aria-live="polite" {...stylex.props(styles.status)}>
          {status}
        </span>
      </div>
      <div key={live.n} aria-live="polite" data-live="" {...stylex.props(styles.srOnly)}>
        {live.text}
      </div>
    </div>
  );
}
