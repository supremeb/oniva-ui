import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProgressTracker, type ProgressStep } from './ProgressTracker';

const steps: ProgressStep[] = [
  { id: 'tools', label: 'Connect your tools' },
  { id: 'notify', label: 'Turn on notifications' },
  { id: 'project', label: 'Create a project', done: true },
];

afterEach(() => vi.useRealTimers());

describe('ProgressTracker', () => {
  it('renders checkboxes and a progressbar with the count as text', () => {
    render(<ProgressTracker steps={steps} />);
    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
    expect(screen.getByRole('checkbox', { name: 'Create a project' })).toBeChecked();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '1 of 3 done');
  });

  it('ticks a step and reports every step', () => {
    const onChange = vi.fn();
    render(<ProgressTracker steps={steps} onChange={onChange} />);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Connect your tools' }));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '2 of 3 done');
    const last = onChange.mock.calls.at(-1)![0] as ProgressStep[];
    expect(last.map((s) => s.done)).toEqual([true, false, true]);
  });

  it('toggles with the keyboard', () => {
    render(<ProgressTracker steps={steps} />);
    const cb = screen.getByRole('checkbox', { name: 'Turn on notifications' });
    cb.focus();
    fireEvent.click(cb);
    expect(cb).toBeChecked();
  });

  it('auto plays and stops on interaction', () => {
    vi.useFakeTimers();
    render(<ProgressTracker steps={steps} autoPlay interval={1000} />);
    act(() => void vi.advanceTimersByTime(1000));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '2 of 3 done');
    fireEvent.pointerDown(screen.getByRole('checkbox', { name: 'Turn on notifications' }));
    act(() => void vi.advanceTimersByTime(5000));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '2 of 3 done');
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLElement>();
    render(<ProgressTracker steps={steps} ref={ref} className="x" />);
    expect(ref.current).toHaveClass('x');
  });
});
