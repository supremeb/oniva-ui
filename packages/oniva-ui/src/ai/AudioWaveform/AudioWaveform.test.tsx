import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AudioWaveform } from './AudioWaveform';

describe('AudioWaveform', () => {
  it('renders the requested number of bars and hides from AT', () => {
    const { container } = render(<AudioWaveform bars={10} active={false} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root.children).toHaveLength(10);
  });

  it('renders no bars for zero, negative or fractional counts without throwing', () => {
    const zero = render(<AudioWaveform bars={0} active={false} />);
    expect(zero.container.firstElementChild?.children).toHaveLength(0);
    const neg = render(<AudioWaveform bars={-4} active={false} />);
    expect(neg.container.firstElementChild?.children).toHaveLength(0);
    const frac = render(<AudioWaveform bars={5.8} active={false} />);
    expect(frac.container.firstElementChild?.children).toHaveLength(5);
    const nan = render(<AudioWaveform bars={Number.NaN} active={false} />);
    expect(nan.container.firstElementChild?.children).toHaveLength(24);
  });

  it('rests every bar at the baseline when inactive', () => {
    const { container } = render(<AudioWaveform bars={6} active={false} />);
    for (const bar of Array.from(container.firstElementChild!.children)) {
      expect((bar as HTMLElement).style.transform).toBe('scaleY(0.120)');
    }
  });
});
