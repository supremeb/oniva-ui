import type { DemoModule } from '../../internal/demo';
import { Button } from '../../components/Button';
import { AgentCard } from './AgentCard';

const demo: DemoModule = {
  meta: {
    title: 'Agent card',
    slug: 'agent-card',
    category: 'AI & Agent',
    description: 'Agent profile card with avatar, role, model, tool chips and run stats.',
  },
  demos: [
    {
      name: 'Working agent',
      code: `<AgentCard name="Invoice Reconciler" role="Finance operations" status="working" model="Claude Sonnet 4.5" tools={['NetSuite', 'Gmail']} stats={[...]} />`,
      Component: () => (
        <div style={{ maxWidth: 380, width: '100%' }}>
          <AgentCard
            name="Invoice Reconciler"
            role="Finance operations"
            description="Matches vendor invoices against purchase orders and flags variances over 2%."
            status="working"
            model="Claude Sonnet 4.5"
            tools={['NetSuite', 'Gmail', 'Sheets']}
            stats={[
              { label: 'Runs', value: '1,284' },
              { label: 'Success', value: '97.4%' },
              { label: 'Avg cost', value: '$0.042' },
            ]}
            actions={
              <>
                <Button size="sm" variant="secondary">Logs</Button>
                <Button size="sm">Open</Button>
              </>
            }
          />
        </div>
      ),
    },
    {
      name: 'Waiting for approval',
      code: `<AgentCard name="Compliance Reviewer" role="Policy checks" status="waiting" />`,
      Component: () => (
        <div style={{ maxWidth: 380, width: '100%' }}>
          <AgentCard
            name="Compliance Reviewer"
            role="Policy checks"
            status="waiting"
            model="GPT-5"
            tools={['Confluence']}
            stats={[
              { label: 'Runs', value: '312' },
              { label: 'Success', value: '99.1%' },
              { label: 'Avg cost', value: '$0.11' },
            ]}
          />
        </div>
      ),
    },
  ],
};

export default demo;
