import { CalendarDate } from '@internationalized/date';
import { DatePicker } from 'oniva-ui';
import type { DocPage } from '../types';

type P = {
  label?: string;
  description?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  isInvalid?: boolean;
  isDisabled?: boolean;
  empty?: boolean;
  min?: boolean;
  onChange?: (v: string) => void;
};

const Basic = (p: P) => (
  <div style={{ width: 300 }}>
    <DatePicker
      label={p.label ?? 'Due date'}
      description={p.description}
      errorMessage={p.error}
      size={p.size}
      isInvalid={p.isInvalid}
      isDisabled={p.isDisabled}
      minValue={p.min ? new CalendarDate(2026, 10, 15) : undefined}
      defaultValue={p.empty ? undefined : new CalendarDate(2026, 10, 30)}
      onChange={(v) => p.onChange?.(v ? v.toString() : 'null')}
    />
  </div>
);

const page: DocPage = {
  slug: 'date-picker',
  status: 'Stable',
  version: '0.1.0',
  importName: 'DatePicker',
  group: ['Components', 'Forms'],
  sourcePath: 'components/DatePicker',
  lede: 'A date field with a calendar popover. It handles two ways of entering a date: type it with the keyboard, or pick it from the month grid.',
  anatomy: {
    intro: 'Five parts. The label, segmented field and calendar button are always present. The popover opens on demand and description and error are optional.',
    Render: () => <Basic description="Net 30 terms." />,
    parts: [
      { name: 'Label', description: '14px medium. Names the date, such as Due date.', selector: 'div:has(> [role="group"]) > span:first-child' },
      { name: 'Segmented field', description: 'Month, day and year are separate editable segments. 38px at md (32 sm, 44 lg), 10px radius, 14px text.', selector: '[role="group"]' },
      { name: 'Segment', description: 'One editable part. Focus highlights it with the accent. Placeholders show mm, dd, yyyy.', selector: '[role="spinbutton"][data-type="month"]' },
      { name: 'Calendar button', description: 'Icon button at the field end. Opens the calendar popover. 24px hit target inside the field.', selector: 'button' },
      { name: 'Description', description: '13px muted. Put the rule here: "Net 30 terms."', selector: '[slot="description"]', fallback: { x: 40, y: 90 } },
    ],
  },
  usage: {
    use: ['One date: due date, birthday, ship by.', 'Dates where a calendar helps, like near-future scheduling.', 'Fields with min and max constraints.', 'Both typing and picking in the same control.'],
    avoid: [
      { text: 'A start and end together.', instead: { slug: 'date-range-picker', label: 'DateRangePicker' } },
      { text: 'Known dates the user can type quickly with no popover.', instead: { slug: 'date-field', label: 'DateField' } },
      { text: 'Showing a calendar inline.', instead: { slug: 'calendar', label: 'Calendar' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'text', key: 'label', label: 'Label', presets: ['Due date', 'Ship by', 'Invoice date'] },
      { kind: 'segmented', key: 'size', label: 'Size', options: ['sm', 'md', 'lg'] },
      { kind: 'toggle', key: 'empty', label: 'Empty' },
      { kind: 'toggle', key: 'min', label: 'Min Oct 15' },
      { kind: 'toggle', key: 'isInvalid', label: 'Invalid' },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { label: 'Due date', size: 'md', empty: false, min: false, isInvalid: false, isDisabled: false },
    render: (p, onEvent) => (
      <Basic
        key={`${p.empty}`}
        label={String(p.label)}
        size={p.size as 'sm' | 'md' | 'lg'}
        empty={Boolean(p.empty)}
        min={Boolean(p.min)}
        isInvalid={Boolean(p.isInvalid)}
        isDisabled={Boolean(p.isDisabled)}
        error="Due date is before the invoice date."
        onChange={(v) => onEvent(`onChange(${v})`)}
      />
    ),
    code: (p) => `<DatePicker label="${p.label}"${p.size !== 'md' ? ` size="${p.size}"` : ''}${p.empty ? '' : ' defaultValue={new CalendarDate(2026, 10, 30)}'}${p.min ? ' minValue={new CalendarDate(2026, 10, 15)}' : ''}${p.isInvalid ? ' isInvalid errorMessage="Due date is before the invoice date."' : ''}${p.isDisabled ? ' isDisabled' : ''} onChange={setDue} />`,
  },
  states: [
    { name: 'Filled', description: 'Value shown as segments.', Render: () => <Basic /> },
    { name: 'Empty', description: 'Placeholder segments: mm / dd / yyyy.', Render: () => <Basic empty /> },
    { name: 'Invalid', description: 'Red border and a message about the rule.', Render: () => <Basic isInvalid error="Due date is before the invoice date." /> },
    { name: 'Before minimum', description: 'A date earlier than minValue is invalid and blocks submit.', Render: () => <Basic min description="Earliest date is Oct 15." /> },
    { name: 'Disabled', description: 'Muted, button and segments not focusable.', Render: () => <Basic isDisabled /> },
  ],
  sections: [
    {
      type: 'numbered',
      id: 'validation',
      title: 'Validation',
      intro: 'Five rules for dates.',
      items: [
        { title: 'Set bounds in the data', body: 'minValue, maxValue and isDateUnavailable gray out invalid days in the calendar so the user cannot pick them.' },
        { title: 'Still validate typed dates', body: 'Typed values can break bounds. The field turns invalid and shows the message.' },
        { title: 'State the rule beforehand', body: 'Use a description: "Earliest date is Oct 15." Do not wait for an error.' },
        { title: 'Say which date is wrong and why', body: '"Due date is before the invoice date", not "Invalid date".' },
        { title: 'Be explicit about the time zone', body: 'CalendarDate has no time zone. Convert at the edge when the server needs a timestamp.' },
      ],
    },
    {
      type: 'rules',
      id: 'formats',
      title: 'Formats',
      items: [
        { title: 'Locale decides order', body: 'Segment order follows the browser locale (mm/dd/yyyy in en-US). Do not hard-code it.' },
        { title: 'Value is a CalendarDate', body: 'Use @internationalized/date. Store ISO (2026-10-30) on the server.' },
        { title: 'Granularity', body: 'Day by default. Pass granularity="minute" with a ZonedDateTime for time.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Label', body: 'The date role: Due date, Ship by. Not "Date".' },
      { title: 'Description', body: 'The rule, in plain words: "Net 30 terms."' },
      { title: 'Error', body: 'Name the comparison: "Due date is before the invoice date."' },
      { title: 'Format examples', body: 'Show a date in the description only when the locale could confuse: "Oct 30, 2026".' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['←', '→'], action: 'Moves between month, day and year segments.' },
      { keys: ['↑', '↓'], action: 'Increments or decrements the focused segment.' },
      { keys: ['0–9'], action: 'Types into the focused segment and advances when complete.' },
      { keys: ['Backspace'], action: 'Clears the focused segment.' },
      { keys: ['Enter', 'Space'], action: 'On the calendar button, opens the popover.' },
      { keys: ['Esc'], action: 'Closes the popover and returns focus to the button.' },
      { keys: ['Arrows', 'PageUp', 'PageDown'], action: 'In the grid, move by day, week and month. Home and End jump to the start and end of the week.' },
    ],
    notes: [
      'Built on React Aria DatePicker. The field is role="group" and each segment is a spinbutton.',
      'Screen readers announce the segment name and value, such as "month, 10".',
      'The calendar is a dialog with a labelled grid. Focus moves into it on open.',
      'Unavailable days are exposed as aria-disabled.',
      'The calendar button has an accessible name and a 24px target; segments are keyboard-first.',
    ],
    reducedMotion: 'The popover fades without scale and month changes are instant.',
  },
  props: [
    { name: 'label', type: 'ReactNode', description: 'Visible label.' },
    { name: 'description', type: 'ReactNode', description: 'Help text.' },
    { name: 'errorMessage', type: 'string | (v) => string', description: 'Shown when invalid.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Field height.' },
    { name: 'value / defaultValue', type: 'DateValue | null', description: 'Controlled or initial date.' },
    { name: 'onChange', type: '(value: DateValue | null) => void', description: 'Fires when the date changes.' },
    { name: 'minValue / maxValue', type: 'DateValue', description: 'Allowed range.' },
    { name: 'isDateUnavailable', type: '(date: DateValue) => boolean', description: 'Block specific dates, like weekends.' },
    { name: 'granularity', type: "'day' | 'hour' | 'minute' | 'second'", default: "'day'", description: 'Smallest unit shown.' },
    { name: 'isDisabled / isReadOnly / isRequired / isInvalid', type: 'boolean', default: 'false', description: 'States.' },
  ],
  related: ['date-field', 'date-range-picker', 'calendar', 'date-range-presets'],
};
export default page;
