import type { DemoModule } from '../../internal/demo';
import { revenueByMonth, stepsByWeekday, tokenUsage, trafficSources } from '../_data/datasets';
import { ChartCard } from '../ChartCard';
import { ChartLegend } from '../ChartLegend';
import { BarChart } from './BarChart';

const box = { maxWidth: 560, width: '100%' } as const;
const rev = [
  { key: 'revenue', label: 'Revenue', tone: 1 },
  { key: 'expenses', label: 'Expenses', tone: 3 },
];
const tok = [
  { key: 'input', label: 'Input', tone: 6 },
  { key: 'cached', label: 'Cached', tone: 4 },
  { key: 'output', label: 'Output', tone: 5 },
];

const demo: DemoModule = {
  meta: {
    title: 'Bar chart',
    slug: 'bar-chart',
    category: 'Charts',
    description:
      'Rounded bars: vertical or horizontal, grouped, stacked or 100%, with optional background tracks.',
  },
  demos: [
    {
      name: 'Track bars (Steps)',
      code: `<BarChart data={stepsByWeekday} index="day" series={[{ key: 'steps', tone: 1 }]} track showGrid={false} showYAxis={false} />`,
      Component: () => (
        <div style={box}>
          <ChartCard
            title="Steps"
            value="47,860"
            unit="total steps"
            delta={{ label: '6.4%', trend: 'up' }}
          >
            <BarChart
              data={stepsByWeekday}
              index="day"
              series={[{ key: 'steps', label: 'Steps', tone: 1 }]}
              track
              showGrid={false}
              showYAxis={false}
              height={220}
            />
          </ChartCard>
        </div>
      ),
    },
    {
      name: 'Grouped',
      code: `<BarChart data={revenueByMonth.slice(-6)} index="month" valueFormat="currency" series={[…]} />`,
      Component: () => (
        <div style={box}>
          <ChartCard
            title="Revenue vs expenses"
            legend={
              <ChartLegend
                items={[
                  { label: 'Revenue', tone: 1 },
                  { label: 'Expenses', tone: 3 },
                ]}
              />
            }
          >
            <BarChart
              data={revenueByMonth.slice(-6)}
              index="month"
              series={rev}
              valueFormat="currency"
              barRadius={6}
            />
          </ChartCard>
        </div>
      ),
    },
    {
      name: 'Stacked',
      code: `<BarChart data={tokenUsage} index="day" layout="stacked" series={…} valueFormat={(n) => n + 'M'} />`,
      Component: () => (
        <div style={box}>
          <ChartCard
            title="Tokens per day"
            legend={
              <ChartLegend
                items={[
                  { label: 'Input', tone: 6 },
                  { label: 'Cached', tone: 4 },
                  { label: 'Output', tone: 5 },
                ]}
              />
            }
          >
            <BarChart
              data={tokenUsage}
              index="day"
              series={tok}
              layout="stacked"
              valueFormat={(n) => `${n.toFixed(1)}M`}
              barRadius={6}
            />
          </ChartCard>
        </div>
      ),
    },
    {
      name: 'Horizontal',
      code: `<BarChart orientation="horizontal" data={trafficSources} index="label" series={[{ key: 'value', tone: 6 }]} />`,
      Component: () => (
        <div style={box}>
          <ChartCard title="Sessions by source">
            <BarChart
              orientation="horizontal"
              data={trafficSources}
              index="label"
              series={[{ key: 'value', label: 'Sessions', tone: 6 }]}
              valueFormat="compact"
              height={240}
              barRadius={6}
            />
          </ChartCard>
        </div>
      ),
    },
    {
      name: 'Blocks + patterns',
      code: `<BarChart data={revenueByMonth} index="month" variant="blocks" series={…} />
<BarChart … fill="lines" glow />`,
      Component: () => (
        <div style={{ ...box, display: 'grid', gap: 16 }}>
          <ChartCard title='variant="blocks"' legend={<ChartLegend items={rev as never} />}>
            <BarChart
              data={revenueByMonth}
              index="month"
              series={rev.slice(0, 1)}
              variant="blocks"
              barRadius={4}
              valueFormat="currency"
              height={200}
            />
          </ChartCard>
          <ChartCard title='fill="lines" glow' legend={<ChartLegend items={rev as never} />}>
            <BarChart
              data={revenueByMonth}
              index="month"
              series={rev}
              fill="lines"
              glow
              valueFormat="currency"
              height={200}
            />
          </ChartCard>
          <ChartCard title='fill="gradient" stacked' legend={<ChartLegend items={rev as never} />}>
            <BarChart
              data={revenueByMonth}
              index="month"
              series={rev}
              layout="stacked"
              fill="gradient"
              valueFormat="currency"
              height={200}
            />
          </ChartCard>
        </div>
      ),
    },
  ],
};
export default demo;
