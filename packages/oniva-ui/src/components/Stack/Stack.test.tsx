import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stack } from './Stack';

describe('Stack', () => {
  it('renders children and differs when horizontal', () => {
    const { rerender } = render(
      <Stack data-testid="s">
        <span>a</span>
        <span>b</span>
      </Stack>,
    );
    const a = screen.getByTestId('s').className;
    expect(screen.getByTestId('s').children).toHaveLength(2);
    rerender(
      <Stack data-testid="s" horizontal gap={4}>
        <span>a</span>
      </Stack>,
    );
    expect(screen.getByTestId('s').className).not.toBe(a);
  });
  it('forwards className', () => {
    render(
      <Stack data-testid="s" className="k">
        x
      </Stack>,
    );
    expect(screen.getByTestId('s')).toHaveClass('k');
  });
});
