import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  BillingSchedule,
  billingOccurrences,
  computeBilling,
  type BillingCatalogItem,
  type BillingLine,
} from './BillingSchedule';

const catalog: BillingCatalogItem[] = [
  { id: 'setup', name: 'Set-up fee', repeat: 'once', price: 2500 },
  { id: 'seat', name: 'Platform seat', repeat: 'monthly', price: 120 },
];
const lines: BillingLine[] = [
  { id: 'a', name: 'Set-up fee', repeat: 'once', price: 2500, quantity: 1 },
  { id: 'b', name: 'Platform seat', repeat: 'monthly', price: 100, quantity: 5 },
];

describe('computeBilling', () => {
  it('counts invoices per repeat and applies discount, minimum and end date', () => {
    expect(billingOccurrences('once', 12)).toBe(1);
    expect(billingOccurrences('quarterly', 12)).toBe(4);
    expect(billingOccurrences('yearly', 24)).toBe(2);
    const t = computeBilling({
      phase: 'P',
      start: '2026-01-01',
      durationMonths: 12,
      lines,
      discountPercent: 10,
      minimum: 10000,
    });
    expect(t.subtotal).toBe(2500 + 100 * 5 * 12);
    expect(t.discount).toBe(850);
    expect(t.minimumTopUp).toBe(10000 - 7650);
    expect(t.total).toBe(10000);
    expect(t.endDate).toBe('2026-12-31');
  });
});

describe('BillingSchedule', () => {
  it('renders lines with live totals and removes a line', async () => {
    const onChange = vi.fn();
    render(<BillingSchedule defaultLines={lines} defaultStart="2026-01-01" onChange={onChange} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByText('$8,500.00').length).toBeGreaterThan(0);
    await userEvent.click(screen.getByRole('button', { name: 'Remove Platform seat' }));
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls.at(-1)?.[1].total).toBe(2500);
    expect(screen.queryByText('Platform seat')).toBeNull();
  });

  it('adds a product from the catalog', async () => {
    render(<BillingSchedule catalog={catalog} />);
    expect(screen.getByText(/No products yet/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Add product' }));
    await userEvent.click(await screen.findByRole('menuitem', { name: /Platform seat/ }));
    const table = screen.getByRole('table');
    expect(within(table).getByText('Platform seat')).toBeInTheDocument();
  });

  it('forwards ref and className', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<BillingSchedule ref={ref} className="extra" />);
    expect(ref.current).toHaveClass('extra');
  });
});
