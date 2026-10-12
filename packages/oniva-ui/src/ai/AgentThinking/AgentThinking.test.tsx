import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AgentThinking } from './AgentThinking';

afterEach(() => vi.useRealTimers());

describe('AgentThinking', () => {
  it('counts elapsed seconds while thinking', () => {
    vi.useFakeTimers();
    render(<AgentThinking isThinking>Comparing segments…</AgentThinking>);
    expect(screen.getByText('Thinking…')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText('3s')).toBeInTheDocument();
  });

  it('shows duration when done and expands reasoning', () => {
    render(<AgentThinking seconds={12}>Q3 beat plan by 6%.</AgentThinking>);
    const btn = screen.getByRole('button', { name: /Thought for 12s/ });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Q3 beat plan by 6%.')).toBeVisible();
  });
});
