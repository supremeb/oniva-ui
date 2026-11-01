import { AutonomyDial, DatabaseIcon, FileTextIcon, BranchIcon, MailIcon, SendIcon, TrashIcon, WalletIcon } from 'oniva-ui';
import type { AgentAction } from 'oniva-ui';
import type { StateModule } from '../types';

const actions: AgentAction[] = [
  { id: 'read', label: 'Read files and docs', risk: 'safe', icon: <FileTextIcon size={18} /> },
  { id: 'draft', label: 'Draft emails', risk: 'safe', icon: <MailIcon size={18} /> },
  { id: 'crm', label: 'Update CRM records', risk: 'risky', icon: <DatabaseIcon size={18} /> },
  { id: 'send', label: 'Send emails', risk: 'risky', icon: <SendIcon size={18} /> },
  { id: 'delete', label: 'Delete files', risk: 'destructive', icon: <TrashIcon size={18} /> },
  { id: 'spend', label: 'Spend money', risk: 'destructive', icon: <WalletIcon size={18} /> },
];

const withDetail: AgentAction[] = [
  { id: 'read', label: 'Read files and docs', detail: 'Shared drive, wiki', risk: 'safe', icon: <FileTextIcon size={18} /> },
  { id: 'branch', label: 'Push to a branch', detail: 'northwind/*', risk: 'risky', icon: <BranchIcon size={18} /> },
  { id: 'send', label: 'Send emails', detail: 'From ops@northwind.example', risk: 'risky', icon: <SendIcon size={18} /> },
  { id: 'spend', label: 'Spend money', detail: 'Up to $250 per task', risk: 'destructive', icon: <WalletIcon size={18} /> },
];

const long: AgentAction[] = [
  {
    id: 'l1',
    label: 'Rewrite every customer-facing renewal reminder template across all regions and languages',
    detail: 'workspaces/northwind-labs/templates/renewals/emea/de-DE/reminder-30-days-before-expiry.html',
    risk: 'risky',
    icon: <MailIcon size={18} />,
  },
  {
    id: 'l2',
    label: 'Delete archived exports older than ninety days from the shared reporting bucket',
    detail: 's3://northwind-reporting.example/exports/archive/2024/q1/customer-usage-detail-full.parquet',
    risk: 'destructive',
    icon: <TrashIcon size={18} />,
  },
  { id: 'l3', label: 'ThisIsAnUnbrokenActionLabelThatKeepsGoingWithoutAnySpacesToTestWrapping', risk: 'safe', icon: <FileTextIcon size={18} /> },
];

const many: AgentAction[] = [
  ...actions,
  { id: 'm1', label: 'Create calendar events', risk: 'safe', icon: <FileTextIcon size={18} /> },
  { id: 'm2', label: 'Reschedule meetings', risk: 'risky', icon: <FileTextIcon size={18} /> },
  { id: 'm3', label: 'Post to #announcements', risk: 'risky', icon: <SendIcon size={18} /> },
  { id: 'm4', label: 'Archive old threads', risk: 'safe', icon: <MailIcon size={18} /> },
  { id: 'm5', label: 'Export customer list', risk: 'risky', icon: <DatabaseIcon size={18} /> },
  { id: 'm6', label: 'Revoke API keys', risk: 'destructive', icon: <TrashIcon size={18} /> },
  { id: 'm7', label: 'Issue refunds', risk: 'destructive', icon: <WalletIcon size={18} /> },
  { id: 'm8', label: 'Summarise support tickets', risk: 'safe', icon: <FileTextIcon size={18} /> },
];

const mod: StateModule = {
  slug: 'autonomy-dial',
  title: 'Autonomy dial',
  width: 600,
  groups: [
    {
      label: 'Level',
      states: [
        { id: 'always-ask', label: 'always ask', render: () => <AutonomyDial title="Sales agent" defaultLevel={0} actions={actions} /> },
        { id: 'if-risky', label: 'if risky (default)', render: () => <AutonomyDial title="Sales agent" actions={actions} /> },
        { id: 'full-auto', label: 'full auto', render: () => <AutonomyDial title="Sales agent" defaultLevel={2} actions={actions} /> },
        {
          id: 'full-auto-pinned',
          label: 'full auto, one locked',
          render: () => <AutonomyDial title="Sales agent" defaultLevel={2} actions={actions} defaultPinned={['spend']} />,
        },
        {
          id: 'if-risky-pinned',
          label: 'if risky, safe action locked',
          render: () => <AutonomyDial title="Sales agent" actions={actions} defaultPinned={['read', 'delete']} />,
        },
      ],
    },
    {
      label: 'Data',
      states: [
        { id: 'empty', label: 'no actions', render: () => <AutonomyDial actions={[]} /> },
        {
          id: 'one-action',
          label: 'one action',
          render: () => <AutonomyDial actions={[actions[3]!]} />,
        },
        { id: 'only-safe', label: 'only safe actions (full auto: asks none)', render: () => <AutonomyDial defaultLevel={2} actions={actions.slice(0, 2)} /> },
        { id: 'with-detail', label: 'with detail text', render: () => <AutonomyDial title="Ops agent" defaultLevel={1} actions={withDetail} /> },
        {
          id: 'no-icons',
          label: 'no icons',
          render: () => <AutonomyDial actions={actions.map(({ icon: _icon, ...a }) => a)} />,
        },
        { id: 'many', label: 'many actions (14)', render: () => <AutonomyDial title="Workspace agent" actions={many} defaultPinned={['m7']} /> },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'long-text', label: 'long labels and details', render: () => <AutonomyDial actions={long} defaultLevel={1} /> },
        {
          id: 'long-title',
          label: 'long title and subtitle',
          render: () => (
            <AutonomyDial
              title="Northwind Labs customer success and renewals automation agent"
              subtitle="Choose which of the actions below the agent may take without checking with you first, per workspace"
              actions={actions}
            />
          ),
        },
      ],
    },
  ],
};

export default mod;
