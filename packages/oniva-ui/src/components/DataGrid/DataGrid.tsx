import * as stylex from '@stylexjs/stylex';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, HTMLAttributes, KeyboardEvent, PointerEvent, Ref } from 'react';
import { dash } from '../../internal/dash-styles';
import { fmt } from '../../internal/dash-data';
import { focus } from '../../internal/focus';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

export type DataGridValue = string | number;
export interface DataGridRow {
  id: string;
  [key: string]: DataGridValue;
}
export interface DataGridColumn {
  id: string;
  header: string;
  width?: number;
  minWidth?: number;
  type?: 'text' | 'number' | 'currency' | 'percent';
  editable?: boolean;
  /** Aggregation shown in the sticky summary row. */
  summary?: 'sum' | 'avg' | 'count';
}

const HEADER_H = 36;
const MIN_W = 64;

const styles = stylex.create({
  root: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-xs'],
    overflow: 'hidden',
  },
  scroller: { height: '100%', overflow: 'auto', position: 'relative' },
  row: { display: 'flex', position: 'absolute', left: 0 },
  headRow: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    display: 'flex',
    position: 'sticky',
    top: 0,
    zIndex: 3,
  },
  sumRow: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderTopColor: colors['--oniva-color-border'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    bottom: 0,
    display: 'flex',
    position: 'sticky',
    zIndex: 3,
  },
  cell: {
    alignItems: 'center',
    borderBottomColor: colors['--oniva-color-separator'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    boxSizing: 'border-box',
    display: 'flex',
    flexShrink: 0,
    outline: 'none',
    overflow: 'hidden',
    paddingInline: 12,
    position: 'relative',
  },
  cellActive: {
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: -2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid', ':focus-within': 'solid' },
    outlineWidth: 2,
  },
  cellSelected: { backgroundColor: colors['--oniva-color-accent-tint'] },
  sticky: {
    backgroundColor: colors['--oniva-color-surface'],
    borderRightColor: colors['--oniva-color-border'],
    borderRightStyle: 'solid',
    borderRightWidth: 1,
    left: 0,
    position: 'sticky',
    zIndex: 2,
  },
  stickyHead: { backgroundColor: colors['--oniva-color-surface-inset'] },
  head: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
  },
  right: { justifyContent: 'flex-end', textAlign: 'right' },
  body: { position: 'relative' },
  text: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  sumText: { fontWeight: font['--oniva-font-weight-semibold'] },
  editor: {
    backgroundColor: colors['--oniva-color-surface'],
    borderWidth: 0,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    font: 'inherit',
    fontVariantNumeric: 'tabular-nums',
    height: '100%',
    marginInline: -12,
    outline: 'none',
    paddingInline: 12,
    textAlign: 'inherit',
    width: 'calc(100% + 24px)',
  },
  resizer: {
    backgroundColor: { default: 'transparent', ':hover': colors['--oniva-color-border-active'], ':focus-visible': colors['--oniva-color-focus-ring'] },
    bottom: 0,
    cursor: 'col-resize',
    insetInlineEnd: 0,
    outline: 'none',
    position: 'absolute',
    top: 0,
    touchAction: 'none',
    width: 4,
  },
  resizerActive: { backgroundColor: colors['--oniva-color-border-active'] },
});

function format(v: DataGridValue | undefined, type: DataGridColumn['type']): string {
  if (v == null || v === '') return '';
  if (type && type !== 'text' && typeof v === 'number') return fmt(v, type);
  return String(v);
}

export function summarize(rows: DataGridRow[], col: DataGridColumn): number | null {
  if (!col.summary) return null;
  if (col.summary === 'count') return rows.length;
  let sum = 0;
  let n = 0;
  for (const r of rows) {
    const v = r[col.id];
    if (typeof v === 'number') {
      sum += v;
      n++;
    }
  }
  return col.summary === 'sum' ? sum : n ? sum / n : 0;
}

export function parseCell(text: string, type: DataGridColumn['type']): DataGridValue | null {
  if (!type || type === 'text') return text;
  const cleaned = text.replace(/[^0-9.-]/g, '');
  if (cleaned === '' || Number.isNaN(Number(cleaned))) return null;
  const n = Number(cleaned);
  return type === 'percent' && /%/.test(text) ? n / 100 : n;
}

export interface DataGridProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'onChange'> {
  /** Required accessible name. */
  'aria-label': string;
  columns: DataGridColumn[];
  rows: DataGridRow[];
  /** Called when an inline edit is committed. */
  onCellChange?: (rowId: string, columnId: string, value: DataGridValue) => void;
  /** Viewport height in px (rows are windowed inside). */
  height?: number;
  rowHeight?: number;
  /** Extra rows rendered above/below the viewport. */
  overscan?: number;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function DataGrid({
  columns,
  rows,
  onCellChange,
  height = 420,
  rowHeight = 36,
  overscan = 6,
  className,
  xstyle,
  ref,
  ...rest
}: DataGridProps) {
  const [widths, setWidths] = useState<Record<string, number>>({});
  const [active, setActive] = useState({ r: 0, c: 0 });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [scrollTop, setScrollTop] = useState(0);
  const [resizing, setResizing] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const wantFocus = useRef(false);

  const colW = (c: DataGridColumn) => Math.max(c.minWidth ?? MIN_W, widths[c.id] ?? c.width ?? 140);
  const total = columns.reduce((s, c) => s + colW(c), 0);
  const hasSummary = columns.some((c) => c.summary);
  const bodyH = rows.length * rowHeight;
  const viewportH = height - 2 - HEADER_H - (hasSummary ? rowHeight : 0);

  const first = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const last = Math.min(rows.length - 1, Math.ceil((scrollTop + viewportH) / rowHeight) + overscan);
  const indices = useMemo(() => {
    const out: number[] = [];
    for (let i = first; i <= last; i++) out.push(i);
    if (active.r < first || active.r > last) if (active.r < rows.length) out.push(active.r);
    return out;
  }, [first, last, active.r, rows.length]);

  const summaries = useMemo(() => columns.map((c) => summarize(rows, c)), [columns, rows]);

  useEffect(() => {
    if (!wantFocus.current) return;
    wantFocus.current = false;
    const el = scroller.current?.querySelector<HTMLElement>(`[data-r="${active.r}"][data-c="${active.c}"]`);
    if (!el) return;
    const target = editing ? el.querySelector<HTMLElement>('input') : el;
    target?.focus({ preventScroll: true });
    el.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  });

  const reveal = (r: number) => {
    const el = scroller.current;
    if (!el) return;
    const top = r * rowHeight;
    if (top < el.scrollTop) el.scrollTop = top;
    else if (top + rowHeight > el.scrollTop + viewportH) el.scrollTop = top + rowHeight - viewportH;
  };

  const moveTo = (r: number, c: number) => {
    const nr = Math.min(Math.max(r, 0), rows.length - 1);
    const nc = Math.min(Math.max(c, 0), columns.length - 1);
    wantFocus.current = true;
    setActive({ r: nr, c: nc });
    reveal(nr);
  };

  const commit = (move: 'down' | 'none') => {
    const col = columns[active.c]!;
    const row = rows[active.r]!;
    const parsed = parseCell(draft, col.type);
    setEditing(false);
    if (parsed != null && parsed !== row[col.id]) onCellChange?.(row.id, col.id, parsed);
    if (move === 'down') moveTo(active.r + 1, active.c);
    else wantFocus.current = true;
  };

  const startEdit = (r: number, c: number) => {
    const col = columns[c];
    if (!col?.editable) return;
    const v = rows[r]?.[col.id];
    setDraft(v == null ? '' : String(v));
    setEditing(true);
    wantFocus.current = true;
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (editing) return;
    const page = Math.max(1, Math.floor(viewportH / rowHeight) - 1);
    const k = e.key;
    const ctrl = e.ctrlKey || e.metaKey;
    const go = (r: number, c: number) => {
      e.preventDefault();
      moveTo(r, c);
    };
    if (k === 'ArrowDown') go(active.r + 1, active.c);
    else if (k === 'ArrowUp') go(active.r - 1, active.c);
    else if (k === 'ArrowRight') go(active.r, active.c + 1);
    else if (k === 'ArrowLeft') go(active.r, active.c - 1);
    else if (k === 'PageDown') go(active.r + page, active.c);
    else if (k === 'PageUp') go(active.r - page, active.c);
    else if (k === 'Home') go(ctrl ? 0 : active.r, 0);
    else if (k === 'End') go(ctrl ? rows.length - 1 : active.r, columns.length - 1);
    else if (k === 'Enter' || k === 'F2') {
      e.preventDefault();
      startEdit(active.r, active.c);
    }
  };

  const startResize = (e: PointerEvent<HTMLDivElement>, col: DataGridColumn) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = colW(col);
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    setResizing(col.id);
    const move = (ev: globalThis.PointerEvent) =>
      setWidths((w) => ({ ...w, [col.id]: Math.max(col.minWidth ?? MIN_W, startW + ev.clientX - startX) }));
    const up = () => {
      target.removeEventListener('pointermove', move);
      target.removeEventListener('pointerup', up);
      target.removeEventListener('pointercancel', up);
      setResizing(null);
    };
    target.addEventListener('pointermove', move);
    target.addEventListener('pointerup', up);
    target.addEventListener('pointercancel', up);
  };

  const onResizeKey = (e: KeyboardEvent, col: DataGridColumn) => {
    const step = e.shiftKey ? 40 : 10;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      e.stopPropagation();
      setWidths((w) => ({ ...w, [col.id]: Math.max(col.minWidth ?? MIN_W, colW(col) + (e.key === 'ArrowRight' ? step : -step)) }));
    }
  };

  const sx = stylex.props(dash.root, styles.root, xstyle);
  const rootStyle: CSSProperties = { height };
  const sticky0 = (i: number) => i === 0;

  return (
    <div {...rest} ref={ref} role="grid" aria-rowcount={rows.length + 1 + (hasSummary ? 1 : 0)} aria-colcount={columns.length} {...mergeSx(sx, className, rootStyle)} onKeyDown={onKeyDown}>
      <div ref={scroller} onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)} {...stylex.props(styles.scroller)}>
        <div role="row" aria-rowindex={1} style={{ height: HEADER_H, width: total }} {...stylex.props(styles.headRow)}>
          {columns.map((c, i) => (
            <div
              key={c.id}
              role="columnheader"
              aria-colindex={i + 1}
              style={{ width: colW(c), height: HEADER_H }}
              {...stylex.props(styles.cell, styles.head, c.type && c.type !== 'text' && styles.right, sticky0(i) && styles.sticky, sticky0(i) && styles.stickyHead)}
            >
              <span {...stylex.props(styles.text)}>{c.header}</span>
              <div
                role="separator"
                aria-orientation="vertical"
                aria-label={`Resize ${c.header} column`}
                aria-valuenow={colW(c)}
                aria-valuemin={c.minWidth ?? MIN_W}
                tabIndex={-1}
                onPointerDown={(e) => startResize(e, c)}
                onKeyDown={(e) => onResizeKey(e, c)}
                onDoubleClick={() => setWidths((w) => ({ ...w, [c.id]: c.width ?? 140 }))}
                {...stylex.props(styles.resizer, resizing === c.id && styles.resizerActive)}
              />
            </div>
          ))}
        </div>
        <div role="rowgroup" style={{ height: bodyH, width: total }} {...stylex.props(styles.body)}>
          {indices.map((r) => {
            const row = rows[r]!;
            return (
              <div key={row.id} role="row" aria-rowindex={r + 2} style={{ top: r * rowHeight, height: rowHeight, width: total }} {...stylex.props(styles.row)}>
                {columns.map((c, ci) => {
                  const isActive = active.r === r && active.c === ci;
                  const isEditing = isActive && editing;
                  const numeric = c.type && c.type !== 'text';
                  return (
                    <div
                      key={c.id}
                      role="gridcell"
                      aria-colindex={ci + 1}
                      aria-readonly={c.editable ? undefined : true}
                      tabIndex={isActive && !isEditing ? 0 : -1}
                      data-r={r}
                      data-c={ci}
                      style={{ width: colW(c), height: rowHeight }}
                      onFocus={() => !isActive && setActive({ r, c: ci })}
                      onClick={() => {
                        wantFocus.current = true;
                        setActive({ r, c: ci });
                      }}
                      onDoubleClick={() => {
                        setActive({ r, c: ci });
                        startEdit(r, ci);
                      }}
                      {...stylex.props(styles.cell, styles.cellActive, dash.num, numeric && styles.right, sticky0(ci) && styles.sticky, isActive && styles.cellSelected)}
                    >
                      {isEditing ? (
                        <input
                          aria-label={`Edit ${c.header}`}
                          value={draft}
                          inputMode={numeric ? 'decimal' : 'text'}
                          onChange={(e) => setDraft(e.target.value)}
                          onBlur={() => editing && commit('none')}
                          onKeyDown={(e) => {
                            e.stopPropagation();
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              commit('down');
                            } else if (e.key === 'Escape') {
                              e.preventDefault();
                              setEditing(false);
                              wantFocus.current = true;
                            } else if (e.key === 'Tab') {
                              commit('none');
                            }
                          }}
                          {...stylex.props(styles.editor, focus.inset)}
                        />
                      ) : (
                        <span {...stylex.props(styles.text)}>{format(row[c.id], c.type)}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        {hasSummary && (
          <div role="row" aria-rowindex={rows.length + 2} style={{ height: rowHeight, width: total }} {...stylex.props(styles.sumRow)}>
            {columns.map((c, i) => {
              const v = summaries[i];
              const numeric = c.type && c.type !== 'text';
              return (
                <div
                  key={c.id}
                  role="gridcell"
                  aria-colindex={i + 1}
                  aria-readonly
                  style={{ width: colW(c), height: rowHeight }}
                  {...stylex.props(styles.cell, styles.head, dash.num, numeric && styles.right, sticky0(i) && styles.sticky, sticky0(i) && styles.stickyHead)}
                >
                  <span {...stylex.props(styles.text, styles.sumText)}>
                    {i === 0 && v == null ? 'Total' : v == null ? '' : `${c.summary === 'avg' ? 'Avg ' : c.summary === 'count' ? '' : ''}${c.summary === 'count' ? `${v} rows` : format(v, c.type)}`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
