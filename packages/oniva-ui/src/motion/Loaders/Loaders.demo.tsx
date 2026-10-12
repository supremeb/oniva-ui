import type { DemoModule } from '../../internal/demo';
import { Loader } from './Loaders';

const demo: DemoModule = {
  meta: {
    title: "Loaders",
    slug: "loaders",
    category: 'Motion',
    description: "Dots, bars, matrix, comet and typing loaders. Transform/opacity only; pause offscreen.",
  },
  demos: [
    {
      name: "Variants",
      code: "<div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center', fontSize: 24 }}>{(['dots', 'bars', 'matrix', 'comet', 'typing'] as const).map((v) => (<div key={v} style={{ display: 'grid', justifyItems: 'center', gap: 8 }}><Loader variant={v} size={24} /><span style={{ fontSize: 12, color: 'var(--oniva-color-text-muted)' }}>{v}</span></div>))}</div>",
      Component: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center', fontSize: 24 }}>{(['dots', 'bars', 'matrix', 'comet', 'typing'] as const).map((v) => (<div key={v} style={{ display: 'grid', justifyItems: 'center', gap: 8 }}><Loader variant={v} size={24} /><span style={{ fontSize: 12, color: 'var(--oniva-color-text-muted)' }}>{v}</span></div>))}</div>
      ),
    },
  ],
};
export default demo;
