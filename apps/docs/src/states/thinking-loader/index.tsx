import { ThinkingLoader } from 'oniva-ui';
import type { StateModule } from '../types';

const phases = ['Thinking', 'Searching the web', 'Reading sources', 'Writing response'];
const longLabel = 'Cross-checking the Northwind Labs Q3 invoice export against the ledger reconciliation report';

const mod: StateModule = {
  slug: 'thinking-loader',
  title: 'Thinking loader',
  width: 420,
  groups: [
    {
      label: 'Phase',
      states: [
        { id: 'first-phase', label: 'first phase', render: () => <ThinkingLoader phases={phases} phase={0} /> },
        { id: 'middle-phase', label: 'middle phase', render: () => <ThinkingLoader phases={phases} phase={2} /> },
        { id: 'last-phase', label: 'last phase', render: () => <ThinkingLoader phases={phases} phase={3} /> },
        { id: 'single-phase', label: 'single phase', render: () => <ThinkingLoader phases={['Drafting reply']} /> },
        { id: 'phase-out-of-range', label: 'controlled phase out of range (clamped)', render: () => <ThinkingLoader phases={phases} phase={9} /> },
        { id: 'no-phases', label: 'no phases (empty label)', render: () => <ThinkingLoader phases={[]} /> },
      ],
    },
    {
      label: 'Done',
      states: [
        { id: 'done-default', label: 'done, default label', render: () => <ThinkingLoader phases={phases} isDone /> },
        { id: 'done-string', label: 'done, custom label', render: () => <ThinkingLoader phases={phases} isDone doneLabel="Thought for 14s" /> },
        { id: 'done-fn', label: 'done, label from seconds', render: () => <ThinkingLoader phases={phases} isDone doneLabel={(s) => `Answered in ${s}s`} /> },
        { id: 'done-plain', label: 'done, plain', render: () => <ThinkingLoader phases={phases} variant="plain" isDone doneLabel="Thought for 14s" /> },
      ],
    },
    {
      label: 'Size and variant',
      states: [
        { id: 'md-pill', label: 'md pill', render: () => <ThinkingLoader phases={phases} phase={1} size="md" variant="pill" /> },
        { id: 'sm-pill', label: 'sm pill', render: () => <ThinkingLoader phases={phases} phase={1} size="sm" variant="pill" /> },
        { id: 'md-plain', label: 'md plain', render: () => <ThinkingLoader phases={phases} phase={1} variant="plain" /> },
        { id: 'sm-plain', label: 'sm plain', render: () => <ThinkingLoader phases={phases} phase={1} size="sm" variant="plain" /> },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'long-label', label: 'long label', render: () => <ThinkingLoader phases={[longLabel]} /> },
        { id: 'long-label-plain', label: 'long label, plain', render: () => <ThinkingLoader phases={[longLabel]} variant="plain" /> },
        { id: 'long-done-label', label: 'long done label', render: () => <ThinkingLoader phases={phases} isDone doneLabel={`Finished ${longLabel.toLowerCase()}`} /> },
        { id: 'unbroken-label', label: 'unbroken label', render: () => <ThinkingLoader phases={['northwind-labs/billing-service/src/reconcile/ledger-export.worker.ts']} /> },
      ],
    },
  ],
  missing: [
    'Auto-advancing phases and loop restart (timer driven; states must hold still)',
    'Error or cancelled (the component has no such status)',
  ],
};
export default mod;
