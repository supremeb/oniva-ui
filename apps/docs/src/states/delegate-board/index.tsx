import { DelegateBoard, DatabaseIcon, FileTextIcon, BranchIcon, MessageSquareIcon, PaletteIcon } from 'oniva-ui';
import type { DelegateAgent, DelegateTask } from 'oniva-ui';
import type { StateModule } from '../types';

// Fixed clock: 2026-10-26 09:00 local-ish, so "busy until" is stable.
const NOW = Date.UTC(2026, 9, 26, 15, 0, 0);
const noop = () => undefined;

const agents: DelegateAgent[] = [
  { id: 'research', name: 'Researcher', model: 'Atlas 2', current: 9, rate: 0.08 },
  { id: 'writer', name: 'Writer', model: 'Nova Pro', current: 15, rate: 0.03 },
  { id: 'coder', name: 'Coder', model: 'Lumen Fast', rate: 0.06 },
  { id: 'ops', name: 'Ops', model: 'Quill Reasoner', rate: 0.01 },
];

const unassigned: DelegateTask[] = [
  { id: 't1', title: 'Fix flaky checkout test', estimate: 20, tools: [<BranchIcon key="g" size={12} />] },
  { id: 't2', title: 'Summarize churn calls', estimate: 15, tools: [<MessageSquareIcon key="m" size={12} />, <FileTextIcon key="f" size={12} />] },
  { id: 't3', title: 'Update pricing page', estimate: 10, tools: [<PaletteIcon key="p" size={12} />] },
  { id: 't4', title: 'Clean up CRM duplicates', estimate: 18, tools: [<DatabaseIcon key="d" size={12} />] },
];
const queued: DelegateTask[] = [
  { id: 'q1', title: 'Competitor scan', estimate: 12, agentId: 'research' },
  { id: 'q2', title: 'Write release notes', estimate: 8, agentId: 'writer' },
  { id: 'q3', title: 'Refactor auth', estimate: 20, agentId: 'coder' },
  { id: 'q4', title: 'Upgrade billing SDK', estimate: 10, agentId: 'coder' },
];
const typical = [...unassigned, ...queued];
const allAssigned: DelegateTask[] = [...queued, ...unassigned.map((t, i): DelegateTask => ({ ...t, agentId: agents[i]!.id }))];

const manyTasks: DelegateTask[] = Array.from({ length: 14 }, (_, i): DelegateTask => ({
  id: `m${i}`,
  title: ['Triage inbound tickets', 'Reconcile invoices', 'Draft onboarding email', 'Audit seat usage', 'Review pull request #482', 'Backfill analytics events', 'Translate help center', 'Rotate staging keys', 'Profile slow query', 'Update status page', 'Tag churn reasons', 'Export Q3 report', 'Prune stale branches', 'Check SSL expiry'][i]!,
  estimate: 6 + ((i * 7) % 25),
  agentId: i < 5 ? undefined : i % 2 ? 'coder' : 'writer',
}));

const tenAgents: DelegateAgent[] = [
  ...agents,
  { id: 'a5', name: 'Reviewer', model: 'Atlas 2', rate: 0.05 },
  { id: 'a6', name: 'Translator', model: 'Nova Pro', current: 4, rate: 0.02 },
  { id: 'a7', name: 'Analyst', model: 'Lumen Fast', rate: 0.04 },
  { id: 'a8', name: 'Designer', model: 'Quill Reasoner', rate: 0.07 },
  { id: 'a9', name: 'Support', model: 'Nova Pro', rate: 0.02 },
  { id: 'a10', name: 'Auditor', model: 'Atlas 2', rate: 0.09 },
];

const longAgents: DelegateAgent[] = [
  { id: 'l1', name: 'Northwind Labs customer-success escalation specialist', model: 'Quill Reasoner extended context preview', current: 42, rate: 0.125 },
  { id: 'l2', name: 'Writer', model: 'Nova Pro', rate: 0.03 },
];
const longTasks: DelegateTask[] = [
  { id: 'x1', title: 'Reconcile the Northwind Labs EMEA invoices against the ledger export for the fiscal quarter ending September', estimate: 95, tools: [<DatabaseIcon key="d" size={12} />] },
  { id: 'x2', title: 'packages/northwind-billing/src/workers/reconcile/decorrelated-jitter.worker.ts', estimate: 1240 },
  { id: 'x3', title: 'Quick fix', estimate: 3 },
  { id: 'x4', title: 'Queued: Reconcile the Northwind Labs EMEA invoices against the ledger export', estimate: 60, agentId: 'l1' },
  { id: 'x5', title: 'packages/northwind-billing/src/workers/reconcile/decorrelated-jitter.worker.ts', estimate: 30, agentId: 'l1' },
];

const noRates: DelegateAgent[] = agents.map(({ rate: _rate, ...a }) => a);

const mod: StateModule = {
  slug: 'delegate-board',
  title: 'Delegate board',
  width: 860,
  groups: [
    {
      label: 'Data',
      states: [
        { id: 'empty', label: 'no agents, no tasks', render: () => <DelegateBoard agents={[]} tasks={[]} now={NOW} /> },
        { id: 'no-agents', label: 'tasks, no agents', render: () => <DelegateBoard agents={[]} tasks={unassigned} now={NOW} /> },
        { id: 'no-tasks', label: 'agents, no tasks', render: () => <DelegateBoard agents={agents} tasks={[]} now={NOW} /> },
        { id: 'typical', label: 'typical', render: () => <DelegateBoard agents={agents} tasks={typical} now={NOW} /> },
        { id: 'all-assigned', label: 'everything handed out', render: () => <DelegateBoard agents={agents} tasks={allAssigned} now={NOW} /> },
        { id: 'one-agent', label: 'one agent', render: () => <DelegateBoard agents={agents.slice(0, 1)} tasks={typical.filter((t) => !t.agentId || t.agentId === 'research')} now={NOW} /> },
        { id: 'many-tasks', label: 'many tasks (14)', render: () => <DelegateBoard agents={agents} tasks={manyTasks} now={NOW} /> },
        { id: 'ten-agents', label: 'ten agents (keys stop at 9)', render: () => <DelegateBoard agents={tenAgents} tasks={typical} now={NOW} /> },
        { id: 'unknown-agent', label: 'task points at unknown agent', render: () => <DelegateBoard agents={agents} tasks={[...typical, { id: 'z1', title: 'Archive old runbooks', estimate: 14, agentId: 'retired' }]} now={NOW} /> },
      ],
    },
    {
      label: 'Mode',
      states: [
        { id: 'manual', label: 'manual (default)', render: () => <DelegateBoard agents={agents} tasks={typical} now={NOW} mode="manual" onAssign={noop} /> },
        { id: 'auto', label: 'auto routing (held still)', render: () => <DelegateBoard agents={agents} tasks={typical} now={NOW} mode="auto" onAssign={noop} /> },
        { id: 'auto-idle', label: 'auto, nothing left', render: () => <DelegateBoard agents={agents} tasks={allAssigned} now={NOW} mode="auto" onAssign={noop} /> },
        { id: 'suggestion', label: 'suggested hand-off', render: () => <DelegateBoard agents={agents} tasks={typical} now={NOW} suggestion={{ taskId: 't1', agentId: 'coder' }} onAssign={noop} /> },
        { id: 'suggestion-busy', label: 'suggestion onto a busy agent', render: () => <DelegateBoard agents={agents} tasks={typical} now={NOW} suggestion={{ taskId: 't2', agentId: 'research' }} onAssign={noop} /> },
        { id: 'suggestion-free', label: 'suggestion onto a free agent', render: () => <DelegateBoard agents={agents} tasks={typical} now={NOW} suggestion={{ taskId: 't4', agentId: 'ops' }} onAssign={noop} /> },
      ],
    },
    {
      label: 'Cost',
      states: [
        { id: 'no-rates', label: 'no rates (no cost lines)', render: () => <DelegateBoard agents={noRates} tasks={typical} now={NOW} suggestion={{ taskId: 't1', agentId: 'coder' }} onAssign={noop} /> },
        { id: 'custom-cost', label: 'custom formatCost', render: () => <DelegateBoard agents={agents} tasks={typical} now={NOW} formatCost={(n) => `${Math.round(n * 100)} credits`} /> },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'long-text', label: 'long names, titles and estimates', render: () => <DelegateBoard agents={longAgents} tasks={longTasks} now={NOW} suggestion={{ taskId: 'x1', agentId: 'l1' }} onAssign={noop} /> },
        { id: 'custom-copy', label: 'custom title and subtitle', render: () => <DelegateBoard agents={agents} tasks={typical} now={NOW} title="Sprint hand-off" subtitle="Assign this week's backlog before standup" /> },
      ],
    },
  ],
  missing: [
    'Drag in progress / drop target highlight and the "Drop a task here." empty queue hint (need a live drag)',
    'Task received pulse (needs a queue to grow after mount)',
    'Auto routing mid-run (assignments advance on a timer)',
    'Loading or error states (the component has none)',
  ],
};
export default mod;
