import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ShineBorder } from './ShineBorder';

describe('ShineBorder', () => {
  it('renders and forwards props', () => {
    render(<ShineBorder className="x" data-testid="r">hi</ShineBorder>);
    expect(screen.getByTestId('r')).toHaveClass('x');
  });
});
