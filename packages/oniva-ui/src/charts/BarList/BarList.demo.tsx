import type { DemoModule } from '../../internal/demo';
import { topPages } from '../_data/datasets';
import { ChartCard } from '../ChartCard';
import { BarList } from './BarList';

const demo: DemoModule = {
  meta: {
    title: 'Bar list',
    slug: 'bar-list',
    category: 'Charts',
    description:
      'Ranked list where each row is a proportional bar with the name inside and the value on the right.',
  },
  demos: [
    {
      name: 'Top pages',
      code: `<BarList items={[{ name: '/pricing', value: 12480 }, { name: '/docs/getting-started', value: 9215 }, …]} valueFormat="compact" />`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 480 }}>
          <ChartCard title="Top pages" value="38,101" unit="views">
            <BarList items={topPages} valueFormat="number" />
          </ChartCard>
        </div>
      ),
    },
    {
      name: 'Ranked and linked',
      code: `<BarList ranked tone={1} items={[{ name: 'Organic search', value: 18420, href: '#' }, …]} />`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 480 }}>
          <BarList
            ranked
            tone={1}
            valueFormat="compact"
            items={[
              { name: 'Organic search', value: 18420, href: '#organic' },
              { name: 'Direct', value: 11260, href: '#direct' },
              { name: 'Referral', value: 7840, href: '#referral' },
              { name: 'Social', value: 4310, href: '#social' },
            ]}
          />
        </div>
      ),
    },
  ],
};
export default demo;
