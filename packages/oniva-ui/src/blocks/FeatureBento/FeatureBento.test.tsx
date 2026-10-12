import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FeatureBento } from './FeatureBento';

describe('FeatureBento', () => {
  it('renders heading and cells', () => {
    render(<FeatureBento className="x" data-testid="s" />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Always on')).toBeInTheDocument();
    expect(screen.getByTestId('s')).toHaveClass('x');
  });
});
