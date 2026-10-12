import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AnimatedNumber } from './AnimatedNumber';

describe('AnimatedNumber', () => {
  it('exposes the formatted value to assistive tech once', () => {
    render(<AnimatedNumber value={1234.5} format={{ style: 'currency', currency: 'USD' }} locale="en-US" />);
    expect(screen.getByText('$1,234.50')).toBeInTheDocument();
  });
  it('drives each digit column with --oniva-digit and keeps columns on update', () => {
    const { container, rerender } = render(<AnimatedNumber value={12} locale="en-US" />);
    const cols = () => [...container.querySelectorAll<HTMLElement>('[aria-hidden] span[style]')];
    expect(cols().map((c) => c.style.getPropertyValue('--oniva-digit'))).toEqual(['1', '2']);
    const second = cols()[1]!;
    rerender(<AnimatedNumber value={19} locale="en-US" />);
    expect(cols()[1]).toBe(second);
    expect(second.style.getPropertyValue('--oniva-digit')).toBe('9');
  });
  it('forwards className', () => {
    render(<AnimatedNumber value={5} className="n" data-testid="n" />);
    expect(screen.getByTestId('n')).toHaveClass('n');
  });
});
