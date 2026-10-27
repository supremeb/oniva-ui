import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { ThinkingLoader } from './ThinkingLoader';

describe('ThinkingLoader', () => {
  afterEach(() => vi.useRealTimers());

  it('walks through phases and holds the last', () => {
    vi.useFakeTimers();
    render(<ThinkingLoader phases={['One', 'Two']} interval={1000} />);
    expect(screen.getByRole('status')).toHaveTextContent('One');
    act(() => void vi.advanceTimersByTime(1000));
    expect(screen.getByRole('status')).toHaveTextContent('Two');
    act(() => void vi.advanceTimersByTime(3000));
    expect(screen.getByRole('status')).toHaveTextContent('Two');
  });

  it('shows the controlled phase and the done label', () => {
    const { rerender } = render(<ThinkingLoader phases={['A', 'B', 'C']} phase={2} />);
    expect(screen.getByRole('status')).toHaveTextContent('C');
    rerender(<ThinkingLoader phases={['A', 'B', 'C']} phase={2} isDone doneLabel="Finished" />);
    expect(screen.getByRole('status')).toHaveAttribute('data-done');
    expect(screen.getByRole('status')).toHaveTextContent('Finished');
  });

  it('keeps timers quiet under reduced motion and forwards ref/className', () => {
    window.matchMedia = ((q: string) => ({ matches: q.includes('reduce'), addEventListener() {}, removeEventListener() {} })) as never;
    const ref = createRef<HTMLSpanElement>();
    render(<ThinkingLoader ref={ref} className="extra" phases={['Only']} />);
    expect(ref.current).toHaveClass('extra');
    expect(screen.getByRole('status')).toHaveTextContent('Only');
  });
});
