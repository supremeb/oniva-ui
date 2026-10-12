import { CalendarDate } from '@internationalized/date';
import type { DemoModule } from '../../internal/demo';
import { DateField } from './DateField';

const col = { display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 280 } as const;

const demo: DemoModule = {
  meta: {
    title: 'DateField',
    slug: 'date-field',
    category: 'Forms',
    description: 'Segmented, keyboard-first date entry with locale-aware formatting.',
  },
  demos: [
    {
      name: 'Basic',
      code: `<DateField label="Invoice date" description="Shown on the PDF." defaultValue={new CalendarDate(2026, 10, 12)} />`,
      Component: () => (
        <div style={col}>
          <DateField
            label="Invoice date"
            description="Shown on the PDF."
            defaultValue={new CalendarDate(2026, 10, 12)}
          />
        </div>
      ),
    },
    {
      name: 'Empty, with granularity, error',
      code: `<DateField label="Start" /> <DateField label="Due" isInvalid errorMessage="Due date is before the invoice date." />`,
      Component: () => (
        <div style={col}>
          <DateField label="Start" />
          <DateField
            label="Due"
            defaultValue={new CalendarDate(2026, 9, 30)}
            isInvalid
            errorMessage="Due date is before the invoice date."
          />
        </div>
      ),
    },
  ],
};

export default demo;
