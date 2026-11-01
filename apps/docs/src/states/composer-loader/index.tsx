import { Composer, ComposerLoader } from 'oniva-ui';
import type { ModelOption } from 'oniva-ui';
import type { StateModule } from '../types';

const models: ModelOption[] = [
  { id: 'nova-pro', name: 'Nova Pro', description: 'Fast and capable for everyday work', speed: 4, quality: 4, cost: 3, latencyMs: 420, pricePerM: 3 },
  { id: 'atlas-2', name: 'Atlas 2', description: 'Most intelligent, slower', speed: 2, quality: 5, cost: 5, latencyMs: 1100, pricePerM: 15 },
];

const longText =
  'Summarize the open invoices for October and flag anything overdue. Group them by customer, include the payment terms and the contact at each account, and note which ones were already escalated to finance. Then compare the totals with September and explain the biggest movements, and draft a short note for the account owners.';

const longUrl =
  'https://reports.northwind-labs.example/finance/2026/q3/exports/open-invoices-by-customer-segment-and-region-with-payment-terms-and-escalation-status.csv?token=abcdef0123456789abcdef0123456789';

const body = (text: string) => (
  <div style={{ padding: '18px 18px 44px', fontSize: 14, color: 'var(--oniva-color-text-muted)' }}>{text}</div>
);

const mod: StateModule = {
  slug: 'composer-loader',
  title: 'Composer loader',
  width: 720,
  groups: [
    {
      label: 'Run',
      states: [
        { id: 'working', label: 'working (active)', render: () => <ComposerLoader>{body('Analyze Q3 revenue by segment…')}</ComposerLoader> },
        { id: 'idle', label: 'idle (inactive)', render: () => <ComposerLoader active={false}>{body('Analyze Q3 revenue by segment…')}</ComposerLoader> },
      ],
    },
    {
      label: 'Wrapping a composer',
      states: [
        { id: 'composer-working', label: 'composer, working', render: () => <ComposerLoader><Composer models={models} onAttach={() => undefined} defaultValue="Draft the October close checklist" /></ComposerLoader> },
        { id: 'composer-idle', label: 'composer, idle', render: () => <ComposerLoader active={false}><Composer models={models} onAttach={() => undefined} defaultValue="Draft the October close checklist" /></ComposerLoader> },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'long-text', label: 'long wrapped text', render: () => <ComposerLoader>{body(longText)}</ComposerLoader> },
        { id: 'long-url', label: 'long unbroken URL', render: () => <ComposerLoader>{body(longUrl)}</ComposerLoader> },
      ],
    },
    {
      label: 'Size',
      states: [
        { id: 'narrow', label: 'narrow (320)', render: () => <div style={{ width: 320 }}><ComposerLoader>{body('Analyze Q3 revenue by segment…')}</ComposerLoader></div> },
        { id: 'tall-narrow', label: 'tall and narrow (320 x 640)', render: () => <div style={{ width: 320 }}><ComposerLoader><div style={{ height: 640, padding: 18, fontSize: 14 }}>Tall, narrow composer body</div></ComposerLoader></div> },
        { id: 'tall', label: 'tall content', render: () => <ComposerLoader><div style={{ height: 320, padding: 18, fontSize: 14 }}>Tall composer body</div></ComposerLoader> },
      ],
    },
  ],
  missing: ['Per-error or paused state: the component only has active / inactive'],
};

export default mod;
