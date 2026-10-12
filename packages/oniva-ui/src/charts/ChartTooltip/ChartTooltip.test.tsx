import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChartTooltip } from './ChartTooltip';

describe('ChartTooltip', () => {
  it('renders title, rows and children', () => {
    render(
      <ChartTooltip title="Sep" rows={[{ label: 'Revenue', value: '$1', tone: 1 }]}>
        extra
      </ChartTooltip>,
    );
    const t = screen.getByRole('tooltip');
    expect(t).toHaveTextContent('Sep');
    expect(t).toHaveTextContent('Revenue');
    expect(t).toHaveTextContent('extra');
  });
  it('positions absolutely when x/y are given', () => {
    render(<ChartTooltip x={10} y={20} title="t" />);
    expect(screen.getByRole('tooltip')).toHaveStyle({ translate: '10px 20px' });
  });
});
