import { CalendarDate } from '@internationalized/date';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DateRangePicker, defaultDateRangePresets } from './DateRangePicker';

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

  it('preset chips set the range and report the change', async () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        label="Period"
        presets={defaultDateRangePresets}
        today={new CalendarDate(2026, 10, 26)}
        defaultValue={{ start: new CalendarDate(2026, 10, 1), end: new CalendarDate(2026, 10, 2) }}
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /calendar/i }));
    const dialog = await screen.findByRole('dialog');
    const chip = within(dialog).getByRole('button', { name: 'Last 7 days' });
    expect(chip).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(chip);
    expect(onChange).toHaveBeenCalled();
    const v = onChange.mock.calls.at(-1)?.[0];
    expect(v.start.toString()).toBe('2026-10-20');
    expect(v.end.toString()).toBe('2026-10-26');
    expect(within(dialog).getByRole('button', { name: 'Last 7 days' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('forwards ref and className', () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(<DateRangePicker label="Period" ref={ref} className="extra" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.querySelector('.extra')).not.toBeNull();
  });
});
