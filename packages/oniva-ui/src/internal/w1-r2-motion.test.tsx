import { act, render, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useEase, useLeaving } from './w1-r2-motion';

function reduce(on: boolean) {
  window.matchMedia = ((q: string) => ({ matches: on && q.includes('reduce'), media: q, addEventListener: () => undefined, removeEventListener: () => undefined, addListener: () => undefined, removeListener: () => undefined, onchange: null, dispatchEvent: () => false })) as never;
}

describe('w1-r2-motion', () => {
  it('useEase follows the target at once under reduced motion', () => {
    reduce(true);
    const { result, rerender } = renderHook(({ v }) => useEase(v), { initialProps: { v: 4 } });
    rerender({ v: 9 });
    expect(result.current).toBe(9);
  });

  it('useLeaving keeps removed items briefly, and drops them at once under reduced motion', () => {
    reduce(false);
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ items }) => useLeaving(items, 100), { initialProps: { items: [{ id: 'a' }, { id: 'b' }] } });
    rerender({ items: [{ id: 'a' }] });
    expect(result.current.map((x) => [x.item.id, x.leaving])).toEqual([['a', false], ['b', true]]);
    act(() => void vi.advanceTimersByTime(120));
    expect(result.current.map((x) => x.item.id)).toEqual(['a']);
    reduce(true);
    rerender({ items: [{ id: 'a' }, { id: 'c' }] });
    rerender({ items: [{ id: 'a' }] });
    expect(result.current.map((x) => x.item.id)).toEqual(['a']);
    vi.useRealTimers();
    render(<div />);
  });
});
