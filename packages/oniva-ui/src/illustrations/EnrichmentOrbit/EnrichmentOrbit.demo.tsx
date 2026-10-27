import type { DemoModule } from '../../internal/demo';
import { EnrichmentOrbit } from './EnrichmentOrbit';

const demo: DemoModule = {
  meta: {
    title: "Enrichment orbit illustration",
    slug: "enrichment-orbit",
    category: 'Illustrations',
    description: "A tile inside two rings. Comets circle in opposite directions while three data nodes orbit and stay upright.",
  },
  demos: [
    {
      name: "Default",
      code: `<EnrichmentOrbit />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <EnrichmentOrbit />
        </div>
      ),
    },
    {
      name: "Custom nodes",
      code: `<EnrichmentOrbit
  center={{ name: 'Enricher' }}
  nodes={[{ name: 'CRM' }, { name: 'Billing' }, { name: 'Support' }]}
/>`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <EnrichmentOrbit
            center={{ name: 'Enricher' }}
            nodes={[{ name: 'CRM' }, { name: 'Billing' }, { name: 'Support' }]}
          />
        </div>
      ),
    },
  ],
};

export default demo;
