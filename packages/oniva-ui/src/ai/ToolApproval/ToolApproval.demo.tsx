import type { DemoModule } from '../../internal/demo';
import { ToolApproval } from './ToolApproval';

const demo: DemoModule = {
  meta: {
    title: 'Tool approval',
    slug: 'tool-approval',
    category: 'AI & Agent',
    description: 'Approve, deny or always-allow a tool call, then morph to the result.',
  },
  demos: [
    {
      name: 'Merge a pull request',
      code: `<ToolApproval toolName="github.merge_pull_request" description="Merge PR #482 into main" args={{ repo: 'acme/payments', number: 482, method: 'squash' }} result="Merged #482 into main (squash, 3 commits)." />`,
      Component: () => (
        <ToolApproval
          toolName="github.merge_pull_request"
          description="Merge PR #482 into main"
          args={{ repo: 'acme/payments', number: 482, method: 'squash' }}
          result="Merged #482 into main (squash, 3 commits)."
        />
      ),
    },
    {
      name: 'Query warehouse',
      code: `<ToolApproval toolName="warehouse.run_query" description="Run a read-only SQL query" args={{ sql: 'SELECT …' }} />`,
      Component: () => (
        <ToolApproval
          toolName="warehouse.run_query"
          description="Run a read-only SQL query"
          args={{ sql: 'SELECT plan, COUNT(*) AS accounts FROM subscriptions WHERE status = \'active\' GROUP BY plan', limit: 100 }}
          result="Returned 4 rows in 1.2s."
        />
      ),
    },
  ],
};

export default demo;
