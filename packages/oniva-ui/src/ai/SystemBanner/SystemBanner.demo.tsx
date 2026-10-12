import type { DemoModule } from '../../internal/demo';
import { SystemBanner } from './SystemBanner';

const demo: DemoModule = {
  meta: {
    title: 'System Banner',
    slug: 'system-banner',
    category: 'AI & Agent',
    description: 'Inline notices in a conversation: limits, context, connectivity.',
  },
  demos: [
    {
      name: 'Tones',
      code: `<SystemBanner tone="warning" actionLabel="Upgrade">You have used 93% of your weekly limit.</SystemBanner>`,
      Component: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 560 }}>
          <SystemBanner tone="info">Earlier messages were summarized to free up context.</SystemBanner>
          <SystemBanner tone="warning" actionLabel="Upgrade" onDismiss={() => {}}>
            You have used 93% of your weekly limit. Resets Fri 9:00 AM.
          </SystemBanner>
          <SystemBanner tone="danger" actionLabel="Retry">The warehouse connector timed out.</SystemBanner>
          <SystemBanner tone="success">Report exported to Q3-revenue.xlsx.</SystemBanner>
        </div>
      ),
    },
  ],
};

export default demo;
