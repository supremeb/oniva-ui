import type { DemoModule } from '../../internal/demo';
import { Avatar } from '../../components/Avatar';
import { aiStyles } from '../../internal/ai-styles';
import { TypingIndicator } from './TypingIndicator';
import * as stylex from '@stylexjs/stylex';

const demo: DemoModule = {
  meta: {
    title: 'Typing indicator',
    slug: 'typing-indicator',
    category: 'AI & Agent',
    description: 'Three-dot wave for an assistant that is composing a reply.',
  },
  demos: [
    {
      name: 'Default',
      code: `<TypingIndicator />`,
      Component: () => <TypingIndicator />,
    },
    {
      name: 'In a message bubble',
      code: `<div className="bubble"><TypingIndicator label="Analyst is typing" /></div>`,
      Component: () => (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Avatar name="Data Analyst" size="sm" />
          <div {...stylex.props(aiStyles.panel)} style={{ padding: '10px 14px' }}>
            <TypingIndicator label="Data analyst is typing" />
          </div>
        </div>
      ),
    },
  ],
};

export default demo;
