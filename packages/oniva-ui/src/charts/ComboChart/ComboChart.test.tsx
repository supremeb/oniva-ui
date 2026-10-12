import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ComboChart } from './ComboChart';

const data = [
  { m: 'Jan', rev: 100, margin: 20 },
  { m: 'Feb', rev: 140, margin: 30 },
];

describe('ComboChart', () => {
  it('draws bars and a line with a dual-axis tooltip', () => {
    const { container } = render(
      <ComboChart
        data={data}
        index="m"
        bars={[{ key: 'rev', label: 'Revenue' }]}
        lines={[{ key: 'margin', label: 'Margin' }]}
      />,
    );
    expect(container.querySelectorAll('circle')).toHaveLength(2);
    fireEvent.focus(screen.getByLabelText(/^Feb:/));
    expect(screen.getByRole('tooltip')).toHaveTextContent('Margin');
  });
  it('hides the right axis when dualAxis is false', () => {
    const { container } = render(
      <ComboChart
        dualAxis={false}
        data={data}
        index="m"
        bars={[{ key: 'rev' }]}
        lines={[{ key: 'margin' }]}
      />,
    );
    expect(
      [...container.querySelectorAll('svg text')].map((t) => t.textContent).join(' '),
    ).not.toContain('%');
  });
});
