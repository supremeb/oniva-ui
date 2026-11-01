import { TaskList } from 'oniva-ui';
import type { TaskItem } from 'oniva-ui';
import type { StateModule } from '../types';

const plan: TaskItem[] = [
  { id: '1', label: 'Load q3_revenue.csv', status: 'done' },
  { id: '2', label: 'Group deals by segment', status: 'done' },
  { id: '3', label: 'Compare against Q2 and plan', status: 'running' },
  { id: '4', label: 'Search for industry benchmarks', status: 'pending' },
  { id: '5', label: 'Write the summary', status: 'pending' },
];

const longPath = 'packages/northwind-ledger/src/reports/quarterly/revenue-by-segment/exponential-smoothing-forecast.worker.ts';
const longUrl = 'https://reports.northwind-labs.example/exports/2026/q3/revenue-by-segment/enterprise-emea-renewals-with-expansion-and-churn-adjustments.csv?download=1';

const many: TaskItem[] = [
  'Load q3_revenue.csv',
  'Validate currency columns against the ledger',
  'Group deals by segment',
  'Join renewals with the CRM export',
  'Compute net revenue retention per cohort',
  'Compare against Q2 and plan',
  'Flag segments below 90% of plan',
  'Search for industry benchmarks',
  'Draft the variance explanation',
  'Build the segment chart',
  'Write the summary',
  'Queue the review with Finance',
].map((label, i): TaskItem => ({ id: `m${i}`, label, status: i < 5 ? 'done' : i === 5 ? 'running' : 'pending' }));

const mod: StateModule = {
  slug: 'task-list',
  title: 'Task list',
  width: 420,
  groups: [
    {
      label: 'Run',
      states: [
        { id: 'empty', label: 'empty', render: () => <TaskList items={[]} /> },
        { id: 'single-pending', label: 'one pending', render: () => <TaskList items={[plan[3]!]} /> },
        { id: 'single-running', label: 'one running', render: () => <TaskList items={[plan[2]!]} /> },
        { id: 'single-done', label: 'one done', render: () => <TaskList items={[plan[0]!]} /> },
        { id: 'mid-run', label: 'mid-run (done, running, pending)', render: () => <TaskList items={plan} /> },
        { id: 'all-pending', label: 'all pending', render: () => <TaskList items={plan.map((p) => ({ ...p, status: 'pending' as const }))} /> },
        { id: 'all-done', label: 'all done', render: () => <TaskList items={plan.map((p) => ({ ...p, status: 'done' as const }))} /> },
        {
          id: 'parallel-running',
          label: 'two running at once',
          render: () => (
            <TaskList
              items={[
                { id: '1', label: 'Load q3_revenue.csv', status: 'done' },
                { id: '2', label: 'Group deals by segment', status: 'running' },
                { id: '3', label: 'Search for industry benchmarks', status: 'running' },
                { id: '4', label: 'Write the summary', status: 'pending' },
              ]}
            />
          ),
        },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'long-labels',
          label: 'long labels wrap',
          render: () => (
            <TaskList
              items={[
                { id: '1', label: 'Reconcile every invoice in the Northwind Labs ledger against the payment processor export for the quarter', status: 'done' },
                { id: '2', label: 'Compare the enterprise and mid-market segments against plan, then explain each variance larger than five percent', status: 'running' },
                { id: '3', label: 'Draft the executive summary and attach the supporting charts for the finance review', status: 'pending' },
              ]}
            />
          ),
        },
        {
          id: 'unbroken',
          label: 'unbroken path and URL',
          render: () => (
            <TaskList
              items={[
                { id: '1', label: longPath, status: 'done' },
                { id: '2', label: longUrl, status: 'running' },
                { id: '3', label: 'northwindledgerquarterlyrevenuebysegmentexponentialsmoothingforecastworkerhandler', status: 'pending' },
              ]}
            />
          ),
        },
        {
          id: 'many',
          label: 'twelve steps',
          render: () => <TaskList items={many} />,
        },
      ],
    },
  ],
  missing: [
    'Failed / skipped step status (TaskStatus is only done | running | pending)',
    'Nested sub-steps or per-step detail',
  ],
};
export default mod;
