import { Button } from '../Button';
import type { DemoModule } from '../../internal/demo';
import { toast, ToastProvider } from './Toast';

const row = { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' } as const;

const demo: DemoModule = {
  meta: {
    title: 'Toast',
    slug: 'toast',
    category: 'Overlays',
    description:
      'Brief, auto-dismissing notifications from an imperative toast() queue. Variants, an action button, pause on hover/focus, and a labelled live region. Mount ToastProvider once inside ThemeProvider.',
  },
  demos: [
    {
      name: 'Variants',
      code: `// once, near the root (inside ThemeProvider)
<ToastProvider placement="bottom-right">{children}</ToastProvider>

toast.success('Invoice sent', { description: 'INV-2041 emailed to maria.chen@northwind.co' });
toast.warning('Card expires soon', { description: 'Visa ending 4821 expires Nov 2026.' });
toast.danger('Payout failed', { description: 'Chase ••4821 declined $12,480.00.' });
toast.info('Sync running', { description: '1,204 transactions imported so far.' });`,
      Component: () => (
        <ToastProvider>
          <div style={row}>
            <Button
              variant="secondary"
              onPress={() =>
                toast.success('Invoice sent', {
                  description: 'INV-2041 emailed to maria.chen@northwind.co',
                })
              }
            >
              Success
            </Button>
            <Button
              variant="secondary"
              onPress={() =>
                toast.warning('Card expires soon', {
                  description: 'Visa ending 4821 expires Nov 2026.',
                })
              }
            >
              Warning
            </Button>
            <Button
              variant="secondary"
              onPress={() =>
                toast.danger('Payout failed', {
                  description: 'Chase ••4821 declined $12,480.00.',
                })
              }
            >
              Danger
            </Button>
            <Button
              variant="secondary"
              onPress={() =>
                toast.info('Sync running', { description: '1,204 transactions imported so far.' })
              }
            >
              Info
            </Button>
          </div>
        </ToastProvider>
      ),
    },
    {
      name: 'With action',
      code: `// uses the ToastProvider mounted above
toast({
  title: 'Customer archived',
  description: 'Northwind Traders moved to Archive.',
  action: { label: 'Undo', onPress: () => restore() },
  duration: 8000,
});`,
      Component: () => (
        <>
          <Button
            onPress={() =>
              toast({
                title: 'Customer archived',
                description: 'Northwind Traders moved to Archive.',
                action: {
                  label: 'Undo',
                  onPress: () => toast.success('Restored Northwind Traders'),
                },
                duration: 8000,
              })
            }
          >
            Archive customer
          </Button>
        </>
      ),
    },
  ],
};

export default demo;
