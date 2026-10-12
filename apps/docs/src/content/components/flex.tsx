import { Flex } from 'oniva-ui';
import type { DocPage } from '../types';

const Box = ({ w = 56, h = 40, label }: { w?: number; h?: number; label: string }) => <div style={{ alignItems: 'center', background: 'var(--oniva-color-accent-soft)', borderRadius: 8, color: 'var(--oniva-color-accent-soft-fg)', display: 'flex', fontSize: 12, height: h, justifyContent: 'center', width: w }}>{label}</div>;
const Demo = ({ direction = 'row', gap = 12, align = 'center', justify = 'start', wrap = false, padding = 12, width = 360 }: { direction?: string; gap?: number; align?: string; justify?: string; wrap?: boolean; padding?: number; width?: number }) => (
  <div style={{ border: '1px dashed var(--oniva-color-border-hover)', borderRadius: 12, width }}>
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    <Flex data-part="flex" direction={direction as any} gap={gap as any} align={align as any} justify={justify as any} wrap={wrap} padding={padding as any}>
      <Box label="A" h={32} /><Box label="B" h={48} /><Box label="C" h={24} /><Box label="D" h={40} /><Box label="E" w={96} />
    </Flex>
  </div>
);

const page: DocPage = {
  slug: 'flex',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Flex',
  group: ['Components', 'Layout'],
  sourcePath: 'components/Flex',
  lede: 'A one-dimensional layout primitive. Direction, alignment, gap and padding are props that map to the 4px space scale, so spacing stays on-system.',
  anatomy: {
    intro: 'Three parts. The container is the only element; its children and the spacing between them are the layout.',
    Render: () => <Demo />,
    parts: [
      { name: 'Container', description: 'display: flex (or inline-flex), rendered as a div unless as is set.', selector: '[data-part="flex"]' },
      { name: 'Gap', description: 'Space between children from the space scale: 0, 1, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 96px.', selector: '[data-part="flex"] > :nth-child(2)' },
      { name: 'Padding', description: 'Inner space on the container: 0, 4, 8, 12, 16, 20, 24 or 32px.', selector: '[data-part="flex"] > :first-child' },
    ],
  },
  usage: {
    use: ['Rows of controls: a label and a button, a toolbar of chips.', 'Aligning mixed-height children on one axis.', 'Wrapping tag lists with wrap.'],
    avoid: [
      { text: 'Simple vertical rhythm. Stack has the right defaults.', instead: { slug: 'stack', label: 'Stack' } },
      { text: 'Two-dimensional layouts and equal columns.', instead: { slug: 'grid', label: 'Grid' } },
      { text: 'A framed surface with a title.', instead: { slug: 'card', label: 'Card' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'direction', label: 'Direction', options: ['row', 'column'] },
      { kind: 'select', key: 'align', label: 'Align', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
      { kind: 'select', key: 'justify', label: 'Justify', options: ['start', 'center', 'end', 'between', 'around'] },
      { kind: 'select', key: 'gap', label: 'Gap', options: ['4', '8', '12', '16', '24'] },
      { kind: 'toggle', key: 'wrap', label: 'Wrap' },
    ],
    initial: { direction: 'row', align: 'center', justify: 'start', gap: '12', wrap: false },
    render: (p) => <Demo direction={String(p.direction)} align={String(p.align)} justify={String(p.justify)} gap={Number(p.gap)} wrap={Boolean(p.wrap)} width={p.wrap ? 220 : 360} />,
    code: (p) => `<Flex${p.direction !== 'row' ? ` direction="${p.direction}"` : ''}${p.align !== 'stretch' ? ` align="${p.align}"` : ''}${p.justify !== 'start' ? ` justify="${p.justify}"` : ''} gap={${p.gap}}${p.wrap ? ' wrap' : ''}>\n  …\n</Flex>`,
  },
  states: [
    { name: 'Row', description: 'Default horizontal flow.', Render: () => <Demo /> },
    { name: 'Column', description: 'Vertical flow.', Render: () => <Demo direction="column" width={200} /> },
    { name: 'Space between', description: 'justify="between" pins first and last.', Render: () => <Demo justify="between" /> },
    { name: 'Wrap', description: 'Children flow to the next line instead of shrinking.', Render: () => <Demo wrap width={200} /> },
    { name: 'Baseline', description: 'Aligns text baselines across mixed sizes.', Render: () => <Demo align="baseline" /> },
  ],
  sections: [
    { type: 'rules', id: 'flex-recipes', title: 'Composition recipes', items: [{ title: 'Toolbar row', body: 'Flex align="center" gap={8} with a Button and an IconButton.' }, { title: 'Header', body: 'Flex justify="between" with a title block and actions.' }, { title: 'Chips', body: 'Flex wrap gap={8} for tags that must not overflow.' }] },
    { type: 'numbered', id: 'flex-gaps', title: 'Choosing a gap', items: [{ title: '4 to 8px', body: 'Inside a control: icon and label.' }, { title: '12 to 16px', body: 'Between related controls or list items.' }, { title: '24px and up', body: 'Between sections.' }] },
  ],
  content: { rules: [{ title: 'Use as for semantics', body: 'as="ul" or as="nav" when the group is a list or landmark.' }, { title: 'Prefer gap over margins', body: 'Children should not carry their own spacing.' }, { title: 'Only scale values', body: 'Gap and padding accept scale steps only; the type system rejects 13px.' }] },
  accessibility: {
    keyboard: [{ keys: ['Tab'], action: 'Not interactive. Order follows the DOM, so keep source order matching visual order.' }],
    notes: ['Flex adds no role. Use as to render a semantic element.', 'Avoid CSS tricks that reorder children visually; keep DOM and visual order the same.'],
    reducedMotion: 'No motion.',
  },
  props: [
    { name: 'direction', type: "'row' | 'column'", default: "'row'", description: 'Main axis.' },
    { name: 'align', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", description: 'align-items.' },
    { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", description: 'justify-content.' },
    { name: 'gap', type: 'SpaceStep', description: 'px from the space scale.' },
    { name: 'padding', type: 'PaddingStep', description: '0, 4, 8, 12, 16, 20, 24, 32.' },
    { name: 'wrap', type: 'boolean', default: 'false', description: 'flex-wrap: wrap.' },
    { name: 'inline', type: 'boolean', default: 'false', description: 'inline-flex.' },
    { name: 'as', type: 'ElementType', default: "'div'", description: 'Element to render.' },
    { name: 'className / style / xstyle', type: 'string / CSSProperties / StyleXStyles', description: 'Overrides.' },
  ],
  related: ['stack', 'grid', 'layout-shell', 'separator'],
};
export default page;
