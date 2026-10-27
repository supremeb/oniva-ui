import type { DemoModule } from '../../internal/demo';
import { CommentThread, type ThreadAuthor, type ThreadMessage } from './CommentThread';

const lena: ThreadAuthor = { name: 'Lena Lindqvist' };
const atlas: ThreadAuthor = { name: 'Atlas', assistant: true };
const now = Date.now();

const messages: ThreadMessage[] = [
  { id: '1', author: lena, createdAt: now - 3 * 60_000, text: '/edit Rename every “customers” to “members” on the pricing page.' },
  {
    id: '2',
    author: atlas,
    createdAt: now - 60_000,
    text: '',
    status: { label: 'Edit completed', details: 'Column D, rows 2 to 15. Formulas were kept; only the number format changed.' },
  },
];

const ask = (text: string): Promise<ThreadMessage | void> | void =>
  text.includes('@Atlas')
    ? new Promise((resolve) =>
        setTimeout(
          () => resolve({ id: `a-${Date.now()}`, author: atlas, createdAt: Date.now(), text: 'Sorted by revenue, highest first.' }),
          1400,
        ),
      )
    : undefined;

const demo: DemoModule = {
  meta: {
    title: 'Comment thread',
    slug: 'comment-thread',
    category: 'Data display',
    description: 'One conversation with replies. An assistant reports what it did and answers @mentions.',
  },
  demos: [
    {
      name: 'Assistant replies',
      code: `<CommentThread
  messages={messages}
  currentUser={{ name: 'Lena Lindqvist' }}
  assistant={{ name: 'Atlas', assistant: true }}
  onReply={(text) => (text.includes('@Atlas') ? api.ask(text) : undefined)}
  onClose={() => setOpen(false)}
/>`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <CommentThread messages={messages} currentUser={lena} assistant={atlas} onReply={ask} onClose={() => undefined} />
        </div>
      ),
    },
    {
      name: 'People only',
      code: `<CommentThread title="Q4 budget" messages={messages.slice(0, 1)} currentUser={me} />`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <CommentThread title="Q4 budget" messages={messages.slice(0, 1)} currentUser={lena} />
        </div>
      ),
    },
  ],
};

export default demo;
