import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Tag, TagGroup } from './Tag';

function Removable() {
  const [items, setItems] = useState([
    { id: 'paid', name: 'Status: Paid' },
    { id: 'eu', name: 'Region: EU' },
    { id: 'q3', name: 'Q3 2026' },
    { id: 'big', name: 'Over $5,000' },
  ]);
  return (
    <TagGroup
      label="Active filters"
      items={items}
      onRemove={(keys) => setItems((l) => l.filter((i) => !keys.has(i.id)))}
      renderEmptyState={() => 'No filters applied'}
    >
      {(item: { id: string; name: string }) => <Tag id={item.id}>{item.name}</Tag>}
    </TagGroup>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Tag',
    slug: 'tag',
    category: 'Data display',
    description: 'Chips for filters, labels and selections, built on React Aria TagGroup.',
  },
  demos: [
    {
      name: 'Colors',
      code: `<TagGroup aria-label="Statuses">
  <Tag id="1">Draft</Tag>
  <Tag id="2" color="accent">Pro plan</Tag>
  <Tag id="3" color="success">Paid</Tag>
  <Tag id="4" color="warning">Pending</Tag>
  <Tag id="5" color="danger">Overdue</Tag>
  <Tag id="6" color="outline">Archived</Tag>
</TagGroup>`,
      Component: () => (
        <TagGroup aria-label="Statuses">
          <Tag id="1">Draft</Tag>
          <Tag id="2" color="accent">Pro plan</Tag>
          <Tag id="3" color="success">Paid</Tag>
          <Tag id="4" color="warning">Pending</Tag>
          <Tag id="5" color="danger">Overdue</Tag>
          <Tag id="6" color="outline">Archived</Tag>
        </TagGroup>
      ),
    },
    {
      name: 'Removable',
      code: `<TagGroup label="Active filters" items={items} onRemove={(keys) => remove(keys)}>
  {(item) => <Tag id={item.id}>{item.name}</Tag>}
</TagGroup>`,
      Component: Removable,
    },
    {
      name: 'Selectable',
      code: `<TagGroup label="Notify me about" selectionMode="multiple" defaultSelectedKeys={['pay']}>
  <Tag id="pay" color="outline">Payouts</Tag>
  <Tag id="dis" color="outline">Disputes</Tag>
  <Tag id="inv" color="outline">Invoices</Tag>
</TagGroup>`,
      Component: () => (
        <TagGroup label="Notify me about" selectionMode="multiple" defaultSelectedKeys={['pay']}>
          <Tag id="pay" color="outline">Payouts</Tag>
          <Tag id="dis" color="outline">Disputes</Tag>
          <Tag id="inv" color="outline">Invoices</Tag>
        </TagGroup>
      ),
    },
  ],
};
export default demo;
