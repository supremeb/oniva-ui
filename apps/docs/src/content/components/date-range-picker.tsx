import { CalendarDate } from '@internationalized/date';
import { DateRangePicker } from 'oniva-ui';
import type { DocPage } from '../types';

type P = { label?: string; empty?: boolean; isInvalid?: boolean; isDisabled?: boolean; size?: 'sm' | 'md' | 'lg'; description?: string; onChange?: (v: string) => void };

const Basic = (p: P) => (
  <div style={{ width: 340 }}>
    <DateRangePicker
      label={p.label ?? 'Reporting period'}
      size={p.size}
      description={p.description}
      defaultValue={p.empty ? undefined : { start: new CalendarDate(2026, 10, 1), end: new CalendarDate(2026, 10, 31) }}
      isInvalid={p.isInvalid}
      errorMessage={p.isInvalid ? 'Choose a range up to 90 days.' : undefined}
      isDisabled={p.isDisabled}
      onChange={(v) => p.onChange?.(v ? `${v.start} to ${v.end}` : 'null')}
    />
  </div>
);

const page: DocPage = {
  slug: 'date-range-picker',
  status: 'Stable',
  version: '0.1.0',
  importName: 'DateRangePicker',
  group: ['Components', 'Forms'],
  sourcePath: 'components/DateRangePicker',
  lede: 'Two date fields and a range calendar in one control. It handles picking a start and an end together, by typing or by clicking two days.',
  anatomy: {
    intro: 'Six parts. The label, both date fields and the calendar button are always present. The dash joins the fields; description and error are optional.',
    Render: () => <Basic description="Up to 90 days." />,
    parts: [
      { name: 'Label', description: '14px medium.', selector: 'div:has(> [role="group"]) > span:first-child' },
      { name: 'Start field', description: 'First set of month, day and year segments.', selector: '[slot="start"]' },
      { name: 'Separator', description: 'En dash between the fields, muted. Hidden from assistive tech.', selector: '[role="group"] > div > span' },
      { name: 'End field', description: 'Second set of segments. Typing here never changes the start.', selector: '[slot="end"]' },
      { name: 'Calendar button', description: 'Opens a range calendar in a popover. 24px hit target inside the field.', selector: 'button' },
      { name: 'Description', description: '13px muted.', selector: '[slot="description"]', fallback: { x: 40, y: 92 } },
    ],
  },
  usage: {
    use: ['Reporting periods and statement ranges.', 'Booking, leave and delivery windows.', 'Filters over dates with a start and end.', 'Ranges with a maximum length.'],
    avoid: [
      { text: 'A single date.', instead: { slug: 'date-picker', label: 'DatePicker' } },
      { text: 'Common ranges like last 7 days.', instead: { slug: 'date-range-presets', label: 'DateRangePresets' } },
      { text: 'A calendar shown inline.', instead: { slug: 'range-calendar', label: 'RangeCalendar' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'text', key: 'label', label: 'Label', presets: ['Reporting period', 'Statement range', 'Leave dates'] },
      { kind: 'segmented', key: 'size', label: 'Size', options: ['sm', 'md', 'lg'] },
      { kind: 'toggle', key: 'empty', label: 'Empty' },
      { kind: 'toggle', key: 'isInvalid', label: 'Invalid' },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { label: 'Reporting period', size: 'md', empty: false, isInvalid: false, isDisabled: false },
    render: (p, onEvent) => (
      <Basic key={String(p.empty)} label={String(p.label)} size={p.size as 'sm' | 'md' | 'lg'} empty={Boolean(p.empty)} isInvalid={Boolean(p.isInvalid)} isDisabled={Boolean(p.isDisabled)} onChange={(v) => onEvent(`onChange(${v})`)} />
    ),
    code: (p) => `<DateRangePicker label="${p.label}"${p.size !== 'md' ? ` size="${p.size}"` : ''}${p.empty ? '' : '\n  defaultValue={{ start: new CalendarDate(2026, 10, 1), end: new CalendarDate(2026, 10, 31) }}'}${p.isInvalid ? ' isInvalid errorMessage="Choose a range up to 90 days."' : ''}${p.isDisabled ? ' isDisabled' : ''} onChange={setRange} />`,
  },
  states: [
    { name: 'Filled', description: 'Both ends set.', Render: () => <Basic /> },
    { name: 'Empty', description: 'Placeholders in both fields.', Render: () => <Basic empty /> },
    { name: 'Invalid', description: 'Red border and a message about the rule.', Render: () => <Basic isInvalid label="Statement range" /> },
    { name: 'Disabled', description: 'Muted, button locked.', Render: () => <Basic isDisabled /> },
  ],
  sections: [
    {
      type: 'numbered',
      id: 'validation',
      title: 'Validation',
      intro: 'Ranges fail on order, length and bounds.',
      items: [
        { title: 'End must not precede start', body: 'The field marks an inverted range invalid. Message: "End date must be after start date."' },
        { title: 'Cap the length with validate', body: 'Return "Choose a range up to 90 days." Say the cap in the description first.' },
        { title: 'Bound with min and max', body: 'minValue and maxValue gray out days in the calendar.' },
        { title: 'Both or neither', body: 'A half-filled range is empty. Required checks run on null.' },
        { title: 'Say which end is wrong', body: 'Name start or end in the error when only one is out of bounds.' },
      ],
    },
    {
      type: 'rules',
      id: 'recipes',
      title: 'Composition',
      items: [
        { title: 'With presets', body: 'Place DateRangePresets beside the picker so common ranges take one click.' },
        { title: 'Two months', body: 'The popover shows the calendar for the start month first; the user moves forward for the end.' },
        { title: 'Reports', body: 'Default to the current month so the first load shows data.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Label', body: 'What the range is: Reporting period.' },
      { title: 'Description', body: 'Limits: "Up to 90 days."' },
      { title: 'Error', body: 'State the rule and the fix.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['←', '→'], action: 'Moves between segments across both fields.' },
      { keys: ['↑', '↓'], action: 'Changes the focused segment.' },
      { keys: ['0–9'], action: 'Types into the segment.' },
      { keys: ['Enter', 'Space'], action: 'On the button, opens the calendar.' },
      { keys: ['Esc'], action: 'Closes the calendar and returns focus.' },
      { keys: ['Arrows', 'Enter'], action: 'In the grid, move and press Enter to set start, then end.' },
    ],
    notes: [
      'Built on React Aria DateRangePicker; start and end are separate labelled groups.',
      'Screen readers announce "start date, month" and "end date, month".',
      'The popover is a dialog with a labelled grid; selected range is exposed per cell.',
      'The calendar button has an accessible name and a 24px target.',
    ],
    reducedMotion: 'The popover fades without scale.',
  },
  props: [
    { name: 'label / description / errorMessage', type: 'ReactNode', description: 'Standard field text.' },
    { name: 'value / defaultValue', type: '{ start: DateValue; end: DateValue } | null', description: 'Controlled or initial range.' },
    { name: 'onChange', type: '(value: RangeValue | null) => void', description: 'Fires when both ends are set.' },
    { name: 'minValue / maxValue', type: 'DateValue', description: 'Allowed bounds.' },
    { name: 'isDateUnavailable', type: '(date: DateValue) => boolean', description: 'Block dates.' },
    { name: 'allowsNonContiguousRanges', type: 'boolean', default: 'false', description: 'Allow unavailable dates inside the range.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height.' },
    { name: 'isDisabled / isReadOnly / isRequired / isInvalid', type: 'boolean', default: 'false', description: 'States.' },
  ],
  related: ['date-picker', 'date-range-presets', 'range-calendar', 'date-field'],
};
export default page;
