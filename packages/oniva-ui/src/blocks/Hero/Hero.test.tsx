import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders a single h1 and CTAs', () => {
    render(<Hero />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('button', { name: /start free/i })).toBeInTheDocument();
  });
  it('signup variant has an email field', () => {
    render(<Hero variant="signup" />);
    expect(screen.getByLabelText('Work email')).toBeInTheDocument();
  });
  it('dashboard variant renders the product shot', () => {
    render(<Hero variant="dashboard" />);
    expect(screen.getByRole('img', { name: /dashboard preview/i })).toBeInTheDocument();
  });
  it('forwards ref and className', () => {
    let el: HTMLElement | null = null;
    render(<Hero className="x" ref={(n) => { el = n; }} />);
    expect(el).toHaveClass('x');
  });
});
