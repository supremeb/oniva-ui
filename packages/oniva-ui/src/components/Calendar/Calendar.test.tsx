import { CalendarDate } from '@internationalized/date';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Calendar } from './Calendar';

describe('Calendar', () => {
  it('renders a labelled grid and selects a date', async () => {
    const onChange = vi.fn();
    render(
      <Calendar
        aria-label="Due date"
        defaultFocusedValue={new CalendarDate(2026, 10, 12)}
        onChange={onChange}
      />,
    );
    expect(screen.getByRole('grid')).toBeInTheDocument();
    await userEvent.click(screen.getAllByText('15')[0]!);
    expect(onChange).toHaveBeenCalled();
    const v = onChange.mock.calls[0]![0] as CalendarDate;
    expect(v.day).toBe(15);
    expect(v.month).toBe(10);
  });

  it('navigates months and disables out-of-range dates', async () => {
    render(
      <Calendar
        aria-label="Pick"
        defaultFocusedValue={new CalendarDate(2026, 10, 12)}
        minValue={new CalendarDate(2026, 10, 10)}
      />,
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/October 2026/);
    await userEvent.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/November 2026/);
  });
});
