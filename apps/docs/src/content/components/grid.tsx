import { Grid } from 'oniva-ui';
import type { DocPage } from '../types';

const Cell = ({ n }: { n: number }) => <div style={{ alignItems: 'center', background: 'var(--oniva-color-accent-soft)', borderRadius: 8, color: 'var(--oniva-color-accent-soft-fg)', display: 'flex', fontSize: 12, height: 48, justifyContent: 'center' }}>{n}</div>;
const Demo = ({ columns, min, gap = 12, count = 6, width = 420 }: { columns?: number; min?: number; gap?: number; count?: number; width?: number }) => (
  <div style={{ border: '1px dashed var(--oniva-color-border-hover)', borderRadius: 12, padding: 8, width }}>
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    <Grid data-part="grid" columns={columns} minColumnWidth={min} gap={gap as any}>{Array.from({ length: count }, (_, i) => <Cell key={i} n={i + 1} />)}</Grid>
  </div>
);

const page: DocPage = {
  slug: 'grid',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Grid',
  group: ['Components', 'Layout'],
  sourcePath: 'components/Grid',
  lede: 'A two-dimensional layout. Pick a fixed column count, or give a minimum column width and let it fit as many as it can.',
  anatomy: {
    intro: 'Three parts. The container sets the tracks; cells and the gap are what you see.',
    Render: () => <Demo columns={3} />,
    parts: [
      { name: 'Container', description: 'display: grid. columns gives equal tracks; minColumnWidth gives auto-fit tracks that never shrink below the width.', selector: '[data-part="grid"]' },
      { name: 'Cell', description: 'Any child. Stretches to its track unless align or justify is set.', selector: '[data-part="grid"] > :first-child' },
      { name: 'Gap', description: 'One value for rows and columns from the space scale, 12px in this stage.', selector: '[data-part="grid"] > :nth-child(2)' },
    ],
  },
  usage: {
    use: ['Dashboards of cards or metrics (minColumnWidth).', 'Form layouts with fixed columns.', 'Galleries and settings tiles.'],
    avoid: [
      { text: 'One-row or one-column layouts.', instead: { slug: 'flex', label: 'Flex' } },
      { text: 'Simple vertical rhythm.', instead: { slug: 'stack', label: 'Stack' } },
      { text: 'Resizable panes.', instead: { slug: 'resizable-panels', label: 'ResizablePanels' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'mode', label: 'Tracks', options: ['columns', 'minColumnWidth'] },
      { kind: 'number', key: 'columns', label: 'Columns', min: 1, max: 6, step: 1 },
      { kind: 'number', key: 'min', label: 'Min column width', min: 80, max: 240, step: 20 },
      { kind: 'select', key: 'gap', label: 'Gap', options: ['4', '8', '12', '16', '24'] },
    ],
    initial: { mode: 'columns', columns: 3, min: 120, gap: '12' },
    render: (p) => <Demo columns={p.mode === 'columns' ? Number(p.columns) : undefined} min={p.mode === 'columns' ? undefined : Number(p.min)} gap={Number(p.gap)} count={8} />,
    code: (p) => `<Grid ${p.mode === 'columns' ? `columns={${p.columns}}` : `minColumnWidth={${p.min}}`} gap={${p.gap}}>\n  …\n</Grid>`,
  },
  states: [
    { name: 'Three columns', description: 'Equal fixed tracks.', Render: () => <Demo columns={3} /> },
    { name: 'Auto-fit 120px', description: 'Fits 3 columns at this width.', Render: () => <Demo min={120} /> },
    { name: 'Narrow container', description: 'Same auto-fit drops to 2 columns at 260px.', Render: () => <Demo min={120} width={260} /> },
    { name: 'Wide gap', description: 'gap 24 for airy galleries.', Render: () => <Demo columns={3} gap={24} /> },
    { name: 'Single item', description: 'One cell takes one track, not the whole row.', Render: () => <Demo columns={3} count={1} /> },
  ],
  sections: [
    { type: 'rules', id: 'grid-recipes', title: 'Composition recipes', items: [{ title: 'Metric dashboard', body: 'minColumnWidth={240} with Cards; reflows without breakpoints.' }, { title: 'Two-column form', body: 'columns={2} gap={16}; make long fields span by wrapping in a full-width element.' }, { title: 'Page layout', body: 'Use LayoutShell for the frame and Grid inside the content area.' }] },
    { type: 'numbered', id: 'grid-choose', title: 'columns or minColumnWidth', items: [{ title: 'columns', body: 'When the count is part of the design: always 3 stats.' }, { title: 'minColumnWidth', body: 'When the container width varies: card galleries. It wins if both are set.' }, { title: 'Avoid media queries', body: 'Auto-fit removes most of them.' }] },
  ],
  content: { rules: [{ title: 'Equal-weight cells', body: 'Grid tracks are equal; unequal content belongs in Flex.' }, { title: 'Keep cell content similar in height', body: 'Rows grow to the tallest cell.' }, { title: 'Use as for lists', body: 'as="ul" with li children for galleries of links.' }] },
  accessibility: {
    keyboard: [{ keys: ['Tab'], action: 'Not interactive. DOM order is the focus and reading order, regardless of grid placement.' }],
    notes: ['Grid adds no role; use as for semantic markup.', 'Do not rely on visual position to convey order.'],
    reducedMotion: 'No motion.',
  },
  props: [
    { name: 'columns', type: 'number', description: 'Fixed equal columns.' },
    { name: 'minColumnWidth', type: 'number', description: 'Auto-fit columns of at least this many px. Wins over columns.' },
    { name: 'gap', type: 'SpaceStep', description: 'px from the space scale.' },
    { name: 'padding', type: 'PaddingStep', description: '0 to 32px.' },
    { name: 'align / justify', type: 'Flex alignment keys', description: 'align-items and justify-items for cells.' },
    { name: 'as', type: 'ElementType', default: "'div'", description: 'Element to render.' },
    { name: 'className / style / xstyle', type: 'string / CSSProperties / StyleXStyles', description: 'Overrides.' },
  ],
  related: ['flex', 'stack', 'card', 'layout-shell'],
};
export default page;
