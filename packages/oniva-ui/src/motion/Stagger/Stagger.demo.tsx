import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../../components/Button';
import { Stagger } from './Stagger';

const demo: DemoModule = {
  meta: {
    title: 'Stagger',
    slug: 'stagger',
    category: 'Motion',
    description: 'Children rise in with a 35ms stagger capped at 6 steps. CSS-only, plays once per mount.',
  },
  demos: [
    {
      name: 'List',
      code: `<Stagger>{items.map((i) => <Row key={i} />)}</Stagger>`,
      Component: () => {
        const [run, setRun] = useState(0);
        return (
          <div style={{ maxWidth: 360 }}>
            <Button onPress={() => setRun((n) => n + 1)}>Replay</Button>
            <Stagger key={run} xstyle={undefined}>
              {['Design review', 'Ship motion tokens', 'Write docs', 'Fix flaky test', 'Release', 'Celebrate', 'Rest', 'Repeat'].map((t) => (
                <div key={t} style={{ padding: '10px 12px', borderBottom: '1px solid var(--oniva-color-border)' }}>{t}</div>
              ))}
            </Stagger>
          </div>
        );
      },
    },
  ],
};
export default demo;
