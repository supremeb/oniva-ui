import type { DemoModule } from '../../internal/demo';
import { MeetingSchedule, type Meeting } from './MeetingSchedule';

const meetings: Meeting[] = [
  {
    id: 'm1',
    title: 'Design sync',
    date: '2026-10-12',
    start: '10:00',
    end: '11:00',
    attendees: ['Ana Lindqvist', 'Kofi Mensah', 'Priya Nair'],
  },
  {
    id: 'm2',
    title: 'Pipeline review',
    date: '2026-10-12',
    start: '13:00',
    end: '14:00',
    attendees: ['Tomás Reyes', 'Mira Okonkwo'],
  },
  { id: 'm3', title: 'Vendor call', date: '2026-10-14', start: '14:00', end: '15:00' },
  {
    id: 'm4',
    title: 'Hiring panel',
    date: '2026-10-15',
    start: '11:00',
    end: '12:00',
    attendees: ['Ana Lindqvist'],
  },
  {
    id: 'm5',
    title: 'Sprint demo',
    date: '2026-10-16',
    start: '16:00',
    end: '17:00',
    attendees: ['Kofi Mensah', 'Priya Nair'],
  },
];

const demo: DemoModule = {
  meta: {
    title: 'Meeting schedule',
    slug: 'meeting-schedule',
    category: 'Widgets',
    description:
      'Day/week agenda with hourly slots, attendee avatars and one-click booking of open slots.',
  },
  demos: [
    {
      name: 'Day view with booking',
      code: `<MeetingSchedule meetings={meetings} defaultDate="2026-10-12" onBook={(s) => console.log(s)} />`,
      Component: () => (
        <div style={{ maxWidth: 520 }}>
          <MeetingSchedule meetings={meetings} defaultDate="2026-10-12" />
        </div>
      ),
    },
    {
      name: 'Week view',
      code: `<MeetingSchedule meetings={meetings} defaultDate="2026-10-12" defaultView="week" />`,
      Component: () => (
        <div style={{ maxWidth: 640 }}>
          <MeetingSchedule meetings={meetings} defaultDate="2026-10-12" defaultView="week" />
        </div>
      ),
    },
  ],
};

export default demo;
