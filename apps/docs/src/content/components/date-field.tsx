import { CalendarDate } from '@internationalized/date';
import { DateField } from 'oniva-ui';
import type { DocPage } from '../types';

type P = { label?: string; empty?: boolean; isInvalid?: boolean; isDisabled?: boolean; size?: 'sm' | 'md' | 'lg'; description?: string; onChange?: (v: string) => void };

const Basic = (p: P) => (
  <div style={{ width: 280 }}>
    <DateField
      label={p.label ?? 'Invoice date'}
      size={p.size}
      description={p.description}
      defaultValue={p.empty ? undefined : new CalendarDate(2026, 10, 12)}
      isInvalid={p.isInvalid}
      errorMessage={p.isInvalid ? 'Due date is before the invoice date.' : undefined}
      isDisabled={p.isDisabled}
      onChange={(v) => p.onChange?.(v ? v.toString() : 'null')}
    />
  </div>
);

const page: DocPage = {
  slug: 'date-field',
  status: 'Stable',
  version: '0.1.0',
  importName: 'DateField',
  group: ['Components', 'Forms'],
  sourcePath: 'components/DateField',
  lede: 'A keyboard-first date input made of month, day and year segments. It handles dates people already know and can type faster than they can click.',
  anatomy: {
    intro: 'Four parts. The label and segments are always present. The suffix, description and error are optional.',
    Render: () => <Basic description="Shown on the PDF." />,
    parts: [
      { name: 'Label', description: '14px medium.', selector: 'div:has(> div > [role="group"]) > span:first-child' },
      { name: 'Field', description: '38px at md (32 sm, 44 lg), 10px radius, standard control chrome and focus ring.', selector: '[role="group"]' },
      { name: 'Segment', description: 'Editable month, day or year with a spinbutton role. The focused segment gets an accent highlight.', selector: '[role="spinbutton"][data-type="month"]' },
      { name: 'Description', description: '13px muted help text.', selector: '[slot="description"]', fallback: { x: 40, y: 90 } },
    ],
  },
  usage: {
    use: ['Known dates: invoice date, birthday.', 'Dense forms where a popover is clutter.', 'Dates far from today, where a calendar needs many clicks.', 'Power-user and keyboard flows.'],
    avoid: [
      { text: 'Dates chosen near today where a grid helps.', instead: { slug: 'date-picker', label: 'DatePicker' } },
      { text: 'Start and end together.', instead: { slug: 'date-range-picker', label: 'DateRangePicker' } },
      { text: 'Free text with no date structure.', instead: { slug: 'input', label: 'Input' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'text', key: 'label', label: 'Label', presets: ['Invoice date', 'Birthday', 'Start'] },
      { kind: 'segmented', key: 'size', label: 'Size', options: ['sm', 'md', 'lg'] },
      { kind: 'toggle', key: 'empty', label: 'Empty' },
      { kind: 'toggle', key: 'isInvalid', label: 'Invalid' },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { label: 'Invoice date', size: 'md', empty: false, isInvalid: false, isDisabled: false },
    render: (p, onEvent) => (
      <Basic key={String(p.empty)} label={String(p.label)} size={p.size as 'sm' | 'md' | 'lg'} empty={Boolean(p.empty)} isInvalid={Boolean(p.isInvalid)} isDisabled={Boolean(p.isDisabled)} onChange={(v) => onEvent(`onChange(${v})`)} />
    ),
    code: (p) => `<DateField label="${p.label}"${p.size !== 'md' ? ` size="${p.size}"` : ''}${p.empty ? '' : ' defaultValue={new CalendarDate(2026, 10, 12)}'}${p.isInvalid ? ' isInvalid errorMessage="Due date is before the invoice date."' : ''}${p.isDisabled ? ' isDisabled' : ''} onChange={setDate} />`,
  },
  states: [
    { name: 'Filled', description: 'All three segments set.', Render: () => <Basic /> },
    { name: 'Empty', description: 'Placeholders mm / dd / yyyy.', Render: () => <Basic empty label="Start" /> },
    { name: 'Invalid', description: 'Red border and a comparison message.', Render: () => <Basic isInvalid label="Due" /> },
    { name: 'Disabled', description: 'Muted, segments not focusable.', Render: () => <Basic isDisabled /> },
  ],
  sections: [
    {
      type: 'numbered',
      id: 'validation',
      title: 'Validation',
      intro: 'A partial date is not a value. Treat it carefully.',
      items: [
        { title: 'Incomplete is empty', body: 'onChange fires with null until all segments are set. Required checks should run on that.' },
        { title: 'Reject impossible dates', body: 'Feb 30 is flagged by the field. Clamp is never applied silently.' },
        { title: 'Use min and max', body: 'minValue and maxValue turn out-of-range dates invalid. Say the range in the description.' },
        { title: 'Compare in the message', body: '"Due date is before the invoice date."' },
        { title: 'Show the format only if needed', body: 'The placeholders already show the order in the user\'s locale.' },
      ],
    },
    {
      type: 'rules',
      id: 'recipes',
      title: 'Composition',
      items: [
        { title: 'Pair for ranges', body: 'Two DateFields side by side with a "to" label. Or use DateRangePicker.' },
        { title: 'Upgrade path', body: 'Swap in DatePicker when a calendar helps; the value type is identical.' },
        { title: 'Suffix icon', body: 'Pass suffix for a calendar icon that is decorative; it is not a button here.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Label', body: 'The date role: Invoice date, Birthday.' },
      { title: 'Description', body: 'Where the date shows: "Shown on the PDF."' },
      { title: 'Error', body: 'Name the comparison or bound.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['←', '→'], action: 'Moves between segments.' },
      { keys: ['↑', '↓'], action: 'Increments or decrements the focused segment.' },
      { keys: ['0–9'], action: 'Types into the segment and advances when complete.' },
      { keys: ['Backspace'], action: 'Clears the segment.' },
      { keys: ['Tab'], action: 'Moves to the next segment, then out.' },
    ],
    notes: [
      'Built on React Aria DateField: role="group" with spinbutton segments.',
      'Screen readers announce "month, spin button, 10" and read the full date on change.',
      'Segment order follows the locale.',
      'Literal separators are hidden from assistive tech.',
    ],
    reducedMotion: 'No motion beyond border color.',
  },
  props: [
    { name: 'label / description / errorMessage', type: 'ReactNode', description: 'Standard field text.' },
    { name: 'value / defaultValue', type: 'DateValue | null', description: 'Controlled or initial date.' },
    { name: 'onChange', type: '(value: DateValue | null) => void', description: 'Fires when complete or cleared.' },
    { name: 'minValue / maxValue', type: 'DateValue', description: 'Allowed range.' },
    { name: 'granularity', type: "'day' | 'hour' | 'minute' | 'second'", default: "'day'", description: 'Smallest unit.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height.' },
    { name: 'suffix', type: 'ReactNode', description: 'Trailing adornment.' },
    { name: 'isDisabled / isReadOnly / isRequired / isInvalid', type: 'boolean', default: 'false', description: 'States.' },
  ],
  related: ['date-picker', 'date-range-picker', 'calendar', 'input'],
};
export default page;
