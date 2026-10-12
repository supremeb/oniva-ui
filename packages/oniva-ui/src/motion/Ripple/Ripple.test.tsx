import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Ripple } from './Ripple';

describe('Ripple', () => {
  it('renders and forwards props', () => {
    render(<Ripple className="x" data-testid="r">hi</Ripple>);
    expect(screen.getByTestId('r')).toHaveClass('x');
  });
});
