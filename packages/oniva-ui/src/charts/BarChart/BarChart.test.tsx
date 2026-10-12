import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { stepsByWeekday, tokenUsage } from '../_data/datasets';
import { BarChart } from './BarChart';

describe('BarChart', () => {
  it('renders a focusable target per category with a summary label', () => {
    render(
      <BarChart
        data={stepsByWeekday}
        index="day"
        series={[{ key: 'steps', label: 'Steps' }]}
        track
      />,
    );
    expect(screen.getByLabelText(/^Mon: Steps 8,420/)).toBeInTheDocument();
    fireEvent.focus(screen.getByLabelText(/^Fri:/));
    expect(screen.getByRole('tooltip')).toHaveTextContent('Fri');
  });
  it('supports horizontal and stacked layouts', () => {
    const series = [{ key: 'input' }, { key: 'output' }];
    const { container, rerender } = render(
      <BarChart data={tokenUsage} index="day" series={series} layout="stacked" />,
    );
    const stacked = container.querySelectorAll('path').length;
    rerender(<BarChart data={tokenUsage} index="day" series={series} orientation="horizontal" />);
    expect(container.querySelectorAll('path').length).toBeGreaterThan(0);
    expect(stacked).toBeGreaterThan(0);
  });
  it('forwards className', () => {
    const { container } = render(
      <BarChart data={stepsByWeekday} index="day" series={[{ key: 'steps' }]} className="x" />,
    );
    expect(container.firstChild).toHaveClass('x');
  });
});
