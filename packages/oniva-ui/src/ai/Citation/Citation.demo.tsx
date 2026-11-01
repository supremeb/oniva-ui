import type { DemoModule } from '../../internal/demo';
import { Citation } from './Citation';

const demo: DemoModule = {
  meta: {
    title: 'Citation',
    slug: 'citation',
    category: 'AI & Agent',
    description: 'Numbered inline source marker with a hover card.',
  },
  demos: [
    {
      name: 'Inline',
      code: `Net revenue retention was 118%<Citation index={1} title="NRR by segment" url="https://www.northwind.example/reports/nrr" />.`,
      Component: () => (
        <p style={{ fontSize: 14, lineHeight: '22px', margin: 0 }}>
          Net revenue retention was 118%
          <Citation index={1} title="NRR by segment" url="https://www.northwind.example/reports/nrr" />, ahead of
          the 112% median
          <Citation index={2} title="SaaS growth benchmarks" url="https://benchmarks.example/atlas" />.
        </p>
      ),
    },
  ],
};

export default demo;
