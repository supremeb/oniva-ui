import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AppDirectory } from './AppDirectory';

describe('AppDirectory', () => {
  it('lists apps with a count heading and marks the current category', () => {
    render(<AppDirectory />);
    expect(screen.getByRole('heading', { level: 3, name: '12 apps' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /All apps/ })).toHaveAttribute('aria-current', 'true');
  });
  it('filters by category and search', async () => {
    render(<AppDirectory />);
    await userEvent.click(screen.getByRole('button', { name: /Finance/ }));
    expect(screen.getByRole('heading', { level: 3, name: '2 apps' })).toBeInTheDocument();
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search apps' }), 'billing');
    expect(screen.getByRole('heading', { level: 3, name: '1 app' })).toBeInTheDocument();
  });
  it('connect button names the app, shows loading, then toggles and calls back', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const onToggle = vi.fn();
    render(<AppDirectory onToggle={onToggle} />);
    await userEvent.click(screen.getByRole('button', { name: 'Connect Docs' }));
    await act(async () => {
      vi.advanceTimersByTime(900);
    });
    expect(onToggle).toHaveBeenCalledWith(expect.objectContaining({ id: 'docs' }), true);
    expect(screen.getByRole('button', { name: 'Disconnect Docs' })).toBeInTheDocument();
    vi.useRealTimers();
  });
  it('shows an empty state', async () => {
    render(<AppDirectory />);
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search apps' }), 'zzzz');
    expect(screen.getByText('No apps match your search.')).toBeInTheDocument();
  });
  it('forwards ref and className', () => {
    const ref = vi.fn();
    render(<AppDirectory ref={ref} className="x" data-testid="a" />);
    expect(ref).toHaveBeenCalled();
    expect(screen.getByTestId('a')).toHaveClass('x');
  });
});
