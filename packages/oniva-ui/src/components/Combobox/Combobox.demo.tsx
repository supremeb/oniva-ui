import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Avatar } from '../Avatar';
import { Combobox, ComboboxItem } from './Combobox';
import { ComboboxMulti, type ComboboxMultiOption } from './ComboboxMulti';

const person = (id: string, label: string, description: string, group: string): ComboboxMultiOption => ({
  id,
  label,
  description,
  group,
  icon: <Avatar size="xs" name={label} />,
});
const people = [
  person('maya', 'Maya Chen', 'Product Designer', 'Design'),
  person('jonas', 'Jonas Weber', 'Design Lead', 'Design'),
  person('priya', 'Priya Raman', 'Brand Designer', 'Design'),
  person('sara', 'Sara Okafor', 'Staff Engineer', 'Engineering'),
  person('leo', 'Leo Martins', 'Frontend', 'Engineering'),
  person('nina', 'Nina Petrova', 'Backend', 'Engineering'),
  person('tom', 'Tom Becker', 'iOS', 'Engineering'),
  person('ana', 'Ana Silva', 'Product Manager', 'Product'),
  person('kai', 'Kai Tanaka', 'Growth', 'Product'),
];

const col = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: '100%',
  maxWidth: 340,
} as const;

function Creatable() {
  const [vendors, setVendors] = useState([
    { id: 'north', name: 'Northwind Supply' },
    { id: 'harbor', name: 'Harbor Freight Co.' },
    { id: 'summit', name: 'Summit Analytics' },
  ]);
  const [key, setKey] = useState<string | null>(null);
  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <Combobox
        label="Payee"
        placeholder="Search or add a payee…"
        selectedKey={key}
        onSelectionChange={(k) => setKey(k as string | null)}
        onCreate={(name) => {
          const id = name.toLowerCase().replace(/\s+/g, '-');
          setVendors((v) => [...v, { id, name }]);
          setKey(id);
        }}
        emptyMessage="No payees found"
      >
        {vendors.map((v) => (
          <ComboboxItem key={v.id} id={v.id}>
            {v.name}
          </ComboboxItem>
        ))}
      </Combobox>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Combobox',
    slug: 'combobox',
    category: 'Forms',
    description: 'Searchable select: type to filter, arrow keys to navigate, Enter to choose.',
  },
  demos: [
    {
      name: 'Multiple with chips',
      code: `<ComboboxMulti
  label="Reviewers"
  placeholder="Add reviewers…"
  options={[{ id: 'maya', label: 'Maya Chen', description: 'Product Designer', group: 'Design', icon: <Avatar size="xs" name="Maya Chen" /> }]}
/>`,
      Component: () => (
        <div style={col}>
          <ComboboxMulti label="Reviewers" placeholder="Add reviewers…" options={people} defaultValue={['maya', 'sara']} />
        </div>
      ),
    },
    {
      name: 'Vendors',
      code: `<Combobox label="Vendor" placeholder="Search vendors…">
  <ComboboxItem id="aws">Amazon Web Services</ComboboxItem>
  <ComboboxItem id="northwind">Northwind Labs</ComboboxItem>
  <ComboboxItem id="brightpath">Brightpath</ComboboxItem>
</Combobox>`,
      Component: () => (
        <div style={col}>
          <Combobox
            label="Vendor"
            placeholder="Search vendors…"
            description="Used for expense categorisation."
          >
            <ComboboxItem id="aws">Amazon Web Services</ComboboxItem>
            <ComboboxItem id="northwind">Northwind Labs</ComboboxItem>
            <ComboboxItem id="brightpath">Brightpath</ComboboxItem>
            <ComboboxItem id="kestrel">Kestrel Health</ComboboxItem>
            <ComboboxItem id="halcyon">Halcyon Freight</ComboboxItem>
          </Combobox>
        </div>
      ),
    },
    {
      name: 'With status dots and error',
      code: `<Combobox label="Account" isInvalid errorMessage="Select an account."><ComboboxItem dot="success" .../></Combobox>`,
      Component: () => (
        <div style={col}>
          <Combobox label="Account" isInvalid errorMessage="Select an account to continue.">
            <ComboboxItem id="op" dot="success">
              Operating ····4821
            </ComboboxItem>
            <ComboboxItem id="pay" dot="warning">
              Payroll ····9034
            </ComboboxItem>
            <ComboboxItem id="tax" dot="neutral">
              Tax reserve ····1177
            </ComboboxItem>
          </Combobox>
        </div>
      ),
    },
    {
      name: 'Create on the fly',
      code: `<Combobox
  label="Payee"
  selectedKey={key}
  onSelectionChange={setKey}
  onCreate={(name) => addPayee(name)}
  emptyMessage="No payees found"
>
  {payees.map((p) => <ComboboxItem key={p.id} id={p.id}>{p.name}</ComboboxItem>)}
</Combobox>`,
      Component: Creatable,
    },
  ],
};

export default demo;
