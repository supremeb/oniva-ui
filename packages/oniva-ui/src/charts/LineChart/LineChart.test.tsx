import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { tokenUsage } from '../_data/datasets';
import { LineChart } from './LineChart';

const series = [
  { key: 'input', label: 'Input' },
  { key: 'output', label: 'Output' },
];

describe('LineChart', () => {
  it('renders one dot per point and one path per series', () => {
    const { container } = render(<LineChart data={tokenUsage} index="day" series={series} />);
    expect(container.querySelectorAll('circle')).toHaveLength(tokenUsage.length * series.length);
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      expect.stringContaining('Line chart'),
    );
  });
  it('hides dots when asked and tooltips on focus', () => {
    const { container } = render(
      <LineChart data={tokenUsage} index="day" series={series} dots={false} />,
    );
    expect(container.querySelectorAll('circle')).toHaveLength(0);
    fireEvent.focus(screen.getByLabelText(/^Wed:/));
    expect(screen.getByRole('tooltip')).toHaveTextContent('Output');
  });
});
