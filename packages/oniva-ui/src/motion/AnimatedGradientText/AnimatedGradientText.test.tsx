import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AnimatedGradientText } from './AnimatedGradientText';

describe('AnimatedGradientText', () => {
  it('renders and forwards props', () => {
    render(<AnimatedGradientText className="x">hi</AnimatedGradientText>);
    expect(screen.getByText('hi')).toHaveClass('x');
  });
  it('accepts custom colours, speed and element', () => {
    render(
      <AnimatedGradientText as="h2" speed={3} colors={['#111111', '#222222']} data-testid="g">
        hi
      </AnimatedGradientText>,
    );
    const el = screen.getByTestId('g');
    expect(el.tagName).toBe('H2');
    expect(el.style.getPropertyValue('--oniva-gt-dur')).toBe('3s');
    expect(el.style.backgroundImage).toContain('rgb(17, 17, 17)');
  });
  it('keeps the text real and visible with sweep when IntersectionObserver is unavailable', () => {
    render(<AnimatedGradientText sweep>feel</AnimatedGradientText>);
    expect(screen.getByText('feel')).toBeVisible();
  });
  it('holds the sweep until first seen', () => {
    class IO {
      observe() {}
      disconnect() {}
      unobserve() {}
    }
    vi.stubGlobal('IntersectionObserver', IO);
    render(<AnimatedGradientText sweep data-testid="g">feel</AnimatedGradientText>);
    expect(screen.getByTestId('g')).toHaveAttribute('data-paused');
    vi.unstubAllGlobals();
  });
});
