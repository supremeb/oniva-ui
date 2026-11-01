import { AttachmentPreview } from 'oniva-ui';
import type { Attachment } from 'oniva-ui';
import type { StateModule } from '../types';

const svg = (bg: string, fg: string, sun: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="${bg}"/><circle cx="22" cy="10" r="5" fill="${sun}"/><path d="M0 26 L10 14 L20 24 L32 16 V32 H0Z" fill="${fg}"/></svg>`,
  )}`;

const violet = svg('#8b5cf6', '#4c1d95', '#fde68a');
const teal = svg('#14b8a6', '#134e4a', '#fef3c7');

const pdf: Attachment = { id: 'p1', name: 'Q3-board-deck.pdf', kind: 'pdf', size: '2.4 MB' };
const image: Attachment = { id: 'i1', name: 'checkout-flow.png', kind: 'image', size: '812 KB', previewUrl: violet };
const code: Attachment = { id: 'c1', name: 'reconcile_invoices.py', kind: 'code', size: '6 KB' };

const typical: Attachment[] = [
  pdf,
  image,
  code,
  { id: 'i2', name: 'invoice-table-mobile.jpg', kind: 'image', size: '1.1 MB', previewUrl: teal },
  { id: 'p2', name: 'northwind-labs-msa-2026.pdf', kind: 'pdf', size: '418 KB' },
];

const many: Attachment[] = [
  ...typical,
  { id: 'c2', name: 'retry-schedule.test.ts', kind: 'code', size: '9 KB' },
  { id: 'c3', name: 'queue.config.json', kind: 'code', size: '1 KB' },
  { id: 'p3', name: 'ledger-export-oct.pdf', kind: 'pdf', size: '5.7 MB' },
  { id: 'i3', name: 'dashboard-empty-state.png', kind: 'image', size: '236 KB', previewUrl: violet },
  { id: 'c4', name: 'migrate_accounts.sql', kind: 'code', size: '14 KB' },
  { id: 'p4', name: 'onboarding-checklist.pdf', kind: 'pdf', size: '96 KB' },
  { id: 'i4', name: 'receipt-scan-0412.jpg', kind: 'image', size: '3.2 MB', previewUrl: teal },
];

const remove = () => {};

const mod: StateModule = {
  slug: 'attachment-preview',
  title: 'Attachment preview',
  width: 720,
  groups: [
    {
      label: 'Data',
      states: [
        { id: 'empty', label: 'empty', render: () => <AttachmentPreview attachments={[]} /> },
        { id: 'one-pdf', label: 'one pdf', render: () => <AttachmentPreview attachments={[pdf]} /> },
        { id: 'one-image', label: 'one image with thumbnail', render: () => <AttachmentPreview attachments={[image]} /> },
        { id: 'one-code', label: 'one code file', render: () => <AttachmentPreview attachments={[code]} /> },
        { id: 'typical', label: 'typical (5 files)', render: () => <AttachmentPreview attachments={typical} /> },
        { id: 'many', label: 'many (12 files, wraps)', render: () => <AttachmentPreview attachments={many} /> },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'image-no-preview',
          label: 'image without previewUrl',
          render: () => <AttachmentPreview attachments={[{ id: 'i', name: 'screenshot-2026-10-31.png', kind: 'image', size: '1.8 MB' }]} />,
        },
        {
          id: 'no-size',
          label: 'no size',
          render: () => (
            <AttachmentPreview
              attachments={[
                { id: 'a', name: 'notes.pdf', kind: 'pdf' },
                { id: 'b', name: 'App.tsx', kind: 'code' },
                { id: 'c', name: 'hero.png', kind: 'image', previewUrl: violet },
              ]}
            />
          ),
        },
        {
          id: 'long-name',
          label: 'long unbroken names',
          render: () => (
            <AttachmentPreview
              attachments={[
                { id: 'a', name: 'northwind-labs-quarterly-business-review-finance-appendix-final-v7-approved.pdf', kind: 'pdf', size: '12.4 MB' },
                { id: 'b', name: 'packages/northwind-queue/src/workers/exponential-backoff-with-decorrelated-jitter.worker.ts', kind: 'code', size: '18 KB' },
                { id: 'c', name: 'IMG_20261031_091542_000000000000000000000000.jpeg', kind: 'image', size: '4.9 MB', previewUrl: teal },
              ]}
            />
          ),
        },
      ],
    },
    {
      label: 'Access',
      states: [
        { id: 'removable', label: 'removable (onRemove)', render: () => <AttachmentPreview attachments={typical.slice(0, 3)} onRemove={remove} /> },
        { id: 'removable-long', label: 'removable, long names', render: () => (
            <AttachmentPreview
              onRemove={remove}
              attachments={[
                { id: 'a', name: 'northwind-labs-quarterly-business-review-finance-appendix-final-v7-approved.pdf', kind: 'pdf', size: '12.4 MB' },
                { id: 'b', name: 'reconcile_invoices.py', kind: 'code', size: '6 KB' },
              ]}
            />
          ) },
        { id: 'read-only', label: 'read-only (no onRemove)', render: () => <AttachmentPreview attachments={typical.slice(0, 3)} /> },
      ],
    },
  ],
  missing: [
    'Uploading / progress state (no status or progress prop)',
    'Upload failed / error chip (no error or tone prop)',
    'Disabled chips (no isDisabled prop)',
    'Click-to-open / preview of a file (chips are not interactive apart from remove)',
    'Other file kinds (only pdf, image, code)',
  ],
};

export default mod;
