import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../../components/Button';
import { Skeleton } from '../../components/Skeleton';
import { CrossFade } from './CrossFade';

const demo: DemoModule = {
  meta: {
    title: 'Cross fade',
    slug: 'cross-fade',
    category: 'Motion',
    description: 'Skeleton → content handoff: content blur-fades in (250ms) while the skeleton fades out (100ms). Interruptible.',
  },
  demos: [
    {
      name: 'Skeleton to content',
      code: `<CrossFade isLoading={loading} skeleton={<Skeleton … />}>{content}</CrossFade>`,
      Component: () => {
        const [loading, setLoading] = useState(true);
        return (
          <div style={{ width: 320 }}>
            <Button onPress={() => setLoading((v) => !v)}>{loading ? 'Load' : 'Reset'}</Button>
            <CrossFade
              isLoading={loading}
              skeleton={
                <div style={{ display: 'grid', gap: 8, paddingTop: 12 }}>
                  <Skeleton height={20} width="60%" />
                  <Skeleton height={14} />
                  <Skeleton height={14} width="80%" />
                </div>
              }
            >
              <div style={{ paddingTop: 12 }}>
                <div style={{ fontWeight: 600 }}>Quarterly summary</div>
                <p style={{ margin: '8px 0 0' }}>Revenue grew 12% quarter over quarter.</p>
              </div>
            </CrossFade>
          </div>
        );
      },
    },
  ],
};
export default demo;
