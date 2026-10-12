import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StreamingTable } from './StreamingTable';

const columns = [
  { key: 'vendor', header: 'Vendor' },
  { key: 'amount', header: 'Amount', align: 'end' as const },
];

describe('StreamingTable', () => {
  it('renders rows and a streaming status', () => {
    render(<StreamingTable caption="Invoices" columns={columns} rows={[{ id: '1', vendor: 'Acme', amount: '$1,200' }]} getKey={(r) => r.id} isStreaming />);
    expect(screen.getByRole('table', { name: 'Invoices' })).toBeInTheDocument();
    expect(screen.getByText('Acme')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('1 so far');
  });
});
