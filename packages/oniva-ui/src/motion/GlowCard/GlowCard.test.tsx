import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GlowCard } from './GlowCard';

describe('GlowCard', () => {
  it('renders and forwards props', () => {
    render(<GlowCard className="x" data-testid="r">hi</GlowCard>);
    expect(screen.getByTestId('r')).toHaveClass('x');
  });
});
