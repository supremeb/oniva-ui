import type { DemoModule } from '../../internal/demo';
import { ToolApproval } from './ToolApproval';

const demo: DemoModule = {
  meta: {
    title: 'Tool approval',
    slug: 'tool-approval',
    category: 'AI & Agent',
    description: 'Approve, deny or always-allow a tool call. Risk badge, preview, shortcuts and a pausing countdown, then it morphs into a result row.',
  },
  demos: [
    {
      name: 'Compact row in a chat',
      code: `<ToolApproval variant="row" toolName="email.send" description="Send campaign email" />`,
      Component: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 440, width: '100%' }}>
          <div style={{ alignItems: 'center', display: 'flex', gap: 10 }}>
            <span aria-hidden="true" style={{ alignItems: 'center', background: 'var(--oniva-color-text)', borderRadius: 999, color: 'var(--oniva-color-surface)', display: 'inline-flex', flexShrink: 0, fontSize: 14, height: 28, justifyContent: 'center', width: 28 }}>✦</span>
            <span style={{ background: 'var(--oniva-color-surface-inset)', borderRadius: 16, color: 'var(--oniva-color-text)', fontSize: 14, padding: '8px 14px' }}>I drafted the October newsletter. Ready to send?</span>
          </div>
          <ToolApproval variant="row" toolName="email.send" description="Send campaign email" />
        </div>
      ),
    },
    {
      name: 'Merge a pull request',
      code: `<ToolApproval
  toolName="repo.merge_pull_request"
  description="Merge pull request #482 into main?"
  risk="medium"
  details={[{ label: 'Repository', value: 'acme/web' }, { label: 'Checks', value: '14 of 14 passed' }]}
  args={{ repo: 'acme/web', number: 482, method: 'squash' }}
  result="Merged #482 into main"
/>`,
      Component: () => (
        <ToolApproval
          toolName="repo.merge_pull_request"
          description="Merge pull request #482 into main?"
          risk="medium"
          details={[
            { label: 'Repository', value: 'acme/web' },
            { label: 'Checks', value: '14 of 14 passed' },
          ]}
          args={{ repo: 'acme/web', number: 482, method: 'squash' }}
          result="Merged #482 into main"
        />
      ),
    },
    {
      name: 'Expires on its own',
      code: `<ToolApproval
  toolName="billing.refund_charge"
  description="Refund $184.00 to Maya Chen?"
  risk="high"
  expiresIn={45}
  onDeny={({ reason }) => log(reason)}
/>`,
      Component: () => (
        <ToolApproval
          toolName="billing.refund_charge"
          description="Refund $184.00 to Maya Chen?"
          risk="high"
          expiresIn={45}
          details={[
            { label: 'Customer', value: 'Maya Chen' },
            { label: 'Amount', value: '$184.00' },
            { label: 'Reversible', value: 'No' },
          ]}
        />
      ),
    },
    {
      name: 'Query warehouse',
      code: `<ToolApproval toolName="warehouse.query" description="Run a read-only query on deals?" risk="low" args={{ table: 'deals', limit: 500 }} />`,
      Component: () => <ToolApproval toolName="warehouse.query" description="Run a read-only query on deals?" risk="low" args={{ table: 'deals', limit: 500 }} result="412 rows returned" />,
    },
  ],
};

export default demo;
