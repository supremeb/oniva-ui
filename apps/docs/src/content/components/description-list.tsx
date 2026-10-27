import { CalendarDays, CreditCard, Mail, User } from 'lucide-react';
import { DescriptionItem, DescriptionList } from 'oniva-ui';
import type { DocPage } from '../types';

const Demo = (p: { columns?: 1 | 2; icons?: boolean; title?: string; empty?: boolean; long?: boolean }) => (
  <div style={{ width: p.columns === 2 ? 560 : 320 }}>
    <DescriptionList title={p.title} columns={p.columns}>
      <DescriptionItem label="Customer" icon={p.icons ? <User size={16} /> : undefined}>Ada Lovelace</DescriptionItem>
      <DescriptionItem label="Email" icon={p.icons ? <Mail size={16} /> : undefined}>{p.long ? 'ada.lovelace@analytical-engine-research-institute.example.com' : 'ada@example.com'}</DescriptionItem>
      <DescriptionItem label="Plan" icon={p.icons ? <CreditCard size={16} /> : undefined}>Scale, billed yearly</DescriptionItem>
      <DescriptionItem label="Renews" icon={p.icons ? <CalendarDays size={16} /> : undefined}>{p.empty ? 'Not set' : 'Oct 28, 2026'}</DescriptionItem>
    </DescriptionList>
  </div>
);

const page: DocPage = {
  slug: 'description-list',
  status: 'Stable',
  version: '0.1.0',
  importName: 'DescriptionList',
  group: ['Components', 'Data display'],
  sourcePath: 'components/DescriptionList',
  lede: 'Key and value pairs for one record, as white tiles on an inset card. Semantic dl, dt and dd under the hood.',
  anatomy: {
    intro: 'Six parts. The card, tiles, terms and values are always present; the title and icons are optional.',
    Render: () => <Demo title="Subscription" icons />,
    parts: [
      { name: 'Card', description: 'Inset surface, 16px radius, 1px border, 8px padding and 8px gap.', selector: 'div[style] > div' },
      { name: 'Title', description: 'Optional h3. 14px medium, muted, 8px side padding.', selector: 'h3' },
      { name: 'Tile', description: 'White inner surface, 10px radius, 1px border, no shadow. Minimum 56px tall, 12px side padding and 10px block padding.', selector: 'dl > div:first-child' },
      { name: 'Icon', description: 'Optional 32px square with 8px radius on the inset surface; spans both lines. Decorative.', selector: 'dl > div:first-child > span[aria-hidden="true"]', fallback: { x: 8, y: 30 } },
      { name: 'Term', description: '12px medium muted label (dt), 2px above the value.', selector: 'dl > div:first-child dt' },
      { name: 'Value', description: '14px medium (dd) with tabular numerals. Wraps instead of truncating.', selector: 'dl > div:first-child dd' },
    ],
  },
  usage: {
    use: ['Details of one record: customer, order, device.', 'Summary panels beside a table or in a Drawer.', 'Read-only settings review before confirming.'],
    avoid: [
      { text: 'Many records compared side by side.', instead: { slug: 'table', label: 'Table' } },
      { text: 'Editable fields.', instead: { slug: 'input', label: 'Input' } },
      { text: 'Headline numbers with trends.', instead: { slug: 'kpi-strip', label: 'KpiStrip' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'columns', label: 'Columns', options: ['1', '2'] },
      { kind: 'toggle', key: 'icons', label: 'Icons' },
      { kind: 'text', key: 'title', label: 'Title', presets: ['Subscription', 'Order details', ''] },
    ],
    initial: { columns: '1', icons: false, title: 'Subscription' },
    render: (p) => <Demo columns={p.columns === '2' ? 2 : 1} icons={Boolean(p.icons)} title={String(p.title) || undefined} />,
    code: (p) => `<DescriptionList${p.title ? ` title="${p.title}"` : ''}${p.columns === '2' ? ' columns={2}' : ''}>\n  <DescriptionItem label="Customer"${p.icons ? ' icon={<User size={16} />}' : ''}>Ada Lovelace</DescriptionItem>\n  <DescriptionItem label="Plan">Scale, billed yearly</DescriptionItem>\n</DescriptionList>`,
  },
  states: [
    { name: 'One column', description: 'The default; best in narrow panels.', Render: () => <Demo title="Subscription" /> },
    { name: 'Two columns', description: 'Tiles flow in two equal columns.', Render: () => <Demo columns={2} title="Subscription" /> },
    { name: 'With icons', description: 'Leading 32px icon squares.', Render: () => <Demo icons /> },
    { name: 'Empty value', description: 'Write "Not set", never leave the value blank.', Render: () => <Demo empty /> },
    { name: 'Long value', description: 'Long values wrap onto more lines.', Render: () => <Demo long /> },
  ],
  sections: [
    { type: 'rules', id: 'rules', title: 'Rules', items: [
      { title: 'Order by importance', body: 'Identity first, then state, then dates. Group related pairs together.' },
      { title: 'Max 8 tiles', body: 'Beyond that, split into two lists with titles or use a Table.' },
      { title: 'Format values', body: 'Dates, money and numbers use the user locale; IDs use a monospace-free plain style.' },
    ] },
    { type: 'rules', id: 'recipes', title: 'Composition', items: [
      { title: 'With Badge', body: 'Put a Badge in a value for status. Keep one per tile.' },
      { title: 'In a Drawer', body: 'Open a record\'s DescriptionList from a Table row action.' },
    ] },
  ],
  content: { rules: [
    { title: 'Terms', body: 'Nouns, 1 to 2 words, no colon: Renews, not Renews:.' },
    { title: 'Empty values', body: '"Not set" or a dash with an sr-only label; never blank.' },
    { title: 'Casing', body: 'Sentence case for terms and values.' },
  ] },
  accessibility: {
    keyboard: [{ keys: ['None'], action: 'Static content, not focusable.' }],
    notes: ['Native dl with dt and dd, wrapped in a div per pair (valid HTML), so screen readers announce "term, value" lists.', 'Icons are aria-hidden.', 'The optional title is an h3; choose the surrounding structure accordingly.'],
  },
  props: [
    { name: 'title', type: 'ReactNode', description: 'Heading above the tiles.' },
    { name: 'columns', type: '1 | 2', default: '1', description: 'Tile columns.' },
    { name: 'children', type: 'ReactNode', description: 'DescriptionItem elements.' },
    { name: 'DescriptionItem.label', type: 'ReactNode', description: 'The term.' },
    { name: 'DescriptionItem.icon', type: 'ReactNode', description: 'Leading icon in a 32px square.' },
    { name: 'DescriptionItem.children', type: 'ReactNode', description: 'The value.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Style override.' },
  ],
  related: ['table', 'kpi-strip', 'list', 'badge'],
};
export default page;
