import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('toggles and reports selection', async () => {
    const onChange = vi.fn();
    render(<Checkbox onChange={onChange}>Email me invoices</Checkbox>);
    const cb = screen.getByRole('checkbox', { name: /Email me invoices/ });
    await userEvent.click(cb);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(cb).toBeChecked();
  });

  it('supports indeterminate, disabled and description', () => {
    render(
      <>
        <Checkbox isIndeterminate description="Some rows selected">
          Select all
        </Checkbox>
        <Checkbox isDisabled>Locked</Checkbox>
      </>,
    );
    expect(screen.getByRole('checkbox', { name: /Select all/ })).toBePartiallyChecked();
    expect(screen.getByRole('checkbox', { name: 'Locked' })).toBeDisabled();
  });

  it('forwards ref', () => {
    let el: HTMLLabelElement | null = null;
    render(
      <Checkbox
        ref={(n) => {
          el = n;
        }}
      >
        x
      </Checkbox>,
    );
    expect(el).toBeInstanceOf(HTMLLabelElement);
  });
});
