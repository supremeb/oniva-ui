import { CalendarDate } from '@internationalized/date';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DateField } from './DateField';

describe('DateField', () => {
  it('exposes labelled segments and types a date', async () => {
    const onChange = vi.fn();
    render(<DateField label="Invoice date" onChange={onChange} />);
    const month = screen.getByRole('spinbutton', { name: /month/i });
    expect(screen.getAllByRole('spinbutton')).toHaveLength(3);
    await userEvent.click(month);
    await userEvent.keyboard('10122026');
    expect(onChange).toHaveBeenCalled();
    const v = onChange.mock.calls.at(-1)![0] as CalendarDate;
    expect([v.month, v.day, v.year]).toEqual([10, 12, 2026]);
  });

  it('shows error and disabled', () => {
    render(
      <DateField
        label="Due"
        defaultValue={new CalendarDate(2026, 10, 1)}
        isInvalid
        errorMessage="Past due"
        isDisabled
      />,
    );
    expect(screen.getByText('Past due')).toBeInTheDocument();
    expect(screen.getAllByRole('spinbutton')[0]).toHaveAttribute('aria-disabled', 'true');
  });
});
