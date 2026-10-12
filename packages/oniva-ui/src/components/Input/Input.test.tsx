import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('associates label and description with the input', () => {
    render(<Input label="Email" description="We never share it" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAccessibleDescription('We never share it');
  });

  it('is typeable and reports changes', async () => {
    const onChange = vi.fn();
    render(<Input label="Name" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('Name'), 'Bala');
    expect(onChange).toHaveBeenLastCalledWith('Bala');
  });

  it('shows the error message and marks invalid', () => {
    render(<Input label="Email" isInvalid errorMessage="Required" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('supports disabled, prefix and suffix; forwards ref', () => {
    let el: HTMLInputElement | null = null;
    render(
      <Input
        label="Amount"
        isDisabled
        prefix={<span>$</span>}
        suffix={<span>USD</span>}
        ref={(n) => {
          el = n;
        }}
      />,
    );
    expect(screen.getByLabelText('Amount')).toBeDisabled();
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(el).toBeInstanceOf(HTMLInputElement);
  });
});
