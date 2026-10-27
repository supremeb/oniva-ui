import type { DemoModule } from '../../internal/demo';
import { Boxes } from 'lucide-react';
import { IntegrationBeam } from './IntegrationBeam';

const demo: DemoModule = {
  meta: {
    title: "Integration beam",
    slug: "integration-beam",
    category: 'Illustrations',
    description: "Your product between the tools it connects. Light pulses flow along curved beams; hover or focus a tool to spotlight it and press it to pause its beam.",
  },
  demos: [
    {
      name: "Default",
      code: `<IntegrationBeam />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <IntegrationBeam />
        </div>
      ),
    },
    {
      name: "Custom tools",
      code: `<IntegrationBeam
  center={{ name: 'Relay', icon: <Boxes /> }}
  left={[{ name: 'Forms' }, { name: 'Billing' }]}
  right={[{ name: 'CRM' }, { name: 'Warehouse' }, { name: 'Alerts' }]}
/>`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <IntegrationBeam
            center={{ name: 'Relay', icon: <Boxes /> }}
            left={[{ name: 'Forms' }, { name: 'Billing' }]}
            right={[{ name: 'CRM' }, { name: 'Warehouse' }, { name: 'Alerts' }]}
          />
        </div>
      ),
    },
  ],
};

export default demo;
