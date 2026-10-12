import { Badge, Tag, TagGroup } from 'oniva-ui';
import type { DocPage } from '../types';

type V = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
const Demo = (p: { variant?: V; size?: 'sm' | 'md'; shape?: 'pill' | 'square'; dot?: boolean; text?: string }) => (
  <Badge variant={p.variant} size={p.size} shape={p.shape} dot={p.dot}>{p.text ?? 'Shipped'}</Badge>
);

const Compare = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 16px', alignItems: 'center', fontSize: 13 }}>
    <b>Badge</b><span><Badge variant="success" dot>Active</Badge> status of the row, read only</span>
    <b>Tag</b><span><TagGroup aria-label="Labels"><Tag id="a" color="outline">design</Tag></TagGroup></span>
    <b>Chip (Tag, removable)</b><span><TagGroup aria-label="Filters" onRemove={() => {}}><Tag id="a" color="accent">Region: EU</Tag></TagGroup></span>
    <b>Status dot</b><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 9999, background: 'var(--oniva-color-success-solid)' }} />Online (no text chip)</span>
  </div>
);

const page: DocPage = {
  slug: 'badge',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Badge',
  group: ['Components', 'Data display'],
  sourcePath: 'components/Badge',
  lede: 'A compact, read-only label for status and counts. Six semantic variants, an optional dot, never interactive.',
  anatomy: {
    intro: 'Three parts. The pill label is always present; the dot and the square count shape are optional.',
    Render: () => <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Demo variant="success" dot text="Active" /><Demo shape="square" text="12" /></div>,
    parts: [
      { name: 'Badge', description: 'Pill, 24px tall at md (20px at sm), 12px semibold, tabular numerals. Soft tinted background with a matching foreground. Square shape uses a 4px radius.', selector: 'div > span:first-child' },
      { name: 'Dot', description: '6px circle in the solid tone for the variant, 4px from the start edge. Decorative and aria-hidden.', selector: 'div > span:first-child > span[aria-hidden="true"]' },
      { name: 'Square count', description: 'shape="square": 4px radius and 4px side padding, for numbers. Tabular numerals keep widths steady as counts change.', selector: 'div > span:last-child' },
    ],
  },
  usage: {
    use: ['A row status: Paid, Failed, In review.', 'Counts next to a label or tab.', 'A new or beta marker.'],
    avoid: [
      { text: 'Free-form labels users add or remove.', instead: { slug: 'tag', label: 'Tag' } },
      { text: 'Messages that need explanation.', instead: { slug: 'alert', label: 'Alert' } },
      { text: 'Progress or a quantity against a limit.', instead: { slug: 'meter', label: 'Meter' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'select', key: 'variant', label: 'Variant', options: ['neutral', 'accent', 'success', 'warning', 'danger', 'info'] },
      { kind: 'segmented', key: 'size', label: 'Size', options: ['sm', 'md'] },
      { kind: 'segmented', key: 'shape', label: 'Shape', options: ['pill', 'square'] },
      { kind: 'toggle', key: 'dot', label: 'Dot' },
      { kind: 'text', key: 'text', label: 'Text', presets: ['Shipped', 'Delivery failed', '12'] },
    ],
    initial: { variant: 'success', size: 'md', shape: 'pill', dot: false, text: 'Shipped' },
    render: (p) => <Demo variant={p.variant as V} size={p.size as 'sm' | 'md'} shape={p.shape as 'pill' | 'square'} dot={Boolean(p.dot)} text={String(p.text)} />,
    code: (p) => `<Badge${p.variant !== 'neutral' ? ` variant="${p.variant}"` : ''}${p.size !== 'md' ? ` size="${p.size}"` : ''}${p.shape !== 'pill' ? ` shape="${p.shape}"` : ''}${p.dot ? ' dot' : ''}>${p.text}</Badge>`,
  },
  states: [
    { name: 'Neutral and accent', description: 'Default and brand emphasis.', Render: () => <div style={{ display: 'flex', gap: 8 }}><Demo variant="neutral" text="Draft" /><Demo variant="accent" text="New" /></div> },
    { name: 'Success and info', description: 'Completed, informational.', Render: () => <div style={{ display: 'flex', gap: 8 }}><Demo variant="success" text="Shipped" /><Demo variant="info" text="In review" /></div> },
    { name: 'Warning and danger', description: 'Needs attention, failed.', Render: () => <div style={{ display: 'flex', gap: 8 }}><Demo variant="warning" text="Waiting" /><Demo variant="danger" text="Delivery failed" /></div> },
    { name: 'With dot', description: 'Dot reinforces color for quick scanning.', Render: () => <div style={{ display: 'flex', gap: 8 }}><Demo dot variant="success" text="Active" /><Demo dot variant="danger" text="Offline" /></div> },
    { name: 'Small and square', description: '20px tall; square for counts.', Render: () => <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Demo size="sm" text="Small" /><Demo shape="square" text="12" /></div> },
    { name: 'Long text', description: 'No wrapping; the badge grows. Keep to 2 words.', Render: () => <Demo variant="warning" text="Awaiting customer reply" /> },
  ],
  sections: [
    { type: 'custom', id: 'compare', title: 'Badge, Tag, chip or dot', Render: Compare },
    { type: 'rules', id: 'choose', title: 'Which one', items: [
      { title: 'Badge', body: 'The system says something about the row. Read only, semantic color, one per cell.' },
      { title: 'Tag and chip', body: 'The user owns the label. Tags can be selected or removed, with keyboard navigation. A removable tag in a filter bar is a chip.' },
      { title: 'Status dot', body: 'Only when space is tight and the status is also in text nearby, such as a Select option.' },
    ] },
    { type: 'rules', id: 'rules', title: 'Rules', items: [
      { title: 'Color is not the message', body: 'Always put the status in words. Color supports the text, never replaces it.' },
      { title: 'One badge per item', body: 'Two badges in a row compete. Merge states or use a Tag for the second.' },
    ] },
  ],
  content: { rules: [
    { title: 'Length', body: 'One or two words, under 16 characters.' },
    { title: 'Casing', body: 'Sentence case: Delivery failed, not DELIVERY FAILED.' },
    { title: 'Tense', body: 'State, not action: Paid, not Pay.' },
    { title: 'Counts', body: 'Numbers only, tabular. Cap at 99+.' },
  ] },
  accessibility: {
    keyboard: [{ keys: ['None'], action: 'Not focusable.' }],
    notes: ['A plain span with no role; the text is read inline.', 'The dot is aria-hidden. Variants meet text contrast on their tinted background.', 'For live status changes, update the text inside an aria-live region owned by the page.'],
  },
  props: [
    { name: 'variant', type: "'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'", default: "'neutral'", description: 'Semantic color.' },
    { name: 'size', type: "'sm' | 'md'", default: "'md'", description: '20 or 24px tall.' },
    { name: 'shape', type: "'pill' | 'square'", default: "'pill'", description: 'Pill for status, square for counts.' },
    { name: 'dot', type: 'boolean', default: 'false', description: 'Leading 6px dot.' },
    { name: 'children', type: 'ReactNode', description: 'Label.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Style override.' },
  ],
  related: ['tag', 'alert', 'meter', 'data-table'],
};
export default page;
