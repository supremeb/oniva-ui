import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ToolChips, type ToolChipCall, type ToolChipEdit } from './ToolChips';

const calls: ToolChipCall[] = [
  { id: '1', kind: 'edit', label: 'Write 204 lines', target: 'ChurnSchedule.tsx' },
  { id: '2', kind: 'run', label: 'Rebuild', target: 'npm run freeze', status: 'running' },
];
const edits: ToolChipEdit[] = [1, 2, 3, 4].map((n) => ({ id: `e${n}`, file: `f${n}.ts`, added: n, removed: 0 }));

describe('ToolChips', () => {
  it('summarises calls and toggles', () => {
    render(<ToolChips calls={calls} />);
    const b = screen.getByRole('button', { name: /2 tool calls/ });
    expect(b).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(b);
    expect(b).toHaveAttribute('aria-expanded', 'false');
  });
  it('flags a running call for assistive tech', () => {
    render(<ToolChips calls={calls} />);
    expect(screen.getByText(/\(running\)/)).toBeInTheDocument();
  });
  it('caps diff chips and reveals the rest', () => {
    render(<ToolChips calls={calls} edits={edits} maxEdits={2} />);
    expect(screen.getAllByRole('button', { name: /added/ })).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: '+2 more' }));
    expect(screen.getAllByRole('button', { name: /added/ })).toHaveLength(4);
  });
  it('reports a pressed edit', () => {
    const onEditPress = vi.fn();
    render(<ToolChips calls={calls} edits={edits} onEditPress={onEditPress} />);
    fireEvent.click(screen.getByRole('button', { name: /f1\.ts/ }));
    expect(onEditPress).toHaveBeenCalledWith(edits[0]);
  });
  it('renders an empty list as a static, non-expandable header', () => {
    render(<ToolChips calls={[]} />);
    const b = screen.getByRole('button', { name: /0 tool calls/ });
    expect(b).toBeDisabled();
    expect(b).not.toHaveAttribute('aria-expanded');
  });
  it('keeps the header interactive when only edits exist', () => {
    render(<ToolChips calls={[]} edits={edits} />);
    expect(screen.getByRole('button', { name: /0 tool calls/ })).toHaveAttribute('aria-expanded', 'true');
  });
});
