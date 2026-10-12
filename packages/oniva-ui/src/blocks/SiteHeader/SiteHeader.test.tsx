import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SiteHeader } from './SiteHeader';

describe('SiteHeader', () => {
  it('renders nav links and brand', () => {
    render(<SiteHeader />);
    expect(screen.getByRole('link', { name: 'Oniva home' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Pricing' }).length).toBeGreaterThan(0);
  });
  it('opens the mega menu', async () => {
    render(<SiteHeader />);
    await userEvent.click(screen.getByRole('button', { name: /product/i }));
    expect(await screen.findByRole('dialog', { name: 'Product menu' })).toBeInTheDocument();
    expect(screen.getByText('Guardrails')).toBeInTheDocument();
  });
  it('toggles the mobile menu', async () => {
    render(<SiteHeader megaMenu={false} />);
    await userEvent.click(screen.getByLabelText('Open menu'));
    expect(screen.getByRole('navigation', { name: 'Mobile', hidden: true })).toBeInTheDocument();
    expect(screen.getByLabelText('Close menu')).toHaveAttribute('aria-expanded', 'true');
  });
  it('forwards className', () => {
    render(<SiteHeader className="x" data-testid="h" />);
    expect(screen.getByTestId('h')).toHaveClass('x');
  });
});
