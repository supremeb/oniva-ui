import type { DemoModule } from '../../internal/demo';
import { Meter } from './Meter';

const col = { display: 'grid', gap: 20, maxWidth: 440, width: '100%' } as const;

const demo: DemoModule = {
  meta: {
    title: 'Meter',
    slug: 'meter',
    category: 'Feedback',
    description: 'A gauge for a known range, such as quota or seat usage. Color shifts at thresholds.',
  },
  demos: [
    {
      name: 'Threshold colours',
      code: `<Meter label="Seats used" value={42} />
<Meter label="API quota" value={78} />
<Meter label="Storage" value={96} />`,
      Component: () => (
        <div style={col}>
          <Meter label="Seats used" value={42} />
          <Meter label="API quota" value={78} />
          <Meter label="Storage" value={96} />
        </div>
      ),
    },
    {
      name: 'Custom range',
      code: `<Meter label="Disk: 38 GB of 64 GB" value={38} maxValue={64} />`,
      Component: () => (
        <div style={col}>
          <Meter label="Disk: 38 GB of 64 GB" value={38} maxValue={64} />
        </div>
      ),
    },
  ],
};
export default demo;
