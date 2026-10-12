import { Button } from '../Button';
import type { DemoModule } from '../../internal/demo';
import { useRef, useState } from 'react';
import { toast, ToastProvider, type ToastPlacement } from './Toast';

const row = { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' } as const;

const POSITIONS: ToastPlacement[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
];

const SAMPLES = [
  () => toast.success('Invoice sent', { description: 'INV-2041 emailed to maria.chen@northwind.co' }),
  () => toast.info('Sync running', { description: '1,204 transactions imported so far.' }),
  () => toast.warning('Card expires soon', { description: 'Visa ending 4821 expires Nov 2026.' }),
  () => toast.danger('Payout failed', { description: 'Chase ••4821 declined $12,480.00.' }),
  () => toast('Draft saved', { description: 'Budget FY27 · Oct 12, 3:42 PM' }),
];

function PlaygroundDemo() {
  const [position, setPosition] = useState<ToastPlacement>('bottom-right');
  const n = useRef(0);
  return (
    <ToastProvider position={position} maxVisible={3}>
      <div style={row}>
        <Button onPress={() => SAMPLES[n.current++ % SAMPLES.length]!()}>Add toast</Button>
        <Button
          variant="secondary"
          onPress={() => {
            SAMPLES.slice(0, 4).forEach((f, i) => setTimeout(f, i * 120));
          }}
        >
          Fire 4
        </Button>
        <Button variant="secondary" onPress={() => toast.clear()}>
          Clear
        </Button>
        <select
          aria-label="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value as ToastPlacement)}
        >
          {POSITIONS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>
    </ToastProvider>
  );
}

function PromiseDemo() {
  return (
    <>
      <div style={row}>
        <Button
          onPress={() =>
            toast.promise(new Promise<{ rows: number }>((res) => setTimeout(() => res({ rows: 4218 }), 1800)), {
              loading: 'Exporting Q3 report…',
              success: (r) => ({
                title: 'Report ready',
                description: `${r.rows.toLocaleString()} rows exported`,
              }),
              error: 'Export failed',
            })
          }
        >
          Export (succeeds)
        </Button>
        <Button
          variant="secondary"
          onPress={() =>
            toast.promise(new Promise((_, rej) => setTimeout(() => rej(new Error('x')), 1500)), {
              loading: 'Charging Visa ••4821…',
              success: 'Charged',
              error: { title: 'Payment declined', description: 'Try another card.' },
            })
          }
        >
          Charge (fails)
        </Button>
      </div>
    </>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Toast',
    slug: 'toast',
    category: 'Overlays',
    description:
      'Sonner-style stacked notifications from an imperative toast() queue: newest in front, older toasts peek behind and fan out on hover or focus, timers pause on hover, focus and window blur, swipe to dismiss, promise toasts, and a labelled live region. Mount ToastProvider once inside ThemeProvider.',
  },
  demos: [
    {
      name: 'Variants',
      code: `// once, near the root (inside ThemeProvider)
<ToastProvider placement="bottom-right">{children}</ToastProvider>
// (this docs page mounts one provider, in the Stack playground below)

toast.success('Invoice sent', { description: 'INV-2041 emailed to maria.chen@northwind.co' });
toast.warning('Card expires soon', { description: 'Visa ending 4821 expires Nov 2026.' });
toast.danger('Payout failed', { description: 'Chase ••4821 declined $12,480.00.' });
toast.info('Sync running', { description: '1,204 transactions imported so far.' });`,
      Component: () => (
        <>
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
        </>
      ),
    },
    {
      name: 'Stack playground',
      code: `// Fire several in a row: they stack, then fan out when you hover the stack.
// Swipe a toast toward the screen edge to dismiss it.
toast.success('Invoice sent', { description: 'INV-2041 emailed to maria.chen@northwind.co' });
toast.info('Sync running', { description: '1,204 transactions imported so far.' });
toast.warning('Card expires soon', { description: 'Visa ending 4821 expires Nov 2026.' });
toast.danger('Payout failed', { description: 'Chase ••4821 declined $12,480.00.' });

<ToastProvider position="bottom-right" maxVisible={3} />`,
      Component: PlaygroundDemo,
    },
    {
      name: 'Promise',
      code: `toast.promise(exportReport(), {
  loading: 'Exporting Q3 report…',
  success: (r) => ({ title: 'Report ready', description: \`\${r.rows} rows exported\` }),
  error: 'Export failed',
});`,
      Component: PromiseDemo,
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
