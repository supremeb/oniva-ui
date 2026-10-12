import { Link, LinkButton, Button, Text } from 'oniva-ui';
import type { DocPage } from '../types';

const Inline = () => (
  <Text as="p">
    Your plan renews on Nov 1, 2026. <Link href="#/components/link">Manage billing</Link>
  </Text>
);

const Compare = () => (
  <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
    <Link href="#/components/link">Link: inline text, navigates</Link>
    <LinkButton href="#/components/link">LinkButton: looks like a button, navigates</LinkButton>
    <Button>Button: looks like a button, acts</Button>
  </div>
);

const page: DocPage = {
  slug: 'link',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Link',
  group: ['Components', 'Actions'],
  sourcePath: 'components/Link',
  lede: 'An inline text link that navigates. It handles references inside sentences and quiet navigation in footers and metadata.',
  anatomy: {
    intro: 'Two parts. The anchor and its label are always present. The underline appears on hover unless underline is set.',
    Render: Inline,
    parts: [
      { name: 'Anchor', description: 'A native a with href. Medium weight, inherits the font size of its sentence, 4px focus radius, 2px focus ring.', selector: 'a' },
      { name: 'Label', description: 'Accent text colour by default. On hover the colour moves to full text colour and a 1px underline, offset 3px, appears.', selector: 'a', fallback: { x: 80, y: 50 } },
    ],
  },
  usage: {
    use: ['A reference inside a sentence: "Manage billing".', 'Footer, breadcrumb-like and metadata navigation.', 'External documentation links in help text.'],
    avoid: [
      { text: 'A call to action that should look like a button.', instead: { slug: 'link-button', label: 'LinkButton' } },
      { text: 'Running an action such as save, delete or open a dialog.', instead: { slug: 'button', label: 'Button' } },
      { text: 'Showing the user where they are in a hierarchy.', instead: { slug: 'breadcrumbs', label: 'Breadcrumbs' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'tone', label: 'Tone', options: ['accent', 'muted', 'inherit'] },
      { kind: 'toggle', key: 'underline', label: 'Always underline' },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
      { kind: 'text', key: 'label', label: 'Label', presets: ['Manage billing', 'View statement', 'Read the docs'] },
    ],
    initial: { tone: 'accent', underline: false, isDisabled: false, label: 'Manage billing' },
    render: (p, ev) => (
      <Text as="p">
        Your plan renews on Nov 1, 2026.{' '}
        <Link href="#/components/link" tone={p.tone as 'accent'} underline={Boolean(p.underline)} isDisabled={Boolean(p.isDisabled)} onPress={() => ev('onPress')}>
          {String(p.label)}
        </Link>
      </Text>
    ),
    code: (p) => {
      const attrs = [p.tone !== 'accent' && `tone="${p.tone}"`, p.underline && 'underline', p.isDisabled && 'isDisabled'].filter(Boolean).join(' ');
      return `<Text as="p">\n  Your plan renews on Nov 1, 2026. <Link href="/billing"${attrs ? ' ' + attrs : ''}>${p.label}</Link>\n</Text>`;
    },
  },
  states: [
    { name: 'Default', description: 'Accent colour, no underline.', Render: Inline },
    { name: 'Underlined', description: 'underline keeps the 1px line on at rest. Use inside dense body copy.', Render: () => <Link href="#/components/link" underline>Manage billing</Link> },
    { name: 'Muted', description: 'Secondary text colour for footers and captions.', Render: () => <Link href="#/components/link" tone="muted" underline>Privacy policy</Link> },
    { name: 'Inherit', description: 'Takes the parent text colour. For links inside coloured alerts.', Render: () => <Text as="p" tone="error">Card declined. <Link href="#/components/link" tone="inherit" underline>Update payment method</Link></Text> },
    { name: 'Disabled', description: 'Disabled text colour, no underline, not-allowed cursor, no href navigation.', Render: () => <Link isDisabled>Manage billing</Link> },
    { name: 'Long label wraps', description: 'The anchor is inline, so long labels wrap with the sentence.', Render: () => <div style={{ width: 220 }}><Text as="p">See the <Link href="#/components/link">full list of supported payout currencies and settlement windows</Link>.</Text></div> },
  ],
  sections: [
    { type: 'custom', id: 'link-vs-linkbutton-vs-button', title: 'Link vs LinkButton vs Button', Render: Compare },
    {
      type: 'rules', id: 'choosing', title: 'Choosing between the three',
      intro: 'Ask two questions: does it change the URL, and does it need to look like a control?',
      items: [
        { title: 'Link', body: 'Changes the URL, reads as text. Renders a, no box, inherits font size. Use in sentences and footers.' },
        { title: 'LinkButton', body: 'Changes the URL, reads as a control. Renders an a with Button variants and sizes (24 to 40px tall). Use for "View statement" CTAs.' },
        { title: 'Button', body: 'Runs code, no URL change. Renders a button. Use for save, submit, open dialog. Never put a Button inside a Link.' },
      ],
    },
    {
      type: 'dodont', id: 'do-and-dont', title: 'Do and don’t',
      items: [
        { kind: 'do', caption: 'Name the destination.', example: () => <Link href="#/components/link">View October statement</Link> },
        { kind: 'dont', caption: 'Generic labels that fail out of context.', example: () => <Link href="#/components/link">Click here</Link> },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Describe the destination', body: 'View October statement, not Click here or Learn more.' },
      { title: 'Five words or fewer', body: 'Long links wrap and lose scannability. Link the noun, not the whole sentence.' },
      { title: 'Sentence case', body: 'No capitalised words, no trailing arrow glyphs typed into the label.' },
      { title: 'External links', body: 'Say so for screen reader users: add target="_blank" with rel="noopener" and put "(opens in a new tab)" in a VisuallyHidden span.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['Enter'], action: 'Follows the link. Space does not activate a native anchor.' },
      { keys: ['Tab'], action: 'Moves focus to or past the link.' },
    ],
    notes: [
      'Built on React Aria Link: a native a when href is set. Without href it renders a span with role="link" and tabindex="0".',
      'Disabled links get aria-disabled and are skipped by navigation.',
      'Do not rely on colour alone: the underline appears on hover and focus, and underline keeps it on. In body copy next to non-link text, set underline.',
      'Focus ring is 2px accent, 2px offset, keyboard only.',
    ],
    reducedMotion: 'Colour transitions drop to near-zero. There is no movement to remove.',
  },
  props: [
    { name: 'href', type: 'string', description: 'Destination. Omit for a role="link" span driven by onPress.' },
    { name: 'tone', type: "'accent' | 'muted' | 'inherit'", default: "'accent'", description: 'Text colour. Hover moves accent and muted to full text colour.' },
    { name: 'underline', type: 'boolean', default: 'false', description: 'Always underline, instead of on hover only.' },
    { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disabled colour and no navigation.' },
    { name: 'target / rel / download', type: 'string', description: 'Passed to the anchor.' },
    { name: 'onPress', type: '(e: PressEvent) => void', description: 'Fires for pointer and keyboard.' },
    { name: 'children', type: 'ReactNode', description: 'Link text.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'StyleX overrides, applied last.' },
  ],
  related: ['link-button', 'button', 'breadcrumbs', 'text'],
};
export default page;
