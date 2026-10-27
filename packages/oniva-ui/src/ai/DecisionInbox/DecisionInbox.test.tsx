import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DecisionInbox, type Decision } from './DecisionInbox';

const decisions: Decision[] = [
  { id: 'renew', title: 'Renew the design tools plan?', detail: '12 seats, $1,800 per year', primary: 'Renew', secondary: 'Change seats' },
  { id: 'refund', title: 'Approve refund for order 4821?', primary: 'Approve', secondary: 'Decline', collapsed: true },
];

afterEach(() => vi.useRealTimers());

describe('DecisionInbox', () => {
  it('announces the count in a live heading', () => {
    render(<DecisionInbox decisions={decisions} />);
    expect(screen.getByRole('heading', { name: '2 need your input' })).toHaveAttribute('aria-live', 'polite');
  });

  it('confirms an answer with a status, then folds and opens the next folded one', () => {
    vi.useFakeTimers();
    const onDecide = vi.fn();
    render(<DecisionInbox decisions={decisions} onDecide={onDecide} confirmMs={500} />);
    fireEvent.click(screen.getByRole('button', { name: 'Renew' }));
    expect(onDecide).toHaveBeenCalledWith(decisions[0], 'primary');
    expect(screen.getByRole('status')).toHaveTextContent('Renew');
    expect(screen.getByRole('heading', { name: '1 needs your input' })).toBeInTheDocument();
    act(() => void vi.advanceTimersByTime(600));
    // the folded decision is now open
    expect(screen.getByRole('button', { name: 'Approve' })).toBeInTheDocument();
  });

  it('opens a folded decision from the keyboard-reachable title button', () => {
    render(<DecisionInbox decisions={decisions} />);
    const folded = screen.getByRole('button', { name: 'Approve refund for order 4821?' });
    folded.focus();
    fireEvent.click(folded);
    expect(screen.queryByRole('button', { name: 'Approve refund for order 4821?' })).toBeNull();
  });

  it('shows all caught up and forwards ref/className', () => {
    vi.useFakeTimers();
    const ref = createRef<HTMLElement>();
    render(<DecisionInbox decisions={[decisions[0]!]} ref={ref} className="x" confirmMs={10} />);
    expect(ref.current).toHaveClass('x');
    fireEvent.click(screen.getByRole('button', { name: 'Change seats' }));
    expect(screen.getByRole('heading')).toHaveTextContent('All caught up');
  });
});
