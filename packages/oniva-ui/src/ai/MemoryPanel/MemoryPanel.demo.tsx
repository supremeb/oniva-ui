import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { MemoryPanel, type AgentMemory } from './MemoryPanel';

const initial: AgentMemory[] = [
  { id: '1', text: 'Likes short answers first, details only when asked', category: 'Preferences', source: 'You added', date: 'Oct 2', paused: true },
  { id: '2', text: 'Designs with a 4px spacing grid and one sans typeface', category: 'Preferences', source: 'From design tool', date: 'Oct 7' },
  { id: '3', text: 'Product designer and front-end developer at a small studio', category: 'Work', source: 'From chat', date: 'Sep 28' },
  { id: '4', text: 'Ships with React and Vite; deploys to a managed edge host', category: 'Work', source: 'From chat', date: 'Oct 3' },
  { id: '5', text: 'Reviews pull requests on Friday mornings', category: 'Work', source: 'From chat', date: 'Oct 5' },
  { id: '6', text: 'Building a budgeting app for freelancers', category: 'Projects', source: 'From chat', date: 'Oct 9' },
  { id: '7', text: 'Writing a short guide on design tokens', category: 'Projects', source: 'You added', date: 'Oct 10' },
];

function Controlled({ variant }: { variant: 'cards' | 'grouped' }) {
  const [items, setItems] = useState(initial);
  return (
    <div style={{ maxWidth: 520, width: '100%' }}>
      <MemoryPanel
        variant={variant}
        memories={items}
        onEdit={(id, text) => setItems((l) => l.map((m) => (m.id === id ? { ...m, text } : m)))}
        onForget={(id) => setItems((l) => l.filter((m) => m.id !== id))}
        onRestore={(m, i) => setItems((l) => [...l.slice(0, i), m, ...l.slice(i)])}
        onAdd={(m) => setItems((l) => [...l, m])}
      />
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Memory panel',
    slug: 'memory-panel',
    category: 'AI & Agent',
    description: 'What the agent remembers: master switch, category filters, inline edit, pause, forget with Undo and quick add.',
  },
  demos: [
    {
      name: 'Grouped list',
      code: `<MemoryPanel variant="grouped" memories={items} onEdit={edit} onForget={forget} onRestore={restore} onAdd={add} />`,
      Component: () => <Controlled variant="grouped" />,
    },
    {
      name: 'Cards',
      code: `<MemoryPanel memories={items} onEdit={edit} onForget={forget} onRestore={restore} onAdd={add} />`,
      Component: () => <Controlled variant="cards" />,
    },
    {
      name: 'Empty',
      code: `<MemoryPanel memories={[]} />`,
      Component: () => (
        <div style={{ maxWidth: 520, width: '100%' }}>
          <MemoryPanel memories={[]} />
        </div>
      ),
    },
  ],
};

export default demo;
