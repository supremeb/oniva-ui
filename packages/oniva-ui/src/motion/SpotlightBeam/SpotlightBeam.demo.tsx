import type { DemoModule } from '../../internal/demo';
import { SpotlightBeam } from './SpotlightBeam';

const demo: DemoModule = {
  meta: {
    title: "Spotlight beam",
    slug: "spotlight-beam",
    category: 'Motion',
    description: "Hero background of two swaying light cones. Pauses offscreen; static under reduced motion.",
  },
  demos: [
    {
      name: "Hero",
      code: "<SpotlightBeam><div style={{ padding: '72px 24px', textAlign: 'center' }}><div style={{ fontSize: 32, fontWeight: 600 }}>Agents for regulated teams</div><div style={{ color: 'var(--oniva-color-text-muted)', marginTop: 8 }}>Audit-ready by default.</div></div></SpotlightBeam>",
      Component: () => (
        <SpotlightBeam><div style={{ padding: '72px 24px', textAlign: 'center' }}><div style={{ fontSize: 32, fontWeight: 600 }}>Agents for regulated teams</div><div style={{ color: 'var(--oniva-color-text-muted)', marginTop: 8 }}>Audit-ready by default.</div></div></SpotlightBeam>
      ),
    },
  ],
};
export default demo;
