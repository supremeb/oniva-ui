import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AgentRun } from './AgentRun';
import { defaultRunSteps } from './AgentRun.data';

const waiting = defaultRunSteps.map((s, i) => ({
  ...s,
  status: (i < 3 ? 'done' : 'waiting') as 'done' | 'waiting',
}));

describe('AgentRun', () => {
  afterEach(() => vi.useRealTimers());

  it('renders landmarks, one h1 and marks the current step', () => {
    render(<AgentRun autoRun={false} steps={waiting} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    const current = screen.getByText('Send to the board').closest('li');
    expect(current).toHaveAttribute('aria-current', 'step');
  });

  it('approves and denies with buttons', async () => {
    const onApprove = vi.fn();
    const onDeny = vi.fn();
    render(<AgentRun autoRun={false} steps={waiting} onApprove={onApprove} onDeny={onDeny} />);
    await userEvent.click(screen.getByRole('button', { name: 'Approve' }));
    expect(onApprove).toHaveBeenCalledWith('send');
    await userEvent.click(screen.getByRole('button', { name: 'Deny' }));
    expect(onDeny).toHaveBeenCalledWith('send');
  });

  it('approves with Ctrl+Enter and denies with Escape from inside the approval', async () => {
    const onApprove = vi.fn();
    const onDeny = vi.fn();
    render(<AgentRun autoRun={false} steps={waiting} onApprove={onApprove} onDeny={onDeny} />);
    screen.getByRole('button', { name: 'Approve' }).focus();
    await userEvent.keyboard('{Control>}{Enter}{/Control}');
    expect(onApprove).toHaveBeenCalledTimes(1);
    await userEvent.keyboard('{Escape}');
    expect(onDeny).toHaveBeenCalledTimes(1);
  });

  it('reviews the draft with Y and N', async () => {
    render(<AgentRun autoRun={false} steps={waiting} />);
    const first = document.querySelectorAll<HTMLElement>('[data-decision]')[0]!;
    first.focus();
    await userEvent.keyboard('y');
    expect(first).toHaveAttribute('data-decision', 'accepted');
    const second = document.querySelectorAll<HTMLElement>('[data-decision]')[1]!;
    second.focus();
    await userEvent.keyboard('n');
    expect(second).toHaveAttribute('data-decision', 'rejected');
  });

  it('plays the simulation to the approval, then finishes after approval', async () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    render(<AgentRun onDone={onDone} />);
    for (let i = 0; i < 14; i++)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000);
      });
    expect(screen.getByRole('button', { name: 'Approve' })).toBeInTheDocument();
    await act(async () => {
      screen.getByRole('button', { name: 'Approve' }).click();
    });
    for (let i = 0; i < 4; i++)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000);
      });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('stops the run', async () => {
    const onStop = vi.fn();
    render(<AgentRun onStop={onStop} />);
    await userEvent.click(screen.getByRole('button', { name: /Stop run/ }));
    expect(onStop).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /Stop run/ })).toBeDisabled();
  });

  it('forwards ref and className, and supports headingLevel 2', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <AgentRun ref={ref} className="x" headingLevel={2} autoRun={false} />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.querySelector('.x')).toBe(ref.current);
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
  });
});
