import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('has status role and label', () => {
    render(<Spinner label="Syncing transactions" />);
    expect(screen.getByRole('status', { name: 'Syncing transactions' })).toBeInTheDocument();
  });
  it('sizes the svg and forwards className', () => {
    const { container } = render(<Spinner size="xl" className="k" />);
    expect(container.querySelector('svg')).toHaveAttribute('width', '40');
    expect(screen.getByRole('status')).toHaveClass('k');
  });
});
