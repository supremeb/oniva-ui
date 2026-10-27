import type { DemoModule } from '../../internal/demo';
import { MetricsDashboard } from './MetricsDashboard';

const demo: DemoModule = {
  meta: {
    title: 'Metrics dashboard',
    slug: 'metrics-dashboard',
    category: 'Blocks',
    description: 'Sales overview: KPI tabs pick the metric, one chart switches between a dotted line and bars, with top products and channels.',
  },
  demos: [
    { name: 'Default', code: `<MetricsDashboard />`, Component: () => <MetricsDashboard /> },
    { name: 'Orders, week', code: `<MetricsDashboard title="Orders" site="Harbor Goods" defaultMetric="orders" defaultRange="7d" />`, Component: () => <MetricsDashboard title="Orders" site="Harbor Goods" defaultMetric="orders" defaultRange="7d" /> },
  ],
};
export default demo;
