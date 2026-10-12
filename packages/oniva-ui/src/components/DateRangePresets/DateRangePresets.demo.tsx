import { CalendarDate } from '@internationalized/date';
import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { DateRangePresets, presetRange, type DateRange } from './DateRangePresets';

const now = new CalendarDate(2026, 10, 12);

function Demo() {
  const [value, setValue] = useState<DateRange | null>(presetRange('last7', now));
  return <DateRangePresets value={value} onChange={setValue} now={now} />;
}

const demo: DemoModule = {
  meta: {
    title: 'Date range presets',
    slug: 'date-range-presets',
    category: 'Forms',
    description: 'Preset ranges (Today, Last 7 days, month/quarter/year to date) beside a date range field and range calendar. Picking dates by hand selects Custom.',
  },
  demos: [
    {
      name: 'Reporting range',
      code: `const [value, setValue] = useState<DateRange | null>(null);

<DateRangePresets value={value} onChange={setValue} />`,
      Component: Demo,
    },
  ],
};
export default demo;
