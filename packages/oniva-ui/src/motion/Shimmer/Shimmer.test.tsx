import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Shimmer } from './Shimmer';

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
});
