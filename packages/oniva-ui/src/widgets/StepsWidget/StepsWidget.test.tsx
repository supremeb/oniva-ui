import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { StepsWidget, type StepsWeek } from './StepsWidget';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const mk = (label: string, base: number): StepsWeek => ({
  label,
  data: days.map((day, i) => ({ day, steps: base + i * 100 })),
});
const weeks = [mk('22 Jun – 28 Jun', 1000), mk('29 Jun – 5 Jul', 2000)];

describe('StepsWidget', () => {
  it('totals the selected week and navigates', async () => {
    const user = userEvent.setup();
    render(<StepsWidget weeks={weeks} />);
    expect(screen.getByText('29 Jun – 5 Jul')).toBeInTheDocument();
    expect(screen.getByText('16,100')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next week' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Previous week' }));
    expect(screen.getByText('22 Jun – 28 Jun')).toBeInTheDocument();
    expect(screen.getByText('9,100')).toBeInTheDocument();
  });

  it('forwards ref and className', () => {
    let el: HTMLElement | null = null;
    render(
      <StepsWidget
        weeks={weeks}
        className="extra"
        ref={(n) => {
          el = n;
        }}
      />,
    );
    expect(el).toBeInstanceOf(HTMLElement);
    expect((el as unknown as HTMLElement).className).toContain('extra');
  });
});
