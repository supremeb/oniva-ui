import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Alert } from './Alert';

describe('Alert', () => {
  it('renders title, description and actions', () => {
    render(
      <Alert title="Payment failed" description="Visa ending 4242 was declined." actions={<button>Retry</button>} variant="danger" />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Payment failed');
    expect(screen.getByText('Visa ending 4242 was declined.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });
  it('info/success use status role', () => {
    render(<Alert variant="success" title="Saved" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  it('dismisses via onDismiss', async () => {
    const onDismiss = vi.fn();
    render(<Alert title="Heads up" onDismiss={onDismiss} />);
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
  it('banner appearance differs and className forwards', () => {
    const { rerender } = render(<Alert title="a" className="k" />);
    const a = screen.getByRole('status').className;
    expect(a).toContain('k');
    rerender(<Alert title="a" appearance="banner" />);
    expect(screen.getByRole('status').className).not.toBe(a);
  });
});
