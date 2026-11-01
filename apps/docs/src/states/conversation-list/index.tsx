import { ConversationList } from 'oniva-ui';
import type { Thread } from 'oniva-ui';
import type { StateModule } from '../types';

const typical: Thread[] = [
  { id: 't1', title: 'Q3 board deck review', preview: 'Revenue slide needs the NRR footnote', time: '2h', pinned: true },
  { id: 't2', title: 'Vendor onboarding checklist', preview: 'W-9 and bank verification are done', time: '5h', pinned: true },
  { id: 't3', title: 'Refund policy edge cases', preview: 'What if the charge is older than 90 days?', time: '1d' },
  { id: 't4', title: 'Draft: Series A data room index', preview: 'Folder structure proposal', time: '2d' },
  { id: 't5', title: 'Churn cohort analysis', preview: 'SQL for monthly retention', time: '4d' },
];

const long: Thread[] = [
  {
    id: 'l1',
    title: 'Reconcile the Northwind Labs quarterly invoice export against the ledger for the EMEA subsidiaries',
    preview: 'packages/northwind-billing/src/reconciliation/strategies/ledger-to-invoice-matching.worker.ts failed on row 4,128',
    time: '12m',
    pinned: true,
  },
  {
    id: 'l2',
    title: 'https://docs.northwind.example/guides/billing/usage-based-pricing/metering-and-rollups/overview',
    preview: 'https://status.northwind.example/incidents/2026-10-27-delayed-webhook-delivery-eu-west',
    time: '3h',
  },
  { id: 'l3', title: 'Short thread', preview: 'Ok', time: '6d' },
];

const many: Thread[] = Array.from({ length: 24 }, (_, i) => {
  const titles = [
    'Q3 board deck review',
    'Vendor onboarding checklist',
    'Refund policy edge cases',
    'Series A data room index',
    'Churn cohort analysis',
    'Pricing page copy pass',
    'Incident review: delayed webhooks',
    'Hiring plan for platform team',
  ];
  return {
    id: `m${i}`,
    title: `${titles[i % titles.length]}${i >= titles.length ? ` (${Math.floor(i / titles.length) + 1})` : ''}`,
    preview: i % 3 === 0 ? undefined : 'Latest reply from Atlas 2 is ready to review',
    time: i < 6 ? `${i + 1}h` : `${i - 4}d`,
    pinned: i < 2,
  };
});

const mod: StateModule = {
  slug: 'conversation-list',
  title: 'Conversation list',
  width: 320,
  groups: [
    {
      label: 'Data',
      states: [
        { id: 'empty', label: 'empty', render: () => <ConversationList threads={[]} /> },
        {
          id: 'one-thread',
          label: 'one thread',
          render: () => <ConversationList threads={[typical[2]!]} />,
        },
        { id: 'typical', label: 'pinned and recent, active', render: () => <ConversationList threads={typical} activeId="t3" /> },
        {
          id: 'recent-only',
          label: 'no pinned',
          render: () => <ConversationList threads={typical.map((t) => ({ ...t, pinned: false }))} activeId="t1" />,
        },
        {
          id: 'pinned-only',
          label: 'only pinned',
          render: () => <ConversationList threads={typical.slice(0, 2)} />,
        },
        { id: 'many', label: 'long list', render: () => <ConversationList threads={many} activeId="m4" /> },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'bare',
          label: 'titles only',
          render: () => <ConversationList threads={typical.map(({ id, title }) => ({ id, title }))} activeId="t2" />,
        },
        { id: 'long-text', label: 'long titles and URLs', render: () => <ConversationList threads={long} activeId="l1" /> },
        {
          id: 'no-time',
          label: 'preview, no time',
          render: () => <ConversationList threads={typical.map(({ time: _t, ...t }) => t)} />,
        },
      ],
    },
  ],
  missing: [
    'search with no matches (needs typing into the search box; the query is internal state)',
    'inline rename (needs a click on the pencil; no default prop)',
    'loading / skeleton (the component has no loading branch)',
  ],
};

export default mod;
