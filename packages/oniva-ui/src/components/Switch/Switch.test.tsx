import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './Switch';

describe('Switch', () => {
  it('toggles on click and reports the change', async () => {
    const onChange = vi.fn();
    render(<Switch onChange={onChange}>Notifications</Switch>);
    const sw = screen.getByRole('switch', { name: 'Notifications' });
    expect(sw).not.toBeChecked();
    await userEvent.click(sw);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(sw).toBeChecked();
  });

  it('toggles with the keyboard', async () => {
    render(<Switch>Wifi</Switch>);
    await userEvent.tab();
    await userEvent.keyboard(' ');
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('respects disabled and defaultSelected; forwards className', async () => {
    render(
      <Switch isDisabled defaultSelected className="x">
        Locked
      </Switch>,
    );
    const sw = screen.getByRole('switch');
    expect(sw).toBeDisabled();
    expect(sw).toBeChecked();
    expect(sw.closest('label')).toHaveClass('x');
  });
});
