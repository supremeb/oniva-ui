import type { DemoModule } from '../../internal/demo';
import { Shimmer, ShimmerBlock } from './Shimmer';

const demo: DemoModule = {
  meta: {
    title: 'Shimmer',
    slug: 'shimmer',
    category: 'Motion',
    description: 'Shimmering text for pending states. Pauses offscreen, static under reduced motion.',
  },
  demos: [
    {
      name: 'Pending label',
      code: `<Shimmer>Generating response…</Shimmer>
<Shimmer isActive={false}>Done</Shimmer>`,
      Component: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 15 }}>
          <Shimmer>Generating response…</Shimmer>
          <Shimmer isActive={false}>Done (static)</Shimmer>
        </div>
      ),
    },
    {
      name: 'Skeleton blocks, one sweep',
      code: `<div aria-busy="true">
  <ShimmerBlock isCircle width={40} />
  <ShimmerBlock width={140} height={10} />
  <ShimmerBlock width={90} height={8} />
</div>`,
      Component: () => (
        <div aria-busy="true" style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ShimmerBlock isCircle width={40} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <ShimmerBlock width={140} height={10} />
              <ShimmerBlock width={90} height={8} />
            </div>
          </div>
          <ShimmerBlock height={96} radius={12} />
          <ShimmerBlock width="80%" height={10} />
        </div>
      ),
    },
  ],
};
export default demo;
