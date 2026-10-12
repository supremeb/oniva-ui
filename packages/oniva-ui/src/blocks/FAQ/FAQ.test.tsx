import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FAQ } from './FAQ';

describe('FAQ', () => {
  it('renders questions with the first expanded', () => {
    render(<FAQ />);
    expect(screen.getAllByRole('button').length).toBe(5);
    expect(screen.getByRole('button', { name: /how does oniva trace/i })).toHaveAttribute('aria-expanded', 'true');
  });
  it('expands another item', async () => {
    render(<FAQ />);
    const b = screen.getByRole('button', { name: /hard spending limit/i });
    await userEvent.click(b);
    expect(b).toHaveAttribute('aria-expanded', 'true');
  });
});
