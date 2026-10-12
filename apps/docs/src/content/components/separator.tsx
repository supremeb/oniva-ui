import { Separator } from 'oniva-ui';
import type { DocPage } from '../types';

const H = ({ strong = false, label = 'Billing' }: { strong?: boolean; label?: string }) => (
  <div style={{ fontSize: 14, width: 280 }}>
    <div>Account</div>
    <div style={{ margin: '12px 0' }}><Separator strong={strong} /></div>
    <div>{label}</div>
  </div>
);
const V = ({ strong = false }: { strong?: boolean }) => (
  <div style={{ alignItems: 'stretch', display: 'flex', fontSize: 14, gap: 12, height: 24 }}>
    <span>Draft</span><Separator orientation="vertical" strong={strong} /><span>12 invoices</span><Separator orientation="vertical" strong={strong} /><span>$48,210</span>
  </div>
);

const page: DocPage = {
  slug: 'separator',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Separator',
  group: ['Components', 'Layout'],
  sourcePath: 'components/Separator',
  lede: 'A 1px rule that divides content groups. Horizontal or vertical, subtle by default, stronger when the divide matters.',
  anatomy: {
    intro: 'One part with two orientations and a strength option.',
    Render: () => <H />,
    parts: [
      { name: 'Rule', description: '1px line, separator color, stretches to fill the cross axis. role="separator" with aria-orientation. strong switches to the hover border color.', selector: '[role="separator"]' },
    ],
  },
  usage: {
    use: ['Dividing groups of items inside a menu or panel.', 'Inline metadata with vertical rules: Draft | 12 invoices.', 'Dividing unrelated sections of a long form.'],
    avoid: [
      { text: 'Creating space only. Use gap.', instead: { slug: 'stack', label: 'Stack' } },
      { text: 'Framing a group of content.', instead: { slug: 'card', label: 'Card' } },
      { text: 'Dividing a menu with a titled group.', instead: { slug: 'dropdown-menu', label: 'DropdownMenu sections' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'orientation', label: 'Orientation', options: ['horizontal', 'vertical'] },
      { kind: 'toggle', key: 'strong', label: 'Strong' },
    ],
    initial: { orientation: 'horizontal', strong: false },
    render: (p) => (p.orientation === 'vertical' ? <V strong={Boolean(p.strong)} /> : <H strong={Boolean(p.strong)} />),
    code: (p) => `<Separator${p.orientation === 'vertical' ? ' orientation="vertical"' : ''}${p.strong ? ' strong' : ''} />`,
  },
  states: [
    { name: 'Horizontal', description: 'Default. 1px tall, full width of its container.', Render: () => <H /> },
    { name: 'Vertical', description: 'Needs a parent with height; stretches to it.', Render: () => <V /> },
    { name: 'Strong', description: 'Darker rule for primary divides.', Render: () => <H strong /> },
    { name: 'Strong vertical', description: 'Same, between inline items.', Render: () => <V strong /> },
  ],
  sections: [
    { type: 'rules', id: 'sep-recipes', title: 'Composition recipes', items: [{ title: 'Inline metadata', body: 'Flex with vertical Separators between spans.' }, { title: 'Form sections', body: 'Horizontal Separator between Stack groups with 24px of space either side.' }, { title: 'Decorative only', body: 'Pass elementType="div" if the rule is purely visual and should not be announced.' }] },
    { type: 'dodont', id: 'sep-dodont', title: 'Do and don\'t', items: [{ kind: 'do', caption: 'One rule between unrelated groups.', text: 'Account settings | Billing' }, { kind: 'dont', caption: 'Rules between every list item add noise.', text: 'Use spacing and hover states for list rows.' }] },
  ],
  content: { rules: [{ title: 'No labels on rules', body: 'If a divider needs words, use a heading.' }, { title: 'Space both sides evenly', body: '12px above and below for compact groups, 24px for sections.' }] },
  accessibility: {
    keyboard: [{ keys: ['Tab'], action: 'Not focusable.' }],
    notes: ['role="separator" with aria-orientation; screen readers announce a boundary.', 'For decorative rules pass elementType="div" so no role is exposed.', 'The default color is a decorative divide; do not use it as the only boundary of an input.'],
    reducedMotion: 'No motion.',
  },
  props: [
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Rule direction.' },
    { name: 'strong', type: 'boolean', default: 'false', description: 'Stronger line color.' },
    { name: 'elementType', type: 'string', description: 'Render element; use div for decorative rules.' },
    { name: 'className / style / xstyle', type: 'string / CSSProperties / StyleXStyles', description: 'Overrides.' },
  ],
  related: ['stack', 'flex', 'card', 'dropdown-menu'],
};
export default page;
