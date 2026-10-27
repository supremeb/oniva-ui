import * as stylex from '@stylexjs/stylex';
import { mergeSx } from '../../internal/sx';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowData,
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/react-table';
import { ArrowLeft, ArrowRight, Copy, Plus, Search, X } from 'lucide-react';
import { useCallback, useLayoutEffect, useMemo, useRef, useState, type ClipboardEvent, type KeyboardEvent, type ReactNode, type Ref } from 'react';
import { createFormatters, useFormatters } from '../../internal/format';
import {
  Input as AriaInput,
  SearchField,
  type Key,
  type Selection,
  type SortDescriptor,
} from 'react-aria-components';
import { InlineSelect, type SelectOption } from '../../internal/data-table-select';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { Button } from '../Button';
import { useObjectRef } from 'react-aria';
import { Presence } from '../../motion/Presence';
import { prefersReducedMotion } from '../../internal/motion-hooks';
import { DataSheet } from '../DataSheet';
import type { SheetColumn, SheetRow, TagTone } from '../DataSheet';
import { Cell, Column, Row, Table, TableBody, TableHeader, type TableDensity } from '../Table';

const styles = stylex.create({
  root: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-card'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    gap: 12,
    padding: 12,
    width: '100%',
  },
  toolbar: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 12, paddingInline: 4 },
  total: { display: 'flex', flexDirection: 'column', marginInlineEnd: 'auto' },
  totalLabel: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-14'],
    lineHeight: font['--oniva-font-lh-14'],
  },
  totalValue: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-14'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-14'],
  },
  search: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset-hover'],
    borderRadius: radius['--oniva-radius-full'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-icon-muted'],
    display: 'flex',
    gap: 8,
    height: 36,
    paddingInline: 12,
    width: 200,
  },
  searchInput: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    flexGrow: 1,
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    minWidth: 0,
    outline: 'none',
    '::placeholder': { color: colors['--oniva-color-text-placeholder'] },
  },
  footer: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    paddingInline: 4,
  },
  range: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-14'],
    fontVariantNumeric: 'tabular-nums',
  },
  pages: { alignItems: 'center', display: 'flex', gap: 4 },
  page: {
    fontVariantNumeric: 'tabular-nums',
    minWidth: 32,
    paddingInline: 0,
    transitionDuration: motion['--oniva-motion-dur-base'],
  },
  ellipsis: { color: colors['--oniva-color-text-muted'], paddingInline: 6 },
  selectionBar: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    fontSize: font['--oniva-font-size-13'],
    fontVariantNumeric: 'tabular-nums',
    gap: 8,
    minHeight: 32,
    paddingInline: 4,
  },
  selectionCount: { color: colors['--oniva-color-text'], fontWeight: font['--oniva-font-weight-medium'] },
  sr: {
    borderWidth: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
  },
  empty: {
    color: colors['--oniva-color-text-muted'],
    paddingBlock: 32,
    textAlign: 'center',
  },
});

export interface DataTableFilter {
  /** Column id to filter. */
  columnId: string;
  /** Label of the "no filter" option, e.g. "All products". */
  allLabel: string;
  options: SelectOption[];
}

export interface DataTableProps<TData extends object> {
  data: TData[];
  columns: ColumnDef<TData, any>[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  'aria-label': string;
  /** Header caption above the count. Default "Total results". */
  title?: string;
  /**
   * Noun after the count. Default "results". Pass `{ one, other }` for correct singular/plural
   * (use `#` for the count, e.g. `{ one: '# order', other: '# orders' }`); a plain string is the plural noun.
   */
  itemLabel?: string | { one: string; other: string };
  /** Replaces the default empty state (shown when no rows match). */
  emptyState?: ReactNode;
  /** BCP 47 locale for the count. Defaults to the active React Aria locale. */
  locale?: string;
  filters?: DataTableFilter[];
  /** Show the global search field. Default true. */
  searchable?: boolean;
  /** Row selection checkboxes. Default true. */
  selectable?: boolean;
  pageSize?: number;
  density?: TableDensity;
  getRowId?: (row: TData, index: number) => string;
  /** Called when a cell edits data (e.g. the status select). */
  onDataChange?: (data: TData[]) => void;
  onSelectionChange?: (ids: string[]) => void;
  /**
   * Copy the selected rows as tab-separated text (pastes into Excel and Google Sheets) with Cmd/Ctrl+C or the Copy
   * button in the selection bar. Default true.
   */
  copyable?: boolean;
  /** Cmd/Ctrl+Z undoes the last cell edit made through `meta.updateRow`, Shift+Cmd/Ctrl+Z (or Ctrl+Y) redoes. Default true. */
  isUndoable?: boolean;
  /**
   * Shows an "Add row" button in the footer. Return the new row and the table appends it (undoable, reported through
   * `onDataChange`); return nothing to manage it yourself.
   */
  onAddRow?: () => TData | void;
  /** Label of the add button. Default `Add row`. */
  addRowLabel?: string;
  /**
   * `sheet` renders an editable spreadsheet (`DataSheet`): cell selection, in-place editing, tag picker, copy/paste with
   * spreadsheets, undo/redo and an add-row footer. Columns are described by `column.meta.sheet`
   * (`type`, `options`, `icon`, `editable`, `width`). Total, filters, search, pagination and `onAddRow` do not apply.
   * Default `block`.
   */
  layout?: 'block' | 'sheet';
  /** Icon in the title row (sheet layout). */
  icon?: ReactNode;
  /** Sheet layout: allow editing cells and adding rows. Default true. */
  editable?: boolean;
  /** Sheet layout: pill colour per tag value; unlisted values get a stable colour. */
  tagTones?: Record<string, TagTone>;
  xstyle?: stylex.StyleXStyles;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Sheet layout column options: `type` (default `text`), `options` for tag columns, `icon`, `editable`, `width`, `format`. */
    sheet?: Partial<SheetColumn>;
  }
}

export interface DataTableMeta<TData> {
  updateRow: (rowId: string, patch: Partial<TData>) => void;
}

function pageList(current: number, total: number): (number | 'gap-start' | 'gap-end')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, 'gap-end', total];
  if (current >= total - 3)
    return [1, 'gap-start', total - 4, total - 3, total - 2, total - 1, total];
  return [1, 'gap-start', current - 1, current, current + 1, 'gap-end', total];
}

function BlockTable<TData extends object>({
  data: initialData,
  columns,
  title = 'Total results',
  itemLabel = 'results',
  emptyState,
  locale,
  filters = [],
  searchable = true,
  selectable = true,
  pageSize = 8,
  density = 'md',
  getRowId,
  onDataChange,
  onSelectionChange,
  copyable = true,
  isUndoable = true,
  onAddRow,
  addRowLabel = 'Add row',
  xstyle,
  className,
  ref,
  ...rest
}: DataTableProps<TData>) {
  const ctxFmts = useFormatters();
  const fmts = useMemo(() => (locale ? createFormatters(locale) : ctxFmts), [locale, ctxFmts]);
  const [data, setData] = useState(initialData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });

  const [status, setStatus] = useState('');
  const undoStack = useRef<TData[][]>([]);
  const redoStack = useRef<TData[][]>([]);
  const dataRef = useRef(data);
  dataRef.current = data;

  const meta = useMemo<DataTableMeta<TData>>(
    () => ({
      updateRow: (rowId, patch) => {
        const prev = dataRef.current;
        const next = prev.map((r, i) =>
          (getRowId ? getRowId(r, i) : String(i)) === rowId ? { ...r, ...patch } : r,
        );
        undoStack.current = [...undoStack.current.slice(-49), prev];
        redoStack.current = [];
        setData(next);
        onDataChange?.(next);
      },
    }),
    [getRowId, onDataChange],
  );

  const travel = useCallback(
    (from: TData[][], to: TData[][], label: string) => {
      const target = from.pop();
      if (!target) return;
      to.push(dataRef.current);
      setData(target);
      onDataChange?.(target);
      setStatus(label);
    },
    [onDataChange],
  );

  const table = useReactTable<TData>({
    data,
    columns,
    getRowId,
    meta,
    state: { sorting, rowSelection, columnFilters, globalFilter, pagination },
    enableRowSelection: selectable,
    onSortingChange: setSorting,
    onRowSelectionChange: (u) => {
      setRowSelection((prev) => {
        const next = typeof u === 'function' ? u(prev) : u;
        onSelectionChange?.(Object.keys(next).filter((k) => next[k]));
        return next;
      });
    },
    onColumnFiltersChange: (u) => {
      setColumnFilters(u);
      setPagination((p) => ({ ...p, pageIndex: 0 }));
    },
    onGlobalFilterChange: (v) => {
      setGlobalFilter(v);
      setPagination((p) => ({ ...p, pageIndex: 0 }));
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rows = table.getRowModel().rows;
  const rootRef = useObjectRef(ref);
  const canAnimate = typeof Element !== 'undefined' && typeof Element.prototype.getAnimations === 'function';
  const seenRows = useRef<Set<string> | null>(null);
  const lastCount = useRef(0);
  // New rows (add / undo) lift in; rows already on screen never replay.
  useLayoutEffect(() => {
    const root = rootRef.current;
    const ids = new Set(rows.map((r) => r.id));
    const prev = seenRows.current;
    seenRows.current = ids;
    if (!root || !prev || prefersReducedMotion()) return;
    for (const id of ids) {
      if (prev.has(id)) continue;
      const el = root.querySelector<HTMLElement>(`[data-key="${CSS.escape(id)}"]`);
      el?.animate?.(
        [{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 240, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
      );
    }
  });
  const total = table.getFilteredRowModel().rows.length;
  const pageCount = Math.max(table.getPageCount(), 1);
  const page = pagination.pageIndex + 1;
  const first = total === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const last = Math.min(total, page * pagination.pageSize);
  const headers = table.getHeaderGroups()[0]?.headers ?? [];

  const sortDescriptor: SortDescriptor | undefined = sorting[0]
    ? { column: sorting[0].id, direction: sorting[0].desc ? 'descending' : 'ascending' }
    : undefined;

  const selectedKeys: Selection = new Set<Key>(
    Object.keys(rowSelection).filter((k) => rowSelection[k]),
  );

  const selectedIds = Object.keys(rowSelection).filter((k) => rowSelection[k]);

  /** Selected rows as TSV: a header line, then one line per row, quoting cells that contain tabs, quotes or line breaks. */
  const selectionToTsv = () => {
    const cols = table.getAllLeafColumns().filter((c) => c.accessorFn);
    const cell = (v: unknown) => {
      const t = v == null ? '' : v instanceof Date ? v.toISOString() : String(v);
      return /[\t\n\r"]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
    };
    const head = cols.map((c) => cell(typeof c.columnDef.header === 'string' ? c.columnDef.header : c.id));
    const lines = table.getSelectedRowModel().rows.map((r) => cols.map((c) => cell(r.getValue(c.id))).join('\t'));
    return [head.join('\t'), ...lines].join('\n');
  };

  const addRow = () => {
    const row = onAddRow?.();
    if (!row) return;
    const prev = dataRef.current;
    const next = [...prev, row];
    undoStack.current = [...undoStack.current.slice(-49), prev];
    redoStack.current = [];
    setData(next);
    onDataChange?.(next);
    setStatus('Added a row');
    setPagination((p) => ({ ...p, pageIndex: Math.floor((next.length - 1) / p.pageSize) }));
  };

  const onCopy = (e: ClipboardEvent) => {
    if (!copyable || selectedIds.length === 0) return;
    if (!(window.getSelection()?.isCollapsed ?? true)) return; // let real text selections copy normally
    const target = e.target as HTMLElement;
    if (target.closest('input, textarea, [contenteditable="true"]')) return;
    e.preventDefault();
    e.clipboardData.setData('text/plain', selectionToTsv());
    setStatus(`Copied ${fmts.plural(selectedIds.length, { one: '# row', other: '# rows' })}`);
  };

  const onUndoKeys = (e: KeyboardEvent) => {
    if (!isUndoable || !(e.metaKey || e.ctrlKey) || e.altKey) return;
    if ((e.target as HTMLElement).closest('input, textarea, [contenteditable="true"]')) return;
    const k = e.key.toLowerCase();
    if (k === 'z' && !e.shiftKey) {
      if (!undoStack.current.length) return;
      e.preventDefault();
      travel(undoStack.current, redoStack.current, 'Undid last edit');
    } else if ((k === 'z' && e.shiftKey) || k === 'y') {
      if (!redoStack.current.length) return;
      e.preventDefault();
      travel(redoStack.current, undoStack.current, 'Redid edit');
    }
  };

  return (
    <div ref={rootRef} onCopy={onCopy} onKeyDown={onUndoKeys} {...mergeSx(stylex.props(styles.root, xstyle), className)}>
      <div {...stylex.props(styles.toolbar)}>
        <div {...stylex.props(styles.total)}>
          <span {...stylex.props(styles.totalLabel)}>{title}</span>
          <span {...stylex.props(styles.totalValue)}>
            {typeof itemLabel === 'string'
              ? `${fmts.number(total)} ${total === 1 && itemLabel === 'results' ? 'result' : itemLabel}`
              : fmts.plural(total, itemLabel)}
          </span>
        </div>
        {filters.map((f) => {
          const col = table.getColumn(f.columnId);
          const current = (col?.getFilterValue() as string | undefined) ?? 'all';
          return (
            <InlineSelect
              key={f.columnId}
              aria-label={`Filter by ${f.columnId}`}
              value={current}
              options={[{ value: 'all', label: f.allLabel }, ...f.options]}
              onChange={(v) => col?.setFilterValue(v === 'all' ? undefined : v)}
            />
          );
        })}
        {searchable && (
          <SearchField
            aria-label="Search"
            value={globalFilter}
            onChange={(v) => table.setGlobalFilter(v)}
            {...stylex.props(styles.search)}
          >
            <Search size={16} aria-hidden="true" />
            <AriaInput placeholder="Search" {...stylex.props(styles.searchInput)} />
          </SearchField>
        )}
      </div>

      {(canAnimate || selectedIds.length > 0) && (
      <Presence isPresent={selectable && selectedIds.length > 0} preset="slide" initial={false} exitTimeoutMs={200}>
        <div {...stylex.props(styles.selectionBar)}>
          <span {...stylex.props(styles.selectionCount)}>{fmts.number((lastCount.current = selectedIds.length || lastCount.current))} selected</span>
          {copyable && (
            <Button
              variant="ghost"
              size="sm"
              startIcon={<Copy size={14} />}
              onPress={() => {
                const text = selectionToTsv();
                const done = () => setStatus(`Copied ${fmts.plural(selectedIds.length, { one: '# row', other: '# rows' })}`);
                if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done, () => setStatus('Copy failed'));
                else done();
              }}
            >
              Copy
            </Button>
          )}
          <Button variant="ghost" size="sm" startIcon={<X size={14} />} onPress={() => table.resetRowSelection()}>
            Clear
          </Button>
        </div>
      </Presence>
      )}
      <span role="status" aria-live="polite" {...stylex.props(styles.sr)}>
        {status}
      </span>

      <div>
      <Table
        aria-label={rest['aria-label']}
        density={density}
        selectionMode={selectable ? 'multiple' : 'none'}
        selectedKeys={selectedKeys}
        onSelectionChange={(sel) => {
          const pageIds = rows.map((r) => r.id);
          setRowSelection((prev) => {
            const next: RowSelectionState =
              sel === 'all'
                ? { ...prev, ...Object.fromEntries(pageIds.map((id) => [id, true])) }
                : Object.fromEntries([...sel].map((k) => [String(k), true]));
            onSelectionChange?.(Object.keys(next));
            return next;
          });
        }}
        sortDescriptor={sortDescriptor}
        onSortChange={(d) =>
          setSorting([{ id: String(d.column), desc: d.direction === 'descending' }])
        }
      >
        <TableHeader columns={headers}>
          {(h) => (
            <Column
              id={h.column.id}
              isRowHeader={h.index === 0}
              allowsSorting={h.column.getCanSort()}
            >
              {flexRender(h.column.columnDef.header, h.getContext())}
            </Column>
          )}
        </TableHeader>
        <TableBody
          items={rows}
          renderEmptyState={() => (
            <div {...stylex.props(styles.empty)}>
              {emptyState ?? (
                <>
                  <div>No results</div>
                  <div>Try a different search or clear filters.</div>
                </>
              )}
            </div>
          )}
        >
          {(row) => (
            <Row id={row.id} textValue={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Cell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Cell>
              ))}
            </Row>
          )}
        </TableBody>
      </Table>
      </div>

      <div {...stylex.props(styles.footer)}>
        <span {...stylex.props(styles.range)}>
          {first}–{last} of {total}
        </span>
        {onAddRow && (
          <Button variant="ghost" size="sm" startIcon={<Plus size={14} />} onPress={addRow}>
            {addRowLabel}
          </Button>
        )}
        <nav aria-label="Pagination" {...stylex.props(styles.pages)}>
          <Button
            variant="ghost"
            size="sm"
            startIcon={<ArrowLeft size={14} />}
            isDisabled={!table.getCanPreviousPage()}
            onPress={() => table.previousPage()}
          >
            Previous
          </Button>
          {pageList(page, pageCount).map((p) =>
            typeof p === 'number' ? (
              <Button
                key={p}
                variant={p === page ? 'secondary' : 'ghost'}
                size="sm"
                aria-label={`Page ${p}`}
                aria-current={p === page ? 'page' : undefined}
                xstyle={styles.page}
                onPress={() => table.setPageIndex(p - 1)}
              >
                {p}
              </Button>
            ) : (
              <span key={p} aria-hidden="true" {...stylex.props(styles.ellipsis)}>
                …
              </span>
            ),
          )}
          <Button
            variant="ghost"
            size="sm"
            endIcon={<ArrowRight size={14} />}
            isDisabled={!table.getCanNextPage()}
            onPress={() => table.nextPage()}
          >
            Next
          </Button>
        </nav>
      </div>
    </div>
  );
}

function SheetTable<TData extends object>({
  data,
  columns,
  title = 'Sheet',
  icon,
  getRowId,
  onDataChange,
  onSelectionChange,
  editable = true,
  tagTones,
  addRowLabel,
  xstyle,
  className,
  ref,
}: DataTableProps<TData>) {
  const rows = useMemo<SheetRow[]>(
    () => data.map((r, i) => ({ ...(r as Record<string, unknown>), id: getRowId ? getRowId(r, i) : String((r as { id?: unknown }).id ?? i) })),
    [data, getRowId],
  );
  const sheetColumns = useMemo<SheetColumn[]>(
    () =>
      columns.map((c) => {
        const def = c as { accessorKey?: string; id?: string; header?: unknown; meta?: { sheet?: Partial<SheetColumn> } };
        const key = def.accessorKey ?? def.id ?? '';
        return { key, label: typeof def.header === 'string' ? def.header : key, type: 'text', ...def.meta?.sheet } as SheetColumn;
      }),
    [columns],
  );
  return (
    <DataSheet
      title={title}
      icon={icon}
      columns={sheetColumns}
      rows={rows}
      editable={editable}
      tagTones={tagTones}
      addRowLabel={addRowLabel}
      onRowsChange={onDataChange ? (next) => onDataChange(next as unknown as TData[]) : undefined}
      onSelectionChange={onSelectionChange}
      xstyle={xstyle}
      className={className}
      ref={ref}
    />
  );
}

export function DataTable<TData extends object>(props: DataTableProps<TData>) {
  if (props.layout === 'sheet') return <SheetTable {...props} />;
  return <BlockTable {...props} />;
}
