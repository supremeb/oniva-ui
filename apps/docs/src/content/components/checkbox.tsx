import { Checkbox } from 'oniva-ui';
import type { DocPage } from '../types';

type P = {
  text?: string;
  description?: string;
  isSelected?: boolean;
  isIndeterminate?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  onChange?: (v: boolean) => void;
};

const Basic = (p: P) => (
  <div style={{ width: 300 }}>
    <Checkbox
      description={p.description}
      defaultSelected={p.isSelected}
      isIndeterminate={p.isIndeterminate}
      isDisabled={p.isDisabled}
      isInvalid={p.isInvalid}
      onChange={p.onChange}
    >
      {p.text ?? 'Email me invoice receipts'}
    </Checkbox>
  </div>
);

const page: DocPage = {
  slug: 'checkbox',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Checkbox',
  group: ['Components', 'Forms'],
  sourcePath: 'components/Checkbox',
  lede: 'A binary choice that the user confirms later, with an optional mixed state. It handles opt-ins, agreements, and selecting one item among many.',
  anatomy: {
    intro: 'Three parts. The box and label are always present; the description is optional and stacks under the label.',
    Render: () => <Basic isSelected description="Sent to billing@acme.co after each payment." />,
    parts: [
      { name: 'Box', description: '16px square, 4px radius, 1px control border. Checked fills with a flat accent colour (no shadow) and draws a 2.25px check stroke. Presses scale it down.', selector: 'label > span:nth-child(2)' },
      { name: 'Label', description: '14px medium, 20px line height, text color. The whole row is the hit area, including the gap.', selector: 'label > span:nth-child(3)' },
      { name: 'Description', description: '13px regular muted help text under the label, 2px gap. Use it for consequence, not repetition.', selector: 'label > span:nth-child(3) > span', fallback: { x: 50, y: 75 } },
    ],
  },
  usage: {
    use: ['An opt-in that is saved with a form: "Email me receipts".', 'Agreeing to terms that the user must acknowledge.', 'Selecting rows or several items from a list.', 'A parent that summarizes children with the mixed state.'],
    avoid: [
      { text: 'A setting that takes effect immediately.', instead: { slug: 'switch', label: 'Switch' } },
      { text: 'Choosing exactly one of several options.', instead: { slug: 'radio-group', label: 'RadioGroup' } },
      { text: 'A related set of checkboxes that needs one label and one error.', instead: { slug: 'checkbox-group', label: 'CheckboxGroup' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'text', key: 'text', label: 'Label', presets: ['Email me invoice receipts', 'I agree to the terms', 'Select all'] },
      { kind: 'toggle', key: 'isSelected', label: 'Selected' },
      { kind: 'toggle', key: 'isIndeterminate', label: 'Indeterminate' },
      { kind: 'toggle', key: 'withDescription', label: 'Description' },
      { kind: 'toggle', key: 'isInvalid', label: 'Invalid' },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { text: 'Email me invoice receipts', isSelected: true, isIndeterminate: false, withDescription: false, isInvalid: false, isDisabled: false },
    render: (p, onEvent) => (
      <Basic
        key={`${p.isSelected}`}
        text={String(p.text)}
        isSelected={Boolean(p.isSelected)}
        isIndeterminate={Boolean(p.isIndeterminate)}
        description={p.withDescription ? 'Sent to billing@acme.co after each payment.' : undefined}
        isInvalid={Boolean(p.isInvalid)}
        isDisabled={Boolean(p.isDisabled)}
        onChange={(v) => onEvent(`onChange(${v})`)}
      />
    ),
    code: (p) =>
      `<Checkbox${p.isSelected ? ' defaultSelected' : ''}${p.isIndeterminate ? ' isIndeterminate' : ''}${p.isInvalid ? ' isInvalid' : ''}${p.isDisabled ? ' isDisabled' : ''}${p.withDescription ? ' description="Sent to billing@acme.co after each payment."' : ''} onChange={setReceipts}>\n  ${p.text}\n</Checkbox>`,
  },
  states: [
    { name: 'Unchecked', description: 'Empty surface box, control border.', Render: () => <Basic /> },
    { name: 'Checked', description: 'Flat accent fill, white check.', Render: () => <Basic isSelected /> },
    { name: 'Indeterminate', description: 'Dash replaces the check. Click resolves to checked.', Render: () => <Basic isIndeterminate text="Select all invoices" /> },
    { name: 'Invalid', description: 'Red border on the box. Pair with a message in the group.', Render: () => <Basic isInvalid text="I agree to the terms" /> },
    { name: 'Disabled', description: '50% opacity, not-allowed cursor, not focusable.', Render: () => <Basic isDisabled isSelected /> },
    { name: 'With description', description: 'Label plus a consequence line.', Render: () => <Basic isSelected description="Sent to billing@acme.co after each payment." /> },
    { name: 'Long label', description: 'Wraps; the box stays top-aligned with the first line.', Render: () => <Basic text="I confirm the bank details above are correct and authorize recurring debits on the 1st of each month" /> },
  ],
  sections: [
    {
      type: 'numbered',
      id: 'validation',
      title: 'Validation',
      intro: 'A checkbox is valid or not; the error belongs to the decision, not the box.',
      items: [
        { title: 'Require only what is legally required', body: 'isRequired on a terms checkbox blocks submit. Do not require marketing opt-ins.' },
        { title: 'Show the error after a submit attempt', body: 'A lone unchecked box is not wrong until the user tries to continue.' },
        { title: 'Say what to do', body: '"Accept the terms to continue", not "This field is required".' },
        { title: 'Put the message under the control', body: 'For a single checkbox, use isInvalid and a Field error beneath it. For several, use CheckboxGroup so one message covers them.' },
        { title: 'Never default consent to checked', body: 'Opt-ins start unchecked. Pre-checked consent is invalid in many regions.' },
      ],
    },
    {
      type: 'rules',
      id: 'rules',
      title: 'Rules',
      items: [
        { title: 'Checkbox or switch', body: 'Checkbox waits for a Save button. Switch applies at once.' },
        { title: 'List order', body: 'Most common first, "None" or "Other" last. Keep one column unless the options are under 12 characters.' },
        { title: 'Select all', body: 'Use the indeterminate state when only some children are checked. Label it "Select all".' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Phrase positively', body: '"Email me receipts", not "Don\'t send me receipts".' },
      { title: 'Start with a verb or "I"', body: 'Actions: "Email me". Agreements: "I agree to the terms".' },
      { title: 'Keep it scannable', body: 'Under 60 characters. Move detail into the description.' },
      { title: 'No trailing punctuation', body: 'Sentence case, no period, even in a description of one sentence.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['Tab', 'Shift+Tab'], action: 'Moves focus to and from the checkbox.' },
      { keys: ['Space'], action: 'Toggles checked. Resolves indeterminate to checked.' },
    ],
    notes: [
      'Built on React Aria Checkbox: a visually hidden native input type=checkbox inside the label.',
      'Screen readers announce: label, "checkbox", "checked" / "not checked" / "mixed".',
      'Indeterminate sets the native indeterminate property, exposed as aria-checked="mixed".',
      'Focus draws a 2px focus ring with 2px offset around the box, keyboard only.',
      'The label is part of the hit area. Rows are at least 20px tall; add padding for touch targets of 44px.',
    ],
    reducedMotion: 'The press scale and the check draw animation shorten to near-instant.',
  },
  props: [
    { name: 'children', type: 'ReactNode', description: 'Label text.' },
    { name: 'description', type: 'ReactNode', description: 'Secondary text under the label.' },
    { name: 'isSelected / defaultSelected', type: 'boolean', default: 'false', description: 'Controlled or initial checked state.' },
    { name: 'onChange', type: '(isSelected: boolean) => void', description: 'Fires when the user toggles.' },
    { name: 'isIndeterminate', type: 'boolean', default: 'false', description: 'Mixed state. Presentation only; you manage the value.' },
    { name: 'isDisabled / isReadOnly / isRequired / isInvalid', type: 'boolean', default: 'false', description: 'States and validation.' },
    { name: 'value', type: 'string', description: 'Value inside a CheckboxGroup.' },
    { name: 'name / form', type: 'string', description: 'Native form submission.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Root style override.' },
    { name: 'ref', type: 'Ref<HTMLLabelElement>', description: 'Forwarded to the label.' },
  ],
  related: ['checkbox-group', 'switch', 'radio-group', 'field', 'form'],
};
export default page;
