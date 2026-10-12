import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ScrollArea } from './ScrollArea';

describe('ScrollArea', () => {
  it('renders a focusable labelled region with content and max height', () => {
    render(
      <ScrollArea aria-label="Activity" maxHeight={120} className="x">
        <p>Invoice paid</p>
      </ScrollArea>,
    );
    const r = screen.getByRole('region', { name: 'Activity' });
    expect(r).toHaveAttribute('tabindex', '0');
    expect(r).toHaveClass('x');
    expect(r.style.maxHeight).toBe('120px');
    expect(screen.getByText('Invoice paid')).toBeInTheDocument();
  });
  it('orientation changes classes; ref forwarded', () => {
    let el: HTMLDivElement | null = null;
    const { rerender } = render(<ScrollArea aria-label="a" ref={(n) => { el = n; }}>x</ScrollArea>);
    const a = screen.getByRole('region').className;
    expect(el).toBeInstanceOf(HTMLDivElement);
    rerender(<ScrollArea aria-label="a" orientation="horizontal" ref={(n) => { el = n; }}>x</ScrollArea>);
    expect(screen.getByRole('region').className).not.toBe(a);
  });
});
