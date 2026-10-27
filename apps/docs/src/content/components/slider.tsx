import { Slider } from 'oniva-ui';
import type { DocPage } from '../types';

type P = {
  label?: string;
  range?: boolean;
  hideOutput?: boolean;
  isDisabled?: boolean;
  step?: number;
  max?: number;
  onChange?: (v: number | number[]) => void;
};

const fmt = { style: 'currency', currency: 'USD', maximumFractionDigits: 0 } as const;

const Basic = (p: P) => (
  <div style={{ width: 320 }}>
    {p.range ? (
      <Slider
        label={p.label ?? 'Invoice amount'}
        defaultValue={[250, 1800]}
        minValue={0}
        maxValue={p.max ?? 5000}
        step={p.step ?? 50}
        formatOptions={fmt}
        hideOutput={p.hideOutput}
        isDisabled={p.isDisabled}
        onChange={p.onChange}
      />
    ) : (
      <Slider
        label={p.label ?? 'Monthly spend limit'}
        defaultValue={3500}
        minValue={0}
        maxValue={p.max ?? 10000}
        step={p.step ?? 100}
        formatOptions={fmt}
        hideOutput={p.hideOutput}
        isDisabled={p.isDisabled}
        onChange={p.onChange}
      />
    )}
  </div>
);

const page: DocPage = {
  slug: 'slider',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Slider',
  group: ['Components', 'Forms'],
  sourcePath: 'components/Slider',
  lede: 'Pick a number, or a range of numbers, by dragging along a track. It handles approximate choices where speed matters more than an exact figure.',
  anatomy: {
    intro: 'Five parts. The label, track and thumb are always present. The output is on by default and can be hidden; a range slider adds a second thumb.',
    Render: () => <Basic range />,
    parts: [
      { name: 'Label', description: '14px medium, names the value being set.', selector: 'label' },
      { name: 'Output', description: 'Current value, 14px, tabular, formatted with formatOptions. Right aligned on the label row. Hidden with hideOutput.', selector: 'output' },
      { name: 'Track', description: '6px tall, fully rounded, 20px hit height. The unfilled part uses the border token.', selector: '[role="group"] > div:nth-child(2)', fallback: { x: 50, y: 70 } },
      { name: 'Fill', description: '6px accent bar between the start and the thumb, or between the two thumbs in a range.', selector: '[role="group"] > div:nth-child(2) > div:nth-child(2)', fallback: { x: 40, y: 70 } },
      { name: 'Thumb', description: '20px white circle, no border, raised shadow that lifts on hover and flattens while dragged. Focus shows a 2px ring.', selector: '[role="group"] > div:nth-child(2) > div:nth-child(3)' },
    ],
  },
  usage: {
    use: ['A limit or threshold where approximate is fine: spend cap, volume.', 'Ranges such as a price filter with two thumbs.', 'Values with a small bounded domain and clear endpoints.', 'Live previews where the user sees the effect while dragging.'],
    avoid: [
      { text: 'Exact numbers like quantity or tax rate.', instead: { slug: 'number-field', label: 'NumberField' } },
      { text: 'A handful of named levels.', instead: { slug: 'segmented-control', label: 'SegmentedControl' } },
      { text: 'Dates or time spans.', instead: { slug: 'date-range-picker', label: 'DateRangePicker' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'text', key: 'label', label: 'Label', presets: ['Monthly spend limit', 'Invoice amount', 'Risk score'] },
      { kind: 'toggle', key: 'range', label: 'Range (two thumbs)' },
      { kind: 'number', key: 'step', label: 'Step', min: 1, max: 1000, step: 10 },
      { kind: 'toggle', key: 'hideOutput', label: 'Hide output' },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { label: 'Monthly spend limit', range: false, step: 100, hideOutput: false, isDisabled: false },
    render: (p, onEvent) => (
      <Basic
        key={`${p.range}`}
        label={String(p.label)}
        range={Boolean(p.range)}
        step={Number(p.step)}
        hideOutput={Boolean(p.hideOutput)}
        isDisabled={Boolean(p.isDisabled)}
        onChange={(v) => onEvent(`onChange(${JSON.stringify(v)})`)}
      />
    ),
    code: (p) => `<Slider label="${p.label}" ${p.range ? 'defaultValue={[250, 1800]}' : 'defaultValue={3500}'} minValue={0} maxValue={${p.range ? 5000 : 10000}} step={${p.step}}\n  formatOptions={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}${p.hideOutput ? ' hideOutput' : ''}${p.isDisabled ? ' isDisabled' : ''} />`,
  },
  states: [
    { name: 'Single value', description: 'One thumb, fill from the start.', Render: () => <Basic /> },
    { name: 'Range', description: 'Two thumbs; fill between them. Thumbs cannot cross.', Render: () => <Basic range /> },
    { name: 'No output', description: 'Output hidden, for when another element shows the value.', Render: () => <Basic hideOutput /> },
    { name: 'Disabled', description: 'Muted track, thumbs not focusable.', Render: () => <Basic isDisabled label="Risk score" /> },
    { name: 'Fine step', description: 'Step 1 on a 0 to 100 scale. Arrow keys move one unit.', Render: () => <Basic step={1} max={100} label="Confidence" /> },
  ],
  sections: [
    {
      type: 'numbered',
      id: 'validation',
      title: 'Validation',
      intro: 'A slider cannot hold an out-of-range value, so most validation is design, not error messages.',
      items: [
        { title: 'Bound it', body: 'minValue and maxValue make invalid values impossible. Pick bounds users actually need.' },
        { title: 'Choose a step that fits', body: 'Step 100 on a 10,000 range gives 100 stops. Fewer than 5 stops means use a SegmentedControl.' },
        { title: 'Show the exact value', body: 'Keep the output visible so keyboard and screen reader users see what they set.' },
        { title: 'Validate relationships outside', body: 'If the max must exceed another field, set maxValue from state rather than showing an error after the fact.' },
      ],
    },
    {
      type: 'rules',
      id: 'pairing',
      title: 'Pairing',
      items: [
        { title: 'Add a precise path', body: 'When exactness matters, pair a slider with a NumberField bound to the same state.' },
        { title: 'Format with units', body: 'Use formatOptions for currency and percent so the output reads "$3,500", not "3500".' },
        { title: 'Apply on release', body: 'For expensive updates, commit on onChangeEnd rather than every move.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Label', body: 'The thing being set: Monthly spend limit. No "Select".' },
      { title: 'Output', body: 'Always formatted with units. Never a bare number for money.' },
      { title: 'Endpoints', body: 'If the ends are not obvious, add them in the description: "$0 to $10,000".' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['→', '↑'], action: 'Increases by one step.' },
      { keys: ['←', '↓'], action: 'Decreases by one step.' },
      { keys: ['PageUp'], action: 'Increases by a larger step (10% of the range).' },
      { keys: ['PageDown'], action: 'Decreases by a larger step.' },
      { keys: ['Home', 'End'], action: 'Jumps to the minimum or maximum.' },
      { keys: ['Tab'], action: 'Moves between thumbs in a range, then out.' },
    ],
    notes: [
      'Built on React Aria Slider: each thumb is an input type="range".',
      'The group has role="group" labelled by the label. The output is linked with aria-labelledby.',
      'Screen readers announce label, formatted value and "slider".',
      'Thumbs are 20px; the track adds a 20px hit height. Dragging works anywhere on the track.',
      'Focus shows a 2px ring on the thumb.',
    ],
    reducedMotion: 'Thumb and fill transitions are disabled; position still tracks the pointer.',
  },
  props: [
    { name: 'label', type: 'ReactNode', description: 'Visible label.' },
    { name: 'value / defaultValue', type: 'number | number[]', description: 'Single number or [start, end] for a range.' },
    { name: 'onChange / onChangeEnd', type: '(value) => void', description: 'During drag, and on release.' },
    { name: 'minValue / maxValue', type: 'number', default: '0 / 100', description: 'Bounds.' },
    { name: 'step', type: 'number', default: '1', description: 'Increment.' },
    { name: 'formatOptions', type: 'Intl.NumberFormatOptions', description: 'Output formatting: currency, percent, units.' },
    { name: 'hideOutput', type: 'boolean', default: 'false', description: 'Hide the numeric output.' },
    { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disable all thumbs.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Track direction.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Root style override.' },
  ],
  related: ['number-field', 'segmented-control', 'range-calendar', 'progress-bar'],
};
export default page;
