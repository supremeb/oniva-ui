import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Sparkline } from './Sparkline';

describe('Sparkline', () => {
  it('describes the trend', () => {
    render(<Sparkline data={[1, 2, 5]} />);
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', expect.stringContaining('up'));
  });
  it('renders bars for the bar variant and forwards className/ref', () => {
    let el: SVGSVGElement | null = null;
    const { container } = render(
      <Sparkline
        variant="bar"
        data={[3, 1, 2, 4]}
        className="x"
        ref={(n) => {
          el = n;
        }}
      />,
    );
    expect(container.querySelectorAll('rect')).toHaveLength(4);
    expect(el).toHaveClass('x');
  });
});
