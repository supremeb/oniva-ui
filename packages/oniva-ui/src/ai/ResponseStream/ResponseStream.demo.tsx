import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../../components/Button';
import { ResponseStream } from './ResponseStream';

const TEXT =
  'Q3 revenue landed at $4.82M, up 14.2% quarter over quarter. Enterprise renewals carried most of the growth, while self-serve churn ticked up slightly in September.';

const demo: DemoModule = {
  meta: {
    title: 'Response Stream',
    slug: 'response-stream',
    category: 'AI & Agent',
    description: 'Streams text in progressively. Pass a render function to stream into Markdown.',
  },
  demos: [
    {
      name: 'Plain text',
      code: `<ResponseStream key={run} text={text} />`,
      Component: function Plain() {
        const [run, setRun] = useState(0);
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start', maxWidth: 520 }}>
            <ResponseStream key={run} text={TEXT} />
            <Button size="sm" variant="secondary" onPress={() => setRun((r) => r + 1)}>
              Replay
            </Button>
          </div>
        );
      },
    },
  ],
};

export default demo;
