import type { DemoModule } from '../../internal/demo';
import { sleepStages, trafficSources } from '../_data/datasets';
import { ChartCard } from '../ChartCard';
import { ChartLegend } from '../ChartLegend';
import { DonutChart, PieChart } from './DonutChart';

const dur = (m: number) => `${Math.floor(m / 60)}h ${m % 60}m`;
const row = {
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap',
  gap: 24,
  justifyContent: 'space-around',
} as const;

const demo: DemoModule = {
  meta: {
    title: 'DonutChart',
    slug: 'donut-chart',
    category: 'Charts',
    description:
      'Donut and pie charts with rounded slices, centre label, and focusable slices with tooltips.',
  },
  demos: [
    {
      name: 'Sleep stages',
      code: `<DonutChart data={sleepStages} valueFormat={(m) => \`\${Math.floor(m / 60)}h \${m % 60}m\`} centerLabel="Time asleep" />`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <ChartCard
            title="Sleep stages"
            value="7h 20m"
            unit="last night"
            legend={
              <ChartLegend
                shape="round"
                items={sleepStages.map((s) => ({
                  label: s.label,
                  tone: s.tone,
                  value: dur(s.value),
                }))}
              />
            }
          >
            <div style={{ display: 'flex', justifyContent: 'center', padding: 8 }}>
              <DonutChart
                data={sleepStages}
                valueFormat={dur}
                centerValue="7h 20m"
                centerLabel="Total"
                size={200}
              />
            </div>
          </ChartCard>
        </div>
      ),
    },
    {
      name: 'Donut and pie',
      code: `<DonutChart data={trafficSources.map(…)} valueFormat="compact" centerLabel="Sessions" />
<PieChart data={…} />`,
      Component: () => {
        const data = trafficSources.map((d, i) => ({
          label: d.label,
          value: d.value,
          tone: [1, 4, 5, 3, 8][i],
        }));
        return (
          <div style={row}>
            <DonutChart data={data} valueFormat="compact" centerLabel="Sessions" />
            <PieChart data={data} valueFormat="compact" size={180} />
          </div>
        );
      },
    },
  ],
};
export default demo;
