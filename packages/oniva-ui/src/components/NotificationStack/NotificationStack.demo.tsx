import type { DemoModule } from '../../internal/demo';
import { NotificationStack, type Notice } from './NotificationStack';

const notices: Notice[] = [
  {
    id: 'theme',
    badge: 'New',
    title: 'Dark mode is here',
    text: 'Every screen now follows your system theme, or pick one yourself in settings.',
    action: { label: 'Try it', href: '#theme' },
    pattern: 'orbit',
  },
  {
    id: 'maintenance',
    badge: 'Notice',
    title: 'Scheduled maintenance',
    text: 'Reports are offline on Sunday from 02:00 to 03:00 UTC.',
    action: { label: 'View status', href: '#status' },
    pattern: 'grid',
  },
  {
    id: 'export',
    badge: 'Release',
    title: 'Parquet exports are live',
    text: 'Export any table as Parquet from the share menu.',
    pattern: 'orbit',
  },
  {
    id: 'invite',
    badge: 'Team',
    title: 'Mara accepted your invite',
    text: 'She now has editor access to Q4 planning.',
    pattern: 'rays',
  },
];

const demo: DemoModule = {
  meta: {
    title: 'Notification stack',
    slug: 'notification-stack',
    category: 'Feedback',
    description: 'Notice cards stacked behind each other. Dismiss the front one to reveal the next.',
  },
  demos: [
    {
      name: 'Three notices',
      code: `<NotificationStack
  notices={[
    { id: 'maintenance', badge: 'Notice', title: 'Scheduled maintenance', text: 'Reports are offline on Sunday.', action: { label: 'View status', href: '#status' }, pattern: 'grid' },
    { id: 'export', badge: 'Release', title: 'Parquet exports are live', text: 'Export any table as Parquet.' },
  ]}
  onDismiss={(n) => markRead(n.id)}
/>`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 380 }}>
          <NotificationStack notices={notices} />
        </div>
      ),
    },
  ],
};

export default demo;
