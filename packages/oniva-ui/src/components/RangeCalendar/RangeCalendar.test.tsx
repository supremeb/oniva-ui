import { CalendarDate } from '@internationalized/date';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RangeCalendar } from './RangeCalendar';

describe('RangeCalendar', () => {
  it('selects a start and end date', async () => {
    const onChange = vi.fn();
    render(
      <RangeCalendar
        aria-label="Reporting period"
        defaultFocusedValue={new CalendarDate(2026, 10, 12)}
        onChange={onChange}
      />,
    );
    expect(screen.getByRole('application', { name: /Reporting period/ })).toBeInTheDocument();
    await userEvent.click(screen.getAllByText('5')[0]!);
    await userEvent.click(screen.getAllByText('9')[0]!);
    expect(onChange).toHaveBeenCalled();
    const r = onChange.mock.calls.at(-1)![0] as { start: CalendarDate; end: CalendarDate };
    expect(r.start.day).toBe(5);
    expect(r.end.day).toBe(9);
  });

  it('renders a preselected range', () => {
    render(
      <RangeCalendar
        aria-label="Q4"
        defaultValue={{ start: new CalendarDate(2026, 10, 1), end: new CalendarDate(2026, 10, 7) }}
      />,
    );
    expect(screen.getAllByRole('button', { name: /selected/i }).length).toBeGreaterThanOrEqual(1);
  });
});
