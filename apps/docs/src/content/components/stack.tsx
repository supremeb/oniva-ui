import { Stack } from 'oniva-ui';
import type { DocPage } from '../types';

const Item = ({ label, w }: { label: string; w?: number }) => <div style={{ alignItems: 'center', background: 'var(--oniva-color-accent-soft)', borderRadius: 8, color: 'var(--oniva-color-accent-soft-fg)', display: 'flex', fontSize: 12, height: 36, justifyContent: 'center', width: w }}>{label}</div>;
const Demo = ({ horizontal = false, gap = 12, align }: { horizontal?: boolean; gap?: number; align?: string }) => (
  <div style={{ border: '1px dashed var(--oniva-color-border-hover)', borderRadius: 12, padding: 8, width: horizontal ? 360 : 200 }}>
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    <Stack data-part="stack" horizontal={horizontal} gap={gap as any} align={align as any}>
      <Item label="Title" w={horizontal ? 80 : undefined} /><Item label="Description" w={horizontal ? 100 : undefined} /><Item label="Actions" w={horizontal ? 80 : undefined} />
    </Stack>
  </div>
);

const page: DocPage = {
  slug: 'stack',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Stack',
  group: ['Components', 'Layout'],
  sourcePath: 'components/Stack',
  lede: 'Vertical rhythm in one line. A Flex column with a 12px default gap; add horizontal to lay it out as a row.',
  anatomy: {
    intro: 'Two parts. The container and the gap between children.',
    Render: () => <Demo />,
    parts: [
      { name: 'Container', description: 'Flex column (row when horizontal). No wrap, no inline mode.', selector: '[data-part="stack"]' },
      { name: 'Gap', description: '12px by default, any step of the space scale. Applied between children only.', selector: '[data-part="stack"] > :nth-child(2)' },
    ],
  },
  usage: {
    use: ['Vertical lists of fields, paragraphs or cards.', 'Page sections separated by consistent space.', 'Short horizontal runs where wrapping is not wanted.'],
    avoid: [
      { text: 'Wrapping or inline layouts.', instead: { slug: 'flex', label: 'Flex' } },
      { text: 'Equal-width columns.', instead: { slug: 'grid', label: 'Grid' } },
      { text: 'Visible dividers between items.', instead: { slug: 'separator', label: 'Separator' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'toggle', key: 'horizontal', label: 'Horizontal' },
      { kind: 'select', key: 'gap', label: 'Gap', options: ['4', '8', '12', '16', '24', '32'] },
      { kind: 'select', key: 'align', label: 'Align', options: ['stretch', 'start', 'center', 'end'] },
    ],
    initial: { horizontal: false, gap: '12', align: 'stretch' },
    render: (p) => <Demo horizontal={Boolean(p.horizontal)} gap={Number(p.gap)} align={String(p.align)} />,
    code: (p) => `<Stack${p.horizontal ? ' horizontal' : ''}${Number(p.gap) !== 12 ? ` gap={${p.gap}}` : ''}${p.align !== 'stretch' ? ` align="${p.align}"` : ''}>\n  …\n</Stack>`,
  },
  states: [
    { name: 'Default', description: '12px gap, children stretch.', Render: () => <Demo /> },
    { name: 'Tight', description: 'gap 4 for label and hint pairs.', Render: () => <Demo gap={4} /> },
    { name: 'Loose', description: 'gap 32 between page sections.', Render: () => <Demo gap={32} /> },
    { name: 'Horizontal', description: 'A row with the same gap.', Render: () => <Demo horizontal /> },
    { name: 'Centered', description: 'align="center" shrinks children to content.', Render: () => <Demo align="center" /> },
  ],
  sections: [
    { type: 'rules', id: 'stack-recipes', title: 'Composition recipes', items: [{ title: 'Form', body: 'Stack gap={16} of Fields, then a horizontal Stack for the actions.' }, { title: 'Page', body: 'Stack gap={32} of Cards or sections.' }, { title: 'Label and hint', body: 'Stack gap={4} for tight pairs.' }] },
    { type: 'numbered', id: 'stack-gaps', title: 'Rhythm', items: [{ title: '4 to 8px', body: 'Tightly related text.' }, { title: '12 to 16px', body: 'Fields and list items.' }, { title: '24 to 32px', body: 'Sections.' }] },
  ],
  content: { rules: [{ title: 'Keep a scale', body: 'Pick 4, 12, 24 and reuse them.' }, { title: 'Nest sparingly', body: 'Stacks in stacks double gaps; use one level per rhythm.' }, { title: 'Semantic as', body: 'as="ul" for lists, as="section" for sections.' }] },
  accessibility: {
    keyboard: [{ keys: ['Tab'], action: 'Not interactive; focus follows DOM order.' }],
    notes: ['No role. Use as to render semantic elements.', 'Horizontal mode does not wrap; verify at narrow widths or use Flex wrap.'],
    reducedMotion: 'No motion.',
  },
  props: [
    { name: 'horizontal', type: 'boolean', default: 'false', description: 'Lay out as a row.' },
    { name: 'gap', type: 'SpaceStep', default: '12', description: 'px from the space scale.' },
    { name: 'align / justify', type: 'Flex alignment keys', description: 'Cross and main axis alignment.' },
    { name: 'padding', type: 'PaddingStep', description: '0 to 32px.' },
    { name: 'as', type: 'ElementType', default: "'div'", description: 'Element to render.' },
    { name: 'className / style / xstyle', type: 'string / CSSProperties / StyleXStyles', description: 'Overrides.' },
  ],
  related: ['flex', 'grid', 'card', 'separator'],
};
export default page;
