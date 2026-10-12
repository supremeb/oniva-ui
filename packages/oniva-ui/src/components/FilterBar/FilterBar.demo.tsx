import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import type { DemoModule } from '../../internal/demo';
import { applyFilters, FilterBar, type FilterField, type FilterValue } from './FilterBar';

const fields: FilterField[] = [
  { id: 'customer', label: 'Customer', type: 'text' },
  { id: 'status', label: 'Status', type: 'select', options: ['Paid', 'Pending', 'Overdue', 'Draft'] },
  { id: 'amount', label: 'Amount', type: 'number' },
];

const invoices = [
  { customer: 'Northwind Traders', status: 'Paid', amount: 4820 },
  { customer: 'Contoso Ltd', status: 'Pending', amount: 12950 },
  { customer: 'Globex Corp', status: 'Overdue', amount: 780 },
  { customer: 'Initech', status: 'Paid', amount: 2300 },
  { customer: 'Hooli', status: 'Draft', amount: 19400 },
  { customer: 'Stark Labs', status: 'Overdue', amount: 8650 },
];

const s = stylex.create({ list: { margin: 0, marginTop: 12, paddingInlineStart: 20 } });

function Demo() {
  const [filters, setFilters] = useState<FilterValue[]>([{ id: 'f1', field: 'status', operator: 'is', value: 'Overdue' }]);
  const shown = applyFilters(invoices, filters);
  return (
    <div>
      <FilterBar
        fields={fields}
        filters={filters}
        onFiltersChange={setFilters}
        savedViews={[{ id: 'v-od', name: 'Overdue over $5k', filters: [{ id: 'a', field: 'status', operator: 'is', value: 'Overdue' }, { id: 'b', field: 'amount', operator: '>', value: '5000' }] }]}
      />
      <ul {...stylex.props(s.list)} aria-label="Matching invoices">
        {shown.map((i) => (
          <li key={i.customer}>
            {i.customer} · {i.status} · ${i.amount.toLocaleString('en-US')}
          </li>
        ))}
      </ul>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Filter bar',
    slug: 'filter-bar',
    category: 'Data display',
    description: 'Filter chips with field, operator and value editors in a popover, an add-filter menu, clear all and saved views.',
  },
  demos: [
    {
      name: 'Invoice filters',
      code: `<FilterBar
  fields={[{ id: 'status', label: 'Status', type: 'select', options: ['Paid', 'Overdue'] }]}
  filters={filters}
  onFiltersChange={setFilters}
  savedViews={views}
/>`,
      Component: Demo,
    },
  ],
};
export default demo;
