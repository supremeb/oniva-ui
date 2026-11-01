import { AgentLanes, DatabaseIcon, FileTextIcon, BranchIcon, SearchIcon, TableIcon } from 'oniva-ui';
import type { LaneAgent, LaneTask } from 'oniva-ui';
import type { StateModule } from '../types';

const NOW = Date.UTC(2026, 9, 26, 15, 0, 0);
const MIN = 60_000;

const agents: LaneAgent[] = [
  { id: 'research', name: 'Researcher', model: 'Atlas 2' },
  { id: 'writer', name: 'Writer', model: 'Nova Pro' },
  { id: 'review', name: 'Reviewer', model: 'Quill Reasoner' },
  { id: 'ops', name: 'Ops' },
];

const typical: LaneTask[] = [
  { id: 'a', agentId: 'research', title: 'Compare 5 vendors', status: 'done', start: NOW - 26 * MIN, end: NOW - 14 * MIN, handoffTo: 'b', tools: [<SearchIcon key="s" size={10} />], summary: ['Pulled pricing for 5 vendors', 'Flagged 2 contract risks'] },
  { id: 'b', agentId: 'writer', title: 'Draft the brief', status: 'done', start: NOW - 13 * MIN, end: NOW - 5 * MIN, handoffTo: 'c', tools: [<FileTextIcon key="f" size={10} />], summary: ['Wrote 4 sections', 'Added the cost table'] },
  { id: 'c', agentId: 'review', title: 'Check claims', status: 'waiting', start: NOW - 4 * MIN, ask: 'Two claims lack a source. Ship the brief anyway?' },
  { id: 'd', agentId: 'research', title: 'Track renewals', status: 'running', start: NOW - 6 * MIN },
  { id: 'e', agentId: 'ops', title: 'Sync CRM', status: 'failed', start: NOW - 20 * MIN, end: NOW - 17 * MIN, summary: ['CRM rejected 12 rows'] },
];

const longAgents: LaneAgent[] = [
  { id: 'a1', name: 'Northwind Labs contract and renewals analyst', model: 'Quill Reasoner with extended context window' },
  { id: 'a2', name: 'Writer', model: 'Nova Pro' },
];

const many: LaneAgent[] = [
  { id: 'm1', name: 'Researcher', model: 'Atlas 2' },
  { id: 'm2', name: 'Writer', model: 'Nova Pro' },
  { id: 'm3', name: 'Reviewer', model: 'Quill Reasoner' },
  { id: 'm4', name: 'Ops', model: 'Lumen Fast' },
  { id: 'm5', name: 'Translator', model: 'Lumen Fast' },
  { id: 'm6', name: 'Analyst', model: 'Atlas 2' },
  { id: 'm7', name: 'Scheduler' },
  { id: 'm8', name: 'Archivist', model: 'Nova Pro' },
];
const manyTasks: LaneTask[] = many.flatMap((a, i): LaneTask[] => [
  { id: `${a.id}-1`, agentId: a.id, title: `Pass ${i + 1}: collect inputs`, status: 'done', start: NOW - (28 - i * 2) * MIN, end: NOW - (18 - i) * MIN },
  { id: `${a.id}-2`, agentId: a.id, title: `Pass ${i + 1}: apply`, status: i % 3 === 0 ? 'running' : i % 3 === 1 ? 'waiting' : 'done', start: NOW - (16 - i) * MIN, ...(i % 3 === 2 ? { end: NOW - 3 * MIN } : {}) },
]);

const longTitleTasks: LaneTask[] = [
  { id: 'l1', agentId: 'a1', title: 'Reconcile every Northwind Labs renewal clause against the 2026 master services agreement', status: 'running', start: NOW - 22 * MIN, tools: [<SearchIcon key="s" size={10} />, <FileTextIcon key="f" size={10} />, <TableIcon key="t" size={10} />] },
  { id: 'l2', agentId: 'a2', title: 'northwind-labs_renewals_summary_final_v12_reviewed.docx', status: 'done', start: NOW - 18 * MIN, end: NOW - 6 * MIN, tools: [<FileTextIcon key="f" size={10} />] },
];

const mod: StateModule = {
  slug: 'agent-lanes',
  title: 'Agent lanes',
  width: 760,
  groups: [
    {
      label: 'Data',
      states: [
        { id: 'one-lane-empty', label: 'one agent, no tasks (idle)', render: () => <AgentLanes agents={agents.slice(0, 1)} tasks={[]} now={NOW} /> },
        { id: 'all-idle', label: 'four agents, all idle', render: () => <AgentLanes agents={agents} tasks={typical.filter((t) => t.status === 'done')} now={NOW} /> },
        { id: 'typical', label: 'typical (hand-offs, every status)', render: () => <AgentLanes agents={agents} tasks={typical} now={NOW} onOpen={() => undefined} /> },
        { id: 'running-only', label: 'running only', render: () => <AgentLanes agents={agents.slice(0, 2)} tasks={typical.filter((t) => t.status === 'running')} now={NOW} /> },
        { id: 'waiting-only', label: 'waiting only', render: () => <AgentLanes agents={agents} tasks={typical.filter((t) => t.status === 'waiting')} now={NOW} /> },
        { id: 'failed-only', label: 'failed only', render: () => <AgentLanes agents={agents} tasks={typical.filter((t) => t.status === 'failed')} now={NOW} onOpen={() => undefined} /> },
        { id: 'many-agents', label: 'eight agents', render: () => <AgentLanes agents={many} tasks={manyTasks} now={NOW} /> },
        { id: 'no-agents', label: 'no agents', render: () => <AgentLanes agents={[]} tasks={[]} now={NOW} /> },
        {
          id: 'orphan-tasks',
          label: 'tasks for unknown agents, dangling hand-off',
          render: () => (
            <AgentLanes
              agents={agents.slice(0, 2)}
              tasks={[
                { id: 'o1', agentId: 'ghost', title: 'Unassigned', status: 'running', start: NOW - 5 * MIN },
                { id: 'o2', agentId: 'research', title: 'Pull usage export', status: 'done', start: NOW - 15 * MIN, end: NOW - 8 * MIN, handoffTo: 'missing' },
              ]}
              now={NOW}
            />
          ),
        },
      ],
    },
    {
      label: 'Window',
      states: [
        { id: 'span-12m', label: 'span 12 min', render: () => <AgentLanes agents={agents} tasks={typical} now={NOW} span={12 * MIN} title="Last 12 minutes" /> },
        { id: 'span-2h', label: 'span 2 hours', render: () => <AgentLanes agents={agents} tasks={typical} now={NOW} span={120 * MIN} title="Last 2 hours" /> },
        {
          id: 'edge-clipped',
          label: 'blocks leaving / outside the window',
          render: () => (
            <AgentLanes
              agents={agents.slice(0, 3)}
              tasks={[
                { id: 'x1', agentId: 'research', title: 'Crawl vendor sites', status: 'done', start: NOW - 40 * MIN, end: NOW - 26 * MIN },
                { id: 'x2', agentId: 'writer', title: 'Outline the brief', status: 'done', start: NOW - 35 * MIN, end: NOW - 20 * MIN, handoffTo: 'x3' },
                { id: 'x3', agentId: 'review', title: 'Spot-check figures', status: 'running', start: NOW - 19 * MIN },
              ]}
              now={NOW}
            />
          ),
        },
        {
          id: 'tiny-blocks',
          label: 'very short tasks',
          render: () => (
            <AgentLanes
              agents={agents.slice(0, 3)}
              tasks={[
                { id: 's1', agentId: 'research', title: 'Ping', status: 'done', start: NOW - 20 * MIN, end: NOW - 19.5 * MIN },
                { id: 's2', agentId: 'writer', title: 'Format', status: 'failed', start: NOW - 10 * MIN, end: NOW - 9 * MIN },
                { id: 's3', agentId: 'review', title: 'Sign-off', status: 'waiting', start: NOW - 20_000, ask: 'Release the brief?' },
              ]}
              now={NOW}
            />
          ),
        },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'long-text', label: 'long agent names and task titles', render: () => <AgentLanes agents={longAgents} tasks={longTitleTasks} now={NOW} /> },
        {
          id: 'tools-and-avatar',
          label: 'tool marks (max 3) and custom avatar',
          render: () => (
            <AgentLanes
              agents={[{ id: 'a', name: 'Data agent', model: 'Lumen Fast', avatar: <DatabaseIcon size={20} aria-hidden="true" /> }, ...agents.slice(1, 2)]}
              tasks={[
                { id: 'g1', agentId: 'a', title: 'Join warehouse tables', status: 'running', start: NOW - 14 * MIN, tools: [<DatabaseIcon key="d" size={10} />, <TableIcon key="t" size={10} />, <BranchIcon key="g" size={10} />, <SearchIcon key="s" size={10} />] },
                { id: 'g2', agentId: 'writer', title: 'Summarise', status: 'done', start: NOW - 25 * MIN, end: NOW - 15 * MIN, tools: [<FileTextIcon key="f" size={10} />] },
              ]}
              now={NOW}
            />
          ),
        },
        { id: 'custom-title', label: 'custom title', render: () => <AgentLanes agents={agents} tasks={typical} now={NOW} title="Renewal run, Northwind Labs" /> },
      ],
    },
    {
      label: 'Size',
      states: [
        {
          id: 'narrow',
          label: 'narrow (<520, names collapse to avatars)',
          render: () => (
            <div style={{ width: 400 }}>
              <AgentLanes agents={agents} tasks={typical} now={NOW} />
            </div>
          ),
        },
      ],
    },
  ],
  missing: [
    'Open popover (decision or summary): needs a click, no default-open prop',
    'Loading / skeleton state: the component has none',
    'Disabled / read-only: not exposed',
    'Live clock ticking: the `now` prop pins it, so the running block cannot be shown growing',
  ],
};
export default mod;
