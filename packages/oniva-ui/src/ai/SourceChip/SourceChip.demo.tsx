import type { DemoModule } from '../../internal/demo';
import { SourceChip } from './SourceChip';

const demo: DemoModule = {
  meta: {
    title: 'Source Chip',
    slug: 'source-chip',
    category: 'AI & Agent',
    description: 'Pill link for a cited web source.',
  },
  demos: [
    {
      name: 'Sources',
      code: `<SourceChip title="SaaS growth benchmarks" url="https://www.bvp.com/atlas" />
<SourceChip title="Q3 earnings roundup" url="https://www.reuters.com/markets" />`,
      Component: () => (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <SourceChip title="SaaS growth benchmarks" url="https://www.bvp.com/atlas" />
          <SourceChip title="Q3 earnings roundup" url="https://www.reuters.com/markets" />
          <SourceChip title="NRR by segment" url="https://www.saastr.com/nrr" />
        </div>
      ),
    },
  ],
};

export default demo;
