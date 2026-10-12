import type { DemoModule } from '../../internal/demo';
import { funnelSteps } from '../_data/datasets';
import { ChartCard } from '../ChartCard';
import { FunnelChart } from './FunnelChart';

const demo: DemoModule = {
  meta: {
    title: 'FunnelChart',
    slug: 'funnel-chart',
    category: 'Charts',
    description:
      'Conversion funnel with drop-off ribbons and percentages relative to the first step.',
  },
  demos: [
    {
      name: 'Signup to paid',
      code: `<FunnelChart steps={[
  { label: 'Visitors', value: 48200 },
  { label: 'Signups', value: 12640 },
  { label: 'Activated', value: 7310 },
  { label: 'Trial started', value: 3920 },
  { label: 'Paid', value: 1480 },
]} />`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 640 }}>
          <ChartCard
            title="Conversion funnel"
            value="3.1%"
            unit="visitor to paid"
            delta={{ label: '0.4 pts', trend: 'up' }}
          >
            <FunnelChart steps={funnelSteps} />
          </ChartCard>
        </div>
      ),
    },
    {
      name: 'Teal, compact',
      code: `<FunnelChart tone={1} height={200} steps={funnelSteps.slice(0, 4)} />`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 520 }}>
          <FunnelChart tone={1} height={200} steps={funnelSteps.slice(0, 4)} />
        </div>
      ),
    },
  ],
};
export default demo;
