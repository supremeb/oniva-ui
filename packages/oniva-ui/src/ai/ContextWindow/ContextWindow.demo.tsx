import type { DemoModule } from '../../internal/demo';
import { ContextWindow, type ContextPart } from './ContextWindow';

const parts: ContextPart[] = [
  { id: 'system', label: 'System prompt', tokens: 4200, locked: true },
  { id: 'tools', label: 'Tools', tokens: 12800 },
  {
    id: 'files',
    label: 'Files',
    items: [
      { id: 'schema', label: 'schema.prisma', tokens: 9400 },
      { id: 'billing', label: 'billing.ts', tokens: 21300 },
      { id: 'notes', label: 'meeting-notes.md', tokens: 15400 },
    ],
  },
  { id: 'chat', label: 'Conversation', tokens: 108600, compact: true },
  { id: 'memory', label: 'Memory', tokens: 3900 },
];

const demo: DemoModule = {
  meta: {
    title: 'Context window',
    slug: 'context-window',
    category: 'AI & Agent',
    description: 'What fills the model context as a field of cells. Hover a part to light it up, remove files, and compact the conversation.',
  },
  demos: [
    {
      name: 'Session context',
      code: `<ContextWindow limit={200_000} model="Atlas 2" parts={parts} defaultOpen={['files']} action={{ label: 'New chat', onClick: startNewChat }} />`,
      Component: () => <ContextWindow limit={200_000} model="Atlas 2" parts={parts} defaultOpen={['files']} action={{ label: 'New chat', onClick: () => {} }} />,
    },
    {
      name: 'Nearly full',
      code: `<ContextWindow
  limit={140_000}
  parts={parts}
  action={{ label: 'New chat', onClick: startNewChat }}
/>`,
      Component: () => <ContextWindow limit={140_000} model="Quill Reasoner" parts={parts} action={{ label: 'New chat', onClick: () => {} }} />,
    },
  ],
};

export default demo;
