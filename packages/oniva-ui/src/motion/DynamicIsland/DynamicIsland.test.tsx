import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DynamicIsland } from './DynamicIsland';

describe('DynamicIsland', () => {
  it('renders and forwards props', () => {
    render(<DynamicIsland state="expanded" compact="c" expanded="e" split="s" data-testid="r" />);
    expect(screen.getByTestId('r')).toHaveAttribute('data-state', 'expanded');
  });
});
