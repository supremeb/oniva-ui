import { DecisionTree, FileTextIcon } from 'oniva-ui';
import type { DecisionTreeItem as Decision } from 'oniva-ui';
import type { StateModule } from '../types';

const dupes: Decision = {
  id: 'dupes',
  question: '3 customers have two active subscriptions. How should I proceed?',
  context: 'All three signed up twice during the checkout outage on Oct 14.',
  agent: 'Billing agent',
  model: 'Atlas 2',
  risk: 'high',
  options: [
    { label: 'Cancel the newer ones', pick: true, effects: ['Cancels 3 subscriptions · reversible', 'Sends 3 emails'] },
    { label: 'Refund the newer ones', effects: [['Refunds ', { text: '$147 · not reversible', note: 'One of the charges is two billing cycles old.', source: 'Billing policy 4.2' }]] },
    { label: 'Ask the customers', effects: ['Sends 3 emails · waits for answers'] },
  ],
};

const backup: Decision = {
  id: 'backup',
  question: 'The nightly backup is 40 minutes late. Run it now or wait?',
  agent: 'Ops agent',
  model: 'Nova Pro',
  risk: 'medium',
  options: [
    { label: 'Run it now', effects: ['Slows checkout by about 8% for 25 minutes'] },
    { label: 'Wait for the quiet window', pick: true, effects: ['Runs at 02:00 · risk of a 26-hour gap'] },
  ],
};

const region: Decision = {
  id: 'region',
  question: 'Which region should the restore test run in?',
  agent: 'Ops agent',
  model: 'Lumen Fast',
  risk: 'low',
  options: [{ label: 'us-east-1' }, { label: 'eu-west-2' }],
};

const copy: Decision = {
  id: 'copy',
  question: 'The refund email draft mentions a 5-day delay. Keep it or soften it?',
  context: 'Support macros say 3 to 7 business days; the legal template says 5.',
  agent: 'Support agent',
  model: 'Quill Reasoner',
  options: [
    { label: 'Keep "5 business days"', pick: true, effects: ['Matches the legal template'] },
    { label: 'Use "within a week"', effects: ['Matches the support macros', 'Needs a legal review'] },
    { label: 'Send without a timeframe', effects: ['No commitment made'] },
    { label: 'Hold the email', effects: ['Waits for the finance owner · no ETA'] },
  ],
};

const invoices: Decision = {
  id: 'invoices',
  question: '12 invoices from Northwind Labs failed to sync. Retry them?',
  agent: 'Finance agent',
  model: 'Atlas 2',
  risk: 'medium',
  options: [
    { label: 'Retry all 12', pick: true, effects: ['Posts 12 entries to the ledger · reversible'] },
    { label: 'Retry in batches of 4', effects: ['Takes about 15 minutes'] },
    { label: 'Skip until Monday' },
  ],
};

const longPath =
  'packages/northwind-ledger/src/reconcile/strategies/quarterly/exponential-backoff-with-decorrelated-jitter.worker.ts';

const longText: Decision = {
  id: 'long',
  question:
    'The reconciliation job found 1,284 entries in the ledger export that do not match any invoice issued by Northwind Labs in the last two fiscal quarters. How should I proceed with them?',
  context:
    'Most of them look like duplicates created when the sync worker retried after the timeout on Oct 14, but 37 have no counterpart at all and may be manual adjustments entered by the finance team.',
  agent: 'Reconciliation agent for the Northwind Labs quarterly close',
  model: 'Quill Reasoner',
  risk: 'high',
  options: [
    {
      label: 'Archive the 1,247 probable duplicates and flag the remaining 37 entries for review by the finance owner',
      pick: true,
      effects: [
        `Moves entries out of ${longPath} export · reversible`,
        'Opens a review task assigned to the finance owner with the full list of 37 unmatched ledger entries attached',
      ],
    },
    { label: 'Leave everything and report', effects: ['No changes made · the quarterly close stays blocked'] },
    { label: 'https://ledger.northwind.example/exports/2026/q3/unmatched-entries-with-counterparties.csv', effects: [`Reads ${longPath}`] },
  ],
};

const icon: Decision = {
  ...copy,
  id: 'icon',
  icon: <FileTextIcon size={14} />,
  question: 'Publish the Q3 summary to the shared drive now?',
  context: undefined,
  options: [
    { label: 'Publish now', pick: true, effects: ['Visible to 42 people'] },
    { label: 'Save as draft' },
  ],
};

const noop = async () => undefined;

const mod: StateModule = {
  slug: 'decision-tree',
  title: 'Decision tree',
  width: 720,
  groups: [
    {
      label: 'Data',
      states: [
        { id: 'empty', label: 'no decisions', render: () => <DecisionTree decisions={[]} /> },
        { id: 'one-high', label: 'one decision, high risk, context', render: () => <DecisionTree decisions={[dupes]} onChoose={noop} /> },
        { id: 'two', label: 'two decisions (navigation)', render: () => <DecisionTree decisions={[dupes, backup]} onChoose={noop} /> },
        { id: 'many', label: 'five decisions', render: () => <DecisionTree decisions={[dupes, backup, region, copy, invoices]} onChoose={noop} /> },
      ],
    },
    {
      label: 'Risk',
      states: [
        { id: 'risk-medium', label: 'medium risk, no context', render: () => <DecisionTree decisions={[backup]} /> },
        { id: 'risk-low', label: 'low risk, no model, no effects', render: () => <DecisionTree decisions={[{ ...region, model: undefined }]} /> },
        { id: 'risk-none', label: 'no risk, four options', render: () => <DecisionTree decisions={[copy]} /> },
      ],
    },
    {
      label: 'Options',
      states: [
        { id: 'no-other', label: 'no custom instruction', render: () => <DecisionTree decisions={[backup]} allowOther={false} /> },
        { id: 'no-pick', label: 'no agent pick', render: () => <DecisionTree decisions={[{ ...invoices, options: invoices.options.map((o) => ({ ...o, pick: undefined })) }]} /> },
        { id: 'custom-icon', label: 'custom agent icon', render: () => <DecisionTree decisions={[icon]} /> },
        { id: 'custom-title', label: 'custom title', render: () => <DecisionTree decisions={[invoices]} title="Needs your call" /> },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'long-text', label: 'long question, labels, paths and URL', render: () => <DecisionTree decisions={[longText]} /> },
        { id: 'long-text-nav', label: 'long text, with navigation', render: () => <DecisionTree decisions={[longText, region]} /> },
      ],
    },
    {
      label: 'Size',
      states: [
        {
          id: 'narrow',
          label: 'narrow column (360)',
          render: () => (
            <div style={{ maxWidth: 360 }}>
              <DecisionTree decisions={[dupes, backup]} />
            </div>
          ),
        },
        {
          id: 'narrow-long',
          label: 'narrow column, long text',
          render: () => (
            <div style={{ maxWidth: 360 }}>
              <DecisionTree decisions={[longText]} />
            </div>
          ),
        },
      ],
    },
  ],
  missing: [
    'Picked path settling (a branch chosen, outcome line "running") needs a click and the async onChoose; no controlled prop',
    'Custom instruction textarea open, and the agent answer after it, need keyboard/click interaction; no defaultOpen prop',
    'Flag note open (F key) needs interaction; no controlled prop',
    'Error / failed onChoose: the component has no error branch',
  ],
};

export default mod;
