import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MeetingSchedule, type Meeting } from './MeetingSchedule';

const meetings: Meeting[] = [
  { id: 'm1', title: 'Design sync', date: '2026-10-12', start: '10:00', end: '11:00', attendees: ['Ana Lind', 'Kofi Mensah'] },
  { id: 'm2', title: 'Vendor call', date: '2026-10-14', start: '14:00', end: '15:00' },
];

describe('MeetingSchedule', () => {
  it('shows meetings and open slots for the day', () => {
    render(<MeetingSchedule meetings={meetings} defaultDate="2026-10-12" />);
    expect(screen.getByText('Mon, 12 Oct')).toBeInTheDocument();
    expect(screen.getByText('Design sync')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^Book / })).toHaveLength(7);
  });

  it('books a slot, switches to week view and navigates', async () => {
    const user = userEvent.setup();
    const onBook = vi.fn();
    let el: HTMLElement | null = null;
    render(
      <MeetingSchedule
        meetings={meetings}
        defaultDate="2026-10-12"
        onBook={onBook}
        className="extra"
        ref={(n) => {
          el = n;
        }}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Book 9:00 AM' }));
    expect(onBook).toHaveBeenCalledWith({ date: '2026-10-12', start: '09:00', end: '10:00' });
    expect(screen.getByText('Booked meeting')).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'Week' }));
    expect(screen.getByText('12 Oct – 16 Oct')).toBeInTheDocument();
    expect(screen.getByText(/Vendor call/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next week' }));
    expect(screen.getByText('19 Oct – 23 Oct')).toBeInTheDocument();
    expect(el).toBeInstanceOf(HTMLElement);
  });
});
