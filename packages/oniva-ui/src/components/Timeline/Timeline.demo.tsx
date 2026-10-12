import { CreditCard, GitMerge, MessageSquare, UserPlus } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { Timeline, type TimelineEvent } from './Timeline';

const events: TimelineEvent[] = [
  { id: '1', time: '2026-10-12T09:42:00', actor: 'Priya Nair', action: 'merged pull request #482 into main', icon: <GitMerge size={14} />, tone: 'success', details: 'Usage-based billing preview: adds metered line items to the invoice draft and a new /v2/usage endpoint. 14 files changed, 3 reviewers approved.' },
  { id: '2', time: '2026-10-12T08:15:00', actor: 'Marcus Okafor', action: 'commented on Webhook retry dashboard', icon: <MessageSquare size={14} />, tone: 'info', details: '“Can we cap retries at 8 with exponential backoff? Stripe does 3 days max.”' },
  { id: '3', time: '2026-10-11T16:30:00', actor: 'Lena Schmidt', action: 'invited aisha@northwind.io to the workspace', icon: <UserPlus size={14} /> },
  { id: '4', time: '2026-10-11T11:05:00', actor: 'Billing', action: 'charged $1,240.00 to Visa ending 4242', icon: <CreditCard size={14} />, tone: 'warning', details: 'Invoice INV-2041 · Pro plan, 62 seats · Retry 1 of 3 succeeded.' },
];

const demo: DemoModule = {
  meta: {
    title: 'Timeline',
    slug: 'timeline',
    category: 'Data display',
    description: 'Vertical activity timeline grouped by day, with tone-colored icon dots and expandable details.',
  },
  demos: [
    {
      name: 'Workspace activity',
      code: `<Timeline
  today="2026-10-12"
  events={[
    { id: '1', time: '2026-10-12T09:42:00', actor: 'Priya Nair',
      action: 'merged pull request #482 into main',
      icon: <GitMerge size={14} />, tone: 'success', details: '…' },
  ]}
/>`,
      Component: () => <Timeline events={events} today="2026-10-12" />,
    },
  ],
};

export default demo;
