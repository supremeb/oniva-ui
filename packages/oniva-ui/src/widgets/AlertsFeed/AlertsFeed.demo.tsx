import type { DemoModule } from '../../internal/demo';
import { AlertsFeed, type AlertItem } from './AlertsFeed';

const alerts: AlertItem[] = [
  { id: 'a1', severity: 'critical', title: 'Unusual sign-in blocked', description: 'A login from a new device in Lisbon was stopped.', date: 'Oct 11' },
  { id: 'a2', severity: 'warning', title: 'Invoice INV-2041 overdue', description: 'Northwind Traders is 3 days past the $4,820 due date.', date: 'Oct 10' },
  { id: 'a3', severity: 'info', title: 'Quarterly report ready', description: 'Q3 revenue summary was generated and shared with finance.', date: 'Oct 9' },
  { id: 'a4', severity: 'success', title: 'Backup completed', description: 'Nightly snapshot finished in 6m 12s, 41.8 GB stored.', date: 'Oct 8' },
  { id: 'a5', severity: 'warning', title: 'API usage at 85%', description: 'You have used 425k of 500k monthly requests.', date: 'Oct 7' },
  { id: 'a6', severity: 'info', title: 'New teammate joined', description: 'Priya Nair accepted the invite to the Growth workspace.', date: 'Oct 6' },
];

const demo: DemoModule = {
  meta: {
    title: 'AlertsFeed',
    slug: 'alerts-feed',
    category: 'Widgets',
    description: 'Scrollable "Important alerts" list: icon circle, title, description and date chip per card.',
  },
  demos: [
    {
      name: 'This week',
      code: `<AlertsFeed alerts={alerts} maxHeight={340} />`,
      Component: () => (
        <div style={{ maxWidth: 420 }}>
          <AlertsFeed alerts={alerts} maxHeight={340} />
        </div>
      ),
    },
    {
      name: 'Short list',
      code: `<AlertsFeed alerts={alerts.slice(0, 2)} title="Security" period="today" />`,
      Component: () => (
        <div style={{ maxWidth: 420 }}>
          <AlertsFeed alerts={alerts.slice(0, 2)} title="Security" period="today" />
        </div>
      ),
    },
  ],
};

export default demo;
