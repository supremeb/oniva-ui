import { render } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { usePopOnChange } from './w4-parts';

function Probe({ v }: { v: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  usePopOnChange(ref, v);
  return <span ref={ref}>{v}</span>;
}

function mockReduced(reduced: boolean) {
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: reduced && q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));
}

describe('usePopOnChange', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('pops on change, not on mount', () => {
    mockReduced(false);
    const animate = vi.fn();
    HTMLElement.prototype.animate = animate as never;
    const { rerender } = render(<Probe v={1} />);
    expect(animate).not.toHaveBeenCalled();
    rerender(<Probe v={2} />);
    expect(animate).toHaveBeenCalledTimes(1);
  });

  it('does nothing under reduced motion', () => {
    mockReduced(true);
    const animate = vi.fn();
    HTMLElement.prototype.animate = animate as never;
    const { rerender } = render(<Probe v={1} />);
    rerender(<Probe v={2} />);
    expect(animate).not.toHaveBeenCalled();
  });
});
