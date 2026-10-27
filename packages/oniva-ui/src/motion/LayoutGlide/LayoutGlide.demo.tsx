import { useRef, useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../../components/Button';
import { LayoutGlide } from './LayoutGlide';

const ALL = ['Design', 'Billing', 'Evals', 'Agents', 'Folders', 'Insights'];

const demo: DemoModule = {
  meta: {
    title: 'LayoutGlide',
    slug: 'layout-glide',
    category: 'Motion',
    description: 'FLIP for lists: items marked data-glide-id glide to their new place with transform only; new items fade and rise in.',
  },
  demos: [
    {
      name: 'Filter and shuffle',
      code: `<LayoutGlide>{items.map((i) => <div key={i} data-glide-id={i}>{i}</div>)}</LayoutGlide>`,
      Component: () => {
        const [items, setItems] = useState(ALL);
        const flip = useRef(false);
        return (
          <div style={{ maxWidth: 420 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <Button onPress={() => setItems((l) => [...l].reverse())}>Reverse</Button>
              <Button
                onPress={() => {
                  flip.current = !flip.current;
                  setItems(flip.current ? ALL.filter((_, i) => i % 2 === 0) : ALL);
                }}
              >
                Toggle filter
              </Button>
            </div>
            <LayoutGlide style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {items.map((t) => (
                <div key={t} data-glide-id={t} style={{ border: '1px solid var(--oniva-color-border)', borderRadius: 8, padding: 12 }}>
                  {t}
                </div>
              ))}
            </LayoutGlide>
          </div>
        );
      },
    },
  ],
};
export default demo;
