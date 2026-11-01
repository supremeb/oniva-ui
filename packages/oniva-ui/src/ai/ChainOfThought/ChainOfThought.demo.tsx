import { RotateCcwIcon } from '../../icons/IconSet';
import { useCallback, useEffect, useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../../components/Button';
import { ChainOfThought, type ChainOfThoughtStep } from './ChainOfThought';

const svg = (a: string, b: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="192" height="128"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="192" height="128" fill="url(#g)"/></svg>`)}`;

const steps: ChainOfThoughtStep[] = [
  {
    id: 's1',
    label: 'Read the diff for PR #482',
    status: 'complete',
    description: '6 files changed, +214 / −58. Touches retry.ts and the queue consumer.',
  },
  {
    id: 's2',
    label: 'Search for backoff best practices',
    status: 'complete',
    results: [
      { title: 'Exponential backoff and jitter', url: 'https://docs.northwind.example/queues/timeouts-retries-and-backoff-with-jitter' },
      { title: 'Webhook retry policies', url: 'https://docs.northwind.example/webhooks' },
    ],
  },
  {
    id: 's3',
    label: 'Compare queue latency before and after',
    status: 'active',
    description: 'Rendering p95 latency charts from the staging traces.',
    images: [
      { src: svg('#c7d2fe', '#a5b4fc'), alt: 'p95 latency before the change' },
      { src: svg('#bbf7d0', '#86efac'), alt: 'p95 latency after the change' },
    ],
  },
  { id: 's4', label: 'Write review summary', status: 'pending' },
];

/** The same steps, released one at a time like a real agent run. */
const script: Omit<ChainOfThoughtStep, 'status'>[] = [
  { id: 'l1', label: 'Read the diff for PR #482', description: '6 files changed, +214 / −58. Touches retry.ts and the queue consumer.' },
  {
    id: 'l2',
    label: 'Search for backoff best practices',
    results: [
      { title: 'Exponential backoff and jitter', url: 'https://docs.northwind.example/queues/timeouts-retries-and-backoff-with-jitter' },
      { title: 'Webhook retry policies', url: 'https://docs.northwind.example/webhooks' },
    ],
  },
  { id: 'l3', label: 'Compare queue latency before and after', description: 'p95 dropped from 420ms to 180ms; the retry storm on timeout is gone.' },
  { id: 'l4', label: 'Write review summary', description: 'Approve with one nit: cap the jitter at 30 seconds.' },
];

/** Drives the script: step n becomes active, then complete, and the next one appears. Returns the live list. */
function useLiveRun() {
  const [tick, setTick] = useState(0);
  const total = script.length * 2;
  useEffect(() => {
    if (tick >= total) return;
    const id = setTimeout(() => setTick((t) => t + 1), tick === 0 ? 400 : 1500);
    return () => clearTimeout(id);
  }, [tick, total]);
  const done = Math.floor((tick + 1) / 2);
  const live: ChainOfThoughtStep[] = script.slice(0, Math.floor(tick / 2) + 1).map((s, i) => ({
    ...s,
    status: i < done ? 'complete' : 'active',
  }));
  return { live, isStreaming: tick < total, replay: useCallback(() => setTick(0), []) };
}

function LiveRun() {
  const { live, isStreaming, replay } = useLiveRun();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start', minHeight: 300 }}>
      <ChainOfThought steps={live} isStreaming={isStreaming} durationSeconds={7} />
      <Button size="sm" variant="secondary" onPress={replay} isDisabled={isStreaming}>
        <RotateCcwIcon size={14} aria-hidden="true" /> Replay
      </Button>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Chain of thought',
    slug: 'chain-of-thought',
    category: 'AI & Agent',
    description: 'Collapsible timeline of reasoning steps with status dots, sources and images. Streams live: new steps rise in, dots draw their check.',
  },
  demos: [
    {
      name: 'Live run',
      code: `const { steps, isStreaming } = useAgentRun();

<ChainOfThought steps={steps} isStreaming={isStreaming} durationSeconds={7} autoCollapse />`,
      Component: LiveRun,
    },
    {
      name: 'Code review agent',
      code: `<ChainOfThought steps={steps} />`,
      Component: () => <ChainOfThought steps={steps} />,
    },
    {
      name: 'Collapsed',
      code: `<ChainOfThought steps={steps} defaultOpen={false} title="4 steps" />`,
      Component: () => <ChainOfThought steps={steps} defaultOpen={false} title="4 steps" />,
    },
  ],
};

export default demo;
