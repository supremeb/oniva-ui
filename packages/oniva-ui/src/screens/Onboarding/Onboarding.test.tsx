import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Onboarding } from './Onboarding';

describe('Onboarding', () => {
  it('starts at step 2 with earlier steps done and exposes progress', () => {
    render(<Onboarding />);
    expect(screen.getByRole('progressbar', { name: 'Setup progress' })).toHaveAttribute(
      'aria-valuetext',
      'Step 2 of 4: Connect your tools',
    );
    expect(screen.getByRole('button', { name: /Tools/ })).toHaveAttribute('aria-current', 'step');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('toggles tools as switches and continues', async () => {
    render(<Onboarding />);
    const calendar = screen.getByRole('switch', { name: 'Connect Calendar' });
    await userEvent.click(calendar);
    expect(calendar).toBeChecked();
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('heading', { name: 'Invite your team' })).toBeInTheDocument();
  });

  it('adds email chips with Enter and removes them with Backspace', async () => {
    render(<Onboarding defaultStep={3} />);
    const input = screen.getByLabelText('Teammate emails');
    await userEvent.type(input, 'priya@northwind.example{Enter}');
    expect(screen.getByText('priya@northwind.example')).toBeInTheDocument();
    await userEvent.type(input, '{Backspace}');
    expect(screen.queryByText('priya@northwind.example')).toBeNull();
    await userEvent.type(input, 'nope{Enter}');
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
  });

  it('completes with collected values and routes next steps', async () => {
    const onComplete = vi.fn();
    const onNavigate = vi.fn();
    render(<Onboarding defaultStep={4} onComplete={onComplete} onNavigate={onNavigate} />);
    await userEvent.click(screen.getByRole('radio', { name: /Daily briefer/ }));
    await userEvent.click(screen.getByRole('button', { name: 'Create agent' }));
    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({ template: 'brief', workspace: 'Northwind Labs' }),
    );
    await userEvent.click(within(screen.getByRole('main')).getByRole('button', { name: 'Chat' }));
    expect(onNavigate).toHaveBeenCalledWith('Chat');
  });

  it('goes back and validates the workspace name', async () => {
    render(<Onboarding defaultStep={1} />);
    const name = screen.getByLabelText('Workspace name');
    await userEvent.clear(name);
    await userEvent.type(name, '{Enter}');
    expect(screen.getByText('Give your workspace a name.')).toBeInTheDocument();
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Onboarding ref={ref} className="x" />);
    expect(container.querySelector('.x')).toBe(ref.current);
  });
});
