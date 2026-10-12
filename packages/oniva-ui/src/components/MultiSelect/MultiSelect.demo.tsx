import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { MultiSelect } from './MultiSelect';

const teams = [
  { id: 'design', label: 'Design' },
  { id: 'eng', label: 'Engineering' },
  { id: 'fin', label: 'Finance' },
  { id: 'ops', label: 'Operations' },
  { id: 'cs', label: 'Customer Success' },
];

const col = { display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 380 } as const;

function Controlled() {
  const [v, setV] = useState<string[]>(['eng', 'fin']);
  return (
    <div style={col}>
      <MultiSelect label="Approver teams" options={teams} value={v} onChange={setV} />
      <span style={{ fontSize: 13 }}>{v.length} selected</span>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'MultiSelect',
    slug: 'multi-select',
    category: 'Forms',
    description: 'Select with multiple choices rendered as removable tag chips.',
  },
  demos: [
    {
      name: 'Basic',
      code: `<MultiSelect label="Teams" options={teams} defaultValue={['design']} placeholder="Add teams" />`,
      Component: () => (
        <div style={col}>
          <MultiSelect label="Teams" options={teams} defaultValue={['design']} placeholder="Add teams" />
        </div>
      ),
    },
    {
      name: 'Controlled',
      code: `const [v, setV] = useState(['eng', 'fin']);
<MultiSelect label="Approver teams" options={teams} value={v} onChange={setV} />`,
      Component: Controlled,
    },
    {
      name: 'Error',
      code: `<MultiSelect label="Teams" options={teams} isInvalid errorMessage="Choose at least one team." />`,
      Component: () => (
        <div style={col}>
          <MultiSelect label="Teams" options={teams} isInvalid errorMessage="Choose at least one team." />
        </div>
      ),
    },
  ],
};

export default demo;
