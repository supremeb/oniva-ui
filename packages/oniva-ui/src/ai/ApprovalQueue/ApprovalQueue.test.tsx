import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ApprovalQueue } from './ApprovalQueue';

const items = [{ id: 't1', agent: 'Billing Specialist', tool: 'payments.refund', summary: 'Refund $740 to Northwind Labs', risk: 'high' as const, args: '{ "amount": 74000 }' }];

describe('ApprovalQueue', () => {
  it('approves after the exit', async () => {
    const onApprove = vi.fn();
    render(<ApprovalQueue items={items} onApprove={onApprove} />);
    expect(screen.getByText('1 pending')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Approve: Refund $740 to Northwind Labs' }));
    await waitFor(() => expect(onApprove).toHaveBeenCalledWith('t1'));
  });
  it('shows the empty state', () => {
    render(<ApprovalQueue items={[]} />);
    expect(screen.getByText(/All caught up/)).toBeInTheDocument();
  });
  it('announces the pending count politely and formats it', () => {
    render(<ApprovalQueue items={items} />);
    const live = screen.getByText('1 pending').closest('[aria-live]');
    expect(live).toHaveAttribute('aria-live', 'polite');
  });
  it('makes long arguments a focusable, named, scrollable group', () => {
    render(<ApprovalQueue items={items} />);
    const args = screen.getByRole('group', { name: 'Arguments: Refund $740 to Northwind Labs' });
    expect(args).toHaveAttribute('tabindex', '0');
    expect(args).toHaveTextContent('"amount": 74000');
  });
  it('denies after the exit', async () => {
    const onDeny = vi.fn();
    render(<ApprovalQueue items={items} onDeny={onDeny} />);
    fireEvent.click(screen.getByRole('button', { name: 'Deny: Refund $740 to Northwind Labs' }));
    await waitFor(() => expect(onDeny).toHaveBeenCalledWith('t1'));
  });
});
