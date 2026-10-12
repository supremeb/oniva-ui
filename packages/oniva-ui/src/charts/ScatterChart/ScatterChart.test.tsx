import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { customersScatter } from '../_data/datasets';
import { ScatterChart } from './ScatterChart';

describe('ScatterChart', () => {
  it('renders a point per datum with size and name in the tooltip', () => {
    const { container } = render(
      <ScatterChart
        data={customersScatter}
        xKey="orders"
        yKey="spend"
        sizeKey="seats"
        nameKey="name"
      />,
    );
    expect(container.querySelectorAll('circle[tabindex="-1"]')).toHaveLength(
      customersScatter.length,
    );
    fireEvent.focus(screen.getByLabelText(/^Umbrella:/));
    expect(screen.getByRole('tooltip')).toHaveTextContent('Umbrella');
  });
  it('colours by group', () => {
    const { container } = render(
      <ScatterChart
        data={customersScatter.map((c) => ({ ...c, g: c.seats > 100 ? 'a' : 'b' }))}
        xKey="orders"
        yKey="spend"
        groupKey="g"
      />,
    );
    const classes = new Set(
      [...container.querySelectorAll('circle')].map((c) => c.getAttribute('class')),
    );
    expect(classes.size).toBeGreaterThan(1);
  });
});
