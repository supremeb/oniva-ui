import { NumberField } from 'oniva-ui';
import type { DocPage } from '../types';

type P = { label?: string; currency?: boolean; isInvalid?: boolean; isDisabled?: boolean; size?: 'sm' | 'md' | 'lg'; value?: number; onChange?: (v: number) => void };

const Basic = (p: P) => (
  <div style={{ width: 240 }}>
    <NumberField
      label={p.label ?? 'Seats'}
      size={p.size}
      defaultValue={p.value ?? 12}
      minValue={p.currency ? 0 : 1}
      maxValue={p.currency ? undefined : 100}
      step={p.currency ? 10 : 1}
      formatOptions={p.currency ? { style: 'currency', currency: 'USD' } : undefined}
      description={p.currency ? 'Includes tax.' : undefined}
      isInvalid={p.isInvalid}
      errorMessage={p.isInvalid ? 'Enter a number between 1 and 100.' : undefined}
      isDisabled={p.isDisabled}
      onChange={p.onChange}
    />
  </div>
);

const page: DocPage = {
  slug: 'number-field',
  status: 'Stable',
  version: '0.1.0',
  importName: 'NumberField',
  group: ['Components', 'Forms'],
  sourcePath: 'components/NumberField',
  lede: 'A numeric input with stepper buttons, locale-aware formatting and min and max. It handles counts, amounts and percentages the user types or nudges.',
  anatomy: {
    intro: 'Five parts. The label, input and steppers are always present. Description and error are optional.',
    Render: () => <Basic currency value={2480} label="Invoice total" />,
    parts: [
      { name: 'Label', description: '14px medium.', selector: 'label' },
      { name: 'Field', description: 'Standard control chrome: 38px at md, 10px radius, 4px horizontal padding to fit the steppers.', selector: '[role="group"]' },
      { name: 'Input', description: 'Centered, tabular numerals, 14px. Formats on blur and parses on type.', selector: 'input' },
      { name: 'Steppers', description: 'Decrement and increment buttons at each end. Hold to repeat.', selector: 'button:first-of-type' },
      { name: 'Description', description: '13px muted. Put units and tax notes here.', selector: '[slot="description"]', fallback: { x: 40, y: 92 } },
    ],
  },
  usage: {
    use: ['Quantities and seat counts.', 'Currency amounts with formatting.', 'Percent and rate inputs with bounds.', 'Values users type more than nudge.'],
    avoid: [
      { text: 'An approximate value on a scale.', instead: { slug: 'slider', label: 'Slider' } },
      { text: 'IDs, phone numbers, ZIP codes.', instead: { slug: 'input', label: 'Input' } },
      { text: 'One-time codes.', instead: { slug: 'input-otp', label: 'InputOTP' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'text', key: 'label', label: 'Label', presets: ['Seats', 'Invoice total', 'Discount %'] },
      { kind: 'segmented', key: 'size', label: 'Size', options: ['sm', 'md', 'lg'] },
      { kind: 'toggle', key: 'currency', label: 'Currency format' },
      { kind: 'toggle', key: 'isInvalid', label: 'Invalid' },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { label: 'Seats', size: 'md', currency: false, isInvalid: false, isDisabled: false },
    render: (p, onEvent) => (
      <Basic key={String(p.currency)} label={String(p.label)} size={p.size as 'sm' | 'md' | 'lg'} currency={Boolean(p.currency)} isInvalid={Boolean(p.isInvalid)} isDisabled={Boolean(p.isDisabled)} value={p.currency ? 2480 : 12} onChange={(v) => onEvent(`onChange(${v})`)} />
    ),
    code: (p) => `<NumberField label="${p.label}"${p.size !== 'md' ? ` size="${p.size}"` : ''} defaultValue={${p.currency ? 2480 : 12}} minValue={${p.currency ? 0 : 1}}${p.currency ? " step={10} formatOptions={{ style: 'currency', currency: 'USD' }}" : ' maxValue={100}'}${p.isInvalid ? ' isInvalid errorMessage="Enter a number between 1 and 100."' : ''}${p.isDisabled ? ' isDisabled' : ''} onChange={setValue} />`,
  },
  states: [
    { name: 'Default', description: 'Integer with min 1 and max 100.', Render: () => <Basic /> },
    { name: 'Currency', description: 'Formatted as $2,480.00 on blur.', Render: () => <Basic currency value={2480} label="Invoice total" /> },
    { name: 'Invalid', description: 'Out-of-range or unparsable value.', Render: () => <Basic isInvalid value={172} /> },
    { name: 'Disabled', description: 'Muted, steppers locked.', Render: () => <Basic isDisabled value={3} label="Locked" /> },
    { name: 'At minimum', description: 'The decrement stepper disables at minValue.', Render: () => <Basic value={1} /> },
  ],
  sections: [
    {
      type: 'numbered',
      id: 'validation',
      title: 'Validation',
      intro: 'Numbers fail in three ways: unparsable, out of range, and wrong precision.',
      items: [
        { title: 'Clamp with min and max', body: 'Set minValue and maxValue. Typed values outside the range are clamped on blur; mark invalid instead when clamping would hide a mistake.' },
        { title: 'Show the range up front', body: 'Description: "1 to 100". Do not wait for the error.' },
        { title: 'Use step for precision', body: 'step={10} snaps stepper changes; formatOptions sets decimals shown.' },
        { title: 'Say the bound in the error', body: '"Enter a number between 1 and 100", not "Invalid".' },
        { title: 'Parse by locale', body: 'The field reads "1.234,5" in German. Never pre-clean the string yourself.' },
      ],
    },
    {
      type: 'rules',
      id: 'format',
      title: 'Formatting',
      items: [
        { title: 'Currency', body: "formatOptions: { style: 'currency', currency: 'USD' }. Store minor units on the server." },
        { title: 'Percent', body: "style: 'percent' stores 0.5 for 50%. Say that in the code, not in the UI." },
        { title: 'Units', body: "style: 'unit', unit: 'kilogram'. Put the unit in the format, not the label." },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Label', body: 'The thing counted: Seats, Invoice total.' },
      { title: 'Description', body: 'Range or unit: "1 to 100 seats".' },
      { title: 'Error', body: 'State the range and the fix.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['↑'], action: 'Increases by step.' },
      { keys: ['↓'], action: 'Decreases by step.' },
      { keys: ['PageUp', 'PageDown'], action: 'Larger steps (10x).' },
      { keys: ['Home', 'End'], action: 'Jump to min or max, when set.' },
      { keys: ['Type'], action: 'Edits the number; parsed on blur.' },
    ],
    notes: [
      'Built on React Aria NumberField: role="group" with a spinbutton input.',
      'Screen readers announce label, formatted value and "spin button".',
      'Stepper buttons are not tab stops; arrow keys replace them.',
      'Stepper hit area is smaller than 44px; the input itself is the primary target.',
    ],
    reducedMotion: 'No animation beyond border color.',
  },
  props: [
    { name: 'label / description / errorMessage', type: 'ReactNode', description: 'Standard field text.' },
    { name: 'value / defaultValue', type: 'number', description: 'Controlled or initial number.' },
    { name: 'onChange', type: '(value: number) => void', description: 'Fires on commit (blur or Enter), NaN when empty.' },
    { name: 'minValue / maxValue', type: 'number', description: 'Bounds.' },
    { name: 'step', type: 'number', default: '1', description: 'Stepper increment.' },
    { name: 'formatOptions', type: 'Intl.NumberFormatOptions', description: 'Currency, percent, unit and decimals.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height.' },
    { name: 'placeholder', type: 'string', description: 'Shown when empty.' },
    { name: 'isDisabled / isReadOnly / isRequired / isInvalid', type: 'boolean', default: 'false', description: 'States.' },
  ],
  related: ['input', 'slider', 'input-group', 'input-otp'],
};
export default page;
