import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MetricsDashboard } from './MetricsDashboard';

describe('MetricsDashboard', () => {
  it('renders KPI tabs, chart and breakdown lists', () => {
    render(<MetricsDashboard />);
    expect(screen.getByRole('tablist', { name: 'Metric' })).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(4);
    expect(screen.getByRole('tab', { name: /Revenue/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Top products')).toBeInTheDocument();
    expect(screen.getByText('Organic search')).toBeInTheDocument();
  });
  it('arrow keys move between metric tabs', async () => {
    render(<MetricsDashboard />);
    screen.getByRole('tab', { name: /Revenue/ }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: /Orders/ })).toHaveAttribute('aria-selected', 'true');
  });
  it('switches chart type with pressed state and period', async () => {
    render(<MetricsDashboard />);
    const bars = screen.getByRole('button', { name: 'Bars' });
    expect(bars).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(bars);
    expect(bars).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(screen.getByRole('radio', { name: 'Week' }));
    expect(screen.getByRole('radio', { name: 'Week' })).toBeChecked();
  });
  it('export calls back and confirms locally', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const onExport = vi.fn();
    render(<MetricsDashboard onExport={onExport} />);
    await userEvent.click(screen.getByRole('button', { name: 'Export' }));
    expect(onExport).toHaveBeenCalledWith('30d', 'revenue');
    expect(screen.getByRole('button', { name: 'Exported' })).toBeInTheDocument();
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    vi.useRealTimers();
  });
  it('forwards ref and className', () => {
    const ref = vi.fn();
    render(<MetricsDashboard ref={ref} className="x" data-testid="m" />);
    expect(ref).toHaveBeenCalled();
    expect(screen.getByTestId('m')).toHaveClass('x');
  });
});
