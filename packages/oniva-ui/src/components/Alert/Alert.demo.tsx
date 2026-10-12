import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../Button';
import { Alert } from './Alert';

const col = { display: 'grid', gap: 12, maxWidth: 560, width: '100%' } as const;

function Dismissible() {
  const [open, setOpen] = useState(true);
  if (!open) return <Button variant="secondary" size="sm" onPress={() => setOpen(true)}>Show alert again</Button>;
  return (
    <Alert
      variant="info"
      title="Scheduled maintenance"
      description="Payouts are paused Oct 14, 01:00-03:00 UTC."
      onDismiss={() => setOpen(false)}
    />
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Alert',
    slug: 'alert',
    category: 'Feedback',
    description: 'Callout and banner for inline status messaging with icon, actions and dismiss.',
  },
  demos: [
    {
      name: 'Callouts',
      code: `<Alert variant="info" title="New payout schedule" description="Payouts now arrive on Tuesdays." />
<Alert variant="success" title="Invoice #INV-2041 paid" description="$2,480.00 received from Northwind." />
<Alert variant="warning" title="Card expiring" description="Visa ending 4242 expires Nov 2026." />
<Alert variant="danger" title="Payment failed" description="We couldn't charge $129.00." />`,
      Component: () => (
        <div style={col}>
          <Alert variant="info" title="New payout schedule" description="Payouts now arrive on Tuesdays." />
          <Alert variant="success" title="Invoice #INV-2041 paid" description="$2,480.00 received from Northwind." />
          <Alert variant="warning" title="Card expiring" description="Visa ending 4242 expires Nov 2026." />
          <Alert variant="danger" title="Payment failed" description="We couldn't charge $129.00." />
        </div>
      ),
    },
    {
      name: 'Banners with actions',
      code: `<Alert appearance="banner" variant="warning" title="Trial ends in 3 days"
  actions={<Button size="xs">Upgrade</Button>} />`,
      Component: () => (
        <div style={col}>
          <Alert
            appearance="banner"
            variant="warning"
            title="Trial ends in 3 days"
            description="Upgrade to keep 12 team seats."
            actions={<Button size="xs">Upgrade</Button>}
          />
          <Alert appearance="banner" variant="danger" title="Bank connection lost" description="Reconnect Chase to resume syncing." />
          <Alert appearance="banner" variant="success" title="Workspace migrated" />
        </div>
      ),
    },
    {
      name: 'Dismissible',
      code: `<Alert variant="info" title="Scheduled maintenance" onDismiss={() => setOpen(false)} />`,
      Component: Dismissible,
    },
  ],
};
export default demo;
