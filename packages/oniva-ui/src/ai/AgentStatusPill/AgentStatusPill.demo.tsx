import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { AgentStatusPill, type AgentStatus } from './AgentStatusPill';

function Cycle() {
  const [s, setS] = useState<AgentStatus>('working');
  const labels: Record<AgentStatus, string> = {
    idle: 'Idle',
    working: 'Reviewing PR #482…',
    waiting: 'Waiting for approval',
    error: 'Tests failed',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <AgentStatusPill status={s} label={labels[s]} />
      <div style={{ display: 'flex', gap: 8 }}>
        {(Object.keys(labels) as AgentStatus[]).map((k) => (
          <button key={k} type="button" onClick={() => setS(k)} aria-pressed={s === k} style={{ font: 'inherit', fontSize: 12 }}>
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Agent status pill',
    slug: 'agent-status-pill',
    category: 'AI & Agent',
    description: 'Idle / working / waiting / error pill with a shimmering label and text swap.',
  },
  demos: [
    {
      name: 'All states',
      code: `<AgentStatusPill status="idle" />
<AgentStatusPill status="working" label="Reviewing PR #482…" />
<AgentStatusPill status="waiting" />
<AgentStatusPill status="error" label="Tests failed" />`,
      Component: () => (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <AgentStatusPill status="idle" />
          <AgentStatusPill status="working" label="Reviewing PR #482…" />
          <AgentStatusPill status="waiting" />
          <AgentStatusPill status="error" label="Tests failed" />
        </div>
      ),
    },
    { name: 'Interactive swap', code: `<AgentStatusPill status={status} label={labels[status]} />`, Component: Cycle },
  ],
};

export default demo;
