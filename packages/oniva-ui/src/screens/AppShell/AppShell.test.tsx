import { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AppShell } from './AppShell';

describe('AppShell', () => {
  it('renders landmarks, one h1, nav items and marks the active one', () => {
    render(
      <AppShell title="Planning" active="Folders" projects={['Q3 Campaign']}>
        <p>Body</p>
      </AppShell>,
    );
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveTextContent('Body');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Folders' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Q3 Campaign' })).not.toHaveAttribute('aria-current');
  });

  it('uses h2 when headingLevel is 2', () => {
    render(<AppShell title="Planning" headingLevel={2} />);
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
    expect(screen.getByRole('heading', { level: 2, name: 'Planning' })).toBeInTheDocument();
  });

  it('calls onNavigate with the label', async () => {
    const onNavigate = vi.fn();
    render(<AppShell onNavigate={onNavigate} projects={['Q3 Campaign']} />);
    await userEvent.click(screen.getByRole('button', { name: 'Integrations' }));
    await userEvent.click(screen.getByRole('button', { name: 'Q3 Campaign' }));
    expect(onNavigate).toHaveBeenNthCalledWith(1, 'Integrations');
    expect(onNavigate).toHaveBeenNthCalledWith(2, 'Q3 Campaign');
  });

  it('dismisses the what’s new card', async () => {
    const onDismissWhatsNew = vi.fn();
    render(<AppShell whatsNew={{ title: 'New stuff', description: 'Hello' }} onDismissWhatsNew={onDismissWhatsNew} />);
    expect(screen.getByText('New stuff')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss what\'s new' }));
    await waitFor(() => expect(screen.queryByText('New stuff')).toBeNull()); // exits with a short animation
    expect(onDismissWhatsNew).toHaveBeenCalled();
  });

  it('resizes the sidebar with the keyboard and resets on double-click', async () => {
    render(<AppShell sidebarWidth={{ default: 272, min: 220, max: 380 }} />);
    const sep = screen.getByRole('separator', { name: 'Resize sidebar' });
    expect(sep).toHaveAttribute('aria-valuenow', '272');
    sep.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(sep).toHaveAttribute('aria-valuenow', '288');
    await userEvent.keyboard('{Shift>}{ArrowRight}{/Shift}');
    expect(sep).toHaveAttribute('aria-valuenow', '352');
    await userEvent.keyboard('{End}');
    expect(sep).toHaveAttribute('aria-valuenow', '380');
    await userEvent.keyboard('{Home}');
    expect(sep).toHaveAttribute('aria-valuenow', '220');
    await userEvent.dblClick(sep);
    expect(sep).toHaveAttribute('aria-valuenow', '272');
  });

  it('collapses and restores the sidebar', async () => {
    render(<AppShell title="x" />);
    await userEvent.click(screen.getByRole('button', { name: 'Hide sidebar' }));
    expect(screen.getByRole('button', { name: 'Show sidebar' })).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(screen.getByRole('button', { name: 'Show sidebar' }));
    expect(screen.getAllByRole('button', { name: 'Hide sidebar' }).length).toBeGreaterThan(0);
  });

  it('shows the work area with tools and calls onOpen; the end edge is inverted', async () => {
    const onOpen = vi.fn();
    render(<AppShell panel onOpen={onOpen} panelWidth={{ default: 360 }} />);
    expect(screen.getByRole('complementary', { name: 'Workspace' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Terminal/ }));
    expect(onOpen).toHaveBeenCalledWith('terminal');
    const sep = screen.getByRole('separator', { name: 'Resize workspace' });
    sep.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(sep).toHaveAttribute('aria-valuenow', '344');
  });

  it('switches layout and forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    const { rerender } = render(<AppShell ref={ref} layout="flat" className="x" />);
    expect(ref.current).toHaveAttribute('data-layout', 'flat');
    expect(ref.current).toHaveClass('x');
    rerender(<AppShell ref={ref} layout="inset" className="x" />);
    expect(ref.current).toHaveAttribute('data-layout', 'inset');
  });

  it('opens a workspace switcher menu', async () => {
    const onWorkspaceChange = vi.fn();
    render(<AppShell workspaces={['Northwind Labs', 'Northwind Design']} onWorkspaceChange={onWorkspaceChange} />);
    await userEvent.click(screen.getByRole('button', { name: /Workspace: Northwind Labs/ }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Northwind Design' }));
    expect(onWorkspaceChange).toHaveBeenCalledWith('Northwind Design');
  });
});
