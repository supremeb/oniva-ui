import type { DemoModule } from '../../internal/demo';
import { GradientFloor } from './GradientFloor';

const center = { display: 'grid', gap: 6, justifyItems: 'center', paddingTop: 36, textAlign: 'center' } as const;

const demo: DemoModule = {
  meta: {
    title: 'Gradient floor',
    slug: 'gradient-floor',
    category: 'Motion',
    description:
      'A colour gradient that glows up from the bottom edge: two layers whose peaks and valleys morph against each other while they drift. Runs only on screen, still under reduced motion.',
  },
  demos: [
    {
      name: 'Accent floor',
      code: `<GradientFloor style={{ height: 300 }}>
  <h2>Ideas start to glow</h2>
</GradientFloor>`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 640 }}>
          <GradientFloor xstyle={undefined}>
            <div style={center}>
              <h3 style={{ margin: 0, fontSize: 24 }}>Ideas start to glow</h3>
              <p style={{ margin: 0, color: 'var(--oniva-color-text-muted)' }}>Ask anything about your workspace.</p>
            </div>
            <div style={{ height: 160 }} />
          </GradientFloor>
        </div>
      ),
    },
    {
      name: 'Custom colours, slower',
      code: `<GradientFloor speed={5} colors={['#f59e0b', '#e11d48', '#4f46e5']}>…</GradientFloor>`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 640 }}>
          <GradientFloor speed={5} colors={['#f59e0b', '#e11d48', '#4f46e5']}>
            <div style={center}>
              <h3 style={{ margin: 0, fontSize: 20 }}>Launch day</h3>
            </div>
            <div style={{ height: 180 }} />
          </GradientFloor>
        </div>
      ),
    },
    {
      name: 'Still',
      code: `<GradientFloor speed={0}>…</GradientFloor>`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 640 }}>
          <GradientFloor speed={0}>
            <div style={{ height: 220 }} />
          </GradientFloor>
        </div>
      ),
    },
  ],
};
export default demo;
