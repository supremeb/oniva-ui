import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { revenueByMonth } from '../_data/datasets';
import { AreaChart } from './AreaChart';

const series = [
  { key: 'revenue', label: 'Revenue' },
  { key: 'expenses', label: 'Expenses' },
];

describe('AreaChart', () => {
  it('exposes an accessible summary and a hidden data table', () => {
    render(
      <AreaChart data={revenueByMonth} index="month" series={series} label="Revenue by month" />,
    );
    expect(screen.getByRole('img', { name: 'Revenue by month' })).toBeInTheDocument();
    expect(screen.getByRole('table', { hidden: true })).toBeInTheDocument();
  });
  it('shows a tooltip on focus and hides it on Escape', () => {
    render(<AreaChart data={revenueByMonth} index="month" series={series} />);
    const pt = screen.getByLabelText(/^Mar:/);
    fireEvent.focus(pt);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Revenue');
    fireEvent.keyDown(pt, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
  it('forwards className and ref', () => {
    let el: HTMLDivElement | null = null;
    render(
      <AreaChart
        data={revenueByMonth}
        index="month"
        series={series}
        className="x"
        ref={(n) => {
          el = n;
        }}
      />,
    );
    expect(el).toHaveClass('x');
  });
  it('supports stacked and percent modes', () => {
    const { container } = render(
      <AreaChart data={revenueByMonth} index="month" series={series} stacked="percent" />,
    );
    expect(container.textContent).toContain('100%');
  });
});
