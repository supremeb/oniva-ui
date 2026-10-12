import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { sleepStages } from '../_data/datasets';
import { DonutChart, PieChart } from './DonutChart';

describe('DonutChart', () => {
  it('shows the total in the centre and a slice per datum', () => {
    const { container } = render(<DonutChart data={sleepStages} />);
    expect(screen.getByText('440')).toBeInTheDocument();
    expect(container.querySelectorAll('path[tabindex="-1"]')).toHaveLength(sleepStages.length);
  });
  it('shows slice tooltip on focus', () => {
    render(<DonutChart data={sleepStages} />);
    fireEvent.focus(screen.getByLabelText(/^REM:/));
    expect(screen.getByRole('tooltip')).toHaveTextContent('Share');
  });
  it('PieChart has no centre label', () => {
    render(<PieChart data={sleepStages} />);
    expect(screen.queryByText('Total')).toBeNull();
  });
});
