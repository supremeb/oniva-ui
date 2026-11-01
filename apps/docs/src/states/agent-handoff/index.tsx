import { AgentHandoff } from 'oniva-ui';
import type { StateModule } from '../types';

const from = { name: 'Triage Bot', role: 'Support intake' };
const to = { name: 'Billing Specialist', role: 'Refunds & invoices' };
const reason = 'Customer requests a $740 refund, which needs finance tool access.';
const context =
  'Northwind Labs reports a duplicate charge on invoice INV-20418 (Oct 3). Card ending 4242. Customer is on the Scale plan and has opened two earlier tickets about billing this quarter.';
const carried = ['ticket-4821.json', 'INV-20418.pdf'];

const longContext =
  'Northwind Labs reports a duplicate charge on invoice INV-20418 (Oct 3) and a second charge on INV-20431 (Oct 9). Card ending 4242 was replaced on Sep 28, so the processor may have retried against both the old and the new card. Customer is on the Scale plan with 42 seats, has a negotiated annual contract, and asked for the refund to be issued to the original payment method rather than as account credit. Two earlier tickets (4702, 4755) were closed without resolution; the customer is frustrated and wants a written confirmation once the refund is processed.';

const manyCarried = [
  'ticket-4821.json',
  'INV-20418.pdf',
  'INV-20431.pdf',
  'processor-events-oct.csv',
  'card-replacement-log.txt',
  'contract-northwind-2026.pdf',
  'chat-transcript.md',
  'refund-policy-v7.md',
];

const longNames = {
  from: { name: 'Northwind Escalations Coordinator (Tier 2, EMEA overflow)', role: 'Routes unresolved enterprise support tickets across regions' },
  to: { name: 'Billing Reconciliation Specialist for Annual Contracts', role: 'Refunds, credits, invoices and disputed processor charges' },
};

const longFile = 'exports/northwind-labs/2026/q3/reconciliation/processor-events-duplicate-charges-INV-20418-INV-20431-full-export.csv';

const mod: StateModule = {
  slug: 'agent-handoff',
  title: 'Agent handoff',
  width: 480,
  groups: [
    {
      label: 'Status',
      states: [
        { id: 'accepted', label: 'accepted', render: () => <AgentHandoff from={from} to={to} reason={reason} context={context} carried={carried} /> },
        { id: 'pending', label: 'pending', render: () => <AgentHandoff status="pending" from={from} to={to} reason={reason} context={context} carried={carried} /> },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'reason-only', label: 'reason only, no roles', render: () => <AgentHandoff from={{ name: 'Research Scout' }} to={{ name: 'Report Writer' }} reason="Source gathering complete; 14 sources ready for drafting." /> },
        { id: 'no-context', label: 'no context summary', render: () => <AgentHandoff from={from} to={to} reason={reason} carried={carried} /> },
        { id: 'no-carried', label: 'no carried artifacts', render: () => <AgentHandoff from={from} to={to} reason={reason} context={context} /> },
        { id: 'long-context', label: 'long context', render: () => <AgentHandoff from={from} to={to} reason={reason} context={longContext} carried={carried} /> },
        { id: 'many-carried', label: 'many carried (wraps)', render: () => <AgentHandoff status="pending" from={from} to={to} reason={reason} context={context} carried={manyCarried} /> },
        { id: 'long-file-name', label: 'long carried file name', render: () => <AgentHandoff from={from} to={to} reason={reason} carried={[longFile, 'INV-20418.pdf']} /> },
        { id: 'long-names', label: 'long names and roles', render: () => <AgentHandoff {...longNames} reason={reason} context={context} carried={carried} /> },
        { id: 'long-reason', label: 'long unbroken reason', render: () => <AgentHandoff from={from} to={to} reason="Escalation requires access to https://billing.northwind.example/admin/refunds/INV-20418/duplicate-charge-review/approval-queue?region=emea&tier=2" /> },
      ],
    },
  ],
  missing: ['Rejected / failed handoff (status only accepts pending or accepted)', 'Compact or narrow layout variant (no size prop)'],
};

export default mod;
