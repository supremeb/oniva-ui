import { ApprovalQueue } from 'oniva-ui';
import type { PendingToolCall } from 'oniva-ui';
import type { StateModule } from '../types';

const high: PendingToolCall = {
  id: 'a1',
  agent: 'Billing Specialist',
  tool: 'payments.refund',
  summary: 'Refund $740.00 to Northwind Labs (INV-20418)',
  risk: 'high',
  requestedAt: '2 min ago',
  args: '{ "charge": "ch_3PqX2", "amount": 74000, "reason": "duplicate" }',
};
const medium: PendingToolCall = {
  id: 'a2',
  agent: 'Deploy Bot',
  tool: 'repo.merge_pull_request',
  summary: 'Merge #482 "Fix webhook retries" into main',
  risk: 'medium',
  requestedAt: '6 min ago',
};
const low: PendingToolCall = {
  id: 'a3',
  agent: 'Research Scout',
  tool: 'mail.send',
  summary: 'Send follow-up to maria@northwind.example',
  risk: 'low',
  requestedAt: '11 min ago',
};
const typical = [high, medium, low];

const longPath = 'packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts';
const longArgs = JSON.stringify(
  {
    path: longPath,
    mode: 'overwrite',
    backup: 's3://northwind-backups-eu-west-1/scheduler/2026-10-31T09-41-12Z/exponential-backoff-with-decorrelated-jitter.worker.ts.bak',
    notify: ['maria@northwind.example', 'ops-oncall@northwind.example'],
    retries: { max: 5, base: 250, factor: 2 },
  },
  null,
  2,
);

const many: PendingToolCall[] = Array.from({ length: 12 }, (_, i) => {
  const base = typical[i % typical.length]!;
  return { ...base, id: `m${i}`, requestedAt: `${(i + 1) * 3} min ago` };
});

const mod: StateModule = {
  slug: 'approval-queue',
  title: 'Approval queue',
  width: 560,
  groups: [
    {
      label: 'Data',
      states: [
        { id: 'empty', label: 'empty', render: () => <ApprovalQueue items={[]} /> },
        { id: 'one', label: 'one item', render: () => <ApprovalQueue items={[high]} /> },
        { id: 'typical', label: 'typical (3, all risks)', render: () => <ApprovalQueue items={typical} /> },
        { id: 'many', label: 'many (12)', render: () => <ApprovalQueue items={many} /> },
        { id: 'custom-title', label: 'custom title', render: () => <ApprovalQueue title="Awaiting your sign-off" items={typical.slice(0, 2)} /> },
      ],
    },
    {
      label: 'Risk',
      states: [
        { id: 'risk-low', label: 'low risk', render: () => <ApprovalQueue items={[low]} /> },
        { id: 'risk-medium', label: 'medium risk', render: () => <ApprovalQueue items={[medium]} /> },
        { id: 'risk-high', label: 'high risk', render: () => <ApprovalQueue items={[high]} /> },
        {
          id: 'risk-none',
          label: 'no risk set',
          render: () => <ApprovalQueue items={[{ id: 'n1', agent: 'Research Scout', tool: 'docs.archive', summary: 'Archive the Q3 planning folder', requestedAt: '4 min ago' }]} />,
        },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'minimal',
          label: 'no args, no time',
          render: () => <ApprovalQueue items={[{ id: 'x1', agent: 'Deploy Bot', tool: 'repo.merge_pull_request', summary: 'Merge #483 "Bump build image" into main' }]} />,
        },
        {
          id: 'long-args',
          label: 'long args scroll',
          render: () => <ApprovalQueue items={[{ ...high, id: 'l1', args: longArgs }]} />,
        },
        {
          id: 'long-summary',
          label: 'long summary, agent, tool',
          render: () => (
            <ApprovalQueue
              items={[
                {
                  id: 'l2',
                  agent: 'Infrastructure Reconciliation Specialist',
                  tool: 'storage.bulk_overwrite_object_versions',
                  summary: `Overwrite ${longPath} and 48 related files across every production bucket`,
                  risk: 'high',
                  requestedAt: '14 min ago',
                  args: `overwrite ${longPath}`,
                },
              ]}
            />
          ),
        },
        {
          id: 'unbroken',
          label: 'long unbroken text',
          render: () => (
            <ApprovalQueue
              items={[
                {
                  id: 'l3',
                  agent: 'Research Scout',
                  tool: 'web.fetch',
                  summary: 'Fetch https://reports.northwind.example/exports/2026/q3/regional-breakdown/emea/uk-and-ireland/full-detail-v2-final.csv',
                  risk: 'low',
                  requestedAt: '1 min ago',
                  args: 'https://reports.northwind.example/exports/2026/q3/regional-breakdown/emea/uk-and-ireland/full-detail-v2-final.csv?token=nw_test_9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1',
                },
              ]}
            />
          ),
        },
      ],
    },
  ],
  missing: [
    'Resolving / in-flight row (rows exit after press; the exit is internal and not reachable by a prop)',
    'Disabled or read-only queue (no such prop)',
    'Loading state (no isLoading prop)',
  ],
};
export default mod;
