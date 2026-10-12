import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { contributionYear, seeded } from '../_data/datasets';
import { ChartCard, ChartRangeToggle } from '../ChartCard';
import { ContributionHeatmap, Heatmap } from './Heatmap';

const year = contributionYear();
const rnd = seeded(11);
const rows = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const cols = ['8a', '10a', '12p', '2p', '4p', '6p', '8p'];
const matrix = rows.map((_, i) =>
  cols.map((_, j) => Math.round(rnd() * 20 * (i > 4 ? 0.3 : 1) * (j === 0 || j === 6 ? 0.5 : 1))),
);

function Contributions() {
  const [range, setRange] = useState<'weekly' | 'monthly' | 'yearly'>('yearly');
  const slice = range === 'yearly' ? year : range === 'monthly' ? year.slice(-35) : year.slice(-7);
  const total = slice.reduce((s, d) => s + d.value, 0);
  return (
    <div style={{ width: '100%', maxWidth: 760 }}>
      <ChartCard
        title="Contributions"
        value={total.toLocaleString('en-US')}
        unit={`in the last ${range === 'yearly' ? 'year' : range === 'monthly' ? '5 weeks' : '7 days'}`}
        actions={
          <ChartRangeToggle
            value={range}
            onChange={(v) => setRange(v as typeof range)}
            options={[
              { id: 'weekly', label: 'Weekly' },
              { id: 'monthly', label: 'Monthly' },
              { id: 'yearly', label: 'Yearly' },
            ]}
          />
        }
      >
        <ContributionHeatmap data={year} range={range} />
      </ChartCard>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Heatmap',
    slug: 'heatmap',
    category: 'Charts',
    description:
      'Matrix heatmap and a GitHub-style contribution calendar with Weekly, Monthly and Yearly ranges.',
  },
  demos: [
    {
      name: 'Contribution calendar',
      code: `const [range, setRange] = useState('yearly');
<ChartCard title="Contributions" value="1,146" actions={<ChartRangeToggle … />}>
  <ContributionHeatmap data={days} range={range} />
</ChartCard>`,
      Component: Contributions,
    },
    {
      name: 'Matrix',
      code: `<Heatmap rows={['Mon', …]} columns={['8a', '10a', …]} values={matrix} unit="commits" />`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 560 }}>
          <ChartCard title="Commits by weekday and hour">
            <Heatmap rows={rows} columns={cols} values={matrix} unit="commits" tone={1} />
          </ChartCard>
        </div>
      ),
    },
  ],
};
export default demo;
