import { Mail, Search } from 'lucide-react';
import { Input } from 'oniva-ui';
import type { DocPage } from '../types';

type P = {
  label?: string;
  description?: string;
  error?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
  value?: string;
  prefix?: boolean;
  suffix?: boolean;
  onChange?: (v: string) => void;
};

const Basic = (p: P) => (
  <div style={{ width: 300 }}>
    <Input
      label={p.label ?? 'Work email'}
      description={p.description}
      errorMessage={p.error}
      isInvalid={p.isInvalid}
      isDisabled={p.isDisabled}
      isReadOnly={p.isReadOnly}
      size={p.size}
      placeholder={p.placeholder ?? 'you@company.com'}
      defaultValue={p.value}
      prefix={p.prefix ? <Mail size={16} /> : undefined}
      suffix={p.suffix ? <kbd>⌘K</kbd> : undefined}
      onChange={p.onChange}
    />
  </div>
);

const page: DocPage = {
  slug: 'input',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Input',
  group: ['Components', 'Forms'],
  sourcePath: 'components/Input',
  lede: 'A single-line text field with a label, help text and inline validation. It handles four moments: before typing, while typing, when the value is wrong, and when the field is locked.',
  anatomy: {
    intro: 'Six parts. The label and field are always present. Prefix, suffix, description and error are optional; the error sits below the description.',
    Render: () => <Basic label="Work email" prefix suffix description="We send invoices here." value="priya@acme" />,
    parts: [
      { name: 'Label', description: '14px medium, text color. Always visible and linked to the input. Never replace it with a placeholder.', selector: 'label' },
      { name: 'Field', description: '38px tall at md (32 sm, 44 lg), 10px radius, 1px border, 10px horizontal padding. Border darkens on hover; a 2px focus ring sits 1px outside.', selector: 'div:has(> input)' },
      { name: 'Prefix', description: 'Leading icon or text, 16px, muted color, aria-hidden. Use it for meaning the label already carries.', selector: 'div:has(> input) > span:first-child' },
      { name: 'Input', description: '14px regular, 20px line height, transparent background. Placeholder uses the placeholder token, not the muted text token.', selector: 'input' },
      { name: 'Suffix', description: 'Trailing icon, unit or shortcut hint, muted color. Not hidden from assistive tech, so give buttons a label.', selector: 'div:has(> input) > span:last-child' },
      { name: 'Description', description: 'Help text, 13px muted, linked with aria-describedby. Keep it to one line.', selector: '[slot="description"]', fallback: { x: 40, y: 88 } },
    ],
  },
  usage: {
    use: ['Short free text: names, emails, titles, IDs.', 'A value with a leading icon or trailing unit.', 'Any field inside a Form that needs native or server validation.', 'Search-like entry that needs no clear button (otherwise see SearchField).'],
    avoid: [
      { text: 'Several lines of text.', instead: { slug: 'textarea', label: 'Textarea' } },
      { text: 'Numbers that need steppers, min/max or locale formatting.', instead: { slug: 'number-field', label: 'NumberField' } },
      { text: 'Typing to filter a long list of options.', instead: { slug: 'combobox', label: 'Combobox' } },
      { text: 'A fixed prefix such as https:// or a currency attached to the field.', instead: { slug: 'input-group', label: 'InputGroup' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'text', key: 'label', label: 'Label', presets: ['Work email', 'Full name', 'Tax ID'] },
      { kind: 'segmented', key: 'size', label: 'Size', options: ['sm', 'md', 'lg'] },
      { kind: 'text', key: 'placeholder', label: 'Placeholder', presets: ['you@company.com', 'Priya Raman', '12-3456789'] },
      { kind: 'toggle', key: 'prefix', label: 'Prefix icon' },
      { kind: 'toggle', key: 'suffix', label: 'Suffix' },
      { kind: 'toggle', key: 'isInvalid', label: 'Invalid' },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { label: 'Work email', size: 'md', placeholder: 'you@company.com', prefix: true, suffix: false, isInvalid: false, isDisabled: false },
    render: (p, onEvent) => (
      <Basic
        label={String(p.label)}
        size={p.size as 'sm' | 'md' | 'lg'}
        placeholder={String(p.placeholder)}
        prefix={Boolean(p.prefix)}
        suffix={Boolean(p.suffix)}
        isInvalid={Boolean(p.isInvalid)}
        isDisabled={Boolean(p.isDisabled)}
        error="Enter an email like name@company.com."
        onChange={(v) => onEvent(`onChange("${v}")`)}
      />
    ),
    code: (p) =>
      `<Input label="${p.label}"${p.size !== 'md' ? ` size="${p.size}"` : ''} placeholder="${p.placeholder}"${p.prefix ? ' prefix={<Mail size={16} />}' : ''}${p.suffix ? ' suffix={<kbd>⌘K</kbd>}' : ''}${p.isInvalid ? ' isInvalid errorMessage="Enter an email like name@company.com."' : ''}${p.isDisabled ? ' isDisabled' : ''} onChange={setEmail} />`,
  },
  states: [
    { name: 'Empty', description: 'Placeholder shows an example, not an instruction.', Render: () => <Basic /> },
    { name: 'Filled', description: 'Value in text color, description below.', Render: () => <Basic value="priya@acme.co" description="We send invoices here." /> },
    { name: 'Invalid', description: 'Red border, tinted background and a message that says how to fix it. The field shakes once.', Render: () => <Basic value="priya@acme" isInvalid error="Add the domain ending, like acme.co." /> },
    { name: 'Disabled', description: 'Muted surface, no shadow, not focusable, cursor not-allowed.', Render: () => <Basic value="priya@acme.co" isDisabled /> },
    { name: 'Read only', description: 'Focusable and selectable, but cannot be edited. Use for values the user may need to copy.', Render: () => <Basic value="priya@acme.co" isReadOnly /> },
    { name: 'Long value', description: 'Text scrolls inside the field. The field never grows.', Render: () => <Basic value="priya.raman.accounts-payable@acme-finance-group.example.com" /> },
    { name: 'Sizes', description: 'sm 32px, md 38px, lg 44px. Match the neighbouring button height.', Render: () => (
      <div style={{ display: 'grid', gap: 12, width: 300 }}>
        <Input size="sm" aria-label="Small" placeholder="Small, 32px" />
        <Input size="md" aria-label="Medium" placeholder="Medium, 38px" />
        <Input size="lg" aria-label="Large" placeholder="Large, 44px" />
      </div>
    ) },
  ],
  sections: [
    {
      type: 'numbered',
      id: 'validation',
      title: 'Validation',
      intro: 'Five rules for when and how an input tells the user it is wrong.',
      items: [
        { title: 'Validate on blur, then on change', body: 'Do not show an error while the user is still typing the first time. After the first blur, re-check on every change so the error clears the moment it is fixed.' },
        { title: 'Say how to fix it', body: 'Write "Add the domain ending, like acme.co", not "Invalid email". One sentence, under 80 characters, no blame.' },
        { title: 'Prefer native rules', body: 'Set isRequired, type, pattern, minLength. The browser and React Aria produce the invalid state and the message hook for free.' },
        { title: 'Server errors go through Form', body: 'Pass validationErrors={{ email: "..." }} on Form and give the input a name. The error appears on that field and clears on the next edit.' },
        { title: 'Never rely on color alone', body: 'The error text is the signal. The red border is reinforcement and must still pass 3:1 against the surface.' },
      ],
    },
    {
      type: 'dodont',
      id: 'adornments',
      title: 'Adornments',
      items: [
        { kind: 'do', caption: 'Use an icon that reinforces the label.', example: () => <Basic label="Work email" prefix placeholder="you@company.com" /> },
        { kind: 'dont', caption: 'Do not use a prefix instead of a label. Sighted users lose the name once they type.', example: () => <Input aria-label="Email" prefix={<Search size={16} />} placeholder="Email" /> },
      ],
    },
    {
      type: 'rules',
      id: 'recipes',
      title: 'Composition',
      items: [
        { title: 'Inside Form', body: 'Wrap fields in Form for native validation, server errors and a 16px vertical rhythm.' },
        { title: 'Inside Fieldset', body: 'Group related fields such as an address under one legend.' },
        { title: 'With a button', body: 'For a field plus action, use InputGroup so the button joins the border. Keep both at the same size.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Labels', body: 'A noun in sentence case: Work email, Full name. No colon, no "Enter your".' },
      { title: 'Placeholder', body: 'An example value, never the label. Disappears on typing, so it cannot carry required information.' },
      { title: 'Description', body: 'Why we ask or the format: "We send invoices here." One line.' },
      { title: 'Error', body: 'What to do, in the imperative: "Add the domain ending." Do not start with "Error:" or "Invalid".' },
      { title: 'Optional fields', body: 'Mark the exception. Say "(optional)" in the label when most fields are required.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['Tab', 'Shift+Tab'], action: 'Moves focus into and out of the field.' },
      { keys: ['Type'], action: 'Enters text. Validation runs on blur by default.' },
      { keys: ['Enter'], action: 'Submits the enclosing form.' },
      { keys: ['Esc'], action: 'Does nothing here. Use SearchField for clear-on-Esc.' },
    ],
    notes: [
      'Built on React Aria TextField: a native input with a linked label, description and error.',
      'aria-describedby points to the description and the error. aria-invalid is set when invalid.',
      'Screen readers announce: label, "edit text", value, "invalid entry", then the error message.',
      'Focus shows a 2px ring with 1px offset in the focus-ring color, visible on keyboard and pointer focus.',
      'The prefix is aria-hidden. The suffix is not, so buttons inside it need an accessible name.',
      'The field is 32px at sm. Pair it with a larger hit area on touch screens, or use md or lg.',
    ],
    reducedMotion: 'The invalid shake is skipped and border color changes are instant (0.01ms).',
  },
  props: [
    { name: 'label', type: 'ReactNode', description: 'Visible label. Omit only with aria-label.' },
    { name: 'description', type: 'ReactNode', description: 'Help text under the field.' },
    { name: 'errorMessage', type: 'string | (v: ValidationResult) => string', description: 'Shown when invalid, from props or native validation.' },
    { name: 'placeholder', type: 'string', description: 'Example value shown when empty.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Field height: 32, 38 or 44px.' },
    { name: 'prefix', type: 'ReactNode', description: 'Leading adornment. Decorative, aria-hidden.' },
    { name: 'suffix', type: 'ReactNode', description: 'Trailing adornment: icon, unit or button.' },
    { name: 'value / defaultValue', type: 'string', description: 'Controlled or initial value.' },
    { name: 'onChange', type: '(value: string) => void', description: 'Fires on every edit.' },
    { name: 'type', type: "'text' | 'email' | 'password' | 'search' | 'tel' | 'url'", default: "'text'", description: 'Native input type.' },
    { name: 'isRequired / isInvalid / isDisabled / isReadOnly', type: 'boolean', default: 'false', description: 'States. isRequired adds native required validation.' },
    { name: 'validate', type: '(v: string) => string | string[] | null', description: 'Custom validation. Return a message to mark invalid.' },
    { name: 'validationBehavior', type: "'native' | 'aria'", default: "'native'", description: 'Native blocks form submit; aria validates live.' },
    { name: 'name, autoComplete, maxLength, minLength, pattern', type: 'string | number', description: 'Passed to the native input.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Escape hatch for root styles.' },
    { name: 'ref', type: 'Ref<HTMLInputElement>', description: 'Forwarded to the input element.' },
  ],
  related: ['textarea', 'input-group', 'number-field', 'search-field', 'form'],
};
export default page;
