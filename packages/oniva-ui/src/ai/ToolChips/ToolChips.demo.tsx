import { RotateCcwIcon } from '../../icons/IconSet';
import { useEffect, useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../../components/Button';
import { ToolChips, type ToolChipCall, type ToolChipEdit } from './ToolChips';

const calls: ToolChipCall[] = [
  { id: '1', kind: 'thinking', label: 'Thinking', target: 'Planning the churn schedule…' },
  { id: '2', kind: 'edit', label: 'Write 204 lines', target: 'ChurnSchedule.tsx' },
  { id: '3', kind: 'run', label: 'Rebuild and verify', target: 'npm run freeze' },
  { id: '4', kind: 'read', label: 'Read image', target: 'flavor-chart.png' },
];

const edits: ToolChipEdit[] = [
  { id: 'e1', file: 'flavors.css', added: 13, removed: 0 },
  { id: 'e2', file: 'ChurnSchedule.tsx', added: 74, removed: 41 },
  { id: 'e3', file: 'menu.ts', added: 8, removed: 2 },
  { id: 'e4', file: 'suppliers.ts', added: 5, removed: 5 },
  { id: 'e5', file: 'README.md', added: 3, removed: 0 },
];

function Live() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step >= calls.length * 2) return;
    const id = setTimeout(() => setStep((s) => s + 1), step === 0 ? 500 : 1100);
    return () => clearTimeout(id);
  }, [step]);
  // Call n starts running at step 2n, finishes at step 2n + 1.
  const visible: ToolChipCall[] = calls.slice(0, Math.min(calls.length, Math.floor(step / 2) + 1)).map((c, i) => ({
    ...c,
    status: step >= i * 2 + 1 ? 'done' : 'running',
  }));
  const finished = step >= calls.length * 2;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start', width: '100%' }}>
      <ToolChips calls={visible} edits={finished ? edits : []} summary={finished ? `${calls.length} tool calls, 2 messages` : 'Working…'} />
      <Button size="sm" variant="secondary" isDisabled={!finished} onPress={() => setStep(0)}>
        <RotateCcwIcon size={14} aria-hidden="true" /> Replay
      </Button>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Tool chips',
    slug: 'tool-chips',
    category: 'AI & Agent',
    description: 'Tool calls and code edits as compact chips: icon, verb and a monospace detail per call, then a diff chip per file.',
  },
  demos: [
    {
      name: 'Tool calls and file edits',
      code: `<ToolChips
  summary="4 tool calls, 2 messages"
  calls={[{ id: '2', kind: 'edit', label: 'Write 204 lines', target: 'ChurnSchedule.tsx' }]}
  edits={[{ id: 'e2', file: 'ChurnSchedule.tsx', added: 74, removed: 41 }]}
/>`,
      Component: () => <ToolChips calls={calls} edits={edits} summary="4 tool calls, 2 messages" onEditPress={() => {}} />,
    },
    {
      name: 'Live run',
      code: `<ToolChips calls={calls.map((c) => ({ ...c, status: 'running' | 'done' }))} edits={edits} />`,
      Component: Live,
    },
    {
      name: 'With a failure',
      code: `<ToolChips calls={[…, { id: '3', kind: 'run', label: 'Run tests', target: '2 failing', status: 'error' }]} />`,
      Component: () => (
        <ToolChips
          defaultOpen
          calls={[
            { id: '1', kind: 'read', label: 'Read', target: 'retry.ts' },
            { id: '2', kind: 'run', label: 'Run tests', target: '2 failing', status: 'error' },
          ]}
        />
      ),
    },
  ],
};

export default demo;
