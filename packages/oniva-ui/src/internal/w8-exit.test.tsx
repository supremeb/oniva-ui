import { act, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useRetained } from './w8-exit';

function List({ ids }: { ids: string[] }) {
  const rows = useRetained(ids, (i) => i, 100);
  return (
    <ul>
      {rows.map(({ item, exiting }) => (
        <li key={item} data-exit={exiting ? '' : undefined}>
          {item}
        </li>
      ))}
    </ul>
  );
}

describe('useRetained', () => {
  it('keeps a removed item flagged exiting, then drops it', () => {
    vi.useFakeTimers();
    const { container, rerender } = render(<List ids={['a', 'b']} />);
    rerender(<List ids={['a']} />);
    expect(container.querySelector('[data-exit]')?.textContent).toBe('b');
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(container.querySelectorAll('li')).toHaveLength(1);
    vi.useRealTimers();
  });
  it('drops immediately under reduced motion', () => {
    const mm = window.matchMedia;
    window.matchMedia = ((q: string) => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false })) as typeof window.matchMedia;
    const { container, rerender } = render(<List ids={['a', 'b']} />);
    rerender(<List ids={['a']} />);
    expect(container.querySelectorAll('li')).toHaveLength(1);
    window.matchMedia = mm;
  });
});
