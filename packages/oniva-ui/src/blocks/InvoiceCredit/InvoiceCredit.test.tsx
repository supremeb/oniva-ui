import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { InvoiceCredit } from './InvoiceCredit';

describe('InvoiceCredit', () => {
  it('shows the invoice with totals and hides the credit sheet from assistive tech', () => {
    const { container } = render(<InvoiceCredit />);
    expect(screen.getByRole('article', { name: 'Invoice INV-2026-0418' })).toBeInTheDocument();
    expect(screen.getByText('$3,194.64', { selector: 'dd' })).toBeInTheDocument();
    const credit = container.querySelector('article[aria-label^="Credit note"]')!;
    expect(credit).toHaveAttribute('aria-hidden', 'true');
    expect(credit).toHaveAttribute('inert');
  });
  it('switches to the credit note, picks a line and issues it', async () => {
    const onIssue = vi.fn();
    render(<InvoiceCredit onIssue={onIssue} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Credit note' }));
    expect(screen.getByRole('button', { name: 'Issue credit note' })).toBeDisabled();
    await userEvent.click(screen.getByRole('checkbox', { name: 'Onboarding workshop' }));
    expect(screen.getByRole('status')).toHaveTextContent('Credit total $1,296.00');
    await userEvent.click(screen.getByRole('button', { name: 'Issue credit note' }));
    expect(onIssue).toHaveBeenCalledWith({ l3: 1200 }, 1296);
    expect(screen.getByText(/Issued as CN-2026-0047/)).toBeInTheDocument();
  });
  it('clamps amounts to the line total', async () => {
    render(<InvoiceCredit />);
    await userEvent.click(screen.getByRole('radio', { name: 'Credit note' }));
    await userEvent.click(screen.getByRole('checkbox', { name: 'Onboarding workshop' }));
    const input = screen.getByRole('textbox', { name: 'Credit amount for Onboarding workshop' });
    await userEvent.clear(input);
    await userEvent.type(input, '99999{Enter}');
    expect(screen.getByRole('status')).toHaveTextContent('Credit total $1,296.00');
  });
  it('forwards ref and className', () => {
    const ref = vi.fn();
    render(<InvoiceCredit ref={ref} className="x" data-testid="i" />);
    expect(ref).toHaveBeenCalled();
    expect(screen.getByTestId('i')).toHaveClass('x');
  });
});
