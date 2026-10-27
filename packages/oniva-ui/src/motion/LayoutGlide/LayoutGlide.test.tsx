import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LayoutGlide } from './LayoutGlide';

const List = ({ ids }: { ids: string[] }) => (
  <LayoutGlide data-testid="g" className="g">
    {ids.map((i) => (
      <div key={i} data-glide-id={i}>
        {i}
      </div>
    ))}
  </LayoutGlide>
);

afterEach(() => vi.restoreAllMocks());

describe('LayoutGlide', () => {
  it('forwards className and renders children', () => {
    render(<List ids={['a', 'b']} />);
    expect(screen.getByTestId('g')).toHaveClass('g');
    expect(screen.getByText('b')).toBeInTheDocument();
  });
  it('animates entering items after the first render with transform/opacity only', () => {
    const calls: Keyframe[][] = [];
    (HTMLElement.prototype as unknown as { animate: unknown }).animate = vi.fn((kf: Keyframe[]) => {
      calls.push(kf);
      return {};
    });
    const { rerender } = render(<List ids={['a']} />);
    expect(calls).toHaveLength(0);
    rerender(<List ids={['a', 'b']} />);
    expect(calls).toHaveLength(1);
    expect(Object.keys(calls[0]![0]!).sort()).toEqual(['opacity', 'transform']);
    delete (HTMLElement.prototype as unknown as { animate?: unknown }).animate;
  });
  it('skips animation under reduced motion', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));
    const spy = vi.fn();
    (HTMLElement.prototype as unknown as { animate: unknown }).animate = spy;
    const { rerender } = render(<List ids={['a']} />);
    rerender(<List ids={['a', 'b']} />);
    expect(spy).not.toHaveBeenCalled();
    delete (HTMLElement.prototype as unknown as { animate?: unknown }).animate;
    vi.unstubAllGlobals();
  });
});
