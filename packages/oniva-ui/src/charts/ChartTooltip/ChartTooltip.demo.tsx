import type { DemoModule } from '../../internal/demo';
import { ChartTooltip } from './ChartTooltip';

const demo: DemoModule = {
  meta: {
    title: 'Chart tooltip',
    slug: 'chart-tooltip',
    category: 'Charts',
    description:
      'Hover and focus card used by every chart. Charts position it automatically; render it inline for previews.',
  },
  demos: [
    {
      name: 'Multi-series',
      code: `<ChartTooltip title="Sep 2026" rows={[
  { label: 'Revenue', value: '$73,900', tone: 1 },
  { label: 'Expenses', value: '$43,700', tone: 5 },
]} />`,
      Component: () => (
        <ChartTooltip
          title="Sep 2026"
          rows={[
            { label: 'Revenue', value: '$73,900', tone: 1 },
            { label: 'Expenses', value: '$43,700', tone: 5 },
            { label: 'Net', value: '$30,200' },
          ]}
        />
      ),
    },
    {
      name: 'Custom content',
      code: `<ChartTooltip title="Thu, 8 Oct">9,870 steps</ChartTooltip>`,
      Component: () => <ChartTooltip title="Thu, 8 Oct">9,870 steps</ChartTooltip>,
    },
  ],
};
export default demo;
