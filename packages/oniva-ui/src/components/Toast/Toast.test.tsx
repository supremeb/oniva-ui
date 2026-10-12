import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { toast, ToastProvider } from './Toast';

afterEach(() => {
  act(() => toast.clear());
});

describe('Toast', () => {
  it('shows a toast with title/description in a labelled region and auto-dismisses', async () => {
    render(<ToastProvider />);
    act(() => {
      toast.success('Invoice sent', { description: 'INV-2041 emailed', duration: 150 });
    });
    expect(await screen.findByText('Invoice sent')).toBeInTheDocument();
    expect(screen.getByText('INV-2041 emailed')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Notifications' })).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('Invoice sent')).not.toBeInTheDocument(), {
      timeout: 2000,
    });
  });

  it('dismiss button closes and onClose fires', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ToastProvider />);
    act(() => {
      toast.danger('Payout failed', { duration: Infinity, onClose });
    });
    await screen.findByText('Payout failed');
    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    await waitFor(() => expect(screen.queryByText('Payout failed')).not.toBeInTheDocument());
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('action button runs handler and closes the toast', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<ToastProvider placement="top-center" />);
    act(() => {
      toast({ title: 'Archived', action: { label: 'Undo', onPress }, duration: Infinity });
    });
    await user.click(await screen.findByRole('button', { name: 'Undo' }));
    expect(onPress).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByText('Archived')).not.toBeInTheDocument());
  });

  it('promise toast swaps loading -> success in place', async () => {
    render(<ToastProvider />);
    let resolve!: (v: number) => void;
    const p = new Promise<number>((r) => (resolve = r));
    act(() => {
      toast.promise(p, { loading: 'Exporting…', success: (n) => `Exported ${n} rows`, error: 'Failed' });
    });
    expect(await screen.findByText('Exporting…')).toBeInTheDocument();
    await act(async () => resolve(42));
    expect(await screen.findByText('Exported 42 rows')).toBeInTheDocument();
    expect(screen.queryByText('Exporting…')).not.toBeInTheDocument();
  });

  it('stacks newest in front: older toast is marked behind', async () => {
    render(<ToastProvider />);
    act(() => {
      toast('First', { duration: Infinity });
      toast('Second', { duration: Infinity });
    });
    await screen.findByText('Second');
    const slots = document.querySelectorAll('[data-state]');
    expect(slots.length).toBe(2);
    expect(slots[0]!.getAttribute('data-front')).toBe('true');
  });
});
