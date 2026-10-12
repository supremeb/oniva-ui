import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Button } from '../Button';
import { BottomSheet, BottomSheetTrigger } from './BottomSheet';

describe('BottomSheet', () => {
  it('opens as a labelled dialog and closes on Escape', async () => {
    const user = userEvent.setup();
    render(
      <BottomSheetTrigger>
        <Button>Open</Button>
        <BottomSheet aria-label="Filters" snapPoints={[0.5, 0.9]}>
          <p>Sheet body</p>
        </BottomSheet>
      </BottomSheetTrigger>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(await screen.findByRole('dialog', { name: 'Filters' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});
