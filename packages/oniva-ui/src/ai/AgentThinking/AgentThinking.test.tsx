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

  it('renders no panel or chevron and a non-interactive trigger without reasoning text', () => {
    const { container } = render(<AgentThinking seconds={3} defaultExpanded />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('Thought for 3s')).toBeInTheDocument();
    expect(container.querySelectorAll('svg')).toHaveLength(1); // sparkles only, no chevron
    expect(container.querySelector('[role="group"]')).toBeNull();
  });

  it('treats whitespace-only text as empty', () => {
    render(<AgentThinking seconds={1}>{'  \n '}</AgentThinking>);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('dims and disables the trigger when isDisabled', () => {
    render(
      <AgentThinking seconds={9} isDisabled>
        Reasoning
      </AgentThinking>,
    );
    expect(screen.getByRole('button', { name: /Thought for 9s/ })).toBeDisabled();
  });

  it('announces completion once when thinking ends', () => {
    const { rerender } = render(
      <AgentThinking isThinking seconds={12}>
        Reasoning
      </AgentThinking>,
    );
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('');
    rerender(<AgentThinking seconds={12}>Reasoning</AgentThinking>);
    expect(screen.getByRole('status')).toHaveTextContent('Thought for 12s');
  });

  it('keeps long unbroken text inside the panel', () => {
    render(
      <AgentThinking seconds={2} defaultExpanded>
        {'a'.repeat(200)}
      </AgentThinking>,
    );
    expect(screen.getByText('a'.repeat(200))).toBeInTheDocument();
  });
});
