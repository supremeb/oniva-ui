import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GridBackground } from './GridBackground';

describe('GridBackground', () => {
  it('renders children above a decorative grid layer', () => {
    const { container } = render(
      <GridBackground data-testid="g">
        <button type="button">Start</button>
      </GridBackground>,
    );
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
    const grid = container.querySelector('[aria-hidden="true"]');
    expect(grid).not.toBeNull();
    expect(grid!.contains(screen.getByRole('button'))).toBe(false);
  });
  it('maps size, direction and fade to custom properties', () => {
    render(<GridBackground size={32} direction="up" fade={50} lineColor="#abcdef" data-testid="g" />);
    const el = screen.getByTestId('g');
    expect(el.style.getPropertyValue('--oniva-gb-size')).toBe('32px');
    expect(el.style.getPropertyValue('--oniva-gb-dx')).toBe('0px');
    expect(el.style.getPropertyValue('--oniva-gb-dy')).toBe('-32px');
    expect(el.style.getPropertyValue('--oniva-gb-fade')).toBe('50%');
    expect(el.style.getPropertyValue('--oniva-gb-line')).toBe('#abcdef');
  });
  it('drifts diagonally from top right to bottom left by default', () => {
    render(<GridBackground data-testid="g" />);
    const el = screen.getByTestId('g');
    expect(el.style.getPropertyValue('--oniva-gb-dx')).toBe('-48px');
    expect(el.style.getPropertyValue('--oniva-gb-dy')).toBe('48px');
  });
  it('shows the grid at once when reveal is off and forwards className/ref', () => {
    let el: HTMLDivElement | null = null;
    render(<GridBackground reveal={false} className="x" ref={(n) => void (el = n)} />);
    expect(el).toHaveClass('x');
    expect(el).toHaveAttribute('data-shown');
  });
  it('renders a still grid when speed is 0', () => {
    const { container } = render(<GridBackground speed={0} reveal={false} />);
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });
});
