import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CommandPalette, fuzzyMatch, type CommandGroup } from './CommandPalette';

const groups: CommandGroup[] = [
  {
    id: 'g1',
    title: 'Go to',
    items: [
      { id: 'overview', label: 'Overview' },
      { id: 'invoices', label: 'Invoices', keywords: ['billing'] },
    ],
  },
  { id: 'g2', title: 'Account', items: [{ id: 'settings', label: 'Settings', shortcut: '⌘,' }] },
];

describe('CommandPalette', () => {
  it('fuzzyMatch handles subsequences and case', () => {
    expect(fuzzyMatch('Create invoice', 'crinv')).toBe(true);
    expect(fuzzyMatch('Settings', 'SET')).toBe(true);
    expect(fuzzyMatch('Settings', 'xyz')).toBe(false);
    expect(fuzzyMatch('anything', '')).toBe(true);
  });

  it('opens with Cmd+K, filters, selects via keyboard, then closes', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<CommandPalette groups={groups} onSelect={onSelect} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'k', metaKey: true });
    const dialog = await screen.findByRole('dialog', { name: 'Command palette' });
    expect(dialog).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
    await user.keyboard('bill');
    await waitFor(() => expect(screen.getAllByRole('menuitem')).toHaveLength(1));
    expect(screen.getByRole('menuitem', { name: /Invoices/ })).toBeInTheDocument();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0]?.[0].id).toBe('invoices');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('shows empty state and closes with Esc', async () => {
    const user = userEvent.setup();
    render(<CommandPalette groups={groups} defaultOpen emptyMessage="Nothing here" />);
    await screen.findByRole('dialog');
    await user.keyboard('zzzq');
    expect(await screen.findByText('Nothing here')).toBeInTheDocument();
    // first Esc clears the search text (SearchField), second closes the palette
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.getAllByRole('menuitem')).toHaveLength(3));
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('quickRun: Cmd+2 runs the second item of the first group and announces it', async () => {
    const onSelect = vi.fn();
    render(<CommandPalette groups={groups} defaultOpen quickRun onSelect={onSelect} />);
    await screen.findByRole('dialog');
    expect(screen.getByRole('menuitem', { name: /Invoices/ })).toHaveTextContent('⌘2');
    fireEvent.keyDown(document, { key: '2', metaKey: true });
    expect(onSelect.mock.calls[0]?.[0].id).toBe('invoices');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByRole('status')).toHaveTextContent('Ran Invoices');
  });
});
