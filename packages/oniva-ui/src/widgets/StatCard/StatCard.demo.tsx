import { CreditCard, DollarSign, Users } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { StatCard } from './StatCard';

const grid = {
  display: 'grid',
  gap: 16,
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  width: '100%',
} as const;

const demo: DemoModule = {
  meta: {
    title: 'Stat card',
    slug: 'stat-card',
    category: 'Widgets',
    description: 'KPI card with headline value, delta chip and inline sparkline.',
  },
  demos: [
    {
      name: 'KPI row',
      code: `<StatCard
  label="Monthly revenue"
  value="$48,210"
  delta={8.2}
  deltaLabel="vs last month"
  icon={<DollarSign size={16} />}
  trend={[31, 34, 33, 38, 41, 40, 46, 48]}
/>`,
      Component: () => (
        <div style={grid}>
          <StatCard
            label="Monthly revenue"
            value="$48,210"
            delta={8.2}
            deltaLabel="vs last month"
            icon={<DollarSign size={16} />}
            trend={[31, 34, 33, 38, 41, 40, 46, 48]}
          />
          <StatCard
            label="Active customers"
            value="2,940"
            delta={-1.4}
            deltaLabel="vs last month"
            icon={<Users size={16} />}
            tone={5}
            trend={[29, 30, 31, 31, 30, 29, 30, 29]}
          />
          <StatCard
            label="Refund rate"
            value="1.8%"
            delta={-0.4}
            invertDelta
            deltaLabel="vs last month"
            icon={<CreditCard size={16} />}
            tone={3}
            trend={[24, 22, 23, 21, 20, 19, 19, 18]}
          />
        </div>
      ),
    },
    {
      name: 'Without trend',
      code: `<StatCard label="Open invoices" value="37" delta={0} />`,
      Component: () => (
        <div style={{ maxWidth: 300 }}>
          <StatCard label="Open invoices" value="37" delta={0} deltaLabel="no change" />
        </div>
      ),
    },
  ],
};

export default demo;
