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
