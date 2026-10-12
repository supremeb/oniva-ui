import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../../components/Button';
import { AnimatedHeight } from './AnimatedHeight';

const demo: DemoModule = {
  meta: {
    title: 'Animated height',
    slug: 'animated-height',
    category: 'Motion',
    description:
      'Smooth 0 → auto height using grid rows (0fr → 1fr), 250ms ease-out with a fast opacity fade. Closed content is inert.',
  },
  demos: [
    {
      name: 'Disclosure',
      code: `<AnimatedHeight isOpen={open}>
  <p>Content of any height</p>
</AnimatedHeight>`,
      Component: () => {
        const [open, setOpen] = useState(false);
        const [long, setLong] = useState(false);
        return (
          <div style={{ maxWidth: 420 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button onPress={() => setOpen((v) => !v)}>{open ? 'Collapse' : 'Expand'}</Button>
              <Button variant="secondary" onPress={() => setLong((v) => !v)}>Toggle content size</Button>
            </div>
            <AnimatedHeight isOpen={open}>
              <p style={{ margin: '12px 0 0' }}>
                Height follows the content, even while it changes. {long && 'Extra lines of copy appear here, and the container tracks them without any measuring code. '.repeat(3)}
              </p>
            </AnimatedHeight>
            <div style={{ marginTop: 12, color: 'var(--oniva-color-text-muted)' }}>Content below moves with it.</div>
          </div>
        );
      },
    },
  ],
};
export default demo;
