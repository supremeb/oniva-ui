import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { AgentQueue, type QueueJob, type QueueWorker } from './AgentQueue';

const NOW = 100_000;
const workers: QueueWorker[] = [{ id: 'w1', name: 'Worker 1' }, { id: 'w2', name: 'Worker 2' }];
const jobs: QueueJob[] = [
  { id: 'j1', name: 'Summarize ticket 4821', kind: 'llm', status: 'running', worker: 'w1', enqueuedAt: 80_000, startedAt: 82_000, progress: 0.4 },
  { id: 'j2', name: 'Embed 240 docs', kind: 'tool', status: 'queued', enqueuedAt: 90_000 },
  { id: 'j3', name: 'Draft reply for Acme', kind: 'llm', status: 'queued', priority: 'high', enqueuedAt: 95_000 },
  { id: 'j4', name: 'Sync CRM', kind: 'agent', status: 'done', enqueuedAt: 50_000, startedAt: 52_000, endedAt: 70_000 },
  { id: 'j5', name: 'Fetch invoices', kind: 'tool', status: 'failed', enqueuedAt: 50_000, startedAt: 52_000, endedAt: 60_000, error: 'HTTP 502' },
];

describe('AgentQueue', () => {
  it('shows stats and puts high priority first in line', () => {
    render(<AgentQueue jobs={jobs} workers={workers} now={NOW} />);
    expect(screen.getByRole('region', { name: 'Waiting' })).toHaveTextContent('Draft reply for Acme');
    const queued = screen.getAllByRole('button', { name: /waiting/ });
    expect(queued[0]).toHaveAccessibleName(/Draft reply for Acme.*place 1 in line.*high priority/);
    expect(screen.getByText('/2')).toBeInTheDocument();
  });

  it('has one tab stop and walks jobs in flow order with arrows', () => {
    render(<AgentQueue jobs={jobs} workers={workers} now={NOW} />);
    const all = screen.getAllByRole('button', { name: /running|waiting/ });
    expect(all.filter((b) => b.getAttribute('tabindex') === '0')).toHaveLength(1);
    const run = screen.getByRole('button', { name: /Summarize ticket/ });
    const hi = screen.getByRole('button', { name: /Draft reply/ });
    const lo = screen.getByRole('button', { name: /Embed 240/ });
    run.focus();
    fireEvent.keyDown(run, { key: 'ArrowDown' });
    expect(hi).toHaveFocus();
    fireEvent.keyDown(hi, { key: 'End' });
    expect(lo).toHaveFocus();
    fireEvent.keyDown(lo, { key: 'Home' });
    expect(run).toHaveFocus();
  });

  it('pins a job card with promote and cancel, closes with Escape', () => {
    const onPromote = vi.fn();
    const onOpenChange = vi.fn();
    render(<AgentQueue jobs={jobs} workers={workers} now={NOW} onPromote={onPromote} onCancel={() => {}} onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Embed 240 docs/ }));
    expect(screen.getByRole('dialog', { name: 'Embed 240 docs details' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Move to front/ }));
    expect(onPromote).toHaveBeenCalledWith(expect.objectContaining({ id: 'j2' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(null, undefined);
  });

  it('pauses on rate limit, with a countdown and live announcement', () => {
    render(<AgentQueue jobs={jobs} workers={workers} now={NOW} rateLimits={[{ from: 90_000, until: 112_000, label: 'provider' }]} />);
    expect(screen.getAllByText(/Rate limited: provider/).length).toBeGreaterThan(0);
    expect(screen.getByText('Paused 12s')).toBeInTheDocument();
  });

  it('toggles pause and steps concurrency', () => {
    const onPausedChange = vi.fn();
    const onConcurrencyChange = vi.fn();
    render(<AgentQueue jobs={jobs} workers={workers} now={NOW} onPausedChange={onPausedChange} onConcurrencyChange={onConcurrencyChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    expect(onPausedChange).toHaveBeenCalledWith(true);
    fireEvent.click(screen.getByRole('button', { name: 'More workers' }));
    expect(onConcurrencyChange).toHaveBeenCalledWith(3);
  });

  it('describes the chart as an image and passes axe', async () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<AgentQueue ref={ref} className="x" jobs={jobs} workers={workers} now={NOW} backpressure={5} />);
    expect(ref.current).toHaveClass('x');
    expect(screen.getByRole('img', { name: /Queue depth: 2 waiting now/ })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});
