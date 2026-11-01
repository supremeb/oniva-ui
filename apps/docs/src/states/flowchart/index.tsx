import { Flowchart, BellIcon, DatabaseIcon, BranchIcon, MailIcon, WebhookIcon } from 'oniva-ui';
import type { FlowNode } from 'oniva-ui';
import type { StateModule } from '../types';

const trigger: FlowNode = {
  id: 'trigger',
  kind: 'trigger',
  title: 'Invoice overdue',
  description: 'Runs when an invoice passes its due date',
  icon: <DatabaseIcon size={18} />,
};
const condition: FlowNode = {
  id: 'if',
  kind: 'condition',
  title: 'Invoice matches',
  conditions: [
    { id: 'c1', join: 'If', subject: 'invoice', field: 'amount', operator: 'is over', value: '$2,400', valueTone: 'warning' },
    { id: 'c2', join: 'and', subject: 'customer', field: 'plan', operator: 'is', value: 'Enterprise', valueTone: 'info' },
  ],
};
const action: FlowNode = {
  id: 'act',
  kind: 'action',
  title: 'Email the account owner',
  description: 'Send reminder from billing@northwind.example',
  icon: <MailIcon size={18} />,
};
const flow = [trigger, condition, action];

const withStatus = (statuses: Array<FlowNode['status']>): FlowNode[] => flow.map((n, i) => ({ ...n, status: statuses[i] }));

const longFlow: FlowNode[] = [
  trigger,
  condition,
  { id: 'a1', kind: 'action', title: 'Create ticket', description: 'Open a ticket in the finance queue', icon: <WebhookIcon size={18} /> },
  { id: 'a2', kind: 'action', title: 'Notify #collections', description: 'Post a summary to the channel', icon: <BellIcon size={18} /> },
  { id: 'if2', kind: 'condition', title: 'Still unpaid after 7 days', conditions: [{ id: 'd1', join: 'If', subject: 'invoice', field: 'status', operator: 'is', value: 'Overdue', valueTone: 'danger' }] },
  { id: 'a3', kind: 'action', title: 'Escalate to finance lead', icon: <BranchIcon size={18} /> },
  { id: 'a4', kind: 'action', title: 'Pause the subscription', description: 'Set the account to read-only', icon: <DatabaseIcon size={18} /> },
  { id: 'a5', kind: 'action', title: 'Archive the thread', icon: <MailIcon size={18} /> },
];

const longPath = 'warehouse/northwind-labs/exports/2026/q3/invoices/overdue/enterprise-accounts-by-region-final-v2.csv';

const mod: StateModule = {
  slug: 'flowchart',
  title: 'Flowchart',
  width: 720,
  groups: [
    {
      label: 'Data',
      states: [
        { id: 'empty', label: 'no nodes', render: () => <Flowchart nodes={[]} /> },
        { id: 'one-node', label: 'one node', render: () => <Flowchart nodes={[trigger]} /> },
        { id: 'typical', label: 'trigger, condition, action', render: () => <Flowchart nodes={flow} /> },
        { id: 'long-flow', label: 'eight nodes', render: () => <Flowchart nodes={longFlow} /> },
        { id: 'no-icons', label: 'nodes without icons', render: () => <Flowchart nodes={flow.map((n) => ({ ...n, icon: undefined }))} /> },
      ],
    },
    {
      label: 'Run',
      states: [
        { id: 'idle', label: 'idle, all statuses idle', render: () => <Flowchart nodes={withStatus(['idle', 'idle', 'idle'])} /> },
        { id: 'running', label: 'running, pulse on connectors', render: () => <Flowchart nodes={withStatus(['done', 'running', undefined])} activeId="if" isRunning /> },
        { id: 'node-running', label: 'one node running', render: () => <Flowchart nodes={withStatus(['done', 'running', undefined])} activeId="if" /> },
        { id: 'done', label: 'all done', render: () => <Flowchart nodes={withStatus(['done', 'done', 'done'])} /> },
        { id: 'active-last', label: 'active last node', render: () => <Flowchart nodes={flow} activeId="act" /> },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'long-text',
          label: 'long title and description',
          render: () => (
            <Flowchart
              nodes={[
                { ...trigger, title: 'When a customer on any Enterprise or Scale plan has an invoice that is more than fourteen days overdue', description: 'Runs on the first business day after the due date and again every Monday until the invoice is settled or voided' },
                action,
              ]}
            />
          ),
        },
        {
          id: 'unbroken',
          label: 'unbroken path in title and value',
          render: () => (
            <Flowchart
              nodes={[
                { ...trigger, title: longPath, description: longPath },
                {
                  ...condition,
                  conditions: [{ id: 'c1', join: 'If', subject: 'file', field: 'path', operator: 'is', value: longPath, valueTone: 'accent' }],
                },
                action,
              ]}
            />
          ),
        },
        {
          id: 'many-conditions',
          label: 'many conditions',
          render: () => (
            <Flowchart
              nodes={[
                trigger,
                {
                  ...condition,
                  conditions: [
                    { id: 'c1', join: 'If', subject: 'invoice', field: 'amount', operator: 'is over', value: '$2,400', valueTone: 'warning' },
                    { id: 'c2', join: 'and', subject: 'customer', field: 'plan', operator: 'is', value: 'Enterprise', valueTone: 'info' },
                    { id: 'c3', join: 'and', subject: 'customer', field: 'region', operator: 'is not', value: 'Northwind Labs internal accounts', valueTone: 'danger' },
                    { id: 'c4', join: 'or', subject: 'invoice', field: 'days overdue', operator: 'is over', value: '30', valueTone: 'success' },
                    { id: 'c5', join: 'or', field: 'contact', operator: 'is empty' },
                  ],
                },
                action,
              ]}
            />
          ),
        },
        {
          id: 'custom-tags',
          label: 'custom tag text',
          render: () => <Flowchart nodes={[{ ...trigger, tag: 'Webhook' }, { ...condition, tag: 'Else' }, { ...action, tag: 'Notify' }]} />,
        },
      ],
    },
    {
      label: 'Tone',
      states: [
        {
          id: 'value-tones',
          label: 'all value tones',
          render: () => (
            <Flowchart
              nodes={[
                {
                  ...condition,
                  conditions: [
                    { id: 't1', join: 'If', field: 'status', operator: 'is', value: 'Draft', valueTone: 'accent' },
                    { id: 't2', join: 'or', field: 'status', operator: 'is', value: 'Paid', valueTone: 'success' },
                    { id: 't3', join: 'or', field: 'status', operator: 'is', value: 'Due soon', valueTone: 'warning' },
                    { id: 't4', join: 'or', field: 'status', operator: 'is', value: 'Overdue', valueTone: 'danger' },
                    { id: 't5', join: 'or', field: 'status', operator: 'is', value: 'Sent', valueTone: 'info' },
                    { id: 't6', join: 'or', field: 'status', operator: 'is', value: 'No tone' },
                  ],
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      label: 'Interaction',
      states: [
        { id: 'pressable', label: 'nodes are buttons', render: () => <Flowchart nodes={flow} activeId="if" onNodePress={() => {}} /> },
        { id: 'tight-gap', label: 'gap 16', render: () => <Flowchart nodes={flow} gap={16} /> },
        { id: 'wide-gap', label: 'gap 80', render: () => <Flowchart nodes={flow} gap={80} isRunning /> },
      ],
    },
  ],
  missing: [
    'Failed node: status only has idle, running and done, so an errored step cannot be shown',
    'Branching: nodes render as a single vertical list, so there is no Else branch or parallel path',
    'Collapsed or loading flow: no loading or skeleton state',
    'Disabled: pressable nodes have no isDisabled',
  ],
};

export default mod;
