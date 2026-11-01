import { AgentSteering } from 'oniva-ui';
import type { SteerNote, SteerStep } from 'oniva-ui';
import type { StateModule } from '../types';

const NOW = 1_700_000_000_000;
const ago = (s: number) => NOW - s * 1000;
const noop = () => {};

const steps: SteerStep[] = [
  { id: 'schema', title: 'Read schema and 14 migrations', status: 'done', duration: '1.4s' },
  { id: 'plan', title: 'Plan the split into accounts and profiles', status: 'done', duration: '12s' },
  { id: 'write', title: 'Write migration 0042_split_users', status: 'active', startedAt: ago(38) },
  { id: 'stage', title: 'Dry run on staging', status: 'pending' },
  { id: 'pr', title: 'Open a pull request for review', status: 'pending' },
];

const withNotes: SteerStep[] = steps.map((s) =>
  s.id === 'plan'
    ? { ...s, notes: [{ id: 'n1', text: 'Keep the migration reversible', picked: 'next' } as SteerNote] }
    : s.id === 'write'
      ? {
          ...s,
          notes: [
            { id: 'n2', text: "Use Postgres 16 syntax, prod isn't on 17 yet", picked: 'now' } as SteerNote,
            { id: 'n3', text: 'Backfill in batches of 5,000 rows', picked: 'next' } as SteerNote,
          ],
        }
      : s,
);

const queue: SteerNote[] = [
  { id: 'q1', text: 'Skip the audit_log table, it is archived' },
  { id: 'q2', text: 'Ask me before touching the billing schema' },
  { id: 'q3', text: 'Add an index on accounts.email' },
];

const longPath = 'packages/northwind-db/migrations/2024_03_14_093000_split_users_into_accounts_and_profiles_with_backfill.sql';
const longQueue: SteerNote[] = [
  { id: 'l1', text: `Check ${longPath} before running it against staging` },
  { id: 'l2', text: 'https://staging.northwind.example/admin/migrations/0042_split_users/dry-run/results?include=warnings&format=json' },
];

const many: SteerStep[] = [
  ...steps.slice(0, 2),
  { id: 'm3', title: 'Write migration 0042_split_users', status: 'done', duration: '41s' },
  { id: 'm4', title: 'Generate rollback script', status: 'done', duration: '9s' },
  { id: 'm5', title: 'Dry run on staging', status: 'active', startedAt: ago(74) },
  { id: 'm6', title: 'Compare row counts before and after', status: 'pending' },
  { id: 'm7', title: 'Update ORM models and fixtures', status: 'pending' },
  { id: 'm8', title: 'Run the integration suite', status: 'pending' },
  { id: 'm9', title: 'Write the rollout runbook', status: 'pending' },
  { id: 'm10', title: 'Open a pull request for review', status: 'pending' },
];

const finished: SteerStep[] = [
  { id: 'a', title: 'Collect merged pull requests', status: 'done', duration: '8s' },
  { id: 'b', title: 'Group by area', status: 'done', duration: '3s', notes: [{ id: 'fn', text: 'Put breaking changes first', picked: 'next' }] },
  { id: 'c', title: 'Write the summary', status: 'done', duration: '11s' },
];

const handlers = { onQueue: noop, onInterrupt: noop, onRemove: noop, onPause: noop, onResume: noop };

const mod: StateModule = {
  slug: 'agent-steering',
  title: 'Agent steering',
  width: 520,
  groups: [
    {
      label: 'Run',
      states: [
        {
          id: 'running',
          label: 'running',
          render: () => <AgentSteering title="Migrate users table" agent="Atlas 2" steps={steps} startedAt={ago(129)} now={NOW} {...handlers} />,
        },
        {
          id: 'paused',
          label: 'paused',
          render: () => <AgentSteering title="Migrate users table" agent="Atlas 2" steps={steps} status="paused" startedAt={ago(129)} now={NOW} {...handlers} />,
        },
        {
          id: 'done',
          label: 'done',
          render: () => <AgentSteering title="Release notes" agent="Nova Pro" steps={finished} status="done" startedAt={ago(22)} now={NOW} {...handlers} />,
        },
        {
          id: 'no-clock',
          label: 'no start time, no agent',
          render: () => <AgentSteering title="Migrate users table" steps={steps} now={NOW} {...handlers} />,
        },
        {
          id: 'no-steps',
          label: 'no steps yet',
          render: () => <AgentSteering title="Migrate users table" agent="Atlas 2" steps={[]} startedAt={ago(2)} now={NOW} {...handlers} />,
        },
      ],
    },
    {
      label: 'Notes',
      states: [
        {
          id: 'queued-one',
          label: 'one queued note',
          render: () => <AgentSteering title="Migrate users table" agent="Atlas 2" steps={steps} queue={queue.slice(0, 1)} startedAt={ago(129)} now={NOW} {...handlers} />,
        },
        {
          id: 'queued-several',
          label: 'several queued notes',
          render: () => <AgentSteering title="Migrate users table" agent="Atlas 2" steps={steps} queue={queue} startedAt={ago(129)} now={NOW} {...handlers} />,
        },
        {
          id: 'picked-up',
          label: 'notes picked up by steps',
          render: () => <AgentSteering title="Migrate users table" agent="Atlas 2" steps={withNotes} queue={queue.slice(0, 1)} startedAt={ago(129)} now={NOW} {...handlers} />,
        },
        {
          id: 'queued-paused',
          label: 'queued while paused',
          render: () => <AgentSteering title="Migrate users table" agent="Atlas 2" steps={steps} queue={queue.slice(0, 2)} status="paused" startedAt={ago(129)} now={NOW} {...handlers} />,
        },
        {
          id: 'queued-done',
          label: 'queued after done',
          render: () => <AgentSteering title="Release notes" agent="Nova Pro" steps={finished} queue={queue.slice(0, 2)} status="done" startedAt={ago(22)} now={NOW} {...handlers} />,
        },
        {
          id: 'draft',
          label: 'draft typed in field',
          render: () => (
            <AgentSteering
              title="Migrate users table"
              agent="Atlas 2"
              steps={steps}
              draft="Also drop the legacy_flags column once the backfill finishes"
              onDraftChange={noop}
              startedAt={ago(129)}
              now={NOW}
              {...handlers}
            />
          ),
        },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'long-text',
          label: 'long titles, paths and URLs',
          render: () => (
            <AgentSteering
              title={`Split the users table into accounts and profiles, then backfill ${longPath}`}
              agent="Atlas 2 with extended reasoning on the Northwind Labs production cluster"
              steps={[
                { id: 'a', title: `Read ${longPath} and every migration that touches the users table`, status: 'done', duration: '1m 12s' },
                { id: 'b', title: longPath, status: 'active', startedAt: ago(38), notes: [{ id: 'n', text: longPath, picked: 'now' }] },
                { id: 'c', title: 'Dry run on staging', status: 'pending' },
              ]}
              queue={longQueue}
              startedAt={ago(4000)}
              now={NOW}
              {...handlers}
            />
          ),
        },
        {
          id: 'many-steps',
          label: 'long plan, ten steps',
          render: () => <AgentSteering title="Migrate users table" agent="Atlas 2" steps={many} queue={queue.slice(0, 2)} startedAt={ago(312)} now={NOW} {...handlers} />,
        },
      ],
    },
    {
      label: 'Access',
      states: [
        {
          id: 'queue-only',
          label: 'queue only, no interrupt or pause',
          render: () => <AgentSteering title="Migrate users table" agent="Atlas 2" steps={steps} queue={queue.slice(0, 2)} onQueue={noop} startedAt={ago(129)} now={NOW} />,
        },
        {
          id: 'read-only',
          label: 'no handlers',
          render: () => <AgentSteering title="Migrate users table" agent="Atlas 2" steps={steps} queue={queue.slice(0, 2)} startedAt={ago(129)} now={NOW} />,
        },
      ],
    },
  ],
  missing: [
    'Error / failed run (status is only running, paused or done)',
    'Cancelled run',
    'Disabled field while a note is sending (no pending state)',
    'Step in a failed state (steps are only done, active or pending)',
  ],
};

export default mod;
