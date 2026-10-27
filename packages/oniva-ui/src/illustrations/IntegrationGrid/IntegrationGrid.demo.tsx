import type { DemoModule } from '../../internal/demo';
import { IntegrationGrid } from './IntegrationGrid';

const demo: DemoModule = {
  meta: {
    title: "Integration grid",
    slug: "integration-grid",
    category: 'Illustrations',
    description: "Honeycomb-like wall of integration tiles around a bright centre tile, fading out toward the edges. Pass your own tiles.",
  },
  demos: [
    {
      name: "Default",
      code: `<IntegrationGrid />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <IntegrationGrid />
        </div>
      ),
    },
    {
      name: "Fewer, larger tiles",
      code: `<IntegrationGrid columns={5} />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <IntegrationGrid columns={5} />
        </div>
      ),
    },
  ],
};

export default demo;
