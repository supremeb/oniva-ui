import type { DemoModule } from '../../internal/demo';
import { Combobox, ComboboxItem } from './Combobox';

const col = { display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 340 } as const;

const demo: DemoModule = {
  meta: {
    title: 'Combobox',
    slug: 'combobox',
    category: 'Forms',
    description: 'Searchable select: type to filter, arrow keys to navigate, Enter to choose.',
  },
  demos: [
    {
      name: 'Vendors',
      code: `<Combobox label="Vendor" placeholder="Search vendors…">
  <ComboboxItem id="aws">Amazon Web Services</ComboboxItem>
  <ComboboxItem id="stripe">Stripe</ComboboxItem>
  <ComboboxItem id="figma">Figma</ComboboxItem>
</Combobox>`,
      Component: () => (
        <div style={col}>
          <Combobox label="Vendor" placeholder="Search vendors…" description="Used for expense categorisation.">
            <ComboboxItem id="aws">Amazon Web Services</ComboboxItem>
            <ComboboxItem id="stripe">Stripe</ComboboxItem>
            <ComboboxItem id="figma">Figma</ComboboxItem>
            <ComboboxItem id="notion">Notion Labs</ComboboxItem>
            <ComboboxItem id="vercel">Vercel</ComboboxItem>
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
            <ComboboxItem id="op" dot="success">Operating ····4821</ComboboxItem>
            <ComboboxItem id="pay" dot="warning">Payroll ····9034</ComboboxItem>
            <ComboboxItem id="tax" dot="neutral">Tax reserve ····1177</ComboboxItem>
          </Combobox>
        </div>
      ),
    },
  ],
};

export default demo;
