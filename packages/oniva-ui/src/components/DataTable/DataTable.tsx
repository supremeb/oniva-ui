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
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/react-table';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { useMemo, useState, type ReactNode, type Ref } from 'react';
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
  xstyle?: stylex.StyleXStyles;
  className?: string;
  ref?: Ref<HTMLDivElement>;
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

export function DataTable<TData extends object>({
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

  const meta = useMemo<DataTableMeta<TData>>(
    () => ({
      updateRow: (rowId, patch) => {
        setData((prev) => {
          const next = prev.map((r, i) =>
            (getRowId ? getRowId(r, i) : String(i)) === rowId ? { ...r, ...patch } : r,
          );
          onDataChange?.(next);
          return next;
        });
      },
    }),
    [getRowId, onDataChange],
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

  return (
    <div ref={ref} {...mergeSx(stylex.props(styles.root, xstyle), className)}>
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

      <div {...stylex.props(styles.footer)}>
        <span {...stylex.props(styles.range)}>
          {first}–{last} of {total}
        </span>
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
