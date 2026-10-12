import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SpotlightCard } from './SpotlightCard';

describe('SpotlightCard', () => {
  it('renders and forwards props', () => {
    render(<SpotlightCard className="x" data-testid="r">hi</SpotlightCard>);
    expect(screen.getByTestId('r')).toHaveClass('x');
  });
});
