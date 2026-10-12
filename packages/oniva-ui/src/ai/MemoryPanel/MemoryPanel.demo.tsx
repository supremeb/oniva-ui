import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { MemoryPanel, type AgentMemory } from './MemoryPanel';

const initial: AgentMemory[] = [
  { id: '1', text: 'Works at Northwind Logistics as Head of Finance Ops', category: 'Profile', source: 'Chat · Sep 12' },
  { id: '2', text: 'Prefers weekly variance summaries on Friday mornings, in bullet form', category: 'Preference', source: 'Chat · Oct 3' },
  { id: '3', text: 'Month-end close is the 3rd business day; flag anything over $10,000', category: 'Workflow', source: 'Reconciler run · Oct 5' },
  { id: '4', text: 'Do not email the audit team directly', category: 'Rule', source: 'Chat · Sep 28' },
];

function Controlled() {
  const [items, setItems] = useState(initial);
  return (
    <div style={{ maxWidth: 520, width: '100%' }}>
      <MemoryPanel
        memories={items}
        onEdit={(id, text) => setItems((l) => l.map((m) => (m.id === id ? { ...m, text } : m)))}
        onForget={(id) => setItems((l) => l.filter((m) => m.id !== id))}
      />
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Memory panel',
    slug: 'memory-panel',
    category: 'AI & Agent',
    description: 'Agent memories with inline edit and forget. Removal plays a short exit before the item is dropped.',
  },
  demos: [
    {
      name: 'Editable memories',
      code: `<MemoryPanel memories={items} onEdit={edit} onForget={forget} />`,
      Component: Controlled,
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
