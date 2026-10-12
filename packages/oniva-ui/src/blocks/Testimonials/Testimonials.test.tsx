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
