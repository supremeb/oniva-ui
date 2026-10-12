import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Separator } from './Separator';

describe('Separator', () => {
  it('renders a separator with orientation', () => {
    render(<Separator orientation="vertical" className="x" />);
    const el = screen.getByRole('separator');
    expect(el).toHaveAttribute('aria-orientation', 'vertical');
    expect(el).toHaveClass('x');
  });
  it('differs by orientation and strength', () => {
    const { rerender } = render(<Separator />);
    const a = screen.getByRole('separator').className;
    rerender(<Separator orientation="vertical" strong />);
    expect(screen.getByRole('separator').className).not.toBe(a);
  });
  it('forwards ref', () => {
    let el: HTMLElement | null = null;
    render(
      <Separator
        ref={(n) => {
          el = n;
        }}
      />,
    );
    expect(el).not.toBeNull();
  });
});
