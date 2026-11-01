import { ComposerAttachments } from 'oniva-ui';
import type { AttachmentFile } from 'oniva-ui';
import type { StateModule } from '../types';

const preview = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c9cf5"/><stop offset="1" stop-color="#2d3a6b"/></linearGradient></defs><rect width="64" height="64" fill="url(#g)"/><circle cx="46" cy="18" r="7" fill="#f3d9a4"/><path d="M0 64 L22 30 L38 50 L50 38 L64 56 V64 Z" fill="#101a3d"/></svg>',
)}`;

const csv: AttachmentFile = { id: 'a', name: 'q3_revenue.csv', size: 48_200, type: 'text/csv' };
const pdf: AttachmentFile = { id: 'b', name: 'northwind-board-deck.pdf', size: 2_400_000, type: 'application/pdf' };
const img: AttachmentFile = { id: 'c', name: 'pipeline-overview.png', size: 310_000, type: 'image/png', previewUrl: preview };
const longName = 'northwind-labs-quarterly-business-review-appendix-final-v3-reviewed-by-finance-2026.xlsx';

const noop = () => undefined;

const many: AttachmentFile[] = [
  csv,
  pdf,
  img,
  { id: 'd', name: 'churn-cohorts.xlsx', size: 1_180_000 },
  { id: 'e', name: 'incident-2291.log', size: 912 },
  { id: 'f', name: 'roadmap.md', size: 6_400, type: 'text/markdown' },
  { id: 'g', name: 'onboarding-flow.jpg', size: 840_000, type: 'image/jpeg' },
  { id: 'h', name: 'invoice-0417.pdf', size: 96_000, type: 'application/pdf' },
  { id: 'i', name: 'export.zip', size: 18_400_000, status: 'uploading', progress: 35 },
];

const mod: StateModule = {
  slug: 'composer-attachments',
  title: 'Composer attachments',
  width: 720,
  groups: [
    {
      label: 'Data',
      states: [
        { id: 'empty', label: 'empty', render: () => <ComposerAttachments files={[]} onRemove={noop} /> },
        { id: 'one-file', label: 'one file', render: () => <ComposerAttachments files={[csv]} onRemove={noop} /> },
        { id: 'typical', label: 'typical (doc, pdf, image preview)', render: () => <ComposerAttachments files={[csv, pdf, img]} onRemove={noop} /> },
        { id: 'many', label: 'many files wrap', render: () => <ComposerAttachments files={many} onRemove={noop} /> },
        { id: 'sizes', label: 'sizes B / KB / MB / unknown', render: () => (
          <ComposerAttachments
            onRemove={noop}
            files={[
              { id: '1', name: 'notes.txt', size: 412 },
              { id: '2', name: 'q3_revenue.csv', size: 48_200 },
              { id: '3', name: 'recording.mov', size: 126_400_000 },
              { id: '4', name: 'draft.docx' },
            ]}
          />
        ) },
        { id: 'read-only', label: 'no remove buttons', render: () => <ComposerAttachments files={[csv, pdf, img]} /> },
      ],
    },
    {
      label: 'Upload',
      states: [
        { id: 'uploading', label: 'uploading (file)', render: () => (
          <ComposerAttachments onRemove={noop} files={[{ ...pdf, status: 'uploading', progress: 62 }]} />
        ) },
        { id: 'uploading-image', label: 'uploading (image, with and without preview)', render: () => (
          <ComposerAttachments
            onRemove={noop}
            files={[
              { ...img, status: 'uploading', progress: 18 },
              { id: 'p2', name: 'whiteboard.png', size: 520_000, type: 'image/png', status: 'uploading', progress: 74 },
            ]}
          />
        ) },
        { id: 'progress-zero', label: 'just started (0%)', render: () => (
          <ComposerAttachments onRemove={noop} files={[{ ...pdf, status: 'uploading' }]} />
        ) },
        { id: 'progress-implied', label: 'progress without status', render: () => (
          <ComposerAttachments onRemove={noop} files={[{ ...pdf, progress: 45 }]} />
        ) },
        { id: 'progress-complete', label: 'progress 100 (done)', render: () => (
          <ComposerAttachments onRemove={noop} files={[{ ...pdf, progress: 100 }]} />
        ) },
        { id: 'mixed', label: 'done, uploading, error', render: () => (
          <ComposerAttachments
            onRemove={noop}
            files={[
              { ...csv, status: 'done' },
              { ...pdf, status: 'uploading', progress: 62 },
              { id: 'z', name: 'archive.zip', status: 'error' },
            ]}
          />
        ) },
      ],
    },
    {
      label: 'Error',
      states: [
        { id: 'error', label: 'upload failed', render: () => (
          <ComposerAttachments onRemove={noop} files={[{ id: 'z', name: 'archive.zip', size: 52_000_000, status: 'error' }]} />
        ) },
        { id: 'error-image', label: 'failed image with preview', render: () => (
          <ComposerAttachments onRemove={noop} files={[{ ...img, status: 'error' }]} />
        ) },
        { id: 'error-read-only', label: 'failed, no remove', render: () => (
          <ComposerAttachments files={[{ id: 'z', name: 'archive.zip', status: 'error' }]} />
        ) },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'long-name', label: 'long file name truncates', render: () => (
          <ComposerAttachments
            onRemove={noop}
            files={[
              { id: 'l1', name: longName, size: 3_900_000 },
              { id: 'l2', name: longName.replace('.xlsx', '.png'), size: 3_900_000, type: 'image/png', status: 'uploading', progress: 40 },
              { id: 'l3', name: longName.replace('.xlsx', '.zip'), status: 'error' },
            ]}
          />
        ) },
        { id: 'unbroken-name', label: 'unbroken name, no extension', render: () => (
          <ComposerAttachments onRemove={noop} files={[{ id: 'u1', name: 'northwind_labs_customer_export_20261031_final_FINAL_v2', size: 1_200 }]} />
        ) },
        { id: 'short-name', label: 'very short name', render: () => (
          <ComposerAttachments onRemove={noop} files={[{ id: 's1', name: 'a.md', size: 90 }, { id: 's2', name: 'b', size: 20 }]} />
        ) },
      ],
    },
  ],
  missing: [
    'Remove-in-progress (no pending/removing state in the code)',
    'Retry action on a failed upload (only remove is exposed)',
    'Disabled / read-only styling (omitting onRemove only hides the buttons)',
    'Cancel while uploading (the remove button is the only control)',
  ],
};
export default mod;
