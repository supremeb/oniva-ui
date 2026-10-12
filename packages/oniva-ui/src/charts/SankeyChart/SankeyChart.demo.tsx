import type { DemoModule } from '../../internal/demo';
import { sankeyFlows } from '../_data/datasets';
import { ChartCard } from '../ChartCard';
import { SankeyChart } from './SankeyChart';

const tones = [1, 6, 5, 4, 7, 3, 10, 2, 8];
const nodes = sankeyFlows.nodes.map((n, i) => ({ ...n, tone: tones[i] }));

const demo: DemoModule = {
  meta: {
    title: 'SankeyChart',
    slug: 'sankey-chart',
    category: 'Charts',
    description:
      'Flow diagram built on d3-sankey, with gradient links, focusable flows and tooltips.',
  },
  demos: [
    {
      name: 'Acquisition flow',
      code: `<SankeyChart nodes={[{ id: 'search', label: 'Search' }, …]} links={[{ source: 'search', target: 'landing', value: 420 }, …]} />`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 720 }}>
          <ChartCard title="Acquisition flow" value="1,360" unit="sessions">
            <SankeyChart nodes={nodes} links={sankeyFlows.links} height={340} />
          </ChartCard>
        </div>
      ),
    },
  ],
};
export default demo;
