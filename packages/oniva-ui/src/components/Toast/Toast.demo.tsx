import { Button } from '../Button';
import type { DemoModule } from '../../internal/demo';
import { useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { FileText, RefreshCw, Save, Trash2, Upload } from 'lucide-react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { Kbd } from '../Kbd';
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

const doc = stylex.create({
  wrap: { display: 'flex', flexDirection: 'column', fontFamily: font['--oniva-font-sans'], gap: 12, maxWidth: 420, width: '100%' },
  card: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-card'],
    borderStyle: 'solid',
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    padding: 12,
  },
  head: { alignItems: 'center', display: 'flex', gap: 12 },
  tile: {
    alignItems: 'center',
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-icon-muted'],
    display: 'flex',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  title: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-medium'] },
  sub: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'] },
  grid: { display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' },
  hint: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    fontSize: font['--oniva-font-size-13'],
    gap: 6,
    justifyContent: 'center',
  },
});

function DocumentActions() {
  return (
    <div {...stylex.props(doc.wrap)}>
      <div {...stylex.props(doc.card)}>
        <div {...stylex.props(doc.head)}>
          <span aria-hidden="true" {...stylex.props(doc.tile)}>
            <FileText size={18} />
          </span>
          <div>
            <div {...stylex.props(doc.title)}>Quarterly report</div>
            <div {...stylex.props(doc.sub)}>Finance · edited 2 min ago</div>
          </div>
        </div>
        <div {...stylex.props(doc.grid)}>
          <Button variant="secondary" startIcon={<Save size={16} />} onPress={() => toast.success('Draft saved', { description: 'Quarterly report · just now' })}>
            Save draft
          </Button>
          <Button variant="secondary" startIcon={<Trash2 size={16} />} onPress={() => toast.danger('File deleted', { description: 'Quarterly report moved to trash.', action: { label: 'Undo', onPress: () => toast.success('Restored') } })}>
            Delete file
          </Button>
          <Button
            variant="secondary"
            startIcon={<Upload size={16} />}
            onPress={() =>
              toast.promise(new Promise<void>((res) => setTimeout(res, 2200)), {
                loading: { title: 'Uploading report…', description: 'Quarterly-Report.pdf · 4.2 MB' },
                success: { title: 'Report uploaded', description: 'Quarterly-Report.pdf · 4.2 MB' },
                error: 'Upload failed',
              })
            }
          >
            Upload report
          </Button>
          <Button variant="secondary" startIcon={<RefreshCw size={16} />} onPress={() => toast.info('Sync running', { description: '1,204 items so far.' })}>
            Sync
          </Button>
        </div>
      </div>
      <div {...stylex.props(doc.hint)}>
        Press <Kbd>F8</Kbd> to jump to notifications
      </div>
    </div>
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
      name: 'Document actions',
      code: `// Buttons fire toasts; the stack sits in the corner. Press F8 to jump to it.
toast.promise(upload(), {
  loading: { title: 'Uploading report…', description: 'Quarterly-Report.pdf · 4.2 MB' },
  success: { title: 'Report uploaded', description: 'Quarterly-Report.pdf · 4.2 MB' },
  error: 'Upload failed',
});`,
      Component: DocumentActions,
    },
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
