import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../../components/Button';
import { ThinkingLoader } from './ThinkingLoader';

const demo: DemoModule = {
  meta: {
    title: 'Thinking loader',
    slug: 'thinking-loader',
    category: 'AI & Agent',
    description: 'A small working pill for AI replies: a ray spinner and a shimmering label that rolls through phases and settles on a check.',
  },
  demos: [
    {
      name: 'Phases',
      code: `<ThinkingLoader phases={['Thinking', 'Searching the web', 'Reading sources', 'Writing response']} loop />`,
      Component: () => <ThinkingLoader loop />,
    },
    {
      name: 'Done toggle',
      code: `const [done, setDone] = useState(false);
<ThinkingLoader isDone={done} doneLabel={(s) => \`Thought for \${s}s\`} />
<Button onPress={() => setDone(!done)}>{done ? 'Restart' : 'Finish'}</Button>`,
      Component: function DoneDemo() {
        const [done, setDone] = useState(false);
        return (
          <div style={{ alignItems: 'center', display: 'flex', gap: 12 }}>
            <ThinkingLoader isDone={done} phases={['Reading the contract', 'Checking clauses']} />
            <Button size="sm" variant="secondary" onPress={() => setDone(!done)}>
              {done ? 'Restart' : 'Finish'}
            </Button>
          </div>
        );
      },
    },
    {
      name: 'Sizes and plain',
      code: `<ThinkingLoader size="sm" phases={['Drafting reply']} />
<ThinkingLoader variant="plain" phases={['Running tool']} />`,
      Component: () => (
        <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <ThinkingLoader size="sm" phases={['Drafting reply']} />
          <ThinkingLoader variant="plain" phases={['Running tool']} />
        </div>
      ),
    },
  ],
};

export default demo;
