import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Shimmer, ShimmerBlock, ShimmerText } from './Shimmer';

describe('Shimmer', () => {
  it('renders text and forwards className/ref', () => {
    let el: HTMLSpanElement | null = null;
    render(<Shimmer className="x" ref={(n) => void (el = n)}>Working</Shimmer>);
    expect(screen.getByText('Working')).toHaveClass('x');
    expect(el).toBe(screen.getByText('Working'));
  });
  it('has a static variant', () => {
    render(<Shimmer isActive={false}>Idle</Shimmer>);
    expect(screen.getByText('Idle')).toBeInTheDocument();
  });
  it('sets the pass duration and exposes ShimmerText as real text', () => {
    render(<ShimmerText duration={3}>Generating summary</ShimmerText>);
    expect(screen.getByText('Generating summary').style.getPropertyValue('--oniva-shimmer-dur')).toBe('3s');
  });
  it('renders skeleton blocks that are decorative and sized', () => {
    const { container } = render(
      <div aria-busy="true">
        <ShimmerBlock width={120} height={10} className="b" />
        <ShimmerBlock isCircle width={36} />
      </div>,
    );
    const [a, b] = [...container.querySelectorAll<HTMLElement>('[aria-hidden="true"]')];
    expect(a).toHaveClass('b');
    expect(a!.style.width).toBe('120px');
    expect(a!.style.height).toBe('10px');
    expect(b!.style.height).toBe('36px');
    expect(b!.style.borderRadius).toBe('');
  });
});
