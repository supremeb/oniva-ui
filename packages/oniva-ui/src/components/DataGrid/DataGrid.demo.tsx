import { useMemo, useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { DataGrid, type DataGridColumn, type DataGridRow } from './DataGrid';

const names = ['Northwind', 'Contoso', 'Initech', 'Globex', 'Umbrella', 'Stark Labs', 'Wayne Freight', 'Hooli', 'Soylent', 'Acme Robotics', 'Pied Piper', 'Wonka'];
const owners = ['Priya Nair', 'Marcus Okafor', 'Lena Schmidt', 'Daniel Kim', 'Aisha Rahman', 'Tomás Barros'];
const regions = ['NA East', 'NA West', 'EMEA', 'DACH', 'APAC', 'LATAM'];

export function makeRows(n: number): DataGridRow[] {
  let s = 42;
  const rnd = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
  return Array.from({ length: n }, (_, i) => {
    const seats = Math.round(5 + rnd() * 480);
    return {
      id: `acct-${i + 1}`,
      account: `${names[i % names.length]} ${Math.floor(i / names.length) + 1}`,
      owner: owners[Math.floor(rnd() * owners.length)]!,
      region: regions[Math.floor(rnd() * regions.length)]!,
      seats,
      mrr: Math.round(seats * (18 + rnd() * 22)),
      margin: Math.round((0.52 + rnd() * 0.3) * 1000) / 1000,
    };
  });
}

const columns: DataGridColumn[] = [
  { id: 'account', header: 'Account', width: 200, summary: 'count' },
  { id: 'owner', header: 'Owner', width: 160 },
  { id: 'region', header: 'Region', width: 120 },
  { id: 'seats', header: 'Seats', width: 110, type: 'number', editable: true, summary: 'sum' },
  { id: 'mrr', header: 'MRR', width: 130, type: 'currency', editable: true, summary: 'sum' },
  { id: 'margin', header: 'Gross margin', width: 140, type: 'percent', summary: 'avg' },
];

function Grid({ count }: { count: number }) {
  const [rows, setRows] = useState(() => makeRows(count));
  const cols = useMemo(() => columns, []);
  return (
    <DataGrid
      aria-label={`Customer accounts (${count.toLocaleString('en-US')} rows)`}
      columns={cols}
      rows={rows}
      height={380}
      onCellChange={(id, col, value) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [col]: value } : r)))}
    />
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Data grid',
    slug: 'data-grid',
    category: 'Data display',
    description:
      'Spreadsheet-style grid with windowed rows (10,000 here), resizable columns (drag, or focus the handle and use arrow keys), a sticky first column and summary row, and inline editing: Enter or double-click to edit, Enter to commit, Escape to cancel.',
  },
  demos: [
    {
      name: '10,000 accounts',
      code: `<DataGrid
  aria-label="Customer accounts"
  columns={[
    { id: 'account', header: 'Account', width: 200, summary: 'count' },
    { id: 'seats', header: 'Seats', type: 'number', editable: true, summary: 'sum' },
    { id: 'mrr', header: 'MRR', type: 'currency', editable: true, summary: 'sum' },
  ]}
  rows={rows}
  onCellChange={(rowId, columnId, value) => update(rowId, columnId, value)}
/>`,
      Component: () => <Grid count={10000} />,
    },
  ],
};

export default demo;
