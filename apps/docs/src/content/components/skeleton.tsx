import { Skeleton } from 'oniva-ui';
import type { DocPage } from '../types';

const Card = (p: { lines?: number; avatar?: boolean }) => (
  <div style={{ width: 320, display: 'flex', gap: 12, alignItems: 'flex-start' }} role="status" aria-label="Loading profile">
    {p.avatar !== false && <Skeleton variant="circle" />}
    <div style={{ flex: 1, display: 'grid', gap: 8 }}>
      {Array.from({ length: p.lines ?? 3 }, (_, i) => <Skeleton key={i} variant="text" width={i === (p.lines ?? 3) - 1 ? '60%' : '100%'} />)}
    </div>
  </div>
);

const page: DocPage = {
  slug: 'skeleton',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Skeleton',
  group: ['Components', 'Feedback'],
  sourcePath: 'components/Skeleton',
  lede: 'A shimmering placeholder in the shape of content that is loading, so the layout holds still and the page feels faster.',
  anatomy: {
    intro: 'Four parts. A status wrapper that you add, and three shapes (text, rect and circle) that share one shimmer and are decorative.',
    Render: () => (
      <div role="status" aria-label="Loading profile" style={{ width: 320, display: 'grid', gap: 10 }}>
        <Skeleton variant="circle" />
        <Skeleton variant="text" />
        <Skeleton variant="rect" />
      </div>
    ),
    parts: [
      { name: 'Status wrapper', description: 'Your container with role="status" and a specific aria-label. The skeletons inside are aria-hidden, so this is what assistive tech announces.', selector: '[role="status"]' },
      { name: 'Circle', description: '40px by 40px, full radius. For avatars; override width and height for other sizes.', selector: 'span:nth-of-type(1)' },
      { name: 'Text line', description: '14px tall, 4px radius, full width. Make the last line 60% wide so it reads as a paragraph.', selector: 'span:nth-of-type(2)' },
      { name: 'Rectangle', description: '80px tall, 10px radius, full width. For images, charts and cards.', selector: 'span:nth-of-type(3)' },
    ],
  },
  usage: {
    use: ['Content that takes over about 300ms to load.', 'Lists, cards and tables whose shape you know.', 'Replacing a full-page spinner.'],
    avoid: [
      { text: 'Short waits inside a button.', instead: { slug: 'spinner', label: 'Spinner' } },
      { text: 'A task with known progress.', instead: { slug: 'progress-bar', label: 'ProgressBar' } },
      { text: 'No content to show at all.', instead: { slug: 'empty-state', label: 'EmptyState' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'variant', label: 'Shape', options: ['text', 'rect', 'circle'] },
      { kind: 'number', key: 'width', label: 'Width (px, 0 = default)', min: 0, max: 400, step: 20 },
      { kind: 'number', key: 'height', label: 'Height (px, 0 = default)', min: 0, max: 200, step: 10 },
    ],
    initial: { variant: 'rect', width: 0, height: 0 },
    render: (p) => (
      <div style={{ width: 360 }}>
        <Skeleton variant={p.variant as 'text'} width={Number(p.width) || undefined} height={Number(p.height) || undefined} />
      </div>
    ),
    code: (p) => `<Skeleton${p.variant !== 'text' ? ` variant="${p.variant}"` : ''}${Number(p.width) ? ` width={${p.width}}` : ''}${Number(p.height) ? ` height={${p.height}}` : ''} />`,
  },
  states: [
    { name: 'Profile card', description: 'Circle and three text lines.', Render: () => <Card /> },
    { name: 'Two lines, no avatar', description: 'Match the final content shape.', Render: () => <Card lines={2} avatar={false} /> },
    { name: 'Image block', description: 'A rect with custom height.', Render: () => <div style={{ width: 320 }}><Skeleton variant="rect" height={140} /></div> },
    { name: 'Table rows', description: 'Keep the header; replace cells with lines.', Render: () => (<div style={{ width: 360, display: 'grid', gap: 12 }}>{[0, 1, 2].map((r) => (<div key={r} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}><Skeleton /><Skeleton /><Skeleton /></div>))}</div>) },
  ],
  sections: [
    { type: 'rules', id: 'rules', title: 'Rules', items: [
      { title: 'Match the real layout', body: 'Same widths, heights and gaps as the loaded content. A skeleton that jumps when content arrives defeats its purpose.' },
      { title: 'Wait a beat', body: 'Show skeletons only after about 200ms. Faster loads should go straight to content.' },
      { title: 'No more than one screen', body: 'Skeletons for what is visible; do not fill the whole scroll length.' },
      { title: 'Announce once', body: 'Skeletons are hidden from assistive tech. Put role="status" and a label on the container.' },
    ] },
    { type: 'rules', id: 'recipes', title: 'Composition', items: [
      { title: 'With DataTable', body: 'Render the toolbar and header normally, with skeleton rows in the body.' },
      { title: 'With Avatar and List', body: 'Use a circle plus two lines for a person row.' },
    ] },
  ],
  content: { rules: [
    { title: 'Container label', body: 'aria-label on the wrapper: "Loading profile", not "Loading".' },
    { title: 'Line widths', body: 'Vary the last line to about 60% so lines look like text.' },
    { title: 'Errors', body: 'If loading fails, replace skeletons with an EmptyState; never leave them shimmering.' },
  ] },
  accessibility: {
    keyboard: [{ keys: ['None'], action: 'Not focusable.' }],
    notes: ['Each skeleton is aria-hidden. Wrap a group in role="status" with an aria-label so loading is announced once.', 'Replace skeletons with real content in the same container to keep focus and scroll position.', 'The shimmer pauses when off-screen.'],
    reducedMotion: 'The shimmer is removed; skeletons are static blocks.',
  },
  props: [
    { name: 'variant', type: "'text' | 'rect' | 'circle'", default: "'text'", description: 'Shape and default size.' },
    { name: 'width', type: 'number | string', description: 'px or any CSS length.' },
    { name: 'height', type: 'number | string', description: 'px or any CSS length.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Style override.' },
  ],
  related: ['spinner', 'progress-bar', 'empty-state', 'data-table'],
};
export default page;
