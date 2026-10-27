import { useEffect, useState } from 'react';
import { Database, FileText, Globe, Mail, GitBranch, Calendar } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { AgentGraph, type GraphCall, type GraphNode } from './AgentGraph';

const nodes: GraphNode[] = [
  { id: 'lead', kind: 'agent', name: 'Orchestrator', detail: 'Atlas 2', status: 'working', lead: true, cost: 0.31, doing: 'Planning the launch brief' },
  { id: 'research', kind: 'agent', name: 'Researcher', detail: 'Nova Pro', status: 'working', cost: 0.12, doing: 'Comparing five vendors' },
  { id: 'writer', kind: 'agent', name: 'Writer', detail: 'Lumen Fast', status: 'waiting', cost: 0.05, doing: 'Needs sign-off on the claims' },
  { id: 'web', kind: 'tool', name: 'Web search', short: 'Search', detail: 'Public web', icon: <Globe size={16} /> },
  { id: 'docs', kind: 'tool', name: 'Docs', detail: 'Team wiki', icon: <FileText size={16} /> },
  { id: 'wh', kind: 'tool', name: 'Warehouse', short: 'Data', detail: 'Sales tables', icon: <Database size={16} /> },
  { id: 'coder', kind: 'agent', name: 'Coder', detail: 'Quill Reasoner', status: 'working', cost: 0.09, doing: 'Fixing the export script' },
  { id: 'analyst', kind: 'agent', name: 'Analyst', detail: 'Nova Flash', status: 'idle', cost: 0.04 },
  { id: 'mail', kind: 'tool', name: 'Mail', detail: 'Team inbox', icon: <Mail size={16} /> },
  { id: 'git', kind: 'tool', name: 'Repo', detail: 'Repos', icon: <GitBranch size={16} /> },
  { id: 'cal', kind: 'tool', name: 'Calendar', detail: 'Shared', icon: <Calendar size={16} /> },
  { id: 'you', kind: 'user', name: 'You' },
];

function Live() {
  const [calls, setCalls] = useState<GraphCall[]>([]);
  useEffect(() => {
    let i = 0;
    const pairs: [string, string][] = [['lead', 'research'], ['research', 'web'], ['lead', 'writer'], ['writer', 'docs'], ['research', 'wh'], ['lead', 'coder'], ['coder', 'git'], ['lead', 'analyst'], ['analyst', 'wh'], ['writer', 'mail'], ['lead', 'research']];
    const id = window.setInterval(() => {
      const [from, to] = pairs[i % pairs.length]!;
      const callId = `c${i}`;
      const label = `${from} → ${to}`;
      setCalls((c) => [...c.slice(-14), { id: callId, from, to, at: Date.now(), status: 'pending', label }]);
      const n = i;
      window.setTimeout(() => setCalls((c) => c.map((x) => (x.id === `c${n}` ? { ...x, status: n % 5 === 4 ? 'error' : 'ok', ms: 400 + ((n * 137) % 900) } : x))), 900);
      i++;
    }, 1600);
    return () => window.clearInterval(id);
  }, []);
  return <AgentGraph nodes={nodes} calls={calls} edges={[['you', 'lead'], ['lead', 'writer'], ['lead', 'coder'], ['lead', 'analyst'], ['analyst', 'cal']]} />;
}

const demo: DemoModule = {
  meta: {
    title: 'Agent graph',
    slug: 'agent-graph',
    category: 'AI & Agent',
    description: 'Agents and the tools they call as a living network: a pulse per call, busier links thicker, waiting agents flagged.',
  },
  demos: [
    {
      name: 'Live calls',
      code: `<AgentGraph nodes={nodes} calls={calls} edges={[['you', 'lead']]} onSelect={(node) => openLog(node?.id)} />`,
      Component: Live,
    },
    {
      name: 'Static snapshot',
      code: `<AgentGraph nodes={nodes} calls={[]} edges={[['lead', 'research'], ['research', 'web']]} height={380} title="Support crew" />`,
      Component: () => <AgentGraph nodes={nodes} edges={[['lead', 'research'], ['lead', 'writer'], ['research', 'web'], ['writer', 'docs'], ['you', 'lead']]} height={380} title="Support crew" />,
    },
  ],
};

export default demo;
