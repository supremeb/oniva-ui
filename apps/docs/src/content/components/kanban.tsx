import { useState } from 'react';
import { Kanban, type KanbanColumnData } from 'oniva-ui';
import type { DocPage } from '../types';

const initial = (wip?: number, empty?: boolean): KanbanColumnData[] => [
  { id: 'backlog', title: 'Backlog', cards: empty ? [] : [
    { id: 'c1', title: 'Audit onboarding emails', tags: ['Lifecycle'], assignees: ['Lena Schmidt'], due: '2026-10-28', priority: 'low' },
    { id: 'c2', title: 'SSO for enterprise workspaces', tags: ['Security'], assignees: ['Daniel Kim', 'Aisha Rahman'], due: '2026-11-14', priority: 'medium' },
  ] },
  { id: 'progress', title: 'In progress', wipLimit: wip, cards: empty ? [] : [
    { id: 'c3', title: 'Usage-based billing preview', tags: ['Billing'], assignees: ['Priya Nair'], due: '2026-10-16', priority: 'urgent' },
    { id: 'c4', title: 'Migrate invoices to PDF v2', tags: ['Billing'], assignees: ['Tomás Barros'], due: '2026-10-09', priority: 'high' },
    { id: 'c5', title: 'Fix CSV export timezone drift', tags: ['Bug'], assignees: ['Aisha Rahman'], due: '2026-10-20', priority: 'high' },
  ] },
  { id: 'done', title: 'Done', cards: empty ? [] : [{ id: 'c7', title: 'Dark mode for settings', tags: ['Design'], assignees: ['Lena Schmidt'], priority: 'low' }] },
];

const Board = (p: { wip?: number; empty?: boolean; onEvent?: (n: string) => void }) => {
  const [cols, setCols] = useState(() => initial(p.wip, p.empty));
  return (
    <div style={{ width: 920, overflow: 'hidden' }}>
      <Kanban
        columns={cols}
        today="2026-10-12"
        onColumnsChange={(c) => { setCols(c); p.onEvent?.('onColumnsChange'); }}
        onAddCard={(columnId, title) => {
          p.onEvent?.('onAddCard');
          setCols((cs) => cs.map((c) => (c.id === columnId ? { ...c, cards: [...c.cards, { id: `n${c.cards.length}${title}`, title }] } : c)));
        }}
      />
    </div>
  );
};

const page: DocPage = {
  slug: 'kanban',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Kanban',
  group: ['Components', 'Data display'],
  sourcePath: 'components/Kanban',
  lede: 'A drag-and-drop board that moves work through stages. Cards reorder and move between columns by pointer or keyboard, with WIP limits per column.',
  anatomy: {
    intro: 'Six parts. Columns and cards are always present; WIP limit, tags, due date and assignees are optional per card or column.',
    Render: () => <Board wip={2} />,
    parts: [
      { name: 'Column', description: '288px wide, 12px radius, 8px padding. A section labelled by its heading, side by side in a horizontally scrolling board.', selector: 'section:nth-child(2)' },
      { name: 'Column header', description: 'Title in 13px semibold with a count badge. With wipLimit the badge reads "3/2" and turns warning when over.', selector: 'section:nth-child(2) > header h3' },
      { name: 'Card', description: '10px radius, 12px padding, 1px border and no shadow at rest. While dragged it scales to 1.02 and takes the floating shadow, then settles.', selector: 'section:nth-child(2) [role="row"]:first-child' },
      { name: 'Drag grip', description: '24px button with a 14px grip icon. The keyboard entry point for moving a card.', selector: 'section:nth-child(2) [role="row"]:first-child button[slot="drag"]' },
      { name: 'Card meta', description: 'Tags (accent sm badges), priority (sm dot badge), due date (12px, danger when before today) and up to 3 assignee avatars.', selector: 'section:nth-child(2) [role="row"]:first-child [aria-label="Assignees"]' },
      { name: 'Add card', description: 'Ghost sm button at the foot of each column; opens an inline 36px title field. Enter adds, Esc cancels.', selector: 'section:nth-child(2) button[aria-label^="Add card"]' },
    ],
  },
  usage: {
    use: ['Work that moves through named stages: sprints, hiring, support triage.', 'Boards where order within a stage matters.', 'Limiting work in progress with WIP limits.'],
    avoid: [
      { text: 'A flat sortable list.', instead: { slug: 'list', label: 'List' } },
      { text: 'Dated events in sequence.', instead: { slug: 'timeline', label: 'Timeline' } },
      { text: 'Tabular records with many fields.', instead: { slug: 'data-table', label: 'DataTable' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'number', key: 'wip', label: 'WIP limit (In progress)', min: 0, max: 5, step: 1 },
      { kind: 'toggle', key: 'empty', label: 'Empty board' },
    ],
    initial: { wip: 2, empty: false },
    render: (p, onEvent) => <Board key={`${p.wip}${p.empty}`} wip={Number(p.wip) || undefined} empty={Boolean(p.empty)} onEvent={onEvent} />,
    code: (p) => `const [columns, setColumns] = useState<KanbanColumnData[]>([\n  { id: 'progress', title: 'In progress'${Number(p.wip) ? `, wipLimit: ${p.wip}` : ''}, cards: [...] },\n]);\n\n<Kanban columns={columns} onColumnsChange={setColumns} onAddCard={addCard} />`,
  },
  states: [
    { name: 'Populated', description: 'Three stages, urgent and overdue cards flagged.', Render: () => <Board /> },
    { name: 'WIP limit reached', description: '3 cards against a limit of 3: neutral.', Render: () => <Board wip={3} /> },
    { name: 'WIP limit exceeded', description: '3 cards against 2: warning badge and icon, and a visible "WIP limit" label.', Render: () => <Board wip={2} /> },
    { name: 'Empty board', description: 'Each column shows an empty message and Add card.', Render: () => <Board empty /> },
  ],
  sections: [
    { type: 'numbered', id: 'keyboard-drag', title: 'Moving a card by keyboard', intro: 'Every drag has a keyboard equivalent.', items: [
      { title: 'Pick up', body: 'Tab to a card grip and press Enter or Space. Screen readers announce "Started dragging".' },
      { title: 'Choose a target', body: 'Arrow keys move between drop positions in the same and neighboring columns.' },
      { title: 'Drop or cancel', body: 'Enter drops the card there; Esc returns it. The move is announced.' },
    ] },
    { type: 'rules', id: 'rules', title: 'Rules', items: [
      { title: 'WIP limits warn, not block', body: 'Going over is allowed so people can correct the board; the column warns instead. Set limits on active stages only.' },
      { title: '4 to 6 columns', body: 'Beyond six, the board scrolls sideways and stages lose meaning.' },
      { title: 'Keep cards scannable', body: 'Title, one or two tags, one date. Details live in a Drawer or Dialog.' },
      { title: 'Own the data', body: 'onColumnsChange gives the next array; persist it and handle failures by restoring the previous one.' },
    ] },
    { type: 'rules', id: 'recipes', title: 'Composition', items: [
      { title: 'With FilterBar', body: 'Filter by assignee or tag above the board by narrowing each column\'s cards.' },
      { title: 'With Drawer', body: 'Open card detail in a Drawer so the board stays visible.' },
    ] },
  ],
  content: { rules: [
    { title: 'Column titles', body: 'A stage noun, 1 to 2 words: Backlog, In review.' },
    { title: 'Card titles', body: 'Verb first, under 60 characters: "Fix CSV export timezone drift". Titles wrap to two lines.' },
    { title: 'Empty column', body: 'Say how to fill it: "No cards. Drag one here or add a card."' },
    { title: 'Tags', body: 'One word each, 2 at most before they crowd the card.' },
  ] },
  accessibility: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves between the board\'s cards, grips and Add card buttons.' },
      { keys: ['↑', '↓'], action: 'Moves between cards in a column.' },
      { keys: ['Enter', 'Space'], action: 'On a grip: starts a drag. During drag: drops.' },
      { keys: ['←', '→', '↑', '↓'], action: 'During drag: chooses the drop target.' },
      { keys: ['Esc'], action: 'Cancels a drag, or closes the Add card field.' },
      { keys: ['Enter'], action: 'In the Add card field: adds the card.' },
    ],
    notes: ['The board is role="group" labelled "Board"; each column is a labelled section containing a list labelled "<Column> cards".', 'Drag and drop uses React Aria, with live announcements for start, move and drop.', 'Priority and due state are text, not color alone.', 'Grips are 24px; keep surrounding spacing for touch.'],
    reducedMotion: 'The drop settle animation and drag lift are removed.',
  },
  props: [
    { name: 'columns', type: 'KanbanColumnData[]', description: 'id, title, wipLimit, cards.' },
    { name: 'onColumnsChange', type: '(columns) => void', description: 'Fires after a move or reorder with the next state.' },
    { name: 'onAddCard', type: '(columnId, title) => void', description: 'Fires from the Add card form.' },
    { name: 'today', type: 'string (ISO date)', default: 'today', description: 'Reference date for overdue styling.' },
    { name: 'KanbanCardData', type: '{ id, title, tags?, assignees?, due?, priority? }', description: 'priority is low, medium, high or urgent.' },
    { name: 'moveCards', type: '(columns, ids, columnId, targetId?, position?) => columns', description: 'Pure helper used for drops; exported for custom moves.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Style override.' },
  ],
  related: ['list', 'timeline', 'filter-bar', 'drawer'],
};
export default page;
