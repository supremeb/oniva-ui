import { useState } from 'react';
import { FilterBar, applyFilters, type FilterField, type FilterValue } from 'oniva-ui';
import type { DocPage } from '../types';

const fields: FilterField[] = [
  { id: 'status', label: 'Status', type: 'select', options: ['Paid', 'Pending', 'Overdue'] },
  { id: 'client', label: 'Client', type: 'text' },
  { id: 'amount', label: 'Amount', type: 'number' },
];
const invoices = [
  { client: 'Northwind Traders', status: 'Paid', amount: 4280 },
  { client: 'Lumen Analytics', status: 'Pending', amount: 1150 },
  { client: 'Acme Logistics', status: 'Overdue', amount: 9720 },
  { client: 'Helios Energy', status: 'Paid', amount: 2315 },
];
const seed = (kind: string): FilterValue[] => kind === 'none-match' ? [{ id: 'a', field: 'status', operator: 'is', value: 'Overdue' }, { id: 'b', field: 'amount', operator: '<', value: '100' }] : kind === 'one' ? [{ id: 'a', field: 'status', operator: 'is', value: 'Overdue' }]
  : kind === 'many' ? [{ id: 'a', field: 'status', operator: 'is', value: 'Paid' }, { id: 'b', field: 'amount', operator: '>', value: '2000' }, { id: 'c', field: 'client', operator: 'contains', value: 'Har' }] : [];

const Demo = (p: { initial?: string; showResults?: boolean; onEvent?: (n: string) => void }) => {
  const [filters, setFilters] = useState<FilterValue[]>(() => seed(p.initial ?? 'one'));
  const shown = applyFilters(invoices, filters);
  return (
    <div style={{ width: 640, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <FilterBar
        fields={fields}
        filters={filters}
        onFiltersChange={(f) => { setFilters(f); p.onEvent?.('onFiltersChange'); }}
        savedViews={[{ id: 'v0', name: 'Overdue invoices', filters: seed('one') }]}
        onSaveView={() => p.onEvent?.('onSaveView')}
      />
      {p.showResults !== false && (
        <div style={{ fontSize: 13, color: 'var(--oniva-color-text-muted)' }}>
          {shown.length === 0 ? 'No invoices match these filters. Clear all to see 4.' : `${shown.length} of ${invoices.length} invoices: ${shown.map((r) => r.client).join(', ')}`}
        </div>
      )}
    </div>
  );
};

const page: DocPage = {
  slug: 'filter-bar',
  status: 'Stable',
  version: '0.1.0',
  importName: 'FilterBar',
  group: ['Components', 'Data display'],
  sourcePath: 'components/FilterBar',
  lede: 'Build a query as a row of chips: pick a field, an operator and a value. Chips are editable and removable, and filter sets can be saved as views.',
  anatomy: {
    intro: 'Six parts. Add filter and Views are always present; chips and Clear all appear once a filter exists.',
    Render: () => <Demo initial="many" showResults={false} />,
    parts: [
      { name: 'Filter chip', description: '32px tall, 8px radius, 1px control border. Reads "Field operator value" in 13px: field and operator muted, value medium. A pop animation on add (off under reduced motion).', selector: '[role="group"][aria-label="Status filter"]' },
      { name: 'Chip editor', description: 'Popover opened by the chip body: 240px wide with an operator select, a value input or select, and Done. Operators depend on the field type.', selector: 'button[aria-label^="Edit Status"]' },
      { name: 'Remove button', description: '28px wide button with a 14px X on the chip\'s trailing edge, divided by a 1px hairline.', selector: 'button[aria-label="Remove Status filter"]' },
      { name: 'Add filter', description: 'Secondary sm button with a plus. Opens a menu of fields; choosing one adds a chip and opens its editor.', selector: '[aria-label="Filters"] > button:nth-of-type(1)' },
      { name: 'Clear all', description: 'Ghost sm button. Shows only when at least one filter is set.', selector: '[aria-label="Filters"] > button:nth-of-type(2)' },
      { name: 'Views', description: 'Right-aligned secondary sm menu: saved views plus "Save current view" (disabled with no filters).', selector: '[aria-label="Filters"] > button:nth-of-type(3)' },
    ],
  },
  usage: {
    use: ['Tables and boards with 3 or more filterable fields.', 'Power users who combine conditions and revisit them.', 'Reusable filter sets saved as views.'],
    avoid: [
      { text: 'One or two fixed filters with preset values.', instead: { slug: 'select', label: 'Select' } },
      { text: 'Searching text across everything.', instead: { slug: 'search-field', label: 'SearchField' } },
      { text: 'A single "type" switch across the data.', instead: { slug: 'segmented-control', label: 'SegmentedControl' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'initial', label: 'Starting filters', options: ['none', 'one', 'many'] },
      { kind: 'toggle', key: 'showResults', label: 'Show results line' },
    ],
    initial: { initial: 'one', showResults: true },
    render: (p, onEvent) => <Demo key={String(p.initial)} initial={String(p.initial)} showResults={Boolean(p.showResults)} onEvent={onEvent} />,
    code: () => `const [filters, setFilters] = useState<FilterValue[]>([]);\nconst rows = applyFilters(invoices, filters);\n\n<FilterBar\n  fields={[\n    { id: 'status', label: 'Status', type: 'select', options: ['Paid', 'Pending', 'Overdue'] },\n    { id: 'amount', label: 'Amount', type: 'number' },\n  ]}\n  filters={filters}\n  onFiltersChange={setFilters}\n/>`,
  },
  states: [
    { name: 'No filters', description: 'Only Add filter and Views. Prefer showing the full data below.', Render: () => <Demo initial="none" /> },
    { name: 'One filter', description: 'A chip, Clear all appears.', Render: () => <Demo initial="one" /> },
    { name: 'Many filters', description: 'Chips wrap onto a second line at narrow widths.', Render: () => <Demo initial="many" /> },
    { name: 'Zero results', description: 'The data area explains the miss and offers Clear all. Combine chips so nothing returns.', Render: () => <Demo initial="none-match" /> },
  ],
  sections: [
    { type: 'numbered', id: 'flow', title: 'How a filter is built', intro: 'Three steps, all keyboard reachable.', items: [
      { title: 'Choose a field', body: 'Add filter opens a menu of fields. The new chip appears with sensible defaults and its editor already open.' },
      { title: 'Set operator and value', body: 'Text: contains, is, is not. Number: =, >, <. Select: is, is not. Press Done to close.' },
      { title: 'Apply and keep', body: 'Chips apply as you type. Save the set from Views to return later.' },
    ] },
    { type: 'rules', id: 'rules', title: 'Rules', items: [
      { title: 'Applying is yours', body: 'FilterBar only edits the filter list. Use applyFilters for client data or send filters to your API.' },
      { title: 'Show the effect', body: 'Display a result count next to the data and say what is hidden when it is zero.' },
      { title: 'Empty values', body: 'A chip with no value is ignored by applyFilters and shows an ellipsis.' },
      { title: 'Reset visible', body: 'Clear all is always one click away; never trap users in an empty result.' },
    ] },
    { type: 'rules', id: 'recipes', title: 'Composition', items: [
      { title: 'With DataTable or Table', body: 'Place above the table; reset to page 1 when filters change.' },
      { title: 'With bulk actions', body: 'When rows are selected, replace the bar with a selection bar, then restore it on clear.' },
      { title: 'With EmptyState', body: 'Zero results: "No invoices match Status is Overdue and Amount over 2,000" with a Clear all action.' },
    ] },
  ],
  content: { rules: [
    { title: 'Field labels', body: 'Nouns users already see as column headers: Status, Client, Amount.' },
    { title: 'Values', body: 'Display the stored value as written; use title case only for option names.' },
    { title: 'View names', body: 'Describe the result, not the filter: "Overdue invoices". Default names are View 1, View 2.' },
    { title: 'Empty results', body: 'Name the filters that produced the miss and the action that clears them.' },
  ] },
  accessibility: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves through chips (edit, then remove), Add filter, Clear all, Views.' },
      { keys: ['Enter', 'Space'], action: 'Opens the chip editor, the field menu or a saved view.' },
      { keys: ['↑', '↓'], action: 'Moves in the field and views menus.' },
      { keys: ['Esc'], action: 'Closes the editor or menu and returns focus to its trigger.' },
    ],
    notes: ['The bar is role="group" labelled "Filters"; each chip is a group labelled "<Field> filter".', 'Edit buttons read "Edit Status filter: is Overdue"; remove buttons read "Remove Status filter".', 'Changes to results are not announced by the bar. Put a polite live region on your results count.', 'Chip buttons are 32px tall; the remove target is 28px wide.'],
    reducedMotion: 'The chip pop animation is removed.',
  },
  props: [
    { name: 'fields', type: 'FilterField[]', description: 'id, label, type (text, number, select) and options for select.' },
    { name: 'filters', type: 'FilterValue[]', description: 'Controlled list: id, field, operator, value.' },
    { name: 'onFiltersChange', type: '(filters: FilterValue[]) => void', description: 'Fires on add, edit, remove and clear.' },
    { name: 'savedViews', type: 'SavedView[]', default: '[]', description: 'Initial saved views; "Save current view" appends locally.' },
    { name: 'onSaveView', type: '(view: SavedView) => void', description: 'Fires when a view is saved.' },
    { name: 'applyFilters', type: '(rows, filters) => rows', description: 'Helper to filter client data; ignores empty values.' },
    { name: 'FilterOperator', type: "'contains' | 'is' | 'is not' | '=' | '>' | '<'", description: 'Operators by type.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Style override.' },
  ],
  related: ['data-table', 'table', 'tag', 'search-field', 'empty-state'],
};
export default page;
