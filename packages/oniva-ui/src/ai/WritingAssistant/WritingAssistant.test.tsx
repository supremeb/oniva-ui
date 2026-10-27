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

  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<WritingAssistant ref={ref} className="extra" />);
    expect(ref.current).toHaveClass('extra');
  });
});
