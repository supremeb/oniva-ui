import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CTA } from './CTA';

describe('CTA', () => {
  it('renders heading and buttons', () => {
    render(<CTA className="x" data-testid="c" />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start free/i })).toBeInTheDocument();
    expect(screen.getByTestId('c')).toHaveClass('x');
  });
  it('accepts custom labels', () => {
    render(<CTA primaryLabel="Go" secondaryLabel="Later" />);
    expect(screen.getByRole('button', { name: 'Later' })).toBeInTheDocument();
  });
});
