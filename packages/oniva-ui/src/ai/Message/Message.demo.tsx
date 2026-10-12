import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Message } from './Message';

const demo: DemoModule = {
  meta: {
    title: 'Message',
    slug: 'message',
    category: 'AI & Agent',
    description: 'User bubble and assistant message with copy, retry and thumbs actions.',
  },
  demos: [
    {
      name: 'Conversation',
      code: `<Message role="user" name="Bala">…</Message>
<Message role="assistant" name="Oniva" copyText={text} onRetry={retry} onFeedback={setFb} feedback={fb}>…</Message>`,
      Component: function Convo() {
        const [fb, setFb] = useState<'up' | 'down' | null>(null);
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 560 }}>
            <Message role="user" name="Bala" timestamp="10:42 AM">
              Can you analyze Q3 revenue by segment?
            </Message>
            <Message
              role="assistant"
              name="Oniva"
              copyText="Q3 revenue closed at $4.82M."
              onRetry={() => {}}
              onFeedback={setFb}
              feedback={fb}
            >
              Q3 revenue closed at <strong>$4.82M</strong>, up 14.2% quarter over quarter.
              Enterprise drove most of the growth.
            </Message>
          </div>
        );
      },
    },
  ],
};

export default demo;
