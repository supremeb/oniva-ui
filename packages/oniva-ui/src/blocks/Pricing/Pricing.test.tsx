import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
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
});
