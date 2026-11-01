import { AgentProgress } from 'oniva-ui';
import type { TaskItem } from 'oniva-ui';
import type { StateModule } from '../types';

const plan: TaskItem[] = [
  { id: '1', label: 'Load q3_revenue.csv', status: 'done' },
  { id: '2', label: 'Group deals by segment', status: 'done' },
  { id: '3', label: 'Compare against Q2 and plan', status: 'running' },
  { id: '4', label: 'Search for industry benchmarks', status: 'pending' },
  { id: '5', label: 'Write the summary', status: 'pending' },
];

const withStatus = (items: TaskItem[], status: TaskItem['status']): TaskItem[] =>
  items.map((i) => ({ ...i, status }));

const longPlan: TaskItem[] = [
  { id: 'l1', label: 'Read packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts', status: 'done' },
  { id: 'l2', label: 'Fetch https://status.northwind.example/api/v2/incidents/2026-10-14/timeline?include=updates,components,postmortem', status: 'running' },
  { id: 'l3', label: 'Reconcile the retry budget against the regional failover policy and write up every deviation with a suggested owner', status: 'pending' },
];

const manyPlan: TaskItem[] = Array.from({ length: 18 }, (_, i) => ({
  id: `m${i}`,
  label: [
    'Load q3_revenue.csv',
    'Validate column types',
    'Drop duplicate invoice rows',
    'Group deals by segment',
    'Compute net revenue retention',
    'Compare against Q2 and plan',
    'Search for industry benchmarks',
    'Rank accounts by expansion',
    'Flag churn-risk accounts',
  ][i % 9] + (i >= 9 ? ' (EMEA)' : ''),
  status: i < 11 ? 'done' : i === 11 ? 'running' : 'pending',
}));

const mod: StateModule = {
  slug: 'agent-progress',
  title: 'Agent progress',
  width: 420,
  groups: [
    {
      label: 'Run',
      states: [
        { id: 'in-progress', label: 'in progress', render: () => <AgentProgress items={plan} /> },
        { id: 'just-started', label: 'just started (first step running)', render: () => <AgentProgress items={plan.map((p, i) => ({ ...p, status: i === 0 ? 'running' : 'pending' }))} /> },
        { id: 'all-pending', label: 'all pending, none running', render: () => <AgentProgress items={withStatus(plan, 'pending')} /> },
        { id: 'one-step-left', label: 'one step left', render: () => <AgentProgress items={plan.map((p, i) => ({ ...p, status: i < 4 ? 'done' : 'running' }))} /> },
        { id: 'complete', label: 'complete', render: () => <AgentProgress items={withStatus(plan, 'done')} /> },
        { id: 'single-step', label: 'single step, running', render: () => <AgentProgress items={plan.slice(2, 3)} /> },
        { id: 'empty', label: 'empty (no steps)', render: () => <AgentProgress items={[]} /> },
      ],
    },
    {
      label: 'Disclosure',
      states: [
        { id: 'collapsed', label: 'collapsed', render: () => <AgentProgress items={plan} defaultExpanded={false} /> },
        { id: 'collapsed-complete', label: 'collapsed, complete', render: () => <AgentProgress items={withStatus(plan, 'done')} defaultExpanded={false} /> },
        { id: 'disabled', label: 'disabled', render: () => <AgentProgress items={plan} isDisabled /> },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'custom-title', label: 'custom title', render: () => <AgentProgress items={plan} title="Quarterly revenue review" /> },
        { id: 'long-title', label: 'long title', render: () => <AgentProgress items={plan} title="Reconcile the regional failover retry budget against the Northwind Labs incident postmortem" /> },
        { id: 'long-labels', label: 'long labels and unbroken paths', render: () => <AgentProgress items={longPlan} /> },
        { id: 'many-steps', label: 'many steps (18)', render: () => <AgentProgress items={manyPlan} /> },
      ],
    },
  ],
  missing: [
    'Failed / error step: TaskStatus only has done, running and pending',
    'Cancelled or paused plan: no status for it',
  ],
};

export default mod;
