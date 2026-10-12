import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Button } from '../Button';
import { DialogHeader, DialogTitle } from '../Dialog';
import { Drawer, DrawerTrigger } from './Drawer';

describe('Drawer', () => {
  it.each(['left', 'right', 'bottom'] as const)(
    'opens (%s), labelled, Esc closes and restores focus',
    async (side) => {
      const user = userEvent.setup();
      render(
        <DrawerTrigger>
          <Button>Open</Button>
          <Drawer side={side}>
            <DialogHeader>
              <DialogTitle>Filters</DialogTitle>
            </DialogHeader>
          </Drawer>
        </DrawerTrigger>,
      );
      const trigger = screen.getByRole('button', { name: 'Open' });
      await user.click(trigger);
      expect(await screen.findByRole('dialog', { name: 'Filters' })).toBeInTheDocument();
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      await waitFor(() => expect(trigger).toHaveFocus());
    },
  );

  it('uses different classes per side', async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <DrawerTrigger>
        <Button>Open</Button>
        <Drawer side="left" aria-label="A" />
      </DrawerTrigger>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const left = (await screen.findByRole('dialog')).parentElement!.className;
    unmount();
    render(
      <DrawerTrigger>
        <Button>Open</Button>
        <Drawer side="right" aria-label="A" />
      </DrawerTrigger>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const right = (await screen.findByRole('dialog')).parentElement!.className;
    expect(left).not.toBe(right);
  });
});
