import { MultiSelect } from 'oniva-ui';
import type { DocPage } from '../types';

const teams = [
  { id: 'design', label: 'Design' },
  { id: 'eng', label: 'Engineering' },
  { id: 'fin', label: 'Finance' },
  { id: 'ops', label: 'Operations' },
  { id: 'legal', label: 'Legal' },
];

type P = { label?: string; values?: string[]; isInvalid?: boolean; isDisabled?: boolean; placeholder?: string; description?: string; onChange?: (v: string[]) => void };

const Basic = (p: P) => (
  <div style={{ width: 320 }}>
    <MultiSelect
      label={p.label ?? 'Teams'}
      options={teams}
      defaultValue={p.values ?? ['design']}
      placeholder={p.placeholder ?? 'Add teams'}
      description={p.description}
      isInvalid={p.isInvalid}
      errorMessage={p.isInvalid ? 'Choose at least one team.' : undefined}
      isDisabled={p.isDisabled}
      onChange={p.onChange}
    />
  </div>
);

const page: DocPage = {
  slug: 'multi-select',
  status: 'Stable',
  version: '0.1.0',
  importName: 'MultiSelect',
  group: ['Components', 'Forms'],
  sourcePath: 'components/MultiSelect',
  lede: 'Pick several options from a list and see them as removable chips. It handles building a selection one option at a time without losing track of it.',
  anatomy: {
    intro: 'Five parts. The label and trigger are always present. Chips appear per selection; description and error are optional.',
    Render: () => <Basic values={['design', 'eng']} description="Approvers from these teams are notified." />,
    parts: [
      { name: 'Label', description: '14px medium.', selector: 'div:has(> div > button[aria-haspopup]) > span:first-child' },
      { name: 'Trigger', description: 'Full-width control, min height 38px, 10px radius, grows as chips wrap. Opens the list.', selector: 'button[aria-haspopup]' },
      { name: 'Chip', description: '12px pill with 8px left and 4px right padding and a 2px gap. Shows the option label.', selector: 'button[aria-haspopup] + span > span:first-child' },
      { name: 'Remove button', description: '16px round button inside the chip. Removes one option without opening the list.', selector: 'button[aria-label="Remove Design"]' },
      { name: 'Description', description: '13px muted.', selector: '[slot="description"]', fallback: { x: 40, y: 92 } },
    ],
  },
  usage: {
    use: ['Choosing 2 or more from 5 to 30 options.', 'Assigning teams, tags or recipients.', 'Filters where the current selection must stay visible.', 'Forms where each pick is removable.'],
    avoid: [
      { text: 'Choosing one value.', instead: { slug: 'select', label: 'Select' } },
      { text: 'Fewer than 6 options, all visible.', instead: { slug: 'checkbox-group', label: 'CheckboxGroup' } },
      { text: 'Searching a very long list.', instead: { slug: 'combobox', label: 'Combobox' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'text', key: 'label', label: 'Label', presets: ['Teams', 'Approvers', 'Regions'] },
      { kind: 'text', key: 'placeholder', label: 'Placeholder', presets: ['Add teams', 'Choose approvers', 'Select regions'] },
      { kind: 'toggle', key: 'preselected', label: 'Preselected' },
      { kind: 'toggle', key: 'isInvalid', label: 'Invalid' },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { label: 'Teams', placeholder: 'Add teams', preselected: true, isInvalid: false, isDisabled: false },
    render: (p, onEvent) => (
      <Basic key={String(p.preselected)} label={String(p.label)} placeholder={String(p.placeholder)} values={p.preselected ? ['design', 'eng'] : []} isInvalid={Boolean(p.isInvalid)} isDisabled={Boolean(p.isDisabled)} onChange={(v) => onEvent(`onChange([${v.join(', ')}])`)} />
    ),
    code: (p) => `<MultiSelect label="${p.label}" options={teams} placeholder="${p.placeholder}"${p.preselected ? " defaultValue={['design', 'eng']}" : ''}${p.isInvalid ? ' isInvalid errorMessage="Choose at least one team."' : ''}${p.isDisabled ? ' isDisabled' : ''} onChange={setTeams} />`,
  },
  states: [
    { name: 'Empty', description: 'Placeholder text.', Render: () => <Basic values={[]} /> },
    { name: 'One chip', description: 'Single selection shown as a chip.', Render: () => <Basic /> },
    { name: 'Many chips', description: 'Chips wrap and the trigger grows.', Render: () => <Basic values={['design', 'eng', 'fin', 'ops', 'legal']} /> },
    { name: 'Invalid', description: 'Red border and a message.', Render: () => <Basic values={[]} isInvalid /> },
    { name: 'Disabled', description: 'Muted, chips not removable.', Render: () => <Basic isDisabled values={['design', 'eng']} /> },
  ],
  sections: [
    {
      type: 'numbered',
      id: 'validation',
      title: 'Validation',
      intro: 'Validation here is about count, not content.',
      items: [
        { title: 'State the minimum', body: 'Description: "Choose at least one team."' },
        { title: 'Validate on close', body: 'Check when the list closes or on submit. An empty list is fine while the user is picking.' },
        { title: 'Cap with a clear message', body: '"Choose up to 3 teams." Disable remaining options at the limit and say why.' },
        { title: 'Keep the selection on error', body: 'Never clear chips on a failed submit.' },
      ],
    },
    {
      type: 'rules',
      id: 'recipes',
      title: 'Behavior',
      items: [
        { title: 'List stays open', body: 'Picking an option keeps the list open so several can be chosen in a row.' },
        { title: 'Order of chips', body: 'Chips follow the option order, not the click order, so the value is stable.' },
        { title: 'Chip overflow', body: 'Chips wrap. For more than about 8, summarise outside the field: "8 teams".' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Label', body: 'Plural noun: Teams, Approvers.' },
      { title: 'Placeholder', body: 'Action plus noun: Add teams.' },
      { title: 'Options', body: 'Short names, under 24 characters, sorted alphabetically unless there is a natural order.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['Enter', 'Space', '↓'], action: 'Opens the list.' },
      { keys: ['↑', '↓'], action: 'Moves the highlight.' },
      { keys: ['Space', 'Enter'], action: 'Toggles the highlighted option; list stays open.' },
      { keys: ['Esc'], action: 'Closes the list.' },
      { keys: ['A–Z'], action: 'Typeahead to an option.' },
    ],
    notes: [
      'Built on React Aria Select with selectionMode="multiple": a listbox with aria-multiselectable.',
      'Screen readers announce each option as "selected" or "not selected" and the count.',
      'Each chip remove button has an accessible name: "Remove Design".',
      'Chips are not individual tab stops; remove with the button or by toggling in the list.',
    ],
    reducedMotion: 'The popover fades without scale.',
  },
  props: [
    { name: 'options', type: 'MultiSelectOption[]', description: 'Required. Each has id and label.' },
    { name: 'value / defaultValue', type: 'string[]', description: 'Selected ids.' },
    { name: 'onChange', type: '(value: string[]) => void', description: 'Fires when the selection changes.' },
    { name: 'label / description / errorMessage', type: 'ReactNode', description: 'Standard field text.' },
    { name: 'placeholder', type: 'string', description: 'Shown when empty.' },
    { name: 'isDisabled / isInvalid / isRequired', type: 'boolean', default: 'false', description: 'States.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Root style override.' },
    { name: 'ref', type: 'Ref<HTMLButtonElement>', description: 'Forwarded to the trigger.' },
  ],
  related: ['select', 'combobox', 'checkbox-group', 'tag'],
};
export default page;
