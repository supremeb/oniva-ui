import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ResponseStream } from './ResponseStream';

afterEach(() => vi.useRealTimers());

describe('ResponseStream', () => {
  it('reveals text progressively and calls onComplete', () => {
    vi.useFakeTimers();
    const done = vi.fn();
    render(<ResponseStream data-testid="r" text="Revenue grew 12%" speed={4} intervalMs={10} onComplete={done} />);
    expect(screen.getByTestId('r')).toHaveTextContent('');
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(screen.getByTestId('r')).toHaveTextContent('Reve');
    for (let i = 0; i < 6; i++) {
      act(() => {
        vi.advanceTimersByTime(10);
      });
    }
    expect(screen.getByTestId('r')).toHaveTextContent('Revenue grew 12%');
    expect(done).toHaveBeenCalled();
  });

  it('shows everything when instant', () => {
    render(<ResponseStream text="Done" instant />);
    expect(screen.getByText('Done')).toBeInTheDocument();
  });
});
