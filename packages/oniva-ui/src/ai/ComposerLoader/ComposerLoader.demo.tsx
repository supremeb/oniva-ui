import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../../components/Button';
import { ComposerLoader } from './ComposerLoader';

const demo: DemoModule = {
  meta: {
    title: 'Composer loader',
    slug: 'composer-loader',
    category: 'AI & Agent',
    description:
      'A light that orbits the composer border while the agent is working. Static with reduced motion.',
  },
  demos: [
    {
      name: 'Orbiting light',
      code: `<ComposerLoader active={working}>
  <div style={{ padding: 16 }}>Analyze Q3 revenue by segment…</div>
</ComposerLoader>`,
      Component: function Orbit() {
        const [on, setOn] = useState(true);
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 560 }}>
            <ComposerLoader active={on}>
              <div style={{ padding: '18px 18px 44px', fontSize: 14, color: '#6b6b6b' }}>
                Analyze Q3 revenue by segment…
              </div>
            </ComposerLoader>
            <div>
              <Button size="sm" variant="secondary" onPress={() => setOn((v) => !v)}>
                {on ? 'Stop' : 'Start'}
              </Button>
            </div>
          </div>
        );
      },
    },
  ],
};

export default demo;
