import { FeedbackBar } from 'oniva-ui';
import type { StateModule } from '../types';

const mod: StateModule = {
  slug: 'feedback-bar',
  title: 'Feedback bar',
  width: 720,
  groups: [
    {
      label: 'Question',
      states: [
        { id: 'default', label: 'default', render: () => <FeedbackBar /> },
        {
          id: 'custom-question',
          label: 'custom question',
          render: () => <FeedbackBar question="Did Atlas 2 answer the billing question?" />,
        },
        {
          id: 'long-question',
          label: 'long question',
          render: () => (
            <FeedbackBar question="Did this summary of the Northwind Labs Q3 renewal thread capture the open pricing questions, the legal review status and the agreed follow-up dates for the account team?" />
          ),
        },
        {
          id: 'unbroken-question',
          label: 'unbroken question',
          render: () => (
            <FeedbackBar question="Was northwind-labs/billing-service/src/invoices/reconciliation/ledger-export.worker.ts correct?" />
          ),
        },
      ],
    },
  ],
  missing: [
    'Thumbs-down reason picker (needs a click; no default prop)',
    'Submitted "Thanks for the feedback." confirmation (needs a click; no default prop)',
  ],
};

export default mod;
