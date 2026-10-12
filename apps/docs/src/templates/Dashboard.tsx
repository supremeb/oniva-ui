import * as stylex from '@stylexjs/stylex';
import { CreditCard, DollarSign, Users, Wallet } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  AreaChart,
  BarList,
  Button,
  ChartCard,
  ChartLegend,
  DataTable,
  DateCell,
  LayoutShell,
  PriceCell,
  StatCard,
  StatusBadgeCell,
  CustomerCell,
} from 'oniva-ui';
import {
  revenueByMonth,
  trafficSources,
} from '../../../../packages/oniva-ui/src/charts/_data/datasets';
import {
  customers,
  type Customer,
} from '../../../../packages/oniva-ui/src/components/DataTable/sample-data';
import { PageTitle, TemplateSidebar } from './shared';

const styles = stylex.create({
  stack: { display: 'flex', flexDirection: 'column', gap: 20 },
  stats: { display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' },
  row: {
    alignItems: 'start',
    display: 'grid',
    gap: 16,
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 1100px)': 'minmax(0, 2fr) minmax(0, 1fr)',
    },
  },
});

const variant = { Shipped: 'success', 'Delivery failed': 'danger', Waiting: 'warning' } as const;

export const customerColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: 'name',
    header: 'Customer',
    cell: ({ row }) => <CustomerCell name={row.original.name} />,
  },
  {
    accessorKey: 'fulfilment',
    header: 'Status',
    enableSorting: false,
    cell: ({ getValue }) => (
      <StatusBadgeCell
        label={getValue<Customer['fulfilment']>()}
        variant={variant[getValue<Customer['fulfilment']>()]}
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
    cell: ({ getValue }) => <PriceCell value={getValue<number>()} />,
  },
  { accessorKey: 'product', header: 'Plan' },
];

const rev = [
  { key: 'revenue', label: 'Revenue', tone: 1 },
  { key: 'expenses', label: 'Expenses', tone: 5 },
];

export function Dashboard() {
  return (
    <LayoutShell
      sidebar={
        <TemplateSidebar
          active="dashboard"
          workspace="Acme Finance"
          account={{ name: 'Aylin Demir', email: 'aylin@acme.co' }}
        />
      }
      header={
        <PageTitle title="Finance overview" sub="Fiscal year 2026 · All entities">
          <Button size="sm">Export report</Button>
        </PageTitle>
      }
    >
      <div {...stylex.props(styles.stack)}>
        <div {...stylex.props(styles.stats)}>
          <StatCard
            label="Monthly revenue"
            value="$88,400"
            delta={10.8}
            deltaLabel="vs Nov"
            icon={<DollarSign size={16} />}
            trend={[42, 46, 52, 50, 57, 63, 61, 69, 74, 71, 80, 88]}
          />
          <StatCard
            label="Active customers"
            value="2,940"
            delta={4.1}
            deltaLabel="vs Nov"
            icon={<Users size={16} />}
            tone={5}
            trend={[18, 20, 19, 22, 24, 23, 26, 27, 26, 29, 30, 31]}
          />
          <StatCard
            label="Refund rate"
            value="1.8%"
            delta={-0.4}
            invertDelta
            deltaLabel="vs Nov"
            icon={<CreditCard size={16} />}
            tone={3}
            trend={[24, 22, 23, 21, 20, 19, 19, 18]}
          />
          <StatCard
            label="Cash on hand"
            value="$1.24M"
            delta={2.3}
            deltaLabel="vs Nov"
            icon={<Wallet size={16} />}
            tone={4}
            trend={[100, 104, 99, 108, 112, 118, 121, 124]}
          />
        </div>
        <div {...stylex.props(styles.row)}>
          <ChartCard
            title="Revenue vs expenses"
            value="$753,300"
            unit="this year"
            delta={{ label: '18.2%', trend: 'up' }}
            legend={<ChartLegend items={rev as never} />}
          >
            <AreaChart data={revenueByMonth} index="month" series={rev} valueFormat="currency" />
          </ChartCard>
          <ChartCard title="Traffic sources" value="38,101" unit="visits">
            <BarList
              items={trafficSources.map((t) => ({ name: t.label, value: t.value }))}
              valueFormat="compact"
            />
          </ChartCard>
        </div>
        <DataTable
          aria-label="Customers"
          title="Customers"
          data={customers}
          columns={customerColumns}
          itemLabel="customers"
          pageSize={6}
          getRowId={(r) => r.id}
        />
      </div>
    </LayoutShell>
  );
}
