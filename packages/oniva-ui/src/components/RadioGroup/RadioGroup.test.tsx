import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Radio, RadioGroup } from './RadioGroup';

describe('RadioGroup', () => {
  it('selects a radio and reports value', async () => {
    const onChange = vi.fn();
    render(
      <RadioGroup label="Plan" onChange={onChange}>
        <Radio value="starter">Starter</Radio>
        <Radio value="pro">Pro</Radio>
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup', { name: 'Plan' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('radio', { name: 'Pro' }));
    expect(onChange).toHaveBeenCalledWith('pro');
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
  });

  it('supports card variant with description/trailing and disabled', () => {
    render(
      <RadioGroup aria-label="Billing" cards defaultValue="m">
        <Radio value="m" variant="card" description="Billed monthly" trailing="$29">
          Monthly
        </Radio>
        <Radio value="y" variant="card" isDisabled>
          Yearly
        </Radio>
      </RadioGroup>,
    );
    expect(screen.getByRole('radio', { name: /Monthly/ })).toBeChecked();
    expect(screen.getByText('$29')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Yearly' })).toBeDisabled();
  });
});
