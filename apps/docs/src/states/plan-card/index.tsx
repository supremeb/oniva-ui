import { PlanCard } from 'oniva-ui';
import type { PlanStep } from 'oniva-ui';
import type { StateModule } from '../types';

const noop = () => {};

const draft: PlanStep[] = [
  { id: '1', title: 'Pull Q3 subscription export from the warehouse', detail: 'warehouse.subscriptions, 214k rows, read-only', tool: 'warehouse.query' },
  { id: '2', title: 'Join with CRM account tiers', detail: 'Match on account_id; flag 312 unmatched rows', tool: 'crm.lookup' },
  { id: '3', title: 'Compute monthly cohort retention' },
  { id: '4', title: 'Draft a summary with the 3 biggest movers', tool: 'docs.write' },
];

const many: PlanStep[] = [
  { id: 'm1', title: 'Collect the open invoices for Northwind Labs', detail: '1,284 invoices across 9 entities', tool: 'billing.query' },
  { id: 'm2', title: 'Group invoices by entity and currency', tool: 'billing.group' },
  { id: 'm3', title: 'Convert totals to the reporting currency', detail: 'Daily rates from the treasury feed', tool: 'fx.rates' },
  { id: 'm4', title: 'Flag invoices older than 90 days' },
  { id: 'm5', title: 'Look up the account owner for each flagged invoice', tool: 'crm.lookup' },
  { id: 'm6', title: 'Draft a reminder for each owner', tool: 'mail.draft' },
  { id: 'm7', title: 'Attach the aging report as a spreadsheet', tool: 'sheets.create' },
  { id: 'm8', title: 'Queue the reminders for review' },
  { id: 'm9', title: 'Post the weekly summary to #finance-ops', tool: 'chat.post' },
  { id: 'm10', title: 'Archive the working files', detail: 'Moved to /finance/aging/2026-w43/', tool: 'files.move' },
  { id: 'm11', title: 'Log the run in the audit trail', tool: 'audit.log' },
  { id: 'm12', title: 'Schedule the next run for Monday 09:00' },
];

const longText: PlanStep[] = [
  {
    id: 'l1',
    title: 'Export every row from /srv/exports/northwind-labs/finance/2026/q3/subscriptions-with-cohort-and-tier-annotations-final-v3.parquet',
    detail:
      'The file is large (about 4.2 GB) and is read in chunks of 50,000 rows; each chunk is validated against the schema before it is joined with the tier table.',
    tool: 'warehouse.exportFromObjectStorageWithValidation',
  },
  {
    id: 'l2',
    title: 'Fetch https://api.northwind-labs.example/v2/accounts/tiers?include=history&region=emea&since=2026-07-01&limit=5000',
    detail: 'https://api.northwind-labs.example/v2/accounts/tiers?include=history&region=emea&since=2026-07-01&limit=5000',
    tool: 'http.get',
  },
  { id: 'l3', title: 'Summarise', tool: 'docs.write' },
];

const running: PlanStep[] = [
  { id: 'r1', title: 'Pull Q3 subscription export from the warehouse', detail: 'warehouse.subscriptions, 214k rows, read-only', tool: 'warehouse.query', status: 'done', duration: 2400 },
  { id: 'r2', title: 'Join with CRM account tiers', detail: 'Match on account_id; flag 312 unmatched rows', tool: 'crm.lookup', status: 'done', duration: 1800 },
  { id: 'r3', title: 'Compute monthly cohort retention', status: 'active' },
  { id: 'r4', title: 'Draft a summary with the 3 biggest movers', tool: 'docs.write', status: 'pending' },
];

const failed: PlanStep[] = [
  { id: 'f1', title: 'Pull Q3 subscription export', status: 'done', duration: 2100 },
  { id: 'f2', title: 'Join with CRM account tiers', tool: 'crm.lookup', status: 'failed', error: 'CRM API rate limit reached (429). Try again in a minute.' },
  { id: 'f3', title: 'Compute monthly cohort retention', status: 'pending' },
  { id: 'f4', title: 'Draft a summary with the 3 biggest movers', tool: 'docs.write', status: 'pending' },
];

const failedLong: PlanStep[] = [
  { id: 'g1', title: 'Pull Q3 subscription export', status: 'done', duration: 2100 },
  {
    id: 'g2',
    title: 'Join with CRM account tiers',
    status: 'failed',
    error:
      'Request to https://crm.northwind-labs.example/api/v4/accounts/batch-lookup?fields=tier,owner,renewal_date,region failed with 502 Bad Gateway after 3 attempts (last attempt 41 s).',
  },
  { id: 'g3', title: 'Compute monthly cohort retention', status: 'pending' },
];

const failedNoMessage: PlanStep[] = [
  { id: 'n1', title: 'Pull Q3 subscription export', status: 'done', duration: 2100 },
  { id: 'n2', title: 'Join with CRM account tiers', status: 'failed' },
  { id: 'n3', title: 'Compute monthly cohort retention', status: 'pending' },
];

const done: PlanStep[] = [
  { id: 'd1', title: 'Pull Q3 subscription export from the warehouse', detail: 'warehouse.subscriptions, 214k rows, read-only', tool: 'warehouse.query', status: 'done', duration: 2400 },
  { id: 'd2', title: 'Join with CRM account tiers', detail: 'Match on account_id; flag 312 unmatched rows', tool: 'crm.lookup', status: 'done', duration: 1800 },
  { id: 'd3', title: 'Compute monthly cohort retention', status: 'done', duration: 5200 },
  { id: 'd4', title: 'Draft a summary with the 3 biggest movers', tool: 'docs.write', status: 'done', duration: 3700 },
];

const doneNoDurations: PlanStep[] = done.map(({ duration: _d, ...s }) => s);

const board: PlanStep[] = [
  { id: 'b1', title: 'Pull Q3 revenue and ARR', detail: 'Monthly revenue, ARR and net retention', tool: 'billing.query', status: 'done', duration: 3100 },
  { id: 'b2', title: 'Summarize product launches', detail: 'Shipped projects and adoption', tool: 'tracker.search', status: 'active' },
  { id: 'b3', title: 'Draft the board memo', detail: 'One page, wins, risks and asks', tool: 'docs.write', status: 'pending' },
  { id: 'b4', title: 'Build the KPI slides', detail: 'Six charts in the board template', tool: 'slides.create', status: 'pending' },
  { id: 'b5', title: 'Send the draft for review', tool: 'mail.draft', status: 'pending' },
];

const boardDraft: PlanStep[] = board.map(({ status: _s, duration: _d, ...s }) => s);
const boardDone: PlanStep[] = board.map((s, i) => ({ ...s, status: 'done' as const, duration: 1200 + i * 700 }));

const mod: StateModule = {
  slug: 'plan-card',
  title: 'Plan card',
  width: 560,
  groups: [
    {
      label: 'Review',
      states: [
        { id: 'draft', label: 'draft, approve only', render: () => <PlanCard title="Plan: Q3 retention analysis" estimate="~2 min" steps={draft} onApprove={noop} /> },
        { id: 'draft-run-cancel', label: 'draft, run + cancel', render: () => <PlanCard title="Plan: Q3 retention analysis" estimate="~2 min" steps={draft} onRun={noop} onCancel={noop} /> },
        { id: 'draft-no-estimate', label: 'draft, no estimate', render: () => <PlanCard steps={draft} /> },
        { id: 'one-step', label: 'one step', render: () => <PlanCard title="Plan: send the weekly digest" steps={[draft[0]!]} onApprove={noop} /> },
        { id: 'empty', label: 'no steps', render: () => <PlanCard title="Plan: Q3 retention analysis" steps={[]} onApprove={noop} /> },
        { id: 'many', label: '12 steps', render: () => <PlanCard title="Plan: weekly invoice aging run" estimate="~6 min" steps={many} onRun={noop} onCancel={noop} /> },
        { id: 'long-text', label: 'long paths and urls', render: () => <PlanCard title="Plan: rebuild the retention dashboard from the Q3 export and the tier history" estimate="~14 min" steps={longText} onRun={noop} /> },
      ],
    },
    {
      label: 'Run',
      states: [
        { id: 'running', label: 'running, one active', render: () => <PlanCard title="Plan: Q3 retention analysis" steps={running} status="running" onCancel={noop} /> },
        { id: 'running-no-cancel', label: 'running, no cancel', render: () => <PlanCard title="Plan: Q3 retention analysis" steps={running} status="running" /> },
        { id: 'failed', label: 'failed step, retry', render: () => <PlanCard title="Plan: Q3 retention analysis" steps={failed} status="running" onRetry={noop} onCancel={noop} /> },
        { id: 'failed-no-retry', label: 'failed step, no retry handler', render: () => <PlanCard title="Plan: Q3 retention analysis" steps={failed} status="running" /> },
        { id: 'failed-long-error', label: 'failed, long error', render: () => <PlanCard title="Plan: Q3 retention analysis" steps={failedLong} status="running" onRetry={noop} /> },
        { id: 'failed-default-error', label: 'failed, no error message', render: () => <PlanCard title="Plan: Q3 retention analysis" steps={failedNoMessage} status="running" onRetry={noop} /> },
        { id: 'done', label: 'done, durations', render: () => <PlanCard title="Plan: Q3 retention analysis" steps={done} status="done" /> },
        { id: 'done-no-durations', label: 'done, no durations', render: () => <PlanCard title="Plan: Q3 retention analysis" steps={doneNoDurations} status="done" /> },
      ],
    },
    {
      label: 'Timeline layout',
      states: [
        { id: 'timeline-draft', label: 'timeline, draft', render: () => <PlanCard layout="timeline" title="Prepare the Q3 board update" estimate="~4 min" steps={boardDraft} onRun={noop} onCancel={noop} /> },
        { id: 'timeline-running', label: 'timeline, running', render: () => <PlanCard layout="timeline" title="Prepare the Q3 board update" steps={board} status="running" onCancel={noop} /> },
        { id: 'timeline-failed', label: 'timeline, failed', render: () => <PlanCard layout="timeline" title="Prepare the Q3 board update" steps={[{ ...board[0]! }, { ...board[1]!, status: 'failed', error: 'Tracker search timed out after 30 s.' }, ...board.slice(2).map((s) => ({ ...s, status: 'pending' as const }))]} status="running" onRetry={noop} /> },
        { id: 'timeline-done', label: 'timeline, done', render: () => <PlanCard layout="timeline" title="Prepare the Q3 board update" steps={boardDone} status="done" /> },
        { id: 'timeline-one', label: 'timeline, one step', render: () => <PlanCard layout="timeline" title="Send the weekly digest" steps={[boardDraft[4]!]} onApprove={noop} /> },
      ],
    },
  ],
  missing: [
    'Editing (rename/reorder/remove/add inputs): only reachable by pressing Edit, no default prop',
    'Plan approved confirmation: only after pressing Approve plan',
    'Done with measured total ("Done in 6.2 s"): needs a live running to done transition',
    'Live active-step timer past the first second: needs time to pass',
  ],
};

export default mod;
