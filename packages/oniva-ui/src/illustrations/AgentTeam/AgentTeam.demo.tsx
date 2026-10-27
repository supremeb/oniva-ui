import type { DemoModule } from '../../internal/demo';
import { AgentTeam } from './AgentTeam';

const demo: DemoModule = {
  meta: {
    title: "Agent team illustration",
    slug: "agent-team",
    category: 'Illustrations',
    description: "A prompt types itself and branches into three agents, each with a role and the tools it uses. Pauses off-screen and shows the finished team under reduced motion.",
  },
  demos: [
    {
      name: "Default",
      code: `<AgentTeam />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <AgentTeam />
        </div>
      ),
    },
    {
      name: "Custom prompt and team",
      code: `<AgentTeam
  prompt="Set up a support desk for the new product"
  members={[
    { role: 'Triage', name: 'Iris', tools: [{ name: 'Inbox' }, { name: 'Tags' }] },
    { role: 'Resolver', name: 'Juno', tools: [{ name: 'Wiki' }, { name: 'Chat' }] },
    { role: 'Escalation', name: 'Rhea', tools: [{ name: 'Pager' }] },
  ]}
/>`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <AgentTeam
            prompt="Set up a support desk for the new product"
            members={[
              { role: 'Triage', name: 'Iris', tools: [{ name: 'Inbox' }, { name: 'Tags' }] },
              { role: 'Resolver', name: 'Juno', tools: [{ name: 'Wiki' }, { name: 'Chat' }] },
              { role: 'Escalation', name: 'Rhea', tools: [{ name: 'Pager' }] },
            ]}
          />
        </div>
      ),
    },
  ],
};

export default demo;
