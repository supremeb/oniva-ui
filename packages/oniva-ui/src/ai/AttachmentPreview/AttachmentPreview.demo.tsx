import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { AttachmentPreview, type Attachment } from './AttachmentPreview';

const thumb = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#8b5cf6"/><circle cx="22" cy="10" r="5" fill="#fde68a"/><path d="M0 26 L10 14 L20 24 L32 16 V32 H0Z" fill="#4c1d95"/></svg>')}`;

const initial: Attachment[] = [
  { id: '1', name: 'Q3-board-deck.pdf', kind: 'pdf', size: '2.4 MB' },
  { id: '2', name: 'checkout-flow.png', kind: 'image', size: '812 KB', previewUrl: thumb },
  { id: '3', name: 'reconcile_invoices.py', kind: 'code', size: '6 KB' },
];

function Removable() {
  const [items, setItems] = useState(initial);
  return <AttachmentPreview attachments={items} onRemove={(id) => setItems((l) => l.filter((x) => x.id !== id))} />;
}

const demo: DemoModule = {
  meta: {
    title: 'Attachment preview',
    slug: 'attachment-preview',
    category: 'AI & Agent',
    description: 'File chips for pdf, image and code attachments with thumbnails and a remove button.',
  },
  demos: [
    {
      name: 'Removable',
      code: `<AttachmentPreview attachments={items} onRemove={(id) => remove(id)} />`,
      Component: Removable,
    },
    {
      name: 'Read-only',
      code: `<AttachmentPreview attachments={items} />`,
      Component: () => <AttachmentPreview attachments={initial} />,
    },
  ],
};

export default demo;
