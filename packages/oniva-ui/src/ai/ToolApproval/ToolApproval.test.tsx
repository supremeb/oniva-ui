import { fireEvent, render, screen } from '@testing-library/react';
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
