import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { ConflictRadar, findConflictAgents, type RadarAgent, type RadarFile } from './ConflictRadar';

const agents: RadarAgent[] = [
  { id: 'a', name: 'Atlas', model: 'branch/atlas', status: 'done' },
  { id: 'b', name: 'Nova', model: 'branch/nova', status: 'done' },
];
const files: RadarFile[] = [
  { path: 'src/cart.ts', edits: [{ agentId: 'a', lines: [10, 40], summary: 'Moves totals into a helper' }, { agentId: 'b', lines: [30, 60], summary: 'Rewrites totals inline' }] },
  { path: 'src/ui.ts', edits: [{ agentId: 'a', lines: [1, 5] }, { agentId: 'b', lines: [50, 60] }] },
];

describe('ConflictRadar', () => {
  it('detects only overlapping edits by different agents', () => {
    expect(findConflictAgents(files[0]!).sort()).toEqual(['a', 'b']);
    expect(findConflictAgents(files[1]!)).toEqual([]);
  });

  it('renders a table with agents as column headers', async () => {
    const { container } = render(<ConflictRadar agents={agents} files={files} />);
    expect(screen.getAllByRole('columnheader')).toHaveLength(3);
    expect(screen.getByRole('button', { name: /cart\.ts/ })).toHaveAttribute('aria-pressed', 'true');
    await expectNoA11yViolations(container);
  });

  it('keeps Merge disabled until every conflict is settled', () => {
    const onMerge = vi.fn();
    const onResolve = vi.fn();
    render(<ConflictRadar agents={agents} files={files} onMerge={onMerge} onResolve={onResolve} />);
    const merge = screen.getByRole('button', { name: /Merge/ });
    expect(merge).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /cart\.ts/ }));
    fireEvent.click(screen.getByRole('radio', { name: /Nova/ }));
    expect(onResolve).toHaveBeenCalledWith('src/cart.ts', 'b');
    expect(merge).toBeEnabled();
    expect(screen.getByText(/settled/i)).toBeInTheDocument();
    fireEvent.click(merge);
    expect(onMerge).toHaveBeenCalled();
  });

  it('keeps Merge disabled while an agent is running', () => {
    render(<ConflictRadar agents={[{ ...agents[0]!, status: 'running' }, agents[1]!]} files={[files[1]!]} />);
    expect(screen.getByRole('button', { name: /Merge/ })).toBeDisabled();
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ConflictRadar agents={agents} files={files} ref={ref} className="x" />);
    expect(ref.current).toHaveClass('x');
  });
});
