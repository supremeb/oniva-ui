import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { InputOTP } from './InputOTP';

describe('InputOTP', () => {
  it('accepts digits only, fills slots and fires onComplete', async () => {
    const onComplete = vi.fn();
    const onChange = vi.fn();
    render(
      <InputOTP label="Verification code" length={4} onChange={onChange} onComplete={onComplete} />,
    );
    const input = screen.getByLabelText('Verification code');
    expect(input).toHaveAttribute('autocomplete', 'one-time-code');
    await userEvent.type(input, '12ab34');
    expect(input).toHaveValue('1234');
    expect(onChange).toHaveBeenLastCalledWith('1234');
    expect(onComplete).toHaveBeenCalledWith('1234');
  });

  it('shows error, separator and respects disabled', () => {
    const { container } = render(
      <InputOTP
        label="Code"
        defaultValue="123"
        separatorAt={3}
        isInvalid
        errorMessage="Invalid code"
        isDisabled
      />,
    );
    expect(screen.getByText('Invalid code')).toBeInTheDocument();
    expect(screen.getByLabelText('Code')).toBeDisabled();
    expect(container.querySelectorAll('[data-slot]')).toHaveLength(6);
  });
});
