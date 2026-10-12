import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Select, SelectItem } from './Select';

function setup(props: Partial<React.ComponentProps<typeof Select>> = {}) {
  return render(
    <Select label="Status" {...(props as object)}>
      <SelectItem id="paid" dot="success">
        Paid
      </SelectItem>
      <SelectItem id="pending" dot="warning">
        Pending
      </SelectItem>
      <SelectItem id="failed" dot="danger">
        Failed
      </SelectItem>
    </Select>,
  );
}

describe('Select', () => {
  it('opens, selects an option and shows it in the trigger', async () => {
    const onChange = vi.fn();
    setup({ onChange } as never);
    const trigger = screen.getByRole('button', { name: /Status/ });
    await userEvent.click(trigger);
    const list = await screen.findByRole('listbox');
    await userEvent.click(within(list).getByRole('option', { name: 'Pending' }));
    expect(onChange).toHaveBeenCalledWith('pending');
    expect(screen.getByRole('button', { name: /Status/ })).toHaveTextContent('Pending');
  });

  it('is operable with the keyboard', async () => {
    setup();
    screen.getByRole('button', { name: /Status/ }).focus();
    await userEvent.keyboard('{Enter}');
    expect(await screen.findByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(screen.getByRole('button', { name: /Status/ })).toHaveTextContent(/Paid|Pending|Failed/);
  });

  it('supports disabled and error message', () => {
    setup({ isDisabled: true, isInvalid: true, errorMessage: 'Required' } as never);
    expect(screen.getByRole('button', { name: /Status/ })).toBeDisabled();
    expect(screen.getByText('Required')).toBeInTheDocument();
  });
});
