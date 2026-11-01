import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MessageActions } from './MessageActions';

describe('MessageActions', () => {
  it('copies, flips the label, and toggles feedback', () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const onFeedback = vi.fn();
    render(<MessageActions text="hello" onFeedback={onFeedback} onRegenerate={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(writeText).toHaveBeenCalledWith('hello');
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
    const like = screen.getByRole('button', { name: 'Mark response as good' });
    fireEvent.click(like);
    expect(like).toHaveAttribute('aria-pressed', 'true');
    expect(onFeedback).toHaveBeenLastCalledWith('like');
    fireEvent.click(like);
    expect(onFeedback).toHaveBeenLastCalledWith(null);
  });
});

describe('MessageActions (loop 7)', () => {
  it('switches versions with the arrows and announces', () => {
    const onVersionChange = vi.fn();
    render(<MessageActions text="a" versions={3} onRegenerate={() => {}} onVersionChange={onVersionChange} />);
    expect(screen.getByRole('img', { name: 'Version 3 of 3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next version' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Previous version' }));
    expect(onVersionChange).toHaveBeenCalledWith(1);
    expect(screen.getByRole('img', { name: 'Version 2 of 3' })).toBeInTheDocument();
  });

  it('asks for a reason after a dislike and reports it', () => {
    const onFeedback = vi.fn();
    render(<MessageActions text="a" onFeedback={onFeedback} />);
    fireEvent.click(screen.getByRole('button', { name: 'Mark response as bad' }));
    expect(onFeedback).toHaveBeenLastCalledWith('dislike');
    fireEvent.click(screen.getByRole('button', { name: 'Too long' }));
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(onFeedback).toHaveBeenLastCalledWith('dislike', 'Too long');
  });

  it('toggles read aloud and forwards ref/className', () => {
    const onSpeak = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(<MessageActions ref={ref} className="extra" text="a" onSpeak={onSpeak} />);
    expect(ref.current).toHaveClass('extra');
    fireEvent.click(screen.getByRole('button', { name: 'Read aloud' }));
    expect(onSpeak).toHaveBeenCalledWith(true);
    expect(screen.getByRole('button', { name: 'Stop reading aloud' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('spins the regenerate arrow while regenerating', () => {
    render(<MessageActions text="a" onRegenerate={() => {}} isRegenerating />);
    expect(screen.getByRole('button', { name: 'Regenerate response' })).toBeInTheDocument();
  });
});

describe('MessageActions (state pass)', () => {
  it('keeps the reason row inert until a dislike opens it', () => {
    const { container } = render(<MessageActions text="a" />);
    const group = container.querySelector('[aria-label="Why was this response not helpful?"]')!;
    expect(group).toHaveAttribute('inert');
    fireEvent.click(screen.getByRole('button', { name: 'Mark response as bad' }));
    expect(group).not.toHaveAttribute('inert');
  });

  it('shows the version count as text outside the dimmed buttons', () => {
    render(<MessageActions text="a" versions={12} version={9} onRegenerate={() => {}} />);
    expect(screen.getByRole('img', { name: 'Version 10 of 12' })).toHaveTextContent('/ 12');
  });

  it('does not touch the document after unmount while the panel confirmation is pending', () => {
    vi.useFakeTimers();
    const onFeedback = vi.fn();
    const { unmount } = render(<MessageActions variant="panel" text="a" defaultFeedback="dislike" defaultReasonOpen onFeedback={onFeedback} />);
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(onFeedback).toHaveBeenLastCalledWith('dislike', 'Too long');
    unmount();
    expect(() => vi.advanceTimersByTime(2000)).not.toThrow();
    vi.useRealTimers();
  });

  it('lets reason chips take the shared focus ring', () => {
    render(<MessageActions text="a" defaultFeedback="dislike" defaultReasonOpen />);
    const chip = screen.getByRole('button', { name: 'Not accurate' });
    chip.focus();
    expect(chip).toHaveFocus();
  });
});
