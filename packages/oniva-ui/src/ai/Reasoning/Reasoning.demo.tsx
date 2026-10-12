import { useEffect, useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../../components/Button';
import { Reasoning } from './Reasoning';

const TRACE = `Reviewing PR #482 "Retry failed webhooks with backoff".
- retry.ts: delay doubles but never caps, a 12th attempt would wait ~68 min.
- The queue consumer ack()s before the handler resolves, so a crash drops the job.
Plan: flag the missing cap and move ack() after the handler.`;

function Streaming() {
  const [run, setRun] = useState(0);
  const [streaming, setStreaming] = useState(true);
  useEffect(() => {
    setStreaming(true);
    const id = setTimeout(() => setStreaming(false), 4000);
    return () => clearTimeout(id);
  }, [run]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <Reasoning isStreaming={streaming}>{TRACE}</Reasoning>
      <Button size="sm" variant="secondary" onPress={() => setRun((r) => r + 1)}>
        Replay
      </Button>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Reasoning',
    slug: 'reasoning',
    category: 'AI & Agent',
    description: 'Collapsible model reasoning that opens while streaming and auto-closes with a duration.',
  },
  demos: [
    {
      name: 'Streaming then collapsed',
      code: `<Reasoning isStreaming={streaming}>{trace}</Reasoning>`,
      Component: Streaming,
    },
    {
      name: 'Finished',
      code: `<Reasoning duration={12} defaultOpen>Checked the Q3 revenue table against the ledger export…</Reasoning>`,
      Component: () => (
        <Reasoning duration={12} defaultOpen>
          Checked the Q3 revenue table against the ledger export. 3 of 214 rows differ by under $40 (FX rounding), so the
          totals reconcile.
        </Reasoning>
      ),
    },
  ],
};

export default demo;
