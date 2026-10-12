import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SpotlightBeam } from './SpotlightBeam';

describe('SpotlightBeam', () => {
  it('renders and forwards props', () => {
    render(<SpotlightBeam className="x" data-testid="r">hi</SpotlightBeam>);
    expect(screen.getByTestId('r')).toHaveClass('x');
  });
});
