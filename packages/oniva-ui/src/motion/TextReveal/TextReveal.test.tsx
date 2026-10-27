import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TextReveal } from './TextReveal';

describe('TextReveal', () => {
  it('keeps existing word nodes when text is appended', () => {
    const { rerender, container } = render(<TextReveal text="hello world" className="t" />);
    const hello = screen.getByText('hello');
    expect(container.firstElementChild).toHaveClass('t');
    rerender(<TextReveal text="hello world again" className="t" />);
    expect(screen.getByText('hello')).toBe(hello);
    expect(screen.getByText('again').style.getPropertyValue('--oniva-delay')).toBe('0ms');
    expect(container.textContent).toBe('hello world again');
  });
  it('splits into letters, keeps words unbreakable and exposes one sr copy', () => {
    const { container } = render(<TextReveal text="Hi you" by="char" as="h2" />);
    expect(container.firstElementChild!.tagName).toBe('H2');
    const letters = container.querySelectorAll('[aria-hidden="true"] [style]');
    expect(letters).toHaveLength(5);
    expect((letters[2] as HTMLElement).style.getPropertyValue('--oniva-delay')).toBe('120ms');
    expect(screen.getByText('Hi you')).toBeInTheDocument();
  });
  it('applies delay, duration and rise as custom properties', () => {
    render(<TextReveal text="a b" delayMs={200} durationMs={700} rise={0.4} data-testid="r" />);
    expect(screen.getByTestId('r').style.getPropertyValue('--oniva-reveal-dur')).toBe('700ms');
    expect(screen.getByTestId('r').style.getPropertyValue('--oniva-reveal-rise')).toBe('0.4em');
    expect(screen.getByText('b').style.getPropertyValue('--oniva-delay')).toBe('260ms');
  });
  it('holds the reveal until it is in view', () => {
    class IO {
      observe() {}
      disconnect() {}
      unobserve() {}
    }
    vi.stubGlobal('IntersectionObserver', IO);
    render(<TextReveal text="wait for it" onView data-testid="r" />);
    expect(screen.getByTestId('r')).toHaveAttribute('data-reveal', 'held');
    expect(screen.getByTestId('r').style.getPropertyValue('--oniva-reveal-play')).toBe('paused');
    vi.unstubAllGlobals();
  });
});
