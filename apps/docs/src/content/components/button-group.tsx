import { ChevronDown } from 'lucide-react';
import { Button, ButtonGroup, IconButton } from 'oniva-ui';
import type { DocPage } from '../types';

const Cluster = ({ orientation }: { orientation?: 'horizontal' | 'vertical' }) => (
  <ButtonGroup aria-label="Invoice actions" orientation={orientation}>
    <Button variant="secondary">Send</Button>
    <Button variant="secondary">Print</Button>
    <Button variant="secondary">Archive</Button>
  </ButtonGroup>
);

const Split = () => (
  <ButtonGroup aria-label="Publish">
    <Button>Publish report</Button>
    <IconButton aria-label="More publish options" variant="primary">
      <ChevronDown size={16} />
    </IconButton>
  </ButtonGroup>
);

const page: DocPage = {
  slug: 'button-group',
  status: 'Stable',
  version: '0.1.0',
  importName: 'ButtonGroup',
  group: ['Components', 'Actions'],
  sourcePath: 'components/ButtonGroup',
  lede: 'Joins two to four related buttons into one attached cluster. It handles the moments where actions belong together: a split button, a row of sibling actions, a stacked set of choices.',
  anatomy: {
    intro: 'Four parts. The group wrapper and at least two buttons are required. The divider is the shared 1px border, not a separate element.',
    Render: Cluster,
    parts: [
      { name: 'Group', description: 'A div with role="group", inline-flex, no gap. Needs an aria-label because it has no visible name.', selector: '[role="group"]' },
      { name: 'First button', description: 'Keeps its start corners (10px at md) and loses the end corners.', selector: '[role="group"] > button:first-child' },
      { name: 'Middle button', description: 'Radius 0, pulled 1px over its neighbour with a -1px margin so borders collapse into one line.', selector: '[role="group"] > button:nth-child(2)' },
      { name: 'Last button', description: 'Keeps its end corners and loses the start corners. The hovered or focused button is raised above its neighbours (z-index 1 and 2) so its border and ring are never clipped.', selector: '[role="group"] > button:last-child' },
    ],
  },
  usage: {
    use: ['Split buttons: a primary action plus a menu trigger.', 'Two to four sibling actions of equal weight, such as Send, Print, Archive.', 'Stacked options in narrow columns with orientation="vertical".'],
    avoid: [
      { text: 'Choosing one value that stays selected.', instead: { slug: 'toggle-button-group', label: 'ToggleButtonGroup' } },
      { text: 'Switching between views or panels.', instead: { slug: 'tabs', label: 'Tabs' } },
      { text: 'More than four actions or a toolbar with mixed controls.', instead: { slug: 'toolbar', label: 'Toolbar' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'orientation', label: 'Orientation', options: ['horizontal', 'vertical'] },
      { kind: 'segmented', key: 'variant', label: 'Variant', options: ['secondary', 'ghost', 'soft'] },
      { kind: 'segmented', key: 'size', label: 'Size', options: ['sm', 'md', 'lg'] },
      { kind: 'toggle', key: 'splitLast', label: 'Disable last' },
    ],
    initial: { orientation: 'horizontal', variant: 'secondary', size: 'md', splitLast: false },
    render: (p, ev) => (
      <ButtonGroup aria-label="Invoice actions" orientation={p.orientation as 'horizontal'}>
        <Button variant={p.variant as 'secondary'} size={p.size as 'md'} onPress={() => ev('onPress: Send')}>Send</Button>
        <Button variant={p.variant as 'secondary'} size={p.size as 'md'} onPress={() => ev('onPress: Print')}>Print</Button>
        <Button variant={p.variant as 'secondary'} size={p.size as 'md'} isDisabled={Boolean(p.splitLast)} onPress={() => ev('onPress: Archive')}>Archive</Button>
      </ButtonGroup>
    ),
    code: (p) => {
      const v = p.variant !== 'primary' ? ` variant="${p.variant}"` : '';
      const s = p.size !== 'md' ? ` size="${p.size}"` : '';
      const o = p.orientation !== 'horizontal' ? ` orientation="${p.orientation}"` : '';
      return `<ButtonGroup aria-label="Invoice actions"${o}>\n  <Button${v}${s}>Send</Button>\n  <Button${v}${s}>Print</Button>\n  <Button${v}${s}${p.splitLast ? ' isDisabled' : ''}>Archive</Button>\n</ButtonGroup>`;
    },
  },
  states: [
    { name: 'Horizontal', description: 'Default. Three secondary buttons share two borders.', Render: () => <Cluster /> },
    { name: 'Vertical', description: 'Stacked, each button stretches to the widest label.', Render: () => <Cluster orientation="vertical" /> },
    { name: 'Split button', description: 'Primary action plus a 36px square icon button for the menu.', Render: Split },
    {
      name: 'One disabled',
      description: 'A disabled member drops to 50% opacity and stays in the cluster.',
      Render: () => (
        <ButtonGroup aria-label="Invoice actions">
          <Button variant="secondary">Send</Button>
          <Button variant="secondary" isDisabled>Print</Button>
          <Button variant="secondary">Archive</Button>
        </ButtonGroup>
      ),
    },
    {
      name: 'Single child',
      description: 'With one child no corner overrides apply, so it renders as a normal button.',
      Render: () => (
        <ButtonGroup aria-label="Export">
          <Button variant="secondary">Export CSV</Button>
        </ButtonGroup>
      ),
    },
  ],
  sections: [
    {
      type: 'rules', id: 'rules', title: 'Rules',
      items: [
        { title: 'One variant per group', body: 'Mixed variants break the shared border. The exception is a split button: primary plus a primary IconButton.' },
        { title: 'Cap at four', body: 'Past four the cluster outgrows a 480px column. Move the extras into a DropdownMenu.' },
        { title: 'Label the group', body: 'Always pass aria-label so screen readers announce "Invoice actions, group".' },
      ],
    },
    {
      type: 'dodont', id: 'do-and-dont', title: 'Do and don’t',
      items: [
        { kind: 'do', caption: 'Related actions, one variant.', example: Cluster },
        {
          kind: 'dont',
          caption: 'Mixed variants and sizes in one cluster.',
          example: () => (
            <ButtonGroup aria-label="Mixed">
              <Button variant="danger" size="sm">Delete</Button>
              <Button variant="soft" size="lg">Print</Button>
            </ButtonGroup>
          ),
        },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Single words', body: 'Send, Print, Archive. Verbs of one word keep each segment under 80px.' },
      { title: 'Parallel grammar', body: 'All verbs or all nouns. Never mix Send with Printing.' },
      { title: 'Icon-only members', body: 'Each needs its own aria-label that names the action, such as "More publish options".' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves through each button in order. The group adds no arrow-key navigation.' },
      { keys: ['Enter', 'Space'], action: 'Activates the focused button.' },
    ],
    notes: [
      'The wrapper is a div with role="group". Pass aria-label or aria-labelledby.',
      'Each child is a normal button, so screen readers announce "Send, button" inside the named group.',
      'The focused button is raised so its 2px focus ring is never hidden by the next button.',
      'Only valid React elements are cloned. Strings and fragments are dropped.',
    ],
    reducedMotion: 'Inherited from the buttons: press scale and colour transitions drop to 0.01ms.',
  },
  props: [
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Axis of the cluster. Vertical stretches children to equal width.' },
    { name: 'aria-label', type: 'string', description: 'Accessible name of the group. Required in practice.' },
    { name: 'children', type: 'ReactElement[]', description: 'Buttons, IconButtons or LinkButtons. The group injects corner and z-index styles through xstyle.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'StyleX overrides for the wrapper.' },
    { name: 'className', type: 'string', description: 'Extra class on the wrapper.' },
    { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Forwarded to the wrapper.' },
  ],
  related: ['button', 'icon-button', 'toggle-button-group', 'toolbar', 'link-button'],
};
export default page;
