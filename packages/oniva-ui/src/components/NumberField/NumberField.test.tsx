import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NumberField } from './NumberField';

describe('NumberField', () => {
  it('increments and decrements with the buttons', async () => {
    const onChange = vi.fn();
    render(<NumberField label="Seats" defaultValue={5} minValue={1} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /Increase/i }));
    expect(onChange).toHaveBeenLastCalledWith(6);
    await userEvent.click(screen.getByRole('button', { name: /Decrease/i }));
    expect(onChange).toHaveBeenLastCalledWith(5);
    expect(screen.getByRole('textbox', { name: 'Seats' })).toHaveValue('5');
  });

  it('respects min, formats currency, disabled and error', async () => {
    render(
      <NumberField
        label="Amount"
        defaultValue={1}
        minValue={1}
        formatOptions={{ style: 'currency', currency: 'USD' }}
        isInvalid
        errorMessage="Too low"
      />,
    );
    expect(screen.getByRole('textbox', { name: 'Amount' })).toHaveValue('$1.00');
    expect(screen.getByRole('button', { name: /Decrease/i })).toBeDisabled();
    expect(screen.getByText('Too low')).toBeInTheDocument();
  });
});
