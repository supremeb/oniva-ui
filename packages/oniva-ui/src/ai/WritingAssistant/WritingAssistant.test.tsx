import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WritingAssistant } from './WritingAssistant';

describe('WritingAssistant', () => {
  afterEach(() => vi.useRealTimers());

  it('sends a suggestion chip and shows the user message', async () => {
    const respond = vi.fn().mockResolvedValue('Sure thing');
    render(<WritingAssistant suggestions={['Shorten this']} respond={respond} />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Shorten this' }));
    });
    expect(respond).toHaveBeenCalledWith('Shorten this');
    expect(screen.getByText('Shorten this')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New chat' })).toBeInTheDocument();
  });

  it('sends on Enter but not Shift+Enter', async () => {
    const respond = vi.fn().mockResolvedValue('ok');
    render(<WritingAssistant respond={respond} />);
    const box = screen.getByRole('textbox', { name: 'Message' });
    fireEvent.change(box, { target: { value: 'Draft a note' } });
    fireEvent.keyDown(box, { key: 'Enter', shiftKey: true });
    expect(respond).not.toHaveBeenCalled();
    await act(async () => {
      fireEvent.keyDown(box, { key: 'Enter' });
    });
    expect(respond).toHaveBeenCalledWith('Draft a note');
  });

  it('simulated dictation toggles aria-pressed and sends the take', async () => {
    vi.useFakeTimers();
    const respond = vi.fn().mockResolvedValue('ok');
    render(<WritingAssistant speech="simulate" dictation="Two words" respond={respond} />);
    const mic = screen.getByRole('button', { name: 'Start dictation' });
    fireEvent.click(mic);
    expect(screen.getByRole('button', { name: 'Stop dictation' })).toHaveAttribute('aria-pressed', 'true');
    await act(async () => void vi.advanceTimersByTime(1500));
    expect(respond).toHaveBeenCalledWith('Two words');
  });

  it('recovers when respond rejects: shows a fallback reply and re-enables sending', async () => {
    const respond = vi.fn().mockRejectedValue(new Error('network'));
    render(<WritingAssistant respond={respond} />);
    const box = screen.getByRole('textbox', { name: 'Message' });
    fireEvent.change(box, { target: { value: 'Draft a note' } });
    await act(async () => {
      fireEvent.keyDown(box, { key: 'Enter' });
    });
    expect(screen.getByText(/Quill could not reply/)).toHaveAttribute('role', 'status');
    respond.mockResolvedValue('ok');
    fireEvent.change(box, { target: { value: 'Try again' } });
    await act(async () => {
      fireEvent.keyDown(box, { key: 'Enter' });
    });
    expect(respond).toHaveBeenCalledTimes(2);
  });

  it('drops a reply that arrives after New chat', async () => {
    let resolve: (v: string) => void = () => undefined;
    const respond = vi.fn().mockImplementation(() => new Promise<string>((r) => { resolve = r; }));
    render(<WritingAssistant respond={respond} suggestions={['Shorten this']} />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Shorten this' }));
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'New chat' }));
    });
    await act(async () => resolve('Late reply'));
    expect(screen.queryByText('Late reply')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Shorten this' })).toBeInTheDocument();
  });

  it('renders duplicate suggestions and a keyboard-reachable conversation region', () => {
    render(<WritingAssistant suggestions={['Same', 'Same']} />);
    expect(screen.getAllByRole('button', { name: 'Same' })).toHaveLength(2);
    expect(screen.getByRole('region', { name: 'Conversation' })).toHaveAttribute('tabindex', '0');
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<WritingAssistant ref={ref} className="extra" />);
    expect(ref.current).toHaveClass('extra');
  });
});
