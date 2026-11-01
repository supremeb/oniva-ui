import { RotateCcwIcon } from '../../icons/IconSet';
import { useEffect, useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../../components/Button';
import { SegmentedControl, SegmentedControlItem } from '../../components/SegmentedControl';
import { ThinkingTrace, type ThinkingTraceItem } from './ThinkingTrace';

type Variant = 'steps' | 'reasoning' | 'search' | 'coding';

const traces: Record<Variant, { label: string; items: ThinkingTraceItem[] }> = {
  steps: {
    label: 'Thought for 4 seconds',
    items: [
      { kind: 'step', id: '1', label: 'Reading flavor briefs' },
      { kind: 'step', id: '2', label: 'Scanning supplier lists' },
      { kind: 'step', id: '3', label: 'Comparing tasting notes', detail: '6 flavors' },
      { kind: 'step', id: '4', label: 'Writing the scoop report' },
    ],
  },
  reasoning: {
    label: 'Thought for 4 seconds',
    items: [
      { kind: 'text', id: '1', text: 'Summer demand spikes for stone-fruit flavors, peach and apricot lead.' },
      { kind: 'text', id: '2', text: 'I should check cone inventory before promoting a waffle-bowl special.' },
    ],
  },
  search: {
    label: 'Searched the web',
    items: [
      { kind: 'query', id: '1', query: 'best waffle cone supplier' },
      { kind: 'source', id: '2', title: 'Northwind Cones', url: 'https://cones.northwind.example/wholesale' },
      { kind: 'source', id: '3', title: 'Harbor Supply', url: 'https://harborsupply.example/cones' },
      { kind: 'source', id: '4', title: 'The Cone Works', url: 'https://coneworks.example' },
      { kind: 'more', id: '5', count: 7 },
    ],
  },
  coding: {
    label: 'Ran 3 tools',
    items: [
      { kind: 'tool', id: '1', verb: 'Read', target: 'flavors.ts' },
      { kind: 'tool', id: '2', verb: 'Edit', target: 'ChurnSchedule.tsx', added: 74, removed: 41 },
      { kind: 'tool', id: '3', verb: 'Run', target: 'npm run freeze' },
    ],
  },
};

function Variants() {
  const [variant, setVariant] = useState<Variant>('steps');
  const t = traces[variant];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start', minHeight: 230 }}>
      {/* Re-keyed per variant so each switch replays the open animation. */}
      <ThinkingTrace key={variant} items={t.items} label={t.label} defaultOpen />
      <SegmentedControl size="sm" aria-label="Trace style" value={variant} onChange={(v) => setVariant(v as Variant)}>
        <SegmentedControlItem value="steps">Steps</SegmentedControlItem>
        <SegmentedControlItem value="reasoning">Reasoning</SegmentedControlItem>
        <SegmentedControlItem value="search">Search</SegmentedControlItem>
        <SegmentedControlItem value="coding">Coding</SegmentedControlItem>
      </SegmentedControl>
    </div>
  );
}

const script: ThinkingTraceItem[] = [
  { kind: 'text', id: 's1', text: 'Pistachio is up 23% this month, so it probably leads the report.' },
  { kind: 'query', id: 's2', query: 'stone fruit ice cream trends 2026' },
  { kind: 'source', id: 's3', title: 'Frozen dessert outlook', url: 'https://frozen.northwind.example/outlook' },
  { kind: 'source', id: 's4', title: 'Flavor demand index', url: 'https://flavorindex.example/summer' },
  { kind: 'step', id: 's5', label: 'Drafting the answer' },
];

function Streaming() {
  const [n, setN] = useState(0);
  const running = n < script.length;
  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => setN((x) => x + 1), n === 0 ? 500 : 1300);
    return () => clearTimeout(id);
  }, [n, running]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start', minHeight: 250 }}>
      <ThinkingTrace items={script.slice(0, n)} isStreaming={running} durationSeconds={6} defaultOpen autoCollapse closeDelayMs={1500} />
      <Button size="sm" variant="secondary" isDisabled={running} onPress={() => setN(0)}>
        <RotateCcwIcon size={14} aria-hidden="true" /> Replay
      </Button>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Thinking trace',
    slug: 'thinking-trace',
    category: 'AI & Agent',
    description: 'Expandable trace of what the model did: steps, reasoning, searches with sources, or tool runs. One data shape, four looks.',
  },
  demos: [
    {
      name: 'Steps, reasoning, search, coding',
      code: `<ThinkingTrace
  label="Searched the web"
  defaultOpen
  items={[
    { kind: 'query', id: '1', query: 'best waffle cone supplier' },
    { kind: 'source', id: '2', title: 'Northwind Cones', url: '…' },
    { kind: 'more', id: '3', count: 7 },
  ]}
/>`,
      Component: Variants,
    },
    {
      name: 'Streaming, then collapse',
      code: `<ThinkingTrace items={items} isStreaming={running} durationSeconds={6} defaultOpen autoCollapse />`,
      Component: Streaming,
    },
    {
      name: 'Closed',
      code: `<ThinkingTrace items={items} durationSeconds={4} />`,
      Component: () => <ThinkingTrace items={traces.steps.items} durationSeconds={4} />,
    },
  ],
};

export default demo;
