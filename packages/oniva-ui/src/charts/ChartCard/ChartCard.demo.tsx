import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { stepsByWeekday, revenueByMonth } from '../_data/datasets';
import { AreaChart } from '../AreaChart';
import { BarChart } from '../BarChart';
import { ChartLegend } from '../ChartLegend';
import { ChartCard, ChartPeriodSwitcher, ChartRangeToggle } from './ChartCard';

const box = { maxWidth: 520, width: '100%' } as const;
const weeks = ['22 Jun – 28 Jun', '29 Jun – 5 Jul', '6 Jul – 12 Jul'];

function Steps() {
  const [w, setW] = useState(1);
  const total = stepsByWeekday.reduce((s, d) => s + d.steps, 0);
  return (
    <div style={box}>
      <ChartCard
        title="Steps"
        value={total.toLocaleString('en-US')}
        unit="total steps"
        actions={
          <ChartPeriodSwitcher
            label={weeks[w]!}
            previousDisabled={w === 0}
            nextDisabled={w === weeks.length - 1}
            onPrevious={() => setW(w - 1)}
            onNext={() => setW(w + 1)}
          />
        }
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
  );
}

function Revenue() {
  const [range, setRange] = useState('yearly');
  const data = range === 'yearly' ? revenueByMonth : revenueByMonth.slice(-6);
  return (
    <div style={box}>
      <ChartCard
        title="Revenue"
        value="$88,400"
        unit="December"
        delta={{ label: '10.8%', trend: 'up' }}
        actions={
          <ChartRangeToggle
            value={range}
            onChange={setRange}
            options={[
              { id: 'half', label: '6M' },
              { id: 'yearly', label: '12M' },
            ]}
          />
        }
        legend={
          <ChartLegend
            items={[
              { label: 'Revenue', tone: 1 },
              { label: 'Expenses', tone: 5 },
            ]}
          />
        }
      >
        <AreaChart
          data={data}
          index="month"
          series={[
            { key: 'revenue', label: 'Revenue', tone: 1 },
            { key: 'expenses', label: 'Expenses', tone: 5 },
          ]}
          valueFormat="currency"
          height={240}
        />
      </ChartCard>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'ChartCard',
    slug: 'chart-card',
    category: 'Charts',
    description:
      'Gray card shell for charts: title, big value with delta chip, header actions, white plot tile and legend.',
  },
  demos: [
    {
      name: 'Steps with period switcher',
      code: `<ChartCard
  title="Steps" value="47,870" unit="total steps"
  actions={<ChartPeriodSwitcher label="29 Jun – 5 Jul" onPrevious={…} onNext={…} />}
>
  <BarChart data={steps} index="day" series={[{ key: 'steps', tone: 1 }]} track showGrid={false} showYAxis={false} />
</ChartCard>`,
      Component: Steps,
    },
    {
      name: 'Revenue with delta and range toggle',
      code: `<ChartCard
  title="Revenue" value="$88,400" unit="December"
  delta={{ label: '10.8%', trend: 'up' }}
  actions={<ChartRangeToggle value={range} onChange={setRange} options={[{ id: 'half', label: '6M' }, { id: 'yearly', label: '12M' }]} />}
  legend={<ChartLegend items={[{ label: 'Revenue', tone: 1 }, { label: 'Expenses', tone: 5 }]} />}
>
  <AreaChart data={data} index="month" series={series} valueFormat="currency" />
</ChartCard>`,
      Component: Revenue,
    },
  ],
};
export default demo;
