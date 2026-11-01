import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ChainOfThought } from './ChainOfThought';

const steps = [
  { id: 'a', label: 'Read diff', status: 'complete' as const, results: [{ title: 'Docs', url: 'https://example.com/x' }] },
  { id: 'b', label: 'Write summary', status: 'active' as const },
];

describe('ChainOfThought', () => {
  it('renders steps with status and marks the active one', () => {
    render(<ChainOfThought steps={steps} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Write summary').closest('li')).toHaveAttribute('aria-current', 'step');
    expect(screen.getByRole('link', { name: /Docs/ })).toHaveAttribute('href', 'https://example.com/x');
  });
  it('toggles', () => {
    render(<ChainOfThought steps={steps} />);
    const b = screen.getByRole('button', { name: /Chain of thought/ });
    fireEvent.click(b);
    expect(b).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('ChainOfThought live', () => {
  it('shows the streaming label, then the duration summary', () => {
    const { rerender } = render(<ChainOfThought steps={steps} isStreaming />);
    expect(screen.getByRole('button', { name: /Thinking/ })).toBeInTheDocument();
    rerender(<ChainOfThought steps={steps} durationSeconds={4} />);
    expect(screen.getByRole('button', { name: /Thought for 4 seconds/ })).toBeInTheDocument();
  });
  it('appends steps and keeps earlier ones', () => {
    const { rerender } = render(<ChainOfThought steps={steps.slice(0, 1)} isStreaming />);
    rerender(<ChainOfThought steps={steps} isStreaming />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
  it('collapses after streaming when autoCollapse is on', async () => {
    vi.useFakeTimers();
    const { rerender } = render(<ChainOfThought steps={steps} isStreaming autoCollapse closeDelayMs={100} />);
    rerender(<ChainOfThought steps={steps} autoCollapse closeDelayMs={100} />);
    await act(async () => {
      vi.advanceTimersByTime(150);
    });
    expect(screen.getByRole('button', { name: /Chain of thought/ })).toHaveAttribute('aria-expanded', 'false');
    vi.useRealTimers();
  });
});

describe('ChainOfThought content', () => {
  it('gives long source chips a full-title tooltip so truncation loses nothing', () => {
    const title = 'Webhook retry policies and delivery guarantees for long-running consumers';
    render(<ChainOfThought steps={[{ id: 'a', label: 'Search', status: 'complete', results: [{ title, url: 'https://docs.northwind.example/w' }] }]} />);
    expect(screen.getByRole('link', { name: new RegExp(title) })).toHaveAttribute('title', title);
  });
  it('hides the timeline when there are no steps', () => {
    render(<ChainOfThought steps={[]} />);
    expect(screen.getByRole('button', { name: /Chain of thought/ })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
