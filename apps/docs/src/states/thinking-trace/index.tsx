import { ThinkingTrace } from 'oniva-ui';
import type { ThinkingTraceItem } from 'oniva-ui';
import type { StateModule } from '../types';

const steps: ThinkingTraceItem[] = [
  { kind: 'step', id: '1', label: 'Reading the Q3 renewal briefs' },
  { kind: 'step', id: '2', label: 'Scanning supplier price lists', detail: '14 files' },
  { kind: 'step', id: '3', label: 'Comparing tasting notes', detail: '6 flavors' },
  { kind: 'step', id: '4', label: 'Writing the scoop report', detail: '1.2s' },
];

const reasoning: ThinkingTraceItem[] = [
  { kind: 'text', id: '1', text: 'Summer demand spikes for stone-fruit flavors, and peach and apricot lead the last three seasons of sales data.' },
  { kind: 'text', id: '2', text: 'I should check cone inventory at the Harbor Street depot before promoting a waffle-bowl special, since the last promotion sold out in two days.' },
  { kind: 'text', id: '3', text: 'Pistachio is up 23% month over month, so it probably leads the report.' },
];

const search: ThinkingTraceItem[] = [
  { kind: 'query', id: '1', query: 'best waffle cone supplier wholesale' },
  { kind: 'source', id: '2', title: 'Northwind Cones wholesale catalog', url: 'https://cones.northwind.example/wholesale' },
  { kind: 'source', id: '3', title: 'Harbor Supply cone pricing', url: 'https://harborsupply.example/cones' },
  { kind: 'source', id: '4', title: 'The Cone Works', url: 'https://coneworks.example' },
  { kind: 'more', id: '5', count: 7 },
];

const coding: ThinkingTraceItem[] = [
  { kind: 'tool', id: '1', verb: 'Read', target: 'src/flavors.ts' },
  { kind: 'tool', id: '2', verb: 'Edit', target: 'src/components/ChurnSchedule.tsx', added: 74, removed: 41 },
  { kind: 'tool', id: '3', verb: 'Write', target: 'src/components/ChurnSchedule.test.tsx', added: 112 },
  { kind: 'tool', id: '4', verb: 'Run', target: 'npm run freeze -- --filter churn' },
];

const long: ThinkingTraceItem[] = [
  {
    kind: 'step',
    id: '1',
    label: 'Cross-referencing the regional distribution agreements against the seasonal flavor allocation spreadsheet',
    detail: '38 rows',
  },
  { kind: 'query', id: '2', query: 'northwind labs regional distribution agreement seasonal flavor allocation minimum order quantities 2026' },
  {
    kind: 'source',
    id: '3',
    title: 'Seasonal flavor allocation and minimum order quantities for regional distribution partners (annual report)',
    url: 'https://distribution.northwind-labs-regional-partners.example/reports/2026/seasonal-flavor-allocation-and-minimum-order-quantities.html',
  },
  {
    kind: 'tool',
    id: '4',
    verb: 'Edit',
    target: 'packages/northwind-scheduler/src/workers/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts',
    added: 1204,
    removed: 988,
  },
  {
    kind: 'text',
    id: '5',
    text: 'Averyveryveryveryveryveryveryveryveryveryveryverylongunbrokenidentifier_northwind_labs_regional_distribution_allocation_v2_final_FINAL.csv needs a second pass.',
  },
];

const many: ThinkingTraceItem[] = Array.from({ length: 14 }, (_, i) => ({
  kind: 'step' as const,
  id: `m${i}`,
  label: ['Reading brief', 'Scanning price list', 'Comparing notes', 'Checking depot stock', 'Drafting section', 'Verifying totals', 'Reviewing tone'][i % 7]! + ` ${i + 1}`,
  detail: `${(i + 1) * 120}ms`,
}));

const mixed: ThinkingTraceItem[] = [
  { kind: 'text', id: '1', text: 'Pistachio is up 23% this month, so it probably leads the report.' },
  { kind: 'query', id: '2', query: 'stone fruit ice cream trends 2026' },
  { kind: 'source', id: '3', title: 'Frozen dessert outlook', url: 'https://frozen.northwind.example/outlook' },
  { kind: 'source', id: '4', title: 'Flavor demand index', url: 'https://flavorindex.example/summer' },
  { kind: 'tool', id: '5', verb: 'Run', target: 'node scripts/rank-flavors.mjs' },
  { kind: 'step', id: '6', label: 'Drafting the answer' },
];

const mod: StateModule = {
  slug: 'thinking-trace',
  title: 'Thinking trace',
  width: 720,
  groups: [
    {
      label: 'Run',
      states: [
        { id: 'closed', label: 'closed, with duration', render: () => <ThinkingTrace items={steps} durationSeconds={4} /> },
        { id: 'closed-no-duration', label: 'closed, no duration', render: () => <ThinkingTrace items={steps} /> },
        { id: 'duration-minutes', label: 'closed, over a minute', render: () => <ThinkingTrace items={steps} durationSeconds={134} /> },
        { id: 'one-second', label: 'closed, one second', render: () => <ThinkingTrace items={steps} durationSeconds={1} /> },
        { id: 'streaming-closed', label: 'streaming, closed', render: () => <ThinkingTrace items={mixed.slice(0, 2)} isStreaming /> },
        { id: 'streaming-empty', label: 'streaming, no rows yet', render: () => <ThinkingTrace items={[]} isStreaming defaultOpen /> },
        {
          id: 'streaming-text',
          label: 'streaming, reasoning text',
          render: () => <ThinkingTrace items={reasoning.slice(0, 2)} isStreaming defaultOpen />,
        },
        { id: 'streaming-mixed', label: 'streaming, mixed rows', render: () => <ThinkingTrace items={mixed.slice(0, 4)} isStreaming defaultOpen /> },
        {
          id: 'streaming-custom-label',
          label: 'streaming, custom label',
          render: () => <ThinkingTrace items={search.slice(0, 3)} label="Searching the web…" isStreaming defaultOpen />,
        },
        { id: 'done-open', label: 'done, open', render: () => <ThinkingTrace items={mixed} durationSeconds={7} defaultOpen /> },
      ],
    },
    {
      label: 'Looks',
      states: [
        { id: 'steps', label: 'steps', render: () => <ThinkingTrace items={steps} durationSeconds={4} defaultOpen /> },
        { id: 'reasoning', label: 'reasoning', render: () => <ThinkingTrace items={reasoning} durationSeconds={9} defaultOpen /> },
        { id: 'search', label: 'search with sources', render: () => <ThinkingTrace items={search} label="Searched the web" defaultOpen /> },
        { id: 'coding', label: 'coding tools', render: () => <ThinkingTrace items={coding} label="Ran 4 tools" defaultOpen /> },
      ],
    },
    {
      label: 'Data',
      states: [
        { id: 'empty-open', label: 'empty, open', render: () => <ThinkingTrace items={[]} defaultOpen /> },
        { id: 'one-item', label: 'one row', render: () => <ThinkingTrace items={[steps[0]!]} durationSeconds={2} defaultOpen /> },
        { id: 'many', label: 'fourteen rows', render: () => <ThinkingTrace items={many} durationSeconds={21} defaultOpen /> },
        {
          id: 'unsafe-link',
          label: 'source with unsafe url',
          render: () => (
            <ThinkingTrace
              items={[
                { kind: 'source', id: '1', title: 'Unverified mirror', url: 'javascript:void(0)' },
                { kind: 'source', id: '2', title: 'Frozen dessert outlook', url: 'https://frozen.northwind.example/outlook' },
              ]}
              label="Searched the web"
              defaultOpen
            />
          ),
        },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'long-content', label: 'long labels, urls and paths', render: () => <ThinkingTrace items={long} durationSeconds={12} defaultOpen /> },
        {
          id: 'long-label',
          label: 'long header label',
          render: () => (
            <ThinkingTrace
              items={steps}
              label="Thought for a while about how to reconcile the regional distribution agreements with the seasonal flavor allocation"
            />
          ),
        },
      ],
    },
  ],
  missing: [
    'Error / failed trace: there is no status or error prop; items cannot carry a failed state.',
    'Per-row running or pending state: rows only differ by kind; only the last text row reveals while streaming.',
    'Auto-collapse after streaming ends: needs a timer and a streaming-to-done transition, not reachable as a still state.',
  ],
};

export default mod;
