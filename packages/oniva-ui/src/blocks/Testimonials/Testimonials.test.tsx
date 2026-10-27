import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Testimonials } from './Testimonials';

describe('Testimonials', () => {
  it('renders grid quotes', () => {
    render(<Testimonials />);
    expect(screen.getAllByRole('figure')).toHaveLength(3);
  });
  it('carousel steps through quotes and wraps', async () => {
    render(<Testimonials variant="carousel" />);
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Next quote' }));
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Previous quote' }));
    await userEvent.click(screen.getByRole('button', { name: 'Previous quote' }));
    expect(screen.getByText('3 / 3')).toBeInTheDocument();
  });
});

describe('Testimonials wall', () => {
  it('renders each quote once as a figure plus an inert aria-hidden copy', () => {
    const { container } = render(<Testimonials variant="wall" columns={2} />);
    expect(screen.getByRole('region', { name: 'What customers say' })).toBeInTheDocument();
    const hidden = container.querySelectorAll('[aria-hidden="true"][inert]');
    expect(hidden.length).toBeGreaterThan(0);
    expect(screen.getAllByRole('figure').length).toBe(12);
  });
  it('cards are focusable, expose ratings and verified labels', async () => {
    render(<Testimonials variant="wall" />);
    expect(screen.getAllByRole('img', { name: 'Rated 5 out of 5' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('img', { name: 'Verified customer' }).length).toBeGreaterThan(0);
    await userEvent.tab();
    expect(screen.getAllByRole('figure')[0]).toHaveFocus();
  });
  it('forwards className and ref', () => {
    render(<Testimonials variant="wall" className="x" data-testid="t" />);
    expect(screen.getByTestId('t')).toHaveClass('x');
  });
  it('reduced motion renders one static copy', () => {
    const mm = window.matchMedia;
    window.matchMedia = ((q: string) => ({ ...mm(q), matches: true, addEventListener() {}, removeEventListener() {} })) as typeof window.matchMedia;
    const { container } = render(<Testimonials variant="wall" />);
    expect(container.querySelector('[inert]')).toBeNull();
    expect(screen.getAllByRole('figure')).toHaveLength(12);
    window.matchMedia = mm;
  });
});
