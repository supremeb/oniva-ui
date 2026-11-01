import { AgentGraph, DatabaseIcon, FileTextIcon, GlobeIcon, MailIcon, BranchIcon } from 'oniva-ui';
import type { GraphCall, GraphNode } from 'oniva-ui';
import type { StateModule } from '../types';

const NOW = 1_760_000_000_000;
const ago = (s: number) => NOW - s * 1000;

const crew: GraphNode[] = [
  { id: 'lead', kind: 'agent', name: 'Orchestrator', detail: 'Atlas 2', status: 'working', lead: true, cost: 0.31, doing: 'Planning the launch brief' },
  { id: 'research', kind: 'agent', name: 'Researcher', detail: 'Nova Pro', status: 'working', cost: 0.12, doing: 'Comparing five vendors' },
  { id: 'writer', kind: 'agent', name: 'Writer', detail: 'Lumen Fast', status: 'idle', cost: 0.05 },
  { id: 'web', kind: 'tool', name: 'Web search', short: 'Search', detail: 'Public web', icon: <GlobeIcon size={16} /> },
  { id: 'docs', kind: 'tool', name: 'Docs', detail: 'Team wiki', icon: <FileTextIcon size={16} /> },
  { id: 'wh', kind: 'tool', name: 'Warehouse', short: 'Data', detail: 'Sales tables', icon: <DatabaseIcon size={16} /> },
  { id: 'you', kind: 'user', name: 'You' },
];

const edges: [string, string][] = [['you', 'lead'], ['lead', 'research'], ['lead', 'writer'], ['research', 'web'], ['writer', 'docs'], ['research', 'wh']];

const settled: GraphCall[] = [
  { id: 'c1', from: 'lead', to: 'research', at: ago(48), status: 'ok', ms: 640, label: 'Compare vendor pricing' },
  { id: 'c2', from: 'research', to: 'web', at: ago(41), status: 'ok', ms: 820, label: 'northwind pricing page' },
  { id: 'c3', from: 'research', to: 'web', at: ago(33), status: 'ok', ms: 410, label: 'vendor review roundup' },
  { id: 'c4', from: 'research', to: 'wh', at: ago(26), status: 'ok', ms: 1130, label: 'Q3 sales by region' },
  { id: 'c5', from: 'lead', to: 'writer', at: ago(18), status: 'ok', ms: 560, label: 'Draft launch brief' },
  { id: 'c6', from: 'writer', to: 'docs', at: ago(12), status: 'ok', ms: 380, label: 'Brand voice guide' },
  { id: 'c7', from: 'research', to: 'web', at: ago(9), status: 'ok', ms: 700, label: 'pricing changelog' },
];

const mixed: GraphCall[] = [
  ...settled.slice(0, 5),
  { id: 'c8', from: 'writer', to: 'docs', at: ago(14), status: 'error', ms: 3100, label: 'Brand voice guide' },
  { id: 'c9', from: 'research', to: 'wh', at: ago(10), status: 'pending', label: 'Q3 sales by region' },
];

const busy: GraphCall[] = Array.from({ length: 24 }, (_, i) => ({
  id: `b${i}`,
  from: 'research',
  to: i % 4 === 0 ? 'wh' : 'web',
  at: ago(6 + i * 0.7),
  status: 'ok' as const,
  ms: 300 + ((i * 137) % 700),
}));

const withStatus = (status: GraphNode['status'], doing?: string): GraphNode[] =>
  crew.map((n) => (n.id === 'writer' ? { ...n, status, doing } : n));

const big: GraphNode[] = [
  ...crew.slice(0, 3),
  { id: 'coder', kind: 'agent', name: 'Coder', detail: 'Quill Reasoner', status: 'working', cost: 0.09, doing: 'Fixing the export script' },
  { id: 'analyst', kind: 'agent', name: 'Analyst', detail: 'Lumen Fast', status: 'done', cost: 0.04 },
  { id: 'reviewer', kind: 'agent', name: 'Reviewer', detail: 'Atlas 2', status: 'waiting', cost: 0.02, doing: 'Needs sign-off on the claims' },
  ...crew.slice(3, 6),
  { id: 'mail', kind: 'tool', name: 'Mail', detail: 'Team inbox', icon: <MailIcon size={16} /> },
  { id: 'git', kind: 'tool', name: 'Repo', detail: 'Repos', icon: <BranchIcon size={16} /> },
  { id: 'you', kind: 'user', name: 'You' },
];
const bigEdges: [string, string][] = [...edges, ['lead', 'coder'], ['coder', 'git'], ['lead', 'analyst'], ['analyst', 'wh'], ['lead', 'reviewer'], ['writer', 'mail']];

const longNames: GraphNode[] = [
  { id: 'lead', kind: 'agent', name: 'Quarterly planning orchestrator for Northwind Labs', detail: 'Atlas 2 with extended reasoning enabled', status: 'working', lead: true, cost: 12.4, doing: 'Reconciling forecasts across regional spreadsheets' },
  { id: 'a', kind: 'agent', name: 'Supplier-contract-compliance-reviewer', detail: 'Quill Reasoner', status: 'idle' },
  { id: 't', kind: 'tool', name: 'northwind-internal-data-warehouse-readonly', detail: 'analytics.northwind.example/v2/warehouse', status: 'idle' },
];

const base = { nodes: crew, edges, now: NOW };

const mod: StateModule = {
  slug: 'agent-graph',
  title: 'Agent graph',
  width: 720,
  groups: [
    {
      label: 'Data',
      states: [
        { id: 'empty', label: 'no nodes', render: () => <AgentGraph nodes={[]} now={NOW} /> },
        { id: 'lead-only', label: 'one agent, no calls', render: () => <AgentGraph nodes={[crew[0]!]} now={NOW} /> },
        { id: 'no-calls', label: 'nodes and edges, no calls', render: () => <AgentGraph {...base} /> },
        { id: 'typical', label: 'typical, calls settled', render: () => <AgentGraph {...base} calls={settled} /> },
        { id: 'busy-link', label: 'one busy link (heat)', render: () => <AgentGraph {...base} calls={busy} /> },
        { id: 'many', label: 'eleven nodes', render: () => <AgentGraph nodes={big} edges={bigEdges} calls={settled} now={NOW} /> },
      ],
    },
    {
      label: 'Status',
      states: [
        { id: 'working', label: 'agents working', render: () => <AgentGraph {...base} nodes={withStatus('working', 'Drafting the launch brief')} calls={settled} /> },
        { id: 'waiting', label: 'waiting on you', render: () => <AgentGraph {...base} nodes={withStatus('waiting', 'Needs sign-off on the claims')} calls={settled} /> },
        { id: 'error', label: 'agent failed', render: () => <AgentGraph {...base} nodes={withStatus('error', 'Rate limited by the docs tool')} calls={mixed} /> },
        { id: 'done', label: 'agent done', render: () => <AgentGraph {...base} nodes={withStatus('done')} calls={settled} /> },
        { id: 'call-mix', label: 'pending and failed calls', render: () => <AgentGraph {...base} calls={mixed} /> },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'long-names', label: 'long names and details', render: () => <AgentGraph nodes={longNames} edges={[['lead', 'a'], ['lead', 't']]} now={NOW} formatCost={(n) => `$${n.toFixed(2)}`} /> },
        { id: 'custom-title', label: 'custom title, fixed height', render: () => <AgentGraph {...base} calls={settled} title="Support crew" height={360} /> },
      ],
    },
    {
      label: 'Size',
      states: [
        { id: 'narrow', label: 'narrow (sidebar)', render: () => <div style={{ width: 340 }}><AgentGraph {...base} nodes={withStatus('waiting', 'Needs sign-off on the claims')} calls={mixed} /></div> },
        { id: 'narrow-many', label: 'narrow, eleven nodes', render: () => <div style={{ width: 340 }}><AgentGraph nodes={big} edges={bigEdges} calls={settled} now={NOW} /></div> },
      ],
    },
  ],
  missing: [
    'Open node card (selection is internal, no defaultSelected prop)',
    'In-flight pulses and landing ripples (need a live calls stream; timers excluded by the workbench)',
    'Node leaving animation (needs nodes to change after mount)',
  ],
};

export default mod;
