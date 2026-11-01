import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
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

describe('Sources states', () => {
  it('renders no trigger for an empty list but keeps ref and className', () => {
    const { container } = render(<Sources sources={[]} className="x" data-testid="s" />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(container.firstElementChild).toHaveClass('x');
  });

  it('tolerates duplicate urls without key warnings', () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const dup = [{ title: 'One', url: 'https://a.example/x' }, { title: 'Two', url: 'https://a.example/x' }];
    render(<Sources sources={dup} defaultOpen />);
    expect(err).not.toHaveBeenCalled();
    err.mockRestore();
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('does not render unsafe urls as links and never shows an empty host', () => {
    render(<Sources sources={[{ title: 'Bad', url: 'javascript:alert(1)' }]} defaultOpen />);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText('Bad')).toBeInTheDocument();
  });

  it('falls back to the host initial when a favicon fails to load', () => {
    const { container } = render(<Sources sources={[{ title: 'Z', url: 'https://zed.example', favicon: 'https://zed.example/f.png' }]} defaultOpen />);
    container.querySelectorAll('img').forEach((img) => fireEvent.error(img));
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getAllByText('z').length).toBeGreaterThan(0);
  });
});
