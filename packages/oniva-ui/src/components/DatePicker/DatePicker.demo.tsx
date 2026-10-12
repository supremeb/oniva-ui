import { CalendarDate } from '@internationalized/date';
import type { DemoModule } from '../../internal/demo';
import { DatePicker } from './DatePicker';

const col = { display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 300 } as const;

const demo: DemoModule = {
  meta: {
    title: 'DatePicker',
    slug: 'date-picker',
    category: 'Forms',
    description: 'Date field with a calendar popover. Type segments or pick from the grid.',
  },
  demos: [
    {
      name: 'Basic',
      code: `<DatePicker label="Due date" defaultValue={new CalendarDate(2026, 10, 30)} description="Net 30 terms." />`,
      Component: () => (
        <div style={col}>
          <DatePicker
            label="Due date"
            defaultValue={new CalendarDate(2026, 10, 30)}
            description="Net 30 terms."
          />
        </div>
      ),
    },
    {
      name: 'Validation',
      code: `<DatePicker label="Ship by" minValue={new CalendarDate(2026, 10, 15)} defaultValue={new CalendarDate(2026, 10, 1)} />`,
      Component: () => (
        <div style={col}>
          <DatePicker
            label="Ship by"
            minValue={new CalendarDate(2026, 10, 15)}
            defaultValue={new CalendarDate(2026, 10, 1)}
          />
        </div>
      ),
    },
  ],
};

export default demo;
