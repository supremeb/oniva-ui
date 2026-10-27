import type { SheetColumn, SheetRow } from './types';

/* ---------- addresses & ranges ---------- */

/** 0 -> A, 25 -> Z, 26 -> AA. */
export function colLetter(index: number): string {
  let n = index;
  let out = '';
  do {
    out = String.fromCharCode(65 + (n % 26)) + out;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return out;
}

/** A1 address; row/col are 0-based. */
export function cellAddress(row: number, col: number): string {
  return `${colLetter(col)}${row + 1}`;
}

/** Position in the *view* (sorted) order. */
export interface CellPos {
  row: number;
  col: number;
}
export interface Range {
  r1: number;
  c1: number;
  r2: number;
  c2: number;
}

export function makeRange(a: CellPos, b: CellPos): Range {
  return {
    r1: Math.min(a.row, b.row),
    c1: Math.min(a.col, b.col),
    r2: Math.max(a.row, b.row),
    c2: Math.max(a.col, b.col),
  };
}
export function inRange(range: Range, row: number, col: number): boolean {
  return row >= range.r1 && row <= range.r2 && col >= range.c1 && col <= range.c2;
}
export function rangeCellCount(r: Range): number {
  return (r.r2 - r.r1 + 1) * (r.c2 - r.c1 + 1);
}

export type Direction = 'up' | 'down' | 'left' | 'right';

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/** Move one cell, or jump to the edge. Clamped, never wraps. */
export function moveCell(pos: CellPos, dir: Direction, rowCount: number, colCount: number, jump = false): CellPos {
  const lastR = Math.max(0, rowCount - 1);
  const lastC = Math.max(0, colCount - 1);
  switch (dir) {
    case 'up':
      return { row: jump ? 0 : clamp(pos.row - 1, 0, lastR), col: pos.col };
    case 'down':
      return { row: jump ? lastR : clamp(pos.row + 1, 0, lastR), col: pos.col };
    case 'left':
      return { row: pos.row, col: jump ? 0 : clamp(pos.col - 1, 0, lastC) };
    case 'right':
      return { row: pos.row, col: jump ? lastC : clamp(pos.col + 1, 0, lastC) };
  }
}

/** Tab / Shift+Tab: next/prev cell, wrapping across rows, clamped at the grid ends. */
export function tabCell(pos: CellPos, backwards: boolean, rowCount: number, colCount: number): CellPos {
  const idx = pos.row * colCount + pos.col + (backwards ? -1 : 1);
  const total = rowCount * colCount;
  const i = clamp(idx, 0, Math.max(0, total - 1));
  return { row: Math.floor(i / colCount), col: i % colCount };
}

/* ---------- sort ---------- */

export type SortDir = 'asc' | 'desc';
export interface SortState {
  key: string;
  dir: SortDir;
}

/** asc -> desc -> none. */
export function nextSort(current: SortState | null, key: string): SortState | null {
  if (!current || current.key !== key) return { key, dir: 'asc' };
  if (current.dir === 'asc') return { key, dir: 'desc' };
  return null;
}

function compareValues(a: unknown, b: unknown, col: SheetColumn): number {
  const aEmpty = a === undefined || a === null || a === '';
  const bEmpty = b === undefined || b === null || b === '';
  if (aEmpty || bEmpty) return aEmpty === bEmpty ? 0 : aEmpty ? 1 : -1;
  if (col.type === 'number') return Number(a) - Number(b);
  if (col.type === 'date') return toTime(a) - toTime(b);
  return String(a).localeCompare(String(b), undefined, { sensitivity: 'base', numeric: true });
}
function toTime(v: unknown): number {
  if (v instanceof Date) return v.getTime();
  const t = new Date(String(v)).getTime();
  return Number.isNaN(t) ? 0 : t;
}

/** Stable sort; empty values always last. Returns a new array. */
export function sortRows(rows: readonly SheetRow[], columns: readonly SheetColumn[], sort: SortState | null): SheetRow[] {
  const col = sort && columns.find((c) => c.key === sort.key);
  if (!sort || !col) return [...rows];
  const sign = sort.dir === 'asc' ? 1 : -1;
  return rows
    .map((row, i) => ({ row, i }))
    .sort((x, y) => {
      const a = x.row[col.key];
      const b = y.row[col.key];
      const aEmpty = a === undefined || a === null || a === '';
      const bEmpty = b === undefined || b === null || b === '';
      if (aEmpty || bEmpty) return compareValues(a, b, col) || x.i - y.i;
      return sign * compareValues(a, b, col) || x.i - y.i;
    })
    .map((e) => e.row);
}

/* ---------- display / TSV ---------- */

export function displayValue(value: unknown, col: SheetColumn): string {
  if (value === undefined || value === null) return '';
  if (col.format) return col.format(value);
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

/** Serialise a range of the view rows as TSV (rows \n, cols \t). */
export function toTSV(viewRows: readonly SheetRow[], columns: readonly SheetColumn[], range: Range): string {
  const lines: string[] = [];
  for (let r = range.r1; r <= range.r2; r++) {
    const cells: string[] = [];
    for (let c = range.c1; c <= range.c2; c++) {
      const col = columns[c];
      const row = viewRows[r];
      const raw = row && col ? displayValue(row[col.key], col) : '';
      cells.push(/[\t\n"]/.test(raw) ? `"${raw.replace(/"/g, '""')}"` : raw);
    }
    lines.push(cells.join('\t'));
  }
  return lines.join('\n');
}

/** Parse TSV (quoted fields supported, as Excel/Sheets emit). Trailing newline ignored. */
export function parseTSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  const src = text.replace(/\r\n?/g, '\n');
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += ch;
    } else if (ch === '"' && field === '') quoted = true;
    else if (ch === '\t') {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += ch;
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/* ---------- state, commit & history (step 2 plugs into these) ---------- */

export interface CellChange {
  rowId: string;
  key: string;
  value: unknown;
}
/** One undo step. `rows` snapshots make add/delete row steps trivial to invert. */
export interface HistoryEntry {
  label: string;
  before: SheetRow[];
  after: SheetRow[];
}
export interface History {
  past: HistoryEntry[];
  future: HistoryEntry[];
}

export interface SheetState {
  rows: SheetRow[];
  sort: SortState | null;
  /** Active cell and anchor are tracked by row id so they survive sorting. */
  active: { rowId: string; col: number } | null;
  anchor: { rowId: string; col: number } | null;
  checked: string[];
  history: History;
}

export function createState(rows: SheetRow[], columnCount = 1): SheetState {
  return {
    rows,
    sort: null,
    active: rows[0] && columnCount > 0 ? { rowId: rows[0].id, col: 0 } : null,
    anchor: rows[0] && columnCount > 0 ? { rowId: rows[0].id, col: 0 } : null,
    checked: [],
    history: { past: [], future: [] },
  };
}

/** Apply cell changes as ONE history step. No-ops (same values) record nothing. */
export function commit(state: SheetState, changes: readonly CellChange[], label: string): SheetState {
  const byRow = new Map<string, Record<string, unknown>>();
  for (const ch of changes) {
    const patch = byRow.get(ch.rowId) ?? {};
    patch[ch.key] = ch.value;
    byRow.set(ch.rowId, patch);
  }
  let changed = false;
  const rows = state.rows.map((row) => {
    const patch = byRow.get(row.id);
    if (!patch) return row;
    const differs = Object.keys(patch).some((k) => row[k] !== patch[k]);
    if (!differs) return row;
    changed = true;
    return { ...row, ...patch };
  });
  if (!changed) return state;
  return commitRows(state, rows, label);
}

/** Replace the whole row set as one history step (add/delete row). */
export function commitRows(state: SheetState, rows: SheetRow[], label: string): SheetState {
  return {
    ...state,
    rows,
    history: { past: [...state.history.past, { label, before: state.rows, after: rows }], future: [] },
  };
}

export function canUndo(s: SheetState): boolean {
  return s.history.past.length > 0;
}
export function canRedo(s: SheetState): boolean {
  return s.history.future.length > 0;
}
export function undo(state: SheetState): SheetState {
  const entry = state.history.past[state.history.past.length - 1];
  if (!entry) return state;
  return {
    ...state,
    rows: entry.before,
    history: { past: state.history.past.slice(0, -1), future: [entry, ...state.history.future] },
  };
}
export function redo(state: SheetState): SheetState {
  const [entry, ...rest] = state.history.future;
  if (!entry) return state;
  return {
    ...state,
    rows: entry.after,
    history: { past: [...state.history.past, entry], future: rest },
  };
}

/* ---------- selection helpers ---------- */

export function toggleChecked(checked: readonly string[], id: string): string[] {
  return checked.includes(id) ? checked.filter((c) => c !== id) : [...checked, id];
}
export type CheckState = 'none' | 'some' | 'all';
export function checkState(checked: readonly string[], rows: readonly SheetRow[]): CheckState {
  const n = rows.filter((r) => checked.includes(r.id)).length;
  return n === 0 ? 'none' : n === rows.length ? 'all' : 'some';
}

/** Status text: A1 address, "N values", or "N rows selected". */
export function statusText(opts: {
  checkedCount: number;
  range: Range | null;
}): { kind: 'rows' | 'values' | 'address' | 'none'; count: number; address?: string } {
  if (opts.checkedCount > 0) return { kind: 'rows', count: opts.checkedCount };
  const r = opts.range;
  if (!r) return { kind: 'none', count: 0 };
  const n = rangeCellCount(r);
  if (n > 1) return { kind: 'values', count: n };
  return { kind: 'address', count: 1, address: cellAddress(r.r1, r.c1) };
}
