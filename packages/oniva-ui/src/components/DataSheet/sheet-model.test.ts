import { describe, expect, it } from 'vitest';
import {
  canRedo,
  canUndo,
  cellAddress,
  checkState,
  colLetter,
  commit,
  createState,
  inRange,
  makeRange,
  moveCell,
  nextSort,
  parseTSV,
  redo,
  sortRows,
  statusText,
  tabCell,
  toTSV,
  undo,
} from './sheet-model';
import type { SheetColumn, SheetRow } from './types';

const cols: SheetColumn[] = [
  { key: 'name', label: 'Name', type: 'title' },
  { key: 'qty', label: 'Qty', type: 'number' },
];
const rows: SheetRow[] = [
  { id: 'a', name: 'Beta', qty: 10 },
  { id: 'b', name: 'alpha', qty: 2 },
  { id: 'c', name: '', qty: 5 },
];

describe('addresses & ranges', () => {
  it('letters columns', () => {
    expect(colLetter(0)).toBe('A');
    expect(colLetter(25)).toBe('Z');
    expect(colLetter(26)).toBe('AA');
    expect(cellAddress(2, 1)).toBe('B3');
  });
  it('normalises ranges', () => {
    const r = makeRange({ row: 3, col: 2 }, { row: 1, col: 0 });
    expect(r).toEqual({ r1: 1, c1: 0, r2: 3, c2: 2 });
    expect(inRange(r, 2, 1)).toBe(true);
    expect(inRange(r, 4, 1)).toBe(false);
  });
  it('moves and clamps', () => {
    expect(moveCell({ row: 0, col: 0 }, 'up', 3, 2)).toEqual({ row: 0, col: 0 });
    expect(moveCell({ row: 0, col: 0 }, 'down', 3, 2, true)).toEqual({ row: 2, col: 0 });
    expect(moveCell({ row: 1, col: 1 }, 'left', 3, 2, true)).toEqual({ row: 1, col: 0 });
  });
  it('tab wraps rows', () => {
    expect(tabCell({ row: 0, col: 1 }, false, 3, 2)).toEqual({ row: 1, col: 0 });
    expect(tabCell({ row: 1, col: 0 }, true, 3, 2)).toEqual({ row: 0, col: 1 });
    expect(tabCell({ row: 2, col: 1 }, false, 3, 2)).toEqual({ row: 2, col: 1 });
  });
});

describe('sort', () => {
  it('cycles asc, desc, none', () => {
    const s1 = nextSort(null, 'name');
    expect(s1).toEqual({ key: 'name', dir: 'asc' });
    const s2 = nextSort(s1, 'name');
    expect(s2?.dir).toBe('desc');
    expect(nextSort(s2, 'name')).toBeNull();
    expect(nextSort(s2, 'qty')).toEqual({ key: 'qty', dir: 'asc' });
  });
  it('sorts text, numbers, empties last', () => {
    expect(sortRows(rows, cols, { key: 'name', dir: 'asc' }).map((r) => r.id)).toEqual(['b', 'a', 'c']);
    expect(sortRows(rows, cols, { key: 'name', dir: 'desc' }).map((r) => r.id)).toEqual(['a', 'b', 'c']);
    expect(sortRows(rows, cols, { key: 'qty', dir: 'asc' }).map((r) => r.id)).toEqual(['b', 'c', 'a']);
    expect(sortRows(rows, cols, null).map((r) => r.id)).toEqual(['a', 'b', 'c']);
  });
});

describe('TSV', () => {
  it('serialises a range', () => {
    expect(toTSV(rows, cols, { r1: 0, c1: 0, r2: 1, c2: 1 })).toBe('Beta\t10\nalpha\t2');
  });
  it('quotes awkward values and round-trips', () => {
    const tricky: SheetRow[] = [{ id: 'x', name: 'a\tb "q"', qty: 1 }];
    const tsv = toTSV(tricky, cols, { r1: 0, c1: 0, r2: 0, c2: 1 });
    expect(parseTSV(tsv)).toEqual([['a\tb "q"', '1']]);
  });
  it('parses Excel-style text', () => {
    expect(parseTSV('a\tb\r\nc\td\r\n')).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
    expect(parseTSV('')).toEqual([]);
  });
});

describe('commit & history', () => {
  it('records one step per commit and undoes/redoes', () => {
    const s0 = createState(rows, cols.length);
    const s1 = commit(
      s0,
      [
        { rowId: 'a', key: 'qty', value: 11 },
        { rowId: 'b', key: 'qty', value: 3 },
      ],
      'Edit',
    );
    expect(s1.rows[0]!.qty).toBe(11);
    expect(s1.history.past).toHaveLength(1);
    expect(canUndo(s1)).toBe(true);
    const s2 = undo(s1);
    expect(s2.rows[0]!.qty).toBe(10);
    expect(canRedo(s2)).toBe(true);
    expect(redo(s2).rows[1]!.qty).toBe(3);
  });
  it('ignores no-op commits', () => {
    const s0 = createState(rows, cols.length);
    expect(commit(s0, [{ rowId: 'a', key: 'qty', value: 10 }], 'Edit')).toBe(s0);
  });
});

describe('selection helpers', () => {
  it('check state', () => {
    expect(checkState([], rows)).toBe('none');
    expect(checkState(['a'], rows)).toBe('some');
    expect(checkState(['a', 'b', 'c'], rows)).toBe('all');
  });
  it('status text', () => {
    expect(statusText({ checkedCount: 0, range: { r1: 2, c1: 1, r2: 2, c2: 1 } })).toMatchObject({ kind: 'address', address: 'B3' });
    expect(statusText({ checkedCount: 0, range: { r1: 0, c1: 0, r2: 1, c2: 1 } })).toMatchObject({ kind: 'values', count: 4 });
    expect(statusText({ checkedCount: 2, range: null })).toMatchObject({ kind: 'rows', count: 2 });
  });
});
