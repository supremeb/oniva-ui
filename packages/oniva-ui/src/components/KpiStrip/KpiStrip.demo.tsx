import { useEffect, useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { KpiStrip, type KpiItem } from './KpiStrip';

const base: KpiItem[] = [
  { id: 'mrr', label: 'Monthly recurring revenue', value: 184230, format: { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }, delta: 0.124, spark: [120, 126, 131, 139, 142, 155, 160, 171, 184] },
  { id: 'users', label: 'Active workspaces', value: 2418, delta: 0.061, spark: [2100, 2150, 2190, 2240, 2290, 2330, 2380, 2418] },
  { id: 'churn', label: 'Logo churn', value: 0.021, format: { style: 'percent', maximumFractionDigits: 1 }, delta: -0.18, invertDelta: true, spark: [3.1, 2.9, 2.8, 2.6, 2.4, 2.3, 2.1] },
  { id: 'nps', label: 'NPS', value: 47, delta: -0.04, spark: [51, 50, 52, 49, 48, 49, 47] },
];

function Live() {
  const [mrr, setMrr] = useState(base[0]!.value);
  useEffect(() => {
    const t = setInterval(() => setMrr((v) => v + 1260), 3000);
    return () => clearInterval(t);
  }, []);
  const [last, setLast] = useState('none');
  return (
    <div>
      <KpiStrip items={[{ ...base[0]!, value: mrr }, ...base.slice(1)]} onDrilldown={setLast} />
      <p>Last drilldown: {last}</p>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'KPI strip',
    slug: 'kpi-strip',
    category: 'Data display',
    description: 'Row of headline metrics with rolling numbers, delta and sparkline. Optional drilldown makes each metric a button.',
  },
  demos: [
    {
      name: 'Revenue overview',
      code: `<KpiStrip
  items={[{ id: 'mrr', label: 'Monthly recurring revenue', value: 184230,
    format: { style: 'currency', currency: 'USD', maximumFractionDigits: 0 },
    delta: 0.124, spark: [120, 126, 131, 139] }]}
  onDrilldown={(id) => openReport(id)}
/>`,
      Component: Live,
    },
    { name: 'Static', code: `<KpiStrip items={items} />`, Component: () => <KpiStrip items={base} /> },
  ],
};

export default demo;
