import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../internal/test-a11y';
import { revenueByMonth, stepsByWeekday, trafficSources } from './_data/datasets';
import { BarChart } from './BarChart';
import { DonutChart } from './DonutChart';
import { LineChart } from './LineChart';

describe('chart a11y (axe)', () => {
  it('BarChart: group role + focusable data points have no violations', async () => {
    const { container } = render(
      <BarChart data={stepsByWeekday} index="day" series={[{ key: 'steps', label: 'Steps' }]} />,
    );
    const chart = screen.getByRole('group', { name: /./ });
    expect(chart).toHaveAttribute('aria-roledescription', 'chart');
    await expectNoA11yViolations(container);
  });
  it('LineChart has no violations', async () => {
    const { container } = render(
      <LineChart
        data={revenueByMonth}
        index="month"
        series={[{ key: 'revenue', label: 'Revenue' }]}
        dots
      />,
    );
    await expectNoA11yViolations(container);
  });
  it('DonutChart has no violations', async () => {
    const { container } = render(<DonutChart data={trafficSources} />);
    await expectNoA11yViolations(container);
  });
});
