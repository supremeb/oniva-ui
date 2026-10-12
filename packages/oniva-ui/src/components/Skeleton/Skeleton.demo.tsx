import type { DemoModule } from '../../internal/demo';
import { Card } from '../Card';
import { Skeleton } from './Skeleton';

const demo: DemoModule = {
  meta: {
    title: 'Skeleton',
    slug: 'skeleton',
    category: 'Feedback',
    description: 'Shimmering placeholder for loading content. Static when reduced motion is requested.',
  },
  demos: [
    {
      name: 'Profile row',
      code: `<div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
  <Skeleton variant="circle" />
  <div style={{ flex: 1, display: 'grid', gap: 8 }}>
    <Skeleton width="40%" />
    <Skeleton width="65%" />
  </div>
</div>`,
      Component: () => (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Skeleton variant="circle" />
          <div style={{ flex: 1, display: 'grid', gap: 8 }}>
            <Skeleton width="40%" />
            <Skeleton width="65%" />
          </div>
        </div>
      ),
    },
    {
      name: 'Card placeholder',
      code: `<Skeleton variant="rect" height={120} />
<Skeleton width="30%" />`,
      Component: () => (
        <Card>
          <div style={{ display: 'grid', gap: 12, padding: 16 }}>
            <Skeleton width="30%" />
            <Skeleton variant="rect" height={120} />
            <Skeleton width="80%" />
          </div>
        </Card>
      ),
    },
  ],
};
export default demo;
