import type { DemoModule } from '../../internal/demo';
import { customersScatter } from '../_data/datasets';
import { ChartCard } from '../ChartCard';
import { ScatterChart } from './ScatterChart';

const demo: DemoModule = {
  meta: {
    title: 'Scatter chart',
    slug: 'scatter-chart',
    category: 'Charts',
    description: 'Scatter and bubble charts with named points, optional size and group colouring.',
  },
  demos: [
    {
      name: 'Bubble: spend vs orders',
      code: `<ScatterChart data={customers} xKey="orders" yKey="spend" sizeKey="seats" nameKey="name"
  xLabel="Orders" yLabel="Spend ($K)" yFormat={(n) => '$' + n + 'K'} sizeLabel="Seats" />`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 620 }}>
          <ChartCard title="Customer value" value="12" unit="accounts">
            <ScatterChart
              data={customersScatter}
              xKey="orders"
              yKey="spend"
              sizeKey="seats"
              nameKey="name"
              xLabel="Orders"
              yLabel="Spend"
              yFormat={(n) => `$${n}K`}
              sizeLabel="Seats"
            />
          </ChartCard>
        </div>
      ),
    },
    {
      name: 'Grouped scatter',
      code: `<ScatterChart data={points} xKey="orders" yKey="spend" groupKey="tier" nameKey="name" />`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 620 }}>
          <ScatterChart
            data={customersScatter.map((c) => ({
              ...c,
              tier: c.seats > 100 ? 'Enterprise' : 'Team',
            }))}
            xKey="orders"
            yKey="spend"
            groupKey="tier"
            nameKey="name"
            xLabel="Orders"
            yLabel="Spend"
            yFormat={(n) => `$${n}K`}
            height={260}
          />
        </div>
      ),
    },
  ],
};
export default demo;
