import { useState } from 'react';
import { InboxList, type InboxItem } from 'oniva-ui';
import type { DocPage } from '../types';

const seed: InboxItem[] = [
  { id: '1', from: 'Priya Nair', subject: 'Q4 launch checklist', snippet: 'Can you review the rollout plan before Thursday?', time: '9:41 AM', unread: true },
  { id: '2', from: 'Stripe', subject: 'Payout of $4,280.00 sent', snippet: 'Your payout is on its way and should arrive by Oct 14.', time: '8:12 AM', unread: true },
  { id: '3', from: 'Marcus Okafor', snippet: 'Thanks, merged. Deploy is going out at noon.', time: 'Yesterday' },
  { id: '4', from: 'Lena Schmidt', subject: 'Re: Invoice INV-2043', snippet: 'Payment was released this morning, please confirm receipt.', time: 'Oct 8' },
];

const Demo = (p: { items?: InboxItem[]; onEvent?: (n: string) => void }) => {
  const [items, setItems] = useState(p.items ?? seed);
  return (
    <div style={{ width: 420 }}>
      <InboxList
        aria-label="Inbox"
        items={items}
        onArchive={(id) => { setItems((xs) => xs.filter((x) => x.id !== id)); p.onEvent?.('onArchive'); }}
        onToggleRead={(id) => { setItems((xs) => xs.map((x) => (x.id === id ? { ...x, unread: !x.unread } : x))); p.onEvent?.('onToggleRead'); }}
        onOpen={() => p.onEvent?.('onOpen')}
      />
    </div>
  );
};

const page: DocPage = {
  slug: 'inbox-list',
  status: 'Stable',
  version: '0.1.0',
  importName: 'InboxList',
  group: ['Components', 'Data display'],
  sourcePath: 'components/InboxList',
  lede: 'A message list with unread state, avatars and quick actions. Swipe on touch, hover buttons on desktop, full keyboard control.',
  anatomy: {
    intro: 'Six parts. Avatar, sender, time and snippet are always present; subject, unread dot and actions depend on the item and input.',
    Render: () => <Demo />,
    parts: [
      { name: 'Row', description: '12px padding, 1px separator below. Hover tints; selected uses the accent tint; focus-visible draws a 2px inset ring.', selector: '[role="row"]:first-child' },
      { name: 'Unread dot', description: '8px accent circle in an 8px by 32px slot so rows stay aligned. Read as "Unread" by screen readers.', selector: '[role="row"]:first-child [role="gridcell"] > div > span:first-child' },
      { name: 'Avatar', description: 'md (32px) with initials from the sender, or avatarSrc.', selector: '[role="row"]:first-child [role="img"]' },
      { name: 'Sender and time', description: 'Sender in 14px, semibold when unread; time in 12px muted, tabular numerals, right-aligned.', selector: '[role="row"]:first-child [role="gridcell"] > div > span:nth-child(3) > span:first-child' },
      { name: 'Subject and snippet', description: 'Optional subject at body size (semibold when unread); snippet 13px muted. Both truncate to one line.', selector: '[role="row"]:first-child [role="gridcell"] > div > span:nth-child(3) > span:nth-child(2)' },
      { name: 'Quick actions', description: 'Two 28px buttons, 16px icons: mark read or unread, archive. Visible on hover and focus; always reachable by Tab.', selector: '[role="row"]:first-child button[aria-label^="Archive"]' },
    ],
  },
  usage: {
    use: ['Notifications, email and chat threads with read state.', 'Triage lists where archive and mark read are the main actions.', 'Mobile-first lists with swipe gestures.'],
    avoid: [
      { text: 'Plain rows without state or actions.', instead: { slug: 'list', label: 'List' } },
      { text: 'Picking from options.', instead: { slug: 'list-box', label: 'ListBox' } },
      { text: 'A chronological event history.', instead: { slug: 'timeline', label: 'Timeline' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'select', key: 'preset', label: 'Content', options: ['mixed', 'all unread', 'all read', 'empty'] },
    ],
    initial: { preset: 'mixed' },
    render: (p, onEvent) => {
      const items = p.preset === 'empty' ? [] : p.preset === 'all unread' ? seed.map((i) => ({ ...i, unread: true })) : p.preset === 'all read' ? seed.map((i) => ({ ...i, unread: false })) : seed;
      return <Demo key={String(p.preset)} items={items} onEvent={onEvent} />;
    },
    code: () => `<InboxList\n  aria-label="Inbox"\n  items={items}\n  onOpen={(id) => open(id)}\n  onArchive={(id) => archive(id)}\n  onToggleRead={(id) => toggleRead(id)}\n/>`,
  },
  states: [
    { name: 'Mixed', description: 'Unread rows show the dot and semibold text.', Render: () => <Demo /> },
    { name: 'All read', description: 'No dots; regular weights.', Render: () => <Demo items={seed.map((i) => ({ ...i, unread: false }))} /> },
    { name: 'Long content', description: 'Sender, subject and snippet truncate to one line each.', Render: () => <Demo items={[{ id: 'l', from: 'Alexandra Konstantinopoulou-Whitfield', subject: 'Re: Re: Fwd: Quarterly vendor consolidation and renewal schedule', snippet: 'Following up on the thread from last week about consolidating our vendor agreements into a single master contract.', time: '10:02 AM', unread: true }]} /> },
    { name: 'Empty', description: 'The default message: "You\'re all caught up. No unread messages."', Render: () => <Demo items={[]} /> },
  ],
  sections: [
    { type: 'itemTypes', id: 'gestures', title: 'Actions by input', intro: 'Every action has a path for touch, pointer and keyboard.', items: [
      { name: 'Touch', description: 'Swipe left 88px to archive; swipe right to toggle read. The row follows the finger up to 160px and snaps back if released early.', Render: () => <span style={{ fontSize: 13 }}>← Archive · Mark read →</span> },
      { name: 'Pointer', description: 'Hover shows the mark read and archive buttons; click the row to open.', Render: () => <span style={{ fontSize: 13 }}>Hover row</span> },
      { name: 'Keyboard', description: 'Arrow to a row, Enter to open, Tab to its buttons, Space or Enter to act.', Render: () => <span style={{ fontSize: 13 }}>Tab, Enter</span> },
    ] },
    { type: 'rules', id: 'rules', title: 'Rules', items: [
      { title: 'Archive is undoable', body: 'The swipe commits immediately. Offer an Undo Toast for the action.' },
      { title: 'Lead with the sender', body: 'People scan senders first, then subject. Without a subject the snippet takes its place.' },
      { title: 'Own the data', body: 'The list does not remove or toggle items itself. Update items in the callbacks.' },
    ] },
    { type: 'rules', id: 'recipes', title: 'Composition', items: [
      { title: 'With Toast', body: 'Archive then show "Archived. Undo" for 6 seconds.' },
      { title: 'With EmptyState', body: 'Pass emptyState for filtered inboxes: "No unread messages. Show all".' },
    ] },
  ],
  content: { rules: [
    { title: 'Time', body: 'Short and local: 9:41 AM today, Yesterday, then Oct 8.' },
    { title: 'Snippets', body: 'First line of the body, no quoted text or signatures.' },
    { title: 'Empty', body: 'Reassure: "You\'re all caught up."' },
  ] },
  accessibility: {
    keyboard: [
      { keys: ['↑', '↓'], action: 'Moves between rows.' },
      { keys: ['Enter'], action: 'Opens the row (onOpen).' },
      { keys: ['Space'], action: 'Selects the row (single selection).' },
      { keys: ['Tab'], action: 'Moves into the row buttons: mark read, archive.' },
      { keys: ['Home', 'End'], action: 'First and last row.' },
    ],
    notes: ['React Aria GridList: role="grid" with rows named "Unread. Sender: subject".', 'Unread is announced through a visually hidden "Unread" label.', 'Buttons are labelled with the sender: "Archive Priya Nair".', 'Swipe is an enhancement; every action exists as a button.'],
    reducedMotion: 'The swipe settle transition is removed; the row snaps.',
  },
  props: [
    { name: 'items', type: 'InboxItem[]', description: 'id, from, subject?, snippet, time, unread?, avatarSrc?.' },
    { name: 'onOpen', type: '(id: string) => void', description: 'Enter or click.' },
    { name: 'onArchive', type: '(id: string) => void', description: 'Archive button or swipe left.' },
    { name: 'onToggleRead', type: '(id: string) => void', description: 'Read button or swipe right.' },
    { name: 'emptyState', type: 'ReactNode', description: 'Replaces the default empty message.' },
    { name: 'selectionMode / selectedKeys', type: 'GridList props', default: "'single'", description: 'Passed through to the GridList.' },
    { name: 'aria-label', type: 'string', default: "'Inbox'", description: 'Accessible name.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Style override.' },
  ],
  related: ['list', 'avatar', 'toast', 'empty-state'],
};
export default page;
