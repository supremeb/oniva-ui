import { ToolChips } from 'oniva-ui';
import type { ToolChipCall, ToolChipEdit } from 'oniva-ui';
import type { StateModule } from '../types';

const typical: ToolChipCall[] = [
  { id: 't1', kind: 'thinking', label: 'Thinking', target: 'Planning the retry schedule…' },
  { id: 't2', kind: 'read', label: 'Read', target: 'src/queue/retry.ts' },
  { id: 't3', kind: 'search', label: 'Search', target: 'backoff jitter' },
  { id: 't4', kind: 'edit', label: 'Write 204 lines', target: 'src/queue/RetrySchedule.tsx' },
  { id: 't5', kind: 'run', label: 'Run tests', target: 'npm test -- retry' },
  { id: 't6', kind: 'message', label: 'Reply', target: 'Summary sent to #release-notes' },
];

const edits: ToolChipEdit[] = [
  { id: 'e1', file: 'RetrySchedule.tsx', added: 204, removed: 0 },
  { id: 'e2', file: 'retry.ts', added: 31, removed: 12 },
  { id: 'e3', file: 'retry.test.ts', added: 58, removed: 4 },
  { id: 'e4', file: 'queue.config.json', added: 3, removed: 1 },
  { id: 'e5', file: 'CHANGELOG.md', added: 9, removed: 0 },
  { id: 'e6', file: 'index.ts', added: 1, removed: 0 },
];

const longPath = 'packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts';

const mod: StateModule = {
  slug: 'tool-chips',
  title: 'Tool chips',
  width: 480,
  groups: [
    {
      label: 'Run',
      states: [
        { id: 'empty', label: 'empty', render: () => <ToolChips calls={[]} /> },
        {
          id: 'one-call',
          label: 'one call, done',
          render: () => <ToolChips calls={[{ id: '1', kind: 'read', label: 'Read', target: 'src/queue/retry.ts' }]} />,
        },
        {
          id: 'running',
          label: 'running',
          render: () => (
            <ToolChips
              calls={[
                { id: '1', kind: 'read', label: 'Read', target: 'src/queue/retry.ts' },
                { id: '2', kind: 'run', label: 'Run tests', target: 'npm test -- retry', status: 'running' },
              ]}
              summary="Working…"
            />
          ),
        },
        {
          id: 'mixed',
          label: 'done, running, error',
          render: () => (
            <ToolChips
              calls={[
                { id: '1', kind: 'edit', label: 'Write 204 lines', target: 'RetrySchedule.tsx', status: 'done' },
                { id: '2', kind: 'run', label: 'Run tests', target: 'npm test -- retry', status: 'running' },
                { id: '3', kind: 'run', label: 'Typecheck', target: '3 errors in retry.ts', status: 'error' },
              ]}
            />
          ),
        },
        {
          id: 'error',
          label: 'error',
          render: () => (
            <ToolChips
              calls={[
                { id: '1', kind: 'read', label: 'Read', target: 'src/queue/retry.ts' },
                { id: '2', kind: 'run', label: 'Run tests', target: '2 failing', status: 'error' },
              ]}
            />
          ),
        },
      ],
    },
    {
      label: 'Data',
      states: [
        { id: 'typical', label: 'typical (every kind)', render: () => <ToolChips calls={typical} /> },
        { id: 'with-edits', label: 'with edits (3 shown)', render: () => <ToolChips calls={typical.slice(0, 5)} edits={edits.slice(0, 3)} onEditPress={() => undefined} /> },
        { id: 'edits-overflow', label: 'edits overflow (+N more)', render: () => <ToolChips calls={typical.slice(0, 5)} edits={edits} onEditPress={() => undefined} /> },
        { id: 'edits-static', label: 'edits, not pressable', render: () => <ToolChips calls={typical.slice(0, 4)} edits={edits.slice(0, 2)} /> },
        { id: 'max-edits-1', label: 'maxEdits 1', render: () => <ToolChips calls={typical.slice(0, 4)} edits={edits.slice(0, 4)} maxEdits={1} onEditPress={() => undefined} /> },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'long-target',
          label: 'long path truncates',
          render: () => (
            <ToolChips
              calls={[
                { id: '1', kind: 'edit', label: 'Write 312 lines', target: longPath },
                { id: '2', kind: 'run', label: 'Run tests', target: `npx vitest run ${longPath} --reporter=verbose`, status: 'error' },
              ]}
              edits={[{ id: 'e1', file: 'exponential-backoff-with-decorrelated-jitter.worker.ts', added: 312, removed: 118 }]}
              onEditPress={() => undefined}
            />
          ),
        },
        {
          id: 'long-label',
          label: 'long label',
          render: () => (
            <ToolChips
              calls={[
                { id: '1', kind: 'search', label: 'Search the whole workspace for every caller of the scheduler and its wrappers', target: 'scheduleRetry' },
                { id: '2', kind: 'read', label: 'Read the generated migration plan for the production cutover' },
              ]}
            />
          ),
        },
        {
          id: 'no-target',
          label: 'no target',
          render: () => (
            <ToolChips
              calls={[
                { id: '1', kind: 'thinking', label: 'Thinking' },
                { id: '2', kind: 'message', label: 'Reply' },
              ]}
            />
          ),
        },
        { id: 'custom-summary', label: 'custom summary', render: () => <ToolChips calls={typical.slice(0, 3)} summary="Investigated the retry queue" /> },
        {
          id: 'many-calls',
          label: 'many calls',
          render: () => (
            <ToolChips
              calls={Array.from({ length: 12 }, (_, i): ToolChipCall => {
                const base = typical[i % typical.length]!;
                return { ...base, id: `m${i}`, target: base.target };
              })}
            />
          ),
        },
      ],
    },
    {
      label: 'Disclosure',
      states: [
        { id: 'collapsed', label: 'collapsed', render: () => <ToolChips calls={typical.slice(0, 4)} edits={edits.slice(0, 3)} defaultOpen={false} /> },
      ],
    },
  ],
  missing: [
    'Controlled open state (only defaultOpen is exposed)',
  ],
};
export default mod;
