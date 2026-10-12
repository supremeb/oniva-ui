import { Bell, CreditCard, ShieldCheck, TriangleAlert } from 'lucide-react';
import { Icon } from 'oniva-ui';
import type { DocPage } from '../types';

const icons = { Bell, CreditCard, ShieldCheck, TriangleAlert };

const Sample = () => <Icon icon={TriangleAlert} tone="warning" size="lg" label="Payment overdue" />;

const page: DocPage = {
  slug: 'icon',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Icon',
  group: ['Components', 'Primitives'],
  sourcePath: 'components/Icon',
  lede: 'A lucide wrapper with size and tone tokens. It handles two cases: decorative glyphs hidden from assistive tech, and meaningful glyphs with an accessible label.',
  anatomy: {
    intro: 'Two parts. The SVG is always present. The label is optional: with it the icon is an image, without it the icon is hidden.',
    Render: Sample,
    parts: [
      { name: 'Glyph', description: 'Lucide SVG, 2px stroke by default. Sizes: xs 12, sm 14, md 16, lg 20, xl 24px. flex-shrink 0, inline-block.', selector: 'svg' },
      { name: 'Accessible label', description: 'label sets role="img" and aria-label. Without it the SVG gets aria-hidden="true".', selector: 'svg[role="img"]' },
      { name: 'Tone', description: 'Colour from tokens: muted, subtle, accent, success, warning, danger, info. Default inherits currentColor.', selector: 'svg', fallback: { x: 50, y: 50 } },
    ],
  },
  usage: {
    use: ['Glyphs beside text in menus, lists and badges.', 'Status icons that need a tone: success, warning, danger.', 'Standalone meaningful icons with a label.'],
    avoid: [
      { text: 'A clickable icon.', instead: { slug: 'icon-button', label: 'IconButton' } },
      { text: 'A loading indicator.', instead: { slug: 'spinner', label: 'Spinner' } },
      { text: 'An image or logo.', instead: { slug: 'avatar', label: 'Avatar' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'select', key: 'icon', label: 'Icon', options: ['Bell', 'CreditCard', 'ShieldCheck', 'TriangleAlert'] },
      { kind: 'segmented', key: 'size', label: 'Size', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
      { kind: 'segmented', key: 'tone', label: 'Tone', options: ['default', 'muted', 'subtle', 'accent', 'success', 'warning', 'danger', 'info'] },
      { kind: 'text', key: 'label', label: 'Accessible label (empty = decorative)', presets: ['', 'Payment overdue', 'Verified'] },
    ],
    initial: { icon: 'TriangleAlert', size: 'lg', tone: 'warning', label: 'Payment overdue' },
    render: (p) => <Icon icon={icons[p.icon as keyof typeof icons]} size={p.size as 'lg'} tone={p.tone as 'default'} label={p.label ? String(p.label) : undefined} />,
    code: (p) => {
      const attrs = [`icon={${p.icon}}`, p.size !== 'md' && `size="${p.size}"`, p.tone !== 'default' && `tone="${p.tone}"`, p.label && `label="${p.label}"`].filter(Boolean).join(' ');
      return `<Icon ${attrs} />`;
    },
  },
  states: [
    { name: 'Decorative', description: 'No label. aria-hidden, skipped by screen readers.', Render: () => <Icon icon={CreditCard} tone="muted" size="lg" /> },
    { name: 'Labelled', description: 'role="img" with aria-label. Announced as "Payment overdue, image".', Render: Sample },
    { name: 'Success', description: 'Success solid colour for confirmed states.', Render: () => <Icon icon={ShieldCheck} tone="success" size="lg" label="Verified" /> },
    { name: 'Accent', description: 'Accent soft foreground.', Render: () => <Icon icon={Bell} tone="accent" size="lg" /> },
    { name: 'Inherits colour', description: 'Default tone is currentColor, so it follows the parent text.', Render: () => <span style={{ color: 'var(--oniva-color-text-error)', display: 'inline-flex', gap: 6, alignItems: 'center' }}><Icon icon={TriangleAlert} size="md" /> Declined</span> },
    { name: 'Thin stroke', description: 'strokeWidth={1.5} for large xl glyphs.', Render: () => <Icon icon={Bell} size="xl" strokeWidth={1.5} /> },
  ],
  sections: [
    {
      type: 'itemTypes', id: 'sizes', title: 'Sizes', intro: 'Five sizes, tied to type size.',
      items: (['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => ({
        name: `${s}, ${{ xs: 12, sm: 14, md: 16, lg: 20, xl: 24 }[s]}px`,
        description: { xs: 'Inside tags and dense tables.', sm: 'Inline with 13px text.', md: 'Default. Buttons and inputs.', lg: 'Empty states and cards.', xl: 'Feature headers.' }[s],
        Render: () => <Icon icon={Bell} size={s} />,
      })),
    },
    {
      type: 'rules', id: 'rules', title: 'Rules',
      items: [
        { title: 'Decorative by default', body: 'If text beside the icon already says it, leave label off.' },
        { title: 'Colour carries meaning', body: 'Never rely on tone alone. Pair a danger icon with words.' },
        { title: 'Match the text size', body: 'xs next to 12px, sm next to 13px, md next to 14 and 16px.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Label states the meaning', body: '"Payment overdue", not "Warning icon".' },
      { title: 'No "icon" or "image" in the label', body: 'The role already says it.' },
      { title: 'Translate it', body: 'Labels are user-facing text and belong in your i18n files.' },
    ],
  },
  accessibility: {
    keyboard: [{ keys: ['None'], action: 'Not interactive. Wrap in a Button or IconButton to make it so.' }],
    notes: [
      'Without label: aria-hidden="true". With label: role="img" and aria-label.',
      'Stroke icons follow colour contrast rules for graphics: 3:1 against the surface. Tone tokens meet that.',
      'In forced-colors mode the SVG strokes follow currentColor.',
    ],
    reducedMotion: 'No motion.',
  },
  props: [
    { name: 'icon', type: 'LucideIcon', description: 'The lucide component, for example Bell.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: '12, 14, 16, 20, 24px.' },
    { name: 'tone', type: "'default' | 'muted' | 'subtle' | 'accent' | 'success' | 'warning' | 'danger' | 'info'", default: "'default'", description: 'Colour token.' },
    { name: 'label', type: 'string', description: 'Accessible name. Omit for decorative.' },
    { name: 'strokeWidth', type: 'number', default: '2', description: 'Lucide stroke width.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'StyleX overrides, applied last.' },
    { name: 'ref', type: 'Ref<SVGSVGElement>', description: 'Forwarded to the svg.' },
  ],
  related: ['icon-button', 'button', 'badge', 'alert'],
};
export default page;
