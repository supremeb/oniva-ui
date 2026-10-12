import { CalendarDate } from '@internationalized/date';
import type { DemoModule } from '../../internal/demo';
import { DateRangePicker } from './DateRangePicker';

const col = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: '100%',
  maxWidth: 360,
} as const;

const demo: DemoModule = {
  meta: {
    title: 'Date range picker',
    slug: 'date-range-picker',
    category: 'Forms',
    description: 'Start and end date fields with a two-month range calendar popover.',
  },
  demos: [
    {
      name: 'Reporting period',
      code: `<DateRangePicker label="Reporting period"
  defaultValue={{ start: new CalendarDate(2026, 10, 1), end: new CalendarDate(2026, 10, 31) }} />`,
      Component: () => (
        <div style={col}>
          <DateRangePicker
            label="Reporting period"
            defaultValue={{
              start: new CalendarDate(2026, 10, 1),
              end: new CalendarDate(2026, 10, 31),
            }}
          />
        </div>
      ),
    },
    {
      name: 'Empty with error',
      code: `<DateRangePicker label="Statement range" isInvalid errorMessage="Choose a range up to 90 days." />`,
      Component: () => (
        <div style={col}>
          <DateRangePicker
            label="Statement range"
            isInvalid
            errorMessage="Choose a range up to 90 days."
          />
        </div>
      ),
    },
  ],
};

export default demo;
