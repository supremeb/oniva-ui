import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { Pricing } from './Pricing';

describe('Pricing', () => {
  it('shows three plans with monthly prices', () => {
    render(<Pricing />);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
    expect(screen.getByText('$99')).toBeInTheDocument();
  });
  it('switches to yearly prices', async () => {
    render(<Pricing />);
    await userEvent.click(screen.getByRole('radio', { name: /yearly/i }));
    expect(screen.getByText('$79')).toBeInTheDocument();
    expect(screen.getAllByText(/billed yearly/).length).toBe(3);
  });
  it('forwards className', () => {
    render(<Pricing className="x" data-testid="p" />);
    expect(screen.getByTestId('p')).toHaveClass('x');
  });
  it('renders 0/1/many plans with very long strings without throwing', () => {
    const long = 'Supercalifragilistic'.repeat(8);
    const mk = (i: number) => ({ name: `${long}${i}`, monthly: 9, yearly: 7, description: long, features: [long], cta: long });
    const { rerender } = render(<Pricing plans={[]} />);
    rerender(<Pricing plans={[mk(0)]} />);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(1);
    rerender(<Pricing plans={Array.from({ length: 50 }, (_, i) => mk(i))} />);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(50);
  });
  it('grid is container-fluid (no fixed 3 columns that overflow in narrow containers)', () => {
    const src = readFileSync('packages/oniva-ui/src/blocks/Pricing/Pricing.tsx', 'utf8');
    expect(src).not.toMatch(/repeat\(3, 1fr\)/);
    expect(src).toMatch(/auto-fit/);
    expect(src).toMatch(/overflowWrap: 'anywhere'/);
  });
});
