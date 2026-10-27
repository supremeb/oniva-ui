import type { DemoModule } from '../../internal/demo';
import { ScreenFrame } from '../../internal/s1-frame';
import { SettingsBilling } from './SettingsBilling';

const demo: DemoModule = {
  meta: {
    title: 'Settings and billing screen',
    slug: 'settings-billing',
    category: 'Screens',
    description:
      'Settings page with General, Members, Billing and API keys tabs: usage meters, payment method, plan comparison with a yearly switch and an invoice table.',
  },
  demos: [
    {
      name: 'Billing tab',
      code: `<ScreenFrame>
  <SettingsBilling defaultTab="Billing" workspace="Northwind Labs" onNavigate={(label) => router.push(label)} />
</ScreenFrame>`,
      Component: () => (
        <ScreenFrame>
          <SettingsBilling defaultTab="Billing" workspace="Northwind Labs" />
        </ScreenFrame>
      ),
    },
    {
      name: 'Members tab',
      code: `<ScreenFrame>
  <SettingsBilling defaultTab="Members" workspace="Northwind Labs" />
</ScreenFrame>`,
      Component: () => (
        <ScreenFrame>
          <SettingsBilling defaultTab="Members" workspace="Northwind Labs" />
        </ScreenFrame>
      ),
    },
  ],
};
export default demo;
