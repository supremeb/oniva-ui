import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { ParallelAttempts, type Attempt } from './ParallelAttempts';

const attempts: Attempt[] = [
  { id: 'a', name: 'Atlas 2', approach: 'Retry with backoff', status: 'running', progress: 0.6, step: 'Running tests 12/20' },
  { id: 'b', name: 'Nova Pro', approach: 'Mock the payments API', status: 'done', score: 94, note: '20/20 runs green', took: 125000, cost: 0.27 },
  { id: 'c', name: 'Lumen Fast', approach: 'Fake timers', status: 'done', score: 71, note: '17/20 runs green', took: 61000, cost: 0.08 },
  { id: 'd', name: 'Quill Reasoner', approach: 'Rewrite the test', status: 'failed', progress: 0.3, note: 'Timed out after 120s' },
];

describe('ParallelAttempts', () => {
  it('marks the best attempt and picks it by default', async () => {
    const { container } = render(<ParallelAttempts attempts={attempts} task="Fix the flaky checkout test" />);
    expect(screen.getByText('Best')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Nova Pro/ })).toBeChecked();
    expect(screen.getByText('Running tests 12/20')).toBeInTheDocument();
    expect(screen.getByText('Timed out after 120s')).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  it('switches the pick and reports it', () => {
    const onPick = vi.fn();
    render(<ParallelAttempts attempts={attempts} onPick={onPick} />);
    fireEvent.click(screen.getByRole('radio', { name: /Lumen Fast/ }));
    expect(onPick).toHaveBeenCalledWith(expect.objectContaining({ id: 'c' }));
    expect(screen.getByRole('radio', { name: /Lumen Fast/ })).toBeChecked();
  });

  it('only finished attempts are radios', () => {
    render(<ParallelAttempts attempts={attempts} />);
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ParallelAttempts attempts={attempts} ref={ref} className="x" />);
    expect(ref.current).toHaveClass('x');
  });
});
