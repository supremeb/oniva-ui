import { ContextMap, FileTextIcon } from 'oniva-ui';
import type { ContextBlock, ContextCompaction } from 'oniva-ui';
import type { StateModule } from '../types';

const typical: ContextBlock[] = [
  { id: 'system', label: 'System prompt', kind: 'system', tokens: 6200 },
  { id: 'tools', label: 'Tool definitions', kind: 'tools', tokens: 14800 },
  { id: 'memory', label: 'Project memory', kind: 'memory', tokens: 5400, detail: '12 notes', items: [{ label: 'Release checklist' }, { label: 'Retry policy' }] },
  { id: 'spec', label: 'checkout.spec.ts', kind: 'file', tokens: 8200, detail: 'Read at 0:09' },
  { id: 'cart', label: 'cart.ts', kind: 'file', tokens: 11300, detail: 'Read at 0:41' },
  { id: 'chat', label: 'Chat', kind: 'chat', tokens: 41000 },
  { id: 'run', label: 'Test run · 20×', kind: 'result', tokens: 22400 },
];

const before: ContextBlock[] = [
  ...typical.slice(0, 5),
  { id: 'turns', label: 'Turns 1–18', kind: 'chat', tokens: 52000 },
  { id: 'stale', label: 'Old test run', kind: 'result', tokens: 9400 },
  { id: 'chat', label: 'Chat', kind: 'chat', tokens: 41000 },
  { id: 'run', label: 'Test run · 20×', kind: 'result', tokens: 22400 },
];
const after: ContextBlock[] = [...typical.slice(0, 5), { id: 'sum', label: 'Summary', kind: 'summary', tokens: 6100 }, ...typical.slice(5)];
const compaction: ContextCompaction = { before, summarized: ['turns'], dropped: ['stale'], summary: 'Turns 1–18 became a 6.1K summary.' };

const many: ContextBlock[] = [
  ...typical,
  { id: 'f1', label: 'payment.ts', kind: 'file', tokens: 3100 },
  { id: 'f2', label: 'invoice.ts', kind: 'file', tokens: 2400 },
  { id: 'f3', label: 'tax-rules.json', kind: 'file', tokens: 1800 },
  { id: 'f4', label: 'README.md', kind: 'file', tokens: 900 },
  { id: 'r1', label: 'Lint run', kind: 'result', tokens: 600 },
  { id: 'r2', label: 'Typecheck', kind: 'result', tokens: 420 },
  { id: 'm1', label: 'User preferences', kind: 'memory', tokens: 350 },
  { id: 'c1', label: 'Scratch note', kind: 'chat', tokens: 180 },
];

const longLabels: ContextBlock[] = [
  { id: 'system', label: 'System prompt', kind: 'system', tokens: 6200 },
  { id: 'tools', label: 'Tool definitions', kind: 'tools', tokens: 14800 },
  { id: 'f1', label: 'packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts', kind: 'file', tokens: 28400, detail: 'Read at 2:14 · lines 1–812' },
  { id: 'f2', label: 'https://docs.northwind.example/guides/queues/retries-and-dead-letter-handling/overview', kind: 'file', tokens: 12700 },
  { id: 'chat', label: 'Chat with Priya Raman and the on-call platform team about the retry regression', kind: 'chat', tokens: 33000 },
];

const mod: StateModule = {
  slug: 'context-map',
  title: 'Context map',
  width: 720,
  groups: [
    {
      label: 'Data',
      states: [
        { id: 'empty', label: 'no blocks, no limit', render: () => <ContextMap blocks={[]} /> },
        { id: 'empty-limit', label: 'no blocks, with limit', render: () => <ContextMap blocks={[]} limit={200_000} model="Atlas 2" /> },
        {
          id: 'one-block',
          label: 'one block',
          render: () => <ContextMap blocks={[{ id: 'system', label: 'System prompt', kind: 'system', tokens: 6200 }]} limit={200_000} model="Atlas 2" />,
        },
        { id: 'typical', label: 'typical, with free space', render: () => <ContextMap blocks={typical} limit={200_000} model="Atlas 2" /> },
        { id: 'no-limit', label: 'no limit', render: () => <ContextMap blocks={typical} model="Atlas 2" /> },
        { id: 'full', label: 'exactly full', render: () => <ContextMap blocks={typical} limit={109_300} model="Nova Pro" /> },
        { id: 'over-limit', label: 'over the limit', render: () => <ContextMap blocks={typical} limit={90_000} model="Lumen Fast" /> },
        { id: 'many', label: 'many small blocks', render: () => <ContextMap blocks={many} limit={160_000} model="Atlas 2" /> },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'long-labels', label: 'long labels and paths', render: () => <ContextMap blocks={longLabels} limit={120_000} model="Quill Reasoner" /> },
        {
          id: 'icons',
          label: 'block icons and custom title',
          render: () => (
            <ContextMap
              title="Agent context"
              blocks={typical.map((b) => (b.kind === 'file' ? { ...b, icon: <FileTextIcon size={12} aria-hidden="true" /> } : b))}
              limit={200_000}
              model="Atlas 2"
              modelIcon={<FileTextIcon size={12} aria-hidden="true" />}
            />
          ),
        },
        { id: 'status', label: 'status line', render: () => <ContextMap blocks={typical} limit={200_000} model="Atlas 2" status="Compacting" /> },
      ],
    },
    {
      label: 'Compaction',
      states: [
        { id: 'not-compacted', label: 'not compacted yet', render: () => <ContextMap blocks={typical} limit={200_000} model="Atlas 2" compaction={null} /> },
        { id: 'after', label: 'after compaction', render: () => <ContextMap blocks={after} limit={200_000} model="Atlas 2" compaction={compaction} view="after" /> },
        { id: 'before', label: 'before compaction', render: () => <ContextMap blocks={after} limit={200_000} model="Atlas 2" compaction={compaction} view="before" /> },
        {
          id: 'after-no-summary',
          label: 'after, nothing summarized',
          render: () => <ContextMap blocks={typical} limit={200_000} model="Atlas 2" compaction={{ before: typical }} view="after" />,
        },
      ],
    },
  ],
  missing: [
    'Pinned or hovered tile with its details line (needs a click or hover; there is no defaultPinned prop)',
    'Tiles gliding as blocks grow, and leavers shrinking away on compaction (animated, needs a live data change)',
    'Loading or streaming (the component has no pending state; the status string is free text)',
  ],
};

export default mod;
