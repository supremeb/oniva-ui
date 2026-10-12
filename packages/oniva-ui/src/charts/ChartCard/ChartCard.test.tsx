import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChartCard, ChartPeriodSwitcher, ChartRangeToggle } from './ChartCard';

describe('ChartCard', () => {
  it('renders title, value, unit, delta and legend', () => {
    render(
      <ChartCard
        title="Revenue"
        value="$88,400"
        unit="Dec"
        delta={{ label: '10%', trend: 'up' }}
        legend={<span>Legend</span>}
      >
        <div>plot</div>
      </ChartCard>,
    );
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$88,400')).toBeInTheDocument();
    expect(screen.getByText('10%')).toBeInTheDocument();
    expect(screen.getByText('plot')).toBeInTheDocument();
  });
  it('period switcher fires callbacks and respects disabled', () => {
    let prev = 0;
    let next = 0;
    render(
      <ChartPeriodSwitcher
        label="29 Jun – 5 Jul"
        onPrevious={() => prev++}
        onNext={() => next++}
        nextDisabled
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Previous period' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next period' }));
    expect(prev).toBe(1);
    expect(next).toBe(0);
  });
  it('range toggle reports the selected id', () => {
    const picked: string[] = [];
    render(
      <ChartRangeToggle
        value="a"
        onChange={(v) => picked.push(v)}
        options={[
          { id: 'a', label: 'Weekly' },
          { id: 'b', label: 'Monthly' },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole('radio', { name: 'Monthly' }));
    expect(picked).toEqual(['b']);
  });
});
