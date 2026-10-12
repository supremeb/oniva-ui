import type { DemoModule } from '../../internal/demo';
import { DeltaBadge } from './DeltaBadge';

const demo: DemoModule = {
  meta: {
    title: 'DeltaBadge',
    slug: 'delta-badge',
    category: 'Widgets',
    description: 'Signed change chip with trend arrow. Green for good, red for bad, neutral when flat.',
  },
  demos: [
    {
      name: 'Up, down, flat',
      code: `<DeltaBadge value={14.8} />
<DeltaBadge value={-3.2} />
<DeltaBadge value={0} />`,
      Component: () => (
        <div style={{ display: 'flex', gap: 8 }}>
          <DeltaBadge value={14.8} />
          <DeltaBadge value={-3.2} />
          <DeltaBadge value={0} />
        </div>
      ),
    },
    {
      name: 'Lower is better',
      code: `<DeltaBadge value={-18} suffix=" ms" digits={0} invert />
<DeltaBadge value={0.6} invert />`,
      Component: () => (
        <div style={{ display: 'flex', gap: 8 }}>
          <DeltaBadge value={-18} suffix=" ms" digits={0} invert />
          <DeltaBadge value={0.6} invert />
        </div>
      ),
    },
  ],
};

export default demo;
