import type { DemoModule } from '../../internal/demo';
import { ChangeSummary } from './ChangeSummary';

const wrap = { maxWidth: 480, width: '100%' } as const;

const demo: DemoModule = {
  meta: {
    title: 'Change summary',
    slug: 'change-summary',
    category: 'Widgets',
    description:
      'What moved since last time: one metric per row with a coloured trend, read as a description list. Rows fade in one after another.',
  },
  demos: [
    {
      name: 'Weekly recap',
      code: `<ChangeSummary
  period="This week"
  changes={[
    { label: 'Active users', change: 'Up 6.1% to 18.2K', tone: 'good' },
    { label: 'Churn', change: 'Down to 2.1% from 2.6%', tone: 'good', direction: 'down' },
    { label: 'Support tickets', change: 'Up 14% to 312', tone: 'bad' },
  ]}
/>`,
      Component: () => (
        <div style={wrap}>
          <ChangeSummary
            period="This week"
            changes={[
              { label: 'Active users', change: 'Up 6.1% to 18.2K', tone: 'good' },
              { label: 'Activation', change: 'Climbed to 41%, up 3 pts', tone: 'good' },
              { label: 'Churn', change: 'Down to 2.1% from 2.6%', tone: 'good', direction: 'down' },
              { label: 'Support tickets', change: 'Up 14% to 312', tone: 'bad', direction: 'up' },
            ]}
          />
        </div>
      ),
    },
    {
      name: 'Custom title',
      code: `<ChangeSummary title="Since last deploy" period="2h ago" changes={[…]} />`,
      Component: () => (
        <div style={wrap}>
          <ChangeSummary
            title="Since last deploy"
            period="2h ago"
            changes={[
              { label: 'p95 latency', change: 'Down 38 ms to 212 ms', tone: 'good', direction: 'down' },
              { label: 'Error rate', change: 'Up 0.2 pts to 0.9%', tone: 'bad', direction: 'up' },
            ]}
          />
        </div>
      ),
    },
  ],
};
export default demo;
