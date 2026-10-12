import { CalendarDate } from '@internationalized/date';
import { RangeCalendar } from 'oniva-ui';
import type { DocPage } from '../types';

type P = { empty?: boolean; months?: number; bordered?: boolean; isDisabled?: boolean; onChange?: (v: string) => void };

const Basic = (p: P) => (
  <RangeCalendar
    aria-label="Reporting period"
    defaultValue={p.empty ? undefined : { start: new CalendarDate(2026, 10, 5), end: new CalendarDate(2026, 10, 16) }}
    defaultFocusedValue={new CalendarDate(2026, 10, 1)}
    visibleDuration={{ months: p.months ?? 1 }}
    bordered={p.bordered}
    isDisabled={p.isDisabled}
    onChange={(v) => p.onChange?.(`${v.start} to ${v.end}`)}
  />
);

const page: DocPage = {
  slug: 'range-calendar',
  status: 'Stable',
  version: '0.1.0',
  importName: 'RangeCalendar',
  group: ['Components', 'Forms'],
  sourcePath: 'components/RangeCalendar',
  lede: 'A month grid for picking a start and an end day. It handles dragging or clicking two days and showing the span between them.',
  anatomy: {
    intro: 'Five parts. The header, weekday row and grid are always present. Start, end and in-between days style differently.',
    Render: () => <Basic />,
    parts: [
      { name: 'Header', description: 'Month and year title with previous and next buttons.', selector: 'header' },
      { name: 'Navigation buttons', description: 'Change the visible month. Disabled at bounds.', selector: 'button[slot="previous"]' },
      { name: 'Weekday row', description: 'Short weekday names, muted.', selector: 'thead' },
      { name: 'Range band', description: 'Tinted background across the days between start and end, rounded at the ends.', selector: 'tbody tr:nth-child(2) td:nth-child(4)' },
      { name: 'Start and end days', description: 'Accent-filled caps of the range.', selector: 'tbody tr:nth-child(2) td:nth-child(2)' },
    ],
  },
  usage: {
    use: ['Choosing a span of days when the month view helps.', 'Inline reporting filters.', 'Booking windows and leave requests.', 'Two-month views for ranges that cross a boundary.'],
    avoid: [
      { text: 'A date field with a popover.', instead: { slug: 'date-range-picker', label: 'DateRangePicker' } },
      { text: 'Common relative ranges.', instead: { slug: 'date-range-presets', label: 'DateRangePresets' } },
      { text: 'One day.', instead: { slug: 'calendar', label: 'Calendar' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'months', label: 'Months shown', options: ['1', '2'] },
      { kind: 'toggle', key: 'empty', label: 'No range' },
      { kind: 'toggle', key: 'bordered', label: 'Card border' },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { months: '1', empty: false, bordered: true, isDisabled: false },
    render: (p, onEvent) => (
      <Basic key={`${p.empty}-${p.months}`} months={Number(p.months)} empty={Boolean(p.empty)} bordered={Boolean(p.bordered)} isDisabled={Boolean(p.isDisabled)} onChange={(v) => onEvent(`onChange(${v})`)} />
    ),
    code: (p) => `<RangeCalendar aria-label="Reporting period"${Number(p.months) > 1 ? ` visibleDuration={{ months: ${p.months} }}` : ''}${p.bordered ? '' : ' bordered={false}'}${p.isDisabled ? ' isDisabled' : ''} onChange={setRange} />`,
  },
  states: [
    { name: 'Range selected', description: 'Start, band and end.', Render: () => <Basic /> },
    { name: 'No range', description: 'Nothing selected; first click sets the start.', Render: () => <Basic empty /> },
    { name: 'Two months', description: 'Wider view for ranges that cross a month.', Render: () => <Basic months={2} /> },
    { name: 'Disabled', description: 'Muted grid.', Render: () => <Basic isDisabled /> },
  ],
  sections: [
    {
      type: 'numbered',
      id: 'validation',
      title: 'Validation',
      intro: 'Prevent bad ranges in the grid; validate length outside.',
      items: [
        { title: 'Bound the days', body: 'minValue, maxValue and isDateUnavailable dim days that cannot be chosen.' },
        { title: 'Handle unavailable days', body: 'By default a range cannot cross an unavailable day. Set allowsNonContiguousRanges to permit it.' },
        { title: 'Cap the length in onChange', body: 'If a range exceeds 90 days, show "Choose a range up to 90 days." beside the grid and keep the previous value.' },
        { title: 'Explain the rule first', body: 'Put the cap in a description above the grid.' },
      ],
    },
    {
      type: 'rules',
      id: 'recipes',
      title: 'Behavior',
      items: [
        { title: 'Two clicks', body: 'First click sets start; second sets end. A third starts over.' },
        { title: 'Order does not matter', body: 'Clicking an earlier second day swaps start and end.' },
        { title: 'Echo the range', body: 'Show the chosen dates as text next to the grid for confirmation.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Accessible name', body: 'aria-label with the range purpose: "Reporting period".' },
      { title: 'Echo format', body: '"Oct 5 – Oct 16, 2026" with an en dash and the year.' },
      { title: 'Blocked days', body: 'Explain once, near the grid.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['←', '→', '↑', '↓'], action: 'Move by day and week.' },
      { keys: ['PageUp', 'PageDown'], action: 'Previous or next month.' },
      { keys: ['Home', 'End'], action: 'Start or end of the week.' },
      { keys: ['Enter', 'Space'], action: 'Sets the start, then the end.' },
      { keys: ['Esc'], action: 'Cancels a range in progress.' },
    ],
    notes: [
      'Built on React Aria RangeCalendar: role="application" with a labelled grid.',
      'Screen readers announce each date with "selected" and the range extent.',
      'The heading is announced when the month changes.',
      'Range membership is shown by shape and tint plus aria-selected, not color alone.',
    ],
    reducedMotion: 'Month changes are instant.',
  },
  props: [
    { name: 'aria-label', type: 'string', description: 'Required accessible name.' },
    { name: 'value / defaultValue', type: '{ start: DateValue; end: DateValue } | null', description: 'Controlled or initial range.' },
    { name: 'onChange', type: '(value: RangeValue<DateValue>) => void', description: 'Fires when both ends are set.' },
    { name: 'minValue / maxValue', type: 'DateValue', description: 'Allowed range.' },
    { name: 'isDateUnavailable', type: '(date: DateValue) => boolean', description: 'Block specific days.' },
    { name: 'allowsNonContiguousRanges', type: 'boolean', default: 'false', description: 'Allow ranges across unavailable days.' },
    { name: 'visibleDuration', type: '{ months: number }', default: '{ months: 1 }', description: 'Months shown.' },
    { name: 'bordered', type: 'boolean', default: 'true', description: 'Draw the surface card.' },
    { name: 'isDisabled / isReadOnly', type: 'boolean', default: 'false', description: 'States.' },
  ],
  related: ['calendar', 'date-range-picker', 'date-range-presets', 'date-picker'],
};
export default page;
