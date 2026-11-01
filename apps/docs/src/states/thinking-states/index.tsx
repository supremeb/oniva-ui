import { ThinkingStates, AtIcon, FileTextIcon, GlobeIcon, HashIcon } from 'oniva-ui';
import type { ThinkingStatesProps } from 'oniva-ui';
import type { StateModule } from '../types';

// Timers never fire during a capture: a huge hold/step keeps a live run on its first frame,
// and stepMs 0 lets the panel settle on its finished frame straight away.
const HOLD = 3_600_000;
const INSTANT = 0;

type ThinkingStep = NonNullable<ThinkingStatesProps['steps']>[number];

const sources = [
  { label: 'Chat · #team-offsite', icon: <HashIcon size={12} /> },
  { label: 'Feed · @harborguide', icon: <AtIcon size={12} /> },
  { label: 'Notes · Offsite plan', icon: <FileTextIcon size={12} /> },
  { label: 'Wiki · Harbor City', icon: <GlobeIcon size={12} /> },
  { label: 'Calendar · Q4' },
  { label: 'Maps · Venues' },
  { label: 'Mail · Quotes' },
];

const linked = [
  { label: 'docs.northwind.example', href: 'https://docs.northwind.example/retries' },
  { label: 'status.northwind.example', href: 'https://status.northwind.example' },
  { label: 'changelog.northwind.example', href: 'https://changelog.northwind.example' },
  { label: 'forum.northwind.example', href: 'https://forum.northwind.example/t/backoff' },
  { label: 'blog.northwind.example', href: 'https://blog.northwind.example/queues' },
];

const typical: ThinkingStep[] = [
  { kind: 'search', label: 'Searched', sources },
  { label: 'Reading 7 sources about the trip' },
  { label: 'Comparing flights and hotels' },
  { label: 'Drafting a three-day itinerary' },
];

const longLabel =
  'Reconciling the invoice export northwind-billing/exports/2026/10/invoices-eu-west-1-reconciled-final-v3.csv against the ledger snapshot';
const longSource = 'https://docs.northwind.example/platform/queues/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter';

const longSteps: ThinkingStep[] = [
  { kind: 'search', label: 'Searched', sources: [{ label: longSource, href: longSource }, ...linked] },
  { label: longLabel },
  { label: 'Writing the summary' },
];

const manySteps: ThinkingStep[] = Array.from({ length: 12 }, (_, i) => ({
  label: ['Reading the ticket', 'Checking the retry config', 'Tracing the worker', 'Comparing with last week', 'Sampling failed jobs', 'Grouping by queue', 'Ranking the causes', 'Testing the jitter theory', 'Reading the runbook', 'Drafting the fix', 'Reviewing the diff', 'Writing the summary'][i]!,
}));

const mod: StateModule = {
  slug: 'thinking-states',
  title: 'Thinking states',
  width: 440,
  groups: [
    {
      label: 'Status line',
      states: [
        { id: 'line-empty', label: 'no messages', render: () => <ThinkingStates messages={[]} /> },
        { id: 'line-one', label: 'one message', render: () => <ThinkingStates messages={['Reading the sales export…']} /> },
        {
          id: 'line-cycling',
          label: 'cycling (first line)',
          render: () => (
            <ThinkingStates
              holdMs={HOLD}
              messages={['Reading the sales export…', 'Joining with the CRM accounts…', 'Computing cohort retention…', 'Drafting the summary…']}
            />
          ),
        },
        {
          id: 'line-paused',
          label: 'paused',
          render: () => <ThinkingStates paused messages={['Reading the sales export…', 'Drafting the summary…']} />,
        },
        {
          id: 'line-long',
          label: 'long message',
          render: () => (
            <ThinkingStates
              messages={['Reconciling northwind-billing/exports/2026/10/invoices-eu-west-1-reconciled-final-v3.csv with the ledger snapshot…']}
            />
          ),
        },
      ],
    },
    {
      label: 'Panel · run',
      states: [
        { id: 'panel-empty', label: 'no steps', render: () => <ThinkingStates steps={[]} stepMs={INSTANT} /> },
        {
          id: 'panel-first-step',
          label: 'running, first step',
          render: () => <ThinkingStates steps={typical} stepMs={HOLD} />,
        },
        {
          id: 'panel-done',
          label: 'finished',
          render: () => <ThinkingStates steps={typical} stepMs={INSTANT} />,
        },
        {
          id: 'panel-done-label',
          label: 'finished, custom label',
          render: () => <ThinkingStates steps={typical.slice(1)} stepMs={INSTANT} doneLabel="Ready to answer" />,
        },
        {
          id: 'panel-one-step',
          label: 'one step, finished',
          render: () => <ThinkingStates steps={[{ label: 'Reading the ticket' }]} stepMs={INSTANT} />,
        },
        {
          id: 'panel-collapsed',
          label: 'collapsed, running',
          render: () => <ThinkingStates steps={typical} stepMs={HOLD} defaultCollapsed />,
        },
        {
          id: 'panel-collapsed-done',
          label: 'collapsed, finished',
          render: () => <ThinkingStates steps={typical} stepMs={INSTANT} defaultCollapsed />,
        },
      ],
    },
    {
      label: 'Panel · content',
      states: [
        {
          id: 'panel-sources-linked',
          label: 'linked sources',
          render: () => (
            <ThinkingStates steps={[{ kind: 'search', label: 'Searched', sources: linked }, { label: 'Reading the sources' }]} stepMs={INSTANT} />
          ),
        },
        {
          id: 'panel-few-sources',
          label: 'three sources, no overflow',
          render: () => (
            <ThinkingStates steps={[{ kind: 'search', label: 'Searched', sources: linked.slice(0, 3) }, { label: 'Reading the sources' }]} stepMs={INSTANT} />
          ),
        },
        {
          id: 'panel-search-no-sources',
          label: 'search step, no sources',
          render: () => <ThinkingStates steps={[{ kind: 'search', label: 'Searched', sources: [] }, { label: 'Reading the sources' }]} stepMs={INSTANT} />,
        },
        { id: 'panel-long', label: 'long label and URL', render: () => <ThinkingStates steps={longSteps} stepMs={INSTANT} /> },
        { id: 'panel-many', label: 'twelve steps', render: () => <ThinkingStates steps={manySteps} stepMs={INSTANT} /> },
      ],
    },
    {
      label: 'Card variant',
      states: [
        { id: 'card-empty', label: 'no steps', render: () => <ThinkingStates variant="card" steps={[]} stepMs={INSTANT} /> },
        { id: 'card-first-step', label: 'running, first step', render: () => <ThinkingStates variant="card" steps={typical} stepMs={HOLD} /> },
        { id: 'card-done', label: 'finished', render: () => <ThinkingStates variant="card" steps={typical} stepMs={INSTANT} /> },
        { id: 'card-collapsed', label: 'collapsed, running', render: () => <ThinkingStates variant="card" steps={typical} stepMs={HOLD} defaultCollapsed /> },
        { id: 'card-collapsed-done', label: 'collapsed, finished', render: () => <ThinkingStates variant="card" steps={typical} stepMs={INSTANT} defaultCollapsed /> },
        { id: 'card-long', label: 'long label and URL', render: () => <ThinkingStates variant="card" steps={longSteps} stepMs={INSTANT} /> },
        { id: 'card-many', label: 'twelve steps', render: () => <ThinkingStates variant="card" steps={manySteps} stepMs={INSTANT} /> },
      ],
    },
  ],
  missing: [
    'Panel mid-run with several steps revealed and one still active: needs time to pass, no prop sets the revealed count',
    'Error / cancelled thinking: the component has no failure or stopped branch',
    'Stopped timer mid-run: the elapsed counter always keeps ticking until the last step',
    'Disabled / read-only: not exposed',
  ],
};

export default mod;
