import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FeatureGrid } from './FeatureGrid';

describe('FeatureGrid', () => {
  it('renders default features under an h2', () => {
    render(<FeatureGrid />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 }).length).toBeGreaterThanOrEqual(6);
  });
  it('accepts custom features and className', () => {
    render(<FeatureGrid className="x" data-testid="s" features={[{ title: 'One', description: 'First' }]} />);
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByTestId('s')).toHaveClass('x');
  });
});
