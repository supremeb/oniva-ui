import { ContextWindow, CpuIcon } from 'oniva-ui';
import type { ContextPart } from 'oniva-ui';
import type { StateModule } from '../types';

const noop = () => {};

const files: ContextPart = {
  id: 'files',
  label: 'Files',
  items: [
    { id: 'schema', label: 'schema.prisma', tokens: 9400 },
    { id: 'billing', label: 'billing.ts', tokens: 21300 },
    { id: 'notes', label: 'meeting-notes.md', tokens: 15400 },
  ],
};

const typical: ContextPart[] = [
  { id: 'system', label: 'System prompt', tokens: 4200, locked: true },
  { id: 'tools', label: 'Tools', tokens: 12800 },
  files,
  { id: 'chat', label: 'Conversation', tokens: 62600, compact: true },
  { id: 'memory', label: 'Memory', tokens: 3900 },
];

const withChat = (tokens: number): ContextPart[] => typical.map((p) => (p.id === 'chat' ? { ...p, tokens } : p));

const longNames: ContextPart[] = [
  { id: 'system', label: 'System prompt', tokens: 4200, locked: true },
  {
    id: 'files',
    label: 'Attached project files from the northwind-billing-service repository',
    items: [
      { id: 'a', label: 'packages/northwind-billing/src/invoices/reconciliation/ledger-entry-reconciler.worker.ts', tokens: 18200 },
      { id: 'b', label: 'https://docs.northwind.example/billing/guides/usage-based-pricing-and-proration-rules', tokens: 7400 },
      { id: 'c', label: 'Q3-2026-quarterly-business-review-meeting-notes-final-v7.md', tokens: 5100 },
    ],
  },
  { id: 'chat', label: 'Conversation history with the billing migration assistant', tokens: 41800, compact: true },
];

const manyFiles: ContextPart[] = [
  { id: 'system', label: 'System prompt', tokens: 4200, locked: true },
  {
    id: 'files',
    label: 'Files',
    items: [
      'schema.prisma',
      'billing.ts',
      'invoice.service.ts',
      'invoice.service.test.ts',
      'ledger.ts',
      'webhooks/payment-events.ts',
      'webhooks/retry-policy.ts',
      'package.json',
      'tsconfig.json',
      'README.md',
      'CHANGELOG.md',
      'docs/architecture.md',
    ].map((label, i) => ({ id: `f${i}`, label, tokens: 1200 + ((i * 2791) % 9000) })),
  },
  { id: 'chat', label: 'Conversation', tokens: 38400, compact: true },
];

const mod: StateModule = {
  slug: 'context-window',
  title: 'Context window',
  width: 360,
  groups: [
    {
      label: 'Fill',
      states: [
        { id: 'empty', label: 'no parts', render: () => <ContextWindow parts={[]} limit={200_000} model="Atlas 2" /> },
        {
          id: 'one-part',
          label: 'one part',
          render: () => <ContextWindow parts={[{ id: 'system', label: 'System prompt', tokens: 4200, locked: true }]} limit={200_000} model="Atlas 2" />,
        },
        {
          id: 'typical',
          label: 'typical, files open',
          render: () => <ContextWindow parts={typical} limit={200_000} model="Atlas 2" defaultOpen={['files']} action={{ label: 'New chat', onClick: noop }} />,
        },
        {
          id: 'collapsed',
          label: 'typical, collapsed',
          render: () => <ContextWindow parts={typical} limit={200_000} model="Nova Pro" />,
        },
        {
          id: 'warning',
          label: 'warning (85%)',
          render: () => <ContextWindow parts={withChat(103_000)} limit={200_000} model="Atlas 2" action={{ label: 'New chat', onClick: noop }} />,
        },
        {
          id: 'full',
          label: 'full (97%)',
          render: () => <ContextWindow parts={withChat(98_000)} limit={170_000} model="Quill Reasoner" action={{ label: 'New chat', onClick: noop }} />,
        },
        {
          id: 'over-limit',
          label: 'over the limit',
          render: () => <ContextWindow parts={withChat(150_000)} limit={200_000} model="Lumen Fast" action={{ label: 'New chat', onClick: noop }} />,
        },
        {
          id: 'tiny-parts',
          label: 'tiny parts beside a big one',
          render: () => (
            <ContextWindow
              limit={200_000}
              parts={[
                { id: 'system', label: 'System prompt', tokens: 120, locked: true },
                { id: 'tools', label: 'Tools', tokens: 340 },
                { id: 'chat', label: 'Conversation', tokens: 96_000, compact: true },
                { id: 'memory', label: 'Memory', tokens: 0 },
              ]}
            />
          ),
        },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'long-names',
          label: 'long labels and URLs',
          render: () => <ContextWindow parts={longNames} limit={128_000} model="Quill Reasoner with extended thinking budget" defaultOpen={['files']} />,
        },
        {
          id: 'many-items',
          label: 'twelve files open',
          render: () => <ContextWindow parts={manyFiles} limit={128_000} model="Nova Pro" defaultOpen={['files']} />,
        },
        {
          id: 'icon-title',
          label: 'custom title and model icon',
          render: () => <ContextWindow parts={typical} limit={200_000} title="Session memory" model="Lumen Fast" modelIcon={<CpuIcon size={12} aria-hidden="true" />} />,
        },
        {
          id: 'no-model',
          label: 'no model, no action',
          render: () => <ContextWindow parts={typical} limit={200_000} />,
        },
      ],
    },
    {
      label: 'Layout',
      states: [
        {
          id: 'narrow',
          label: 'narrow container (280)',
          render: () => (
            <div style={{ width: 280 }}>
              <ContextWindow parts={typical} limit={200_000} model="Quill Reasoner" defaultOpen={['files']} action={{ label: 'New chat', onClick: noop }} />
            </div>
          ),
        },
        {
          id: 'small-field',
          label: 'custom cells and columns',
          render: () => <ContextWindow parts={typical} limit={200_000} model="Atlas 2" cells={96} columns={24} />,
        },
        {
          id: 'custom-colors',
          label: 'custom palette slots',
          render: () => (
            <ContextWindow
              limit={200_000}
              parts={[
                { id: 'a', label: 'System prompt', tokens: 20_000, color: 6, locked: true },
                { id: 'b', label: 'Retrieved docs', tokens: 40_000, color: 5 },
                { id: 'c', label: 'Conversation', tokens: 50_000, color: 2, compact: true },
              ]}
            />
          ),
        },
      ],
    },
  ],
  missing: [
    'compacting (shimmering cells): reached only by pressing Compact, which runs a timer and a promise; no prop starts it',
    'compacted confirmation (green check): same, only after a Compact press',
    'item removed / part shrunk: only after pressing Remove or Compact',
    'hover highlight on a part: pointer-only, no prop',
  ],
};

export default mod;
