import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatsBand } from './StatsBand';

describe('StatsBand', () => {
  it('renders each stat with its label and value for assistive tech', () => {
    render(<StatsBand className="x" data-testid="s" />);
    expect(screen.getByText('Teams in production')).toBeInTheDocument();
    expect(screen.getByText('1,860')).toBeInTheDocument();
    expect(screen.getByTestId('s')).toHaveClass('x');
  });
});
