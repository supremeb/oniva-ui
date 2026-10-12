import { useState } from 'react';
import type { Selection, SortDescriptor } from 'react-aria-components';
import { Badge, Cell, Column, Row, Table, TableBody, TableHeader } from 'oniva-ui';
import type { DocPage } from '../types';

interface Inv { id: string; client: string; amount: number; status: 'Paid' | 'Pending' | 'Overdue'; due: string }
const data: Inv[] = [
  { id: 'INV-2041', client: 'Northwind Traders', amount: 4280, status: 'Paid', due: '2026-09-14' },
  { id: 'INV-2042', client: 'Lumen Analytics', amount: 1150.5, status: 'Pending', due: '2026-10-02' },
  { id: 'INV-2043', client: 'Acme Logistics', amount: 9720, status: 'Overdue', due: '2026-08-29' },
  { id: 'INV-2044', client: 'Helios Energy', amount: 2315.75, status: 'Paid', due: '2026-09-21' },
  { id: 'INV-2045', client: 'Blue Harbor Co.', amount: 640, status: 'Pending', due: '2026-10-11' },
];
const tone = { Paid: 'success', Pending: 'warning', Overdue: 'danger' } as const;
const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const Demo = (p: { density?: 'sm' | 'md'; select?: boolean; sort?: boolean; sticky?: boolean; rows?: Inv[]; empty?: boolean; loading?: boolean; onEvent?: (n: string) => void }) => {
  const [sort, setSort] = useState<SortDescriptor>({ column: 'due', direction: 'ascending' });
  const [sel, setSel] = useState<Selection>(new Set(p.select ? ['INV-2042'] : []));
  const rows = [...(p.rows ?? data)].sort((a, b) => {
    const k = sort.column as keyof Inv;
    const r = a[k] < b[k] ? -1 : a[k] > b[k] ? 1 : 0;
    return sort.direction === 'descending' ? -r : r;
  });
  return (
    <div style={{ width: 640 }}>
      <Table
        aria-label="Invoices"
        density={p.density}
        stickyHeader={p.sticky}
        selectionMode={p.select ? 'multiple' : 'none'}
        selectedKeys={sel}
        onSelectionChange={(s) => { setSel(s); p.onEvent?.('onSelectionChange'); }}
        sortDescriptor={sort}
        onSortChange={(d) => { setSort(d); p.onEvent?.('onSortChange'); }}
      >
        <TableHeader>
          <Column id="id" isRowHeader allowsSorting={p.sort !== false}>Invoice</Column>
          <Column id="client" allowsSorting={p.sort !== false}>Client</Column>
          <Column id="status">Status</Column>
          <Column id="due" allowsSorting={p.sort !== false}>Due date</Column>
          <Column id="amount" allowsSorting={p.sort !== false}>Amount</Column>
        </TableHeader>
        <TableBody
          items={p.empty ? [] : rows}
          renderEmptyState={() => (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--oniva-color-text-muted)', fontSize: 14 }}>
              {p.loading ? 'Loading invoices…' : 'No invoices match. Clear the filters to see all 48.'}
            </div>
          )}
        >
          {(r) => (
            <Row id={r.id}>
              <Cell>{r.id}</Cell>
              <Cell>{r.client}</Cell>
              <Cell><Badge variant={tone[r.status]} shape="square">{r.status}</Badge></Cell>
              <Cell>{r.due}</Cell>
              <Cell>{usd(r.amount)}</Cell>
            </Row>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const page: DocPage = {
  slug: 'table',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Table',
  group: ['Components', 'Data display'],
  sourcePath: 'components/Table',
  lede: 'The accessible table primitive: sortable columns, row selection, two densities and a sticky header. You own the data; it owns the semantics, focus and keyboard.',
  anatomy: {
    intro: 'Six parts. Table, header, columns, body, rows and cells are always present; the selection column appears only with selectionMode.',
    Render: () => <Demo select density="md" />,
    parts: [
      { name: 'Container', description: 'Scroll wrapper with a 1px border and 12px radius. With stickyHeader it gets a 420px max height and scrolls inside.', selector: 'table[role="grid"]' },
      { name: 'Header row', description: 'Inset surface. Column headers are 44px tall at md, 36px at sm, 14px medium text, 16px or 12px side padding.', selector: 'thead tr' },
      { name: 'Sort caret', description: '14px chevron on sortable columns. Muted until active, then full text color; rotates 180 degrees for descending.', selector: 'thead th:nth-child(2) svg' },
      { name: 'Selection column', description: '48px column with a checkbox per row and a "Select all" checkbox in the header. Added by the Table, not by you.', selector: 'thead label[slot="selection"]' },
      { name: 'Row', description: 'Hairline bottom border. Selected rows tint; keyboard focus draws a 2px focus ring.', selector: 'tbody tr[aria-selected="true"]' },
      { name: 'Cell', description: '56px tall at md, 44px at sm, 16px or 12px side padding. Numbers right-align by convention in your cell content.', selector: 'tbody tr:first-child td[role="rowheader"]' },
    ],
  },
  usage: {
    use: ['Tabular records with 3 to 10 columns: invoices, members, deployments.', 'Anywhere you already hold the rows and need sort and selection semantics.', 'Building a custom data view with your own paging or server queries.'],
    avoid: [
      { text: 'A ready-made table with search, filters and pagination.', instead: { slug: 'data-table', label: 'DataTable' } },
      { text: 'Spreadsheet editing with cell navigation.', instead: { slug: 'data-grid', label: 'DataGrid' } },
      { text: 'Key-value pairs for one record.', instead: { slug: 'description-list', label: 'DescriptionList' } },
      { text: 'A short list of one-line items.', instead: { slug: 'list', label: 'List' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'density', label: 'Density', options: ['sm', 'md'] },
      { kind: 'toggle', key: 'select', label: 'Selection' },
      { kind: 'toggle', key: 'sort', label: 'Sortable' },
      { kind: 'toggle', key: 'empty', label: 'Empty' },
    ],
    initial: { density: 'md', select: false, sort: true, empty: false },
    render: (p, onEvent) => <Demo key={`${p.select}`} density={p.density as 'sm' | 'md'} select={Boolean(p.select)} sort={Boolean(p.sort)} empty={Boolean(p.empty)} onEvent={onEvent} />,
    code: (p) => `<Table aria-label="Invoices"${p.density !== 'md' ? ` density="${p.density}"` : ''}${p.select ? ' selectionMode="multiple"' : ''} sortDescriptor={sort} onSortChange={setSort}>\n  <TableHeader>\n    <Column id="id" isRowHeader${p.sort ? ' allowsSorting' : ''}>Invoice</Column>\n    <Column id="client">Client</Column>\n  </TableHeader>\n  <TableBody items={rows}${p.empty ? ' renderEmptyState={() => <EmptyState title="No invoices" />}' : ''}>\n    {(r) => <Row id={r.id}><Cell>{r.id}</Cell><Cell>{r.client}</Cell></Row>}\n  </TableBody>\n</Table>`,
  },
  states: [
    { name: 'Default', description: 'Sorted ascending by due date, medium density.', Render: () => <Demo /> },
    { name: 'Compact', description: 'density="sm": 44px rows, 36px header.', Render: () => <Demo density="sm" /> },
    { name: 'Selected rows', description: 'Checkbox column; selected rows tint.', Render: () => <Demo select /> },
    { name: 'Sticky header', description: 'Fixed 420px viewport; header stays while rows scroll.', Render: () => <Demo sticky rows={[...data, ...data.map((r) => ({ ...r, id: r.id + 'b' })), ...data.map((r) => ({ ...r, id: r.id + 'c' }))]} /> },
    { name: 'Empty', description: 'Say what happened and how to recover.', Render: () => <Demo empty /> },
    { name: 'Loading', description: 'Keep the header; replace rows with a skeleton or a loading line.', Render: () => <Demo empty loading /> },
  ],
  sections: [
    { type: 'numbered', id: 'columns', title: 'Column guidance', intro: 'Five rules for choosing and ordering columns.', items: [
      { title: 'Lead with the identifier', body: 'The first column is the row header (isRowHeader). It is how screen readers name the row, so make it unique and meaningful.' },
      { title: 'Right-align numbers', body: 'Amounts and counts align to the right edge with tabular numerals so digits line up. Their header aligns the same way.' },
      { title: 'Status next to the name', body: 'Put a Badge in the second or third column, not the last.' },
      { title: 'Cap at 8 to 10', body: 'Beyond that, scroll horizontally or move detail into a row action or Drawer.' },
      { title: 'Sort only what people sort by', body: 'Dates, amounts and names yes; status and free text no.' },
    ] },
    { type: 'rules', id: 'density', title: 'Density, selection and large data', items: [
      { title: 'Density', body: 'Use md (56px rows) for scanning records with several lines of content, sm (44px) for operational lists with one line per cell.' },
      { title: 'Selection', body: 'Add selectionMode="multiple" for bulk actions. Show a bulk bar when at least one row is selected and put the count in it.' },
      { title: 'Paging vs virtualizing', body: 'Under about 50 rows render them all. Past that, page on the server (25 or 50 per page). Table does not virtualize; reach for DataGrid when you need 1,000+ rows.' },
    ] },
    { type: 'rules', id: 'recipes', title: 'Composition', items: [
      { title: 'With FilterBar', body: 'Place a FilterBar above; keep the table showing the filtered rows and put the result count in the toolbar.' },
      { title: 'With bulk actions', body: 'Swap the toolbar for "3 selected" plus Button actions when selection is not empty.' },
      { title: 'With EmptyState', body: 'Return an EmptyState from renderEmptyState. Name the cause and offer Clear filters.' },
    ] },
  ],
  content: { rules: [
    { title: 'Headers', body: 'Nouns, sentence case, 1 to 2 words: Due date, Amount.' },
    { title: 'Cells', body: 'Truncate with an ellipsis only in free text, and keep the full value in a title or detail view.' },
    { title: 'Empty', body: 'Say what happened, then the way out: "No invoices match. Clear the filters to see all 48."' },
    { title: 'Dates and money', body: 'Format with the user locale; show currency symbols, no raw ISO strings.' },
  ] },
  accessibility: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus into and out of the table (one tab stop).' },
      { keys: ['↑', '↓', '←', '→'], action: 'Moves between rows and cells.' },
      { keys: ['Space'], action: 'Toggles selection of the focused row.' },
      { keys: ['Enter'], action: 'Activates the row action, or toggles sort on a focused column header.' },
      { keys: ['Ctrl', 'A'], action: 'Selects all rows (multiple mode).' },
      { keys: ['Esc'], action: 'Clears the selection.' },
      { keys: ['Home', 'End'], action: 'First and last cell in a row.' },
    ],
    notes: ['React Aria Table: role="grid", rows, column headers and row headers with aria-sort on sorted columns.', 'The select-all checkbox is labelled "Select all"; selection changes are announced.', 'Sort direction is exposed through aria-sort, not the caret alone.', 'Provide an aria-label on every table.'],
    reducedMotion: 'Row and header transitions are limited to color; no motion to remove.',
  },
  props: [
    { name: 'aria-label', type: 'string', description: 'Required name for the table.' },
    { name: 'density', type: "'sm' | 'md'", default: "'md'", description: '44px or 56px rows.' },
    { name: 'stickyHeader', type: 'boolean', default: 'false', description: 'Pin the header; container max height 420px.' },
    { name: 'selectionMode', type: "'none' | 'single' | 'multiple'", default: "'none'", description: 'Adds the checkbox column when not none.' },
    { name: 'selectedKeys / defaultSelectedKeys', type: "'all' | Iterable<Key>", description: 'Controlled or initial selection.' },
    { name: 'onSelectionChange', type: '(keys: Selection) => void', description: 'Fires on selection.' },
    { name: 'sortDescriptor / onSortChange', type: 'SortDescriptor', description: 'Controlled sort. Sorting the rows is up to you.' },
    { name: 'disabledKeys', type: 'Iterable<Key>', description: 'Rows that cannot be selected.' },
    { name: 'onRowAction', type: '(key: Key) => void', description: 'Makes rows pressable.' },
    { name: 'Column.allowsSorting / isRowHeader / width', type: 'boolean / boolean / ColumnSize', description: 'Sort caret, row-header role, sizing.' },
    { name: 'TableBody.items / renderEmptyState', type: 'Iterable<T> / () => ReactNode', description: 'Dynamic rows and empty content.' },
    { name: 'Row.id / onAction', type: 'Key / () => void', description: 'Row identity and action.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Override on the scroll container (Table) or element.' },
  ],
  related: ['data-table', 'data-grid', 'filter-bar', 'empty-state', 'pagination'],
};
export default page;
