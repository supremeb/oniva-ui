import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InvoiceCard } from '../../widgets/InvoiceCard';
import { Sources } from './Sources';

describe('i18n additions', () => {
  it('Sources pluralizes and accepts a label override', () => {
    const one = [{ title: 'A', url: 'https://a.com' }];
    const { rerender } = render(<Sources sources={one} />);
    expect(screen.getByText('Used 1 source')).toBeInTheDocument();
    rerender(<Sources sources={[...one, ...one]} />);
    expect(screen.getByText('Used 2 sources')).toBeInTheDocument();
    rerender(<Sources sources={one} label="1 fuente" />);
    expect(screen.getByText('1 fuente')).toBeInTheDocument();
  });
  it('InvoiceCard formats money with the locale prop', () => {
    const inv = { number: '1', status: 'due' as const, issued: '2026-01-05', due: '2026-02-05', currency: 'EUR', billTo: { name: 'B', email: 'b@x.co' }, lines: [{ description: 'x', quantity: 1, unitPrice: 1234.5 }] };
    render(<InvoiceCard invoice={inv} locale="de-DE" />);
    expect(screen.getAllByText(/1\.234,50/).length).toBeGreaterThan(0);
  });
});
