import { FileText, SearchX } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../Button';
import { EmptyState } from './EmptyState';

const demo: DemoModule = {
  meta: {
    title: 'EmptyState',
    slug: 'empty-state',
    category: 'Feedback',
    description: 'Placeholder for lists, tables and search results with no content.',
  },
  demos: [
    {
      name: 'First-run',
      code: `<EmptyState
  bordered
  icon={<FileText size={20} />}
  title="No invoices yet"
  description="Create an invoice to start getting paid. Drafts you save will appear here."
  actions={<><Button variant="secondary">Import CSV</Button><Button>New invoice</Button></>}
/>`,
      Component: () => (
        <EmptyState
          bordered
          icon={<FileText size={20} />}
          title="No invoices yet"
          description="Create an invoice to start getting paid. Drafts you save will appear here."
          actions={
            <>
              <Button variant="secondary">Import CSV</Button>
              <Button>New invoice</Button>
            </>
          }
        />
      ),
    },
    {
      name: 'No results',
      code: `<EmptyState icon={<SearchX size={20} />} title="No results for \u201cAcme\u201d"
  description="Try a different customer name or clear filters." />`,
      Component: () => (
        <EmptyState
          icon={<SearchX size={20} />}
          title="No results for “Acme”"
          description="Try a different customer name or clear filters."
          actions={<Button variant="ghost">Clear filters</Button>}
        />
      ),
    },
  ],
};
export default demo;
