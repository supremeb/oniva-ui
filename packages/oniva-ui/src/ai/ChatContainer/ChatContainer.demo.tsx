import type { DemoModule } from '../../internal/demo';
import { ChatContainer } from './ChatContainer';
import { Message } from '../Message';
import { AiChatDemo } from '../../internal/ai-demo-chat';

const demo: DemoModule = {
  meta: {
    title: 'Chat Container',
    slug: 'chat-container',
    category: 'AI & Agent',
    description: 'Scrollable message log that follows new content and offers a jump-to-latest button.',
  },
  demos: [
    {
      name: 'Basic',
      code: `<ChatContainer style={{ height: 320 }}>…messages…</ChatContainer>`,
      Component: () => (
        <div style={{ height: 320, width: '100%', maxWidth: 640, border: '1px solid #ebebeb', borderRadius: 16 }}>
        <ChatContainer>
          {Array.from({ length: 6 }, (_, i) => (
            <Message key={i} role={i % 2 ? 'assistant' : 'user'} name={i % 2 ? 'Oniva' : 'Bala'}>
              {i % 2 ? 'Revenue by segment is ready.' : `Question ${Math.ceil((i + 1) / 2)}: how did Q3 compare?`}
            </Message>
          ))}
        </ChatContainer>
        </div>
      ),
    },
    {
      name: 'Agent conversation',
      code: `// Scripted multi-turn chat: thinking → plan → tool calls → web search → streamed Markdown answer with citations.
<ChatContainer>
  <Message role="user">Analyze Q3 revenue by segment…</Message>
  <Message role="assistant">
    <AgentThinking isThinking />
    <AgentProgress items={items} />
    <ToolCallCard name="query_warehouse" … />
    <WebSearchTrail queries={queries} sources={sources} />
    <ResponseStream text={answer} render={(t) => <Markdown>{t}</Markdown>} />
    <FeedbackBar />
  </Message>
</ChatContainer>
<Composer isStreaming models={models} />`,
      Component: () => <AiChatDemo />,
    },
  ],
};

export default demo;
