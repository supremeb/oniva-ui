import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SetupGuide, type SetupGroup } from './SetupGuide';

const groups = (): SetupGroup[] => [
  {
    id: 'workspace',
    title: 'Set up your workspace',
    tasks: [
      { id: 'name', label: 'Choose a workspace name' },
      { id: 'invite', label: 'Invite your teammates' },
    ],
  },
  { id: 'verify', title: 'Verify your account', tasks: [{ id: 'email', label: 'Confirm your email' }] },
];

describe('SetupGuide', () => {
  it('shows a progressbar and opens the first unfinished group', () => {
    render(<SetupGuide groups={groups()} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '0%');
    expect(screen.getByRole('button', { name: /Set up your workspace/ })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: /Verify your account/ })).toHaveAttribute('aria-expanded', 'false');
  });

  it('locks later tasks until earlier ones are done', () => {
    render(<SetupGuide groups={groups()} />);
    expect(screen.getByRole('button', { name: 'Invite your teammates' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Choose a workspace name' }));
    expect(screen.getByRole('button', { name: 'Choose a workspace name' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Invite your teammates' })).not.toBeDisabled();
  });

  it('folds a finished group, opens the next, and reports done ids', () => {
    const onChange = vi.fn();
    render(<SetupGuide groups={groups()} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Choose a workspace name' }));
    fireEvent.click(screen.getByRole('button', { name: 'Invite your teammates' }));
    expect(onChange).toHaveBeenLastCalledWith(['name', 'invite']);
    expect(screen.getByRole('button', { name: /Set up your workspace/ })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: /Verify your account/ })).toHaveAttribute('aria-expanded', 'true');
  });

  it('toggles groups with the keyboard-accessible header and shows Edit/Close only when provided', () => {
    const onClose = vi.fn();
    render(<SetupGuide groups={groups()} onClose={onClose} />);
    expect(screen.queryByRole('button', { name: 'Edit' })).toBeNull();
    const head = screen.getByRole('button', { name: /Verify your account/ });
    fireEvent.click(head);
    expect(head).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Close setup guide' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLElement>();
    render(<SetupGuide groups={groups()} ref={ref} className="x" />);
    expect(ref.current).toHaveClass('x');
  });
});
