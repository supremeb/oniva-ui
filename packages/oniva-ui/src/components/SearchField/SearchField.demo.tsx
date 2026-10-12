import type { DemoModule } from '../../internal/demo';
import { SearchField } from './SearchField';

const col = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: '100%',
  maxWidth: 340,
} as const;

const demo: DemoModule = {
  meta: {
    title: 'Search field',
    slug: 'search-field',
    category: 'Forms',
    description:
      'Search input with leading icon, clear button and an optional keyboard shortcut hint.',
  },
  demos: [
    {
      name: 'With ⌘K hint',
      code: `<SearchField aria-label="Search" placeholder="Search customers, invoices…" />`,
      Component: () => (
        <div style={col}>
          <SearchField aria-label="Search" placeholder="Search customers, invoices…" />
        </div>
      ),
    },
    {
      name: 'Clearable and sizes',
      code: `<SearchField size="sm" aria-label="Small" defaultValue="Acme Corp" shortcut={null} />
<SearchField size="lg" aria-label="Large" shortcut="/" />`,
      Component: () => (
        <div style={col}>
          <SearchField size="sm" aria-label="Small" defaultValue="Acme Corp" shortcut={null} />
          <SearchField
            size="lg"
            aria-label="Large"
            shortcut="/"
            placeholder="Filter transactions"
          />
        </div>
      ),
    },
  ],
};

export default demo;
