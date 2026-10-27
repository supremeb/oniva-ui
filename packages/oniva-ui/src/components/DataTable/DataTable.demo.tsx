import type { ColumnDef } from '@tanstack/react-table';
import { Calendar, Link2, Table2, Text } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { CustomerCell, DateCell, PriceCell, StatusBadgeCell, StatusSelectCell } from './cells';
import { DataTable, type DataTableFilter, type DataTableMeta } from './DataTable';
import { customers, type Customer } from './sample-data';

const stageOptions = [
  { value: 'waiting', label: 'Waiting', tone: 'warning' },
  { value: 'processing', label: 'Processing', tone: 'info' },
  { value: 'completed', label: 'Completed', tone: 'success' },
] as const;

const fulfilmentVariant = {
  Shipped: 'success',
  'Delivery failed': 'danger',
  Waiting: 'warning',
} as const;

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: 'name',
    header: 'Customer name',
    cell: ({ row }) => <CustomerCell name={row.original.name} />,
  },
  {
    accessorKey: 'stage',
    header: 'Purchase',
    enableSorting: false,
    cell: ({ row, table }) => (
      <StatusSelectCell
        aria-label={`Stage for ${row.original.name}`}
        value={row.original.stage}
        options={[...stageOptions]}
        onChange={(v) =>
          (table.options.meta as DataTableMeta<Customer>).updateRow(row.id, {
            stage: v as Customer['stage'],
          })
        }
      />
    ),
  },
  {
    accessorKey: 'fulfilment',
    header: 'Status',
    enableSorting: false,
    cell: ({ getValue }) => (
      <StatusBadgeCell
        label={getValue<Customer['fulfilment']>()}
        variant={fulfilmentVariant[getValue<Customer['fulfilment']>()]}
      />
    ),
  },
  {
    accessorKey: 'updated',
    header: 'Last updated',
    cell: ({ getValue }) => <DateCell value={getValue<string>()} />,
  },
  {
    accessorKey: 'total',
    header: 'Total',
    filterFn: (row, id, value: string) => {
      const v = row.getValue<number>(id);
      return value === 'low' ? v < 500 : value === 'mid' ? v >= 500 && v < 1500 : v >= 1500;
    },
    cell: ({ getValue }) => <PriceCell value={getValue<number>()} />,
  },
  { accessorKey: 'product', header: 'Product' },
];

const filters: DataTableFilter[] = [
  {
    columnId: 'total',
    allLabel: 'All prices',
    options: [
      { value: 'low', label: 'Under $500' },
      { value: 'mid', label: '$500 – $1,500' },
      { value: 'high', label: '$1,500+' },
    ],
  },
  {
    columnId: 'product',
    allLabel: 'All products',
    options: ['Starter', 'Growth', 'Scale', 'Enterprise'].map((p) => ({ value: p, label: p })),
  },
  {
    columnId: 'fulfilment',
    allLabel: 'All statuses',
    options: ['Shipped', 'Delivery failed', 'Waiting'].map((p) => ({ value: p, label: p })),
  },
];

interface Tool {
  id: string;
  tool: string;
  category: string;
  site: string;
  renews: string;
}
const tools: Tool[] = [
  { id: 't1', tool: 'Sketchpad', category: 'Design', site: 'sketchpad.example', renews: '2026-03-12' },
  { id: 't2', tool: 'Trackline', category: 'Issue tracking', site: 'trackline.example', renews: '2026-01-04' },
  { id: 't3', tool: 'Hostly', category: 'Hosting', site: 'hostly.example', renews: '2026-08-21' },
  { id: 't4', tool: 'Sitecraft', category: 'Website', site: 'sitecraft.example', renews: '2026-05-02' },
  { id: 't5', tool: 'Clipcast', category: 'Video', site: 'clipcast.example', renews: '2026-11-18' },
];
const toolTones = { Design: 'violet', 'Issue tracking': 'blue', Hosting: 'gray', Website: 'pink', Video: 'green' } as const;
const toolColumns: ColumnDef<Tool>[] = [
  { accessorKey: 'tool', header: 'Tool', meta: { sheet: { type: 'title', icon: <Text size={14} />, width: 220 } } },
  {
    accessorKey: 'category',
    header: 'Category',
    meta: { sheet: { type: 'tag', icon: <Table2 size={14} />, options: Object.keys(toolTones) } },
  },
  { accessorKey: 'site', header: 'Website', meta: { sheet: { type: 'link', icon: <Link2 size={14} /> } } },
  { accessorKey: 'renews', header: 'Renews', meta: { sheet: { type: 'date', icon: <Calendar size={14} /> } } },
];

const demo: DemoModule = {
  meta: {
    title: 'Data table',
    slug: 'data-table',
    category: 'Data display',
    description:
      'Full data table block powered by TanStack Table v8: filter selects, global search, sortable columns, row selection with an indeterminate header checkbox, editable status cells and a pagination footer. Rendering uses the Table primitives. Set layout="sheet" for an editable spreadsheet (DataSheet) driven by column meta.',
  },
  demos: [
    {
      name: 'Editable sheet',
      code: `const columns: ColumnDef<Tool>[] = [
  { accessorKey: 'tool', header: 'Tool', meta: { sheet: { type: 'title' } } },
  { accessorKey: 'category', header: 'Category',
    meta: { sheet: { type: 'tag', options: ['Design', 'Hosting', 'Video'] } } },
  { accessorKey: 'site', header: 'Website', meta: { sheet: { type: 'link' } } },
  { accessorKey: 'renews', header: 'Renews', meta: { sheet: { type: 'date' } } },
];

<DataTable layout="sheet" title="Design stack" icon={<Table2 size={14} />}
  aria-label="Design stack" data={tools} columns={columns} tagTones={tones}
  onDataChange={setTools} />`,
      Component: () => (
        <DataTable
          layout="sheet"
          title="Design stack"
          icon={<Table2 size={14} />}
          aria-label="Design stack"
          data={tools}
          columns={toolColumns}
          tagTones={toolTones}
          getRowId={(r) => r.id}
        />
      ),
    },
    {
      name: 'Customers',
      code: `const columns: ColumnDef<Customer>[] = [
  { accessorKey: 'name', header: 'Customer name',
    cell: ({ row }) => <CustomerCell name={row.original.name} /> },
  { accessorKey: 'stage', header: 'Purchase', enableSorting: false,
    cell: ({ row, table }) => (
      <StatusSelectCell value={row.original.stage} options={stageOptions}
        onChange={(v) => table.options.meta.updateRow(row.id, { stage: v })} />
    ) },
  { accessorKey: 'fulfilment', header: 'Status', enableSorting: false,
    cell: ({ getValue }) => <StatusBadgeCell label={getValue()} variant={variant[getValue()]} /> },
  { accessorKey: 'updated', header: 'Last updated',
    cell: ({ getValue }) => <DateCell value={getValue()} /> },
  { accessorKey: 'total', header: 'Total', cell: ({ getValue }) => <PriceCell value={getValue()} /> },
];

<DataTable aria-label="Customers" data={customers} columns={columns}
  itemLabel="customers" filters={filters} pageSize={8} getRowId={(r) => r.id} />`,
      Component: () => (
        <DataTable
          aria-label="Customers"
          data={customers}
          columns={columns}
          itemLabel="customers"
          filters={filters}
          pageSize={8}
          getRowId={(r) => r.id}
        />
      ),
    },
    {
      name: 'Compact, no filters',
      code: `<DataTable aria-label="Customers" data={customers.slice(0, 12)} columns={columns}
  density="sm" pageSize={5} searchable={false} selectable={false} getRowId={(r) => r.id} />`,
      Component: () => (
        <DataTable
          aria-label="Customers (compact)"
          data={customers.slice(0, 12)}
          columns={columns}
          density="sm"
          pageSize={5}
          searchable={false}
          selectable={false}
          getRowId={(r) => r.id}
        />
      ),
    },
    {
      name: 'Copy, undo and add row',
      code: `<DataTable aria-label="Customers" data={customers.slice(0, 10)} columns={columns} pageSize={5}
  getRowId={(r) => r.id}
  onAddRow={() => ({ id: crypto.randomUUID(), name: 'New customer', ... })} />
// Select rows, press Cmd/Ctrl+C and paste into a spreadsheet. Cmd/Ctrl+Z undoes a stage change.`,
      Component: () => (
        <DataTable
          aria-label="Customers (copy and undo)"
          data={customers.slice(0, 10)}
          columns={columns}
          itemLabel="customers"
          pageSize={5}
          getRowId={(r) => r.id}
          onAddRow={(): Customer => ({
            ...customers[0]!,
            id: `new-${Math.random().toString(36).slice(2, 7)}`,
            name: 'New customer',
            stage: 'waiting',
          })}
        />
      ),
    },
  ],
};

export default demo;
