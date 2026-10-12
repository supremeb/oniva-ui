import { Text } from 'oniva-ui';
import type { DocPage } from '../types';

const Sample = () => (
  <div style={{ display: 'grid', gap: 6, maxWidth: 320 }}>
    <Text variant="headline">Q3 payouts</Text>
    <Text tabular>$48,290.00 settled in 2 business days.</Text>
    <Text variant="caption" tone="muted">Updated Oct 12, 2026</Text>
  </div>
);

const page: DocPage = {
  slug: 'text',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Text',
  group: ['Components', 'Typography'],
  sourcePath: 'components/Text',
  lede: 'Body copy, labels and captions on the token type scale. It handles every piece of non-heading text, with four tones, tabular numerals and truncation.',
  anatomy: {
    intro: 'Three parts shown here. Each is a Text with a different variant. The element defaults to span and changes with as.',
    Render: Sample,
    parts: [
      { name: 'Headline', description: '16px / 22px, semibold, balanced wrapping. For a short lead line.', selector: 'span:nth-child(1)' },
      { name: 'Body', description: '14px / 20px, regular, text-wrap: pretty. tabular switches to tabular-nums so digits line up in columns.', selector: 'span:nth-child(2)' },
      { name: 'Caption', description: '12px / 17px, medium, no tracking. tone="muted" for timestamps and hints.', selector: 'span:nth-child(3)' },
    ],
  },
  usage: {
    use: ['Paragraphs, descriptions and helper text with as="p".', 'Numbers in tables and cards with tabular.', 'Single-line labels that truncate with a title tooltip.'],
    avoid: [
      { text: 'Section titles and anything in the document outline.', instead: { slug: 'heading', label: 'Heading' } },
      { text: 'Text that navigates.', instead: { slug: 'link', label: 'Link' } },
      { text: 'Text that needs a keyboard shortcut look.', instead: { slug: 'kbd', label: 'Kbd' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'variant', label: 'Variant', options: ['caption', 'body', 'headline', 'title', 'display'] },
      { kind: 'segmented', key: 'tone', label: 'Tone', options: ['default', 'muted', 'accent', 'error'] },
      { kind: 'text', key: 'text', label: 'Text', presets: ['$48,290', 'Card declined', 'Updated Oct 12, 2026'] },
      { kind: 'toggle', key: 'tabular', label: 'Tabular numerals' },
      { kind: 'toggle', key: 'truncate', label: 'Truncate (160px)' },
    ],
    initial: { variant: 'body', tone: 'default', text: 'Payouts settle within 2 business days.', tabular: false, truncate: false },
    render: (p) => (
      <div style={{ width: p.truncate ? 160 : undefined }}>
        <Text variant={p.variant as 'body'} tone={p.tone as 'default'} tabular={Boolean(p.tabular)} truncate={Boolean(p.truncate)}>
          {String(p.text)}
        </Text>
      </div>
    ),
    code: (p) => {
      const attrs = [p.variant !== 'body' && `variant="${p.variant}"`, p.tone !== 'default' && `tone="${p.tone}"`, p.tabular && 'tabular', p.truncate && 'truncate'].filter(Boolean).join(' ');
      return `<Text${attrs ? ' ' + attrs : ''}>${p.text}</Text>`;
    },
  },
  states: [
    { name: 'Default tone', description: 'Primary text colour.', Render: () => <Text>Payouts settle within 2 business days.</Text> },
    { name: 'Muted', description: 'Secondary text for captions and metadata.', Render: () => <Text tone="muted">Updated Oct 12, 2026</Text> },
    { name: 'Accent', description: 'Accent soft foreground, for emphasis without a link.', Render: () => <Text tone="accent">View invoice</Text> },
    { name: 'Error', description: 'Error text colour for validation and failures.', Render: () => <Text tone="error">Card declined</Text> },
    { name: 'Tabular', description: 'Equal-width digits. Both rows align.', Render: () => <div style={{ display: 'grid' }}><Text tabular>1,111.00</Text><Text tabular>8,888.00</Text></div> },
    { name: 'Truncated', description: 'One line with an ellipsis. A title attribute holds the full string.', Render: () => <div style={{ width: 180 }}><Text truncate>Reconcile payouts across three connected bank accounts</Text></div> },
    { name: 'Wrapping paragraph', description: 'text-wrap: pretty avoids a one-word last line.', Render: () => <div style={{ width: 240 }}><Text as="p">Payouts settle within 2 business days after the charge clears.</Text></div> },
  ],
  sections: [
    {
      type: 'itemTypes', id: 'scale', title: 'Type scale', intro: 'Five steps. Pick by role, not by size.',
      items: [
        { name: 'caption', description: '12px / 17px, medium. Hints, timestamps, table meta.', Render: () => <Text variant="caption">Updated Oct 12</Text> },
        { name: 'body', description: '14px / 20px, regular. Default.', Render: () => <Text>Payouts settle in 2 days.</Text> },
        { name: 'headline', description: '16px / 22px, semibold.', Render: () => <Text variant="headline">Q3 payouts</Text> },
        { name: 'title', description: '24px / 30px, semibold, -0.02em.', Render: () => <Text variant="title">Revenue</Text> },
        { name: 'display', description: '40px / 46px, semibold, -0.02em. For hero numbers.', Render: () => <Text variant="display" tabular>$48,290</Text> },
      ],
    },
    {
      type: 'rules', id: 'rules', title: 'Rules',
      items: [
        { title: 'Pick the element', body: 'Use as="p" for paragraphs, "label" for labels, "time" for dates, "strong" and "em" for emphasis. The default span has no block semantics.' },
        { title: 'Numbers get tabular', body: 'Any amount or count that sits in a column or updates live.' },
        { title: 'Truncate once', body: 'Truncate only single-line labels, and only when the full text is reachable.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Sentence case', body: 'Capitalise the first word and proper nouns.' },
      { title: 'Lead with the point', body: 'Payouts settle within 2 business days, not Please note that payouts…' },
      { title: 'Numerals and units', body: '2 business days, $48,290. No spelled-out digits under 10 in UI.' },
      { title: 'Dates', body: 'Oct 12, 2026 in running text. Add time zone only when it matters.' },
    ],
  },
  accessibility: {
    keyboard: [{ keys: ['None'], action: 'Not interactive. It is not focusable.' }],
    notes: [
      'Renders the element named by as. Prefer p, label and time to carry meaning.',
      'Truncated text sets a title attribute from string children. Touch and keyboard users cannot see title; for critical text avoid truncating.',
      'Muted and error tones meet 4.5:1 on their intended surfaces.',
    ],
    reducedMotion: 'No motion.',
  },
  props: [
    { name: 'variant', type: "'caption' | 'body' | 'headline' | 'title' | 'display'", default: "'body'", description: 'Scale step.' },
    { name: 'tone', type: "'default' | 'muted' | 'accent' | 'error'", default: "'default'", description: 'Text colour token.' },
    { name: 'tabular', type: 'boolean', default: 'false', description: 'Tabular numerals.' },
    { name: 'truncate', type: 'boolean', default: 'false', description: 'Single line with ellipsis. Sets title from string children.' },
    { name: 'as', type: "'span' | 'p' | 'div' | 'label' | 'small' | 'strong' | 'em' | 'time'", default: "'span'", description: 'Rendered element.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'StyleX overrides, applied last.' },
    { name: 'ref', type: 'Ref<HTMLElement>', description: 'Forwarded to the element.' },
  ],
  related: ['heading', 'link', 'kbd', 'description-list'],
};
export default page;
