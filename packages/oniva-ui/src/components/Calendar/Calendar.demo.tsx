import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date';
import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Calendar } from './Calendar';

function Controlled() {
  const [d, setD] = useState(new CalendarDate(2026, 11, 20));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Calendar aria-label="Delivery date" value={d} onChange={setD} />
      <span style={{ fontSize: 13 }}>Selected: {d.toString()}</span>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Calendar',
    slug: 'calendar',
    category: 'Forms',
    description:
      'Month grid with keyboard navigation, min/max, unavailable dates and accent-gradient selection.',
  },
  demos: [
    {
      name: 'Basic',
      code: `<Calendar aria-label="Appointment date" />`,
      Component: () => <Calendar aria-label="Appointment date" />,
    },
    {
      name: 'Controlled',
      code: `const [d, setD] = useState(new CalendarDate(2026, 11, 20));
<Calendar aria-label="Delivery date" value={d} onChange={setD} />`,
      Component: Controlled,
    },
    {
      name: 'Min date and unavailable days',
      code: `<Calendar aria-label="Payout date" minValue={today(getLocalTimeZone())}
  isDateUnavailable={(d) => d.day === 1} />`,
      Component: () => (
        <Calendar
          aria-label="Payout date"
          minValue={today(getLocalTimeZone())}
          isDateUnavailable={(d) => d.day === 1}
        />
      ),
    },
  ],
};

export default demo;
