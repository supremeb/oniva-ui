import type { DemoModule } from '../../internal/demo';
import { AgentInbox, type InboxTask } from './AgentInbox';

const t0 = Date.now();
const tasks: InboxTask[] = [
  {
    id: 'migrate',
    title: 'Migrate users table',
    description: 'Split users into accounts and profiles. The dry run on staging passed.',
    agent: 'Atlas 2',
    status: 'waiting',
    startedAt: t0 - 6 * 60_000,
    tools: 14,
    sources: 9,
    steps: [
      { label: 'Read schema and 14 migrations', time: '6m ago' },
      { label: 'Wrote migration 0042_split_users', time: '4m ago' },
      { label: 'Dry run on staging, no errors', time: '2m ago' },
      { label: 'Wants to run it on production', time: '1m ago' },
    ],
  },
  { id: 'invoices', title: 'Sync invoices', description: 'The warehouse API returned 429 three times in a row.', agent: 'Lumen Fast', status: 'failed', elapsed: 31_000, tools: 6, sources: 4, steps: [{ label: 'Fetched 480 invoices' }, { label: 'Rate limited while pushing batch 3' }] },
  { id: 'review', title: 'Review PR #482', description: 'Billing webhooks: reading the diff and the test run, writing review comments.', agent: 'Quill Reasoner', status: 'running', startedAt: t0 - 223_000, tools: 21, sources: 12 },
  { id: 'notes', title: 'Release notes v2.4', description: 'Grouping 23 merged pull requests into features and fixes.', agent: 'Nova Pro', status: 'running', startedAt: t0 - 80_000, tools: 5, sources: 23 },
  { id: 'digest', title: 'Weekly metrics digest', description: 'Pulled numbers from three dashboards and posted the summary to the team channel.', agent: 'Lumen Fast', status: 'done', elapsed: 252_000, tools: 8, sources: 3 },
];

const demo: DemoModule = {
  meta: {
    title: 'Agent inbox',
    slug: 'agent-inbox',
    category: 'AI & Agent',
    description: 'Background agent tasks grouped into Needs you, Running and Done with live clocks and next actions.',
  },
  demos: [
    {
      name: 'Board',
      code: `<AgentInbox tasks={tasks} defaultOpen={['migrate']} />`,
      Component: () => <AgentInbox tasks={tasks} defaultOpen={['migrate']} />,
    },
    {
      name: 'List view',
      code: `<AgentInbox tasks={tasks} defaultView="list" title="Background runs" onOpen={(t) => open(t.id)} />`,
      Component: () => <AgentInbox tasks={tasks} defaultView="list" title="Background runs" onOpen={() => {}} />,
    },
  ],
};

export default demo;
