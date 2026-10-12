import type { ColumnDef } from '@tanstack/react-table';
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

const demo: DemoModule = {
  meta: {
    title: 'Data table',
    slug: 'data-table',
    category: 'Data display',
    description:
      'Full data table block powered by TanStack Table v8: filter selects, global search, sortable columns, row selection with an indeterminate header checkbox, editable status cells and a pagination footer. Rendering uses the Table primitives.',
  },
  demos: [
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
  ],
};

export default demo;
