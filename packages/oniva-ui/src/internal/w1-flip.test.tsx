import { act, render, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useLiveNow, useSpringMap } from './w1-flip';

function mockReduced(on: boolean) {
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: on && q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false }));
}

describe('w1-flip motion helpers', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('useSpringMap returns the targets as they are under reduced motion', () => {
    mockReduced(true);
    const a = new Map([['a', { x: 0, y: 0 }]]);
    const { result, rerender } = renderHook(({ t }) => useSpringMap(t), { initialProps: { t: a } });
    rerender({ t: new Map([['a', { x: 50, y: 20 }], ['b', { x: 5, y: 5 }]]) });
    expect(result.current.get('a')).toEqual({ x: 50, y: 20 });
    expect(result.current.get('b')).toEqual({ x: 5, y: 5 });
  });

  it('useLiveNow follows a controlled now immediately under reduced motion', () => {
    mockReduced(true);
    const { result, rerender } = renderHook(({ n }) => useLiveNow(n), { initialProps: { n: 1000 } });
    expect(result.current).toBe(1000);
    act(() => rerender({ n: 9000 }));
    expect(result.current).toBe(9000);
  });

  it('renders nothing by itself', () => {
    const { container } = render(<div />);
    expect(container.firstChild).toBeTruthy();
  });
});
