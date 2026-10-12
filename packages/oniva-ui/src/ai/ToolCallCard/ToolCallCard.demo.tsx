import type { DemoModule } from '../../internal/demo';
import { ToolCallCard } from './ToolCallCard';

const demo: DemoModule = {
  meta: {
    title: 'Tool call card',
    slug: 'tool-call-card',
    category: 'AI & Agent',
    description:
      'Collapsible record of an agent tool call with status, duration, arguments and result.',
  },
  demos: [
    {
      name: 'States',
      code: `<ToolCallCard name="query_warehouse" args={{ table: 'deals', quarter: 'Q3' }} duration="1.2s">412 rows</ToolCallCard>
<ToolCallCard name="run_python" status="running" />
<ToolCallCard name="send_email" status="error" />`,
      Component: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 520 }}>
          <ToolCallCard
            name="query_warehouse"
            args={{ table: 'deals', quarter: 'Q3' }}
            duration="1.2s"
            defaultExpanded
          >
            {'412 rows · $4,820,310 total\nsegments: enterprise, mid-market, self-serve'}
          </ToolCallCard>
          <ToolCallCard name="run_python" args={{ file: 'q3_revenue.py' }} status="running" />
          <ToolCallCard
            name="send_email"
            args={{ to: 'finance@acme.co' }}
            status="error"
            duration="0.4s"
          >
            SMTP 550: mailbox unavailable
          </ToolCallCard>
        </div>
      ),
    },
  ],
};

export default demo;
