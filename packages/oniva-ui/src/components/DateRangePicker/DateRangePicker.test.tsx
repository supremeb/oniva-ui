import { CalendarDate } from '@internationalized/date';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DateRangePicker } from './DateRangePicker';

describe('DateRangePicker', () => {
  it('renders start and end segments and opens the calendar', async () => {
    render(
      <DateRangePicker
        label="Reporting period"
        defaultValue={{ start: new CalendarDate(2026, 10, 1), end: new CalendarDate(2026, 10, 31) }}
      />,
    );
    expect(screen.getAllByRole('spinbutton')).toHaveLength(6);
    await userEvent.click(screen.getByRole('button', { name: /calendar/i }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('selects a range from the calendar', async () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        label="Period"
        defaultValue={{ start: new CalendarDate(2026, 10, 1), end: new CalendarDate(2026, 10, 2) }}
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /calendar/i }));
    const dialog = await screen.findByRole('dialog');
    await userEvent.click(within(dialog).getAllByText('10')[0]!);
    await userEvent.click(within(dialog).getAllByText('14')[0]!);
    expect(onChange).toHaveBeenCalled();
  });

  it('shows error and disabled', () => {
    render(<DateRangePicker label="Period" isInvalid errorMessage="Range too long" isDisabled />);
    expect(screen.getByText('Range too long')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /calendar/i })).toBeDisabled();
  });
});
