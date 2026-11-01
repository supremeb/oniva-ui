import { Badge, StreamingTable } from 'oniva-ui';
import type { StreamingColumn } from 'oniva-ui';
import type { StateModule } from '../types';

interface Inv extends Record<string, unknown> {
  id: string;
  vendor: string;
  due: string;
  amount: string;
  status: 'Matched' | 'Variance' | 'Missing PO';
}

const data: Inv[] = [
  { id: 'INV-20411', vendor: 'Northwind Industrial', due: 'Oct 14', amount: '$12,480.00', status: 'Matched' },
  { id: 'INV-20418', vendor: 'Harbor Freight Partners', due: 'Oct 15', amount: '$3,912.50', status: 'Variance' },
  { id: 'INV-20422', vendor: 'Lumen Software Co.', due: 'Oct 18', amount: '$8,200.00', status: 'Matched' },
  { id: 'INV-20430', vendor: 'Birchwood Packaging', due: 'Oct 21', amount: '$1,764.30', status: 'Missing PO' },
  { id: 'INV-20437', vendor: 'Summit Supplies', due: 'Oct 22', amount: '$6,055.00', status: 'Matched' },
  { id: 'INV-20441', vendor: 'Cedar Cloud Services', due: 'Oct 28', amount: '$22,310.75', status: 'Variance' },
];

const many: Inv[] = Array.from({ length: 24 }, (_, i) => {
  const base = data[i % data.length]!;
  return { ...base, id: `INV-${20450 + i}`, due: `Nov ${(i % 28) + 1}`, amount: `$${(1200 + i * 437.15).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` };
});

const tone = { Matched: 'success', Variance: 'warning', 'Missing PO': 'danger' } as const;
const columns: StreamingColumn<Inv>[] = [
  { key: 'id', header: 'Invoice' },
  { key: 'vendor', header: 'Vendor' },
  { key: 'due', header: 'Due' },
  { key: 'amount', header: 'Amount', align: 'end' },
  { key: 'status', header: 'Check', render: (r) => <Badge variant={tone[r.status]}>{r.status}</Badge> },
];
const plainColumns: StreamingColumn<Inv>[] = columns.slice(0, 4);

const longRows: Inv[] = [
  {
    id: 'INV-20499',
    vendor: 'Northwind Industrial Holdings International Logistics and Cold Chain Services Incorporated Northern Division',
    due: 'Oct 30',
    amount: '$1,204,880.00',
    status: 'Variance',
  },
  {
    id: 'INV-20500-REVISED-2026-Q4-ADJUSTMENT-LINE-ITEM-0001',
    vendor: 'billing-department-accounts-receivable@northwind-industrial-logistics.example',
    due: 'Oct 31',
    amount: '$88.00',
    status: 'Matched',
  },
];

const get = (r: Inv) => r.id;

const mod: StateModule = {
  slug: 'streaming-table',
  title: 'Streaming table',
  width: 720,
  groups: [
    {
      label: 'Run',
      states: [
        {
          id: 'empty',
          label: 'empty, idle',
          render: () => <StreamingTable caption="Invoice reconciliation" columns={columns} rows={[]} getKey={get} />,
        },
        {
          id: 'waiting',
          label: 'streaming, no rows yet',
          render: () => <StreamingTable caption="Invoice reconciliation" columns={columns} rows={[]} getKey={get} isStreaming />,
        },
        {
          id: 'one-row',
          label: 'streaming, one row',
          render: () => <StreamingTable caption="Invoice reconciliation" columns={columns} rows={data.slice(0, 1)} getKey={get} isStreaming />,
        },
        {
          id: 'streaming',
          label: 'streaming, three rows',
          render: () => <StreamingTable caption="Invoice reconciliation" columns={columns} rows={data.slice(0, 3)} getKey={get} isStreaming />,
        },
        {
          id: 'done',
          label: 'done',
          render: () => <StreamingTable caption="Invoice reconciliation" columns={columns} rows={data} getKey={get} />,
        },
      ],
    },
    {
      label: 'Data',
      states: [
        {
          id: 'plain-cells',
          label: 'plain cells, no custom render',
          render: () => <StreamingTable caption="Invoice list" columns={plainColumns} rows={data} getKey={get} />,
        },
        {
          id: 'many-rows',
          label: 'long set (24 rows), streaming',
          render: () => <StreamingTable caption="Invoice reconciliation" columns={columns} rows={many} getKey={get} isStreaming />,
        },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'long-text',
          label: 'long unbroken ids and vendor names',
          render: () => <StreamingTable caption="Invoice reconciliation" columns={columns} rows={longRows} getKey={get} />,
        },
      ],
    },
  ],
  missing: [
    'error / failed stream: no error or cancelled prop, a stalled stream is indistinguishable from done',
    'cancelled: isStreaming only toggles the status line',
    'sortable, selectable or clickable rows: the table is display-only',
  ],
};

export default mod;
