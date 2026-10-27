import { waitFor, act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EmailDraft } from './EmailDraft';

afterEach(() => vi.useRealTimers());

describe('EmailDraft', () => {
  it('renders the record, tones as toggle buttons and the first contact', () => {
    render(<EmailDraft />);
    expect(screen.getByText('SUB-1182')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Friendly' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /Recipient: Jonas Weber/ })).toBeInTheDocument();
    expect(screen.getByText(/Hi Jonas/)).toBeInTheDocument();
  });

  it('switches tone', () => {
    render(<EmailDraft />);
    fireEvent.click(screen.getByRole('button', { name: 'Short' }));
    expect(screen.getByRole('button', { name: 'Short' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/Quote for changes/)).toBeInTheDocument();
  });

  it('edits inline and leaves with Escape', () => {
    render(<EmailDraft />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit text' }));
    const ta = screen.getByRole('textbox', { name: 'Email text' });
    fireEvent.change(ta, { target: { value: 'Custom text' } });
    fireEvent.keyDown(ta, { key: 'Escape' });
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.getByText(/Custom text/)).toBeInTheDocument();
  });

  it('removes and re-adds the attachment', async () => {
    render(<EmailDraft />);
    fireEvent.click(screen.getByRole('button', { name: 'Remove Renewal-quote.pdf' }));
    // the old chip crossfades out before it unmounts
    await waitFor(() => expect(screen.queryByText('Renewal-quote.pdf')).toBeNull());
    fireEvent.click(screen.getByRole('button', { name: /Add Renewal-quote.pdf/ }));
    expect(screen.getByText('Renewal-quote.pdf')).toBeInTheDocument();
  });

  it('sends with a receipt and undo, and sends with Cmd+Enter', () => {
    vi.useFakeTimers();
    const onSend = vi.fn();
    render(<EmailDraft onSend={onSend} />);
    fireEvent.click(screen.getByRole('button', { name: 'Send email' }));
    act(() => void vi.advanceTimersByTime(1000));
    expect(onSend).toHaveBeenCalledTimes(1);
    expect(onSend.mock.calls[0]![0].to.name).toBe('Jonas Weber');
    expect(screen.getByRole('status')).toHaveTextContent('Sent to Jonas Weber');
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Edit text' }));
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter', metaKey: true });
    act(() => void vi.advanceTimersByTime(1000));
    expect(onSend).toHaveBeenCalledTimes(2);
  });

  it('discards with undo and forwards ref/className', () => {
    const onDiscard = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(<EmailDraft onDiscard={onDiscard} ref={ref} className="x" />);
    expect(ref.current).toHaveClass('x');
    fireEvent.click(screen.getByRole('button', { name: 'Discard' }));
    expect(onDiscard).toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent('Draft discarded');
  });
});
