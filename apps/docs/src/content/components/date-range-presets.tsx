import { CalendarDate } from '@internationalized/date';
import { useState } from 'react';
import { DateRangePresets } from 'oniva-ui';
import type { DateRange } from 'oniva-ui';
import type { DocPage } from '../types';

const NOW = new CalendarDate(2026, 10, 12);

const Live = ({ onChange, initial }: { onChange?: (v: string) => void; initial?: DateRange | null }) => {
  const [value, setValue] = useState<DateRange | null>(initial ?? null);
  return (
    <div style={{ width: 520 }}>
      <DateRangePresets
        now={NOW}
        value={value}
        onChange={(v) => {
          setValue(v);
          onChange?.(v ? `${v.start} to ${v.end}` : 'null');
        }}
      />
    </div>
  );
};

const page: DocPage = {
  slug: 'date-range-presets',
  status: 'Stable',
  version: '0.1.0',
  importName: 'DateRangePresets',
  group: ['Components', 'Forms'],
  sourcePath: 'components/DateRangePresets',
  lede: 'A list of common ranges next to a range calendar. It handles the 80 percent case in one click and the custom case in two.',
  anatomy: {
    intro: 'Three parts. The preset list and calendar are always present. A preset highlights while the calendar matches it; picking other dates switches to Custom.',
    Render: () => <Live initial={{ start: new CalendarDate(2026, 10, 1), end: NOW }} />,
    parts: [
      { name: 'Preset list', description: 'Card with 12px radius, 6px padding, 168px minimum width. Today, Last 7 days, Month to date, Quarter to date, Year to date, then Custom.', selector: '[role="group"][aria-label="Presets"]' },
      { name: 'Preset item', description: '32px tall, 8px radius, 10px horizontal padding. The active preset is raised and bold.', selector: 'button[aria-pressed="true"]' },
      { name: 'Range field', description: 'A date range field with a calendar button for exact dates. Editing it switches the highlight to Custom.', selector: '[role="group"][aria-labelledby]:not([role="presentation"])' },
    ],
  },
  usage: {
    use: ['Dashboards and reports filtered by date.', 'Ranges that most people want relative to today.', 'Pairing quick choices with exact control.', 'Wide popovers and side panels.'],
    avoid: [
      { text: 'Only exact dates, with no common ranges.', instead: { slug: 'date-range-picker', label: 'DateRangePicker' } },
      { text: 'A calendar alone.', instead: { slug: 'range-calendar', label: 'RangeCalendar' } },
      { text: 'A single date.', instead: { slug: 'date-picker', label: 'DatePicker' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'select', key: 'initial', label: 'Initial range', options: ['none', 'month to date', 'last 7 days'] },
      { kind: 'toggle', key: 'dummy', label: 'Interactive (always on)' },
      { kind: 'text', key: 'note', label: 'Note', presets: ['Reference date Oct 12, 2026'] },
    ],
    initial: { initial: 'none', dummy: true, note: 'Reference date Oct 12, 2026' },
    render: (p, onEvent) => (
      <Live
        key={String(p.initial)}
        initial={p.initial === 'month to date' ? { start: new CalendarDate(2026, 10, 1), end: NOW } : p.initial === 'last 7 days' ? { start: new CalendarDate(2026, 10, 6), end: NOW } : null}
        onChange={(v) => onEvent(`onChange(${v})`)}
      />
    ),
    code: () => `const [value, setValue] = useState<DateRange | null>(null);\n\n<DateRangePresets value={value} onChange={setValue} />`,
  },
  states: [
    { name: 'No selection', description: 'Nothing highlighted until a preset or range is chosen.', Render: () => <Live /> },
    { name: 'Preset active', description: 'Month to date matches the range, so it highlights.', Render: () => <Live initial={{ start: new CalendarDate(2026, 10, 1), end: NOW }} /> },
    { name: 'Custom range', description: 'A range that matches no preset leaves the list unhighlighted.', Render: () => <Live initial={{ start: new CalendarDate(2026, 9, 3), end: new CalendarDate(2026, 9, 20) }} /> },
  ],
  sections: [
    {
      type: 'numbered',
      id: 'validation',
      title: 'Validation',
      intro: 'Presets are always valid, so rules live on custom ranges.',
      items: [
        { title: 'Presets are computed from now', body: 'Pass now for tests and server-rendered reports. Default is today in the local zone.' },
        { title: 'Filter what you offer', body: 'If the data starts in Aug 2026, hide Year to date or note the cut-off in the description.' },
        { title: 'Cap custom ranges outside', body: 'Validate length after onChange and show the message near the calendar.' },
        { title: 'Match exactly', body: 'matchPreset(range, now) tells you which preset a range equals; use it to label the result.' },
      ],
    },
    {
      type: 'rules',
      id: 'presets',
      title: 'Presets',
      items: [
        { title: 'Today', body: 'Start and end are the same day.' },
        { title: 'Last 7 days', body: 'Includes today, so six days back to today.' },
        { title: 'Month, quarter and year to date', body: 'From the first day of the period through today.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Preset labels', body: 'Fixed and sentence case. Do not translate by editing the list; labels live in the component.' },
      { title: 'Show the result', body: 'Echo the range as text next to the control: "Oct 1 – Oct 12, 2026".' },
      { title: 'Order', body: 'Shortest period first.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves through the preset buttons, then the range field.' },
      { keys: ['Enter', 'Space'], action: 'Applies the focused preset.' },
      { keys: ['Arrows', 'PageUp', 'PageDown'], action: 'In the range field calendar, move by day, week and month.' },
    ],
    notes: [
      'Presets are toggle buttons in a group named Presets; the active one has aria-pressed="true".',
      'The range field is a DateRangePicker with its own calendar popover.',
      'Selecting a preset moves the visible month to the range start.',
      'Active preset is not announced by color alone.',
    ],
    reducedMotion: 'Month transitions are instant.',
  },
  props: [
    { name: 'value', type: 'DateRange | null', description: 'Required. Current range.' },
    { name: 'onChange', type: '(value: DateRange | null) => void', description: 'Required. Fires on preset or calendar pick.' },
    { name: 'now', type: 'CalendarDate', description: 'Reference date. Defaults to today.' },
    { name: 'label', type: 'string', description: 'Accessible name for the group.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Root style override.' },
    { name: 'PRESETS / presetRange / matchPreset', type: 'exports', description: 'Preset list and helpers for custom UIs.' },
  ],
  related: ['date-range-picker', 'range-calendar', 'filter-bar', 'segmented-control'],
};
export default page;
