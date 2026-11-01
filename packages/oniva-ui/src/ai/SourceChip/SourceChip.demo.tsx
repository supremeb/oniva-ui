import type { DemoModule } from '../../internal/demo';
import { SourceChip } from './SourceChip';

const demo: DemoModule = {
  meta: {
    title: 'Source chip',
    slug: 'source-chip',
    category: 'AI & Agent',
    description: 'Pill link for a cited web source.',
  },
  demos: [
    {
      name: 'Sources',
      code: `<SourceChip title="SaaS growth benchmarks" url="https://www.northwind.example/atlas" />
<SourceChip title="Q3 earnings roundup" url="https://markets.example/q3-roundup" />`,
      Component: () => (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <SourceChip title="SaaS growth benchmarks" url="https://www.northwind.example/atlas" />
          <SourceChip title="Q3 earnings roundup" url="https://markets.example/q3-roundup" />
          <SourceChip title="NRR by segment" url="https://research.example/nrr" />
        </div>
      ),
    },
  ],
};

export default demo;
