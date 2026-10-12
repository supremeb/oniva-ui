import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { contributionYear } from '../_data/datasets';
import { ContributionHeatmap, Heatmap } from './Heatmap';

const year = contributionYear();

describe('Heatmap', () => {
  it('renders a cell per matrix entry', () => {
    const { container } = render(
      <Heatmap
        rows={['A', 'B']}
        columns={['x', 'y', 'z']}
        values={[
          [1, 2, 3],
          [0, 5, 9],
        ]}
      />,
    );
    expect(container.querySelectorAll('rect[tabindex="-1"]')).toHaveLength(6);
  });
  it('contribution calendar respects the range', () => {
    const { container, rerender } = render(<ContributionHeatmap data={year} range="yearly" />);
    const yearly = container.querySelectorAll('rect[tabindex="-1"]').length;
    rerender(<ContributionHeatmap data={year} range="weekly" />);
    expect(container.querySelectorAll('rect[tabindex="-1"]')).toHaveLength(7);
    expect(yearly).toBeGreaterThan(300);
  });
  it('shows a dated tooltip on focus', () => {
    render(<ContributionHeatmap data={year} range="weekly" />);
    const cell = screen.getAllByLabelText(/: \d+ contributions?$/)[0]!;
    fireEvent.focus(cell);
    expect(screen.getByRole('tooltip')).toHaveTextContent('2026');
  });
});
