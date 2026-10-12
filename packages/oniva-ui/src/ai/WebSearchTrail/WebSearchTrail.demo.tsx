import type { DemoModule } from '../../internal/demo';
import { WebSearchTrail } from './WebSearchTrail';

const demo: DemoModule = {
  meta: {
    title: 'Web Search Trail',
    slug: 'web-search-trail',
    category: 'AI & Agent',
    description: 'Shows the queries an agent ran and the sources it consulted.',
  },
  demos: [
    {
      name: 'In progress',
      code: `<WebSearchTrail queries={[…]} />`,
      Component: () => (
        <div style={{ maxWidth: 480 }}>
          <WebSearchTrail
            queries={[
              { id: '1', query: 'B2B SaaS Q3 2026 revenue growth benchmarks', status: 'done', resultCount: 8 },
              { id: '2', query: 'net revenue retention median mid-market SaaS', status: 'searching' },
            ]}
          />
        </div>
      ),
    },
    {
      name: 'Complete',
      code: `<WebSearchTrail queries={[…]} sources={[…]} />`,
      Component: () => (
        <div style={{ maxWidth: 480 }}>
          <WebSearchTrail
            queries={[{ id: '1', query: 'B2B SaaS Q3 2026 revenue growth benchmarks', status: 'done', resultCount: 8 }]}
            sources={[
              { title: 'SaaS growth benchmarks', url: 'https://www.bvp.com/atlas' },
              { title: 'NRR by segment', url: 'https://www.saastr.com/nrr' },
            ]}
          />
        </div>
      ),
    },
  ],
};

export default demo;
