import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FeedbackBar } from './FeedbackBar';

describe('FeedbackBar', () => {
  it('submits thumbs up immediately', () => {
    const onSubmit = vi.fn();
    render(<FeedbackBar onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
    expect(onSubmit).toHaveBeenCalledWith({ rating: 'up' });
    expect(screen.getByRole('status')).toHaveTextContent('Thanks');
  });

  it('asks for a reason on thumbs down', () => {
    const onSubmit = vi.fn();
    render(<FeedbackBar onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: 'No' }));
    fireEvent.click(screen.getByRole('button', { name: 'Too long' }));
    expect(onSubmit).toHaveBeenCalledWith({ rating: 'down', reason: 'Too long' });
  });
});
