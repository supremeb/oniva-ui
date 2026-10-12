import { ScrollArea } from 'oniva-ui';
import type { DocPage } from '../types';

const rows = ['INV-1042 Northwind', 'INV-1043 Contoso', 'INV-1044 Fabrikam', 'INV-1045 Adatum', 'INV-1046 Litware', 'INV-1047 Tailspin', 'INV-1048 Wingtip', 'INV-1049 Proseware'];
const Demo = ({ orientation = 'vertical', maxHeight = 140, count = 8, label = 'Invoices' }: { orientation?: 'vertical' | 'horizontal' | 'both'; maxHeight?: number; count?: number; label?: string }) => (
  <div style={{ border: '1px solid var(--oniva-color-border)', borderRadius: 12, width: 260 }}>
    <ScrollArea aria-label={label} orientation={orientation} maxHeight={maxHeight}>
      <div style={{ padding: 8, width: orientation === 'vertical' ? undefined : 420 }}>
        {rows.slice(0, count).map((r) => <div key={r} style={{ fontSize: 14, padding: '8px 4px', whiteSpace: 'nowrap' }}>{r}</div>)}
      </div>
    </ScrollArea>
  </div>
);

const page: DocPage = {
  slug: 'scroll-area',
  status: 'Stable',
  version: '0.1.0',
  importName: 'ScrollArea',
  group: ['Components', 'Layout'],
  sourcePath: 'components/ScrollArea',
  lede: 'A scroll container with slim themed scrollbars. It is keyboard focusable, so content that overflows stays reachable without a mouse.',
  anatomy: {
    intro: 'Three parts. The viewport and content are always present; the scrollbar shows only when content overflows.',
    Render: () => <Demo />,
    parts: [
      { name: 'Viewport', description: 'The container with maxHeight or maxWidth. Focusable (tabIndex 0) so arrow keys scroll it.', selector: '[aria-label="Invoices"]' },
      { name: 'Content', description: 'Your children. The viewport scrolls when they exceed the max size.', selector: '[aria-label="Invoices"] > div' },
      { name: 'Scrollbar', description: '10px thick, thin native width, transparent track, border-hover colored thumb. Rendered by the browser, so it is not selectable; the marker falls back to the right edge.', selector: '[aria-label="Invoices"]', fallback: { x: 96, y: 50 } },
    ],
  },
  usage: {
    use: ['A bounded list inside a card or panel.', 'Wide code or tables that need horizontal scroll.', 'Popover and drawer bodies with long content.'],
    avoid: [
      { text: 'The whole page. Let the document scroll.', instead: { slug: 'layout-shell', label: 'LayoutShell' } },
      { text: 'Large data sets that need paging.', instead: { slug: 'pagination', label: 'Pagination' } },
      { text: 'Side-by-side resizable regions.', instead: { slug: 'resizable-panels', label: 'ResizablePanels' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'orientation', label: 'Orientation', options: ['vertical', 'horizontal', 'both'] },
      { kind: 'number', key: 'maxHeight', label: 'Max height', min: 80, max: 300, step: 20 },
      { kind: 'number', key: 'count', label: 'Rows', min: 1, max: 8, step: 1 },
    ],
    initial: { orientation: 'vertical', maxHeight: 140, count: 8 },
    render: (p, ev) => <div onScroll={() => ev('onScroll')}><Demo orientation={p.orientation as 'vertical' | 'horizontal' | 'both'} maxHeight={Number(p.maxHeight)} count={Number(p.count)} /></div>,
    code: (p) => `<ScrollArea aria-label="Invoices"${p.orientation !== 'vertical' ? ` orientation="${p.orientation}"` : ''} maxHeight={${p.maxHeight}}>\n  …\n</ScrollArea>`,
  },
  states: [
    { name: 'Overflowing', description: 'Content taller than 140px scrolls.', Render: () => <Demo /> },
    { name: 'Fits', description: 'Short content shows no scrollbar.', Render: () => <Demo count={3} /> },
    { name: 'Horizontal', description: 'Wide content scrolls sideways.', Render: () => <Demo orientation="horizontal" count={3} /> },
    { name: 'Both axes', description: 'Scrolls in both directions.', Render: () => <Demo orientation="both" /> },
  ],
  sections: [
    { type: 'rules', id: 'sa-recipes', title: 'Composition recipes', items: [{ title: 'Popover list', body: 'Popover noPadding with a ScrollArea maxHeight={240} of options.' }, { title: 'Drawer body', body: 'Let DrawerBody scroll; use ScrollArea only for nested regions.' }, { title: 'Code block', body: 'orientation="horizontal" with no wrap.' }] },
    { type: 'numbered', id: 'sa-rules', title: 'Rules', items: [{ title: 'Always name it', body: 'aria-label tells screen readers what scrolls.' }, { title: 'Cap one axis', body: 'Set maxHeight for lists; leave width fluid.' }, { title: 'Hint at overflow', body: 'Let the last row be cut off so users see more exists.' }] },
  ],
  content: { rules: [{ title: 'Label the region', body: 'aria-label="Invoices", not "Scrollable".' }, { title: 'Do not nest scroll areas', body: 'Two scrollbars trap wheel events.' }] },
  accessibility: {
    keyboard: [
      { keys: ['Tab'], action: 'Focuses the scroll area.' },
      { keys: ['↑', '↓'], action: 'Scrolls vertically.' },
      { keys: ['←', '→'], action: 'Scrolls horizontally.' },
      { keys: ['Page Up', 'Page Down', 'Home', 'End'], action: 'Larger jumps.' },
    ],
    notes: ['The viewport is focusable so keyboard-only users can scroll content without focusable children (WCAG 2.1.1).', 'It uses native scrolling, so momentum, touch and wheel behave as the OS expects.', 'Give it a role="region" and aria-label when it holds meaningful content.'],
    reducedMotion: 'No scroll animation is added.',
  },
  props: [
    { name: 'orientation', type: "'vertical' | 'horizontal' | 'both'", default: "'vertical'", description: 'Which axes scroll.' },
    { name: 'maxHeight', type: 'number | string', description: 'Scrolls beyond this height.' },
    { name: 'maxWidth', type: 'number | string', description: 'Scrolls beyond this width.' },
    { name: 'aria-label', type: 'string', description: 'Name of the region.' },
    { name: 'children', type: 'ReactNode', description: 'Content.' },
    { name: 'className / style / xstyle', type: 'string / CSSProperties / StyleXStyles', description: 'Overrides.' },
  ],
  related: ['layout-shell', 'popover', 'drawer', 'resizable-panels'],
};
export default page;
