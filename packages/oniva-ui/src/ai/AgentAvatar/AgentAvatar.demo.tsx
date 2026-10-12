import type { DemoModule } from '../../internal/demo';
import { AgentAvatar } from './AgentAvatar';

const demo: DemoModule = {
  meta: {
    title: 'Agent avatar',
    slug: 'agent-avatar',
    category: 'AI & Agent',
    description: 'Gradient initials avatar with a status dot; the dot ripples while the agent is working.',
  },
  demos: [
    {
      name: 'Statuses',
      code: `<AgentAvatar name="Research Scout" status="working" />`,
      Component: () => (
        <div style={{ display: 'flex', gap: 16 }}>
          <AgentAvatar name="Research Scout" status="working" />
          <AgentAvatar name="Invoice Reconciler" status="idle" />
          <AgentAvatar name="Compliance Reviewer" status="waiting" />
          <AgentAvatar name="Deploy Bot" status="error" />
        </div>
      ),
    },
    {
      name: 'Sizes',
      code: `<AgentAvatar name="Atlas" size={56} />`,
      Component: () => (
        <div style={{ alignItems: 'center', display: 'flex', gap: 16 }}>
          {[24, 36, 56, 72].map((s) => (
            <AgentAvatar key={s} name="Atlas Ops" size={s} />
          ))}
        </div>
      ),
    },
  ],
};

export default demo;
