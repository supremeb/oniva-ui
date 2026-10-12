import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DropdownMenuItem } from '../DropdownMenu';
import { ContextMenu } from './ContextMenu';

function Ex({
  onAction = () => {},
  disabled = false,
}: {
  onAction?: (k: unknown) => void;
  disabled?: boolean;
}) {
  return (
    <ContextMenu
      isDisabled={disabled}
      onAction={onAction}
      menuLabel="File actions"
      menu={
        <>
          <DropdownMenuItem id="rename">Rename</DropdownMenuItem>
          <DropdownMenuItem id="delete" variant="danger">
            Delete
          </DropdownMenuItem>
        </>
      }
    >
      <div data-testid="area">Report.pdf</div>
    </ContextMenu>
  );
}

describe('ContextMenu', () => {
  it('opens on contextmenu, acts on keyboard selection, closes', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<Ex onAction={onAction} />);
    fireEvent.contextMenu(screen.getByTestId('area'), { clientX: 40, clientY: 30 });
    expect(await screen.findByRole('menu', { name: 'File actions' })).toBeInTheDocument();
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onAction).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('Esc closes and does nothing when disabled', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Ex />);
    fireEvent.contextMenu(screen.getByTestId('area'));
    await screen.findByRole('menu');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    unmount();
    render(<Ex disabled />);
    fireEvent.contextMenu(screen.getByTestId('area'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
