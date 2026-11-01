import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Message } from './Message';

describe('Message', () => {
  it('renders a user bubble without actions', () => {
    render(
      <Message role="user" name="Bala">
        Analyze Q3 revenue
      </Message>,
    );
    expect(screen.getByRole('article', { name: 'Bala message' })).toHaveAttribute(
      'data-role',
      'user',
    );
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('wires assistant actions', () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    const onRetry = vi.fn();
    const onFeedback = vi.fn();
    render(
      <Message
        role="assistant"
        copyText="Q3 revenue was $4.82M"
        onRetry={onRetry}
        onFeedback={onFeedback}
        feedback="up"
      >
        Q3 revenue was $4.82M
      </Message>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Copy message' }));
    expect(writeText).toHaveBeenCalledWith('Q3 revenue was $4.82M');
    fireEvent.click(screen.getByRole('button', { name: 'Regenerate response' }));
    expect(onRetry).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Mark response as good' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Mark response as bad' }));
    expect(onFeedback).toHaveBeenCalledWith('down');
  });

  it('groups assistant actions and announces a successful copy', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(
      <Message role="assistant" copyText="hello" onFeedback={() => {}}>
        hello
      </Message>,
    );
    expect(screen.getByRole('group', { name: 'Message actions' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Copy message' }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Copied to clipboard'));
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });

  it('does not confirm a copy when the clipboard write is rejected', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(
      <Message role="assistant" copyText="hello">
        hello
      </Message>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Copy message' }));
    await waitFor(() => expect(writeText).toHaveBeenCalled());
    await Promise.resolve();
    expect(screen.getByRole('status')).toHaveTextContent('');
    expect(screen.getByRole('button', { name: 'Copy message' })).toBeInTheDocument();
  });
});
