import type { DemoModule } from '../../internal/demo';
import { ChartCard } from '../ChartCard';
import { ChartLegend } from '../ChartLegend';
import { RadialChart } from './RadialChart';

const items = [
  { label: 'Duration', value: 49, max: 50, tone: 5 },
  { label: 'Bedtime', value: 29, max: 30, tone: 3 },
  { label: 'Interruptions', value: 20, max: 20, tone: 6 },
];

const demo: DemoModule = {
  meta: {
    title: 'RadialChart',
    slug: 'radial-chart',
    category: 'Charts',
    description: 'Concentric radial bars with background tracks, each against its own maximum.',
  },
  demos: [
    {
      name: 'Sleep score',
      code: `<RadialChart items={[
  { label: 'Duration', value: 49, max: 50, tone: 5 },
  { label: 'Bedtime', value: 29, max: 30, tone: 3 },
  { label: 'Interruptions', value: 20, max: 20, tone: 6 },
]} centerValue="98" centerLabel="Excellent" />`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 380 }}>
          <ChartCard
            title="Sleep score"
            value="Excellent"
            legend={
              <ChartLegend
                orientation="vertical"
                items={items.map((i) => ({
                  label: i.label,
                  tone: i.tone,
                  value: `${i.value}/${i.max}`,
                }))}
              />
            }
          >
            <div style={{ display: 'flex', justifyContent: 'center', padding: 8 }}>
              <RadialChart items={items} centerValue="98" centerLabel="of 100" />
            </div>
          </ChartCard>
        </div>
      ),
    },
    {
      name: 'Full circle',
      code: `<RadialChart sweep={340} thickness={10} items={…} />`,
      Component: () => (
        <RadialChart
          sweep={340}
          thickness={10}
          size={180}
          items={[
            { label: 'Storage', value: 72, tone: 4 },
            { label: 'Memory', value: 48, tone: 2 },
            { label: 'CPU', value: 31, tone: 8 },
          ]}
          centerValue="72%"
          centerLabel="Storage"
        />
      ),
    },
  ],
};
export default demo;
