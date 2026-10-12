import { CreditCard, ShieldCheck } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { NotificationCenter, type NotificationItem } from './NotificationCenter';

const items: NotificationItem[] = [
  { id: 'n1', actor: 'Priya Nair', title: 'Priya mentioned you in Q4 plan', body: '"Can you confirm the launch date by Friday?"', time: '5m ago', mention: true },
  { id: 'n2', icon: <CreditCard size={16} />, title: 'Invoice INV-2041 paid', body: 'Northwind Traders sent $4,820.00.', time: '2h ago' },
  { id: 'n3', actor: 'Kofi Mensah', title: 'Kofi requested access to Billing', time: '4h ago', mention: true },
  { id: 'n4', icon: <ShieldCheck size={16} />, title: 'Two-factor enabled', body: 'Your account is now protected with an authenticator app.', time: 'Yesterday', read: true },
  { id: 'n5', title: 'Weekly digest is ready', body: '12 deals moved forward, 3 stalled.', time: 'Mon', read: true },
];

const demo: DemoModule = {
  meta: {
    title: 'NotificationCenter',
    slug: 'notification-center',
    category: 'Widgets',
    description: 'Inbox with All / Unread / Mentions tabs, unread dots and mark-all-read.',
  },
  demos: [
    {
      name: 'Inbox',
      code: `<NotificationCenter notifications={items} />`,
      Component: () => (
        <div style={{ maxWidth: 440 }}>
          <NotificationCenter notifications={items} />
        </div>
      ),
    },
    {
      name: 'All caught up',
      code: `<NotificationCenter notifications={items.map((n) => ({ ...n, read: true }))} />`,
      Component: () => (
        <div style={{ maxWidth: 440 }}>
          <NotificationCenter notifications={items.map((n) => ({ ...n, read: true }))} />
        </div>
      ),
    },
  ],
};

export default demo;
