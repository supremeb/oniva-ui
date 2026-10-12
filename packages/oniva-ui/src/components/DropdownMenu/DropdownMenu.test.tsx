import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import type { Selection } from 'react-aria-components';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSection,
  DropdownMenuSeparator,
  DropdownMenuSubmenu,
} from './DropdownMenu';

describe('DropdownMenu', () => {
  it('opens with keyboard, navigates, fires onAction, and restores focus', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <DropdownMenu>
        <Button>Actions</Button>
        <DropdownMenuContent onAction={onAction} aria-label="Actions">
          <DropdownMenuItem id="edit" shortcut="E">
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem id="dup">Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem id="del" variant="danger">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    const trigger = screen.getByRole('button', { name: 'Actions' });
    trigger.focus();
    await user.keyboard('{Enter}');
    const menu = await screen.findByRole('menu', { name: 'Actions' });
    expect(menu).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
    expect(screen.getByText('E')).toBeInTheDocument();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(String(onAction.mock.calls[0]?.[0])).toBe('dup');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('Esc closes the menu', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <Button>Open</Button>
        <DropdownMenuContent aria-label="m">
          <DropdownMenuItem id="a">A</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await screen.findByRole('menu');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('supports checkable and radio items', async () => {
    const user = userEvent.setup();
    function Ex() {
      const [cols, setCols] = useState<Selection>(new Set(['amount']));
      const [d, setD] = useState<Selection>(new Set(['comfortable']));
      return (
        <DropdownMenu>
          <Button>View</Button>
          <DropdownMenuContent aria-label="View">
            <DropdownMenuSection
              title="Columns"
              selectionMode="multiple"
              selectedKeys={cols}
              onSelectionChange={setCols}
            >
              <DropdownMenuItem id="amount">Amount</DropdownMenuItem>
              <DropdownMenuItem id="status">Status</DropdownMenuItem>
            </DropdownMenuSection>
            <DropdownMenuSection
              title="Density"
              selectionMode="single"
              selectedKeys={d}
              onSelectionChange={setD}
            >
              <DropdownMenuItem id="comfortable">Comfortable</DropdownMenuItem>
              <DropdownMenuItem id="compact">Compact</DropdownMenuItem>
            </DropdownMenuSection>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    render(<Ex />);
    await user.click(screen.getByRole('button', { name: 'View' }));
    const status = await screen.findByRole('menuitemcheckbox', { name: 'Status' });
    expect(status).toHaveAttribute('aria-checked', 'false');
    await user.click(status);
    await waitFor(() =>
      expect(screen.getByRole('menuitemcheckbox', { name: 'Status' })).toHaveAttribute(
        'aria-checked',
        'true',
      ),
    );
    await user.click(screen.getByRole('menuitemradio', { name: 'Compact' }));
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('opens a submenu with ArrowRight', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <Button>Open</Button>
        <DropdownMenuContent aria-label="root">
          <DropdownMenuSubmenu>
            <DropdownMenuItem id="export">Export as…</DropdownMenuItem>
            <DropdownMenuContent aria-label="export">
              <DropdownMenuItem id="csv">CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuSubmenu>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await screen.findByRole('menu');
    await user.keyboard('{ArrowDown}{ArrowRight}');
    expect(await screen.findByRole('menuitem', { name: 'CSV' })).toBeInTheDocument();
  });
});
