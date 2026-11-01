import { AgentCard, Button } from 'oniva-ui';
import type { AgentCardProps } from 'oniva-ui';
import type { StateModule } from '../types';

const stats: NonNullable<AgentCardProps['stats']> = [
  { label: 'Runs', value: '1,284' },
  { label: 'Success', value: '97.4%' },
  { label: 'Avg cost', value: '$0.042' },
];

const tools = ['Ledger sync', 'Mail triage', 'Sheets export'];

const base: AgentCardProps = {
  name: 'Invoice Reconciler',
  role: 'Finance operations',
  description: 'Matches vendor invoices against purchase orders and flags variances over 2%.',
  status: 'working',
  model: 'Atlas 2',
  tools,
  stats,
};

const actions = (
  <>
    <Button size="sm" variant="secondary">
      Logs
    </Button>
    <Button size="sm">Open</Button>
  </>
);

const card = (over: Partial<AgentCardProps>) => () => <AgentCard {...base} {...over} />;

const mod: StateModule = {
  slug: 'agent-card',
  title: 'Agent card',
  width: 420,
  groups: [
    {
      label: 'Status',
      states: [
        { id: 'idle', label: 'idle (default)', render: card({ status: undefined, actions }) },
        { id: 'working', label: 'working', render: card({ status: 'working', actions }) },
        { id: 'waiting', label: 'waiting', render: card({ status: 'waiting', actions }) },
        {
          id: 'error',
          label: 'error',
          render: card({
            status: 'error',
            description: 'Stopped after the ledger export returned a 502 on the third retry.',
            actions,
          }),
        },
      ],
    },
    {
      label: 'Data',
      states: [
        { id: 'minimal', label: 'name and role only', render: () => <AgentCard name="Compliance Reviewer" role="Policy checks" /> },
        { id: 'no-description', label: 'no description', render: card({ description: undefined }) },
        { id: 'model-only', label: 'model, no tools', render: card({ tools: undefined }) },
        { id: 'tools-only', label: 'tools, no model', render: card({ model: undefined }) },
        { id: 'no-stats', label: 'no stats', render: card({ stats: undefined }) },
        { id: 'no-tags-no-stats', label: 'description only', render: card({ model: undefined, tools: undefined, stats: undefined }) },
        {
          id: 'two-stats',
          label: 'two stats',
          render: card({ stats: stats.slice(0, 2) }),
        },
        {
          id: 'many-stats',
          label: 'five stats (wraps to a second row)',
          render: card({
            stats: [
              ...stats,
              { label: 'Avg latency', value: '4.8 s' },
              { label: 'Tokens / run', value: '18,420' },
            ],
          }),
        },
        { id: 'with-actions', label: 'footer actions', render: card({ actions }) },
        { id: 'full', label: 'full card', render: card({ status: 'waiting', actions }) },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'long-name',
          label: 'long name and role',
          render: card({
            name: 'Quarterly Variance Reconciliation and Month-End Close Coordinator',
            role: 'Finance operations, accounts payable, vendor onboarding and intercompany settlement',
            actions,
          }),
        },
        {
          id: 'long-description',
          label: 'long description',
          render: card({
            description:
              'Matches vendor invoices against purchase orders and goods receipts, flags variances over 2%, drafts the follow-up to the supplier, queues anything above the approval limit for a human, and writes a short summary into the close checklist every Friday afternoon. Skips invoices from sandbox.northwind.example.',
          }),
        },
        {
          id: 'unbroken',
          label: 'unbroken text',
          render: card({
            name: 'finance-ops-invoice-reconciler-production-eu-west-1',
            role: 'northwind-labs/finance/invoice-reconciliation/eu-west-1/production',
            description: 'Reads from https://ledger.northwind.example/api/v2/vendors/invoices/pending?region=eu-west-1&page=1&limit=500',
            model: 'atlas-2-reasoning-extended-context-2026-03-preview',
            tools: ['northwind-ledger-sync-connector-with-long-name', 'Mail triage'],
            stats: [
              { label: 'Runs', value: '1,284,903' },
              { label: 'Success rate', value: '97.43%' },
              { label: 'Avg cost per run', value: '$0.04213' },
            ],
          }),
        },
        {
          id: 'many-tools',
          label: 'many tools (wrap)',
          render: card({
            tools: [
              'Ledger sync',
              'Mail triage',
              'Sheets export',
              'PO lookup',
              'Vendor directory',
              'Approval queue',
              'Calendar',
              'Doc search',
              'Chat digest',
              'Variance report',
            ],
          }),
        },
        { id: 'unicode', label: 'non-latin name', render: card({ name: '田中 請求書エージェント', role: '経理オペレーション', description: undefined }) },
      ],
    },
  ],
  missing: [
    'Loading / skeleton state (no isLoading prop)',
    'Disabled or read-only card (not interactive)',
    'Selected or pressable card (root is a plain div)',
    'Stat trend or delta indicator',
  ],
};
export default mod;
