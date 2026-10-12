import { useRef, useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { SlidingIndicator } from './SlidingIndicator';

const items = ['Overview', 'Analytics', 'Reports', 'Settings'];

const demo: DemoModule = {
  meta: {
    title: 'Sliding indicator',
    slug: 'sliding-indicator',
    category: 'Motion',
    description:
      'One pill that glides between items (250ms ease-out), measured with ResizeObserver. The first placement is not animated.',
  },
  demos: [
    {
      name: 'Tab strip',
      code: `const ref = useRef(null);
<div ref={ref} style={{ position: 'relative' }}>
  <SlidingIndicator containerRef={ref} activeKey={active} />
  {items.map((i) => <button aria-selected={i === active} …>{i}</button>)}
</div>`,
      Component: () => {
        const ref = useRef<HTMLDivElement>(null);
        const [active, setActive] = useState(items[0]);
        return (
          <div ref={ref} role="tablist" style={{ position: 'relative', display: 'inline-flex', gap: 4, padding: 4, borderRadius: 12, background: 'var(--oniva-color-surface-inset)' }}>
            <SlidingIndicator containerRef={ref} activeKey={active} />
            {items.map((i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                style={{ position: 'relative', zIndex: 1, border: 0, background: 'transparent', padding: '6px 14px', borderRadius: 8, font: 'inherit', color: 'var(--oniva-color-text)', cursor: 'pointer' }}
              >
                {i}
              </button>
            ))}
          </div>
        );
      },
    },
  ],
};
export default demo;
