import { Spinner } from 'oniva-ui';
import type { DocPage } from '../types';

type S = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
const Demo = (p: { size?: S; tone?: 'current' | 'accent' | 'muted'; label?: string }) => <Spinner size={p.size} tone={p.tone} label={p.label} />;

const page: DocPage = {
  slug: 'spinner',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Spinner',
  group: ['Components', 'Feedback'],
  sourcePath: 'components/Spinner',
  lede: 'A rotating indicator for short, unknown waits. Five sizes, three tones, and a pulse instead of rotation when motion is reduced.',
  anatomy: {
    intro: 'Four parts. The status wrapper, faint ring and moving arc are always present.',
    Render: () => <Demo size="xl" />,
    parts: [
      { name: 'Wrapper', description: 'role="status" with the label as its name and as hidden text. Sizes: 12, 16, 20, 28, 40px.', selector: '[role="status"]' },
      { name: 'Hidden label', description: 'Visually hidden text repeating the label, so it is announced when the spinner mounts.', selector: '[role="status"] > span' },
      { name: 'Ring', description: 'Full circle at 20% opacity, 3px stroke on a 24 unit grid.', selector: 'svg circle' },
      { name: 'Arc', description: 'Quarter arc with round caps, rotating once every 700ms. Pauses when off-screen.', selector: 'svg path' },
    ],
  },
  usage: {
    use: ['Inside a pressed button while saving.', 'A short fetch with no known length.', 'Lazy-loaded panels under about 3 seconds.'],
    avoid: [
      { text: 'Loading page content with a known shape.', instead: { slug: 'skeleton', label: 'Skeleton' } },
      { text: 'Tasks with a known length.', instead: { slug: 'progress-bar', label: 'ProgressBar' } },
      { text: 'A wait that has failed or is empty.', instead: { slug: 'empty-state', label: 'EmptyState' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'size', label: 'Size', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
      { kind: 'segmented', key: 'tone', label: 'Tone', options: ['current', 'accent', 'muted'] },
      { kind: 'text', key: 'label', label: 'Label', presets: ['Loading', 'Saving changes', 'Fetching invoices'] },
    ],
    initial: { size: 'lg', tone: 'accent', label: 'Loading' },
    render: (p) => <Demo size={p.size as S} tone={p.tone as 'accent'} label={String(p.label)} />,
    code: (p) => `<Spinner${p.size !== 'md' ? ` size="${p.size}"` : ''}${p.tone !== 'accent' ? ` tone="${p.tone}"` : ''}${p.label !== 'Loading' ? ` label="${p.label}"` : ''} />`,
  },
  states: [
    { name: 'Sizes', description: 'xs 12, sm 16, md 20, lg 28, xl 40px.', Render: () => (<div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>{(['xs', 'sm', 'md', 'lg', 'xl'] as S[]).map((s) => <Demo key={s} size={s} />)}</div>) },
    { name: 'Accent', description: 'The default, for standalone loading.', Render: () => <Demo size="lg" /> },
    { name: 'Muted', description: 'Quieter, for secondary regions.', Render: () => <Demo size="lg" tone="muted" /> },
    { name: 'Current color', description: 'Inherits text color; use inside buttons.', Render: () => <span style={{ color: 'var(--oniva-color-danger-fg)' }}><Demo size="lg" tone="current" /></span> },
    { name: 'In a message', description: 'Pair with text for waits longer than a second.', Render: () => (<div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}><Demo size="sm" label="Fetching invoices" />Fetching invoices…</div>) },
  ],
  sections: [
    { type: 'rules', id: 'rules', title: 'Rules', items: [
      { title: 'Under 3 seconds', body: 'Past that, show a ProgressBar or skeleton and say what is happening.' },
      { title: 'Never block the page', body: 'Spin inside the region that is loading and keep the rest usable.' },
      { title: 'One per region', body: 'Do not scatter spinners across a card. Use a Skeleton.' },
    ] },
    { type: 'rules', id: 'recipes', title: 'Composition', items: [
      { title: 'In a Button', body: 'Button has isLoading; it swaps in a current-tone Spinner and keeps the width.' },
      { title: 'Centered in a panel', body: 'xl in the middle of a region with the label beneath for slow loads.' },
    ] },
  ],
  content: { rules: [
    { title: 'Label', body: 'What is loading, as a gerund: "Saving changes", "Fetching invoices". Default is "Loading".' },
    { title: 'Visible text', body: 'For waits over a second show the same text beside the spinner.' },
    { title: 'Completion', body: 'Replace the spinner with the result, never leave it spinning.' },
  ] },
  accessibility: {
    keyboard: [{ keys: ['None'], action: 'Not focusable.' }],
    notes: ['role="status" with aria-label and matching visually hidden text, so it is announced politely when inserted.', 'The SVG is aria-hidden.', 'Do not mount several spinners with the same label at once.'],
    reducedMotion: 'Rotation is replaced by a slow 1.2s opacity pulse, so it still reads as busy.',
  },
  props: [
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: '12, 16, 20, 28 or 40px.' },
    { name: 'tone', type: "'current' | 'accent' | 'muted'", default: "'accent'", description: 'Color.' },
    { name: 'label', type: 'string', default: "'Loading'", description: 'Accessible label.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Style override.' },
  ],
  related: ['skeleton', 'progress-bar', 'button', 'empty-state'],
};
export default page;
