import type { DemoModule } from '../../internal/demo';
import { EventCalendar, type CalendarEvent } from './EventCalendar';

const events: CalendarEvent[] = [
  { id: 'e1', title: 'Sprint review', date: '2026-10-14', time: '10:00', tone: 'info' },
  { id: 'e2', title: 'Design crit', date: '2026-10-14', time: '14:00', tone: 'accent' },
  { id: 'e3', title: 'Board prep', date: '2026-10-14', tone: 'warning' },
  { id: 'e4', title: 'Payroll run', date: '2026-10-15', tone: 'success' },
  { id: 'e5', title: 'Security audit', date: '2026-10-19', time: '9:30', tone: 'danger' },
  { id: 'e6', title: 'Customer call: Northwind', date: '2026-10-21', time: '11:00', tone: 'info' },
  { id: 'e7', title: 'Release 4.2', date: '2026-10-28', tone: 'success' },
  { id: 'e8', title: 'All hands', date: '2026-10-30', time: '16:00', tone: 'accent' },
];

const demo: DemoModule = {
  meta: {
    title: 'EventCalendar',
    slug: 'event-calendar',
    category: 'Widgets',
    description: 'Month grid with colour-coded event pills, overflow count and a month switcher.',
  },
  demos: [
    {
      name: 'Team month view',
      code: `<EventCalendar events={events} today="2026-10-12" onEventPress={(e) => alert(e.title)} />`,
      Component: () => <EventCalendar events={events} today="2026-10-12" />,
    },
    {
      name: 'Single pill per day',
      code: `<EventCalendar events={events} today="2026-10-12" maxPerDay={1} />`,
      Component: () => <EventCalendar events={events} today="2026-10-12" maxPerDay={1} />,
    },
  ],
};

export default demo;
