import type { DemoModule } from '../../internal/demo';
import { DecisionInbox, type Decision } from './DecisionInbox';

const decisions: Decision[] = [
  {
    id: 'rollout',
    title: 'Roll out the new onboarding to everyone?',
    detail: 'Test won with +8% activation · 2 weeks of data',
    primary: 'Roll out',
    secondary: 'Keep testing',
  },
  {
    id: 'renewal',
    title: 'Renew the design tools plan?',
    detail: '12 seats · $1,800 per year · renews in 5 days',
    primary: 'Renew',
    secondary: 'Change seats',
  },
];

const demo: DemoModule = {
  meta: {
    title: 'Decision inbox',
    slug: 'decision-inbox',
    category: 'AI & Agent',
    description: 'Open decisions with two quick answers each. Answered ones confirm and fold away.',
  },
  demos: [
    {
      name: 'Three decisions',
      code: `<DecisionInbox
  decisions={[
    { id: 'renewal', title: 'Renew the design tools plan?', detail: '12 seats · $1,800 per year', primary: 'Renew', secondary: 'Change seats' },
    { id: 'refund', title: 'Approve a $240 refund?', primary: 'Approve', secondary: 'Decline', collapsed: true },
  ]}
  onDecide={(d, answer) => save(d.id, answer)}
/>`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 440 }}>
          <DecisionInbox decisions={decisions} />
        </div>
      ),
    },
  ],
};

export default demo;
