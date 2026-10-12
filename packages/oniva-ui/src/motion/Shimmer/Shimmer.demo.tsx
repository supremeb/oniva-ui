import type { DemoModule } from '../../internal/demo';
import { Shimmer } from './Shimmer';

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
  ],
};
export default demo;
