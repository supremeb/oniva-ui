import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { PermissionRequest } from './PermissionRequest';

const base = {
  agent: { name: 'Coder', model: 'Atlas 2' },
  action: 'push to main',
  target: 'acme/web',
  reason: 'Checks passed on the fix.',
  preview: [
    { id: 'a', label: 'src/cart.ts', meta: '+12 −4' },
    { id: 'b', label: 'src/pay.ts' },
    { id: 'c', label: 'src/tax.ts' },
    { id: 'd', label: 'src/ui.ts' },
  ],
};

describe('PermissionRequest', () => {
  it('is a labelled dialog and limits preview rows', async () => {
    const { container } = render(<PermissionRequest {...base} />);
    expect(screen.getByRole('dialog', { name: 'Coder wants to push to main' })).toBeInTheDocument();
    expect(screen.queryByText('src/ui.ts')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /1 more/ }));
    expect(screen.getByText('src/ui.ts')).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  it('allows with the chosen scope and then revokes', () => {
    const onDecisionChange = vi.fn();
    render(<PermissionRequest {...base} now={1_000_000} onDecisionChange={onDecisionChange} />);
    fireEvent.click(screen.getByRole('radio', { name: '1 hour' }));
    fireEvent.click(screen.getByRole('button', { name: /Allow for 1 hour/ }));
    expect(onDecisionChange).toHaveBeenCalledWith({ allow: true, scope: 'timed', at: 1_000_000, until: 1_000_000 + 3_600_000 });
    expect(screen.getByRole('status')).toHaveTextContent('Allowed for 1 hour');
    fireEvent.click(screen.getByRole('button', { name: 'Revoke' }));
    expect(onDecisionChange).toHaveBeenLastCalledWith(null);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('Escape denies and Enter allows from inside the card', () => {
    const onDecisionChange = vi.fn();
    const { unmount } = render(<PermissionRequest {...base} onDecisionChange={onDecisionChange} />);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onDecisionChange.mock.calls[0]![0]).toMatchObject({ allow: false });
    unmount();
    const second = vi.fn();
    render(<PermissionRequest {...base} onDecisionChange={second} />);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Enter' });
    expect(second.mock.calls[0]![0]).toMatchObject({ allow: true, scope: 'once' });
  });

  it('never offers Always for destructive actions', () => {
    render(<PermissionRequest {...base} risk="destructive" />);
    expect(screen.queryByRole('radio', { name: 'Always' })).not.toBeInTheDocument();
    expect(screen.getByText('Destructive')).toBeInTheDocument();
  });

  it('counts down a timed grant', () => {
    vi.useFakeTimers();
    const at = Date.now();
    render(<PermissionRequest {...base} defaultDecision={{ allow: true, scope: 'timed', at, until: at + 90_000 }} />);
    expect(screen.getByText(/^1:30 left/)).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(30_000);
    });
    expect(screen.getByText(/^1:00 left/)).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<PermissionRequest {...base} ref={ref} className="x" />);
    expect(ref.current).toHaveClass('x');
  });
});
