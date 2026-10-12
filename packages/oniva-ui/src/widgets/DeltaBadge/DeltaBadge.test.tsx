import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DeltaBadge } from './DeltaBadge';

describe('DeltaBadge', () => {
  it('formats positive, negative and flat values', () => {
    render(
      <>
        <DeltaBadge value={14.8} data-testid="up" />
        <DeltaBadge value={-3.2} data-testid="down" />
        <DeltaBadge value={0} data-testid="flat" />
      </>,
    );
    expect(screen.getByTestId('up')).toHaveTextContent('+14.8%');
    expect(screen.getByTestId('down')).toHaveTextContent('−3.2%');
    expect(screen.getByTestId('flat')).toHaveTextContent('0.0%');
  });

  it('inverts good/bad and forwards ref/className', () => {
    let el: HTMLElement | null = null;
    const { rerender } = render(<DeltaBadge value={-2} data-testid="d" />);
    const bad = screen.getByTestId('d').className;
    rerender(
      <DeltaBadge
        value={-2}
        invert
        data-testid="d"
        className="x"
        ref={(n) => {
          el = n;
        }}
      />,
    );
    expect(screen.getByTestId('d').className).not.toBe(bad);
    expect(screen.getByTestId('d').className).toContain('x');
    expect(el).toBeInstanceOf(HTMLElement);
  });
});
