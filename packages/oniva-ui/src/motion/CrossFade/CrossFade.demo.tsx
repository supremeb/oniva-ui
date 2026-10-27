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
    {
      name: 'Keyed swap',
      code: `<CrossFade contentKey={status} morph="both" as="span">{label[status]}</CrossFade>
<CrossFade contentKey={step} morph="height"><p>{steps[step]}</p></CrossFade>`,
      Component: () => {
        const labels = ['Save changes', 'Saving…', 'Saved'];
        const tips = [
          'Shortcuts are listed in the command palette.',
          'Invite teammates from Settings, then pick a role for each of them. Roles can change at any time without losing history.',
          'Pin the views you open daily.',
        ];
        const [i, setI] = useState(0);
        return (
          <div style={{ display: 'grid', gap: 16, width: 320 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button onPress={() => setI((n) => (n + 1) % 3)}>
                <CrossFade contentKey={labels[i]!} morph="both" as="span">
                  {labels[i]}
                </CrossFade>
              </Button>
            </div>
            <CrossFade contentKey={i} morph="height" duration={300}>
              <p style={{ margin: 0 }}>{tips[i]}</p>
            </CrossFade>
          </div>
        );
      },
    },
  ],
};
export default demo;
