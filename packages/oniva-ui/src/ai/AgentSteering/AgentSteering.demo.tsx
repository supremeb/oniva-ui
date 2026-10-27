import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { AgentSteering, type SteerNote, type SteerStep } from './AgentSteering';

const t0 = Date.now();
const initial: SteerStep[] = [
  { id: 'schema', title: 'Read schema and 14 migrations', status: 'done', duration: '1.4s' },
  { id: 'plan', title: 'Plan the split into accounts and profiles', status: 'active', startedAt: t0 - 3_400 },
  { id: 'write', title: 'Write migration 0042_split_users', status: 'pending' },
  { id: 'stage', title: 'Dry run on staging', status: 'pending' },
  { id: 'pr', title: 'Open a pull request for review', status: 'pending' },
];

function Live() {
  const [steps, setSteps] = useState<SteerStep[]>(initial);
  const [queue, setQueue] = useState<SteerNote[]>([{ id: 'seed', text: "Use Postgres 16 syntax, prod isn't on 17 yet" }]);
  const [paused, setPaused] = useState(false);
  const take = (note: SteerNote, picked: 'next' | 'now') =>
    setSteps((list) => list.map((s) => (s.status === 'active' ? { ...s, notes: [...(s.notes ?? []), { ...note, picked }] } : s)));
  return (
    <AgentSteering
      title="Migrate users table"
      agent="Atlas 2"
      steps={steps}
      queue={queue}
      status={paused ? 'paused' : 'running'}
      startedAt={t0 - 129_000}
      onQueue={(text) => setQueue((q) => [...q, { id: crypto.randomUUID(), text }])}
      onInterrupt={(text, id) => {
        take({ id: id ?? crypto.randomUUID(), text }, 'now');
        if (id) setQueue((q) => q.filter((n) => n.id !== id));
      }}
      onRemove={(id) => setQueue((q) => q.filter((n) => n.id !== id))}
      onPause={() => setPaused(true)}
      onResume={() => setPaused(false)}
    />
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Agent steering',
    slug: 'agent-steering',
    category: 'AI & Agent',
    description: 'Queue a note for the agent\'s next step or interrupt right away, and see which step took it in.',
  },
  demos: [
    {
      name: 'Interactive',
      code: `<AgentSteering title="Migrate users table" steps={steps} queue={queue} onQueue={add} onInterrupt={apply} onRemove={remove} />`,
      Component: Live,
    },
    {
      name: 'Finished run',
      code: `<AgentSteering title="Release notes" steps={steps} status="done" />`,
      Component: () => (
        <AgentSteering
          title="Release notes"
          agent="Nova Pro"
          status="done"
          steps={[
            { id: 'a', title: 'Collect merged pull requests', status: 'done', duration: '8s' },
            { id: 'b', title: 'Group by area', status: 'done', duration: '3s', notes: [{ id: 'n', text: 'Put breaking changes first', picked: 'next' }] },
            { id: 'c', title: 'Write the summary', status: 'done', duration: '11s' },
          ]}
        />
      ),
    },
  ],
};

export default demo;
