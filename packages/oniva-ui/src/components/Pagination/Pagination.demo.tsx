import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Pagination } from './Pagination';

const demo: DemoModule = {
  meta: {
    title: 'Pagination',
    slug: 'pagination',
    category: 'Navigation',
    description:
      'Page navigation with numbers and ellipsis, or a compact table-footer variant with Previous / Next.',
  },
  demos: [
    {
      name: 'Numbers with ellipsis',
      code: `<Pagination pageCount={24} defaultPage={8} />`,
      Component: () => <Pagination pageCount={24} defaultPage={8} />,
    },
    {
      name: 'Accent current page',
      code: `<Pagination pageCount={9} defaultPage={2} accentCurrent />`,
      Component: () => <Pagination pageCount={9} defaultPage={2} accentCurrent />,
    },
    {
      name: 'Table footer',
      code: `<Pagination variant="simple" pageCount={25} page={page} onPageChange={setPage}
  summary={\`Showing \${(page - 1) * 10 + 1}-\${Math.min(page * 10, 248)} of 248\`} />`,
      Component: function Footer() {
        const [page, setPage] = useState(1);
        return (
          <Pagination
            variant="simple"
            pageCount={25}
            page={page}
            onPageChange={setPage}
            summary={`Showing ${(page - 1) * 10 + 1}-${Math.min(page * 10, 248)} of 248 results`}
          />
        );
      },
    },
  ],
};
export default demo;
