import type { DemoModule } from '../../internal/demo';
import { RadarIcon, SparklesIcon, UsersIcon } from '../../icons/IconSet';
import { LeadSourcing } from './LeadSourcing';

const demo: DemoModule = {
  meta: {
    title: "Lead sourcing illustration",
    slug: "lead-sourcing",
    category: 'Illustrations',
    description: "An assistant tile linked to two lead sources, with a shine that runs along the connection and rests between passes.",
  },
  demos: [
    {
      name: "Default",
      code: `<LeadSourcing />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <LeadSourcing />
        </div>
      ),
    },
    {
      name: "Custom tools",
      code: `<LeadSourcing
  items={[
    { name: 'Outreach bot', icon: <SparklesIcon /> },
    { name: 'Directory', icon: <RadarIcon /> },
    { name: 'Network', icon: <UsersIcon /> },
  ]}
/>`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <LeadSourcing
            items={[
              { name: 'Outreach bot', icon: <SparklesIcon /> },
              { name: 'Directory', icon: <RadarIcon /> },
              { name: 'Network', icon: <UsersIcon /> },
            ]}
          />
        </div>
      ),
    },
  ],
};

export default demo;
