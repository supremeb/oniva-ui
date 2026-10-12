import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders text and forwards props', () => {
    render(
      <Badge data-testid="b" className="x">
        Shipped
      </Badge>,
    );
    expect(screen.getByTestId('b')).toHaveTextContent('Shipped');
    expect(screen.getByTestId('b')).toHaveClass('x');
  });

  it('renders a decorative dot only when requested', () => {
    const { container, rerender } = render(<Badge variant="success">OK</Badge>);
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
    rerender(
      <Badge variant="success" dot>
        OK
      </Badge>,
    );
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(1);
  });

  it('varies styling per variant', () => {
    const { rerender } = render(
      <Badge data-testid="b" variant="success">
        A
      </Badge>,
    );
    const a = screen.getByTestId('b').className;
    rerender(
      <Badge data-testid="b" variant="danger">
        A
      </Badge>,
    );
    expect(screen.getByTestId('b').className).not.toBe(a);
  });
});
