import { Heading, Text } from 'oniva-ui';
import type { DocPage } from '../types';

const Section = () => (
  <div style={{ maxWidth: 360 }}>
    <Heading level={2} variant="headline">Active subscriptions</Heading>
    <Text tone="muted">128 customers on the Pro plan.</Text>
  </div>
);

const page: DocPage = {
  slug: 'heading',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Heading',
  group: ['Components', 'Typography'],
  sourcePath: 'components/Heading',
  lede: 'Semantic h1 to h6 decoupled from the visual scale. It handles page titles, section headers and card titles where the outline and the look need to differ.',
  anatomy: {
    intro: 'Three parts. The heading element is always present. The supporting text is optional and is a separate Text.',
    Render: Section,
    parts: [
      { name: 'Heading element', description: 'h1 to h6 chosen with level. Margin 0, sans family, balanced wrapping. The outline comes from level alone.', selector: 'h2' },
      { name: 'Visual size', description: 'variant picks the scale step. Headline is 16px / 22px semibold. Default for level 2 is title (24px / 30px, -0.02em tracking).', selector: 'h2', fallback: { x: 40, y: 25 } },
      { name: 'Supporting text', description: 'A Text with tone="muted", 14px / 20px. Sits directly under with no extra margin; use a Stack gap of 4px.', selector: 'span' },
    ],
  },
  usage: {
    use: ['One h1 per page and a nested h2 to h4 outline beneath it.', 'Card and panel titles, sized down with variant="headline".', 'Large numbers that name a section, with tabular numerals.'],
    avoid: [
      { text: 'Body paragraphs and captions.', instead: { slug: 'text', label: 'Text' } },
      { text: 'Skipping levels to get a size. Change variant instead.', instead: { slug: 'text', label: 'Text' } },
      { text: 'A label for a form field.', instead: { slug: 'field', label: 'Field' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'level', label: 'Level', options: ['1', '2', '3', '4', '5', '6'] },
      { kind: 'segmented', key: 'variant', label: 'Variant', options: ['auto', 'caption', 'body', 'headline', 'title', 'display'] },
      { kind: 'segmented', key: 'tone', label: 'Tone', options: ['default', 'muted', 'accent', 'error'] },
      { kind: 'text', key: 'text', label: 'Text', presets: ['Billing', 'Invoices', 'October 2026'] },
    ],
    initial: { level: '2', variant: 'auto', tone: 'default', text: 'Invoices' },
    render: (p) => (
      <Heading level={Number(p.level) as 2} variant={p.variant === 'auto' ? undefined : (p.variant as 'title')} tone={p.tone as 'default'}>
        {String(p.text)}
      </Heading>
    ),
    code: (p) => {
      const attrs = [`level={${p.level}}`, p.variant !== 'auto' && `variant="${p.variant}"`, p.tone !== 'default' && `tone="${p.tone}"`].filter(Boolean).join(' ');
      return `<Heading ${attrs}>${p.text}</Heading>`;
    },
  },
  states: [
    { name: 'Display', description: '40px / 46px semibold, -0.02em. Level 1 default.', Render: () => <Heading level={1}>Billing</Heading> },
    { name: 'Title', description: '24px / 30px. Level 2 default.', Render: () => <Heading level={2}>Invoices</Heading> },
    { name: 'Headline', description: '16px / 22px. Level 3 and 4 default.', Render: () => <Heading level={3}>October 2026</Heading> },
    { name: 'Body', description: '14px / 20px semibold. Level 5 default.', Render: () => <Heading level={5}>Paid</Heading> },
    { name: 'Caption', description: '12px / 17px. Level 6 default.', Render: () => <Heading level={6}>Last updated</Heading> },
    { name: 'Tabular value', description: 'tabular keeps digits aligned for figures.', Render: () => <Heading level={2} variant="display" tabular>$48,290</Heading> },
    { name: 'Error tone', description: 'Red text for blocking failures.', Render: () => <Heading level={3} tone="error">Payment failed</Heading> },
    { name: 'Long, balanced', description: 'text-wrap: balance splits long titles into even lines.', Render: () => <div style={{ width: 240 }}><Heading level={3}>Reconcile payouts across three connected bank accounts</Heading></div> },
  ],
  sections: [
    {
      type: 'itemTypes', id: 'level-defaults', title: 'Level defaults', intro: 'Level sets the tag and a default scale step. Override with variant.',
      items: [
        { name: 'h1 → display', description: '40px, one per page.', Render: () => <Heading level={1}>Billing</Heading> },
        { name: 'h2 → title', description: '24px, major sections.', Render: () => <Heading level={2}>Invoices</Heading> },
        { name: 'h3, h4 → headline', description: '16px, cards and groups.', Render: () => <Heading level={3}>October 2026</Heading> },
        { name: 'h5 → body', description: '14px semibold.', Render: () => <Heading level={5}>Paid</Heading> },
        { name: 'h6 → caption', description: '12px.', Render: () => <Heading level={6}>Last updated</Heading> },
      ],
    },
    {
      type: 'rules', id: 'rules', title: 'Rules',
      items: [
        { title: 'Level for structure, variant for size', body: 'A card title under an h2 is an h3 with variant="headline". Never pick h4 because it looks right.' },
        { title: 'One h1', body: 'Exactly one per page, matching the document title.' },
        { title: 'No gaps in the outline', body: 'h2 then h3 then h4. Screen reader users navigate by level.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Sentence case', body: 'Active subscriptions, not Active Subscriptions.' },
      { title: 'Noun phrases', body: 'Name the content below. Billing, Recent invoices.' },
      { title: 'Under 60 characters', body: 'Longer titles wrap into balanced lines at display size.' },
      { title: 'No trailing punctuation', body: 'No colon or full stop.' },
    ],
  },
  accessibility: {
    keyboard: [{ keys: ['None'], action: 'Not interactive. It is not focusable.' }],
    notes: [
      'Renders a real h1 to h6. Screen readers expose the heading level and allow jumping by heading.',
      'Visual size never changes the level. Check the outline, not the look.',
      'Text colour tokens meet 4.5:1 on their surfaces, including the muted and error tones.',
    ],
    reducedMotion: 'No motion.',
  },
  props: [
    { name: 'level', type: '1 | 2 | 3 | 4 | 5 | 6', default: '2', description: 'Semantic heading tag.' },
    { name: 'variant', type: "'caption' | 'body' | 'headline' | 'title' | 'display'", description: 'Visual size. Defaults from level: 1 display, 2 title, 3 and 4 headline, 5 body, 6 caption.' },
    { name: 'tone', type: "'default' | 'muted' | 'accent' | 'error'", default: "'default'", description: 'Text colour token.' },
    { name: 'tabular', type: 'boolean', default: 'false', description: 'font-variant-numeric: tabular-nums.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'StyleX overrides, applied last.' },
    { name: 'ref', type: 'Ref<HTMLHeadingElement>', description: 'Forwarded to the heading.' },
  ],
  related: ['text', 'stack', 'card', 'description-list'],
};
export default page;
