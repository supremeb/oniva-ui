import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { niceRange, TraceWaterfall, type TraceSpan } from './TraceWaterfall';

const run: TraceSpan = {
  id: 'run', name: 'Orchestrator', kind: 'agent', status: 'done', start: 0, end: 9000, input: 'Launch the pricing page',
  children: [
    { id: 'plan', name: 'Plan the launch', kind: 'llm', status: 'done', start: 500, end: 3500, tokensIn: 3240, tokensOut: 880, cost: 0.115, output: 'Three steps' },
    { id: 'sub', name: 'Copywriter', kind: 'subagent', status: 'done', start: 3600, end: 8800, children: [
      { id: 'draft', name: 'Draft copy', kind: 'llm', status: 'done', start: 3700, end: 8000, tokensIn: 1200, tokensOut: 600, cost: 0.05 },
    ] },
    { id: 'search', name: 'web_search', kind: 'tool', status: 'failed', start: 3600, end: 4200, error: 'Timed out' },
  ],
};

describe('niceRange', () => {
  it('grows in round steps', () => {
    expect(niceRange(3000)).toBe(10_000);
    expect(niceRange(10_500)).toBe(15_000);
    expect(niceRange(100_000)).toBe(120_000);
  });
});

describe('TraceWaterfall', () => {
  it('is a tree with levels, sums children and marks the slowest call', async () => {
    const { container } = render(<TraceWaterfall root={run} />);
    const items = screen.getAllByRole('treeitem');
    expect(items).toHaveLength(5);
    expect(items[0]).toHaveAttribute('aria-level', '1');
    expect(items[1]).toHaveAttribute('aria-level', '2');
    expect(items[3]).toHaveAttribute('aria-level', '3');
    expect(items[0]).toHaveAccessibleName(/Orchestrator, agent, done, 9\.0s, \$0\.165/);
    expect(screen.getByText('Slowest')).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  it('roving focus with arrows; right/left fold and unfold', () => {
    const onCollapsedChange = vi.fn();
    render(<TraceWaterfall root={run} onCollapsedChange={onCollapsedChange} />);
    const items = screen.getAllByRole('treeitem');
    expect(items.filter((i) => i.tabIndex === 0)).toHaveLength(1);
    items[0]!.focus();
    fireEvent.keyDown(items[0]!, { key: 'ArrowDown' });
    expect(items[1]).toHaveFocus();
    fireEvent.keyDown(items[2]!, { key: 'ArrowLeft' });
    expect(onCollapsedChange).toHaveBeenCalledWith(['sub']);
    expect(screen.getAllByRole('treeitem')).toHaveLength(4);
    fireEvent.keyDown(screen.getAllByRole('treeitem')[2]!, { key: 'ArrowRight' });
    expect(screen.getAllByRole('treeitem')).toHaveLength(5);
  });

  it('opens details on Enter and closes on Escape returning focus', () => {
    const onOpenChange = vi.fn();
    render(<TraceWaterfall root={run} onOpenChange={onOpenChange} />);
    const row = screen.getByRole('treeitem', { name: /Plan the launch/ });
    row.focus();
    fireEvent.keyDown(row, { key: 'Enter' });
    const dlg = screen.getByRole('dialog', { name: 'Plan the launch details' });
    expect(within(dlg).getByText('Three steps')).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledWith('plan', expect.objectContaining({ id: 'plan' }));
    fireEvent.keyDown(dlg, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(row).toHaveFocus();
  });

  it('grows a running span with its own clock', () => {
    vi.useFakeTimers();
    const live: TraceSpan = { id: 'r', name: 'Run', kind: 'agent', status: 'running', start: 0, children: [{ id: 't', name: 'fetch', kind: 'tool', status: 'running', start: 1000 }] };
    render(<TraceWaterfall root={live} startedAt={Date.now() - 3000} />);
    expect(screen.getByText('Live')).toBeInTheDocument();
    const before = screen.getAllByText(/^\d+\.\ds$/).map((e) => e.textContent).join();
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getAllByText(/^\d+\.\ds$/).map((e) => e.textContent).join()).not.toBe(before);
    vi.useRealTimers();
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<TraceWaterfall root={run} ref={ref} className="x" />);
    expect(ref.current).toHaveClass('x');
  });
});
