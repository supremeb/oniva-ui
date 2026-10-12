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
