import { Suggestions } from 'oniva-ui';
import type { StateModule } from '../types';

const typical = [
  'Summarize this PR',
  'Find risky changes',
  'Draft review comments',
  'Compare p95 latency',
  'Explain the retry logic',
  'Suggest tests',
];

const few = ['Summarize this PR', 'Suggest tests'];

const many = [
  ...typical,
  'List open questions',
  'Write the release notes',
  'Check migration order',
  'Trace the failing job',
  'Estimate review time',
  'Find unused exports',
  'Compare with last release',
  'Draft a rollback plan',
];

const mod: StateModule = {
  slug: 'suggestions',
  title: 'Suggestions',
  width: 420,
  groups: [
    {
      label: 'Data',
      states: [
        { id: 'empty', label: 'empty', render: () => <Suggestions aria-label="Suggested prompts" suggestions={[]} /> },
        { id: 'one', label: 'one suggestion', render: () => <Suggestions aria-label="Suggested prompts" suggestions={['Summarize this PR']} /> },
        { id: 'fits', label: 'two, fits the row', render: () => <Suggestions aria-label="Suggested prompts" suggestions={few} /> },
        { id: 'typical', label: 'typical set (scrolls)', render: () => <Suggestions aria-label="Suggested prompts" suggestions={typical} /> },
        { id: 'many', label: 'long set (scrolls)', render: () => <Suggestions aria-label="Suggested prompts" suggestions={many} /> },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'long-label',
          label: 'long sentence',
          render: () => (
            <Suggestions
              aria-label="Suggested prompts"
              suggestions={[
                'Summarize every change in the retry scheduler since the last release and flag anything that touches the queue config',
                'Suggest tests',
              ]}
            />
          ),
        },
        {
          id: 'long-path',
          label: 'unbroken path',
          render: () => (
            <Suggestions
              aria-label="Suggested prompts"
              suggestions={['Review packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts', 'Explain it']}
            />
          ),
        },
        {
          id: 'numbers',
          label: 'numbers and symbols',
          render: () => <Suggestions aria-label="Suggested prompts" suggestions={['Compare p95 latency: 412 ms vs 380 ms', 'Why did 1,284 jobs retry?', 'Top 5 slow routes']} />,
        },
      ],
    },
  ],
  missing: [
    'selected / active chip (component has no selected state)',
    'disabled chips (no disabled prop)',
    'loading suggestions (no loading prop)',
    'icons or descriptions on chips (strings only)',
  ],
};

export default mod;
