import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { InboxList, type InboxItem } from './InboxList';

const seed: InboxItem[] = [
  { id: '1', from: 'Priya Nair', subject: 'Q4 pricing review', snippet: 'I updated the deck with the usage tiers. Can you check slide 7 before Thursday?', time: '9:41 AM', unread: true },
  { id: '2', from: 'Stripe', subject: 'Payout of $12,480.00 is on its way', snippet: 'Your payout will arrive in your Chase account ending 0912 on Oct 14.', time: '8:15 AM', unread: true },
  { id: '3', from: 'Marcus Okafor', subject: 'Re: Webhook retries', snippet: 'Agreed on the 8-attempt cap. I will open the PR this afternoon.', time: 'Yesterday' },
  { id: '4', from: 'Lena Schmidt', subject: 'Offsite logistics', snippet: 'Flights are booked for the 14 of us. Hotel block closes Friday.', time: 'Oct 9' },
  { id: '5', from: 'Daniel Kim', subject: 'Design tokens v2', snippet: 'Pushed the new spacing scale, no breaking changes expected.', time: 'Oct 8' },
];

function Demo() {
  const [items, setItems] = useState(seed);
  return (
    <InboxList
      aria-label="Inbox"
      items={items}
      onArchive={(id) => setItems((xs) => xs.filter((x) => x.id !== id))}
      onToggleRead={(id) => setItems((xs) => xs.map((x) => (x.id === id ? { ...x, unread: !x.unread } : x)))}
    />
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Inbox list',
    slug: 'inbox-list',
    category: 'Data display',
    description: 'Email/chat list with unread markers, avatars, snippets and quick actions. On touch, swipe left to archive or right to toggle read.',
  },
  demos: [
    {
      name: 'Mail inbox',
      code: `<InboxList
  aria-label="Inbox"
  items={items}
  onArchive={(id) => archive(id)}
  onToggleRead={(id) => toggleRead(id)}
/>`,
      Component: Demo,
    },
  ],
};
export default demo;
