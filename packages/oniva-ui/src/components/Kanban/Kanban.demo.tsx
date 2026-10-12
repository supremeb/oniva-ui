import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Kanban, type KanbanColumnData } from './Kanban';

const initial: KanbanColumnData[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    cards: [
      { id: 'c1', title: 'Audit onboarding emails', tags: ['Lifecycle'], assignees: ['Lena Schmidt'], due: '2026-10-28', priority: 'low' },
      { id: 'c2', title: 'SSO for enterprise workspaces', tags: ['Security', 'Enterprise'], assignees: ['Daniel Kim', 'Aisha Rahman'], due: '2026-11-14', priority: 'medium' },
    ],
  },
  {
    id: 'progress',
    title: 'In progress',
    wipLimit: 2,
    cards: [
      { id: 'c3', title: 'Usage-based billing preview', tags: ['Billing'], assignees: ['Priya Nair', 'Marcus Okafor'], due: '2026-10-16', priority: 'urgent' },
      { id: 'c4', title: 'Migrate invoices to PDF v2', tags: ['Billing'], assignees: ['Tomás Barros'], due: '2026-10-09', priority: 'high' },
      { id: 'c5', title: 'Fix CSV export timezone drift', tags: ['Bug'], assignees: ['Aisha Rahman'], due: '2026-10-20', priority: 'high' },
    ],
  },
  {
    id: 'review',
    title: 'In review',
    wipLimit: 3,
    cards: [{ id: 'c6', title: 'Webhook retry dashboard', tags: ['API'], assignees: ['Daniel Kim'], due: '2026-10-15', priority: 'medium' }],
  },
  { id: 'done', title: 'Done', cards: [{ id: 'c7', title: 'Dark mode for settings', tags: ['Design'], assignees: ['Lena Schmidt'], priority: 'low' }] },
];

function Board({ today }: { today?: string }) {
  const [cols, setCols] = useState(initial);
  return (
    <Kanban
      columns={cols}
      today={today ?? '2026-10-12'}
      onColumnsChange={setCols}
      onAddCard={(columnId, title) =>
        setCols((cs) => cs.map((c) => (c.id === columnId ? { ...c, cards: [...c.cards, { id: `n${Date.now()}`, title }] } : c)))
      }
    />
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Kanban',
    slug: 'kanban',
    category: 'Data display',
    description:
      'Drag-and-drop board with WIP limits. Cards move between and within columns by pointer or keyboard (focus the grip, press Enter, arrow to a target, Enter to drop).',
  },
  demos: [
    {
      name: 'Sprint board',
      code: `const [columns, setColumns] = useState<KanbanColumnData[]>(initial);

<Kanban
  columns={columns}
  onColumnsChange={setColumns}
  onAddCard={(columnId, title) => addCard(columnId, title)}
/>`,
      Component: () => <Board />,
    },
  ],
};

export default demo;
