import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Button } from '../Button';
import { Popover, PopoverTrigger } from './Popover';

describe('Popover', () => {
  it('opens a labelled dialog, Esc closes and restores focus', async () => {
    const user = userEvent.setup();
    render(
      <PopoverTrigger>
        <Button>Filters</Button>
        <Popover aria-label="Filter options">
          <Button>Apply</Button>
        </Popover>
      </PopoverTrigger>,
    );
    const trigger = screen.getByRole('button', { name: 'Filters' });
    await user.click(trigger);
    expect(await screen.findByRole('dialog', { name: 'Filter options' })).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('supports render-prop close and arrow', async () => {
    const user = userEvent.setup();
    render(
      <PopoverTrigger>
        <Button>Open</Button>
        <Popover aria-label="x" showArrow>
          {({ close }) => <Button onPress={close}>Done</Button>}
        </Popover>
      </PopoverTrigger>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(await screen.findByRole('button', { name: 'Done' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});
