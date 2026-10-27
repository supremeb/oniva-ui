import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ExperimentCard, type ExperimentMetric, type ExperimentVariant } from './ExperimentCard';

const metrics: ExperimentMetric[] = [
  { id: 'conversion', label: 'Conversion', format: (n) => `${n.toFixed(1)}%` },
  { id: 'latency', label: 'Latency', format: (n) => `${n} ms`, lowerIsBetter: true },
];
const variants: ExperimentVariant[] = [
  { id: 'a', key: 'A', name: 'Start free trial', control: true, visitors: 4790, values: { conversion: 4.0, latency: 200 } },
  { id: 'b', key: 'B', name: 'Try it free', visitors: 4812, values: { conversion: 5.0, latency: 180 }, confidence: { conversion: 96 } },
];
const base = { title: 'Signup button copy', variants, metrics, status: { label: 'Running', tone: 'green' as const }, note: 'Day 9 of 14' };

describe('ExperimentCard', () => {
  it('head button name carries status and who is ahead', () => {
    render(<ExperimentCard {...base} />);
    const head = screen.getByRole('button', { name: 'Signup button copy, Running, B ahead' });
    expect(head).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(head);
    expect(head).toHaveAttribute('aria-expanded', 'true');
  });

  it('variant names include value and change against baseline', () => {
    render(<ExperimentCard {...base} defaultOpen />);
    expect(screen.getByRole('radio', { name: 'B: Try it free, 5.0%, +25%' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'A: Start free trial, 4.0%, baseline' })).toBeInTheDocument();
  });

  it('switches metric and flips lead for lowerIsBetter', () => {
    render(<ExperimentCard {...base} defaultOpen />);
    fireEvent.click(screen.getByRole('radio', { name: 'Latency' }));
    expect(screen.getByRole('radio', { name: 'B: Try it free, 180 ms, −10%' })).toBeInTheDocument();
  });

  it('picks and releases a winner, shows the action on the tray', () => {
    const onWinnerChange = vi.fn();
    const onClick = vi.fn();
    render(
      <ExperimentCard {...base} defaultOpen onWinnerChange={onWinnerChange} action={{ label: (v) => `Ship ${v.key}`, onClick }} />,
    );
    const b = screen.getByRole('radio', { name: /B: Try it free/ });
    fireEvent.click(b);
    expect(onWinnerChange).toHaveBeenCalledWith('b');
    fireEvent.click(screen.getByRole('button', { name: 'Ship B' }));
    expect(onClick).toHaveBeenCalledWith(variants[1]);
    fireEvent.click(screen.getByRole('radio', { name: /B: Try it free/ }));
    expect(onWinnerChange).toHaveBeenLastCalledWith(null);
    expect(screen.queryByRole('button', { name: 'Ship B' })).toBeNull();
  });

  it('closes with Escape and keeps closed content inert', () => {
    const { container } = render(<ExperimentCard {...base} defaultOpen />);
    const head = screen.getByRole('button', { name: /Signup button copy/ });
    fireEvent.keyDown(head, { key: 'Escape' });
    expect(head).toHaveAttribute('aria-expanded', 'false');
    expect(container.querySelector('[inert]')).toBeInTheDocument();
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ExperimentCard {...base} ref={ref} className="x" />);
    expect(ref.current).toHaveClass('x');
  });
});
