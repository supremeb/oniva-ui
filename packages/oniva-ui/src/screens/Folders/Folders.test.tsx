import { createRef } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Folders } from './Folders';

describe('Folders', () => {
  it('renders one h1, folder cards and templates', () => {
    render(<Folders />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: /Q3 Campaign/ }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Brand-Guidelines/ })).toBeInTheDocument();
  });

  it('filters folders by tab and search', async () => {
    render(<Folders />);
    const list = () => screen.getByRole('region', { name: 'Folders' });
    await userEvent.click(screen.getByRole('radio', { name: 'Private' }));
    expect(within(list()).getByText('Hiring')).toBeInTheDocument();
    // Filtered-out cards play a short exit before unmounting.
    await waitFor(() => expect(within(list()).queryByText('Q3 Campaign')).not.toBeInTheDocument());
    await userEvent.click(screen.getByRole('radio', { name: 'All', checked: false }));
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search folders' }), 'zzz');
    expect(await screen.findByText('No folders match')).toBeInTheDocument();
  });

  it('opens a folder with onOpenFolder and onNavigate', async () => {
    const onOpenFolder = vi.fn();
    const onNavigate = vi.fn();
    render(<Folders onOpenFolder={onOpenFolder} onNavigate={onNavigate} />);
    await userEvent.click(
      screen
        .getAllByRole('button', { name: /Research/ })
        .find((b) => /files/.test(b.textContent ?? ''))!,
    );
    expect(onOpenFolder).toHaveBeenCalledWith('Research');
    expect(onNavigate).toHaveBeenCalledWith('Research');
  });

  it('filters templates and forwards className/ref', async () => {
    const ref = createRef<HTMLDivElement>();
    render(<Folders ref={ref} className="x" />);
    expect(ref.current).toHaveClass('x');
    await userEvent.click(screen.getByRole('radio', { name: 'Mine' }));
    expect(screen.queryByRole('button', { name: /Brand-Guidelines/ })).toBeNull();
    expect(screen.getByRole('button', { name: /Design-Book/ })).toBeInTheDocument();
  });
});
