import type { DemoModule } from '../../internal/demo';
import { AgentChatScreen } from './AgentChat';

const frame = {
  border: '1px solid var(--oniva-color-border)',
  borderRadius: 16,
  height: 720,
  overflow: 'hidden',
  position: 'relative',
  transform: 'translateZ(0)',
  width: '100%',
} as const;

const demo: DemoModule = {
  meta: {
    title: 'Agent chat screen',
    slug: 'agent-chat-screen',
    category: 'Screens',
    description: 'Chat with an orchestrating agent, the agents at work and a brief to fill in beside it. Stacks to one column in narrow containers.',
  },
  demos: [
    {
      name: 'Default',
      code: `<AgentChatScreen />`,
      Component: () => (
        <div style={frame}>
          <AgentChatScreen headingLevel={2} />
        </div>
      ),
    },
    {
      name: 'Custom workspace',
      code: `<AgentChatScreen
  workspace="Fieldstone Co"
  user={{ name: 'Sam Okafor' }}
  onSend={(text) => console.log(text)}
  onNavigate={(label) => console.log(label)}
/>`,
      Component: () => (
        <div style={frame}>
          <AgentChatScreen
            headingLevel={2}
            workspace="Fieldstone Co"
            user={{ name: 'Sam Okafor' }}
            onSend={(text) => console.log(text)}
            onNavigate={(label) => console.log(label)}
          />
        </div>
      ),
    },
  ],
};

export default demo;
