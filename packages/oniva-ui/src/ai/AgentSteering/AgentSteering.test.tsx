import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { AgentSteering, type SteerStep } from './AgentSteering';

const steps: SteerStep[] = [
  { id: '1', title: 'Read the schema', status: 'done', duration: '4s' },
  { id: '2', title: 'Write the migration', status: 'active', startedAt: 1000, notes: [{ id: 'n0', text: 'Keep it reversible', picked: 'next' }] },
  { id: '3', title: 'Run on staging', status: 'pending' },
];

describe('AgentSteering', () => {
  it('renders the plan with the active step marked', () => {
    render(<AgentSteering title="Migrate users" steps={steps} now={9000} startedAt={0} />);
    const plan = screen.getByRole('list', { name: 'Plan' });
    expect(plan.querySelector('[aria-current="step"]')).toHaveTextContent('Write the migration');
    expect(screen.getByText('Keep it reversible')).toBeInTheDocument();
    expect(screen.getByText(/Running · 9s/)).toBeInTheDocument();
  });

  it('queues on Enter, interrupts on Mod+Enter, Esc clears', () => {
    const onQueue = vi.fn();
    const onInterrupt = vi.fn();
    render(<AgentSteering title="Migrate" steps={steps} onQueue={onQueue} onInterrupt={onInterrupt} now={0} />);
    const field = screen.getByRole('textbox', { name: 'Steer the agent' });
    fireEvent.change(field, { target: { value: 'Skip the audit table' } });
    fireEvent.keyDown(field, { key: 'Enter' });
    expect(onQueue).toHaveBeenCalledWith('Skip the audit table');
    fireEvent.change(field, { target: { value: 'Stop and ask' } });
    fireEvent.keyDown(field, { key: 'Enter', ctrlKey: true });
    expect(onInterrupt).toHaveBeenCalledWith('Stop and ask');
    fireEvent.change(field, { target: { value: 'draft' } });
    fireEvent.keyDown(field, { key: 'Escape' });
    expect(field).toHaveValue('');
  });

  it('removes and applies queued notes; pause/resume buttons', () => {
    const onRemove = vi.fn();
    const onInterrupt = vi.fn();
    const onPause = vi.fn();
    render(<AgentSteering title="Migrate" steps={steps} queue={[{ id: 'q1', text: 'Use batches' }]} onRemove={onRemove} onInterrupt={onInterrupt} onPause={onPause} now={0} />);
    fireEvent.click(screen.getByRole('button', { name: 'Now' }));
    expect(onInterrupt).toHaveBeenCalledWith('Use batches', 'q1');
    fireEvent.click(screen.getByRole('button', { name: 'Remove “Use batches”' }));
    expect(onRemove).toHaveBeenCalledWith('q1');
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    expect(onPause).toHaveBeenCalled();
  });

  it('closes the field when done; forwards ref/className; axe', async () => {
    const ref = createRef<HTMLDivElement>();
    const { container, rerender } = render(<AgentSteering ref={ref} className="x" title="Migrate" steps={steps} onQueue={() => {}} now={0} />);
    expect(ref.current).toHaveClass('x');
    await expectNoA11yViolations(container);
    rerender(<AgentSteering title="Migrate" steps={steps} status="done" now={0} />);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
