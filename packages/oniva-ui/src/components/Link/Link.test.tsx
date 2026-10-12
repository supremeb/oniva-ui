import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Link } from './Link';

describe('Link', () => {
  it('renders an anchor with href', () => {
    render(<Link href="/invoices" className="c">All invoices</Link>);
    const a = screen.getByRole('link', { name: 'All invoices' });
    expect(a).toHaveAttribute('href', '/invoices');
    expect(a).toHaveClass('c');
  });
  it('disabled is not an actionable link', () => {
    render(<Link href="/x" isDisabled>Nope</Link>);
    expect(screen.getByText('Nope')).toHaveAttribute('aria-disabled', 'true');
  });
  it('tone changes classes', () => {
    const { rerender } = render(<Link href="/a">a</Link>);
    const a = screen.getByRole('link').className;
    rerender(<Link href="/a" tone="muted">a</Link>);
    expect(screen.getByRole('link').className).not.toBe(a);
  });
});
