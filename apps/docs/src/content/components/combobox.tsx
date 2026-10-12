import { Combobox, ComboboxItem } from 'oniva-ui';
import type { DocPage } from '../types';

type P = {
  label?: string;
  description?: string;
  error?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
  value?: string;
  allowsCustomValue?: boolean;
  onSelect?: (k: string) => void;
};

const Basic = (p: P) => (
  <div style={{ width: 300 }}>
    <Combobox
      label={p.label ?? 'Vendor'}
      description={p.description}
      errorMessage={p.error}
      isInvalid={p.isInvalid}
      isDisabled={p.isDisabled}
      size={p.size}
      placeholder={p.placeholder ?? 'Search vendors…'}
      defaultInputValue={p.value}
      allowsCustomValue={p.allowsCustomValue}
      onSelectionChange={(k) => p.onSelect?.(String(k))}
    >
      <ComboboxItem id="aws">Amazon Web Services</ComboboxItem>
      <ComboboxItem id="stripe">Stripe</ComboboxItem>
      <ComboboxItem id="figma">Figma</ComboboxItem>
      <ComboboxItem id="vercel">Vercel</ComboboxItem>
    </Combobox>
  </div>
);

const page: DocPage = {
  slug: 'combobox',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Combobox',
  group: ['Components', 'Forms'],
  sourcePath: 'components/Combobox',
  lede: 'A text field with a filtered list of suggestions beneath it. It handles three moments: before typing, while filtering, and when nothing matches.',
  anatomy: {
    intro: 'Five parts. The label, input and chevron button are always present; the list opens on demand and description and error are optional.',
    Render: () => <Basic description="Shown on the expense report." value="St" />,
    parts: [
      { name: 'Label', description: '14px medium. Names what the user is choosing.', selector: 'label' },
      { name: 'Input', description: 'Editable text field with the standard control chrome: 38px at md (32 sm, 44 lg), 10px radius. Typing filters the list.', selector: 'input' },
      { name: 'Chevron button', description: 'Icon button inside the field that opens the list. Not in the tab order; the input handles keys.', selector: 'button' },
      { name: 'Description', description: '13px muted help text under the field.', selector: '[slot="description"]', fallback: { x: 40, y: 90 } },
      { name: 'Error', description: '13px red text under the description, shown when invalid.', selector: '[slot="errorMessage"]', fallback: { x: 40, y: 95 } },
    ],
  },
  usage: {
    use: ['Choosing one item from a list of 15 or more.', 'Lists the user can recall by name: vendors, accounts, customers.', 'Fields where free text may be allowed alongside suggestions.', 'Options with a status dot that help disambiguate.'],
    avoid: [
      { text: 'Fewer than about 15 options.', instead: { slug: 'select', label: 'Select' } },
      { text: 'Choosing several items.', instead: { slug: 'multi-select', label: 'MultiSelect' } },
      { text: 'Searching the whole app for commands.', instead: { slug: 'command-palette', label: 'CommandPalette' } },
      { text: 'Filtering a visible table.', instead: { slug: 'search-field', label: 'SearchField' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'text', key: 'label', label: 'Label', presets: ['Vendor', 'Account', 'Customer'] },
      { kind: 'segmented', key: 'size', label: 'Size', options: ['sm', 'md', 'lg'] },
      { kind: 'text', key: 'placeholder', label: 'Placeholder', presets: ['Search vendors…', 'Find an account', 'Type a name'] },
      { kind: 'toggle', key: 'allowsCustomValue', label: 'Allow custom value' },
      { kind: 'toggle', key: 'isInvalid', label: 'Invalid' },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { label: 'Vendor', size: 'md', placeholder: 'Search vendors…', allowsCustomValue: false, isInvalid: false, isDisabled: false },
    render: (p, onEvent) => (
      <Basic
        label={String(p.label)}
        size={p.size as 'sm' | 'md' | 'lg'}
        placeholder={String(p.placeholder)}
        allowsCustomValue={Boolean(p.allowsCustomValue)}
        isInvalid={Boolean(p.isInvalid)}
        isDisabled={Boolean(p.isDisabled)}
        error="Choose a vendor from the list."
        onSelect={(k) => onEvent(`onSelectionChange("${k}")`)}
      />
    ),
    code: (p) => `<Combobox label="${p.label}"${p.size !== 'md' ? ` size="${p.size}"` : ''} placeholder="${p.placeholder}"${p.allowsCustomValue ? ' allowsCustomValue' : ''}${p.isInvalid ? ' isInvalid errorMessage="Choose a vendor from the list."' : ''}${p.isDisabled ? ' isDisabled' : ''} onSelectionChange={setVendor}>\n  <ComboboxItem id="aws">Amazon Web Services</ComboboxItem>\n  <ComboboxItem id="stripe">Stripe</ComboboxItem>\n</Combobox>`,
  },
  states: [
    { name: 'Empty', description: 'Placeholder invites a search.', Render: () => <Basic /> },
    { name: 'Filled', description: 'The chosen option text sits in the input.', Render: () => <Basic value="Stripe" /> },
    { name: 'Invalid', description: 'Red border and a message that says what to do.', Render: () => <Basic isInvalid error="Choose a vendor from the list." /> },
    { name: 'Disabled', description: 'Muted, not focusable.', Render: () => <Basic isDisabled value="Stripe" /> },
    { name: 'Status dots', description: 'Dots help tell similar names apart. Text still carries the meaning.', Render: () => (
      <div style={{ width: 300 }}>
        <Combobox label="Account" defaultInputValue="Operating ····4821">
          <ComboboxItem id="op" dot="success">Operating ····4821</ComboboxItem>
          <ComboboxItem id="pay" dot="warning">Payroll ····9034</ComboboxItem>
        </Combobox>
      </div>
    ) },
  ],
  sections: [
    {
      type: 'numbered',
      id: 'validation',
      title: 'Validation',
      intro: 'The risk is a user typing text that matches no option and assuming it was saved.',
      items: [
        { title: 'Decide: closed or open list', body: 'By default only listed options are valid. Set allowsCustomValue only when new entries are legitimate.' },
        { title: 'Require a selection, not text', body: 'On blur with unmatched text, show "Choose a vendor from the list" and keep the text so the user can fix a typo.' },
        { title: 'Validate on blur', body: 'Do not flag while the list is open and the user is filtering.' },
        { title: 'Never clear silently', body: 'If the text is cleared because it matched nothing, tell the user. Silent clearing looks like a bug.' },
        { title: 'Server errors via Form', body: 'Give it a name and pass validationErrors on Form.' },
      ],
    },
    {
      type: 'rules',
      id: 'no-results',
      title: 'No results',
      intro: 'When filtering matches nothing the list shows an empty message instead of closing.',
      items: [
        { title: 'Say what was searched', body: 'No vendors match "stp".' },
        { title: 'Offer the way out', body: 'If custom values are allowed: "Press Enter to add it." Otherwise suggest clearing the text.' },
        { title: 'Keep the list stable', body: 'Do not reorder results while the user types; sort once by relevance.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Label', body: 'A noun: Vendor, Account. Not "Search for a vendor".' },
      { title: 'Placeholder', body: 'Search plus the plural noun: "Search vendors…". Use the ellipsis character.' },
      { title: 'Option text', body: 'The name people type. Put distinguishing detail last: "Operating ····4821".' },
      { title: 'Match', body: 'Filtering is case-insensitive and matches anywhere in the text.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['↓'], action: 'Opens the list and moves to the next option.' },
      { keys: ['↑'], action: 'Moves to the previous option, or opens on the last.' },
      { keys: ['Enter'], action: 'Selects the highlighted option.' },
      { keys: ['Esc'], action: 'Closes the list. A second Esc clears the text.' },
      { keys: ['Tab'], action: 'Commits and moves on.' },
      { keys: ['Type'], action: 'Filters the list.' },
    ],
    notes: [
      'Built on React Aria ComboBox: input with role="combobox", aria-expanded, aria-controls and aria-activedescendant.',
      'Focus stays in the input. The highlighted option is announced via aria-activedescendant.',
      'Screen readers announce the count of results as it changes.',
      'The chevron button is hidden from the tab order but has an accessible name.',
      'The list opens in a popover that flips above when there is no room below.',
    ],
    reducedMotion: 'The popover fades without scale.',
  },
  props: [
    { name: 'label', type: 'ReactNode', description: 'Visible label.' },
    { name: 'description', type: 'ReactNode', description: 'Help text.' },
    { name: 'errorMessage', type: 'string | (v) => string', description: 'Shown when invalid.' },
    { name: 'placeholder', type: 'string', default: "'Search…'", description: 'Shown when empty.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Control height.' },
    { name: 'items', type: 'Iterable<T>', description: 'Dynamic collection; pair with a render function child.' },
    { name: 'selectedKey / defaultSelectedKey', type: 'Key | null', description: 'Controlled or initial selection.' },
    { name: 'onSelectionChange', type: '(key: Key | null) => void', description: 'Fires when an option is chosen.' },
    { name: 'inputValue / defaultInputValue / onInputChange', type: 'string', description: 'Text in the input.' },
    { name: 'allowsCustomValue', type: 'boolean', default: 'false', description: 'Accept text that matches no option.' },
    { name: 'isDisabled / isInvalid / isRequired', type: 'boolean', default: 'false', description: 'States.' },
    { name: 'ComboboxItem: id, dot', type: "string, 'neutral' | 'success' | 'warning' | 'danger'", description: 'Option key and optional status dot.' },
    { name: 'ComboboxSection', type: 'component', description: 'Group options under a heading.' },
  ],
  related: ['select', 'multi-select', 'search-field', 'command-palette', 'input'],
};
export default page;
