import { CalendarDate } from '@internationalized/date';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker } from './DatePicker';

describe('DatePicker', () => {
  it('opens a calendar popover and picks a date', async () => {
    const onChange = vi.fn();
    render(
      <DatePicker
        label="Due date"
        defaultValue={new CalendarDate(2026, 10, 12)}
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /calendar/i }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    await userEvent.click(screen.getAllByText('20')[0]!);
    expect(onChange).toHaveBeenCalled();
    const v = onChange.mock.calls.at(-1)![0] as CalendarDate;
    expect(v.day).toBe(20);
  });

  it('shows error and disabled', () => {
    render(<DatePicker label="Due" isInvalid errorMessage="Required" isDisabled />);
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /calendar/i })).toBeDisabled();
  });
});
