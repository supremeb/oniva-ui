import type { DemoModule } from '../../internal/demo';
import { uptimeHistory } from '../_data/datasets';
import { ChartCard } from '../ChartCard';
import { Tracker } from './Tracker';

const demo: DemoModule = {
  meta: {
    title: 'Tracker',
    slug: 'tracker',
    category: 'Charts',
    description:
      'Row of status cells for uptime and habit history. Cells are focusable and show a tooltip.',
  },
  demos: [
    {
      name: 'API uptime, 60 days',
      code: `<Tracker items={days.map((d) => ({ label: d.label, status: d.status }))} />`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 640 }}>
          <ChartCard
            title="API uptime"
            value="99.94%"
            unit="last 60 days"
            delta={{ label: '0.02%', trend: 'up' }}
          >
            <div style={{ paddingTop: 20 }}>
              <Tracker items={uptimeHistory} />
            </div>
          </ChartCard>
        </div>
      ),
    },
    {
      name: 'Habit streak',
      code: `<Tracker items={[{ label: 'Mon', status: 'up' }, { label: 'Tue', status: 'none' }, …]} />`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 360, paddingTop: 20 }}>
          <Tracker
            items={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => ({
              label: d,
              status: [0, 2, 5].includes(i) ? 'none' : 'up',
              tone: [0, 2, 5].includes(i) ? undefined : 2,
            }))}
          />
        </div>
      ),
    },
  ],
};
export default demo;
