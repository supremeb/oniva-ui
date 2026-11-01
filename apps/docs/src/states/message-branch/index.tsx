import { MessageBranch } from 'oniva-ui';
import type { ReactNode } from 'react';
import type { StateModule } from '../types';

const p = (key: string, text: string): ReactNode => (
  <p key={key} style={{ margin: 0, fontSize: 14, lineHeight: '22px' }}>
    {text}
  </p>
);

const three: ReactNode[] = [
  p('1', 'The retry loop never caps its delay. After 12 attempts the wait is about 68 minutes, so a flaky endpoint can stall a job for over an hour.'),
  p('2', 'Two issues in PR #482: backoff is uncapped (max wait should be 5 min) and the consumer acks before the handler finishes, so a crash silently drops the job.'),
  p('3', 'Looks good overall. One blocking comment: add jitter to the exponential backoff to avoid thundering-herd retries when the webhook target recovers.'),
];

const many: ReactNode[] = Array.from({ length: 14 }, (_, i) =>
  p(`m${i}`, `Draft ${i + 1}: the nightly export for Northwind Labs finished in ${38 + i * 3}s and wrote ${(12_400 + i * 870).toLocaleString('en-US')} rows to exports/2026-10-30.csv.`),
);

const longText = p(
  'long',
  'The scheduler keeps a per-queue token bucket and refills it on a fixed tick. When the bucket is empty the worker parks the job with a decorrelated-jitter delay, capped at five minutes, and re-enqueues it at the tail of the lane. That keeps head-of-line blocking low, but it means a burst of 400 failures from the same upstream spreads over roughly eleven minutes instead of retrying in lockstep. Failed jobs older than 24 hours move to the dead-letter queue with the last error attached, and the on-call channel gets a single digest message instead of one alert per job. If you would rather page immediately, set alertMode to "eager" in queue.config.json.',
);

const longPath = p(
  'path',
  'Edited packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts and https://docs.northwind.example/queues/scheduler/strategies/exponential-backoff-with-decorrelated-jitter/reference?section=configuration',
);

const rich: ReactNode[] = [
  <div key="r1" style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, lineHeight: '22px' }}>
    <p style={{ margin: 0 }}>Cap the delay and add jitter:</p>
    <pre style={{ margin: 0, padding: 12, fontSize: 12, overflow: 'auto', background: 'rgba(127,127,127,0.12)', borderRadius: 8 }}>
      {'const delay = Math.min(base * 2 ** attempt, 300_000);\nreturn delay * (0.5 + Math.random() / 2);'}
    </pre>
    <ul style={{ margin: 0, paddingLeft: 20 }}>
      <li>Max wait 5 min</li>
      <li>Jitter keeps retries from synchronising</li>
    </ul>
  </div>,
  p('r2', 'Short answer: cap the delay at 5 min.'),
];

const mod: StateModule = {
  slug: 'message-branch',
  title: 'Message branch',
  width: 720,
  groups: [
    {
      label: 'Versions',
      states: [
        { id: 'empty', label: 'no branches', render: () => <MessageBranch branches={[]} /> },
        { id: 'single', label: 'one version (no switcher)', render: () => <MessageBranch branches={three.slice(0, 1)} /> },
        { id: 'two', label: 'two versions', render: () => <MessageBranch branches={three.slice(0, 2)} /> },
        { id: 'three', label: 'three, first', render: () => <MessageBranch branches={three} /> },
        { id: 'three-middle', label: 'three, middle', render: () => <MessageBranch branches={three} defaultIndex={1} /> },
        { id: 'three-last', label: 'three, last', render: () => <MessageBranch branches={three} defaultIndex={2} /> },
        { id: 'many', label: '14 versions, 12th', render: () => <MessageBranch branches={many} defaultIndex={11} /> },
      ],
    },
    {
      label: 'Index',
      states: [
        { id: 'controlled', label: 'controlled index 1', render: () => <MessageBranch branches={three} index={1} onIndexChange={() => undefined} /> },
        { id: 'index-clamped', label: 'index out of range (clamped)', render: () => <MessageBranch branches={three} defaultIndex={9} /> },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'long-text', label: 'long response', render: () => <MessageBranch branches={[longText, three[1]!]} /> },
        { id: 'long-unbroken', label: 'long path and URL', render: () => <MessageBranch branches={[longPath, three[0]!]} /> },
        { id: 'rich', label: 'code and list', render: () => <MessageBranch branches={rich} /> },
      ],
    },
  ],
  missing: ['Loading or streaming version (no status prop)', 'Disabled switcher', 'Per-version label or timestamp'],
};

export default mod;
