import { ParallelAttempts } from 'oniva-ui';
import type { Attempt } from 'oniva-ui';
import type { StateModule } from '../types';

const task = 'Fix the flaky checkout test';

const atlasDone: Attempt = { id: 'a', name: 'Atlas 2', approach: 'Retry with exponential backoff', status: 'done', score: 88, note: '19/20 runs green', took: 98000, cost: 0.19 };
const novaDone: Attempt = { id: 'b', name: 'Nova Pro', approach: 'Mock the payments API', status: 'done', score: 94, note: '20/20 runs green', took: 125000, cost: 0.27 };
const lumenDone: Attempt = { id: 'c', name: 'Lumen Fast', approach: 'Freeze timers in the test', status: 'done', score: 71, note: '17/20 runs green', took: 61000, cost: 0.08 };
const quillFailed: Attempt = { id: 'd', name: 'Quill Reasoner', approach: 'Rewrite the test from scratch', status: 'failed', progress: 0.35, note: 'Timed out after 120s', cost: 0.11 };

const atlasRunning: Attempt = { id: 'a', name: 'Atlas 2', approach: 'Retry with exponential backoff', status: 'running', progress: 0.6, step: 'Running tests 12/20', cost: 0.14 };
const novaRunning: Attempt = { id: 'b', name: 'Nova Pro', approach: 'Mock the payments API', status: 'running', progress: 0.25, step: 'Patching 3 files', cost: 0.06 };
const lumenRunning: Attempt = { id: 'c', name: 'Lumen Fast', approach: 'Freeze timers in the test', status: 'running', progress: 0.85, step: 'Verifying 17/20 runs', cost: 0.07 };

const settled = [atlasDone, novaDone, lumenDone, quillFailed];

const longName = 'packages/northwind-checkout/src/payments/reconciliation/ledger-settlement-reconciler.worker.ts';

const mod: StateModule = {
  slug: 'parallel-attempts',
  title: 'Parallel attempts',
  width: 720,
  groups: [
    {
      label: 'Run',
      states: [
        { id: 'empty', label: 'no attempts', render: () => <ParallelAttempts attempts={[]} task={task} /> },
        { id: 'one-running', label: 'one running', render: () => <ParallelAttempts attempts={[atlasRunning]} task={task} /> },
        { id: 'all-running', label: 'all running', render: () => <ParallelAttempts attempts={[atlasRunning, novaRunning, lumenRunning]} task={task} /> },
        { id: 'mixed', label: 'running, done, failed', render: () => <ParallelAttempts attempts={[atlasRunning, novaDone, lumenDone, quillFailed]} task={task} /> },
        { id: 'settled', label: 'settled', render: () => <ParallelAttempts attempts={settled} task={task} /> },
        { id: 'one-done', label: 'one done', render: () => <ParallelAttempts attempts={[novaDone]} task={task} /> },
        { id: 'all-failed', label: 'all failed', render: () => <ParallelAttempts attempts={[quillFailed, { ...quillFailed, id: 'e', name: 'Atlas 2', approach: 'Pin the clock', progress: 0.1, note: 'Sandbox crashed', cost: undefined }]} task={task} /> },
      ],
    },
    {
      label: 'Pick',
      states: [
        { id: 'pick-other', label: 'picked is not the best', render: () => <ParallelAttempts attempts={settled} task={task} picked="c" /> },
        { id: 'pick-none', label: 'picked null (nothing in use)', render: () => <ParallelAttempts attempts={settled} task={task} picked={null} /> },
        { id: 'tied', label: 'tied scores', render: () => <ParallelAttempts attempts={[{ ...atlasDone, score: 94 }, novaDone, lumenDone]} task={task} /> },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'no-task', label: 'no task, default title', render: () => <ParallelAttempts attempts={settled} /> },
        { id: 'custom-title', label: 'custom title', render: () => <ParallelAttempts attempts={settled} title="Checkout test fix" task={task} /> },
        {
          id: 'minimal-running',
          label: 'running without step or progress',
          render: () => <ParallelAttempts attempts={[{ id: 'a', name: 'Atlas 2', approach: 'Retry with backoff', status: 'running' }, { id: 'b', name: 'Nova Pro', approach: 'Mock the payments API', status: 'running' }]} task={task} />,
        },
        {
          id: 'done-no-meta',
          label: 'done without score, note, time or cost',
          render: () => <ParallelAttempts attempts={[{ id: 'a', name: 'Atlas 2', approach: 'Retry with backoff', status: 'done' }, { ...novaDone, took: undefined, cost: undefined }]} task={task} />,
        },
        {
          id: 'failed-no-note',
          label: 'failed without note or progress',
          render: () => <ParallelAttempts attempts={[{ id: 'a', name: 'Atlas 2', approach: 'Retry with backoff', status: 'failed' }, novaDone]} task={task} />,
        },
        {
          id: 'long-text',
          label: 'long names, approach, note, task',
          render: () => (
            <ParallelAttempts
              task={`Stabilise ${longName} so the nightly settlement run stops failing on the first retry`}
              attempts={[
                { id: 'a', name: 'Atlas 2 with extended thinking and a very long deployment name', approach: `Rewrite ${longName} to use idempotent writes`, status: 'running', progress: 0.4, step: `Editing ${longName}`, cost: 0.31 },
                { id: 'b', name: 'Nova Pro', approach: `Mock ${longName}`, status: 'done', score: 94, note: `Edited ${longName} and 41 other files; 20/20 runs green`, took: 3725000, cost: 1.274 },
                { id: 'c', name: 'Quill Reasoner', approach: 'Rewrite', status: 'failed', progress: 0.5, note: `Could not resolve ${longName}: ENOENT after 3 retries` },
              ]}
            />
          ),
        },
        {
          id: 'custom-icon',
          label: 'custom icon tile',
          render: () => <ParallelAttempts attempts={[{ ...atlasDone, icon: 'A2' }, { ...novaDone, icon: 'NP' }]} task={task} />,
        },
        {
          id: 'custom-cost',
          label: 'custom cost format',
          render: () => <ParallelAttempts attempts={settled} task={task} formatCost={(n) => `${Math.round(n * 1000)} credits`} />,
        },
        {
          id: 'many',
          label: 'many attempts',
          render: () => (
            <ParallelAttempts
              task={task}
              attempts={Array.from({ length: 9 }, (_, i): Attempt => {
                const base = [atlasDone, novaDone, lumenDone, quillFailed, atlasRunning, novaRunning][i % 6]!;
                return { ...base, id: `m${i}`, score: base.score !== undefined ? base.score - i : undefined };
              })}
            />
          ),
        },
      ],
    },
    {
      label: 'Size',
      states: [
        { id: 'narrow', label: 'narrow (card, 420)', render: () => <div style={{ width: 420 }}><ParallelAttempts attempts={[atlasRunning, novaDone, lumenDone, quillFailed]} task={task} /></div> },
      ],
    },
  ],
  missing: [
    'Empty state copy (no attempts renders only the header and an empty list)',
    'Cancelled attempt status (only running, done and failed exist)',
    'Disabled or read-only picking (done rows are always selectable)',
  ],
};
export default mod;
