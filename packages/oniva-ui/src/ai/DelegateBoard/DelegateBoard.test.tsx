import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { DelegateBoard, type DelegateAgent, type DelegateTask } from './DelegateBoard';

const NOW = Date.UTC(2026, 9, 26, 15, 0, 0);
const agents: DelegateAgent[] = [
  { id: 'r', name: 'Researcher', model: 'Atlas 2', current: 10, rate: 0.06 },
  { id: 'w', name: 'Writer', model: 'Nova Pro', rate: 0.03 },
];
const tasks: DelegateTask[] = [
  { id: 't1', title: 'Write release notes', estimate: 12 },
  { id: 't2', title: 'Audit seat usage', estimate: 20, agentId: 'r' },
  { id: 't3', title: 'Summarize tickets', estimate: 8 },
];

afterEach(() => vi.useRealTimers());

describe('DelegateBoard', () => {
  it('lists unassigned tasks and agent queues with busy-until times', () => {
    render(<DelegateBoard agents={agents} tasks={tasks} now={NOW} />);
    expect(screen.getByRole('region', { name: 'Unassigned' })).toHaveTextContent('Write release notes');
    expect(screen.getByRole('list', { name: 'Researcher queue' })).toHaveTextContent('Audit seat usage');
    expect(screen.getByRole('region', { name: 'Researcher' })).toHaveTextContent('Busy until');
    expect(screen.getByRole('region', { name: 'Researcher' })).toHaveTextContent('$1.20');
  });

  it('hands a task over with a number key and reports it', () => {
    const onAssign = vi.fn();
    render(<DelegateBoard agents={agents} tasks={tasks} now={NOW} onAssign={onAssign} />);
    fireEvent.keyDown(screen.getByRole('button', { name: /Write release notes/ }), { key: '2' });
    expect(onAssign).toHaveBeenCalledWith('t1', 'w');
  });

  it('moves tasks itself without onAssign', () => {
    render(<DelegateBoard agents={agents} tasks={tasks} now={NOW} />);
    fireEvent.keyDown(screen.getByRole('button', { name: /Write release notes/ }), { key: '2' });
    expect(screen.getByRole('list', { name: 'Writer queue' })).toHaveTextContent('Write release notes');
  });

  it('Auto routes unassigned tasks to the least busy agent about once a second', () => {
    vi.useFakeTimers();
    render(<DelegateBoard agents={agents} tasks={tasks} now={NOW} defaultMode="auto" />);
    act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.getByRole('list', { name: 'Writer queue' })).toHaveTextContent('Write release notes');
    act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.getByRole('region', { name: 'Unassigned' })).not.toHaveTextContent('Summarize tickets');
  });

  it('exposes the Auto switch', () => {
    const onModeChange = vi.fn();
    render(<DelegateBoard agents={agents} tasks={tasks} now={NOW} onModeChange={onModeChange} />);
    fireEvent.click(screen.getByRole('switch', { name: 'Auto' }));
    expect(onModeChange).toHaveBeenCalledWith('auto');
  });

  it('forwards ref/className and passes axe', async () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<DelegateBoard ref={ref} className="x" agents={agents} tasks={tasks} now={NOW} />);
    expect(ref.current).toHaveClass('x');
    await expectNoA11yViolations(container);
  });
});
