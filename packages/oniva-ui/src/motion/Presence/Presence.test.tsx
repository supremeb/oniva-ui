import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Presence } from './Presence';

describe('Presence', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('mounts with data-state, exits on animationend, and is interruptible', () => {
    const { rerender } = render(<Presence isPresent>hello</Presence>);
    const el = screen.getByText('hello');
    expect(el).toHaveAttribute('data-state', 'entering');
    fireEvent.animationEnd(el);
    expect(el).toHaveAttribute('data-state', 'entered');

    rerender(<Presence isPresent={false}>hello</Presence>);
    expect(screen.getByText('hello')).toHaveAttribute('data-state', 'exiting');
    // interrupt: present again, same node
    rerender(<Presence isPresent>hello</Presence>);
    expect(screen.getByText('hello')).toBe(el);
    expect(el).toHaveAttribute('data-state', 'entering');

    rerender(<Presence isPresent={false}>hello</Presence>);
    fireEvent.animationEnd(screen.getByText('hello'));
    expect(screen.queryByText('hello')).toBeNull();
  });

  it('falls back to a timeout when animationend never fires', () => {
    const { rerender } = render(<Presence isPresent exitTimeoutMs={200}>bye</Presence>);
    rerender(<Presence isPresent={false} exitTimeoutMs={200}>bye</Presence>);
    act(() => void vi.advanceTimersByTime(250));
    expect(screen.queryByText('bye')).toBeNull();
  });

  it('forwards className and ref', () => {
    let node: HTMLDivElement | null = null;
    render(<Presence isPresent className="x" ref={(n) => void (node = n)}>a</Presence>);
    expect(screen.getByText('a')).toHaveClass('x');
    expect(node).toBe(screen.getByText('a'));
  });
});
