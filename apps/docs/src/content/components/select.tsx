import { Select, SelectItem } from 'oniva-ui';
import type { DocPage } from '../types';

interface BasicProps { label?: string; isInvalid?: boolean; isDisabled?: boolean; description?: string; error?: string; size?: 'sm' | 'md' | 'lg'; empty?: boolean; width?: number }
const Basic = (p: BasicProps) => (
  <div style={{ width: p.width ?? 280 }}>
    <Select label={p.label ?? 'Status'} size={p.size} description={p.description} isInvalid={p.isInvalid} isDisabled={p.isDisabled} errorMessage={p.error} placeholder="Choose status" defaultSelectedKey={p.empty ? undefined : 'paid'}>
      <SelectItem id="paid" dot="success">Paid</SelectItem>
      <SelectItem id="pending" dot="warning">Pending</SelectItem>
      <SelectItem id="failed" dot="danger">Failed</SelectItem>
      <SelectItem id="draft" dot="neutral">Draft</SelectItem>
    </Select>
  </div>
);

const page: DocPage = {
  slug: 'select',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Select',
  group: ['Components', 'Forms'],
  sourcePath: 'components/Select',
  lede: 'Pick one option from a short, known list. It handles four moments: nothing chosen, open, chosen, and invalid.',
  anatomy: {
    intro: 'Seven parts. The label and trigger are always present. Description, error and status dots are optional.',
    Render: () => <Basic description="Shown on the invoice." isInvalid error="Pick a status." />,
    parts: [
      { name: 'Label', description: '14px medium, text color. Always visible. Never use the placeholder as the label.', selector: 'label' },
      { name: 'Trigger', description: 'Full-width button. 38px tall at md, 10px padding, 1px border and a recessed inner top shadow. Border darkens on hover.', selector: 'button' },
      { name: 'Selected value', description: 'The chosen option text, truncated with an ellipsis. Placeholder uses text-placeholder.', selector: 'button [slot="label"]', fallback: { x: 22, y: 50 } },
      { name: 'Chevron', description: '16px lucide ChevronDown in icon-muted. Decorative, aria-hidden.', selector: 'button svg:last-of-type' },
      { name: 'Description', description: 'Help text under the field, 12px muted, linked through aria-describedby.', selector: '[slot="description"]', fallback: { x: 50, y: 78 } },
      { name: 'Error message', description: 'Replaces nothing: shows under the description when isInvalid. Border turns error-border.', selector: '[slot="errorMessage"]', fallback: { x: 50, y: 92 } },
      { name: 'Status dot', description: 'Optional dot on an option (success, warning, danger, neutral). Repeated in the trigger.', selector: 'button span[aria-hidden="true"]:not(:has(svg))', fallback: { x: 8, y: 50 } },
    ],
  },
  usage: {
    use: ['Choosing one value from 4 to 15 known options.', 'Statuses and categories with a colored dot.', 'Forms where horizontal space is tight.', 'Filters with a short, fixed set of values.'],
    avoid: [
      { text: 'Two or three options that fit on screen.', instead: { slug: 'radio-group', label: 'RadioGroup' } },
      { text: 'Long lists that people need to search.', instead: { slug: 'combobox', label: 'Combobox' } },
      { text: 'Choosing several values.', instead: { slug: 'multi-select', label: 'MultiSelect' } },
      { text: 'Running actions from a list.', instead: { slug: 'dropdown-menu', label: 'DropdownMenu' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'size', label: 'Size', options: ['sm', 'md', 'lg'] },
      { kind: 'text', key: 'label', label: 'Label', presets: ['Status', 'Plan', 'Region'] },
      { kind: 'toggle', key: 'empty', label: 'No selection' },
      { kind: 'toggle', key: 'isInvalid', label: 'Invalid' },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { size: 'md', label: 'Status', empty: false, isInvalid: false, isDisabled: false },
    render: (p) => <Basic size={p.size as 'md'} label={String(p.label)} empty={Boolean(p.empty)} isInvalid={Boolean(p.isInvalid)} isDisabled={Boolean(p.isDisabled)} error="Pick a status." />,
    code: (p) => `<Select label="${p.label}"${p.size !== 'md' ? ` size="${p.size}"` : ''}${p.isInvalid ? ' isInvalid errorMessage="Pick a status."' : ''}${p.isDisabled ? ' isDisabled' : ''}${p.empty ? '' : ' defaultSelectedKey="paid"'}>\n  <SelectItem id="paid" dot="success">Paid</SelectItem>\n  <SelectItem id="pending" dot="warning">Pending</SelectItem>\n</Select>`,
  },
  states: [
    { name: 'Nothing chosen', description: 'Placeholder in text-placeholder. Use only when no default is right.', Render: () => <Basic empty width={240} /> },
    { name: 'Chosen', description: 'Value and its dot show in the trigger.', Render: () => <Basic width={240} /> },
    { name: 'Disabled', description: 'Dimmed, not-allowed cursor, skipped by Tab.', Render: () => <Basic isDisabled width={240} /> },
    { name: 'Invalid', description: 'error-border plus a message below. Say how to fix it.', Render: () => <Basic isInvalid empty error="Pick a status." width={240} /> },
    { name: 'With description', description: 'Help text under the trigger for rules the label cannot hold.', Render: () => <Basic description="Shown on the invoice." width={240} /> },
    { name: 'Small', description: '32px tall, 8px padding. For toolbars and filters.', Render: () => <Basic size="sm" width={240} /> },
    { name: 'Large', description: '44px tall, 12px padding. Touch-first forms.', Render: () => <Basic size="lg" width={240} /> },
  ],
  sections: [
    {
      type: 'numbered', id: 'cant-decide', title: 'Order and defaults',
      intro: 'A select hides its options until opened, so what people see first matters.',
      items: [
        { title: 'Order sensibly', body: 'Alphabetical for names, logical for stages, most common first for the rest. Never random.' },
        { title: 'Preselect only when it helps', body: 'Default a value when one option fits most people. Otherwise leave it empty and validate on submit.' },
        { title: 'Keep options short', body: 'Under 24 characters so nothing truncates in a 280px field. Put the detail in the description.' },
      ],
    },
    {
      type: 'rules', id: 'rules', title: 'Rules',
      items: [
        { title: 'Four to fifteen options', body: 'Below four use RadioGroup, above fifteen use Combobox.' },
        { title: 'Dots add meaning, not decoration', body: 'Use dots only for status: success, warning, danger, neutral. The text must still stand alone.' },
        { title: 'Match widths to content', body: 'Make the trigger as wide as its longest option, or fill the column in a form.' },
      ],
    },
    {
      type: 'dodont', id: 'do-and-dont', title: 'Do and don’t',
      items: [
        { kind: 'do', caption: 'A visible noun label above the field.', example: () => <Basic width={220} /> },
        { kind: 'dont', caption: 'The placeholder is not a label. It vanishes once a value is chosen.', text: 'Select an option…' },
      ],
    },
    {
      type: 'itemTypes', id: 'sizes', title: 'Sizes', intro: 'Three heights share one anatomy.',
      items: [
        { name: 'sm, 32px', description: 'Toolbars, filters, dense tables.', Render: () => <Basic size="sm" label="Status" width={220} /> },
        { name: 'md, 38px', description: 'The default for forms.', Render: () => <Basic size="md" label="Status" width={220} /> },
        { name: 'lg, 44px', description: 'Mobile forms and hero search.', Render: () => <Basic size="lg" label="Status" width={220} /> },
      ],
    },
  ],
  content: {
    title: 'Content',
    rules: [
      { title: 'Label is a noun', body: 'Status, Region, Plan. No colon, no “Select”.' },
      { title: 'Placeholder is an instruction', body: 'Only when nothing is chosen by default: Choose status.' },
      { title: 'Options are parallel', body: 'All nouns or all adjectives. Paid, Pending, Failed, Draft.' },
      { title: 'Errors say the fix', body: 'Pick a status. Not “Invalid selection”.' },
      { title: 'Description earns its place', body: 'One short sentence about where the value shows up. Skip it if the label is enough.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['Enter'], action: 'Opens the list when the trigger is focused. Selects the highlighted option when open.' },
      { keys: ['Space'], action: 'Opens the list from the trigger.' },
      { keys: ['↓'], action: 'Opens the list, then moves the highlight down.' },
      { keys: ['↑'], action: 'Moves the highlight up.' },
      { keys: ['Home'], action: 'Highlights the first option.' },
      { keys: ['End'], action: 'Highlights the last option.' },
      { keys: ['A–Z'], action: 'Typeahead: jumps to the option starting with the typed letters.' },
      { keys: ['Esc'], action: 'Closes without changing the value and returns focus to the trigger.' },
      { keys: ['Tab'], action: 'Closes the list and moves focus on.' },
    ],
    notes: [
      'Built on React Aria Select: a button with aria-haspopup="listbox" opens a listbox of options.',
      'The label, description and error are linked with aria-labelledby and aria-describedby, so screen readers read them with the value.',
      'Invalid state sets aria-invalid and announces the error message politely.',
      'Status dots are decorative. The option text carries the meaning.',
      'On small screens the list opens as a popover sized to the trigger. Targets are 32px rows; use size lg to reach 44px.',
    ],
    reducedMotion: 'The popover fades in without scale or movement.',
  },
  props: [
    { name: 'label', type: 'ReactNode', description: 'Visible label above the trigger.' },
    { name: 'description', type: 'ReactNode', description: 'Help text under the trigger.' },
    { name: 'errorMessage', type: 'string | (v: ValidationResult) => string', description: 'Shown when isInvalid.' },
    { name: 'placeholder', type: 'string', default: '"Select an option…"', description: 'Shown with no selection.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Control height: 32, 38 and 44px.' },
    { name: 'items', type: 'Iterable<T>', description: 'Dynamic collection. Pass a render function as children.' },
    { name: 'selectedKey', type: 'Key | null', description: 'Controlled selection.' },
    { name: 'defaultSelectedKey', type: 'Key', description: 'Initial selection when uncontrolled.' },
    { name: 'onSelectionChange', type: '(key: Key | null) => void', description: 'Called when the user picks an option.' },
    { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disables the trigger.' },
    { name: 'isInvalid', type: 'boolean', default: 'false', description: 'Marks the field invalid and shows errorMessage.' },
    { name: 'isRequired', type: 'boolean', default: 'false', description: 'Required for form validation.' },
    { name: 'name', type: 'string', description: 'Name for native form submission.' },
    { name: 'disabledKeys', type: 'Iterable<Key>', description: 'Options that cannot be chosen.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the list opens or closes.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'StyleX override for the root.' },
    { name: 'ref', type: 'Ref<HTMLButtonElement>', description: 'Ref to the trigger button.' },
    { name: 'SelectItem: id', type: 'Key', description: 'Required. Unique key of the option.' },
    { name: 'SelectItem: dot', type: "'success' | 'warning' | 'danger' | 'neutral'", description: 'Optional status dot, also shown in the trigger.' },
    { name: 'SelectItem: isDisabled', type: 'boolean', default: 'false', description: 'Disables one option.' },
  ],
  related: ['combobox', 'multi-select', 'radio-group', 'dropdown-menu', 'input'],
};
export default page;
