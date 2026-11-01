import { PromptLibrary } from 'oniva-ui';
import type { SavedPrompt } from 'oniva-ui';
import type { StateModule } from '../types';

const typical: SavedPrompt[] = [
  { id: 'meeting', name: 'Summarize a meeting', tags: ['Notes'], template: 'Summarize the {meeting} in five bullets. List owners and due dates for every action item.', variables: { meeting: { description: 'meeting' } } },
  { id: 'release', name: 'Write release notes', tags: ['Product', 'Launch'], template: 'Write release notes for {product} {version} for {audience}. Keep the tone {tone} and group the changes into New, Improved and Fixed.', variables: { product: { default: 'Relay' }, tone: { default: 'friendly' }, version: { description: 'e.g. 2.4' } } },
  { id: 'error', name: 'Explain an error', tags: ['Debug'], template: 'Explain this {language} error in plain words and suggest the most likely fix.' },
  { id: 'cold', name: 'Draft a cold email', tags: ['Sales'], template: 'Draft a short email to {contact} at {company} about {offer}. End with one clear question.' },
];

const many: SavedPrompt[] = [
  ...typical,
  { id: 'review', name: 'Review a pull request', tags: ['Engineering'], template: 'Review the diff in {repo} for correctness, naming and missing tests. Group findings by severity.' },
  { id: 'standup', name: 'Standup digest', tags: ['Notes'], template: 'Turn these updates from {team} into a three-line standup digest: yesterday, today, blockers.' },
  { id: 'faq', name: 'Customer FAQ draft', tags: ['Support'], template: 'Write a customer FAQ for {feature} using the tone of voice of {brand}. Keep each answer under 60 words.' },
  { id: 'sql', name: 'Explain a SQL query', tags: ['Data'], template: 'Walk through this SQL query step by step and flag anything that could be slow on {table}.' },
  { id: 'okr', name: 'Draft quarterly OKRs', tags: ['Planning'], template: 'Draft three OKRs for {team} for {quarter}, each with two measurable key results.' },
  { id: 'postmortem', name: 'Incident postmortem', tags: ['Ops'], template: 'Write a blameless postmortem for the {incident} outage with timeline, root cause and follow-ups.' },
  { id: 'translate', name: 'Translate and localize', tags: ['Content'], template: 'Translate the text below into {language} and adapt idioms for readers in {region}.' },
  { id: 'persona', name: 'Interview script', tags: ['Research'], template: 'Write a 30 minute interview script for {persona} about how they use {product}.' },
];

const one: SavedPrompt[] = [typical[1]!];
const noVars: SavedPrompt[] = [{ id: 'tldr', name: 'One-line summary', tags: ['Notes'], template: 'Summarize the text below in one sentence a new teammate could follow.' }];
const noTags: SavedPrompt[] = [{ id: 'plain', name: 'Rewrite for clarity', template: 'Rewrite {text} so it is shorter and clearer without losing any facts.' }];
const filled: SavedPrompt[] = [
  { id: 'rn', name: 'Release notes', tags: ['Product'], template: 'Write release notes for {product} v{version}.', variables: { product: { default: 'Ledger' }, version: { default: '2.4' } } },
];
const required: SavedPrompt[] = [
  { id: 'rn', name: 'Release notes', tags: ['Product'], template: 'Write release notes for {product} v{version}. Group changes by area and keep it under 150 words.', variables: { product: { default: 'Ledger' }, version: { description: 'e.g. 2.4' } } },
  { id: 'out', name: 'Outreach email', tags: ['Sales'], template: 'Draft a short email to {contact} at {company} about renewing their plan before {date}.' },
];
const longPath = 'packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts';
const long: SavedPrompt[] = [
  {
    id: 'long',
    name: 'Audit the exponential backoff retry scheduler for the Northwind Labs billing pipeline',
    tags: ['Infrastructure-and-reliability'],
    template: `Audit {file} for retry storms. The default path is ${longPath}; compare it against {baseline} and report anything that exceeds {limit} attempts.`,
    variables: { file: { description: longPath } },
  },
  ...typical.slice(0, 2),
];

const mod: StateModule = {
  slug: 'prompt-library',
  title: 'Prompt library',
  width: 720,
  groups: [
    {
      label: 'List',
      states: [
        { id: 'list-empty', label: 'list, no prompts', render: () => <PromptLibrary prompts={[]} /> },
        { id: 'list-one', label: 'list, one prompt', render: () => <PromptLibrary prompts={one} /> },
        { id: 'list-typical', label: 'list, typical', render: () => <PromptLibrary prompts={typical} /> },
        { id: 'list-many', label: 'list, many prompts', render: () => <PromptLibrary prompts={many} /> },
        { id: 'list-long', label: 'list, long names and tags', render: () => <PromptLibrary prompts={long} /> },
        { id: 'list-no-tags', label: 'list, no tags', render: () => <PromptLibrary prompts={noTags} /> },
        { id: 'list-title', label: 'list, custom title', render: () => <PromptLibrary title="Team prompts" prompts={typical} /> },
      ],
    },
    {
      label: 'Split',
      states: [
        { id: 'split-empty', label: 'split, no prompts', render: () => <PromptLibrary variant="split" prompts={[]} /> },
        { id: 'split-first', label: 'split, first selected', render: () => <PromptLibrary variant="split" prompts={typical} /> },
        { id: 'split-defaults', label: 'split, defaults partly filled', render: () => <PromptLibrary variant="split" defaultSelectedId="release" prompts={typical} /> },
        { id: 'split-all-filled', label: 'split, all variables filled', render: () => <PromptLibrary variant="split" prompts={filled} /> },
        { id: 'split-no-vars', label: 'split, no variables', render: () => <PromptLibrary variant="split" prompts={noVars} /> },
        { id: 'split-one', label: 'split, one prompt', render: () => <PromptLibrary variant="split" prompts={one} /> },
        { id: 'split-many', label: 'split, many prompts', render: () => <PromptLibrary variant="split" defaultSelectedId="sql" prompts={many} /> },
        { id: 'split-long', label: 'split, long names and path', render: () => <PromptLibrary variant="split" prompts={long} /> },
        { id: 'split-no-tags', label: 'split, no tags', render: () => <PromptLibrary variant="split" prompts={noTags} /> },
        { id: 'split-narrow', label: 'split, narrow container', render: () => <div style={{ width: 400 }}><PromptLibrary variant="split" prompts={typical} defaultSelectedId="cold" /></div> },
      ],
    },
    {
      label: 'Required',
      states: [
        { id: 'required-list', label: 'list, requireAll', render: () => <PromptLibrary requireAll prompts={required} /> },
        { id: 'required-split-missing', label: 'split, requireAll, missing', render: () => <PromptLibrary variant="split" requireAll prompts={required} /> },
        { id: 'required-split-ready', label: 'split, requireAll, ready', render: () => <PromptLibrary variant="split" requireAll prompts={filled} /> },
        { id: 'use-label', label: 'split, custom use label', render: () => <PromptLibrary variant="split" useLabel="Insert in chat" prompts={typical} /> },
      ],
    },
  ],
  missing: [
    'List row expanded (open is internal state with no default prop)',
    'Search with no matches (query is internal state)',
    'Copied confirmation (needs a click)',
    'Use stays disabled until filled shown with a list row open',
  ],
};

export default mod;
