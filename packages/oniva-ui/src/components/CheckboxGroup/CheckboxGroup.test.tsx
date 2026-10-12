import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from '../Checkbox';
import { CheckboxGroup } from './CheckboxGroup';

describe('CheckboxGroup', () => {
  it('is a labelled group and reports selected values', async () => {
    const onChange = vi.fn();
    render(
      <CheckboxGroup label="Channels" description="Pick one or more" onChange={onChange}>
        <Checkbox value="email">Email</Checkbox>
        <Checkbox value="slack">Slack</Checkbox>
      </CheckboxGroup>,
    );
    expect(screen.getByRole('group', { name: 'Channels' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('checkbox', { name: 'Slack' }));
    expect(onChange).toHaveBeenCalledWith(['slack']);
  });

  it('shows validation error', () => {
    render(
      <CheckboxGroup label="Channels" isInvalid errorMessage="Pick at least one">
        <Checkbox value="email">Email</Checkbox>
      </CheckboxGroup>,
    );
    expect(screen.getByText('Pick at least one')).toBeInTheDocument();
  });
});
