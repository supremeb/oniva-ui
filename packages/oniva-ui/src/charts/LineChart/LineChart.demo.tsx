import type { DemoModule } from '../../internal/demo';
import { tokenUsage } from '../_data/datasets';
import { ChartCard } from '../ChartCard';
import { ChartLegend } from '../ChartLegend';
import { LineChart } from './LineChart';

const box = { maxWidth: 560, width: '100%' } as const;
const tok = [
  { key: 'input', label: 'Input', tone: 6 },
  { key: 'output', label: 'Output', tone: 3 },
  { key: 'cached', label: 'Cached', tone: 1 },
];
const lg = (
  <ChartLegend
    items={[
      { label: 'Input', tone: 6 },
      { label: 'Output', tone: 3 },
      { label: 'Cached', tone: 1 },
    ]}
  />
);
const fmt = (n: number) => `${n.toFixed(1)}M`;

const demo: DemoModule = {
  meta: {
    title: 'Line chart',
    slug: 'line-chart',
    category: 'Charts',
    description:
      'Multi-series line chart with curve options, optional dots and shared hover tooltips.',
  },
  demos: [
    {
      name: 'Multi-series',
      code: `<LineChart data={tokenUsage} index="day" series={[{ key: 'input' }, { key: 'output' }, { key: 'cached' }]} valueFormat={(n) => n + 'M'} />`,
      Component: () => (
        <div style={box}>
          <ChartCard title="Token usage" value="21.4M" unit="this week" legend={lg}>
            <LineChart data={tokenUsage} index="day" series={tok} valueFormat={fmt} />
          </ChartCard>
        </div>
      ),
    },
    {
      name: 'Step curve, no dots',
      code: `<LineChart data={tokenUsage} index="day" curve="step" dots={false} series={…} />`,
      Component: () => (
        <div style={box}>
          <ChartCard title="Request volume" legend={lg}>
            <LineChart
              data={tokenUsage}
              index="day"
              series={tok.slice(0, 2)}
              curve="step"
              dots={false}
              valueFormat={fmt}
            />
          </ChartCard>
        </div>
      ),
    },
    {
      name: 'Linear, fixed domain',
      code: `<LineChart data={…} index="day" curve="linear" domain={[0, 3]} showGrid={false} series={…} />`,
      Component: () => (
        <div style={box}>
          <ChartCard title="Input tokens">
            <LineChart
              data={tokenUsage}
              index="day"
              series={[tok[0]!]}
              curve="linear"
              domain={[0, 3]}
              showGrid={false}
              valueFormat={fmt}
              height={200}
            />
          </ChartCard>
        </div>
      ),
    },
  ],
};
export default demo;
