import { Database, FileText, GitBranch, MessageSquare, Palette } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { DelegateBoard, type DelegateAgent, type DelegateTask } from './DelegateBoard';

const agents: DelegateAgent[] = [
  { id: 'research', name: 'Researcher', model: 'Atlas 2', current: 9, rate: 0.08 },
  { id: 'writer', name: 'Writer', model: 'Nova Pro', current: 15, rate: 0.03 },
  { id: 'coder', name: 'Coder', model: 'Lumen Fast', rate: 0.06 },
  { id: 'ops', name: 'Ops', model: 'Quill Reasoner', rate: 0.01 },
];
const tasks: DelegateTask[] = [
  { id: 't1', title: 'Fix flaky checkout test', estimate: 20, tools: [<GitBranch key="g" size={12} />] },
  { id: 't2', title: 'Summarize churn calls', estimate: 15, tools: [<MessageSquare key="m" size={12} />, <FileText key="f" size={12} />] },
  { id: 't3', title: 'Update pricing page', estimate: 10, tools: [<Palette key="p" size={12} />] },
  { id: 't4', title: 'Clean up CRM duplicates', estimate: 18, tools: [<Database key="d" size={12} />] },
  { id: 'q1', title: 'Competitor scan', estimate: 12, agentId: 'research' },
  { id: 'q2', title: 'Write release notes', estimate: 8, agentId: 'writer' },
  { id: 'q3', title: 'Refactor auth', estimate: 20, agentId: 'coder' },
  { id: 'q4', title: 'Upgrade billing SDK', estimate: 10, agentId: 'coder' },
];

const demo: DemoModule = {
  meta: {
    title: 'Delegate board',
    slug: 'delegate-board',
    category: 'AI & Agent',
    description: 'Hand work to agents by dragging, keyboard or Auto; each agent previews its new busy-until time and cost.',
  },
  demos: [
    {
      name: 'Manual',
      code: `<DelegateBoard agents={agents} tasks={tasks} onAssign={(taskId, agentId) => api.assign(taskId, agentId)} />`,
      Component: () => <DelegateBoard agents={agents} tasks={tasks} />,
    },
    {
      name: 'Suggested hand-off',
      code: `<DelegateBoard agents={agents} tasks={tasks} suggestion={{ taskId: 't1', agentId: 'coder' }} />`,
      Component: () => <DelegateBoard agents={agents} tasks={tasks} suggestion={{ taskId: 't1', agentId: 'coder' }} />,
    },
    {
      name: 'Auto routing',
      code: `<DelegateBoard agents={agents} tasks={tasks} defaultMode="auto" />`,
      Component: () => <DelegateBoard agents={agents} tasks={tasks} defaultMode="auto" />,
    },
  ],
};

export default demo;
