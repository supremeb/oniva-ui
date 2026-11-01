import { MemoryPanel } from 'oniva-ui';
import type { AgentMemory } from 'oniva-ui';
import type { StateModule } from '../types';

const typical: AgentMemory[] = [
  { id: '1', text: 'Likes short answers first, details only when asked', category: 'Preferences', source: 'You added', date: 'Oct 2', paused: true },
  { id: '2', text: 'Designs with a 4px spacing grid and one sans typeface', category: 'Preferences', source: 'From design tool', date: 'Oct 7' },
  { id: '3', text: 'Product designer and front-end developer at Northwind Labs', category: 'Work', source: 'From chat', date: 'Sep 28' },
  { id: '4', text: 'Ships with React and Vite; deploys to a managed edge host', category: 'Work', source: 'From chat', date: 'Oct 3' },
  { id: '5', text: 'Reviews pull requests on Friday mornings', category: 'Work', source: 'From chat', date: 'Oct 5' },
  { id: '6', text: 'Building a budgeting app for freelancers', category: 'Projects', source: 'From chat', date: 'Oct 9' },
  { id: '7', text: 'Writing a short guide on design tokens', category: 'Projects', source: 'You added', date: 'Oct 10' },
];

const many: AgentMemory[] = [
  ...typical,
  ...Array.from({ length: 10 }, (_, i): AgentMemory => ({
    id: `x${i}`,
    text: [
      'Prefers metric units in recipes',
      'Standup is at 9:30 on weekdays, Berlin time',
      'Uses pnpm workspaces for every monorepo',
      'Keeps release notes in CHANGELOG.md',
      'Wants commit messages in the imperative mood',
      'Allergic to peanuts, avoid them in meal plans',
      'Tests with Vitest and Playwright',
      'Works from northwind-labs.example on Tuesdays',
      'Likes tables over bullet lists for comparisons',
      'Reads docs in dark mode',
    ][i]!,
    category: ['Preferences', 'Work', 'Projects'][i % 3],
    source: 'From chat',
    date: `Oct ${11 + i}`,
  })),
];

const longMemory: AgentMemory[] = [
  {
    id: 'l1',
    text: 'Deploys the billing service from packages/northwind-billing/src/workers/reconciliation/nightly-ledger-reconciliation-with-retry-and-backoff.worker.ts and expects every run to be logged to https://logs.northwind-labs.example/billing/reconciliation/2025/10/nightly',
    category: 'Work',
    source: 'From chat',
    date: 'Oct 12',
  },
  {
    id: 'l2',
    text: 'supercalifragilisticexpialidocious_configuration_key_that_never_breaks_at_all_even_on_narrow_columns',
    category: 'Work',
    source: 'You added with a very long source label that keeps going',
    date: 'Oct 13',
  },
  { id: 'l3', text: 'Short one', category: 'Preferences', source: 'From chat', date: 'Oct 14' },
];

const noCategory: AgentMemory[] = typical.slice(0, 3).map(({ category: _c, ...m }) => m);
const oneCategory: AgentMemory[] = typical.filter((m) => m.category === 'Work');
const allPaused: AgentMemory[] = typical.slice(0, 4).map((m) => ({ ...m, paused: true }));
const mixedCategory: AgentMemory[] = [...typical.slice(0, 4), { id: 'u1', text: 'Prefers to be addressed by first name', source: 'From chat', date: 'Oct 15' }];

const noop = () => undefined;
const full = { onEdit: noop, onForget: noop, onRestore: noop, onPause: noop, onAdd: noop };

const mod: StateModule = {
  slug: 'memory-panel',
  title: 'Memory panel',
  width: 520,
  groups: [
    {
      label: 'Data (cards)',
      states: [
        { id: 'empty', label: 'empty', render: () => <MemoryPanel memories={[]} /> },
        { id: 'empty-addable', label: 'empty with New memory', render: () => <MemoryPanel memories={[]} onAdd={noop} /> },
        { id: 'one', label: 'one memory', render: () => <MemoryPanel memories={typical.slice(1, 2)} {...full} /> },
        { id: 'typical', label: 'typical (3 categories)', render: () => <MemoryPanel memories={typical} {...full} /> },
        { id: 'many', label: 'many (scrolls)', render: () => <MemoryPanel memories={many} {...full} /> },
        { id: 'read-only', label: 'read-only (no handlers)', render: () => <MemoryPanel memories={typical} /> },
        { id: 'no-categories', label: 'no categories', render: () => <MemoryPanel memories={noCategory} {...full} /> },
        { id: 'one-category', label: 'one category (no chips)', render: () => <MemoryPanel memories={oneCategory} {...full} /> },
        { id: 'all-paused', label: 'all paused', render: () => <MemoryPanel memories={allPaused} {...full} /> },
        { id: 'custom-title', label: 'custom title', render: () => <MemoryPanel title="What Atlas 2 remembers" memories={typical.slice(0, 3)} {...full} /> },
      ],
    },
    {
      label: 'Content (cards)',
      states: [
        { id: 'long-text', label: 'long text and unbroken strings', render: () => <MemoryPanel memories={longMemory} {...full} /> },
      ],
    },
    {
      label: 'Access (cards)',
      states: [
        { id: 'switch-off', label: 'memory off', render: () => <MemoryPanel memories={typical} defaultEnabled={false} {...full} /> },
        { id: 'switch-off-controlled', label: 'memory off, controlled', render: () => <MemoryPanel memories={typical} isEnabled={false} onEnabledChange={noop} {...full} /> },
      ],
    },
    {
      label: 'Data (grouped)',
      states: [
        { id: 'grouped-empty', label: 'empty', render: () => <MemoryPanel variant="grouped" memories={[]} /> },
        { id: 'grouped-empty-addable', label: 'empty with New memory', render: () => <MemoryPanel variant="grouped" memories={[]} onAdd={noop} /> },
        { id: 'grouped-one', label: 'one memory', render: () => <MemoryPanel variant="grouped" memories={typical.slice(1, 2)} {...full} /> },
        { id: 'grouped-typical', label: 'typical (3 categories)', render: () => <MemoryPanel variant="grouped" memories={typical} {...full} /> },
        { id: 'grouped-many', label: 'many (scrolls)', render: () => <MemoryPanel variant="grouped" memories={many} {...full} /> },
        { id: 'grouped-read-only', label: 'read-only (no handlers)', render: () => <MemoryPanel variant="grouped" memories={typical} /> },
        { id: 'grouped-no-categories', label: 'no categories (Other)', render: () => <MemoryPanel variant="grouped" memories={noCategory} {...full} /> },
        { id: 'grouped-one-category', label: 'one category (no chips)', render: () => <MemoryPanel variant="grouped" memories={oneCategory} {...full} /> },
        { id: 'grouped-uncategorised', label: 'with uncategorised (Other)', render: () => <MemoryPanel variant="grouped" memories={mixedCategory} {...full} /> },
        { id: 'grouped-all-paused', label: 'all paused', render: () => <MemoryPanel variant="grouped" memories={allPaused} {...full} /> },
      ],
    },
    {
      label: 'Content and access (grouped)',
      states: [
        { id: 'grouped-long-text', label: 'long text and unbroken strings', render: () => <MemoryPanel variant="grouped" memories={longMemory} {...full} /> },
        { id: 'grouped-switch-off', label: 'memory off', render: () => <MemoryPanel variant="grouped" memories={typical} defaultEnabled={false} {...full} /> },
      ],
    },
  ],
  missing: [
    'Editing a row, adding a memory, searching, category filtering, forget and Undo (all need internal interaction; no default* prop reaches them)',
    'Loading or error state (no such props)',
  ],
};
export default mod;
