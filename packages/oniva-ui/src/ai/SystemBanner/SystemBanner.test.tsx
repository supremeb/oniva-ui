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

  it('uses alert role for danger and status for success and neutral', () => {
    const { rerender } = render(<SystemBanner tone="danger">Connector timed out.</SystemBanner>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    rerender(<SystemBanner tone="success">Exported.</SystemBanner>);
    expect(screen.getByRole('status')).toBeInTheDocument();
    rerender(<SystemBanner tone="neutral">Model switched.</SystemBanner>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders no buttons unless an action label or dismiss handler is given', () => {
    const { rerender } = render(<SystemBanner>Context compacted.</SystemBanner>);
    expect(screen.queryByRole('button')).toBeNull();
    rerender(<SystemBanner onDismiss={() => {}}>Context compacted.</SystemBanner>);
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
    rerender(<SystemBanner actionLabel="Details">Context compacted.</SystemBanner>);
    expect(screen.getByRole('button', { name: 'Details' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Dismiss' })).toBeNull();
  });

  it('hides the tone icon from assistive tech and keeps the message readable', () => {
    const { container } = render(<SystemBanner tone="warning">Limit reached.</SystemBanner>);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Limit reached.');
  });
});
