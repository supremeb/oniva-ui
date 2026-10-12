import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ApprovalQueue } from './ApprovalQueue';

const items = [{ id: 't1', agent: 'Billing Specialist', tool: 'stripe.refund', summary: 'Refund $740 to Acme Corp', risk: 'high' as const }];

describe('ApprovalQueue', () => {
  it('approves after the exit', async () => {
    const onApprove = vi.fn();
    render(<ApprovalQueue items={items} onApprove={onApprove} />);
    expect(screen.getByText('1 pending')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Approve: Refund $740 to Acme Corp' }));
    await waitFor(() => expect(onApprove).toHaveBeenCalledWith('t1'));
  });
  it('shows the empty state', () => {
    render(<ApprovalQueue items={[]} />);
    expect(screen.getByText(/All caught up/)).toBeInTheDocument();
  });
});
