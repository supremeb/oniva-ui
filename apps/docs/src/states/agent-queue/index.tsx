import { AgentQueue } from 'oniva-ui';
import type { QueueJob, QueueWorker } from 'oniva-ui';
import type { StateModule } from '../types';

const NOW = 600_000;
const s = (secondsAgo: number) => NOW - secondsAgo * 1000;

const workers: QueueWorker[] = [
  { id: 'w1', name: 'Atlas 2' },
  { id: 'w2', name: 'Nova Pro' },
  { id: 'w3', name: 'Lumen Fast' },
];

const runningJobs: QueueJob[] = [
  { id: 'r1', name: 'Summarize ticket #4821', kind: 'llm', status: 'running', worker: 'w1', enqueuedAt: s(40), startedAt: s(22), progress: 0.62 },
  { id: 'r2', name: 'Embed 240 Northwind docs', kind: 'tool', status: 'running', worker: 'w2', enqueuedAt: s(35), startedAt: s(9), estimate: 30_000 },
  { id: 'r3', name: 'Review contract NW-2291', kind: 'human', status: 'running', worker: 'w3', enqueuedAt: s(80), startedAt: s(51), progress: 0.2 },
];

const queuedJobs: QueueJob[] = [
  { id: 'q1', name: 'Draft reply for Northwind Labs', kind: 'llm', status: 'queued', enqueuedAt: s(30), priority: 'high' },
  { id: 'q2', name: 'Sync CRM contacts', kind: 'agent', status: 'queued', enqueuedAt: s(26) },
  { id: 'q3', name: 'Classify email batch #77', kind: 'llm', status: 'queued', enqueuedAt: s(21) },
  { id: 'q4', name: 'Fetch invoices for March', kind: 'tool', status: 'queued', enqueuedAt: s(14), priority: 'low' },
];

const finishedJobs: QueueJob[] = [
  { id: 'd1', name: 'Classify email batch #76', kind: 'llm', status: 'done', enqueuedAt: s(110), startedAt: s(100), endedAt: s(84), worker: 'w1' },
  { id: 'd2', name: 'Sync CRM contacts', kind: 'agent', status: 'done', enqueuedAt: s(105), startedAt: s(96), endedAt: s(70), worker: 'w2' },
  { id: 'f1', name: 'Fetch invoices for February', kind: 'tool', status: 'failed', enqueuedAt: s(100), startedAt: s(90), endedAt: s(75), worker: 'w3', attempt: 3, maxAttempts: 3, error: 'Upstream returned 502 after 3 attempts.' },
];

const typical: QueueJob[] = [...finishedJobs, ...runningJobs, ...queuedJobs];

const manyQueued: QueueJob[] = Array.from({ length: 19 }, (_, i) => ({
  id: `m${i}`,
  name: ['Classify email', 'Embed docs', 'Summarize ticket', 'Draft reply', 'Sync CRM'][i % 5]! + ` #${5100 + i}`,
  kind: (['llm', 'tool', 'llm', 'llm', 'agent'] as const)[i % 5]!,
  status: 'queued' as const,
  enqueuedAt: s(100 - i * 4),
  priority: i % 7 === 3 ? ('high' as const) : undefined,
}));

const longNames: QueueJob[] = [
  { id: 'l1', name: 'Reconcile ledger exports from northwind-labs.example/finance/2026/q1/regional-breakdown-final-v7.csv', kind: 'tool', status: 'running', worker: 'w1', enqueuedAt: s(50), startedAt: s(30), progress: 0.45 },
  { id: 'l2', name: 'Summarize the quarterly escalation thread with legal, procurement and the regional support leads', kind: 'llm', status: 'queued', enqueuedAt: s(20) },
  { id: 'l3', name: '/var/lib/northwind/ingest/attachments/2026-03-14/invoice-NW-00418293-signed-scan-highres.pdf', kind: 'tool', status: 'queued', enqueuedAt: s(12), priority: 'high' },
];

const retrying: QueueJob[] = [
  { id: 'a1', name: 'Fetch invoices for March', kind: 'tool', status: 'running', worker: 'w1', enqueuedAt: s(70), startedAt: s(8), progress: 0.3, attempt: 2, maxAttempts: 3 },
  { id: 'a2', name: 'Sync CRM contacts', kind: 'agent', status: 'running', worker: 'w2', enqueuedAt: s(60), startedAt: s(15), progress: 0.7, attempt: 3, maxAttempts: 3 },
  { id: 'a3', name: 'Embed 240 Northwind docs', kind: 'tool', status: 'queued', enqueuedAt: s(25), attempt: 2, maxAttempts: 3 },
];

const noop = () => {};

const mod: StateModule = {
  slug: 'agent-queue',
  title: 'Agent queue',
  width: 1000,
  groups: [
    {
      label: 'Data',
      states: [
        { id: 'empty', label: 'empty, no jobs', render: () => <AgentQueue jobs={[]} workers={workers} now={NOW} name="support-inbox" /> },
        { id: 'one-queued', label: 'one waiting, workers free', render: () => <AgentQueue jobs={[queuedJobs[1]!]} workers={workers} now={NOW} name="support-inbox" /> },
        { id: 'typical', label: 'typical mix', render: () => <AgentQueue jobs={typical} workers={workers} now={NOW} name="support-inbox" /> },
        { id: 'many-queued', label: '19 waiting (list capped)', render: () => <AgentQueue jobs={[...runningJobs, ...manyQueued]} workers={workers} now={NOW} name="support-inbox" /> },
        { id: 'totals', label: 'totals since start', render: () => <AgentQueue jobs={typical} workers={workers} now={NOW} name="support-inbox" totals={{ done: 12840, failed: 217 }} /> },
        { id: 'no-workers', label: 'no workers', render: () => <AgentQueue jobs={queuedJobs} workers={[]} now={NOW} name="support-inbox" /> },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'long-names', label: 'long job names', render: () => <AgentQueue jobs={longNames} workers={workers} now={NOW} name="finance-reconciliation-pipeline-eu-west" /> },
        { id: 'retries', label: 'retries and attempts', render: () => <AgentQueue jobs={retrying} workers={workers} now={NOW} name="support-inbox" /> },
      ],
    },
    {
      label: 'Run',
      states: [
        { id: 'paused', label: 'paused, with resume', render: () => <AgentQueue jobs={typical} workers={workers} now={NOW} name="support-inbox" paused onPausedChange={noop} /> },
        {
          id: 'rate-limited',
          label: 'rate limited, countdown',
          render: () => <AgentQueue jobs={typical} workers={workers} now={NOW} name="support-inbox" rateLimits={[{ from: s(50), until: NOW + 42_000, label: 'provider' }]} />,
        },
        {
          id: 'backpressure',
          label: 'backlog above limit',
          render: () => <AgentQueue jobs={[...runningJobs, ...manyQueued]} workers={workers} now={NOW} name="support-inbox" backpressure={8} />,
        },
        {
          id: 'limit-history',
          label: 'past rate-limit stretches on chart',
          render: () => <AgentQueue jobs={typical} workers={workers} now={NOW} name="support-inbox" backpressure={6} rateLimits={[{ from: s(95), until: s(70), label: 'provider' }, { from: s(40), until: s(28) }]} />,
        },
      ],
    },
    {
      label: 'Controls',
      states: [
        {
          id: 'controls',
          label: 'pause and worker stepper',
          render: () => <AgentQueue jobs={typical} workers={workers} now={NOW} name="support-inbox" onPausedChange={noop} onConcurrencyChange={noop} />,
        },
        {
          id: 'min-workers',
          label: 'stepper at minimum',
          render: () => <AgentQueue jobs={[runningJobs[0]!, ...queuedJobs]} workers={workers.slice(0, 1)} now={NOW} name="support-inbox" onPausedChange={noop} onConcurrencyChange={noop} />,
        },
        {
          id: 'max-workers',
          label: 'stepper at maximum',
          render: () => <AgentQueue jobs={typical} workers={workers} now={NOW} name="support-inbox" onConcurrencyChange={noop} maxConcurrency={3} />,
        },
      ],
    },
    {
      label: 'Open job',
      states: [
        {
          id: 'open-queued',
          label: 'waiting job, move to front and cancel',
          render: () => <AgentQueue jobs={typical} workers={workers} now={NOW} defaultOpenId="q2" onPromote={noop} onCancel={noop} />,
        },
        {
          id: 'open-retry',
          label: 'running job on a retry, with error',
          render: () => (
            <AgentQueue
              jobs={[{ ...retrying[0]!, error: 'Upstream returned 502. Retrying with backoff.' }, ...retrying.slice(1)]}
              workers={workers}
              now={NOW}
              defaultOpenId="a1"
            />
          ),
        },
      ],
    },
    {
      label: 'Size',
      states: [
        {
          id: 'narrow',
          label: 'narrow column (~420)',
          render: () => (
            <div style={{ maxWidth: 420 }}>
              <AgentQueue jobs={typical} workers={workers} now={NOW} name="support-inbox" onPausedChange={noop} onConcurrencyChange={noop} backpressure={5} />
            </div>
          ),
        },
      ],
    },
  ],
  missing: [
    'Finished and failed jobs as rows: only counts are shown, so a failed job (and its error) cannot be opened',
    'Loading / connecting: no prop for a queue that is still fetching; it renders as empty',
    'Error state for the queue itself (the connection dropped): only individual jobs can fail',
    'Disabled / read-only controls: the pause button and stepper only appear when handlers are passed, there is no disabled prop',
    'Draining or stopped queue: pause is the only run state',
  ],
};

export default mod;
