import type { DemoModule } from '../../internal/demo';
import { revenueByMonth } from '../_data/datasets';
import { ChartCard } from '../ChartCard';
import { ChartLegend } from '../ChartLegend';
import { ComboChart } from './ComboChart';

const data = revenueByMonth.map((d) => ({
  ...d,
  margin: Math.round(((d.revenue - d.expenses) / d.revenue) * 100),
}));

const demo: DemoModule = {
  meta: {
    title: 'ComboChart',
    slug: 'combo-chart',
    category: 'Charts',
    description: 'Bars plus lines with an optional second value axis on the right.',
  },
  demos: [
    {
      name: 'Revenue and margin (dual axis)',
      code: `<ComboChart data={data} index="month"
  bars={[{ key: 'revenue', label: 'Revenue', tone: 6 }]}
  lines={[{ key: 'margin', label: 'Margin', tone: 3 }]}
  barFormat="currency" lineFormat="percent" />`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 600 }}>
          <ChartCard
            title="Revenue and margin"
            value="$753,300"
            unit="12 months"
            delta={{ label: '4.2 pts margin', trend: 'up' }}
            legend={
              <ChartLegend
                items={[
                  { label: 'Revenue', tone: 6 },
                  { label: 'Margin %', tone: 3 },
                ]}
              />
            }
          >
            <ComboChart
              data={data}
              index="month"
              bars={[{ key: 'revenue', label: 'Revenue', tone: 6 }]}
              lines={[{ key: 'margin', label: 'Margin', tone: 3 }]}
            />
          </ChartCard>
        </div>
      ),
    },
    {
      name: 'Two bars, one axis',
      code: `<ComboChart dualAxis={false} bars={[revenue, expenses]} lines={[{ key: 'net' }]} lineFormat="currency" />`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 600 }}>
          <ChartCard
            title="Revenue, expenses and net"
            legend={
              <ChartLegend
                items={[
                  { label: 'Revenue', tone: 1 },
                  { label: 'Expenses', tone: 8 },
                  { label: 'Net', tone: 5 },
                ]}
              />
            }
          >
            <ComboChart
              data={revenueByMonth.slice(-6).map((d) => ({ ...d, net: d.revenue - d.expenses }))}
              index="month"
              bars={[
                { key: 'revenue', label: 'Revenue', tone: 1 },
                { key: 'expenses', label: 'Expenses', tone: 8 },
              ]}
              lines={[{ key: 'net', label: 'Net', tone: 5 }]}
              dualAxis={false}
              lineFormat="currency"
            />
          </ChartCard>
        </div>
      ),
    },
  ],
};
export default demo;
