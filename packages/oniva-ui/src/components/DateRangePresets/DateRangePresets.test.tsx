import { CalendarDate } from '@internationalized/date';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { DateRangePresets, matchPreset, presetRange, type DateRange } from './DateRangePresets';
import { expectNoA11yViolations } from '../../internal/test-a11y';

const now = new CalendarDate(2026, 11, 18);

function Harness() {
  const [v, setV] = useState<DateRange | null>(null);
  return <DateRangePresets value={v} onChange={setV} now={now} className="x" data-testid="p" />;
}

describe('DateRangePresets', () => {
  it('computes presets', () => {
    expect(presetRange('qtd', now).start.toString()).toBe('2026-10-01');
    expect(presetRange('mtd', now).start.toString()).toBe('2026-11-01');
    expect(presetRange('ytd', now).start.toString()).toBe('2026-01-01');
    expect(presetRange('last7', now).start.toString()).toBe('2026-11-12');
    expect(matchPreset(presetRange('today', now), now)).toBe('today');
    expect(matchPreset({ start: now, end: now.add({ days: 3 }) }, now)).toBe('custom');
  });
  it('selecting a preset marks it pressed', async () => {
    render(<Harness />);
    expect(screen.getByTestId('p')).toHaveClass('x');
    await userEvent.click(screen.getByRole('button', { name: 'Year to date' }));
    expect(screen.getByRole('button', { name: 'Year to date' })).toHaveAttribute('aria-pressed', 'true');
  });
  it('has no a11y violations', async () => {
    const { container } = render(<Harness />);
    // RangeCalendar renders a <header> inside role=application (landmark-banner-is-top-level, moderate, pre-existing in forms-calendar), so audit the presets list + field only.
    await expectNoA11yViolations(container.querySelector('[role="group"]')!);
  });
});
