import { useState, type ReactNode } from 'react';
import { Database, FileText, GitBranch, Globe, Palette, Search } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { AgentTree, type TreeAction, type TreeAgent } from './AgentTree';

const t0 = Date.now();
const ic = (n: ReactNode) => n;
const base: TreeAgent = {
  id: 'lead',
  name: 'Orchestrator',
  model: 'Atlas 2',
  task: 'Launch the new pricing page by Friday',
  status: 'running',
  cost: 0.04,
  started: t0 - 32_000,
  tools: [ic(<FileText key="a" size={11} />), ic(<Palette key="b" size={11} />), ic(<GitBranch key="c" size={11} />)],
  children: [
    {
      id: 'research',
      name: 'Researcher',
      model: 'Nova Pro',
      task: 'Compare the pricing of five competitors',
      status: 'running',
      cost: 0.05,
      started: t0 - 26_000,
      tools: [<Search key="s" size={11} />, <Globe key="g" size={11} />],
      children: [
        { id: 'scrape', name: 'Scraper', model: 'Lumen Fast', task: 'Read the pricing pages of the five sites', status: 'running', cost: 0.02, started: t0 - 18_000, tools: [<Globe key="g" size={11} />] },
        { id: 'analyst', name: 'Analyst', model: 'Nova Pro', task: 'Summarize 120 reviews that mention price', status: 'running', cost: 0.03, started: t0 - 12_000, tools: [<FileText key="f" size={11} />] },
      ],
    },
    { id: 'writer', name: 'Writer', model: 'Nova Pro', task: 'Write the copy for the three plans', status: 'running', cost: 0.07, started: t0 - 21_000, tools: [<FileText key="f" size={11} />] },
    {
      id: 'build',
      name: 'Coder',
      model: 'Quill Reasoner',
      task: 'Build the page and wire up checkout',
      status: 'running',
      cost: 0.09,
      started: t0 - 16_000,
      tools: [<GitBranch key="g" size={11} />, <Database key="d" size={11} />],
      children: [
        { id: 'tester', name: 'Tester', model: 'Lumen Fast', task: 'Write and run the checkout tests', status: 'waiting', ask: 'Run the tests against the live checkout?', cost: 0.01, started: t0 - 4_000, tools: [<GitBranch key="g" size={11} />] },
      ],
    },
  ],
};

function patch(a: TreeAgent, id: string, status: TreeAgent['status']): TreeAgent {
  return { ...a, status: a.id === id ? status : a.status, children: a.children?.map((c) => patch(c, id, status)) };
}

function Live() {
  const [root, setRoot] = useState(base);
  const onResolve = (a: TreeAgent, action: TreeAction) =>
    setRoot((r) => patch(r, a.id, action === 'approve' ? 'running' : action === 'retry' ? 'running' : action === 'reject' ? 'stopped' : 'stopped'));
  return <AgentTree root={root} onResolve={onResolve} />;
}

const demo: DemoModule = {
  meta: {
    title: 'Agent tree',
    slug: 'agent-tree',
    category: 'AI & Agent',
    description: 'Orchestrator and sub-agents as a live, foldable tree with status, cost roll-ups and time per card.',
  },
  demos: [
    {
      name: 'Live run',
      code: `const [root, setRoot] = useState(run);
<AgentTree root={root} onResolve={(agent, action) => setRoot(update(root, agent.id, action))} />`,
      Component: Live,
    },
    {
      name: 'Folded and selectable',
      code: `<AgentTree root={run} defaultCollapsed={['research']} onSelect={(a) => openLog(a.id)} title="Pricing launch" />`,
      Component: () => <AgentTree root={base} defaultCollapsed={['research']} onSelect={() => {}} title="Pricing launch" />,
    },
  ],
};

export default demo;
