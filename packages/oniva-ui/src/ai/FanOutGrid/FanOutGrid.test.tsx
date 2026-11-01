import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { FanOutGrid, type FanoutTask } from './FanOutGrid';

const tasks: FanoutTask[] = [
  { id: '1', label: 'northwind-labs.example', status: 'done', start: 0, end: 4000, cost: 0.02, result: 'Series B, 120 staff' },
  { id: '2', label: 'harbor-freight.example', status: 'done', start: 0, end: 6000, cost: 0.03 },
  { id: '3', label: 'lumen-works.example', status: 'done', start: 1000, end: 6000, cost: 0.02 },
  { id: '4', label: 'quill-press.example', status: 'failed', start: 1000, end: 3000, error: 'Site blocked the crawler', attempts: 2 },
  { id: '5', label: 'atlas-cargo.example', status: 'running', start: 5000 },
  { id: '6', label: 'meridian-bio.example', status: 'queued' },
];


const stubReduce = () =>
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false }));

describe('FanOutGrid', () => {
  it('renders the same content under prefers-reduced-motion', () => {
    stubReduce();
    render(<FanOutGrid tasks={tasks} now={7000} />);
    expect(screen.getByRole('button', { name: 'atlas-cargo.example, running' })).toBeInTheDocument();
    vi.unstubAllGlobals();
  });

  it('shows counts, progress and time left', () => {
    render(<FanOutGrid tasks={tasks} job="Enrich 6 leads" workers={2} now={7000} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '67');
    expect(screen.getByText('4 / 6')).toBeInTheDocument();
    expect(screen.getByText('$0.07')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /3\s*Done/ })).toBeInTheDocument();
  });

  it('walks cells with arrows and shows details; Enter pins, Esc releases', () => {
    const onSelect = vi.fn();
    render(<FanOutGrid tasks={tasks} now={7000} onSelect={onSelect} />);
    const first = screen.getByRole('button', { name: 'northwind-labs.example, done' });
    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(screen.getByRole('button', { name: 'harbor-freight.example, done' })).toHaveFocus();
    fireEvent.keyDown(document.activeElement!, { key: 'End' });
    expect(screen.getByRole('button', { name: 'meridian-bio.example, queued' })).toHaveFocus();
    fireEvent.click(screen.getByRole('button', { name: 'quill-press.example, failed' }));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: '4' }));
    expect(screen.getByText('Site blocked the crawler')).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('button', { name: 'quill-press.example, failed' }), { key: 'Escape' });
    expect(onSelect).toHaveBeenLastCalledWith(null);
  });

  it('filters by state and retries failed tasks', () => {
    const onRetry = vi.fn();
    render(<FanOutGrid tasks={tasks} onRetry={onRetry} />);
    fireEvent.click(screen.getByRole('button', { name: 'Retry failed' }));
    expect(onRetry).toHaveBeenCalledWith(['4']);
    const chip = screen.getByRole('button', { name: /1\s*Failed/ });
    fireEvent.click(chip);
    expect(chip).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows a hint instead of details, an empty message with no tasks, and hides time left once settled', () => {
    const { rerender } = render(<FanOutGrid tasks={tasks} now={7000} />);
    expect(screen.getByText('Hover or focus a cell for details.')).toBeInTheDocument();
    rerender(<FanOutGrid tasks={[]} />);
    expect(screen.getByText('No tasks in this job yet.')).toBeInTheDocument();
    expect(screen.queryByText(/left$|Time left/)).not.toBeInTheDocument();
    rerender(<FanOutGrid tasks={tasks.map((t) => ({ ...t, status: 'done' as const }))} />);
    expect(screen.queryByText(/Time left|left$/)).not.toBeInTheDocument();
  });

  it('does not announce progress on first render', async () => {
    render(<FanOutGrid tasks={tasks.map((t) => ({ ...t, status: 'done' as const }))} />);
    await Promise.resolve();
    expect(screen.queryByText(/Finished:/)).not.toBeInTheDocument();
  });

  it('announces when a job settles after mounting', async () => {
    const { rerender } = render(<FanOutGrid tasks={tasks} now={7000} />);
    rerender(<FanOutGrid tasks={tasks.map((t) => ({ ...t, status: 'done' as const }))} now={9000} />);
    expect(await screen.findByText('Finished: 6 done, 0 failed.')).toBeInTheDocument();
  });

  it('forwards ref/className and passes axe', async () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<FanOutGrid ref={ref} className="x" tasks={tasks} now={7000} />);
    expect(ref.current).toHaveClass('x');
    await expectNoA11yViolations(container);
  });
});
