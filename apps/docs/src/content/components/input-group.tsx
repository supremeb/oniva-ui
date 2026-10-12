import { InputGroup } from 'oniva-ui';
import { Mail } from 'lucide-react';
import type { DocPage } from '../types';

type P = { start?: boolean; end?: boolean; isInvalid?: boolean; isDisabled?: boolean; size?: 'sm' | 'md' | 'lg'; value?: string; label?: string; icon?: boolean; onChange?: (v: string) => void };

const Basic = (p: P) => (
  <div style={{ width: 320 }}>
    <InputGroup
      label={p.label ?? 'Website'}
      size={p.size}
      startAddon={p.icon ? <Mail size={16} /> : p.start === false ? undefined : 'https://'}
      endAddon={p.end === false ? undefined : '.com'}
      defaultValue={p.value}
      placeholder="acme"
      isInvalid={p.isInvalid}
      errorMessage={p.isInvalid ? 'Enter the domain without https://.' : undefined}
      isDisabled={p.isDisabled}
      onChange={p.onChange}
    />
  </div>
);

const page: DocPage = {
  slug: 'input-group',
  status: 'Stable',
  version: '0.1.0',
  importName: 'InputGroup',
  group: ['Components', 'Forms'],
  sourcePath: 'components/InputGroup',
  lede: 'An input with attached segments before and after it: protocols, currencies, units or a button. Use it when the extra text is part of the value but not typed.',
  anatomy: {
    intro: 'Five parts. The label, input and shared border are always present. Start and end addons are optional; use one or both.',
    Render: () => <Basic value="acme" />,
    parts: [
      { name: 'Label', description: '14px medium.', selector: 'label' },
      { name: 'Start addon', description: 'Attached segment with muted surface and a divider. Text, icon, select or button.', selector: 'div:has(> input) > div:first-child' },
      { name: 'Input', description: '14px, fills the remaining width. The group draws one 1px border and 10px radius around all three.', selector: 'input' },
      { name: 'End addon', description: 'Attached suffix such as .com or USD. Same surface as the start addon.', selector: 'div:has(> input) > div:last-child' },
    ],
  },
  usage: {
    use: ['A fixed prefix: https://, @, $.', 'Units or domains after the value: .com, USD, kg.', 'A field attached to a select, such as country code.', 'A field with an inline action button.'],
    avoid: [
      { text: 'A decorative icon only.', instead: { slug: 'input', label: 'Input with prefix' } },
      { text: 'Formatted numbers.', instead: { slug: 'number-field', label: 'NumberField' } },
      { text: 'Search with clear.', instead: { slug: 'search-field', label: 'SearchField' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'text', key: 'label', label: 'Label', presets: ['Website', 'Amount', 'Weight'] },
      { kind: 'segmented', key: 'size', label: 'Size', options: ['sm', 'md', 'lg'] },
      { kind: 'toggle', key: 'start', label: 'Start addon' },
      { kind: 'toggle', key: 'end', label: 'End addon' },
      { kind: 'toggle', key: 'isInvalid', label: 'Invalid' },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { label: 'Website', size: 'md', start: true, end: true, isInvalid: false, isDisabled: false },
    render: (p, onEvent) => (
      <Basic label={String(p.label)} size={p.size as 'sm' | 'md' | 'lg'} start={Boolean(p.start)} end={Boolean(p.end)} isInvalid={Boolean(p.isInvalid)} isDisabled={Boolean(p.isDisabled)} onChange={(v) => onEvent(`onChange("${v}")`)} />
    ),
    code: (p) => `<InputGroup label="${p.label}"${p.size !== 'md' ? ` size="${p.size}"` : ''}${p.start ? ' startAddon="https://"' : ''}${p.end ? ' endAddon=".com"' : ''} placeholder="acme"${p.isInvalid ? ' isInvalid errorMessage="Enter the domain without https://."' : ''}${p.isDisabled ? ' isDisabled' : ''} onChange={setDomain} />`,
  },
  states: [
    { name: 'Both addons', description: 'Prefix and suffix around the value.', Render: () => <Basic value="acme" /> },
    { name: 'Start only', description: 'Currency or protocol.', Render: () => <Basic end={false} label="Amount" /> },
    { name: 'Icon addon', description: 'Icon in the start segment.', Render: () => <Basic icon end={false} label="Billing email" /> },
    { name: 'Invalid', description: 'Whole group turns red.', Render: () => <Basic value="https://acme" isInvalid /> },
    { name: 'Disabled', description: 'Muted group, addons included.', Render: () => <Basic isDisabled value="acme" /> },
  ],
  sections: [
    {
      type: 'numbered',
      id: 'validation',
      title: 'Validation',
      intro: 'The addon is part of the value, so validate the combined result.',
      items: [
        { title: 'Validate the whole value', body: 'Check "https://" + input + ".com" together, not the input alone.' },
        { title: 'Strip what the addon supplies', body: 'If a user pastes https://acme.com, remove the protocol and suffix instead of showing an error when you can.' },
        { title: 'Say what is expected', body: '"Enter the domain without https://." Name the part to remove.' },
        { title: 'Error covers the group', body: 'One red border and one message below, never one per segment.' },
      ],
    },
    {
      type: 'rules',
      id: 'recipes',
      title: 'Composition',
      items: [
        { title: 'With a Select', body: 'Place a country code Select in the start addon for phone fields.' },
        { title: 'With a Button', body: 'Put a quiet Button in the end addon: Copy, Apply. Match the group height.' },
        { title: 'Keep addons short', body: 'Under 8 characters so the input keeps at least half the width.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Addon text', body: 'The literal characters: https://, USD. No labels like "Enter".' },
      { title: 'Label', body: 'Names the whole value, not the addon: Website.' },
      { title: 'Placeholder', body: 'The editable part only: acme.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['Tab', 'Shift+Tab'], action: 'Input first; interactive addons (select, button) are separate tab stops in order.' },
      { keys: ['Type'], action: 'Edits the input segment.' },
    ],
    notes: [
      'Built on React Aria TextField. The input has the accessible name; text addons are not read as part of it.',
      'Add the addon meaning to the description if it matters, such as "Amount in USD".',
      'Interactive addons need their own accessible names.',
      'Focus ring wraps the whole group.',
    ],
    reducedMotion: 'Border and ring transitions are instant.',
  },
  props: [
    { name: 'label / description / errorMessage', type: 'ReactNode', description: 'Standard field text.' },
    { name: 'startAddon', type: 'ReactNode', description: 'Attached segment before the input.' },
    { name: 'endAddon', type: 'ReactNode', description: 'Attached segment after the input.' },
    { name: 'placeholder', type: 'string', description: 'Example of the editable part.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height 32, 38 or 44px.' },
    { name: 'value / defaultValue / onChange', type: 'string', description: 'Standard text field value.' },
    { name: 'isDisabled / isReadOnly / isRequired / isInvalid', type: 'boolean', default: 'false', description: 'States.' },
    { name: 'ref', type: 'Ref<HTMLInputElement>', description: 'Forwarded to the input.' },
  ],
  related: ['input', 'number-field', 'search-field', 'select'],
};
export default page;
