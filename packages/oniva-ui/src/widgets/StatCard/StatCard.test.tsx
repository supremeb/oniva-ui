import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatCard } from './StatCard';

describe('StatCard', () => {
  it('renders label, value, delta and trend', () => {
    render(
      <StatCard
        label="Monthly revenue"
        value="$48,210"
        delta={8.2}
        deltaLabel="vs last month"
        trend={[3, 5, 4, 7, 9]}
      />,
    );
    expect(screen.getByText('Monthly revenue')).toBeInTheDocument();
    expect(screen.getByText('$48,210')).toBeInTheDocument();
    expect(screen.getByText('+8.2%')).toBeInTheDocument();
    expect(screen.getByText('vs last month')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Monthly revenue trend' })).toBeInTheDocument();
  });

  it('forwards ref and className, omits optional parts', () => {
    let el: HTMLElement | null = null;
    render(
      <StatCard
        label="Churn"
        value="2.1%"
        className="extra"
        ref={(n) => {
          el = n;
        }}
      />,
    );
    expect(el).toBeInstanceOf(HTMLElement);
    expect((el as unknown as HTMLElement).className).toContain('extra');
    expect(screen.queryByText(/%$/)).toBeInTheDocument();
    expect(screen.queryByRole('img')).toBeNull();
  });
});
