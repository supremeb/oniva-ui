import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from '@testing-library/react';
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

  it('sanitises pasted codes with separators', async () => {
    const onComplete = vi.fn();
    render(<InputOTP label="Code" length={6} onComplete={onComplete} />);
    const input = screen.getByLabelText('Code');
    await userEvent.click(input);
    await userEvent.paste('482-916');
    expect(input).toHaveValue('482916');
    expect(onComplete).toHaveBeenCalledWith('482916');
  });

  it('error status shows the default message and clears the boxes', async () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<InputOTP label="Code" length={4} defaultValue="1234" status="error" onChange={onChange} />);
    expect(screen.getByText("That code didn't work. Try again.")).toBeInTheDocument();
    await act(async () => {
      vi.advanceTimersByTime(800);
    });
    expect(onChange).toHaveBeenCalledWith('');
    vi.useRealTimers();
  });

  it('success morphs into a Verified pill', () => {
    render(<InputOTP label="Code" length={4} defaultValue="1234" status="success" />);
    expect(screen.getByRole('status')).toHaveTextContent('Verified');
  });

  it('resend counts down then enables Resend', async () => {
    vi.useFakeTimers();
    const onResend = vi.fn();
    render(<InputOTP label="Code" onResend={onResend} resendIn={2} />);
    expect(screen.getByText(/Resend in 0:02/)).toBeInTheDocument();
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    const btn = screen.getByRole('button', { name: 'Resend code' });
    await act(async () => {
      btn.click();
    });
    expect(onResend).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('forwards ref to the input and className to the field', () => {
    const ref = { current: null as HTMLInputElement | null };
    const { container } = render(<InputOTP label="Code" ref={ref} className="extra" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(container.querySelector('.extra')).not.toBeNull();
  });
});
