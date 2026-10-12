import type { DemoModule } from '../../internal/demo';
import { ChartLegend } from './ChartLegend';

const demo: DemoModule = {
  meta: {
    title: 'Chart legend',
    slug: 'chart-legend',
    category: 'Charts',
    description:
      'Colour-keyed legend that uses the chart palette. Horizontal or vertical with values.',
  },
  demos: [
    {
      name: 'Horizontal',
      code: `<ChartLegend items={[{ label: 'Input', tone: 1 }, { label: 'Output', tone: 4 }, { label: 'Cached', tone: 5 }]} />`,
      Component: () => (
        <ChartLegend
          items={[
            { label: 'Input', tone: 1 },
            { label: 'Output', tone: 4 },
            { label: 'Cached', tone: 5 },
          ]}
        />
      ),
    },
    {
      name: 'Vertical with values',
      code: `<ChartLegend orientation="vertical" shape="round" items={[
  { label: 'Deep', tone: 5, value: '1h 36m' },
  { label: 'REM', tone: 6, value: '1h 52m' },
]} />`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 240 }}>
          <ChartLegend
            orientation="vertical"
            shape="round"
            items={[
              { label: 'Deep', tone: 5, value: '1h 36m' },
              { label: 'REM', tone: 6, value: '1h 52m' },
              { label: 'Light', tone: 3, value: '3h 34m' },
              { label: 'Awake', tone: 10, value: '18m' },
            ]}
          />
        </div>
      ),
    },
  ],
};
export default demo;
