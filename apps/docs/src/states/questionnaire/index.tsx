import { Questionnaire } from 'oniva-ui';
import type { Question } from 'oniva-ui';
import type { StateModule } from '../types';

const period: Question = {
  id: 'period',
  prompt: 'Which period should I analyze?',
  options: [
    { id: 'q3', label: 'Q3 2026', description: 'Jul 1 – Sep 30' },
    { id: 'ytd', label: 'Year to date', description: 'Jan 1 – Sep 30' },
    { id: 'trail', label: 'Trailing 12 months', description: 'Oct 1, 2025 – Sep 30, 2026' },
  ],
};

const cuts: Question = {
  id: 'cuts',
  prompt: 'How should I break it down?',
  multiple: true,
  options: [
    { id: 'segment', label: 'By segment' },
    { id: 'region', label: 'By region' },
    { id: 'rep', label: 'By sales rep' },
  ],
};

const format: Question = {
  id: 'format',
  prompt: 'What should the deliverable look like?',
  options: [
    { id: 'brief', label: 'One-page brief', description: 'Headline numbers and three takeaways' },
    { id: 'deck', label: 'Slide deck', description: 'Eight to twelve slides with charts' },
    { id: 'sheet', label: 'Spreadsheet', description: 'Raw tables, one tab per breakdown' },
  ],
};

const longPath =
  'packages/northwind-reports/src/pipelines/quarterly/revenue-attribution-by-region-and-segment-with-currency-normalisation.config.ts';

const longText: Question = {
  id: 'long',
  prompt:
    'The revenue attribution pipeline reads its settings from several places and they disagree on the fiscal calendar. Which source should I treat as the source of truth when the values conflict?',
  options: [
    {
      id: 'config',
      label: longPath,
      description: `Defined in ${longPath} and loaded at build time by the scheduler`,
    },
    {
      id: 'env',
      label: 'Environment variables set on the Northwind Labs production runner and overridden per deployment',
      description:
        'These change between staging and production, so results from the two environments may not match for the same period.',
    },
    { id: 'db', label: 'Finance warehouse', description: 'https://warehouse.northwind.example/fiscal-calendar/2026/periods?include=adjustments&version=latest' },
  ],
};

const manyOptions: Question = {
  id: 'regions',
  prompt: 'Which regions should be included?',
  multiple: true,
  options: [
    'North America',
    'Latin America',
    'United Kingdom and Ireland',
    'Nordics',
    'DACH',
    'Southern Europe',
    'Middle East',
    'Africa',
    'India',
    'Southeast Asia',
    'Japan',
    'Australia and New Zealand',
  ].map((label) => ({ id: label.toLowerCase().replace(/\W+/g, '-'), label })),
};

const mod: StateModule = {
  slug: 'questionnaire',
  title: 'Questionnaire',
  width: 480,
  groups: [
    {
      label: 'Data',
      states: [
        { id: 'no-questions', label: 'no questions', render: () => <Questionnaire questions={[]} /> },
        { id: 'single', label: 'one single-select', render: () => <Questionnaire questions={[period]} /> },
        { id: 'multi', label: 'one multi-select', render: () => <Questionnaire questions={[cuts]} /> },
        {
          id: 'typical',
          label: 'three questions',
          render: () => <Questionnaire questions={[period, cuts, format]} />,
        },
        {
          id: 'many-options',
          label: 'twelve options',
          render: () => <Questionnaire questions={[manyOptions]} />,
        },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'long-text', label: 'long prompt and labels', render: () => <Questionnaire questions={[longText]} /> },
        {
          id: 'no-descriptions',
          label: 'labels only',
          render: () => (
            <Questionnaire
              questions={[
                {
                  id: 'tone',
                  prompt: 'Which tone fits the summary?',
                  options: [{ id: 'plain', label: 'Plain' }, { id: 'formal', label: 'Formal' }, { id: 'upbeat', label: 'Upbeat' }],
                },
              ]}
            />
          ),
        },
        {
          id: 'custom-copy',
          label: 'custom title and submit label',
          render: () => (
            <Questionnaire title="Before I draft the plan" submitLabel="Send answers" questions={[period, cuts]} />
          ),
        },
      ],
    },
  ],
  missing: [
    'answered / partly answered (no defaultValue prop; answers are internal state only)',
    'submitted (no submitted or disabled prop; the form stays editable after Continue)',
    'disabled / read-only',
    'option with an icon or preselected recommendation',
    'free-text "Other" answer',
  ],
};

export default mod;
