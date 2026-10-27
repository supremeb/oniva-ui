import type { DemoModule } from '../../internal/demo';
import { IntegrationSettings } from './IntegrationSettings';

const wrap = { width: '100%', maxWidth: 560 } as const;

const demo: DemoModule = {
  meta: {
    title: 'Integration settings',
    slug: 'integration-settings',
    category: 'Forms',
    description:
      'Settings card for one connected service: on/off switch, API key, validated site address, time zone and a save bar that appears on change.',
  },
  demos: [
    {
      name: 'Storefront connection',
      code: `<IntegrationSettings
  name="Storefront"
  count={128}
  meta="Connected on March 4, 2026 at 09:12"
  defaultValues={{ siteUrl: 'lumen-studio.com', timeZone: '(GMT +01:00) Berlin' }}
  onGenerateKey={() => api.createKey()}
  onSave={(values) => api.saveSettings(values)}
/>`,
      Component: () => (
        <div style={wrap}>
          <IntegrationSettings
            name="Storefront"
            count={128}
            meta="Connected on March 4, 2026 at 09:12"
            defaultValues={{
              siteUrl: 'lumen-studio.com',
              timeZone: '(GMT +01:00) Berlin',
            }}
          />
        </div>
      ),
    },
    {
      name: 'Paused and empty',
      code: `<IntegrationSettings name="Ad account" defaultValues={{ enabled: false }} />`,
      Component: () => (
        <div style={wrap}>
          <IntegrationSettings name="Ad account" meta="Connected on June 12, 2026" defaultValues={{ enabled: false }} />
        </div>
      ),
    },
  ],
};

export default demo;
