import { useState } from 'react';
import { Archive, Inbox, Send, Star, Trash2 } from 'lucide-react';
import type { Selection } from 'react-aria-components';
import type { DemoModule } from '../../internal/demo';
import { ListBox, ListBoxItem, ListBoxSection } from './ListBox';

function Single() {
  const [sel, setSel] = useState<Selection>(new Set(['inbox']));
  return (
    <div style={{ maxWidth: 320 }}>
      <ListBox
        aria-label="Mailbox"
        selectionMode="single"
        selectedKeys={sel}
        onSelectionChange={setSel}
        disallowEmptySelection
      >
        <ListBoxItem id="inbox" icon={<Inbox size={16} />} trailing="12">
          Inbox
        </ListBoxItem>
        <ListBoxItem id="starred" icon={<Star size={16} />} trailing="3">
          Starred
        </ListBoxItem>
        <ListBoxItem id="sent" icon={<Send size={16} />}>
          Sent
        </ListBoxItem>
        <ListBoxItem id="archive" icon={<Archive size={16} />}>
          Archive
        </ListBoxItem>
        <ListBoxItem id="trash" icon={<Trash2 size={16} />} isDisabled>
          Trash
        </ListBoxItem>
      </ListBox>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'List box',
    slug: 'list-box',
    category: 'Data display',
    description:
      'Keyboard-navigable list of options on React Aria ListBox: single or multiple selection, icons, descriptions and sections.',
  },
  demos: [
    {
      name: 'Single selection',
      code: `<ListBox aria-label="Mailbox" selectionMode="single" defaultSelectedKeys={['inbox']} disallowEmptySelection>
  <ListBoxItem id="inbox" icon={<Inbox size={16} />} trailing="12">Inbox</ListBoxItem>
  <ListBoxItem id="starred" icon={<Star size={16} />} trailing="3">Starred</ListBoxItem>
  <ListBoxItem id="sent" icon={<Send size={16} />}>Sent</ListBoxItem>
  <ListBoxItem id="trash" icon={<Trash2 size={16} />} isDisabled>Trash</ListBoxItem>
</ListBox>`,
      Component: Single,
    },
    {
      name: 'Multiple with sections and descriptions',
      code: `<ListBox aria-label="Notify" selectionMode="multiple" defaultSelectedKeys={['mentions']}>
  <ListBoxSection title="Activity">
    <ListBoxItem id="mentions" description="When someone @mentions you">Mentions</ListBoxItem>
    <ListBoxItem id="comments" description="Replies on your threads">Comments</ListBoxItem>
  </ListBoxSection>
  <ListBoxSection title="Billing">
    <ListBoxItem id="invoices" description="New invoice issued">Invoices</ListBoxItem>
  </ListBoxSection>
</ListBox>`,
      Component: () => (
        <div style={{ maxWidth: 360 }}>
          <ListBox
            aria-label="Notify me about"
            selectionMode="multiple"
            defaultSelectedKeys={['mentions']}
          >
            <ListBoxSection title="Activity">
              <ListBoxItem id="mentions" description="When someone @mentions you">
                Mentions
              </ListBoxItem>
              <ListBoxItem id="comments" description="Replies on your threads">
                Comments
              </ListBoxItem>
            </ListBoxSection>
            <ListBoxSection title="Billing">
              <ListBoxItem id="invoices" description="New invoice issued">
                Invoices
              </ListBoxItem>
            </ListBoxSection>
          </ListBox>
        </div>
      ),
    },
  ],
};

export default demo;
