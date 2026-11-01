import { AgentInbox } from 'oniva-ui';
import type { InboxTask } from 'oniva-ui';
import type { StateModule } from '../types';

const NOW = 1_800_000_000_000;
const min = 60_000;

const waiting: InboxTask = {
  id: 'migrate',
  title: 'Migrate users table',
  description: 'Split users into accounts and profiles. The dry run on staging passed.',
  agent: 'Atlas 2',
  status: 'waiting',
  startedAt: NOW - 6 * min,
  tools: 14,
  sources: 9,
  steps: [
    { label: 'Read schema and 14 migrations', time: '6m ago' },
    { label: 'Wrote migration 0042_split_users', time: '4m ago' },
    { label: 'Dry run on staging, no errors', time: '2m ago' },
    { label: 'Wants to run it on production', time: '1m ago' },
  ],
};
const failed: InboxTask = {
  id: 'invoices',
  title: 'Sync invoices',
  description: 'The warehouse API returned 429 three times in a row.',
  agent: 'Lumen Fast',
  status: 'failed',
  elapsed: 31_000,
  tools: 6,
  sources: 4,
  steps: [{ label: 'Fetched 480 invoices', time: '9m ago' }, { label: 'Rate limited while pushing batch 3', time: '8m ago' }],
};
const running: InboxTask = {
  id: 'review',
  title: 'Review PR #482',
  description: 'Billing webhooks: reading the diff and the test run, writing review comments.',
  agent: 'Quill Reasoner',
  status: 'running',
  startedAt: NOW - 223_000,
  tools: 21,
  sources: 12,
  steps: [{ label: 'Fetched diff, 18 files', time: '3m ago' }, { label: 'Running the billing test suite', time: 'now' }],
};
const running2: InboxTask = {
  id: 'notes',
  title: 'Release notes v2.4',
  description: 'Grouping 23 merged pull requests into features and fixes.',
  agent: 'Nova Pro',
  status: 'running',
  startedAt: NOW - 80_000,
  tools: 5,
  sources: 23,
};
const done: InboxTask = {
  id: 'digest',
  title: 'Weekly metrics digest',
  description: 'Pulled numbers from three dashboards and posted the summary to the team channel.',
  agent: 'Lumen Fast',
  status: 'done',
  elapsed: 252_000,
  tools: 8,
  sources: 3,
  steps: [{ label: 'Pulled 3 dashboards' }, { label: 'Posted summary to #northwind-weekly' }],
};
const typical = [waiting, failed, running, running2, done];

const longTitle: InboxTask = {
  id: 'long',
  title: 'Reconcile the quarterly ledger exports against every regional billing system and flag mismatches',
  description:
    'Compared 18,420 ledger lines across the northwind-eu, northwind-apac and northwind-latam billing systems and found 312 mismatches that need a human decision before the books can close for the quarter, including a batch of refunds issued twice.',
  agent: 'Atlas 2',
  status: 'waiting',
  startedAt: NOW - 42 * min,
  tools: 128,
  sources: 1204,
  steps: [
    { label: 'Exported /exports/2026/q3/northwind-eu/ledger-lines-2026-09-30T23-59-59Z-final.csv', time: '41m ago' },
    { label: 'Matched 18,108 lines automatically', time: '12m ago' },
  ],
};
const longUnbroken: InboxTask = {
  id: 'path',
  title: 'packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts',
  description: 'https://staging.northwind.example/api/v2/accounts/9f3a1c2e-77aa-4b1e-9c11-5d2f0a8b44e1/profiles/migrations/0042_split_users/dry-run/results',
  agent: 'Quill Reasoner',
  status: 'running',
  startedAt: NOW - 95_000,
  tools: 3,
  sources: 2,
};
const bare: InboxTask = { id: 'bare', title: 'Archive old drafts', agent: 'Nova Pro', status: 'running', startedAt: NOW - 20_000 };
const hours: InboxTask = {
  id: 'hours',
  title: 'Index the support archive',
  description: 'Embedding 91,000 tickets for search.',
  agent: 'Lumen Fast',
  status: 'running',
  startedAt: NOW - (3 * 60 + 14) * min,
  tools: 412,
  sources: 91_000,
};

const many: InboxTask[] = Array.from({ length: 14 }, (_, i): InboxTask => {
  const base = typical[i % typical.length]!;
  return { ...base, id: `m${i}`, title: `${base.title} (${i + 1})` };
});

const narrow = (el: React.ReactNode) => <div style={{ width: 420 }}>{el}</div>;

const mod: StateModule = {
  slug: 'agent-inbox',
  title: 'Agent inbox',
  width: 1000,
  groups: [
    {
      label: 'Data',
      states: [
        { id: 'empty', label: 'empty', render: () => <AgentInbox tasks={[]} now={NOW} /> },
        { id: 'one-running', label: 'one task, running', render: () => <AgentInbox tasks={[running]} now={NOW} /> },
        { id: 'typical', label: 'typical (all four statuses)', render: () => <AgentInbox tasks={typical} now={NOW} /> },
        { id: 'only-done', label: 'only done', render: () => <AgentInbox tasks={[done]} now={NOW} /> },
        { id: 'only-needs-you', label: 'only needs you (waiting + failed)', render: () => <AgentInbox tasks={[waiting, failed]} now={NOW} /> },
        { id: 'many', label: 'many tasks (14)', render: () => <AgentInbox tasks={many} now={NOW} /> },
      ],
    },
    {
      label: 'Layout',
      states: [
        { id: 'board', label: 'board (default)', render: () => <AgentInbox tasks={typical} now={NOW} defaultView="board" /> },
        { id: 'list', label: 'list view', render: () => <AgentInbox tasks={typical} now={NOW} defaultView="list" /> },
        { id: 'narrow', label: 'narrow container (forced list, no switch)', render: () => narrow(<AgentInbox tasks={typical} now={NOW} />) },
      ],
    },
    {
      label: 'Disclosure',
      states: [
        { id: 'open-waiting', label: 'expanded: waiting (Reject / Approve)', render: () => <AgentInbox tasks={typical} now={NOW} defaultOpen={['migrate']} /> },
        { id: 'open-failed', label: 'expanded: failed (Retry)', render: () => <AgentInbox tasks={typical} now={NOW} defaultOpen={['invoices']} /> },
        { id: 'open-running', label: 'expanded: running + Open', render: () => <AgentInbox tasks={typical} now={NOW} defaultOpen={['review']} onOpen={() => undefined} /> },
        { id: 'open-done', label: 'expanded: done, no steps, no actions', render: () => <AgentInbox tasks={[{ ...done, steps: undefined }]} now={NOW} defaultOpen={['digest']} /> },
        { id: 'open-all', label: 'all expanded', render: () => <AgentInbox tasks={typical} now={NOW} defaultOpen={typical.map((x) => x.id)} onOpen={() => undefined} /> },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'long-text', label: 'long title and description, big counts', render: () => <AgentInbox tasks={[longTitle, running]} now={NOW} defaultOpen={['long']} /> },
        { id: 'unbroken', label: 'unbroken path and URL', render: () => <AgentInbox tasks={[longUnbroken, done]} now={NOW} /> },
        { id: 'unbroken-narrow', label: 'unbroken path, narrow', render: () => narrow(<AgentInbox tasks={[longUnbroken, longTitle]} now={NOW} defaultOpen={['long']} />) },
        { id: 'bare', label: 'no description, no counts', render: () => <AgentInbox tasks={[bare]} now={NOW} defaultOpen={['bare']} /> },
        { id: 'hours-clock', label: 'hours-long clock', render: () => <AgentInbox tasks={[hours, running2]} now={NOW} /> },
        { id: 'zero-counts', label: 'zero sources / tools', render: () => <AgentInbox tasks={[{ ...running, sources: 0, tools: 0 }]} now={NOW} /> },
      ],
    },
    {
      label: 'Bar',
      states: [
        { id: 'title-action', label: 'custom title + action', render: () => <AgentInbox tasks={typical} now={NOW} title="Background runs" action={{ label: 'New task', onClick: () => undefined }} /> },
        { id: 'action-narrow', label: 'action, narrow', render: () => narrow(<AgentInbox tasks={typical} now={NOW} title="Background runs" action={{ label: 'New task', onClick: () => undefined }} />) },
      ],
    },
  ],
  missing: [
    'Loading / skeleton (no isLoading prop)',
    'Per-task error message beyond the description (no error field)',
    'Disabled / read-only inbox (no isDisabled)',
    'Hover, focus and pressed styling (need pointer or keyboard interaction)',
  ],
};
export default mod;
