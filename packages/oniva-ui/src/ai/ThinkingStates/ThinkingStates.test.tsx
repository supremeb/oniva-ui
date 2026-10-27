import { act, fireEvent, render, screen } from '@testing-library/react';
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

describe('ThinkingStates panel', () => {
  afterEach(() => vi.useRealTimers());
  const steps = [
    { kind: 'search' as const, label: 'Searched', sources: [{ label: 'a.example' }, { label: 'b.example' }, { label: 'c.example' }, { label: 'd.example' }, { label: 'e.example' }] },
    { label: 'Reading the sources' },
  ];
  it('reveals steps one by one, finishes and reports seconds', () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    render(<ThinkingStates steps={steps} stepMs={1000} onDone={onDone} />);
    expect(screen.getByText('Searched')).toBeInTheDocument();
    expect(screen.queryByText('Reading the sources')).toBeNull();
    act(() => void vi.advanceTimersByTime(1000));
    expect(screen.getByText('Reading the sources')).toBeInTheDocument();
    act(() => void vi.advanceTimersByTime(1000));
    expect(screen.getByText('Finished thinking')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Worked for/ })).toBeInTheDocument();
    expect(onDone).toHaveBeenCalledTimes(1);
  });
  it('collapses via the header and expands hidden sources', () => {
    render(<ThinkingStates steps={steps} />);
    const head = screen.getByRole('button', { name: /Thinking/ });
    expect(head).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(head);
    expect(head).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(head);
    fireEvent.click(screen.getByRole('button', { name: '+2 more' }));
    expect(screen.getByText('e.example')).toBeInTheDocument();
  });
});
