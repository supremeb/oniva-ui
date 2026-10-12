import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RingProgress } from './RingProgress';

describe('RingProgress', () => {
  it('exposes progressbar semantics', () => {
    render(<RingProgress aria-label="Onboarding" value={60} />);
    const pb = screen.getByRole('progressbar', { name: 'Onboarding' });
    expect(pb).toHaveAttribute('aria-valuenow', '60');
  });
  it('renders custom centre content and offsets the arc', () => {
    const { container } = render(
      <RingProgress aria-label="Setup" value={3} maxValue={7} diameter={40}>
        4
      </RingProgress>,
    );
    expect(screen.getByText('4')).toBeInTheDocument();
    const arc = container.querySelectorAll('circle')[1]!;
    const dash = Number(arc.getAttribute('stroke-dasharray'));
    const off = Number(arc.getAttribute('stroke-dashoffset'));
    expect(off / dash).toBeCloseTo(1 - 3 / 7, 3);
  });
});
