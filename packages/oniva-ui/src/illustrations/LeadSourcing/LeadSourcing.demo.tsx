import type { DemoModule } from '../../internal/demo';
import { Radar, Sparkles, Users } from 'lucide-react';
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
    { name: 'Outreach bot', icon: <Sparkles /> },
    { name: 'Directory', icon: <Radar /> },
    { name: 'Network', icon: <Users /> },
  ]}
/>`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <LeadSourcing
            items={[
              { name: 'Outreach bot', icon: <Sparkles /> },
              { name: 'Directory', icon: <Radar /> },
              { name: 'Network', icon: <Users /> },
            ]}
          />
        </div>
      ),
    },
  ],
};

export default demo;
