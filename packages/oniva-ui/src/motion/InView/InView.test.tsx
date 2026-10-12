import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InView } from './InView';

describe('InView', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('is visible immediately without IntersectionObserver', () => {
    render(<InView className="c">hi</InView>);
    expect(screen.getByText('hi')).toHaveAttribute('data-state', 'entering');
  });

  it('waits for intersection, then plays once', () => {
    let cb: (e: Partial<IntersectionObserverEntry>[]) => void = () => {};
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(c: typeof cb) { cb = c; }
        observe() {}
        disconnect() {}
      },
    );
    render(<InView>hi</InView>);
    expect(screen.getByText('hi')).not.toHaveAttribute('data-state');
    act(() => cb([{ isIntersecting: true }]));
    expect(screen.getByText('hi')).toHaveAttribute('data-state', 'entering');
  });
});
