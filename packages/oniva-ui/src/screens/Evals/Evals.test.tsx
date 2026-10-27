import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Evals } from './Evals';

describe('Evals', () => {
  afterEach(() => vi.useRealTimers());

  it('renders landmarks, one h1 and the test table', () => {
    render(<Evals />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('grid', { name: 'Test cases' })).toBeInTheDocument();
  });

  it('filters failing cases', async () => {
    render(<Evals />);
    await userEvent.click(screen.getByRole('radio', { name: /Failing/ }));
    const grid = screen.getByRole('grid', { name: 'Test cases' });
    expect(within(grid).getAllByRole('row')).toHaveLength(4); // header + 3 failing
  });

  it('selects a case with the keyboard', async () => {
    const onSelectCase = vi.fn();
    render(<Evals onSelectCase={onSelectCase} />);
    const row = screen.getByRole('row', { name: /Cite the article/ });
    row.focus();
    await userEvent.keyboard('{Enter}');
    expect(onSelectCase).toHaveBeenCalledWith('TC-105');
    expect(screen.getByRole('heading', { name: 'Cite the article' })).toBeInTheDocument();
  });

  it('reviews prompt changes with Y and N', async () => {
    render(<Evals />);
    const changes = document.querySelectorAll<HTMLElement>('[data-decision]');
    changes[0]!.focus();
    await userEvent.keyboard('y');
    expect(changes[0]).toHaveAttribute('data-decision', 'accepted');
    changes[1]!.focus();
    await userEvent.keyboard('n');
    expect(changes[1]).toHaveAttribute('data-decision', 'rejected');
  });

  it('re-runs the eval and applies accepted changes', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const onRun = vi.fn();
    render(<Evals onRun={onRun} />);
    const changes = document.querySelectorAll<HTMLElement>('[data-decision]');
    changes.forEach((c) => {
      c.focus();
      act(() => {
        c.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', bubbles: true }));
      });
    });
    await userEvent.click(screen.getByRole('button', { name: /Run eval/ }));
    expect(onRun).toHaveBeenCalled();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1300);
    });
    expect(
      screen
        .getAllByRole('status')
        .map((n) => n.textContent)
        .join(' '),
    ).toContain('100%');
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Evals ref={ref} className="x" />);
    expect(container.querySelector('.x')).toBe(ref.current);
  });
});
