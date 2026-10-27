import type { DemoModule } from '../../internal/demo';
import { IntegrationFlow } from './IntegrationFlow';

const demo: DemoModule = {
  meta: {
    title: "Integration flow",
    slug: "integration-flow",
    category: 'Illustrations',
    description: "Integration pills rotating along a dashed arc, each beaming its data into a central analysis hub.",
  },
  demos: [
    {
      name: "Default",
      code: `<IntegrationFlow />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <IntegrationFlow />
        </div>
      ),
    },
    {
      name: "Custom hub",
      code: `<IntegrationFlow
  hubLabel="Revenue insights"
  items={[{ name: 'Billing' }, { name: 'CRM' }, { name: 'Support' }, { name: 'Product' }, { name: 'Ads' }, { name: 'Email' }]}
/>`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <IntegrationFlow
            hubLabel="Revenue insights"
            items={[{ name: 'Billing' }, { name: 'CRM' }, { name: 'Support' }, { name: 'Product' }, { name: 'Ads' }, { name: 'Email' }]}
          />
        </div>
      ),
    },
  ],
};

export default demo;
