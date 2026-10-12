import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ThinkingStates } from './ThinkingStates';

describe('ThinkingStates', () => {
  afterEach(() => vi.useRealTimers());
  it('swaps to the next message after the hold', () => {
    vi.useFakeTimers();
    render(<ThinkingStates messages={['One', 'Two']} />);
    expect(screen.getByRole('status')).toHaveTextContent('One');
    act(() => void vi.advanceTimersByTime(2000));
    expect(screen.getByRole('status')).toHaveTextContent('Two');
    act(() => void vi.advanceTimersByTime(500));
    expect(screen.getByRole('status')).toHaveTextContent('Two');
  });
});
