import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
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
  it('counts in from zero when it scrolls into view', () => {
    let cb: IntersectionObserverCallback = () => {};
    class IO {
      constructor(c: IntersectionObserverCallback) {
        cb = c;
      }
      observe() {}
      disconnect() {}
      unobserve() {}
    }
    vi.stubGlobal('IntersectionObserver', IO);
    vi.stubGlobal('requestAnimationFrame', (f: FrameRequestCallback) => {
      f(0);
      return 1;
    });
    const { container } = render(<AnimatedNumber value={347} countIn locale="en-US" />);
    const digits = () => [...container.querySelectorAll<HTMLElement>('[aria-hidden] span[style]')].map((c) => c.style.getPropertyValue('--oniva-digit'));
    expect(digits()).toEqual(['0', '0', '0']);
    act(() => cb([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(digits()).toEqual(['3', '4', '7']);
    // screen readers always get the final value
    expect(screen.getByText('347')).toBeInTheDocument();
  });
  it('applies duration, delay and per-digit stagger as custom properties', () => {
    const { container } = render(<AnimatedNumber value={12} duration={900} delay={100} digitStagger={50} locale="en-US" data-testid="n" />);
    expect(screen.getByTestId('n').style.getPropertyValue('--oniva-roll-dur')).toBe('900ms');
    const cols = [...container.querySelectorAll<HTMLElement>('[aria-hidden] span[style]')];
    expect(cols.map((c) => c.style.getPropertyValue('--oniva-roll-delay'))).toEqual(['150ms', '100ms']);
  });
  afterEach(() => vi.unstubAllGlobals());
});
