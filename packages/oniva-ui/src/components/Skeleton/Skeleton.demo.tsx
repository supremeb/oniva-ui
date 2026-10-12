import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../Button';
import { Card } from '../Card';
import { CrossFade } from '../../motion/CrossFade/CrossFade';
import { Skeleton } from './Skeleton';

const demo: DemoModule = {
  meta: {
    title: 'Skeleton',
    slug: 'skeleton',
    category: 'Feedback',
    description:
      'Shimmering placeholder for loading content. Static when reduced motion is requested.',
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
    {
      name: 'Skeleton to content',
      code: `<CrossFade isLoading={loading} skeleton={<Skeleton … />}>
  <Invoice … />
</CrossFade>`,
      Component: () => {
        const [loading, setLoading] = useState(true);
        return (
          <div style={{ display: 'grid', gap: 12, width: 320 }}>
            <Button size="sm" onPress={() => setLoading((v) => !v)}>
              {loading ? 'Load invoice' : 'Reset'}
            </Button>
            <CrossFade
              isLoading={loading}
              skeleton={
                <div style={{ display: 'grid', gap: 8 }}>
                  <Skeleton width="55%" height={18} />
                  <Skeleton width="35%" />
                  <Skeleton variant="rect" height={48} />
                </div>
              }
            >
              <div style={{ display: 'grid', gap: 8 }}>
                <div style={{ fontWeight: 600, height: 18 }}>INV-2041 · Acme Corp</div>
                <div style={{ height: 14 }}>Due Oct 28, 2026</div>
                <div style={{ fontSize: 28, fontWeight: 600, height: 48 }}>$12,480.00</div>
              </div>
            </CrossFade>
          </div>
        );
      },
    },
  ],
};
export default demo;
