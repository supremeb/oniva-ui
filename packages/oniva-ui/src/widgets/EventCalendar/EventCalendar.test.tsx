import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EventCalendar, type CalendarEvent } from './EventCalendar';

const events: CalendarEvent[] = [
  { id: '1', title: 'Sprint review', date: '2026-10-14', time: '10:00', tone: 'info' },
  { id: '2', title: 'Design crit', date: '2026-10-14' },
  { id: '3', title: 'Board prep', date: '2026-10-14', tone: 'warning' },
  { id: '4', title: 'Launch', date: '2026-11-03', tone: 'success' },
];

describe('EventCalendar', () => {
  it('renders month grid with events and overflow', () => {
    render(<EventCalendar events={events} today="2026-10-12" />);
    expect(screen.getByRole('table', { name: 'October 2026' })).toBeInTheDocument();
    expect(screen.getByText('10:00 Sprint review')).toBeInTheDocument();
    expect(screen.getByText('+1 more')).toBeInTheDocument();
    expect(screen.queryByText('Launch')).toBeNull();
  });

  it('navigates months, presses events and forwards ref', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    let el: HTMLElement | null = null;
    render(
      <EventCalendar
        events={events}
        today="2026-10-12"
        onEventPress={onPress}
        className="extra"
        ref={(n) => {
          el = n;
        }}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Sprint review, 2026-10-14 at 10:00' }));
    expect(onPress).toHaveBeenCalledWith(events[0]);
    await user.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByRole('table', { name: 'November 2026' })).toBeInTheDocument();
    expect(screen.getByText('Launch')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Today' }));
    expect(screen.getByRole('table', { name: 'October 2026' })).toBeInTheDocument();
    expect(el).toBeInstanceOf(HTMLElement);
  });
});
