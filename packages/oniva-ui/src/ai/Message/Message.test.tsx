import { fireEvent, render, screen } from '@testing-library/react';
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
    fireEvent.click(screen.getByRole('button', { name: 'Retry response' }));
    expect(onRetry).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Good response' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Bad response' }));
    expect(onFeedback).toHaveBeenCalledWith('down');
  });
});
