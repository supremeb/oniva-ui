import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ToolApproval } from './ToolApproval';

describe('ToolApproval', () => {
  it('approves and reports always-allow', () => {
    const onApprove = vi.fn();
    render(<ToolApproval toolName="gh.merge" args={{ n: 1 }} onApprove={onApprove} result="Merged" />);
    expect(screen.getByRole('status')).toHaveTextContent('Approval required');
    fireEvent.click(screen.getByRole('button', { name: 'Always allow' }));
    expect(onApprove).toHaveBeenCalledWith({ always: true });
    expect(screen.getByRole('status')).toHaveTextContent('Approved, always allowed');
  });
  it('denies', () => {
    const onDeny = vi.fn();
    render(<ToolApproval toolName="gh.merge" onDeny={onDeny} />);
    fireEvent.click(screen.getByRole('button', { name: 'Deny' }));
    expect(onDeny).toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent('Denied');
  });
});

describe('ToolApproval improvements', () => {
  it('shows a risk badge and preview details', () => {
    render(<ToolApproval toolName="t" risk="high" details={[{ label: 'Amount', value: '$184.00' }]} />);
    expect(screen.getByText('High risk')).toBeInTheDocument();
    expect(screen.getByText('$184.00')).toBeInTheDocument();
  });

  it('Cmd+Enter approves and Escape denies', () => {
    const onApprove = vi.fn();
    const onDeny = vi.fn();
    const { unmount } = render(<ToolApproval toolName="t" description="Do it?" onApprove={onApprove} onDeny={onDeny} />);
    fireEvent.keyDown(screen.getByRole('group', { name: 'Do it?' }), { key: 'Enter', metaKey: true });
    expect(onApprove).toHaveBeenCalledWith({ always: false });
    unmount();
    render(<ToolApproval toolName="t" description="Do it?" onDeny={onDeny} />);
    fireEvent.keyDown(screen.getByRole('group', { name: 'Do it?' }), { key: 'Escape' });
    expect(onDeny).toHaveBeenCalledWith({ reason: 'user' });
  });

  it('counts down, pauses while hovered and denies with reason timeout', () => {
    vi.useFakeTimers();
    const onExpire = vi.fn();
    const onDeny = vi.fn();
    render(<ToolApproval toolName="t" description="Do it?" expiresIn={5} onExpire={onExpire} onDeny={onDeny} />);
    const group = screen.getByRole('group', { name: 'Do it?' });
    expect(screen.getByText(/Expires in 0:05/)).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText(/Expires in 0:03/)).toBeInTheDocument();
    fireEvent.mouseEnter(group);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText(/Paused/)).toBeInTheDocument();
    expect(onDeny).not.toHaveBeenCalled();
    fireEvent.mouseLeave(group);
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(onExpire).toHaveBeenCalled();
    expect(onDeny).toHaveBeenCalledWith({ reason: 'timeout' });
    expect(screen.getByRole('status')).toHaveTextContent('Denied, timed out');
    vi.useRealTimers();
  });

  it('forwards ref and className', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<ToolApproval toolName="t" ref={ref} className="x" />);
    expect(ref.current).toHaveClass('x');
  });
});
