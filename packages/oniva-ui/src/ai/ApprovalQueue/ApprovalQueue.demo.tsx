import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { ApprovalQueue, type PendingToolCall } from './ApprovalQueue';

const initial: PendingToolCall[] = [
  { id: '1', agent: 'Billing Specialist', tool: 'stripe.refund', summary: 'Refund $740.00 to Acme Corp (INV-20418)', risk: 'high', requestedAt: '2 min ago', args: '{ "charge": "ch_3PqX2", "amount": 74000, "reason": "duplicate" }' },
  { id: '2', agent: 'Deploy Bot', tool: 'github.merge_pull_request', summary: 'Merge #482 "Fix webhook retries" into main', risk: 'medium', requestedAt: '6 min ago' },
  { id: '3', agent: 'Research Scout', tool: 'gmail.send', summary: 'Send follow-up to maria@northwind.example', risk: 'low', requestedAt: '11 min ago' },
];

function Live() {
  const [items, setItems] = useState(initial);
  const drop = (id: string) => setItems((l) => l.filter((i) => i.id !== id));
  return (
    <div style={{ maxWidth: 560, width: '100%' }}>
      <ApprovalQueue items={items} onApprove={drop} onDeny={drop} />
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Approval queue',
    slug: 'approval-queue',
    category: 'AI & Agent',
    description: 'A list of pending tool calls with risk level, arguments and approve / deny actions.',
  },
  demos: [
    {
      name: 'Pending tool calls',
      code: `<ApprovalQueue items={items} onApprove={approve} onDeny={deny} />`,
      Component: Live,
    },
  ],
};

export default demo;
