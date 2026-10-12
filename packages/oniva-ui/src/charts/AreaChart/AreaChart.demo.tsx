import type { DemoModule } from '../../internal/demo';
import { revenueByMonth, tokenUsage } from '../_data/datasets';
import { ChartCard } from '../ChartCard';
import { ChartLegend } from '../ChartLegend';
import { AreaChart } from './AreaChart';

const box = { maxWidth: 560, width: '100%' } as const;
const rev = [
  { key: 'revenue', label: 'Revenue', tone: 1 },
  { key: 'expenses', label: 'Expenses', tone: 5 },
];
const tok = [
  { key: 'input', label: 'Input', tone: 1 },
  { key: 'cached', label: 'Cached', tone: 4 },
  { key: 'output', label: 'Output', tone: 5 },
];
const legend = (s: { label: string; tone: number }[]) => <ChartLegend items={s} />;

const demo: DemoModule = {
  meta: {
    title: 'Area chart',
    slug: 'area-chart',
    category: 'Charts',
    description:
      'Gradient-filled area chart with multi-series, stacked and 100% modes, hover columns and keyboard-focusable tooltips.',
  },
  demos: [
    {
      name: 'Gradient, two series',
      code: `<AreaChart data={revenueByMonth} index="month" valueFormat="currency"
  series={[{ key: 'revenue', label: 'Revenue', tone: 1 }, { key: 'expenses', label: 'Expenses', tone: 5 }]} />`,
      Component: () => (
        <div style={box}>
          <ChartCard
            title="Revenue vs expenses"
            value="$753,300"
            unit="this year"
            delta={{ label: '18.2%', trend: 'up' }}
            legend={legend(rev as never)}
          >
            <AreaChart data={revenueByMonth} index="month" series={rev} valueFormat="currency" />
          </ChartCard>
        </div>
      ),
    },
    {
      name: 'Stacked',
      code: `<AreaChart data={tokenUsage} index="day" stacked valueFormat={(n) => n + 'M'} series={…} />`,
      Component: () => (
        <div style={box}>
          <ChartCard
            title="Token usage"
            value="21.4M"
            unit="tokens this week"
            legend={legend(tok as never)}
          >
            <AreaChart
              data={tokenUsage}
              index="day"
              series={tok}
              stacked
              valueFormat={(n) => `${n.toFixed(1)}M`}
            />
          </ChartCard>
        </div>
      ),
    },
    {
      name: '100% stacked',
      code: `<AreaChart data={tokenUsage} index="day" stacked="percent" series={…} curve="linear" />`,
      Component: () => (
        <div style={box}>
          <ChartCard title="Token mix" legend={legend(tok as never)}>
            <AreaChart
              data={tokenUsage}
              index="day"
              series={tok}
              stacked="percent"
              curve="linear"
              valueFormat={(n) => `${n.toFixed(2)}M`}
            />
          </ChartCard>
        </div>
      ),
    },
    {
      name: 'Pattern fills + glow',
      code: `<AreaChart data={revenueByMonth} index="month" fill="dots" glow valueFormat="currency" series={…} />
// fill: 'solid' | 'gradient' | 'dots' | 'lines' | 'grid'`,
      Component: () => (
        <div style={{ ...box, display: 'grid', gap: 16 }}>
          {(['dots', 'lines', 'grid'] as const).map((fill) => (
            <ChartCard key={fill} title={`fill="${fill}"`} legend={legend(rev as never)}>
              <AreaChart
                data={revenueByMonth}
                index="month"
                series={rev}
                fill={fill}
                glow={fill === 'dots'}
                valueFormat="currency"
                height={180}
              />
            </ChartCard>
          ))}
        </div>
      ),
    },
  ],
};
export default demo;
