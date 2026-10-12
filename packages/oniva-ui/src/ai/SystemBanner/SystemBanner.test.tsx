import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SystemBanner } from './SystemBanner';

describe('SystemBanner', () => {
  it('uses alert role for warnings and wires action + dismiss', () => {
    const onAction = vi.fn();
    const onDismiss = vi.fn();
    render(
      <SystemBanner tone="warning" actionLabel="Upgrade" onAction={onAction} onDismiss={onDismiss}>
        You have used 93% of your weekly limit.
      </SystemBanner>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('93%');
    fireEvent.click(screen.getByRole('button', { name: 'Upgrade' }));
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onAction).toHaveBeenCalled();
    expect(onDismiss).toHaveBeenCalled();
  });

  it('uses status role for info', () => {
    render(<SystemBanner>Context compacted.</SystemBanner>);
    expect(screen.getByRole('status')).toHaveTextContent('Context compacted.');
  });
});
