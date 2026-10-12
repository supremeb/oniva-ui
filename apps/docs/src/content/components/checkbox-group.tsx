import { Checkbox, CheckboxGroup } from 'oniva-ui';
import type { DocPage } from '../types';

type P = {
  label?: string;
  orientation?: 'vertical' | 'horizontal';
  isInvalid?: boolean;
  isDisabled?: boolean;
  description?: string;
  error?: string;
  empty?: boolean;
  onChange?: (v: string[]) => void;
};

const Basic = (p: P) => (
  <div style={{ width: 340 }}>
    <CheckboxGroup
      label={p.label ?? 'Notify me via'}
      description={p.description}
      errorMessage={p.error}
      orientation={p.orientation}
      isInvalid={p.isInvalid}
      isDisabled={p.isDisabled}
      defaultValue={p.empty ? [] : ['email']}
      onChange={p.onChange}
    >
      <Checkbox value="email">Email</Checkbox>
      <Checkbox value="slack">Slack</Checkbox>
      <Checkbox value="sms">SMS</Checkbox>
    </CheckboxGroup>
  </div>
);

const page: DocPage = {
  slug: 'checkbox-group',
  status: 'Stable',
  version: '0.1.0',
  importName: 'CheckboxGroup',
  group: ['Components', 'Forms'],
  sourcePath: 'components/CheckboxGroup',
  lede: 'A labelled set of checkboxes that share one value, one description and one error. It handles choosing several options from a short list.',
  anatomy: {
    intro: 'Four parts. The group label and checkboxes are always present. Description and error belong to the group, not to a single checkbox.',
    Render: () => <Basic description="You can change this anytime." />,
    parts: [
      { name: 'Group label', description: '14px medium. Names the question and labels the group for assistive tech.', selector: '[role="group"] > span:first-child' },
      { name: 'Checkbox list', description: 'Column with 12px gap, or a wrapping row with 20px gap when horizontal.', selector: '[role="group"] > div' },
      { name: 'Checkbox', description: '16px box and a 14px label. Each is its own tab stop.', selector: '[role="group"] label:first-of-type' },
      { name: 'Description', description: '13px muted help text under the group.', selector: '[slot="description"]', fallback: { x: 40, y: 92 } },
      { name: 'Error', description: '13px red message that covers the whole group, shown when invalid.', selector: '[slot="errorMessage"]', fallback: { x: 40, y: 96 } },
    ],
  },
  usage: {
    use: ['Choosing zero or more options from 2 to 8.', 'Report columns, notification channels, permissions.', 'A set that needs a group rule, such as "select at least one".', 'Options the user compares on one screen.'],
    avoid: [
      { text: 'Choosing exactly one.', instead: { slug: 'radio-group', label: 'RadioGroup' } },
      { text: 'More than about eight options.', instead: { slug: 'multi-select', label: 'MultiSelect' } },
      { text: 'One independent opt-in.', instead: { slug: 'checkbox', label: 'Checkbox' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'text', key: 'label', label: 'Group label', presets: ['Notify me via', 'Report columns', 'Permissions'] },
      { kind: 'segmented', key: 'orientation', label: 'Orientation', options: ['vertical', 'horizontal'] },
      { kind: 'toggle', key: 'isInvalid', label: 'Invalid' },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { label: 'Notify me via', orientation: 'vertical', isInvalid: false, isDisabled: false },
    render: (p, onEvent) => (
      <Basic label={String(p.label)} orientation={p.orientation as 'vertical' | 'horizontal'} isInvalid={Boolean(p.isInvalid)} isDisabled={Boolean(p.isDisabled)} error="Select at least one channel." onChange={(v) => onEvent(`onChange([${v.join(', ')}])`)} />
    ),
    code: (p) => `<CheckboxGroup label="${p.label}" defaultValue={['email']}${p.orientation === 'horizontal' ? ' orientation="horizontal"' : ''}${p.isInvalid ? ' isInvalid errorMessage="Select at least one channel."' : ''}${p.isDisabled ? ' isDisabled' : ''} onChange={setChannels}>\n  <Checkbox value="email">Email</Checkbox>\n  <Checkbox value="slack">Slack</Checkbox>\n  <Checkbox value="sms">SMS</Checkbox>\n</CheckboxGroup>`,
  },
  states: [
    { name: 'Some selected', description: 'Value is an array of selected values.', Render: () => <Basic /> },
    { name: 'None selected', description: 'Empty array.', Render: () => <Basic empty /> },
    { name: 'Horizontal', description: 'Wrapping row, 20px gap. For short labels.', Render: () => <Basic orientation="horizontal" /> },
    { name: 'Invalid', description: 'One message for the group.', Render: () => <Basic empty isInvalid error="Select at least one channel." /> },
    { name: 'Disabled', description: 'Every checkbox is locked.', Render: () => <Basic isDisabled /> },
  ],
  sections: [
    {
      type: 'numbered',
      id: 'validation',
      title: 'Validation',
      intro: 'The group owns validation, so one message covers all boxes.',
      items: [
        { title: 'Require on the group', body: 'isRequired on CheckboxGroup means at least one must be checked.' },
        { title: 'Show the error after submit', body: 'An empty group is fine until the user tries to continue.' },
        { title: 'Name the minimum', body: '"Select at least one channel", not "Required".' },
        { title: 'Cap with validate', body: 'For a maximum, return "Choose up to 3 columns" from validate and say the limit in the description first.' },
        { title: 'One error, not many', body: 'Never put an error on an individual checkbox in a group.' },
      ],
    },
    {
      type: 'rules',
      id: 'layout',
      title: 'Layout',
      items: [
        { title: 'Vertical default', body: 'Scans fastest. 12px gap.' },
        { title: 'Horizontal for 2 to 4 short labels', body: 'Under 14 characters each.' },
        { title: 'Order', body: 'Most common first, "Other" last.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Group label', body: 'A question or noun phrase: Notify me via.' },
      { title: 'Options', body: 'Parallel nouns or verb phrases, sentence case.' },
      { title: 'Description', body: 'Say whether the choice is saved now or on submit.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['Tab', 'Shift+Tab'], action: 'Moves between checkboxes; each is a tab stop.' },
      { keys: ['Space'], action: 'Toggles the focused checkbox.' },
    ],
    notes: [
      'Built on React Aria CheckboxGroup: role="group" labelled by the group label.',
      'Screen readers announce the group label when focus enters, then each checkbox state.',
      'Description and error are linked with aria-describedby on the group.',
      'Focus ring is 2px on each box.',
    ],
    reducedMotion: 'Check draw and press scale are shortened.',
  },
  props: [
    { name: 'label', type: 'ReactNode', description: 'Group label.' },
    { name: 'description', type: 'ReactNode', description: 'Help text.' },
    { name: 'errorMessage', type: 'string | (v) => string', description: 'Shown when invalid.' },
    { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Layout direction.' },
    { name: 'value / defaultValue', type: 'string[]', description: 'Selected values.' },
    { name: 'onChange', type: '(value: string[]) => void', description: 'Fires when the selection changes.' },
    { name: 'isRequired / isInvalid / isDisabled / isReadOnly', type: 'boolean', default: 'false', description: 'Group states.' },
    { name: 'validate', type: '(value: string[]) => string | null', description: 'Custom group validation.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Root style override.' },
  ],
  related: ['checkbox', 'radio-group', 'multi-select', 'fieldset'],
};
export default page;
