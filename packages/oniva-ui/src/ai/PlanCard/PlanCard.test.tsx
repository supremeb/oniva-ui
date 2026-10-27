import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PlanCard } from './PlanCard';

const steps = [
  { id: 'a', title: 'Read diff' },
  { id: 'b', title: 'Write review' },
];

describe('PlanCard', () => {
  it('approves the plan', () => {
    const onApprove = vi.fn();
    render(<PlanCard steps={steps} onApprove={onApprove} />);
    fireEvent.click(screen.getByRole('button', { name: 'Approve plan' }));
    expect(onApprove).toHaveBeenCalledWith(steps);
    expect(screen.getByRole('status')).toHaveTextContent('Plan approved');
  });
  it('edits a step', () => {
    const onChange = vi.fn();
    render(<PlanCard steps={steps} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.change(screen.getByLabelText('Step 1'), { target: { value: 'Read the full diff' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(onChange.mock.calls[0]![0][0].title).toBe('Read the full diff');
  });
});

describe('PlanCard improvements', () => {
  it('reorders with the buttons and reports every change', () => {
    const onChange = vi.fn();
    render(<PlanCard steps={steps} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Move step 1 down' }));
    expect(onChange.mock.calls[0]![0].map((s: { id: string }) => s.id)).toEqual(['b', 'a']);
    expect(screen.getByLabelText('Step 1')).toHaveValue('Write review');
  });

  it('removes and adds steps', () => {
    const onChange = vi.fn();
    render(<PlanCard steps={steps} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Remove step 2' }));
    expect(onChange.mock.calls[0]![0]).toHaveLength(1);
    fireEvent.change(screen.getByLabelText('Add a step'), { target: { value: 'Post to channel' } });
    fireEvent.click(screen.getByRole('button', { name: /Add$/ }));
    expect(onChange.mock.calls[1]![0].map((s: { title: string }) => s.title)).toEqual(['Read diff', 'Post to channel']);
  });

  it('Alt+ArrowDown moves the focused step; Delete removes it', () => {
    const onChange = vi.fn();
    render(<PlanCard steps={steps} onChange={onChange} />);
    const first = screen.getByText('Read diff').closest('li')!;
    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowDown', altKey: true });
    expect(onChange.mock.calls[0]![0].map((s: { id: string }) => s.id)).toEqual(['b', 'a']);
    fireEvent.keyDown(screen.getByText('Write review').closest('li')!, { key: 'Delete' });
    expect(onChange.mock.calls[1]![0].map((s: { id: string }) => s.id)).toEqual(['a']);
  });

  it('Run plan passes the final order to onRun', () => {
    const onRun = vi.fn();
    render(<PlanCard steps={steps} onRun={onRun} />);
    fireEvent.click(screen.getByRole('button', { name: 'Run plan' }));
    expect(onRun).toHaveBeenCalledWith(steps);
  });

  it('shows live timers while running and retries from a failed step', () => {
    vi.useFakeTimers();
    const onRetry = vi.fn();
    const run = [
      { id: 'a', title: 'Read diff', status: 'done' as const, duration: 1200 },
      { id: 'b', title: 'Write review', status: 'active' as const },
      { id: 'c', title: 'Post', status: 'pending' as const },
    ];
    const { rerender } = render(<PlanCard steps={run} status="running" onRetry={onRetry} />);
    expect(screen.getByText('1.2s')).toBeInTheDocument();
    expect(screen.getByText(/Running · 1 of 3/)).toBeInTheDocument();
    expect(screen.getByText('Write review').closest('li')).toHaveAttribute('aria-current', 'step');
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText('2.0s')).toBeInTheDocument();
    rerender(<PlanCard steps={[run[0]!, { ...run[1]!, status: 'failed', error: 'Rate limited' }, run[2]!]} status="running" onRetry={onRetry} />);
    fireEvent.click(screen.getByRole('button', { name: /Retry from here/ }));
    expect(onRetry).toHaveBeenCalledWith('b');
    expect(screen.getByText('Rate limited')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('forwards ref and className', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<PlanCard steps={steps} ref={ref} className="x" />);
    expect(ref.current).toHaveClass('x');
  });
});
