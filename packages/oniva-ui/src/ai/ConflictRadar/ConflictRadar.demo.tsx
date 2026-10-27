import type { DemoModule } from '../../internal/demo';
import { ConflictRadar, type RadarAgent, type RadarFile } from './ConflictRadar';

const agents: RadarAgent[] = [
  { id: 'atlas', name: 'Atlas', model: 'fix/retry-backoff', status: 'done' },
  { id: 'nova', name: 'Nova', model: 'fix/idempotency', status: 'done' },
  { id: 'lumen', name: 'Lumen', model: 'chore/logging', status: 'done' },
];
const files: RadarFile[] = [
  { path: 'src/checkout/payment.ts', edits: [{ agentId: 'atlas', lines: [12, 48], summary: 'Adds capped exponential backoff with jitter' }, { agentId: 'nova', lines: [30, 70], summary: 'Stores a delivery key and skips duplicates' }, { agentId: 'lumen', lines: [40, 55], summary: 'Wraps each attempt in structured logs' }] },
  { path: 'src/checkout/receipt.tsx', edits: [{ agentId: 'atlas', lines: [4, 20] }] },
  { path: 'tests/checkout.spec.ts', edits: [] },
  { path: 'src/lib/billing.ts', edits: [{ agentId: 'nova', lines: [60, 95], summary: 'Keys charges by delivery' }] },
  { path: 'src/lib/retry.ts', edits: [{ agentId: 'lumen', lines: [1, 34], summary: 'Structured logs' }] },
  { path: 'package.json', edits: [{ agentId: 'nova', lines: [8, 12] }] },
];

const demo: DemoModule = {
  meta: {
    title: 'Conflict radar',
    slug: 'conflict-radar',
    category: 'AI & Agent',
    description: 'Agents on separate branches: a row per file, a column per agent, a line between agents that changed the same lines, and Merge once everything is settled.',
  },
  demos: [
    {
      name: 'Settle conflicts',
      code: `<ConflictRadar agents={agents} files={files} onMerge={() => merge()} />`,
      Component: () => <ConflictRadar agents={agents} files={files} />,
    },
    {
      name: 'Still working',
      code: `<ConflictRadar agents={agents.map((a, i) => ({ ...a, status: i === 0 ? 'running' : 'done' }))} files={files} />`,
      Component: () => (
        <ConflictRadar
          agents={agents.map((a, i) => ({ ...a, status: i === 0 ? ('running' as const) : ('done' as const) }))}
          files={files.map((f) => ({ ...f, edits: f.edits.map((e) => ({ ...e, active: e.agentId === 'atlas' })) }))}
        />
      ),
    },
  ],
};

export default demo;
