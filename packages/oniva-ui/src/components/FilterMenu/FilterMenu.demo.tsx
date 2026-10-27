import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { FilterMenu, type FilterMenuGroup, type FilterMenuValue } from './FilterMenu';

const groups: FilterMenuGroup[] = [
  {
    id: 'stage',
    label: 'Stage',
    options: [
      { id: 'new', label: 'New lead' },
      { id: 'qualified', label: 'Qualified' },
      { id: 'proposal', label: 'Proposal sent' },
      { id: 'negotiation', label: 'Negotiation' },
    ],
  },
  {
    id: 'size',
    label: 'Deal size',
    chipPrefix: 'Deal: ',
    options: [
      { id: 's', label: 'Under $5k' },
      { id: 'm', label: '$5k–20k' },
      { id: 'l', label: '$20k–50k' },
      { id: 'xl', label: 'Over $50k' },
    ],
  },
  {
    id: 'region',
    label: 'Region',
    options: [
      { id: 'na', label: 'North America' },
      { id: 'uk', label: 'UK & Ireland' },
      { id: 'dach', label: 'DACH' },
      { id: 'nordics', label: 'Nordics' },
      { id: 'apac', label: 'APAC' },
    ],
  },
];

const initial: FilterMenuValue = { stage: ['qualified'], size: ['m'], region: ['dach'] };

function Controlled() {
  const [value, setValue] = useState<FilterMenuValue>(initial);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 440 }}>
      <FilterMenu groups={groups} value={value} onChange={setValue} defaultOpen={['stage', 'size']} />
      <code style={{ fontSize: 12 }}>{JSON.stringify(value)}</code>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Filter menu',
    slug: 'filter-menu',
    category: 'Forms',
    description:
      'Grouped multi-select filters with collapsible groups, removable chips, Clear all and arrow-key control on a single tab stop.',
  },
  demos: [
    {
      name: 'Uncontrolled',
      code: `<FilterMenu groups={groups} defaultValue={{ stage: ['qualified'], size: ['m'], region: ['dach'] }} />`,
      Component: () => <FilterMenu groups={groups} defaultValue={initial} />,
    },
    {
      name: 'Controlled, several groups open',
      code: `const [value, setValue] = useState({ stage: ['qualified'], size: ['m'], region: ['dach'] });
<FilterMenu groups={groups} value={value} onChange={setValue} defaultOpen={['stage', 'size']} />`,
      Component: Controlled,
    },
  ],
};

export default demo;
