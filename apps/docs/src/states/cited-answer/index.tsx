import { CitedAnswer } from 'oniva-ui';
import type { CitedSegment, CitedSource } from 'oniva-ui';
import type { StateModule } from '../types';

const sources: CitedSource[] = [
  {
    id: 'cache',
    site: 'Tokenwise',
    title: 'Prompt caching, explained',
    url: 'https://tokenwise.example.com/blog/prompt-caching',
    date: 'Sep 18, 2026',
    quote: 'A cached prefix is read instead of recomputed, which cuts both latency and cost for long, repeated instructions.',
    highlight: ['read instead of recomputed'],
  },
  {
    id: 'stream',
    site: 'Latency Notes',
    title: 'Why streaming feels faster',
    url: 'https://latency.example.com/streaming',
    date: 'Aug 2, 2026',
    quote: 'Perceived latency drops once the first words appear, even when the total generation time is unchanged.',
  },
  {
    id: 'batch',
    site: 'Ops handbook',
    title: 'Batching offline jobs',
    quote: 'Non-urgent workloads can run in batches at roughly half the price of interactive requests.',
  },
];

const segments: CitedSegment[] = [
  { text: "The biggest win is prompt caching: the provider reuses the processed start of your prompt, so a long system prompt isn't recomputed on every call.", cite: ['cache'] },
  { text: ' On prompts over 10K tokens that can cut time to first token by up to 80%.', cite: ['cache'] },
  { text: ' It only works while that start stays identical, so put the system prompt, tools and long documents first and anything that changes per request last.', cite: ['stream', 'cache'] },
  { text: 'For repeated questions, add a semantic cache in front of the model: close matches get a stored answer in about 40 ms,', cite: ['batch'], paragraph: true },
  { text: ' which covered nearly a third of FAQ-style traffic in one production setup.', cite: ['batch'] },
  { text: ' Stream the rest, so people see the first words while the answer is still being written.' },
];

const manySources: CitedSource[] = [
  ...sources,
  { id: 's4', site: 'Northwind Labs', title: 'Retry budgets for batch workers', url: 'https://docs.northwind.example/retries', date: 'Oct 3, 2026', quote: 'Cap retries per job and spread them with jitter so a failing dependency is not hit by every worker at once.' },
  { id: 's5', site: 'Queue Weekly', title: 'Backpressure in practice', url: 'https://queue.example.org/backpressure', date: 'Jul 21, 2026', quote: 'Bounded queues turn overload into an explicit signal instead of unbounded memory growth.' },
  { id: 's6', site: 'Throughput Journal', title: 'Measuring p95 latency honestly', url: 'https://journal.example.net/p95', date: 'Jun 9, 2026', quote: 'Report percentiles from raw samples; averaging per-minute percentiles hides the tail.' },
  { id: 's7', site: 'Cost Compass', title: 'Token budgets per request', url: 'https://costcompass.example.com/budgets', date: 'May 30, 2026', quote: 'Set a hard cap on output tokens per request class and alert on the 99th percentile.' },
  { id: 's8', site: 'Platform Digest', title: 'Cache invalidation without tears', url: 'https://digest.example.dev/invalidation', date: 'Apr 12, 2026', quote: 'Key caches by content hash so invalidation becomes a non-event.' },
];

const manySegments: CitedSegment[] = [
  ...segments,
  { text: 'Cap retries per job and add jitter so a flaky dependency is not hit all at once.', cite: ['s4', 's5'], paragraph: true },
  { text: ' Track p95 from raw samples and keep a hard token budget per request class.', cite: ['s6', 's7', 's8'] },
];

const longTitleSource: CitedSource = {
  id: 'long',
  site: 'The Northwind Labs Engineering Handbook and Operations Reference',
  title: 'Appendix C.4.2: exponential-backoff-with-decorrelated-jitter.worker.ts and the scheduler strategies that depend on it',
  url: 'https://handbook.northwind.example/engineering/operations/appendix-c/scheduler/strategies/exponential-backoff-with-decorrelated-jitter',
  date: 'Oct 24, 2026',
  quote:
    'Workers that share a retry schedule fail together: the supercalifragilisticexpialidocious_unbroken_identifier_packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts retries in lockstep unless each delay is drawn independently. Draw each delay from a range that widens with the previous delay, then cap it.',
  highlight: ['retries in lockstep'],
};

const longSegments: CitedSegment[] = [
  { text: 'Workers that share one retry schedule retry in lockstep, so draw each delay independently and cap it.', cite: ['long'] },
];

const w = { onPress: () => {} };

const mod: StateModule = {
  slug: 'cited-answer',
  title: 'Cited answer',
  width: 460,
  groups: [
    {
      label: 'Data',
      states: [
        { id: 'empty', label: 'no segments, no sources', render: () => <CitedAnswer segments={[]} sources={[]} /> },
        {
          id: 'single-sentence',
          label: 'one sentence, one source',
          render: () => (
            <CitedAnswer
              segments={[{ text: 'Cached prefixes are read instead of recomputed.', cite: ['cache'] }]}
              sources={[sources[0]!]}
              pagesRead={1}
            />
          ),
        },
        { id: 'typical', label: 'typical, three sources', render: () => <CitedAnswer segments={segments} sources={sources} pagesRead={12} /> },
        {
          id: 'many-sources',
          label: 'eight sources',
          render: () => <CitedAnswer segments={manySegments} sources={manySources} pagesRead={34} />,
        },
        {
          id: 'uncited',
          label: 'no citations at all',
          render: () => (
            <CitedAnswer
              segments={[
                { text: 'Retries should be capped and jittered.' },
                { text: ' Measure before tuning anything.' },
              ]}
              sources={sources}
            />
          ),
        },
        {
          id: 'unknown-ids',
          label: 'cites ids that do not exist',
          render: () => (
            <CitedAnswer
              segments={[
                { text: 'Cached prefixes are read instead of recomputed.', cite: ['cache', 'gone'] },
                { text: ' Streaming feels faster.', cite: ['gone'] },
              ]}
              sources={[sources[0]!]}
            />
          ),
        },
      ],
    },
    {
      label: 'Preview',
      states: [
        { id: 'open-with-quote', label: 'preview open, highlight', render: () => <CitedAnswer segments={segments} sources={sources} defaultOpen="cache" /> },
        { id: 'open-shared-words', label: 'preview open, shared-word marks', render: () => <CitedAnswer segments={segments} sources={sources} defaultOpen="stream" /> },
        { id: 'open-no-url', label: 'preview open, no url or date', render: () => <CitedAnswer segments={segments} sources={sources} defaultOpen="batch" /> },
        {
          id: 'open-no-quote',
          label: 'preview open, no quote',
          render: () => (
            <CitedAnswer
              segments={[{ text: 'Retry budgets belong in config.', cite: ['bare'] }]}
              sources={[{ id: 'bare', site: 'Northwind Labs', title: 'Retry budgets', url: 'https://docs.northwind.example/retries' }]}
              defaultOpen="bare"
            />
          ),
        },
        {
          id: 'open-handler',
          label: 'preview open, onOpenSource handler',
          render: () => <CitedAnswer segments={segments} sources={sources} defaultOpen="cache" onOpenSource={() => {}} />,
        },
        {
          id: 'open-unsafe-url',
          label: 'preview open, non-http url',
          render: () => (
            <CitedAnswer
              segments={[{ text: 'Cached prefixes are read.', cite: ['x'] }]}
              sources={[{ id: 'x', site: 'Tokenwise', title: 'Local notes', url: 'javascript:void(0)', quote: 'A cached prefix is read instead of recomputed.' }]}
              defaultOpen="x"
            />
          ),
        },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'long-source',
          label: 'long titles, urls and quote',
          render: () => <CitedAnswer segments={longSegments} sources={[longTitleSource]} defaultOpen="long" pagesRead={3} />,
        },
        {
          id: 'long-source-closed',
          label: 'long site name chip',
          render: () => <CitedAnswer segments={longSegments} sources={[longTitleSource, sources[0]!]} />,
        },
      ],
    },
    {
      label: 'Footer',
      states: [
        { id: 'action', label: 'follow-up action', render: () => <CitedAnswer segments={segments} sources={sources} pagesRead={12} action={{ label: 'Follow up', ...w }} /> },
        { id: 'summary-hidden', label: 'summary hidden', render: () => <CitedAnswer segments={segments} sources={sources} summary={null} /> },
        { id: 'summary-hidden-action', label: 'summary hidden, action', render: () => <CitedAnswer segments={segments} sources={sources} summary={null} action={{ label: 'Follow up', ...w }} /> },
        { id: 'summary-custom', label: 'custom summary', render: () => <CitedAnswer segments={segments} sources={sources} summary="Checked against 12 pages, Oct 30" /> },
      ],
    },
  ],
  missing: [
    'Streaming / still-writing answer (the component only renders finished answers)',
    'Loading or searching sources (no pending or error status prop)',
    'Disabled / read-only (no prop)',
    'Source retrieval error or a source that failed to load (no per-source status)',
  ],
};

export default mod;
