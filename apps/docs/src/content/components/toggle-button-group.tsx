import { AlignCenter, AlignLeft, AlignRight, Bold, Italic } from 'lucide-react';
import { ToggleButton, ToggleButtonGroup } from 'oniva-ui';
import type { DocPage } from '../types';

const Range = ({ variant, size }: { variant?: 'segmented' | 'secondary' | 'ghost' | 'soft'; size?: 'xs' | 'sm' | 'md' | 'lg' }) => (
  <ToggleButtonGroup aria-label="Date range" selectionMode="single" defaultSelectedKeys={['30d']} variant={variant} size={size}>
    <ToggleButton id="7d">7 days</ToggleButton>
    <ToggleButton id="30d">30 days</ToggleButton>
    <ToggleButton id="90d">90 days</ToggleButton>
  </ToggleButtonGroup>
);

const page: DocPage = {
  slug: 'toggle-button-group',
  status: 'Stable',
  version: '0.1.0',
  importName: 'ToggleButtonGroup',
  group: ['Components', 'Actions'],
  sourcePath: 'components/ToggleButtonGroup',
  lede: 'Single or multiple selection across a set of toggle buttons. The segmented style draws an inset track with a sliding tile, for choices such as a date range that update a view at once.',
  anatomy: {
    intro: 'Four parts. The track and two or more options are required. The sliding tile exists only in single-select segmented groups.',
    Render: () => <Range />,
    parts: [
      { name: 'Track', description: 'Inline-flex container, 2px padding, 2px gap, 12px radius, recessed tertiary fill with an inner top shadow. The group name comes from aria-label.', selector: '[aria-label="Date range"]' },
      { name: 'Selected tile', description: 'Raised surface with the raised shadow and 10px radius. A SlidingIndicator animates it between options when single-select. Multiple selection draws it on the button itself.', selector: '[data-selected="true"]' },
      { name: 'Option', description: 'ToggleButton, 36px tall at md, 14px medium text. Unselected text is muted and gains an inset hover fill.', selector: '[aria-label="Date range"] > button:first-of-type, [aria-label="Date range"] > [role="radio"]:first-of-type' },
      { name: 'Sliding indicator', description: 'Absolute-positioned element behind the options. Eased with ease-in-out, 150ms. Hidden for multiple and vertical groups.', selector: '[aria-label="Date range"] > span[aria-hidden="true"], [aria-label="Date range"] > div[aria-hidden="true"]', fallback: { x: 50, y: 50 } },
    ],
  },
  usage: {
    use: ['Switching a data window: 7, 30, 90 days.', 'Picking one of two to five view modes: List, Grid.', 'Multi-select formatting toggles with selectionMode="multiple".'],
    avoid: [
      { text: 'Switching between content panels.', instead: { slug: 'tabs', label: 'Tabs' } },
      { text: 'A single on/off control.', instead: { slug: 'toggle-button', label: 'ToggleButton' } },
      { text: 'More than five options or long labels.', instead: { slug: 'select', label: 'Select' } },
      { text: 'Form answers that are submitted later.', instead: { slug: 'radio-group', label: 'RadioGroup' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'variant', label: 'Variant', options: ['segmented', 'secondary', 'ghost', 'soft'] },
      { kind: 'segmented', key: 'size', label: 'Size', options: ['xs', 'sm', 'md', 'lg'] },
      { kind: 'segmented', key: 'selectionMode', label: 'Selection', options: ['single', 'multiple'] },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { variant: 'segmented', size: 'md', selectionMode: 'single', isDisabled: false },
    render: (p, ev) => (
      <ToggleButtonGroup
        key={String(p.selectionMode)}
        aria-label="Date range"
        variant={p.variant as 'segmented'}
        size={p.size as 'md'}
        selectionMode={p.selectionMode as 'single'}
        defaultSelectedKeys={['30d']}
        isDisabled={Boolean(p.isDisabled)}
        onSelectionChange={(keys) => ev(`onSelectionChange: ${[...keys].join(', ') || 'none'}`)}
      >
        <ToggleButton id="7d">7 days</ToggleButton>
        <ToggleButton id="30d">30 days</ToggleButton>
        <ToggleButton id="90d">90 days</ToggleButton>
      </ToggleButtonGroup>
    ),
    code: (p) => {
      const attrs = [p.variant !== 'segmented' && `variant="${p.variant}"`, p.size !== 'md' && `size="${p.size}"`, `selectionMode="${p.selectionMode}"`, p.isDisabled && 'isDisabled'].filter(Boolean).join(' ');
      return `<ToggleButtonGroup aria-label="Date range" ${attrs} defaultSelectedKeys={['30d']}>\n  <ToggleButton id="7d">7 days</ToggleButton>\n  <ToggleButton id="30d">30 days</ToggleButton>\n  <ToggleButton id="90d">90 days</ToggleButton>\n</ToggleButtonGroup>`;
    },
  },
  states: [
    { name: 'Segmented, single', description: 'Default. One tile slides between options.', Render: () => <Range /> },
    { name: 'Secondary buttons', description: 'Separate bordered buttons, 8px gap. Selected buttons take the accent tint.', Render: () => <Range variant="secondary" /> },
    {
      name: 'Multiple with icons',
      description: 'Independent toggles. Each selected one draws its own tile.',
      Render: () => (
        <ToggleButtonGroup aria-label="Text style" selectionMode="multiple" defaultSelectedKeys={['b']} size="sm">
          <ToggleButton id="b" isIconOnly aria-label="Bold"><Bold size={14} /></ToggleButton>
          <ToggleButton id="i" isIconOnly aria-label="Italic"><Italic size={14} /></ToggleButton>
        </ToggleButtonGroup>
      ),
    },
    {
      name: 'Alignment, icon only',
      description: 'Single select with icon options at sm (32px).',
      Render: () => (
        <ToggleButtonGroup aria-label="Alignment" selectionMode="single" defaultSelectedKeys={['l']} size="sm">
          <ToggleButton id="l" isIconOnly aria-label="Left"><AlignLeft size={14} /></ToggleButton>
          <ToggleButton id="c" isIconOnly aria-label="Center"><AlignCenter size={14} /></ToggleButton>
          <ToggleButton id="r" isIconOnly aria-label="Right"><AlignRight size={14} /></ToggleButton>
        </ToggleButtonGroup>
      ),
    },
    {
      name: 'Disabled',
      description: 'Whole group disabled.',
      Render: () => (
        <ToggleButtonGroup aria-label="Date range" selectionMode="single" defaultSelectedKeys={['30d']} isDisabled>
          <ToggleButton id="7d">7 days</ToggleButton>
          <ToggleButton id="30d">30 days</ToggleButton>
          <ToggleButton id="90d">90 days</ToggleButton>
        </ToggleButtonGroup>
      ),
    },
    {
      name: 'Vertical',
      description: 'orientation="vertical" stacks options. No sliding tile.',
      Render: () => (
        <ToggleButtonGroup aria-label="Density" orientation="vertical" selectionMode="single" defaultSelectedKeys={['cozy']} variant="secondary">
          <ToggleButton id="compact">Compact</ToggleButton>
          <ToggleButton id="cozy">Cozy</ToggleButton>
        </ToggleButtonGroup>
      ),
    },
  ],
  sections: [
    {
      type: 'rules', id: 'rules', title: 'Rules',
      items: [
        { title: 'Two to five options', body: 'Past five the track outgrows a 480px column. Switch to Select.' },
        { title: 'Selection applies now', body: 'Changing the choice updates the view immediately. If it needs a Save step, use RadioGroup.' },
        { title: 'Keep one selected', body: 'In single mode pass defaultSelectedKeys. Set disallowEmptySelection to stop the user clearing it.' },
      ],
    },
    {
      type: 'dodont', id: 'do-and-dont', title: 'Do and don’t',
      items: [
        { kind: 'do', caption: 'Parallel, short labels with a default selected.', example: () => <Range /> },
        {
          kind: 'dont',
          caption: 'Long labels that force the track to wrap or scroll.',
          example: () => (
            <ToggleButtonGroup aria-label="Report" selectionMode="single" defaultSelectedKeys={['a']} variant="secondary">
              <ToggleButton id="a">Revenue by customer segment</ToggleButton>
              <ToggleButton id="b">Net retention cohorts</ToggleButton>
            </ToggleButtonGroup>
          ),
        },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Parallel labels', body: '7 days, 30 days, 90 days. Same unit, same grammar.' },
      { title: 'Under 12 characters', body: 'Each option stays under about 100px at md.' },
      { title: 'Icon-only options', body: 'Each needs an aria-label. Provide a visible label for the group elsewhere or use aria-label on the group.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus into the group (to the selected option, or the first), then out.' },
      { keys: ['←', '→'], action: 'Single selection: moves focus and selection to the neighbouring option. Wraps at the ends. Vertical groups use ↑ and ↓.' },
      { keys: ['Space', 'Enter'], action: 'Multiple selection: toggles the focused option.' },
    ],
    notes: [
      'Built on React Aria ToggleButtonGroup. Single selection exposes role="radiogroup" with role="radio" options and aria-checked. Multiple selection exposes role="toolbar" with aria-pressed buttons.',
      'Give the group an aria-label or aria-labelledby, for example "Date range".',
      'The sliding tile is decorative and aria-hidden.',
      'Touch target: md is 36px tall, below 44px. Use lg and 8px spacing in touch layouts.',
    ],
    reducedMotion: 'The tile jumps to the new option without sliding and colour transitions drop to 0.01ms.',
  },
  props: [
    { name: 'selectionMode', type: "'single' | 'multiple'", default: "'single'", description: 'Single exposes radio semantics, multiple exposes pressed buttons.' },
    { name: 'selectedKeys / defaultSelectedKeys', type: 'Iterable<Key>', description: 'Controlled or initial selection, matched against each ToggleButton id.' },
    { name: 'onSelectionChange', type: '(keys: Set<Key>) => void', description: 'Fires when the selection changes.' },
    { name: 'disallowEmptySelection', type: 'boolean', default: 'false', description: 'Keeps at least one option selected.' },
    { name: 'variant', type: "'segmented' | 'secondary' | 'ghost' | 'soft'", default: "'segmented'", description: 'Segmented draws a recessed track. Others render separate buttons with an 8px gap.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Passed to every ToggleButton.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout axis and arrow key axis.' },
    { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disables all options.' },
    { name: 'aria-label', type: 'string', description: 'Accessible name for the group.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'StyleX overrides for the track.' },
  ],
  related: ['toggle-button', 'segmented-control', 'tabs', 'radio-group', 'button-group'],
};
export default page;
