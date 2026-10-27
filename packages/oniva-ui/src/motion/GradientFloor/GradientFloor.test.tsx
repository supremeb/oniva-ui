import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GradientFloor } from './GradientFloor';

describe('GradientFloor', () => {
  it('renders children and hides the floor layers from assistive tech', () => {
    const { container } = render(
      <GradientFloor>
        <h2>Ideas start to glow</h2>
      </GradientFloor>,
    );
    expect(screen.getByRole('heading', { name: 'Ideas start to glow' })).toBeInTheDocument();
    const floor = container.querySelector('[aria-hidden="true"]');
    expect(floor).not.toBeNull();
    expect(floor!.contains(screen.getByRole('heading'))).toBe(false);
  });
  it('maps colours and speed to custom properties', () => {
    render(<GradientFloor colors={['#111111', '#222222', '#333333']} speed={5} data-testid="f" />);
    const el = screen.getByTestId('f');
    expect(el.style.getPropertyValue('--oniva-gf-c0')).toBe('#111111');
    expect(el.style.getPropertyValue('--oniva-gf-c2')).toBe('#333333');
    expect(el.style.getPropertyValue('--oniva-gf-speed')).toBe('5s');
  });
  it('defaults to the accent ramp and forwards className/ref', () => {
    let el: HTMLDivElement | null = null;
    render(<GradientFloor className="x" ref={(n) => void (el = n)} />);
    expect(el).toHaveClass('x');
    expect(el!.style.getPropertyValue('--oniva-gf-c1')).toContain('--oniva-accent-500');
  });
  it('exposes no tab stops or roles of its own', () => {
    const { container } = render(<GradientFloor speed={0} />);
    expect(container.querySelectorAll('[tabindex], [role]')).toHaveLength(0);
  });
});
