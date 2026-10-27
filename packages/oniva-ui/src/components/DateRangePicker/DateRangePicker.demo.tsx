import { CalendarDate } from '@internationalized/date';
import type { DemoModule } from '../../internal/demo';
import { DateRangePicker, defaultDateRangePresets } from './DateRangePicker';

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
      name: 'Presets, two months and footer',
      code: `<DateRangePicker layout="panel" compare aria-label="Date range" today={new CalendarDate(2026, 10, 26)}
  defaultValue={{ start: new CalendarDate(2026, 9, 27), end: new CalendarDate(2026, 10, 26) }} />`,
      Component: () => (
        <DateRangePicker
          layout="panel"
          compare
          aria-label="Date range"
          today={new CalendarDate(2026, 10, 26)}
          defaultValue={{ start: new CalendarDate(2026, 9, 27), end: new CalendarDate(2026, 10, 26) }}
        />
      ),
    },
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
    {
      name: 'With quick ranges',
      code: `<DateRangePicker label="Compare window" presets={defaultDateRangePresets} />`,
      Component: () => (
        <div style={col}>
          <DateRangePicker label="Compare window" presets={defaultDateRangePresets} />
        </div>
      ),
    },
  ],
};

export default demo;
