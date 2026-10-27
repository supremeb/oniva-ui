import type { DemoModule } from '../../internal/demo';
import { LogoCluster } from './LogoCluster';

const demo: DemoModule = {
  meta: {
    title: "Logo cluster",
    slug: "logo-cluster",
    category: 'Illustrations',
    description: "Your mark on a disc in the middle; logos bounce out and settle around it, then the ring turns slowly with every logo upright.",
  },
  demos: [
    {
      name: "Default",
      code: `<LogoCluster />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <LogoCluster />
        </div>
      ),
    },
    {
      name: "Custom logos",
      code: `<LogoCluster
  mark={{ name: 'Oniva' }}
  logos={[{ name: 'Mail' }, { name: 'Docs' }, { name: 'CRM' }, { name: 'Billing' }, { name: 'Chat' }]}
/>`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <LogoCluster
            mark={{ name: 'Oniva' }}
            logos={[{ name: 'Mail' }, { name: 'Docs' }, { name: 'CRM' }, { name: 'Billing' }, { name: 'Chat' }]}
          />
        </div>
      ),
    },
  ],
};

export default demo;
