import { render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it } from 'vitest';
import { SlidingIndicator } from './SlidingIndicator';

function Strip({ active }: { active: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} role="tablist">
      <SlidingIndicator containerRef={ref} activeKey={active} data-testid="pill" className="p" />
      <button role="tab" aria-selected={active === 'a'}>a</button>
      <button role="tab" aria-selected={active === 'b'}>b</button>
    </div>
  );
}

describe('SlidingIndicator', () => {
  it('renders an aria-hidden pill that follows the active item', () => {
    const { rerender } = render(<Strip active="a" />);
    const pill = screen.getByTestId('pill');
    expect(pill).toHaveAttribute('aria-hidden', 'true');
    expect(pill).toHaveClass('p');
    expect(pill.style.getPropertyValue('--oniva-indicator-x')).toBe('0px');
    rerender(<Strip active="b" />);
    expect(screen.getByTestId('pill')).toBeInTheDocument();
  });
});
