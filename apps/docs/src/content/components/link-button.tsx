import { ArrowUpRight } from 'lucide-react';
import { LinkButton } from 'oniva-ui';
import type { DocPage } from '../types';

const page: DocPage = {
  slug: 'link-button',
  status: 'Stable',
  version: '0.1.0',
  importName: 'LinkButton',
  group: ['Components', 'Actions'],
  sourcePath: 'components/LinkButton',
  lede: 'An anchor that looks like a Button. It handles calls to action that change the URL: view a statement, open the dashboard, contact sales.',
  anatomy: {
    intro: 'Four parts. The anchor and label are required. Icons are optional and sit 6px from the label.',
    Render: () => (
      <LinkButton href="#/components/link-button" variant="primary" size="md" startIcon={<ArrowUpRight size={16} />}>
        Open dashboard
      </LinkButton>
    ),
    parts: [
      { name: 'Anchor', description: 'Native a with href. 36px tall at md, 10px radius, 12px horizontal padding, 1px border, inline-flex.', selector: 'a' },
      { name: 'Leading icon', description: 'startIcon slot, 16px lucide icon, aria-hidden by convention. 6px gap to the label.', selector: 'a svg' },
      { name: 'Label', description: '14px, medium weight, nowrap. Sentence case, verb first.', selector: 'a', fallback: { x: 65, y: 50 } },
      { name: 'Variant surface', description: 'Primary: flat accent fill with a contact shadow. Secondary: surface fill, 1px border, raised. Soft: accent tint. Ghost: transparent until hover.', selector: 'a', fallback: { x: 10, y: 50 } },
    ],
  },
  usage: {
    use: ['A primary call to action that goes to another page.', 'Downloading a file via href with download.', 'Matching a Button in a row where one action navigates.'],
    avoid: [
      { text: 'Running code: save, submit, open a dialog.', instead: { slug: 'button', label: 'Button' } },
      { text: 'A reference inside a sentence.', instead: { slug: 'link', label: 'Link' } },
      { text: 'A destructive action. LinkButton has no danger variant.', instead: { slug: 'button', label: 'Button' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'variant', label: 'Variant', options: ['primary', 'secondary', 'soft', 'ghost'] },
      { kind: 'segmented', key: 'size', label: 'Size', options: ['xs', 'sm', 'md', 'lg'] },
      { kind: 'text', key: 'label', label: 'Label', presets: ['View statement', 'Download PDF', 'Contact sales'] },
      { kind: 'toggle', key: 'icon', label: 'Trailing icon' },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { variant: 'primary', size: 'md', label: 'View statement', icon: false, isDisabled: false },
    render: (p, ev) => (
      <LinkButton href="#/components/link-button" variant={p.variant as 'primary'} size={p.size as 'md'} isDisabled={Boolean(p.isDisabled)} endIcon={p.icon ? <ArrowUpRight size={16} /> : undefined} onPress={() => ev('onPress')}>
        {String(p.label)}
      </LinkButton>
    ),
    code: (p) => {
      const attrs = [p.variant !== 'secondary' && `variant="${p.variant}"`, p.size !== 'md' && `size="${p.size}"`, p.isDisabled && 'isDisabled', p.icon && 'endIcon={<ArrowUpRight size={16} />}'].filter(Boolean).join(' ');
      return `<LinkButton href="/billing/statement"${attrs ? ' ' + attrs : ''}>${p.label}</LinkButton>`;
    },
  },
  states: [
    { name: 'Primary', description: 'One per view.', Render: () => <LinkButton href="#/components/link-button" variant="primary">View statement</LinkButton> },
    { name: 'Secondary', description: 'The default variant.', Render: () => <LinkButton href="#/components/link-button">Download PDF</LinkButton> },
    { name: 'Soft', description: 'Accent-tinted fill.', Render: () => <LinkButton href="#/components/link-button" variant="soft">Contact sales</LinkButton> },
    { name: 'Ghost', description: 'Lowest emphasis, for toolbars.', Render: () => <LinkButton href="#/components/link-button" variant="ghost">Docs</LinkButton> },
    { name: 'With icon', description: 'Trailing arrow signals leaving the page.', Render: () => <LinkButton href="#/components/link-button" size="sm" endIcon={<ArrowUpRight size={14} />}>Open dashboard</LinkButton> },
    { name: 'Disabled', description: '50% opacity, aria-disabled, no navigation.', Render: () => <LinkButton isDisabled>View statement</LinkButton> },
  ],
  sections: [
    {
      type: 'rules', id: 'link-vs-button', title: 'LinkButton vs Link vs Button',
      items: [
        { title: 'URL changes, needs a box', body: 'LinkButton. Right-click opens in a new tab, middle-click works, search engines follow it.' },
        { title: 'URL changes, inline', body: 'Link. No box, inherits text size.' },
        { title: 'No URL change', body: 'Button. Never wrap a Button in an anchor.' },
      ],
    },
    {
      type: 'dodont', id: 'do-and-dont', title: 'Do and don’t',
      items: [
        { kind: 'do', caption: 'Navigation that needs to stand out.', example: () => <LinkButton href="#/components/link-button" variant="primary">View statement</LinkButton> },
        { kind: 'dont', caption: 'A LinkButton for an in-page action with no URL.', example: () => <LinkButton href="#/components/link-button">Save changes</LinkButton> },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Verb + object', body: 'View statement, Open dashboard. Two to three words.' },
      { title: 'Say where it goes', body: 'If leaving the product, add the arrow icon and name the place: Open Stripe dashboard.' },
      { title: 'Downloads', body: 'Include the format: Download PDF, Download CSV.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['Enter'], action: 'Follows the link. Space does not activate a native anchor.' },
      { keys: ['Tab'], action: 'Moves focus to or past the link.' },
    ],
    notes: [
      'Announced as "link", not "button", which is correct: it navigates.',
      'Without href it renders a span with role="link". Prefer a real href.',
      'Disabled sets aria-disabled and 50% opacity. Colour contrast is exempt for disabled controls.',
      'Focus ring is 2px accent, 2px offset, keyboard only.',
    ],
    reducedMotion: 'Press scale and colour transitions drop to 0.01ms.',
  },
  props: [
    { name: 'href', type: 'string', description: 'Destination.' },
    { name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'soft'", default: "'secondary'", description: 'Visual style. No danger variant.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Height 24, 32, 36, 40.' },
    { name: 'isIconOnly', type: 'boolean', default: 'false', description: 'Square anchor. Requires aria-label.' },
    { name: 'startIcon / endIcon', type: 'ReactNode', description: 'Icons before and after the label.' },
    { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disables navigation.' },
    { name: 'target / rel / download', type: 'string', description: 'Passed to the anchor.' },
    { name: 'onPress', type: '(e: PressEvent) => void', description: 'Fires for pointer and keyboard.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'StyleX overrides, applied last.' },
  ],
  related: ['button', 'link', 'icon-button', 'button-group'],
};
export default page;
