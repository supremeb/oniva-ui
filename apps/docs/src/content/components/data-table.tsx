import type { ColumnDef } from '@tanstack/react-table';
import { CustomerCell, DataTable, DateCell, PriceCell, StatusBadgeCell } from 'oniva-ui';
import type { DocPage } from '../types';

interface Row { id: string; name: string; fulfilment: 'Shipped' | 'Delivery failed' | 'Waiting'; updated: string; total: number; product: string }
const names = ['John Clarkson', 'Aspen Lubin', 'Michael Ekstrom', 'Kianna Vaccaro', 'Livia Saris', 'Jaydon Aminoff', 'Maria Lubin', 'Ann Press', 'Priya Natarajan', 'Tomas Berg', 'Hana Okafor', 'Diego Marchetti'];
const ful: Row['fulfilment'][] = ['Shipped', 'Waiting', 'Delivery failed', 'Shipped'];
const prods = ['Starter', 'Growth', 'Scale', 'Enterprise'];
const rows: Row[] = names.map((name, i) => ({ id: `c${i}`, name, fulfilment: ful[i % 4]!, updated: `2026-09-${String(10 + i).padStart(2, '0')}`, total: 320 + i * 417, product: prods[i % 4]! }));
const variant = { Shipped: 'success', 'Delivery failed': 'danger', Waiting: 'warning' } as const;

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'name', header: 'Customer name', cell: ({ row }) => <CustomerCell name={row.original.name} /> },
  { accessorKey: 'fulfilment', header: 'Status', enableSorting: false, cell: ({ getValue }) => <StatusBadgeCell label={getValue<Row['fulfilment']>()} variant={variant[getValue<Row['fulfilment']>()]} /> },
  { accessorKey: 'updated', header: 'Last updated', cell: ({ getValue }) => <DateCell value={getValue<string>()} /> },
  { accessorKey: 'total', header: 'Total', cell: ({ getValue }) => <PriceCell value={getValue<number>()} /> },
  { accessorKey: 'product', header: 'Product' },
];
const filters = [{ columnId: 'product', allLabel: 'All products', options: prods.map((p) => ({ value: p, label: p })) }];

const Demo = (p: { density?: 'sm' | 'md'; pageSize?: number; searchable?: boolean; selectable?: boolean; empty?: boolean; filtered?: boolean; data?: Row[]; onEvent?: (n: string) => void }) => (
  <div style={{ width: 720 }}>
    <DataTable
      aria-label="Customers"
      data={p.empty ? [] : (p.data ?? rows)}
      columns={columns}
      itemLabel={{ one: '# customer', other: '# customers' }}
      title="Total customers"
      filters={p.filtered === false ? [] : filters}
      density={p.density}
      pageSize={p.pageSize ?? 5}
      searchable={p.searchable}
      selectable={p.selectable}
      getRowId={(r) => r.id}
      onSelectionChange={() => p.onEvent?.('onSelectionChange')}
      onDataChange={() => p.onEvent?.('onDataChange')}
    />
  </div>
);

const page: DocPage = {
  slug: 'data-table',
  status: 'Stable',
  version: '0.1.0',
  importName: 'DataTable',
  group: ['Components', 'Data display'],
  sourcePath: 'components/DataTable',
  lede: 'A complete data block on TanStack Table: result count, filter selects, global search, sortable columns, row selection, editable cells and a pagination footer.',
  anatomy: {
    intro: 'Seven parts. The tray, table and footer are always present; filters, search and the selection column can be switched off.',
    Render: () => <Demo />,
    parts: [
      { name: 'Tray', description: 'Inset surface, 16px radius, 1px border, 12px padding and 12px gap. Holds toolbar, table and footer.', selector: 'div[style] > div' },
      { name: 'Result count', description: 'Caption (title) in muted 14px over the count in 14px medium with tabular numerals. Uses itemLabel for correct singular and plural.', selector: 'div[style] > div > div:first-child > div:first-child' },
      { name: 'Filters', description: 'One inline select per entry in filters; the first option clears the filter (allLabel).', selector: 'button[aria-label^="Filter by"]' },
      { name: 'Search', description: 'Pill field, 36px tall, 200px wide, full radius. Filters across all columns and resets to page 1.', selector: 'input[type="search"]' },
      { name: 'Header and sort', description: 'Sortable columns show a 14px caret; first click sorts ascending, second descending. Header 44px at md, 36px at sm.', selector: 'thead th:nth-child(2)' },
      { name: 'Rows and cells', description: 'Rows are 56px at md, 44px at sm. Selected rows tint. Use the cell helpers for avatars, badges, dates and prices.', selector: 'tbody tr:first-child' },
      { name: 'Pagination footer', description: 'Range "1–5 of 12" and a nav with Previous, up to 7 numbered pages with ellipses, and Next. Ghost sm buttons; the current page is secondary.', selector: 'nav[aria-label="Pagination"]' },
    ],
  },
  usage: {
    use: ['Back-office lists you search, filter, sort and page: customers, orders, members.', 'Datasets up to a few thousand rows held on the client.', 'Rows where users change one value inline, such as status.'],
    avoid: [
      { text: 'Your own query, paging or toolbar layout.', instead: { slug: 'table', label: 'Table' } },
      { text: 'Spreadsheet-style editing and 10,000+ rows.', instead: { slug: 'data-grid', label: 'DataGrid' } },
      { text: 'A few records without search or paging.', instead: { slug: 'list', label: 'List' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'density', label: 'Density', options: ['sm', 'md'] },
      { kind: 'number', key: 'pageSize', label: 'Page size', min: 3, max: 12, step: 1 },
      { kind: 'toggle', key: 'searchable', label: 'Search' },
      { kind: 'toggle', key: 'selectable', label: 'Selection' },
      { kind: 'toggle', key: 'empty', label: 'Empty data' },
    ],
    initial: { density: 'md', pageSize: 5, searchable: true, selectable: true, empty: false },
    render: (p, onEvent) => <Demo key={`${p.pageSize}${p.empty}`} density={p.density as 'sm' | 'md'} pageSize={Number(p.pageSize)} searchable={Boolean(p.searchable)} selectable={Boolean(p.selectable)} empty={Boolean(p.empty)} onEvent={onEvent} />,
    code: (p) => `<DataTable\n  aria-label="Customers"\n  data={customers}\n  columns={columns}\n  itemLabel={{ one: '# customer', other: '# customers' }}${p.density !== 'md' ? `\n  density="${p.density}"` : ''}${Number(p.pageSize) !== 8 ? `\n  pageSize={${p.pageSize}}` : ''}${p.searchable ? '' : '\n  searchable={false}'}${p.selectable ? '' : '\n  selectable={false}'}\n  getRowId={(r) => r.id}\n/>`,
  },
  states: [
    { name: 'Populated', description: 'Page 1 of 3 with filters, search and selection.', Render: () => <Demo /> },
    { name: 'Compact', description: 'density="sm" without filters or selection.', Render: () => <Demo density="sm" filtered={false} selectable={false} searchable={false} /> },
    { name: 'Empty data', description: 'Default empty message under the header: "No results" and a way out.', Render: () => <Demo empty /> },
    { name: 'Single result', description: 'Count reads "1 customer" through itemLabel.', Render: () => <Demo data={rows.slice(0, 1)} /> },
    { name: 'Long content', description: 'Long names wrap inside the 56px row; keep names to one line where you can.', Render: () => <Demo data={[{ ...rows[0]!, name: 'Maximilian Alexander von Hohenzollern-Sigmaringen' }, ...rows.slice(1, 4)]} /> },
  ],
  sections: [
    { type: 'numbered', id: 'states-guide', title: 'Empty, loading and error', intro: 'DataTable owns the empty state. Loading and error are yours to compose.', items: [
      { title: 'Empty: say what happened', body: 'The default reads "No results. Try a different search or clear filters." Replace it through emptyState with the cause and an action, for example "No orders match Region: EU. Clear filters".' },
      { title: 'Loading: keep the frame', body: 'Render the tray with Skeleton rows instead of a spinner over the whole block. The toolbar and header stay stable so the layout does not jump.' },
      { title: 'Error: keep the data', body: 'If a refresh fails, keep the last rows and show an Alert above the table with a Retry action. Replace the table only when there is nothing to show.' },
    ] },
    { type: 'rules', id: 'behavior', title: 'Sorting, selection and paging', items: [
      { title: 'Sorting', body: 'Single column, client side. Set enableSorting: false in the column def for status or action columns.' },
      { title: 'Selection', body: 'Checkboxes select across the filtered set; the header checkbox selects the current page. Read ids through onSelectionChange and show bulk actions in your own bar.' },
      { title: 'Pagination vs virtualization', body: 'DataTable pages (default 8 per page, clamps to the filtered count) and does not virtualize. For server-side data or 10,000+ rows use DataGrid or the Table primitive with your own queries.' },
      { title: 'Search and filters reset the page', body: 'Any filter or search returns to page 1 so users never land on an empty page.' },
    ] },
    { type: 'rules', id: 'recipes', title: 'Composition', items: [
      { title: 'Cell helpers', body: 'CustomerCell (avatar and name), StatusBadgeCell (square badge), StatusSelectCell (inline editable status, writes through meta.updateRow), DateCell and PriceCell (locale formatted).' },
      { title: 'Bulk actions', body: 'Track ids with onSelectionChange and render a bar above the tray: "3 selected", Export, Delete. Clear selection after the action.' },
      { title: 'With Alert and Skeleton', body: 'Wrap DataTable in your own loading and error branches; it has no built-in async props.' },
    ] },
  ],
  content: { rules: [
    { title: 'Title and itemLabel', body: 'A caption and a noun: "Total customers", "42 customers". Pass { one, other } so 1 reads singular.' },
    { title: 'Column headers', body: 'Nouns, 1 to 2 words, sentence case.' },
    { title: 'Empty text', body: 'Name the filter that produced it and the action to clear it.' },
    { title: 'Placeholders', body: 'Search describes the scope when it is narrower than all columns, for example "Search customers".' },
  ] },
  accessibility: {
    keyboard: [
      { keys: ['Tab'], action: 'Toolbar controls, then the table (one stop), then pagination.' },
      { keys: ['↑', '↓', '←', '→'], action: 'Moves between cells in the table.' },
      { keys: ['Space'], action: 'Selects the focused row.' },
      { keys: ['Enter'], action: 'Sorts when a sortable column header is focused.' },
      { keys: ['Ctrl', 'A'], action: 'Selects every row on the page.' },
      { keys: ['Esc'], action: 'Clears the selection.' },
    ],
    notes: ['Built on the Table primitive: role="grid", aria-sort, labelled select-all.', 'The footer is a nav labelled "Pagination"; the current page has aria-current="page" and buttons are labelled "Page N".', 'Pass a unique aria-label for the table.', 'The range text "1–5 of 12" is plain text, not live; announce changes through your own region if needed.'],
    reducedMotion: 'No motion beyond color transitions.',
  },
  props: [
    { name: 'data', type: 'TData[]', description: 'Rows. Held in internal state; later prop changes do not replace it, so remount with a key.' },
    { name: 'columns', type: 'ColumnDef<TData>[]', description: 'TanStack column definitions.' },
    { name: 'aria-label', type: 'string', description: 'Required table name.' },
    { name: 'title', type: 'string', default: "'Total results'", description: 'Caption above the count.' },
    { name: 'itemLabel', type: 'string | { one, other }', default: "'results'", description: 'Noun after the count; use # for the number.' },
    { name: 'emptyState', type: 'ReactNode', description: 'Replaces the default empty message.' },
    { name: 'filters', type: 'DataTableFilter[]', default: '[]', description: 'Inline filter selects: columnId, allLabel, options.' },
    { name: 'searchable', type: 'boolean', default: 'true', description: 'Show the global search.' },
    { name: 'selectable', type: 'boolean', default: 'true', description: 'Show row checkboxes.' },
    { name: 'pageSize', type: 'number', default: '8', description: 'Rows per page.' },
    { name: 'density', type: "'sm' | 'md'", default: "'md'", description: '44px or 56px rows.' },
    { name: 'getRowId', type: '(row, index) => string', description: 'Stable ids; falls back to the index.' },
    { name: 'locale', type: 'string', description: 'Count formatting locale.' },
    { name: 'onSelectionChange', type: '(ids: string[]) => void', description: 'Selected row ids.' },
    { name: 'onDataChange', type: '(data: TData[]) => void', description: 'Fires when a cell edits data.' },
    { name: 'xstyle / className', type: 'StyleXStyles / string', description: 'Style override on the tray.' },
  ],
  related: ['table', 'data-grid', 'filter-bar', 'empty-state', 'pagination'],
};
export default page;
