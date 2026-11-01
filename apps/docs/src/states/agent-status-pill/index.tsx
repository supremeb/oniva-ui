import { AgentStatusPill } from 'oniva-ui';
import type { StateModule } from '../types';

const longLabel = 'Reviewing packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts';

const mod: StateModule = {
  slug: 'agent-status-pill',
  title: 'Agent status pill',
  width: 320,
  groups: [
    {
      label: 'Status (default label)',
      states: [
        { id: 'idle', label: 'idle', render: () => <AgentStatusPill status="idle" /> },
        { id: 'working', label: 'working', render: () => <AgentStatusPill status="working" /> },
        { id: 'waiting', label: 'waiting', render: () => <AgentStatusPill status="waiting" /> },
        { id: 'error', label: 'error', render: () => <AgentStatusPill status="error" /> },
      ],
    },
    {
      label: 'Status (custom label)',
      states: [
        { id: 'idle-custom', label: 'idle, custom', render: () => <AgentStatusPill status="idle" label="Last run 4m ago" /> },
        { id: 'working-custom', label: 'working, custom', render: () => <AgentStatusPill status="working" label="Reviewing PR #482…" /> },
        { id: 'waiting-custom', label: 'waiting, custom', render: () => <AgentStatusPill status="waiting" label="Approve 3 file edits" /> },
        { id: 'error-custom', label: 'error, custom', render: () => <AgentStatusPill status="error" label="Tests failed" /> },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'long-working', label: 'long label, working', render: () => <AgentStatusPill status="working" label={longLabel} /> },
        { id: 'long-error', label: 'long label, error', render: () => <AgentStatusPill status="error" label={longLabel} /> },
        { id: 'long-words', label: 'long label, words', render: () => <AgentStatusPill status="waiting" label="Waiting for Dana Whitfield to approve the production deploy of Northwind Labs billing" /> },
        { id: 'empty-label', label: 'empty label', render: () => <AgentStatusPill status="idle" label="" /> },
      ],
    },
  ],
  missing: ['size variants (single fixed height)', 'stopped / cancelled / done status (only idle, working, waiting, error exist)'],
};

export default mod;
