import { useEffect, useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { StreamingTable, type StreamingColumn } from './StreamingTable';

interface Inv extends Record<string, unknown> {
  id: string;
  vendor: string;
  due: string;
  amount: string;
  status: 'Matched' | 'Variance' | 'Missing PO';
}

const data: Inv[] = [
  { id: 'INV-20411', vendor: 'Acme Industrial', due: 'Oct 14', amount: '$12,480.00', status: 'Matched' },
  { id: 'INV-20418', vendor: 'Globex Freight', due: 'Oct 15', amount: '$3,912.50', status: 'Variance' },
  { id: 'INV-20422', vendor: 'Initech Software', due: 'Oct 18', amount: '$8,200.00', status: 'Matched' },
  { id: 'INV-20430', vendor: 'Umbrella Packaging', due: 'Oct 21', amount: '$1,764.30', status: 'Missing PO' },
  { id: 'INV-20437', vendor: 'Soylent Supplies', due: 'Oct 22', amount: '$6,055.00', status: 'Matched' },
  { id: 'INV-20441', vendor: 'Hooli Cloud', due: 'Oct 28', amount: '$22,310.75', status: 'Variance' },
];

const tone = { Matched: 'success', Variance: 'warning', 'Missing PO': 'danger' } as const;
const columns: StreamingColumn<Inv>[] = [
  { key: 'id', header: 'Invoice' },
  { key: 'vendor', header: 'Vendor' },
  { key: 'due', header: 'Due' },
  { key: 'amount', header: 'Amount', align: 'end' },
  { key: 'status', header: 'Check', render: (r) => <Badge variant={tone[r.status]}>{r.status}</Badge> },
];

function Live() {
  const [n, setN] = useState(0);
  const [run, setRun] = useState(0);
  useEffect(() => {
    setN(0);
    const id = setInterval(() => setN((v) => (v >= data.length ? v : v + 1)), 700);
    return () => clearInterval(id);
  }, [run]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 640, width: '100%' }}>
      <StreamingTable caption="Invoice reconciliation" columns={columns} rows={data.slice(0, n)} getKey={(r) => r.id} isStreaming={n < data.length} />
      <div><Button size="sm" variant="secondary" onPress={() => setRun((r) => r + 1)}>Replay</Button></div>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Streaming table',
    slug: 'streaming-table',
    category: 'AI & Agent',
    description: 'A table whose rows arrive as the model produces them, each rising in once, with a shimmering progress line.',
  },
  demos: [
    {
      name: 'Rows stream in',
      code: `<StreamingTable caption="..." columns={columns} rows={rows} getKey={(r) => r.id} isStreaming={!done} />`,
      Component: Live,
    },
  ],
};

export default demo;
