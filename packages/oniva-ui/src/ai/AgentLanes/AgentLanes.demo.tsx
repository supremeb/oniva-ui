import { FileText, Search } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { AgentLanes, type LaneAgent, type LaneTask } from './AgentLanes';

const t0 = Date.now();
const MIN = 60_000;
const agents: LaneAgent[] = [
  { id: 'research', name: 'Researcher', model: 'Atlas 2' },
  { id: 'writer', name: 'Writer', model: 'Nova Pro' },
  { id: 'review', name: 'Reviewer', model: 'Quill Reasoner' },
  { id: 'ops', name: 'Ops' },
];
const tasks: LaneTask[] = [
  { id: 'a', agentId: 'research', title: 'Compare 5 vendors', status: 'done', start: t0 - 26 * MIN, end: t0 - 14 * MIN, handoffTo: 'b', tools: [<Search key="s" size={10} />], summary: ['Pulled pricing for 5 vendors', 'Flagged 2 contract risks', 'Saved the table to the brief'] },
  { id: 'b', agentId: 'writer', title: 'Draft the brief', status: 'done', start: t0 - 13 * MIN, end: t0 - 5 * MIN, handoffTo: 'c', tools: [<FileText key="f" size={10} />], summary: ['Wrote 4 sections', 'Added the cost table'] },
  { id: 'c', agentId: 'review', title: 'Check claims', status: 'waiting', start: t0 - 4 * MIN, ask: 'Two claims lack a source. Ship the brief anyway?' },
  { id: 'd', agentId: 'research', title: 'Track renewals', status: 'running', start: t0 - 6 * MIN },
  { id: 'e', agentId: 'ops', title: 'Sync CRM', status: 'failed', start: t0 - 20 * MIN, end: t0 - 17 * MIN, summary: ['CRM rejected 12 rows'] },
];

const demo: DemoModule = {
  meta: {
    title: 'Agent lanes',
    slug: 'agent-lanes',
    category: 'AI & Agent',
    description: 'A live timeline with one lane per agent, hand-offs drawn between tasks and approvals right on the block.',
  },
  demos: [
    {
      name: 'Live lanes',
      code: `<AgentLanes agents={agents} tasks={tasks} onOpen={(t) => open(t.id)} />`,
      Component: () => <AgentLanes agents={agents} tasks={tasks} onOpen={() => {}} />,
    },
    {
      name: 'Short window',
      code: `<AgentLanes agents={agents} tasks={tasks} span={12 * 60_000} title="Last 12 minutes" />`,
      Component: () => <AgentLanes agents={agents} tasks={tasks} span={12 * MIN} title="Last 12 minutes" />,
    },
  ],
};

export default demo;
