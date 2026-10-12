import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from '../Input';
import { Fieldset } from './Fieldset';

describe('Fieldset', () => {
  it('renders a group named by its legend', () => {
    render(
      <Fieldset legend="Billing address" description="Shown on invoices">
        <Input label="City" />
      </Fieldset>,
    );
    expect(screen.getByRole('group', { name: 'Billing address' })).toBeInTheDocument();
    expect(screen.getByText('Shown on invoices')).toBeInTheDocument();
  });

  it('disables descendants and forwards ref', () => {
    let el: HTMLFieldSetElement | null = null;
    render(
      <Fieldset
        legend="Locked"
        disabled
        ref={(n) => {
          el = n;
        }}
      >
        <input aria-label="x" />
      </Fieldset>,
    );
    expect(screen.getByLabelText('x')).toBeDisabled();
    expect(el).toBeInstanceOf(HTMLFieldSetElement);
  });
});
