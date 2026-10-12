import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { InputGroup } from './InputGroup';

describe('InputGroup', () => {
  it('renders addons around a labelled input', async () => {
    const onChange = vi.fn();
    render(
      <InputGroup label="Website" startAddon="https://" endAddon=".com" onChange={onChange} />,
    );
    expect(screen.getByText('https://')).toBeInTheDocument();
    expect(screen.getByText('.com')).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Website'), 'acme');
    expect(onChange).toHaveBeenLastCalledWith('acme');
  });

  it('shows error, disabled and forwards ref', () => {
    let el: HTMLInputElement | null = null;
    render(
      <InputGroup
        label="Amount"
        startAddon="$"
        isInvalid
        errorMessage="Required"
        isDisabled
        ref={(n) => {
          el = n;
        }}
      />,
    );
    expect(screen.getByLabelText('Amount')).toBeDisabled();
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(el).toBeInstanceOf(HTMLInputElement);
  });
});
