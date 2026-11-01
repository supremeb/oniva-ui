import { ChainOfThought } from 'oniva-ui';
import type { ChainOfThoughtStep } from 'oniva-ui';
import type { StateModule } from '../types';

const swatch = (a: string, b: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="192" height="128"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="192" height="128" fill="url(#g)"/></svg>`)}`;

const typical: ChainOfThoughtStep[] = [
  { id: 's1', label: 'Read the diff for PR #482', status: 'complete', description: '6 files changed, +214 / −58. Touches retry.ts and the queue consumer.' },
  {
    id: 's2',
    label: 'Search for backoff best practices',
    status: 'complete',
    results: [
      { title: 'Exponential backoff and jitter', url: 'https://docs.northwind.example/queues/timeouts-retries-and-backoff-with-jitter' },
      { title: 'Webhook retry policies', url: 'https://docs.northwind.example/webhooks' },
    ],
  },
  {
    id: 's3',
    label: 'Compare queue latency before and after',
    status: 'active',
    description: 'Rendering p95 latency charts from the staging traces.',
    images: [
      { src: swatch('#c7d2fe', '#a5b4fc'), alt: 'p95 latency before the change' },
      { src: swatch('#bbf7d0', '#86efac'), alt: 'p95 latency after the change' },
    ],
  },
  { id: 's4', label: 'Write review summary', status: 'pending' },
];

const allDone: ChainOfThoughtStep[] = typical.map((s) => ({ ...s, status: 'complete' as const }));

const streamingSteps: ChainOfThoughtStep[] = [
  { id: 'l1', label: 'Read the diff for PR #482', status: 'complete', description: '6 files changed, +214 / −58. Touches retry.ts and the queue consumer.' },
  { id: 'l2', label: 'Compare queue latency before and after', status: 'active', description: 'p95 dropped from 420ms to 180ms; the retry storm on timeout is gone.' },
];

const longPath = 'packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts';

const manyLabels = [
  'Read the incident timeline',
  'Pull error rates for the ingest service',
  'Check the deploy log for 14:02 UTC',
  'Diff the autoscaler config',
  'Search runbooks for queue saturation',
  'Reproduce on staging with 4x load',
  'Inspect consumer lag by partition',
  'Compare against last week’s baseline',
  'Rule out the schema migration',
  'Draft the mitigation plan',
  'Estimate the blast radius',
  'Write the status update',
];

const manySteps: ChainOfThoughtStep[] = manyLabels.map((label, i) => ({
  id: `m${i}`,
  label,
  status: i < 9 ? ('complete' as const) : i === 9 ? ('active' as const) : ('pending' as const),
  description: i % 3 === 0 ? `Finished in ${((i + 1) * 1.4).toFixed(1)}s across ${i + 2} sources.` : undefined,
}));

const mod: StateModule = {
  slug: 'chain-of-thought',
  title: 'Chain of thought',
  width: 720,
  groups: [
    {
      label: 'Run',
      states: [
        { id: 'empty', label: 'no steps', render: () => <ChainOfThought steps={[]} /> },
        { id: 'streaming-no-steps', label: 'streaming, no steps yet', render: () => <ChainOfThought steps={[]} isStreaming /> },
        { id: 'streaming', label: 'streaming', render: () => <ChainOfThought steps={streamingSteps} isStreaming /> },
        { id: 'streaming-custom-label', label: 'streaming, custom label', render: () => <ChainOfThought steps={streamingSteps} isStreaming streamingLabel="Reviewing the pull request…" /> },
        { id: 'mixed', label: 'done, active, pending (idle)', render: () => <ChainOfThought steps={typical} /> },
        { id: 'complete', label: 'complete, 7 seconds', render: () => <ChainOfThought steps={allDone} durationSeconds={7} /> },
        { id: 'complete-one-second', label: 'complete, 1 second', render: () => <ChainOfThought steps={allDone} durationSeconds={1} /> },
        { id: 'complete-minutes', label: 'complete, over a minute', render: () => <ChainOfThought steps={allDone} durationSeconds={134} /> },
        { id: 'all-pending', label: 'all pending', render: () => <ChainOfThought steps={typical.map((s) => ({ ...s, status: 'pending' as const, images: undefined }))} /> },
      ],
    },
    {
      label: 'Disclosure',
      states: [
        { id: 'collapsed', label: 'collapsed', render: () => <ChainOfThought steps={typical} defaultOpen={false} title="4 steps" /> },
        { id: 'collapsed-duration', label: 'collapsed, with duration', render: () => <ChainOfThought steps={allDone} defaultOpen={false} durationSeconds={42} /> },
      ],
    },
    {
      label: 'Data',
      states: [
        {
          id: 'one-step',
          label: 'one step',
          render: () => <ChainOfThought steps={[{ id: 'a', label: 'Read the diff for PR #482', status: 'active', description: '6 files changed, +214 / −58.' }]} />,
        },
        { id: 'many-steps', label: '12 steps', render: () => <ChainOfThought steps={manySteps} /> },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'long-label',
          label: 'long label and unbroken description',
          render: () => (
            <ChainOfThought
              steps={[
                {
                  id: 'a',
                  label: 'Cross-check the retry schedule against every consumer that subscribes to the Northwind billing events topic and reports its own backoff',
                  status: 'complete',
                  description: longPath + ':418:23 — https://docs.northwind.example/queues/timeouts-retries-and-backoff-with-jitter/decorrelated-jitter-variants-and-their-tradeoffs',
                },
                { id: 'b', label: longPath, status: 'active', description: 'Checking whether the strategy handles a clock skew greater than the visibility timeout.' },
              ]}
            />
          ),
        },
        {
          id: 'many-sources',
          label: 'many source chips, long titles',
          render: () => (
            <ChainOfThought
              steps={[
                {
                  id: 'a',
                  label: 'Search for backoff best practices',
                  status: 'complete',
                  results: [
                    { title: 'Exponential backoff and jitter', url: 'https://docs.northwind.example/queues/backoff' },
                    { title: 'Webhook retry policies and delivery guarantees for long-running consumers', url: 'https://docs.northwind.example/webhooks/retries' },
                    { title: 'Idempotency keys', url: 'https://api.northwind.example/v2/idempotency' },
                    { title: 'Dead-letter queues', url: 'https://docs.northwind.example/queues/dead-letter' },
                    { title: 'Post-incident review: retry storm of March', url: 'https://wiki.northwind.example/incidents/2026-03-retry-storm' },
                    { title: 'https://docs.northwind.example/queues/timeouts-retries-and-backoff-with-jitter/decorrelated-jitter-variants', url: 'https://docs.northwind.example/queues/timeouts-retries-and-backoff-with-jitter/decorrelated-jitter-variants' },
                  ],
                },
              ]}
            />
          ),
        },
        {
          id: 'images',
          label: 'five images',
          render: () => (
            <ChainOfThought
              steps={[
                {
                  id: 'a',
                  label: 'Render latency charts',
                  status: 'complete',
                  images: [
                    { src: swatch('#c7d2fe', '#a5b4fc'), alt: 'p50 before' },
                    { src: swatch('#bbf7d0', '#86efac'), alt: 'p50 after' },
                    { src: swatch('#fde68a', '#fcd34d'), alt: 'p95 before' },
                    { src: swatch('#fecaca', '#fca5a5'), alt: 'p95 after' },
                    { src: swatch('#e9d5ff', '#d8b4fe'), alt: 'p99 before' },
                  ],
                },
              ]}
            />
          ),
        },
        {
          id: 'node-description',
          label: 'rich description (ReactNode)',
          render: () => (
            <ChainOfThought
              steps={[
                {
                  id: 'a',
                  label: 'Inspect the failing job',
                  status: 'active',
                  description: (
                    <>
                      Exit code <code>137</code> on <code>worker-3</code> after 38 minutes; memory limit is 512 MB.
                    </>
                  ),
                },
              ]}
            />
          ),
        },
        { id: 'custom-title', label: 'custom title', render: () => <ChainOfThought steps={allDone} title="Reasoning (4 steps)" /> },
      ],
    },
  ],
  missing: [
    'Error / failed step (the status union has no error state)',
    'Skipped or cancelled run',
    'Image load failure (no fallback in the code)',
    'Disabled / read-only',
  ],
};

export default mod;
