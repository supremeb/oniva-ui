import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button';
import { AlertDialog, AlertDialogTrigger } from './AlertDialog';

describe('AlertDialog', () => {
  it('renders role=alertdialog, focuses Cancel, and confirms', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <AlertDialogTrigger>
        <Button>Delete</Button>
        <AlertDialog
          variant="danger"
          title="Delete project?"
          confirmLabel="Delete"
          onConfirm={onConfirm}
        >
          This cannot be undone.
        </AlertDialog>
      </AlertDialogTrigger>,
    );
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    const dlg = await screen.findByRole('alertdialog', { name: 'Delete project?' });
    expect(dlg).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Delete', hidden: false }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  });

  it('Esc closes and calls neither confirm', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <AlertDialogTrigger>
        <Button>Open</Button>
        <AlertDialog title="Sure?" onConfirm={onConfirm} />
      </AlertDialogTrigger>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await screen.findByRole('alertdialog');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
