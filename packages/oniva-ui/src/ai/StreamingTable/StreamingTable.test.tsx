import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StreamingTable } from './StreamingTable';

const columns = [
  { key: 'vendor', header: 'Vendor' },
  { key: 'amount', header: 'Amount', align: 'end' as const },
];
const row = { id: '1', vendor: 'Northwind', amount: '$1,200' };
const getKey = (r: { id: string }) => r.id;

describe('StreamingTable', () => {
  it('renders rows and a streaming status', () => {
    render(<StreamingTable caption="Invoices" columns={columns} rows={[row]} getKey={getKey} isStreaming />);
    expect(screen.getByRole('table', { name: 'Invoices' })).toBeInTheDocument();
    expect(screen.getByText('Northwind')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('1 so far');
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
  });

  it('keeps the status region mounted and announces completion', () => {
    const { rerender } = render(<StreamingTable caption="Invoices" columns={columns} rows={[row]} getKey={getKey} isStreaming />);
    const status = screen.getByRole('status');
    rerender(<StreamingTable caption="Invoices" columns={columns} rows={[row]} getKey={getKey} />);
    expect(screen.getByRole('status')).toBe(status);
    expect(status).toHaveTextContent('Complete, 1 row');
  });

  it('shows an empty row only when idle with no rows', () => {
    const { rerender } = render(<StreamingTable caption="Invoices" columns={columns} rows={[]} getKey={getKey} />);
    expect(screen.getByText('No rows')).toBeInTheDocument();
    rerender(<StreamingTable caption="Invoices" columns={columns} rows={[]} getKey={getKey} isStreaming />);
    expect(screen.queryByText('No rows')).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent('0 so far');
  });
});
