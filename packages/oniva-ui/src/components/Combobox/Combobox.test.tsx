import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Combobox, ComboboxItem } from './Combobox';

const ui = (props: object = {}) => (
  <Combobox label="Vendor" {...props}>
    <ComboboxItem id="aws">Amazon Web Services</ComboboxItem>
    <ComboboxItem id="stripe">Stripe</ComboboxItem>
    <ComboboxItem id="figma">Figma</ComboboxItem>
  </Combobox>
);

describe('Combobox', () => {
  it('filters options as you type and selects one', async () => {
    const onSelectionChange = vi.fn();
    render(ui({ onSelectionChange }));
    const input = screen.getByRole('combobox', { name: 'Vendor' });
    await userEvent.type(input, 'str');
    const opts = await screen.findAllByRole('option');
    expect(opts).toHaveLength(1);
    await userEvent.click(opts[0]!);
    expect(onSelectionChange).toHaveBeenCalledWith('stripe');
    expect(input).toHaveValue('Stripe');
  });

  it('opens via the chevron button and supports disabled + error', async () => {
    const { unmount } = render(ui());
    await userEvent.click(screen.getByRole('button'));
    expect(await screen.findAllByRole('option')).toHaveLength(3);
    unmount();
    render(ui({ isDisabled: true, isInvalid: true, errorMessage: 'Pick a vendor' }));
    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(screen.getByText('Pick a vendor')).toBeInTheDocument();
  });

  it('shows a custom empty message', async () => {
    render(ui({ emptyMessage: 'No vendors match' }));
    await userEvent.type(screen.getByRole('combobox'), 'zzzz');
    expect(await screen.findByText('No vendors match')).toBeInTheDocument();
  });

  it('offers a create row and calls onCreate', async () => {
    const onCreate = vi.fn();
    render(ui({ onCreate }));
    await userEvent.type(screen.getByRole('combobox'), 'Northwind');
    const create = await screen.findByRole('option', { name: 'Create “Northwind”' });
    await userEvent.click(create);
    expect(onCreate).toHaveBeenCalledWith('Northwind');
  });

  it('forwards ref to the input and className to the root', () => {
    const ref = { current: null as HTMLInputElement | null };
    const { container } = render(ui({ ref, className: 'extra' }));
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(container.querySelector('.extra')).not.toBeNull();
  });
});
