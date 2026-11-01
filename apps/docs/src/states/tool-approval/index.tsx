import { ToolApproval } from 'oniva-ui';
import type { StateModule } from '../types';

const mergeDetails = [
  { label: 'Repository', value: 'northwind-labs/web' },
  { label: 'Branch', value: 'feat/retry-schedule into main' },
  { label: 'Checks', value: '14 of 14 passed' },
];
const mergeArgs = { repo: 'northwind-labs/web', number: 482, method: 'squash', deleteBranch: true };

const longPath = 'packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts';
const longArgs = {
  path: longPath,
  contents: 'export const schedule = { baseDelayMs: 250, maxDelayMs: 60000, jitter: "decorrelated", maxAttempts: 8 };\n'.repeat(3),
  url: 'https://api.northwind.example/v2/workspaces/ws_01HZX8K2Q9/queues/q_retry/schedules/sch_8f3a1c2d9e4b7a60/versions/42/publish',
  options: { atomic: true, notify: ['ops@northwind.example', 'release-train@northwind.example'], retries: 3 },
  tags: Array.from({ length: 14 }, (_, i) => `release-2026-10-${String(i + 10).padStart(2, '0')}`),
};

const preview = (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
    <div style={{ color: 'var(--oniva-color-text-muted)' }}>To: Maya Chen &lt;maya.chen@northwind.example&gt;, +212 others</div>
    <div>October product update: retry schedules are live</div>
  </div>
);

const mod: StateModule = {
  slug: 'tool-approval',
  title: 'Tool approval',
  width: 560,
  groups: [
    {
      label: 'Card',
      states: [
        { id: 'minimal', label: 'tool name only', render: () => <ToolApproval toolName="repo.merge_pull_request" /> },
        {
          id: 'description',
          label: 'with description',
          render: () => <ToolApproval toolName="repo.merge_pull_request" description="Merge pull request #482 into main?" />,
        },
        {
          id: 'full',
          label: 'risk, details, args',
          render: () => (
            <ToolApproval toolName="repo.merge_pull_request" description="Merge pull request #482 into main?" risk="medium" details={mergeDetails} args={mergeArgs} />
          ),
        },
        {
          id: 'preview',
          label: 'custom preview',
          render: () => (
            <ToolApproval toolName="email.send" description="Send campaign email to 214 recipients?" risk="medium" preview={preview} details={[{ label: 'From', value: 'updates@northwind.example' }]} />
          ),
        },
        {
          id: 'no-shortcuts',
          label: 'shortcut hints off',
          render: () => <ToolApproval toolName="warehouse.query" description="Run a read-only query on deals?" risk="low" shortcuts={false} args={{ table: 'deals', limit: 500 }} />,
        },
        {
          id: 'long',
          label: 'long unbroken args',
          render: () => (
            <ToolApproval
              toolName="queue.publish_schedule_version_with_a_very_long_tool_identifier"
              description={`Overwrite ${longPath} and publish version 42 of the retry schedule to every worker pool in the production cluster?`}
              risk="high"
              details={[
                { label: 'File', value: longPath },
                { label: 'Endpoint', value: 'https://api.northwind.example/v2/workspaces/ws_01HZX8K2Q9/queues/q_retry/schedules/sch_8f3a1c2d9e4b7a60/versions/42/publish' },
              ]}
              args={longArgs}
            />
          ),
        },
      ],
    },
    {
      label: 'Risk',
      states: [
        { id: 'risk-low', label: 'low', render: () => <ToolApproval toolName="warehouse.query" description="Run a read-only query on deals?" risk="low" args={{ table: 'deals', limit: 500 }} /> },
        {
          id: 'risk-medium',
          label: 'medium',
          render: () => <ToolApproval toolName="repo.merge_pull_request" description="Merge pull request #482 into main?" risk="medium" details={mergeDetails} />,
        },
        {
          id: 'risk-high',
          label: 'high',
          render: () => (
            <ToolApproval
              toolName="billing.refund_charge"
              description="Refund $184.00 to Maya Chen?"
              risk="high"
              details={[
                { label: 'Customer', value: 'Maya Chen' },
                { label: 'Amount', value: '$184.00' },
                { label: 'Reversible', value: 'No' },
              ]}
            />
          ),
        },
      ],
    },
    {
      label: 'Countdown',
      states: [
        {
          id: 'expires',
          label: 'expires in 30 min',
          render: () => <ToolApproval toolName="billing.refund_charge" description="Refund $184.00 to Maya Chen?" risk="high" expiresIn={1800} details={[{ label: 'Amount', value: '$184.00' }]} />,
        },
      ],
    },
    {
      label: 'Settled',
      states: [
        {
          id: 'approved',
          label: 'approved, with result',
          render: () => <ToolApproval toolName="repo.merge_pull_request" description="Merge pull request #482 into main?" risk="medium" details={mergeDetails} status="approved" result="Merged #482 into main" />,
        },
        {
          id: 'approved-no-result',
          label: 'approved, no result',
          render: () => <ToolApproval toolName="repo.merge_pull_request" description="Merge pull request #482 into main?" status="approved" />,
        },
        {
          id: 'denied',
          label: 'denied',
          render: () => <ToolApproval toolName="repo.merge_pull_request" description="Merge pull request #482 into main?" risk="medium" details={mergeDetails} status="denied" result="Not shown" />,
        },
      ],
    },
    {
      label: 'Row',
      states: [
        { id: 'row-pending', label: 'pending, no preview', render: () => <ToolApproval variant="row" toolName="email.send" description="Send campaign email" /> },
        {
          id: 'row-preview',
          label: 'pending, with details',
          render: () => <ToolApproval variant="row" toolName="repo.merge_pull_request" description="Merge pull request #482 into main?" risk="medium" details={mergeDetails} args={mergeArgs} />,
        },
        {
          id: 'row-long',
          label: 'pending, long description',
          render: () => (
            <ToolApproval variant="row" toolName="queue.publish" description={`Overwrite ${longPath} and publish version 42 to every worker pool?`} risk="high" />
          ),
        },
        { id: 'row-approved', label: 'approved', render: () => <ToolApproval variant="row" toolName="email.send" description="Send campaign email" status="approved" result="Sent to 214 recipients" /> },
        { id: 'row-denied', label: 'denied', render: () => <ToolApproval variant="row" toolName="email.send" description="Send campaign email" status="denied" /> },
      ],
    },
  ],
  missing: [
    'Approved, always allowed (only reachable by clicking Always allow; no prop)',
    'Denied, timed out and the amber countdown under 10 seconds (needs the timer to run)',
    'Paused countdown (needs hover or focus)',
  ],
};

export default mod;
