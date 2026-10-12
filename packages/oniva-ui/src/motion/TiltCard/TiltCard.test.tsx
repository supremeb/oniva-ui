import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TiltCard } from './TiltCard';

describe('TiltCard', () => {
  it('renders and forwards props', () => {
    render(<TiltCard className="x" data-testid="r">hi</TiltCard>);
    expect(screen.getByTestId('r')).toHaveClass('x');
  });
});
