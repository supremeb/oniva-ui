import type { DemoModule } from '../../internal/demo';
import { IntegrationPicker, type Integration } from './IntegrationPicker';

const integrations: Integration[] = [
  {
    id: 'docs',
    name: 'Docs Hub',
    category: 'Knowledge',
    description: 'Keep agent memory in step with your team documents.',
    features: ['Two-way page sync', 'Search across workspaces', 'Citations back to the source page'],
    domain: 'docshub.example',
    connected: true,
  },
  {
    id: 'warehouse',
    name: 'Warehouse',
    category: 'Data',
    description: 'Query tables and schedule reports without leaving the chat.',
    features: ['Read-only SQL access', 'Scheduled exports', 'Column-level permissions'],
    domain: 'warehouse.example',
    connected: true,
  },
  {
    id: 'mail',
    name: 'Mail Relay',
    category: 'Messaging',
    description: 'Let agents triage the inbox and draft replies for your approval.',
    features: ['Thread summaries', 'Drafts that wait for review', 'Label rules'],
  },
  {
    id: 'crm',
    name: 'CRM Core',
    category: 'Sales',
    description: 'Log calls, update deals and surface stale accounts.',
    features: ['Deal and contact sync', 'Activity logging', 'Stale-account alerts'],
  },
  {
    id: 'tickets',
    name: 'Ticket Desk',
    category: 'Support',
    description: 'Route and answer support tickets with full customer context.',
    features: ['Auto-tagging', 'Suggested replies', 'Escalation rules'],
    domain: 'ticketdesk.example',
    connected: true,
  },
  {
    id: 'calendar',
    name: 'Calendar Sync',
    category: 'Scheduling',
    description: 'Find meeting times and prepare briefs before each call.',
    features: ['Availability lookup', 'Pre-meeting briefs'],
  },
];

const wrap = { width: '100%', maxWidth: 760 } as const;

const demo: DemoModule = {
  meta: {
    title: 'Integration picker',
    slug: 'integration-picker',
    category: 'Navigation',
    description:
      'Search and pick a service, then switch it on. Groups Connected and Available, with the pick shown on two neutral monogram tiles.',
  },
  demos: [
    {
      name: 'Integrations page',
      code: `<IntegrationPicker
  integrations={integrations}
  appName="Oniva"
  onBack={() => setPage('root')}
  onToggle={(id, connected) => save(id, connected)}
  onExplore={(id) => navigate(id)}
/>`,
      Component: () => (
        <div style={wrap}>
          <IntegrationPicker integrations={integrations} appName="Oniva" onBack={() => undefined} onToggle={() => undefined} onExplore={() => undefined} />
        </div>
      ),
    },
    {
      name: 'With back button',
      code: `<IntegrationPicker integrations={integrations} defaultSelected="mail" onBack={() => setPage('root')} />`,
      Component: () => (
        <div style={wrap}>
          <IntegrationPicker integrations={integrations} defaultSelected="mail" onBack={() => undefined} />
        </div>
      ),
    },
  ],
};

export default demo;
