import { CalendarDate } from '@internationalized/date';
import { Calendar } from 'oniva-ui';
import type { DocPage } from '../types';

type P = { min?: boolean; blockFirst?: boolean; isDisabled?: boolean; bordered?: boolean; onChange?: (v: string) => void };

const Basic = (p: P) => (
  <Calendar
    aria-label="Appointment date"
    defaultValue={new CalendarDate(2026, 10, 12)}
    minValue={p.min ? new CalendarDate(2026, 10, 8) : undefined}
    isDateUnavailable={p.blockFirst ? (d) => d.day === 1 : undefined}
    isDisabled={p.isDisabled}
    bordered={p.bordered}
    onChange={(v) => p.onChange?.(v.toString())}
  />
);

const page: DocPage = {
  slug: 'calendar',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Calendar',
  group: ['Components', 'Forms'],
  sourcePath: 'components/Calendar',
  lede: 'A month grid for picking one day. It handles browsing months, jumping by keyboard, and blocking days that are not available.',
  anatomy: {
    intro: 'Five parts. The header, weekday row and grid are always present. The selected and today markers depend on the value.',
    Render: () => <Basic />,
    parts: [
      { name: 'Header', description: 'Month and year title, with previous and next buttons.', selector: 'header' },
      { name: 'Navigation buttons', description: 'Icon buttons that change the visible month. Disabled at minValue and maxValue.', selector: 'button[slot="previous"]' },
      { name: 'Weekday row', description: 'Short weekday names, muted, locale first-day aware.', selector: 'thead' },
      { name: 'Day cell', description: 'Rounded square button. Hover tints; focus shows the ring.', selector: '[role="button"][aria-label^="Thursday, October 1,"]' },
      { name: 'Selected day', description: 'Accent fill with contrasting text. Exactly one at a time.', selector: '[role="gridcell"][aria-selected="true"] [role="button"]', fallback: { x: 50, y: 50 } },
    ],
  },
  usage: {
    use: ['Choosing one day when seeing the month helps.', 'Inline scheduling panels and side drawers.', 'Blocking holidays and past days visually.', 'Embedding in a custom popover.'],
    avoid: [
      { text: 'A date field with a popover.', instead: { slug: 'date-picker', label: 'DatePicker' } },
      { text: 'Picking a start and end.', instead: { slug: 'range-calendar', label: 'RangeCalendar' } },
      { text: 'Typing a known date.', instead: { slug: 'date-field', label: 'DateField' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'toggle', key: 'min', label: 'Min Oct 8' },
      { kind: 'toggle', key: 'blockFirst', label: 'Block the 1st' },
      { kind: 'toggle', key: 'bordered', label: 'Card border' },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { min: false, blockFirst: false, bordered: true, isDisabled: false },
    render: (p, onEvent) => (
      <Basic min={Boolean(p.min)} blockFirst={Boolean(p.blockFirst)} bordered={Boolean(p.bordered)} isDisabled={Boolean(p.isDisabled)} onChange={(v) => onEvent(`onChange(${v})`)} />
    ),
    code: (p) => `<Calendar aria-label="Appointment date"${p.min ? ' minValue={new CalendarDate(2026, 10, 8)}' : ''}${p.blockFirst ? ' isDateUnavailable={(d) => d.day === 1}' : ''}${p.bordered ? '' : ' bordered={false}'}${p.isDisabled ? ' isDisabled' : ''} onChange={setDate} />`,
  },
  states: [
    { name: 'Selected', description: 'One day selected.', Render: () => <Basic /> },
    { name: 'Minimum date', description: 'Days before Oct 8 are dimmed and not selectable.', Render: () => <Basic min /> },
    { name: 'Unavailable days', description: 'The 1st of each month is blocked.', Render: () => <Basic blockFirst /> },
    { name: 'No border', description: 'bordered={false} for use inside a popover or card.', Render: () => <Basic bordered={false} /> },
    { name: 'Disabled', description: 'Whole grid muted.', Render: () => <Basic isDisabled /> },
  ],
  sections: [
    {
      type: 'numbered',
      id: 'validation',
      title: 'Validation',
      intro: 'A calendar prevents errors instead of reporting them.',
      items: [
        { title: 'Block, do not warn', body: 'minValue, maxValue and isDateUnavailable remove invalid days from the choice.' },
        { title: 'Explain blocked days', body: 'Add text outside the grid: "Weekends are unavailable."' },
        { title: 'Keep a valid default', body: 'If today is blocked, start on the next available day so the first view is useful.' },
        { title: 'Time zones', body: 'CalendarDate has no zone. Convert on submit with the user\'s or the venue\'s zone, not the browser\'s by accident.' },
      ],
    },
    {
      type: 'rules',
      id: 'recipes',
      title: 'Composition',
      items: [
        { title: 'Inside DatePicker', body: 'DatePicker uses Calendar in a popover with bordered off.' },
        { title: 'With time slots', body: 'Put a list of times beside the calendar. Update the list on onChange.' },
        { title: 'Width', body: 'The grid has a fixed natural width; do not stretch it.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Accessible name', body: 'Always pass aria-label that says what the date is: "Appointment date".' },
      { title: 'Blocked reasons', body: 'State once, near the grid.' },
      { title: 'Today', body: 'Today is outlined, not filled, so it never reads as selected.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['←', '→'], action: 'Previous or next day.' },
      { keys: ['↑', '↓'], action: 'Previous or next week.' },
      { keys: ['PageUp', 'PageDown'], action: 'Previous or next month.' },
      { keys: ['Shift+PageUp', 'Shift+PageDown'], action: 'Previous or next year.' },
      { keys: ['Home', 'End'], action: 'Start or end of the week.' },
      { keys: ['Enter', 'Space'], action: 'Selects the focused day.' },
    ],
    notes: [
      'Built on React Aria Calendar: role="application" containing a labelled grid.',
      'Screen readers announce the full date, "selected" and "unavailable" when relevant.',
      'The visible month heading is a live region so month changes are announced.',
      'Unavailable days are aria-disabled but stay in the grid for orientation.',
      'Day cells are about 36px; spacing between them keeps pointer targets distinct.',
    ],
    reducedMotion: 'Month changes happen without slide animations.',
  },
  props: [
    { name: 'aria-label', type: 'string', description: 'Required accessible name.' },
    { name: 'value / defaultValue', type: 'DateValue | null', description: 'Controlled or initial day.' },
    { name: 'onChange', type: '(value: DateValue) => void', description: 'Fires when a day is picked.' },
    { name: 'minValue / maxValue', type: 'DateValue', description: 'Allowed range.' },
    { name: 'isDateUnavailable', type: '(date: DateValue) => boolean', description: 'Block specific days.' },
    { name: 'focusedValue / defaultFocusedValue', type: 'DateValue', description: 'Visible month and focus.' },
    { name: 'bordered', type: 'boolean', default: 'true', description: 'Draw the surface card.' },
    { name: 'isDisabled / isReadOnly', type: 'boolean', default: 'false', description: 'States.' },
    { name: 'visibleDuration', type: '{ months: number }', default: '{ months: 1 }', description: 'Months shown.' },
  ],
  related: ['date-picker', 'range-calendar', 'date-field', 'date-range-presets'],
};
export default page;
