import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Sources } from './Sources';

const sources = [
  { title: 'A', url: 'https://a.com/x' },
  { title: 'B', url: 'https://b.com/y' },
];

describe('Sources', () => {
  it('summarises the count and toggles', () => {
    render(<Sources sources={sources} />);
    const b = screen.getByRole('button', { name: /Used 2 sources/ });
    expect(b).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(b);
    expect(b).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: /A/ })).toHaveAttribute('href', 'https://a.com/x');
  });
});
