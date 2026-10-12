import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChartLegend } from './ChartLegend';

describe('ChartLegend', () => {
  it('renders items with values and forwards className/ref', () => {
    let el: HTMLUListElement | null = null;
    render(
      <ChartLegend
        className="x"
        ref={(n) => {
          el = n;
        }}
        items={[{ label: 'Input', value: '1.2M' }, { label: 'Output' }]}
      />,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('1.2M')).toBeInTheDocument();
    expect(el).toHaveClass('x');
  });
});
