import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { InvoiceCard, invoiceTotals, type Invoice } from './InvoiceCard';
import { expectNoA11yViolations } from '../../internal/test-a11y';

const inv: Invoice = {
  number: 'INV-1',
  status: 'due',
  issued: '2026-10-01',
  due: '2026-10-31',
  taxRate: 0.1,
  billTo: { name: 'Acme', email: 'a@acme.io' },
  lines: [{ description: 'Seats', quantity: 2, unitPrice: 50 }],
};

describe('InvoiceCard', () => {
  it('computes totals', () => {
    expect(invoiceTotals(inv)).toEqual({ subtotal: 100, tax: 10, total: 110 });
  });
  it('renders and pays', async () => {
    const onPay = vi.fn();
    render(<InvoiceCard invoice={inv} onPay={onPay} className="x" data-testid="c" />);
    expect(screen.getByTestId('c')).toHaveClass('x');
    await userEvent.click(screen.getByRole('button', { name: 'Pay $110.00' }));
    expect(onPay).toHaveBeenCalled();
  });
  it('hides pay when paid', () => {
    render(<InvoiceCard invoice={{ ...inv, status: 'paid' }} />);
    expect(screen.queryByRole('button', { name: /^Pay/ })).toBeNull();
  });
  it('has no a11y violations', async () => {
    const { container } = render(<InvoiceCard invoice={inv} />);
    await expectNoA11yViolations(container);
  });
});
