import type { DemoModule } from '../../internal/demo';
import { GridBackground } from './GridBackground';

const hero = {
  display: 'grid',
  gap: 8,
  minHeight: 260,
  placeItems: 'center',
  textAlign: 'center',
} as const;

const demo: DemoModule = {
  meta: {
    title: 'Grid background',
    slug: 'grid-background',
    category: 'Motion',
    description:
      'A fine line grid that drifts one cell per loop behind your content and fades out toward the edges. Decorative, pauses offscreen, still under reduced motion.',
  },
  demos: [
    {
      name: 'Diagonal drift',
      code: `<GridBackground size={48} direction="diagonal">
  <section>…</section>
</GridBackground>`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 640, border: '1px solid var(--oniva-color-border)', borderRadius: 16 }}>
          <GridBackground size={48} direction="diagonal">
            <section style={hero}>
              <h3 style={{ margin: 0, fontSize: 24 }}>Build on a steady grid</h3>
              <p style={{ margin: 0, color: 'var(--oniva-color-text-muted)' }}>A quiet, technical backdrop for a hero.</p>
            </section>
          </GridBackground>
        </div>
      ),
    },
    {
      name: 'Tight, upward, no reveal',
      code: `<GridBackground size={24} direction="up" speed={2} reveal={false} fade={85}>…</GridBackground>`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 640, border: '1px solid var(--oniva-color-border)', borderRadius: 16 }}>
          <GridBackground size={24} direction="up" speed={2} reveal={false} fade={85}>
            <section style={hero}>
              <h3 style={{ margin: 0, fontSize: 20 }}>Nothing queued</h3>
              <p style={{ margin: 0, color: 'var(--oniva-color-text-muted)' }}>Runs you start will show up here.</p>
            </section>
          </GridBackground>
        </div>
      ),
    },
    {
      name: 'Still grid',
      code: `<GridBackground speed={0} size={64}>…</GridBackground>`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 640, border: '1px solid var(--oniva-color-border)', borderRadius: 16 }}>
          <GridBackground speed={0} size={64}>
            <section style={hero}>
              <h3 style={{ margin: 0, fontSize: 20 }}>Static grid</h3>
            </section>
          </GridBackground>
        </div>
      ),
    },
  ],
};
export default demo;
