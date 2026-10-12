import { Pagination } from 'oniva-ui';
import type { DocPage } from '../types';

const page: DocPage = {
  slug: 'pagination',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Pagination',
  group: ['Components', 'Navigation'],
  sourcePath: 'components/Pagination',
  lede: 'Page controls for long lists. It always shows the first and last page, the current page with its neighbors, and ellipses for the gaps.',
  anatomy: {
    intro: 'Five parts in the numbers variant. Previous, next and the page list are always present; ellipses appear when pages are skipped.',
    Render: () => <Pagination pageCount={24} defaultPage={8} />,
    parts: [
      { name: 'Container', description: 'A nav landmark, 14px text, 4px gap between controls.', selector: 'nav' },
      { name: 'Previous', description: '32px tall button with chevron. Disabled on page 1.', selector: 'nav li:first-child > *' },
      { name: 'Page button', description: '32px tall, 8px side padding, 10px radius. Always first, last and siblingCount neighbors of the current page.', selector: 'nav li:nth-child(2) > *' },
      { name: 'Current page', description: 'Filled selected style, aria-current="page". accentCurrent switches to the accent gradient.', selector: 'nav [aria-current="page"]' },
      { name: 'Next', description: 'Mirror of Previous. Disabled on the last page.', selector: 'nav li:last-child > *' },
    ],
  },
  usage: {
    use: ['Tables and lists where users need to jump to a known page.', 'Result sets of 50 to 10,000 items with stable ordering.', 'Footers with a Showing 1-10 of 248 summary (simple variant).'],
    avoid: [
      { text: 'Feeds with no end. Load more or scroll.', instead: { slug: 'scroll-area', label: 'ScrollArea' } },
      { text: 'Wizard steps.', instead: { slug: 'stepper', label: 'Stepper' } },
      { text: 'Switching views of the same data.', instead: { slug: 'tabs', label: 'Tabs' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'variant', label: 'Variant', options: ['numbers', 'simple'] },
      { kind: 'number', key: 'pageCount', label: 'Pages', min: 1, max: 100, step: 1 },
      { kind: 'number', key: 'siblingCount', label: 'Siblings', min: 0, max: 3, step: 1 },
      { kind: 'toggle', key: 'accentCurrent', label: 'Accent current page' },
    ],
    initial: { variant: 'numbers', pageCount: 24, siblingCount: 1, accentCurrent: false },
    render: (p, ev) => <Pagination key={`${p.variant}${p.pageCount}${p.siblingCount}${p.accentCurrent}`} variant={p.variant as 'numbers' | 'simple'} pageCount={Number(p.pageCount)} siblingCount={Number(p.siblingCount)} accentCurrent={Boolean(p.accentCurrent)} defaultPage={Math.min(8, Number(p.pageCount))} summary={p.variant === 'simple' ? 'Showing 71-80 of 248' : undefined} onPageChange={(n) => ev(`onPageChange(${n})`)} />,
    code: (p) => `<Pagination\n  pageCount={${p.pageCount}}${p.variant !== 'numbers' ? `\n  variant="${p.variant}"` : ''}${Number(p.siblingCount) !== 1 ? `\n  siblingCount={${p.siblingCount}}` : ''}${p.accentCurrent ? '\n  accentCurrent' : ''}\n  page={page}\n  onPageChange={setPage}\n/>`,
  },
  states: [
    { name: 'Middle', description: 'Ellipses on both sides.', Render: () => <Pagination pageCount={24} defaultPage={12} /> },
    { name: 'First page', description: 'Previous disabled; single ellipsis near the end.', Render: () => <Pagination pageCount={24} defaultPage={1} /> },
    { name: 'Last page', description: 'Next disabled.', Render: () => <Pagination pageCount={24} defaultPage={24} /> },
    { name: 'Few pages', description: 'Up to 7 pages show without ellipses.', Render: () => <Pagination pageCount={5} defaultPage={2} /> },
    { name: 'Simple footer', description: 'Summary at the start, Previous and Next at the end.', Render: () => <div style={{ width: 420 }}><Pagination variant="simple" pageCount={25} defaultPage={8} summary="Showing 71-80 of 248" /></div> },
    { name: 'Accent current', description: 'accentCurrent highlights the page with the accent gradient.', Render: () => <Pagination pageCount={9} defaultPage={3} accentCurrent /> },
  ],
  sections: [
    {
      type: 'numbered', id: 'range-logic', title: 'How the range is built',
      items: [
        { title: 'Always first and last', body: 'Users can always jump to either end.' },
        { title: 'Siblings around current', body: 'siblingCount (default 1) pages on each side. Total slots = siblings * 2 + 5.' },
        { title: 'Ellipses for gaps', body: 'Hidden when a gap is a single page, so the control keeps a constant width.' },
      ],
    },
    { type: 'rules', id: 'pag-recipes', title: 'Composition recipes', items: [{ title: 'Table footer', body: 'simple variant under a DataTable with a summary of the visible range.' }, { title: 'Reset on filter', body: 'When filters change, set page back to 1.' }, { title: 'Localise', body: 'Use labels to translate Previous, Next and the page aria-labels.' }] },
  ],
  content: { rules: [{ title: 'Summary shows the range', body: 'Showing 71-80 of 248. Not Page 8.' }, { title: 'Keep Previous and Next', body: 'Do not rename to arrows only; the words help screen readers and translation.' }, { title: 'Page aria-labels are numbers', body: 'Page 8; override with labels.page.' }] },
  accessibility: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves between Previous, page buttons and Next.' },
      { keys: ['Enter', 'Space'], action: 'Goes to the focused page.' },
    ],
    notes: ['A nav landmark (aria-label Pagination by default).', 'The current page has aria-current="page".', 'Previous and Next are disabled, not hidden, at the ends so layout does not shift.', 'Buttons are 32px; the hit area meets 24px minimum for WCAG 2.5.8.'],
    reducedMotion: 'No motion beyond hover color.',
  },
  props: [
    { name: 'pageCount', type: 'number', description: 'Required. Total pages.' },
    { name: 'page / defaultPage', type: 'number', default: '1', description: 'Controlled or initial page (1-based).' },
    { name: 'onPageChange', type: '(page: number) => void', description: 'Fires with the new page.' },
    { name: 'siblingCount', type: 'number', default: '1', description: 'Pages beside the current one.' },
    { name: 'variant', type: "'numbers' | 'simple'", default: "'numbers'", description: 'Page buttons, or footer with summary.' },
    { name: 'summary', type: 'string', default: "'Page X of Y'", description: 'Text for the simple variant.' },
    { name: 'accentCurrent', type: 'boolean', default: 'false', description: 'Accent gradient on the current page.' },
    { name: 'labels', type: '{ previous, next, previousPage, nextPage, page(n), summary(page, count) }', description: 'Localisation strings.' },
    { name: 'aria-label', type: 'string', description: 'Landmark name.' },
    { name: 'className / style / xstyle', type: 'string / CSSProperties / StyleXStyles', description: 'Overrides.' },
  ],
  related: ['data-table', 'tabs', 'stepper', 'scroll-area'],
};
export default page;
