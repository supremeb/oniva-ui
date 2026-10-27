import type { DemoModule } from '../../internal/demo';
import { CommentsPanel, type PanelComment } from './CommentsPanel';

const me = { name: 'Mara Lindqvist' };
const now = Date.now();
const comments: PanelComment[] = [
  { id: '1', author: me, createdAt: now - 2 * 60_000, text: '/edit Rename every "customers" to "members" on the pricing page.' },
  { id: '2', author: { name: 'Jonas Weber' }, createdAt: now - 5 * 60_000, text: 'Should we mention the launch discount in the hero too?' },
  { id: '3', author: { name: 'Lena Hart' }, createdAt: now - 11 * 60_000, text: 'Pricing table matches the latest sheet.', resolved: true },
  { id: '4', author: { name: 'Omar Haddad' }, createdAt: now - 40 * 60_000, text: '/edit Shorten the headline to six words.' },
];

const demo: DemoModule = {
  meta: {
    title: 'Comments panel',
    slug: 'comments-panel',
    category: 'Data display',
    description: 'Comment feed with filters, runnable /edit commands, resolve and a composer.',
  },
  demos: [
    {
      name: 'Feed with edits',
      code: `<CommentsPanel
  comments={comments}
  currentUser={{ name: 'Mara Lindqvist' }}
  onRunEdit={(c) => api.applyEdit(c.text)}
  onAdd={(c) => api.saveComment(c)}
  onClose={() => setOpen(false)}
/>`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 440 }}>
          <CommentsPanel
            comments={comments}
            currentUser={me}
            onRunEdit={() => new Promise((r) => setTimeout(r, 1200))}
            onClose={() => undefined}
          />
        </div>
      ),
    },
    {
      name: 'Empty',
      code: `<CommentsPanel title="Notes" comments={[]} currentUser={me} />`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 440 }}>
          <CommentsPanel title="Notes" comments={[]} currentUser={me} />
        </div>
      ),
    },
  ],
};

export default demo;
