import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LogoCloud } from './LogoCloud';

describe('LogoCloud', () => {
  it('renders the grid of logos', () => {
    render(<LogoCloud />);
    expect(screen.getAllByRole('listitem')).toHaveLength(8);
  });
  it('marquee duplicates items as aria-hidden', () => {
    const { container } = render(<LogoCloud variant="marquee" className="x" />);
    expect(container.querySelectorAll('li[aria-hidden="true"]')).toHaveLength(8);
    expect(container.querySelector('section')).toHaveClass('x');
  });
});
