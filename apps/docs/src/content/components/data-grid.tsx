import { useMemo, useState } from 'react';
import { DataGrid, type DataGridColumn, type DataGridRow } from 'oniva-ui';
import type { DocPage } from '../types';

const names = ['Northwind', 'Contoso', 'Initech', 'Globex', 'Umbrella', 'Stark Labs', 'Wayne Freight', 'Hooli', 'Soylent', 'Acme Robotics'];
const owners = ['Priya Nair', 'Marcus Okafor', 'Lena Schmidt', 'Daniel Kim', 'Aisha Rahman'];
const regions = ['NA East', 'NA West', 'EMEA', 'DACH', 'APAC'];
function makeRows(n: number): DataGridRow[] {
  let s = 42;
  const rnd = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
  return Array.from({ length: n }, (_, i) => {
    const seats = Math.round(5 + rnd() * 480);
    return { id: `acct-${i + 1}`, account: `${names[i % names.length]} ${Math.floor(i / names.length) + 1}`, owner: owners[Math.floor(rnd() * owners.length)]!, region: regions[Math.floor(rnd() * regions.length)]!, seats, mrr: Math.round(seats * (18 + rnd() * 22)), margin: Math.round((0.52 + rnd() * 0.3) * 1000) / 1000 };
  });
}
const columns: DataGridColumn[] = [
  { id: 'account', header: 'Account', width: 170, summary: 'count' },
  { id: 'owner', header: 'Owner', width: 130 },
  { id: 'region', header: 'Region', width: 100 },
  { id: 'seats', header: 'Seats', width: 90, type: 'number', editable: true, summary: 'sum' },
  { id: 'mrr', header: 'MRR', width: 110, type: 'currency', editable: true, summary: 'sum' },
  { id: 'margin', header: 'Margin', width: 100, type: 'percent', summary: 'avg' },
];

const Demo = (p: { count?: number; rowHeight?: number; height?: number; summary?: boolean; onEvent?: (n: string) => void }) => {
  const [rows, setRows] = useState(() => makeRows(p.count ?? 1000));
  const cols = useMemo(() => (p.summary === false ? columns.map((c) => ({ ...c, summary: undefined })) : columns), [p.summary]);
  return (
    <div style={{ width: 680 }}>
      <DataGrid
        aria-label="Customer accounts"
        columns={cols}
        rows={rows}
        height={p.height ?? 280}
        rowHeight={p.rowHeight}
        onCellChange={(id, col, value) => { setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [col]: value } : r))); p.onEvent?.('onCellChange'); }}
      />
    </div>
  );
};

const page: DocPage = {
  slug: 'data-grid',
  status: 'Stable',
  version: '0.1.0',
  importName: 'DataGrid',
  group: ['Components', 'Data display'],
  sourcePath: 'components/DataGrid',
  lede: 'A spreadsheet-style grid for large datasets: windowed rows, resizable columns, a sticky first column, summary row and inline editing.',
  anatomy: {
    intro: 'Six parts. Header, rows and cells are always present; the summary row appears when any column sets summary.',
    Render: () => <Demo count={500} />,
    parts: [
      { name: 'Grid', description: 'role="grid", fixed height (default 420px), 10px radius, 1px border, xs shadow. Only visible rows plus 6 overscan rows are in the DOM.', selector: '[role="grid"]' },
      { name: 'Header row', description: 'Sticky, 36px, inset surface, 12px muted medium text. Numeric columns right-align.', selector: '[role="columnheader"]:nth-child(2)' },
      { name: 'Resize handle', description: '4px separator on the column edge. Drag, or focus and press ← → (10px, 40px with Shift). Double-click resets.', selector: '[role="columnheader"]:nth-child(2) [role="separator"]' },
      { name: 'Sticky first column', description: 'The first column stays pinned with a 1px end border while scrolling horizontally.', selector: '[role="gridcell"][data-r="0"][data-c="0"]' },
      { name: 'Active cell', description: 'One cell is in the tab order. It gets an accent tint and a 2px inset focus ring. 12px side padding, 36px row height by default.', selector: '[role="gridcell"][tabindex="0"]' },
      { name: 'Summary row', description: 'Sticky at the bottom. Sum, average or count per column, semibold, formatted like the column.', selector: '[role="grid"] > div > [role="row"]:last-child', fallback: { x: 50, y: 92 } },
    ],
  },
  usage: {
    use: ['Thousands of rows that must scroll smoothly (10,000 renders at 60fps).', 'Fast keyboard editing of numbers and short text.', 'Financial and operational sheets with totals.'],
    avoid: [
      { text: 'Search, filters and paging out of the box.', instead: { slug: 'data-table', label: 'DataTable' } },
      { text: 'Row selection with bulk actions.', instead: { slug: 'table', label: 'Table' } },
      { text: 'Rich cells with menus, avatars or badges.', instead: { slug: 'data-table', label: 'DataTable' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'number', key: 'count', label: 'Rows', min: 10, max: 10000, step: 990 },
      { kind: 'number', key: 'rowHeight', label: 'Row height', min: 28, max: 56, step: 4 },
      { kind: 'toggle', key: 'summary', label: 'Summary row' },
    ],
    initial: { count: 1000, rowHeight: 36, summary: true },
    render: (p, onEvent) => <Demo key={`${p.count}${p.summary}${p.rowHeight}`} count={Number(p.count)} rowHeight={Number(p.rowHeight)} summary={Boolean(p.summary)} onEvent={onEvent} />,
    code: (p) => `<DataGrid\n  aria-label="Customer accounts"\n  columns={columns}\n  rows={rows}${Number(p.rowHeight) !== 36 ? `\n  rowHeight={${p.rowHeight}}` : ''}\n  onCellChange={(rowId, columnId, value) => update(rowId, columnId, value)}\n/>`,
  },
  states: [
    { name: 'Default', description: '1,000 rows windowed in a 280px viewport.', Render: () => <Demo /> },
    { name: 'Dense', description: 'rowHeight 28 fits more rows; keep above 28 for touch.', Render: () => <Demo rowHeight={28} /> },
    { name: 'No summary', description: 'Without summary props the footer row is omitted.', Render: () => <Demo summary={false} /> },
    { name: 'Short dataset', description: '5 rows leave empty space; reduce height to fit.', Render: () => <Demo count={5} height={200} /> },
    { name: 'Empty', description: 'Zero rows renders header only. Show your own EmptyState instead of the grid.', Render: () => <Demo count={0} height={120} /> },
  ],
  sections: [
    { type: 'numbered', id: 'keyboard-model', title: 'Keyboard grid navigation', intro: 'The grid has one tab stop. Arrow keys move the active cell; editing is explicit.', items: [
      { title: 'Move', body: 'Arrow keys move one cell. Page Up and Down move a viewport minus one row. Home and End jump to the row start and end; with Ctrl or Cmd they jump to the first and last cell.' },
      { title: 'Edit', body: 'Enter or F2 starts editing an editable cell, as does a double-click. Enter commits and moves down; Tab commits in place; Esc cancels.' },
      { title: 'Resize', body: 'Focus a column separator and use ← → for 10px steps (Shift: 40px). Minimum width is 64px.' },
    ] },
    { type: 'rules', id: 'scale', title: 'Virtualization vs pagination', items: [
      { title: 'Virtualize for scanning and editing', body: 'DataGrid windows rows, so 10,000 rows cost the same as 20 in DOM size. Use it when people scroll, compare and edit.' },
      { title: 'Paginate for search and records', body: 'If users look for a record, pair DataTable with paging or server queries. Virtual scrolling hides total position and breaks find in page.' },
      { title: 'Server data', body: 'Pass the loaded window as rows and grow it on scroll end. Keep row ids stable.' },
    ] },
    { type: 'rules', id: 'recipes', title: 'Composition', items: [
      { title: 'With FilterBar', body: 'Filter rows in state, then pass the result. Show the count above the grid.' },
      { title: 'Loading and errors', body: 'Render a Skeleton of the same height until rows arrive. On failure show an Alert and a Retry; the grid does not manage async.' },
    ] },
  ],
  content: { rules: [
    { title: 'Headers', body: 'One or two words; they are truncated with an ellipsis and a title tooltip.' },
    { title: 'Number types', body: 'Set type to number, currency or percent so values align right and format by locale.' },
    { title: 'Edits', body: 'Return only the changed value in onCellChange; invalid numbers are ignored.' },
    { title: 'Summary', body: 'Use sum for money and counts, avg for rates, count for the first column.' },
  ] },
  accessibility: {
    keyboard: [
      { keys: ['Tab'], action: 'Enters and leaves the grid (one tab stop).' },
      { keys: ['↑', '↓', '←', '→'], action: 'Moves the active cell.' },
      { keys: ['PageUp', 'PageDown'], action: 'Moves one viewport up or down.' },
      { keys: ['Home', 'End'], action: 'First and last cell in the row.' },
      { keys: ['Ctrl', 'Home'], action: 'First cell in the grid.' },
      { keys: ['Ctrl', 'End'], action: 'Last cell in the grid.' },
      { keys: ['Enter', 'F2'], action: 'Starts editing; Enter again commits and moves down.' },
      { keys: ['Esc'], action: 'Cancels the edit and restores focus to the cell.' },
    ],
    notes: ['role="grid" with aria-rowcount and aria-colcount for the full dataset, and aria-rowindex on rendered rows, so assistive tech reports the true position.', 'Read-only cells carry aria-readonly.', 'Resize separators are labelled "Resize <column> column" with aria-valuenow.', 'The editor input is labelled "Edit <column>".'],
    reducedMotion: 'No animation.',
  },
  props: [
    { name: 'aria-label', type: 'string', description: 'Required accessible name.' },
    { name: 'columns', type: 'DataGridColumn[]', description: 'id, header, width, minWidth, type, editable, summary.' },
    { name: 'rows', type: 'DataGridRow[]', description: 'Objects with a stable string id.' },
    { name: 'onCellChange', type: '(rowId, columnId, value) => void', description: 'Fires when an edit commits.' },
    { name: 'height', type: 'number', default: '420', description: 'Viewport height in px.' },
    { name: 'rowHeight', type: 'number', default: '36', description: 'Row height in px.' },
    { name: 'overscan', type: 'number', default: '6', description: 'Extra rows rendered above and below.' },
    { name: 'locale / currency', type: 'string', default: 'active locale / USD', description: 'Number formatting.' },
    { name: 'labels', type: 'DataGridLabels', description: 'Override total, average, rows, resize and edit strings.' },
    { name: 'DataGridColumn.type', type: "'text' | 'number' | 'currency' | 'percent'", default: "'text'", description: 'Alignment and format.' },
    { name: 'DataGridColumn.summary', type: "'sum' | 'avg' | 'count'", description: 'Footer aggregation.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Style override.' },
  ],
  related: ['data-table', 'table', 'filter-bar', 'skeleton'],
};
export default page;
