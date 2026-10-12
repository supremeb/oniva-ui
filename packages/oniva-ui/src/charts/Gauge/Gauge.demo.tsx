import type { DemoModule } from '../../internal/demo';
import { ChartCard } from '../ChartCard';
import { Gauge, Speedometer } from './Gauge';

const demo: DemoModule = {
  meta: {
    title: 'Gauge',
    slug: 'gauge',
    category: 'Charts',
    description: 'Half-circle gauge and a 240° speedometer dial with zones, ticks and needle.',
  },
  demos: [
    {
      name: 'Gauge',
      code: `<Gauge value={72} caption="Budget used" tone={6} />`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 340 }}>
          <ChartCard title="Monthly budget" value="$7,200" unit="of $10,000">
            <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
              <Gauge value={72} caption="Budget used" tone={6} valueFormat="percent" />
            </div>
          </ChartCard>
        </div>
      ),
    },
    {
      name: 'Speedometer',
      code: `<Speedometer value={64} zones={[{ to: 40, tone: 3, label: 'Low' }, { to: 70, tone: 8, label: 'Fair' }, { to: 100, tone: 7, label: 'Good' }]} />`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 340 }}>
          <ChartCard title="Health score" value="Fair">
            <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
              <Speedometer value={64} />
            </div>
          </ChartCard>
        </div>
      ),
    },
  ],
};
export default demo;
