import { CalendarDate } from '@internationalized/date';
import type { DemoModule } from '../../internal/demo';
import { RangeCalendar } from './RangeCalendar';

const demo: DemoModule = {
  meta: {
    title: 'Range calendar',
    slug: 'range-calendar',
    category: 'Forms',
    description: 'Select a start and end date with a continuous tinted range band.',
  },
  demos: [
    {
      name: 'Preselected range',
      code: `<RangeCalendar aria-label="Reporting period"
  defaultValue={{ start: new CalendarDate(2026, 10, 5), end: new CalendarDate(2026, 10, 16) }} />`,
      Component: () => (
        <RangeCalendar
          aria-label="Reporting period"
          defaultValue={{
            start: new CalendarDate(2026, 10, 5),
            end: new CalendarDate(2026, 10, 16),
          }}
        />
      ),
    },
    {
      name: 'Two months',
      code: `<RangeCalendar aria-label="Fiscal quarter" visibleDuration={{ months: 2 }} />`,
      Component: () => (
        <RangeCalendar aria-label="Fiscal quarter" visibleDuration={{ months: 2 }} />
      ),
    },
  ],
};

export default demo;
