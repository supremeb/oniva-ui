import type { DemoModule } from '../../internal/demo';
import { InView } from './InView';

const demo: DemoModule = {
  meta: {
    title: 'In view',
    slug: 'in-view',
    category: 'Motion',
    description: '`useInView` (IntersectionObserver, fires once) and `<InView>` that plays an enter preset when scrolled into view.',
  },
  demos: [
    {
      name: 'Scroll reveal',
      code: `<InView preset="slide">…</InView>
const { ref, inView } = useInView();`,
      Component: () => (
        <div tabIndex={0} role="region" aria-label="Scroll reveal demo" style={{ height: 220, overflowY: 'auto', border: '1px solid var(--oniva-color-border)', borderRadius: 12, padding: 12 }}>
          <div style={{ height: 160, color: 'var(--oniva-color-text-muted)' }}>Scroll down inside this box…</div>
          {[1, 2, 3].map((n) => (
            <InView key={n} preset={n === 2 ? 'blur' : 'slide'} rootMargin="0px">
              <div style={{ padding: 16, marginBottom: 80, borderRadius: 12, background: 'var(--oniva-color-surface)' }}>Card {n}</div>
            </InView>
          ))}
        </div>
      ),
    },
  ],
};
export default demo;
