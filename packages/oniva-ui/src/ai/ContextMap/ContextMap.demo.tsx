import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { ContextMap, type ContextBlock } from './ContextMap';

const blocks: ContextBlock[] = [
  { id: 'system', label: 'System prompt', kind: 'system', tokens: 6200 },
  { id: 'tools', label: 'Tool definitions', kind: 'tools', tokens: 14800 },
  { id: 'memory', label: 'Project memory', kind: 'memory', tokens: 5400, detail: '12 notes' },
  { id: 'spec', label: 'checkout.spec.ts', kind: 'file', tokens: 8200, detail: 'Read at 0:09' },
  { id: 'cart', label: 'cart.ts', kind: 'file', tokens: 11300, detail: 'Read at 0:41' },
  { id: 'chat', label: 'Chat', kind: 'chat', tokens: 41000 },
  { id: 'run', label: 'Test run · 20×', kind: 'result', tokens: 22400 },
];

const liveBlocks: ContextBlock[] = [
  { id: 'system', label: 'System prompt', kind: 'system', tokens: 6200 },
  { id: 'tools', label: 'Tool definitions', kind: 'tools', tokens: 14800 },
  { id: 'memory', label: 'Project memory', kind: 'memory', tokens: 9400, detail: '12 notes' },
  { id: 'spec', label: 'checkout.spec.ts', kind: 'file', tokens: 8200, detail: 'Read at 0:09' },
  { id: 'pay', label: 'payment.ts', kind: 'file', tokens: 17600, detail: 'Read at 0:41' },
  { id: 'chat', label: 'Chat', kind: 'chat', tokens: 10900 },
];

const before: ContextBlock[] = [
  ...blocks.slice(0, 5),
  { id: 'turns', label: 'Turns 1–18', kind: 'chat', tokens: 52000 },
  { id: 'stale', label: 'Old test run', kind: 'result', tokens: 9400 },
  { id: 'chat', label: 'Chat', kind: 'chat', tokens: 41000 },
  { id: 'run', label: 'Test run · 20×', kind: 'result', tokens: 22400 },
];
const after: ContextBlock[] = [...blocks.slice(0, 5), { id: 'sum', label: 'Summary', kind: 'summary', tokens: 6100 }, ...blocks.slice(5)];

function Compaction() {
  const [view, setView] = useState<'before' | 'after'>('after');
  return (
    <ContextMap
      blocks={after}
      limit={185_000}
      model="Atlas 2"
      view={view}
      onViewChange={setView}
      compaction={{ before, summarized: ['turns'], dropped: ['stale'], summary: 'Turns 1–18 became a 6.1K summary.' }}
    />
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Context map',
    slug: 'context-map',
    category: 'AI & Agent',
    description: 'What fills an agent context window as a treemap. Tiles glide as it grows, free space is dashed, and compaction can be compared before and after.',
  },
  demos: [
    {
      name: 'Live context',
      code: `<ContextMap blocks={blocks} limit={200_000} model="Atlas 2" />`,
      Component: () => <ContextMap blocks={liveBlocks} limit={200_000} model="Checkout fixer" compaction={null} />,
    },
    {
      name: 'Before and after compaction',
      code: `<ContextMap
  blocks={after}
  limit={200_000}
  view={view}
  onViewChange={setView}
  compaction={{ before, summarized: ['turns'] }}
/>`,
      Component: Compaction,
    },
  ],
};

export default demo;
