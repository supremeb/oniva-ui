import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BorderBeam } from './BorderBeam';

describe('BorderBeam', () => {
  it('renders and forwards props', () => {
    render(<BorderBeam className="x" data-testid="r">hi</BorderBeam>);
    expect(screen.getByTestId('r')).toHaveClass('x');
  });
});
