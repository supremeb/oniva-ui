import { ConflictRadar } from 'oniva-ui';
import type { RadarAgent, RadarFile } from 'oniva-ui';
import type { StateModule } from '../types';

const agents: RadarAgent[] = [
  { id: 'atlas', name: 'Atlas 2', model: 'fix/retry-backoff', status: 'done' },
  { id: 'nova', name: 'Nova Pro', model: 'fix/idempotency', status: 'done' },
  { id: 'lumen', name: 'Lumen Fast', model: 'chore/logging', status: 'done' },
];

const clean: RadarFile[] = [
  { path: 'src/checkout/receipt.tsx', edits: [{ agentId: 'atlas', lines: [4, 20], summary: 'Formats totals with the shared helper' }] },
  { path: 'src/lib/billing.ts', edits: [{ agentId: 'nova', lines: [60, 95], summary: 'Keys charges by delivery' }] },
  { path: 'src/lib/retry.ts', edits: [{ agentId: 'lumen', lines: [1, 34], summary: 'Structured logs' }] },
  { path: 'package.json', edits: [{ agentId: 'nova', lines: [8, 12] }] },
  { path: 'tests/checkout.spec.ts', edits: [] },
];

const payment: RadarFile = {
  path: 'src/checkout/payment.ts',
  edits: [
    { agentId: 'atlas', lines: [12, 48], summary: 'Adds capped exponential backoff with jitter' },
    { agentId: 'nova', lines: [30, 70], summary: 'Stores a delivery key and skips duplicates' },
    { agentId: 'lumen', lines: [40, 55], summary: 'Wraps each attempt in structured logs' },
  ],
};
const cart: RadarFile = {
  path: 'src/checkout/cart.ts',
  edits: [
    { agentId: 'atlas', lines: [101, 140], summary: 'Moves totals into a helper' },
    { agentId: 'nova', lines: [130, 160], summary: 'Rewrites totals inline with rounding fix' },
  ],
};
const ledger: RadarFile = {
  path: 'src/lib/ledger.ts',
  edits: [
    { agentId: 'nova', lines: [5, 22], summary: 'Appends entries inside a transaction' },
    { agentId: 'lumen', lines: [18, 40], summary: 'Logs every append with the delivery id' },
  ],
};

const conflicting = [payment, ...clean];
const multi = [payment, cart, ledger, ...clean];

const longPath = 'packages/northwind-billing/src/workers/reconciliation/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts';
const longNames: RadarAgent[] = [
  { id: 'a', name: 'Atlas 2 (migration planner, retry branch)', model: 'fix/retry-backoff', status: 'done' },
  { id: 'b', name: 'Quill Reasoner with a very long display name', model: 'fix/idempotency', status: 'done' },
];

const many: RadarAgent[] = [
  ...agents,
  { id: 'quill', name: 'Quill Reasoner', model: 'docs/changelog', status: 'done' },
  { id: 'atlas-b', name: 'Atlas 2 (b)', model: 'test/e2e', status: 'done' },
];
const manyFiles: RadarFile[] = [
  payment,
  { path: 'CHANGELOG.md', edits: [{ agentId: 'quill', lines: [1, 14], summary: 'Notes the retry change' }] },
  { path: 'tests/e2e/checkout.spec.ts', edits: [{ agentId: 'atlas-b', lines: [10, 80], summary: 'Covers the retry path' }, { agentId: 'atlas', lines: [70, 90], summary: 'Updates the retry fixtures' }] },
  ...clean.slice(0, 3),
];

const longList: RadarFile[] = [
  ...multi,
  ...Array.from({ length: 12 }, (_, i): RadarFile => ({
    path: `src/modules/payments/handlers/handler-${String(i + 1).padStart(2, '0')}.ts`,
    edits: [{ agentId: agents[i % 3]!.id, lines: [i * 7 + 1, i * 7 + 24], summary: 'Small cleanup' }],
  })),
];

const mod: StateModule = {
  slug: 'conflict-radar',
  title: 'Conflict radar',
  width: 720,
  groups: [
    {
      label: 'Run',
      states: [
        {
          id: 'running',
          label: 'one agent still running',
          render: () => (
            <ConflictRadar
              agents={agents.map((a, i) => ({ ...a, status: i === 0 ? ('running' as const) : ('done' as const) }))}
              files={conflicting.map((f) => ({ ...f, edits: f.edits.map((e) => ({ ...e, active: e.agentId === 'atlas' })) }))}
            />
          ),
        },
        {
          id: 'all-running',
          label: 'every agent running',
          render: () => (
            <ConflictRadar
              agents={agents.map((a) => ({ ...a, status: 'running' as const }))}
              files={clean.map((f) => ({ ...f, edits: f.edits.map((e) => ({ ...e, active: true })) }))}
            />
          ),
        },
      ],
    },
    {
      label: 'Conflicts',
      states: [
        { id: 'no-overlaps', label: 'no overlaps', render: () => <ConflictRadar agents={agents} files={clean} /> },
        { id: 'one-conflict', label: 'one conflict (3 ways)', render: () => <ConflictRadar agents={agents} files={conflicting} /> },
        { id: 'multi-conflict', label: 'three conflicts', render: () => <ConflictRadar agents={agents} files={multi} /> },
        {
          id: 'partly-settled',
          label: 'one of three settled',
          render: () => <ConflictRadar agents={agents} files={multi} resolved={{ 'src/checkout/cart.ts': 'atlas' }} />,
        },
        {
          id: 'ready',
          label: 'all settled, ready to merge',
          render: () => (
            <ConflictRadar
              agents={agents}
              files={multi}
              resolved={{ 'src/checkout/payment.ts': 'nova', 'src/checkout/cart.ts': 'atlas', 'src/lib/ledger.ts': 'lumen' }}
              onMerge={() => undefined}
            />
          ),
        },
        {
          id: 'adjacent-not-conflict',
          label: 'same file, different lines',
          render: () => (
            <ConflictRadar
              agents={agents.slice(0, 2)}
              files={[{ path: 'src/ui/Toolbar.tsx', edits: [{ agentId: 'atlas', lines: [1, 10] }, { agentId: 'nova', lines: [11, 30] }] }]}
            />
          ),
        },
      ],
    },
    {
      label: 'Data',
      states: [
        { id: 'no-files', label: 'no files', render: () => <ConflictRadar agents={agents} files={[]} /> },
        { id: 'no-agents', label: 'no agents', render: () => <ConflictRadar agents={[]} files={clean} /> },
        { id: 'one-agent', label: 'one agent', render: () => <ConflictRadar agents={agents.slice(0, 1)} files={[clean[0]!, clean[4]!]} /> },
        { id: 'five-agents', label: 'five agents', render: () => <ConflictRadar agents={many} files={manyFiles} /> },
        { id: 'many-files', label: 'long file list', render: () => <ConflictRadar agents={agents} files={longList} /> },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'long-path',
          label: 'long path and agent names',
          render: () => (
            <ConflictRadar
              agents={longNames}
              files={[
                { path: longPath, edits: [{ agentId: 'a', lines: [1200, 1480], summary: 'Rewrites the whole decorrelated jitter strategy and its retry schedule' }, { agentId: 'b', lines: [1300, 1500], summary: 'Moves it behind a feature flag and adds idempotency keys for every worker delivery' }] },
                { path: 'README.md', edits: [{ agentId: 'a', lines: [1, 3] }] },
              ]}
              title="Parallel work on the reconciliation worker in production"
            />
          ),
        },
        {
          id: 'single-line',
          label: 'single-line edits',
          render: () => (
            <ConflictRadar
              agents={agents.slice(0, 2)}
              files={[{ path: 'src/version.ts', edits: [{ agentId: 'atlas', lines: [3, 3], summary: 'Bumps the version' }, { agentId: 'nova', lines: [3, 3] }] }]}
            />
          ),
        },
        { id: 'custom-title', label: 'custom title', render: () => <ConflictRadar agents={agents} files={clean} title="Release branches" /> },
      ],
    },
    {
      label: 'Size',
      states: [
        {
          id: 'narrow',
          label: 'narrow container (360)',
          render: () => (
            <div style={{ maxWidth: 360 }}>
              <ConflictRadar agents={agents} files={multi} />
            </div>
          ),
        },
      ],
    },
  ],
  missing: [
    'Per-agent error or failed status (status is only running or done)',
    'Loading or empty-state copy when there are no files (renders only the header and a disabled Merge)',
    'Disabled or read-only radar (no prop)',
  ],
};
export default mod;
