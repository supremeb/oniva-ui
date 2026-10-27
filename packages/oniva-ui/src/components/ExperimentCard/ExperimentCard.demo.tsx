import type { DemoModule } from '../../internal/demo';
import { ExperimentCard, type ExperimentMetric, type ExperimentVariant } from './ExperimentCard';

const metrics: ExperimentMetric[] = [
  { id: 'conversion', label: 'Conversion', formatOptions: { minimumFractionDigits: 1, maximumFractionDigits: 1, style: 'unit', unit: 'percent' } },
  { id: 'revenue', label: 'Revenue', formatOptions: { style: 'currency', currency: 'USD' } },
  { id: 'bounce', label: 'Bounce', formatOptions: { maximumFractionDigits: 1, style: 'unit', unit: 'percent' }, lowerIsBetter: true },
];

const variants: ExperimentVariant[] = [
  { id: 'a', key: 'A', name: 'Start free trial', control: true, visitors: 4790, values: { conversion: 4.2, revenue: 18.4, bounce: 41.2 } },
  { id: 'b', key: 'B', name: 'Try it free', visitors: 4812, values: { conversion: 4.7, revenue: 19.1, bounce: 38.0 } },
  { id: 'c', key: 'C', name: 'Get started free', visitors: 4760, values: { conversion: 5.1, revenue: 21.6, bounce: 36.4 } },
];

const demo: DemoModule = {
  meta: {
    title: 'Experiment card',
    slug: 'experiment-card',
    category: 'Data display',
    description: 'A/B test in two lines that unfolds on hover: variants linked to a tiny chart, a metric switch and a winner pick.',
  },
  demos: [
    {
      name: 'Three variants',
      code: `<ExperimentCard
  title="Signup button copy"
  status={{ label: 'Running', tone: 'green' }}
  note="Day 9 of 14"
  metrics={metrics}
  variants={variants}
  action={{ label: (v) => \`Ship \${v.key}\`, onClick: (v) => ship(v.id) }}
/>`,
      Component: () => (
        <div style={{ minHeight: 420, width: '100%', maxWidth: 340 }}>
          <ExperimentCard
            title="Signup button copy"
            status={{ label: 'Running', tone: 'green' }}
            note="Day 9 of 14"
            metrics={metrics}
            variants={variants}
            defaultOpen
            defaultMetric="revenue"
            action={{ label: (v) => `Ship ${v.key}`, onClick: () => undefined }}
          />
        </div>
      ),
    },
    {
      name: 'Click, single metric',
      code: `<ExperimentCard title="Pricing page layout" trigger="click" defaultOpen variants={variants.slice(0, 2)} metrics={[metrics[1]]} />`,
      Component: () => (
        <div style={{ minHeight: 320, width: '100%', maxWidth: 340 }}>
          <ExperimentCard title="Pricing page layout" trigger="click" defaultOpen variants={variants.slice(0, 2)} metrics={[metrics[1]!]} status={{ label: 'Paused', tone: 'amber' }} />
        </div>
      ),
    },
  ],
};

export default demo;
