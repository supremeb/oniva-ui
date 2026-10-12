import type { DemoModule } from '../../internal/demo';
import { PlanCard, type PlanStep } from './PlanCard';

const steps: PlanStep[] = [
  { id: '1', title: 'Pull Q3 subscription export from the warehouse', detail: 'warehouse.subscriptions, 214k rows, read-only' },
  { id: '2', title: 'Join with CRM account tiers', detail: 'Match on account_id; flag 312 unmatched rows' },
  { id: '3', title: 'Compute monthly cohort retention' },
  { id: '4', title: 'Draft a summary with the 3 biggest movers' },
];

const demo: DemoModule = {
  meta: {
    title: 'Plan card',
    slug: 'plan-card',
    category: 'AI & Agent',
    description: 'Proposed agent plan with inline edit and approve.',
  },
  demos: [
    {
      name: 'Data analyst plan',
      code: `<PlanCard steps={steps} onApprove={(s) => run(s)} />`,
      Component: () => <PlanCard title="Plan: Q3 retention analysis" steps={steps} />,
    },
  ],
};

export default demo;
