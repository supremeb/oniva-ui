import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ProfileMenu } from './ProfileMenu';

const items = () => [
  { id: 'settings', label: 'Settings', onSelect: vi.fn() },
  { id: 'billing', label: 'Billing', badge: 'New', onSelect: vi.fn() },
  { id: 'logout', label: 'Log out', danger: true, onSelect: vi.fn() },
];

describe('ProfileMenu', () => {
  it('shows the user and a menu of actions', () => {
    render(<ProfileMenu name="Lena Hartmann" email="lena@fastmail.example" items={items()} />);
    expect(screen.getByText('Lena Hartmann')).toBeInTheDocument();
    expect(screen.getByRole('menu', { name: 'Lena Hartmann account' })).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
  });

  it('runs onSelect on click', () => {
    const list = items();
    render(<ProfileMenu name="Lena" items={list} />);
    fireEvent.click(screen.getByRole('menuitem', { name: /Settings/ }));
    expect(list[0]!.onSelect).toHaveBeenCalledTimes(1);
  });

  it('moves with arrows and Home/End, and activates with Enter', async () => {
    const user = userEvent.setup();
    const list = items();
    render(<ProfileMenu name="Lena" items={list} />);
    const first = screen.getByRole('menuitem', { name: /Settings/ });
    first.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: /Billing/ })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('menuitem', { name: /Log out/ })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(first).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(list[0]!.onSelect).toHaveBeenCalled();
  });

  it('shows setup progress as a progressbar and continues', () => {
    const onContinue = vi.fn();
    render(<ProfileMenu name="Lena" items={items()} setup={{ done: 3, total: 5, next: 'Add a photo', onContinue }} />);
    expect(screen.getByRole('progressbar', { name: 'Profile setup' })).toHaveAttribute('aria-valuetext', '60%');
    fireEvent.click(screen.getByRole('button', { name: /Add a photo/ }));
    expect(onContinue).toHaveBeenCalled();
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ProfileMenu name="Lena" items={items()} ref={ref} className="x" />);
    expect(ref.current).toHaveClass('x');
  });
});
