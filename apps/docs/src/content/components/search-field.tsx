import { SearchField } from 'oniva-ui';
import type { DocPage } from '../types';

type P = {
  size?: 'sm' | 'md' | 'lg';
  value?: string;
  shortcut?: string | null;
  placeholder?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
  onSubmit?: (v: string) => void;
  onChange?: (v: string) => void;
};

const Basic = (p: P) => (
  <div style={{ width: 320 }}>
    <SearchField
      aria-label="Search"
      size={p.size}
      defaultValue={p.value}
      shortcut={p.shortcut === undefined ? '/' : p.shortcut}
      placeholder={p.placeholder ?? 'Search customers, invoices…'}
      isDisabled={p.isDisabled}
      isInvalid={p.isInvalid}
      errorMessage={p.isInvalid ? 'Enter at least 2 characters.' : undefined}
      onSubmit={p.onSubmit}
      onChange={p.onChange}
    />
  </div>
);

const page: DocPage = {
  slug: 'search-field',
  status: 'Stable',
  version: '0.1.0',
  importName: 'SearchField',
  group: ['Components', 'Forms'],
  sourcePath: 'components/SearchField',
  lede: 'A text field for filtering or finding things, with a clear button and a shortcut hint. It handles three moments: empty, typing, and cleared.',
  anatomy: {
    intro: 'Four parts. The icon and input are always present. The shortcut hint shows only while empty and the clear button only once there is text.',
    Render: () => <Basic />,
    parts: [
      { name: 'Search icon', description: '16px magnifier, muted, decorative.', selector: 'svg' },
      { name: 'Input', description: 'type="search", 14px, 20px line height. Field is 38px at md (32 sm, 44 lg), 10px radius.', selector: 'input' },
      { name: 'Shortcut hint', description: '12px pill with a 2px by 8px padding. Shown while empty; pass null to hide it.', selector: 'kbd, [class*="shortcut"]', fallback: { x: 90, y: 50 } },
      { name: 'Clear button', description: 'Appears once there is text. Clears the value and returns focus to the input.', selector: 'button', fallback: { x: 92, y: 50 } },
    ],
  },
  usage: {
    use: ['Filtering a table, list or grid in place.', 'Finding a record by name or ID.', 'Fields that benefit from a "/" or ⌘K hint.', 'Searches submitted with Enter.'],
    avoid: [
      { text: 'Picking one value from a long list.', instead: { slug: 'combobox', label: 'Combobox' } },
      { text: 'Ordinary data entry.', instead: { slug: 'input', label: 'Input' } },
      { text: 'Jumping to any command or page.', instead: { slug: 'command-palette', label: 'CommandPalette' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'size', label: 'Size', options: ['sm', 'md', 'lg'] },
      { kind: 'text', key: 'placeholder', label: 'Placeholder', presets: ['Search customers, invoices…', 'Search vendors…', 'Find a transaction…'] },
      { kind: 'text', key: 'value', label: 'Value', presets: ['', 'Acme Corp'] },
      { kind: 'toggle', key: 'showShortcut', label: 'Shortcut hint' },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { size: 'md', placeholder: 'Search customers, invoices…', value: '', showShortcut: true, isDisabled: false },
    render: (p, onEvent) => (
      <Basic key={String(p.value)} size={p.size as 'sm' | 'md' | 'lg'} placeholder={String(p.placeholder)} value={String(p.value)} shortcut={p.showShortcut ? '/' : null} isDisabled={Boolean(p.isDisabled)} onSubmit={(v) => onEvent(`onSubmit("${v}")`)} onChange={(v) => onEvent(`onChange("${v}")`)} />
    ),
    code: (p) => `<SearchField aria-label="Search"${p.size !== 'md' ? ` size="${p.size}"` : ''} placeholder="${p.placeholder}"${p.showShortcut ? '' : ' shortcut={null}'}${p.isDisabled ? ' isDisabled' : ''} onSubmit={runSearch} />`,
  },
  states: [
    { name: 'Empty', description: 'Placeholder and the shortcut hint.', Render: () => <Basic /> },
    { name: 'With text', description: 'Hint replaced by the clear button.', Render: () => <Basic value="Acme Corp" /> },
    { name: 'Small', description: '32px, for toolbars.', Render: () => <Basic size="sm" shortcut={null} value="Acme" /> },
    { name: 'Invalid', description: 'Rare. Use only for queries that cannot run.', Render: () => <Basic value="a" isInvalid /> },
    { name: 'Disabled', description: 'Muted, no clear button.', Render: () => <Basic isDisabled /> },
  ],
  sections: [
    {
      type: 'numbered',
      id: 'validation',
      title: 'Validation',
      intro: 'Search should rarely fail. Most "validation" is how you handle odd queries.',
      items: [
        { title: 'Do not validate while typing', body: 'Let any query run. A search with no results is an empty state, not an error.' },
        { title: 'Set a minimum only for cost', body: 'If search hits a paid or slow API, require 2 characters and say so in the description.' },
        { title: 'Trim before sending', body: 'Strip leading and trailing space. Treat an all-space query as empty.' },
        { title: 'Debounce', body: 'Wait 200 to 300ms after the last keystroke before filtering live; submit on Enter immediately.' },
      ],
    },
    {
      type: 'rules',
      id: 'empty',
      title: 'Empty results',
      items: [
        { title: 'Echo the query', body: 'No customers match "Acm".' },
        { title: 'Offer a next step', body: 'Suggest clearing filters or checking spelling.' },
        { title: 'Keep the field filled', body: 'Never clear what the user typed when there are no results.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Placeholder', body: 'Search plus what can be found: "Search customers, invoices…".' },
      { title: 'Accessible name', body: 'Always give aria-label ("Search") when there is no visible label.' },
      { title: 'Shortcut', body: 'Only advertise a shortcut you actually bind, such as "/".' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['Type'], action: 'Updates the value; onChange fires.' },
      { keys: ['Enter'], action: 'Fires onSubmit.' },
      { keys: ['Esc'], action: 'Clears the field. Fires onClear.' },
      { keys: ['Tab'], action: 'Moves on. The clear button is not a tab stop; Esc replaces it.' },
    ],
    notes: [
      'Built on React Aria SearchField: input type="search" with a clear button named "Clear search".',
      'Screen readers announce "search" and the label. Provide aria-label when no label is shown.',
      'The icon and shortcut hint are decorative.',
      'Focus ring is 2px, same as Input.',
    ],
    reducedMotion: 'Border transitions are instant.',
  },
  props: [
    { name: 'label / aria-label', type: 'ReactNode / string', description: 'Visible or accessible name.' },
    { name: 'description', type: 'ReactNode', description: 'Help text.' },
    { name: 'errorMessage', type: 'string | (v) => string', description: 'Shown when invalid.' },
    { name: 'placeholder', type: 'string', description: 'Hint text when empty.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height 32, 38 or 44px.' },
    { name: 'shortcut', type: 'ReactNode | null', description: 'Hint badge while empty. null hides it.' },
    { name: 'value / defaultValue', type: 'string', description: 'Controlled or initial text.' },
    { name: 'onChange / onSubmit / onClear', type: 'callbacks', description: 'Edit, Enter, and clear events.' },
    { name: 'isDisabled / isReadOnly', type: 'boolean', default: 'false', description: 'States.' },
    { name: 'autoFocus', type: 'boolean', default: 'false', description: 'Focus on mount.' },
  ],
  related: ['input', 'combobox', 'command-palette', 'filter-bar'],
};
export default page;
