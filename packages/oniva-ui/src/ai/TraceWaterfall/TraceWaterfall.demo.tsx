import { Database, FileText, GitBranch, Globe, Layout, Search } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Button } from '../../components/Button';
import type { DemoModule } from '../../internal/demo';
import { TraceWaterfall, type TraceSpan } from './TraceWaterfall';

const ico = (el: ReactNode) => el;
const finished: TraceSpan = {
  id: 'run', name: 'Orchestrator', kind: 'agent', status: 'done', start: 0, end: 22800, detail: 'Atlas 2', input: 'Launch the new pricing page by Friday',
  children: [
    { id: 'plan', name: 'Plan the launch', kind: 'llm', model: 'Atlas 2', detail: 'Atlas 2', status: 'done', start: 900, end: 7800, tokensIn: 3240, tokensOut: 880, cost: 0.115, input: 'Goal: launch the new pricing page by Friday.', output: '1. Audit current copy\n2. Draft tiers\n3. Review with legal' },
    { id: 'research', name: 'Researcher', kind: 'subagent', status: 'done', start: 8000, end: 22000, detail: 'Nova Pro', children: [
      { id: 's1', name: 'web_search', kind: 'tool', detail: 'competitor plans', icon: ico(<Search size={12} />), status: 'done', start: 8200, end: 13600, cost: 0.005 },
      { id: 's2', name: 'web_search', kind: 'tool', detail: 'tier benchmarks', icon: ico(<Search size={12} />), status: 'done', start: 8600, end: 15800, cost: 0.005 },
      { id: 's3', name: 'Query plan usage', kind: 'tool', detail: 'warehouse', icon: ico(<Database size={12} />), status: 'done', start: 9000, end: 12500 },
      { id: 's4', name: 'Read review sites', kind: 'tool', detail: '12 pages', icon: ico(<Globe size={12} />), status: 'done', start: 14400, end: 22000 },
    ] },
    { id: 'copy', name: 'Writer', kind: 'subagent', status: 'done', start: 10000, end: 21000, detail: 'Nova Pro', cost: 0.04, children: [
      { id: 'draft', name: 'Read brand voice', kind: 'tool', detail: 'Docs', icon: ico(<FileText size={12} />), status: 'done', start: 10200, end: 13800 },
      { id: 'frames', name: 'Read pricing frames', kind: 'tool', detail: 'Design', icon: ico(<Layout size={12} />), status: 'done', start: 10900, end: 16000 },
      { id: 'check', name: 'check_claims', kind: 'tool', status: 'failed', start: 16100, end: 16900, error: '3 claims have no source' },
      { id: 'redo', name: 'Draft plan copy', kind: 'llm', model: 'Nova Pro', detail: 'Nova Pro', status: 'done', start: 17000, end: 21000, tokensIn: 5600, tokensOut: 1900, cost: 0.04 },
    ] },
    { id: 'coder', name: 'Coder', kind: 'subagent', status: 'done', start: 15500, end: 22600, detail: 'Lumen Fast', children: [
      { id: 'branch', name: 'Create branch', kind: 'tool', detail: 'Repo', icon: ico(<GitBranch size={12} />), status: 'done', start: 15600, end: 17700 },
      { id: 'page', name: 'Write pricing page', kind: 'llm', model: 'Lumen Fast', detail: 'Lumen Fast', status: 'done', start: 18000, end: 22600, tokensIn: 4100, tokensOut: 2300, cost: 0.06 },
    ] },
  ],
};

function Live() {
  const startedAt = useMemo(() => Date.now() - 9500, []);
  const root: TraceSpan = {
    id: 'run', name: 'Research agent', kind: 'agent', status: 'running', start: 0, input: 'Summarise the Q3 churn drivers',
    children: [
      { id: 'a', name: 'Plan', kind: 'llm', model: 'Lumen Fast', detail: 'Lumen Fast', status: 'done', start: 400, end: 3100, tokensIn: 1800, tokensOut: 420, cost: 0.012 },
      { id: 'b', name: 'query_warehouse', kind: 'tool', detail: 'churn by plan', status: 'done', start: 3200, end: 6900 },
      { id: 'c', name: 'Write summary', kind: 'llm', model: 'Quill Reasoner', detail: 'Quill Reasoner', status: 'running', start: 7000, tokensIn: 6400, tokensOut: 300, cost: 0.09 },
    ],
  };
  return <TraceWaterfall root={root} startedAt={startedAt} title="Live run" />;
}

function Switch() {
  const [which, setWhich] = useState<'a' | 'b'>('a');
  const second: TraceSpan = {
    id: 'run-b', name: 'Support agent', kind: 'agent', status: 'done', start: 0, end: 9000, input: 'Refund order #4821',
    children: [
      { id: 'b1', name: 'lookup_order', kind: 'tool', status: 'done', start: 300, end: 2100 },
      { id: 'b2', name: 'Draft reply', kind: 'llm', model: 'Atlas 2', detail: 'Atlas 2', status: 'done', start: 2200, end: 7400, tokensIn: 2100, tokensOut: 640, cost: 0.06 },
    ],
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div><Button size="sm" variant="secondary" onPress={() => setWhich(which === 'a' ? 'b' : 'a')}>Switch run</Button></div>
      <TraceWaterfall root={which === 'a' ? finished : second} title="Switching runs" />
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Trace waterfall',
    slug: 'trace-waterfall',
    category: 'AI & Agent',
    description: 'Where the time and money of an agent run go: LLM calls, tool calls and sub-agents as bars on a live timeline, with the slowest call marked.',
  },
  demos: [
    {
      name: 'Finished run',
      code: `<TraceWaterfall root={run} />`,
      Component: () => <TraceWaterfall root={finished} />,
    },
    {
      name: 'Live run',
      code: `<TraceWaterfall root={run} startedAt={startedAt} title="Live run" />`,
      Component: Live,
    },
    {
      name: 'Switch run',
      code: `<TraceWaterfall root={which === 'a' ? runA : runB} />`,
      Component: Switch,
    },
  ],
};

export default demo;
