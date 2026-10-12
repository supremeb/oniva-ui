import type { DemoModule } from '../../internal/demo';
import { AgentHandoff } from './AgentHandoff';

const demo: DemoModule = {
  meta: {
    title: 'Agent handoff',
    slug: 'agent-handoff',
    category: 'AI & Agent',
    description: 'Transfer card showing one agent handing a task to another, with reason, context and carried artifacts.',
  },
  demos: [
    {
      name: 'Accepted',
      code: `<AgentHandoff from={{ name: 'Triage Bot' }} to={{ name: 'Billing Specialist' }} reason="..." context="..." carried={[...]} />`,
      Component: () => (
        <div style={{ maxWidth: 480, width: '100%' }}>
          <AgentHandoff
            from={{ name: 'Triage Bot', role: 'Support intake' }}
            to={{ name: 'Billing Specialist', role: 'Refunds & invoices' }}
            reason="Customer requests a $740 refund, which needs finance tool access."
            context="Acme Corp reports a duplicate charge on invoice INV-20418 (Oct 3). Card ending 4242. Customer is on the Scale plan."
            carried={['ticket-4821.json', 'INV-20418.pdf']}
          />
        </div>
      ),
    },
    {
      name: 'Pending',
      code: `<AgentHandoff status="pending" ... />`,
      Component: () => (
        <div style={{ maxWidth: 480, width: '100%' }}>
          <AgentHandoff
            status="pending"
            from={{ name: 'Research Scout' }}
            to={{ name: 'Report Writer' }}
            reason="Source gathering complete; 14 sources ready for drafting."
            carried={['sources.csv']}
          />
        </div>
      ),
    },
  ],
};

export default demo;
