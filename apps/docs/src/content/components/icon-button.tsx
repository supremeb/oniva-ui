import { Bell, Download, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { IconButton } from 'oniva-ui';
import type { DocPage } from '../types';

const page: DocPage = {
  slug: 'icon-button',
  status: 'Stable',
  version: '0.1.0',
  importName: 'IconButton',
  group: ['Components', 'Actions'],
  sourcePath: 'components/IconButton',
  lede: 'A square, icon-only Button that shares its variants and sizes. It handles toolbar actions, row actions and menu triggers where text would not fit.',
  anatomy: {
    intro: 'Two parts. The icon is required and the accessible name is required. There is no visible label.',
    Render: () => (
      <IconButton aria-label="Download invoice" variant="secondary">
        <Download size={16} />
      </IconButton>
    ),
    parts: [
      { name: 'Container', description: 'Native button, square: 24, 32, 36 or 40px for xs, sm, md, lg. Radius 4, 8, 10, 10px. 1px border on secondary, none on ghost and soft.', selector: 'button' },
      { name: 'Icon', description: '16px lucide icon (12px at xs, 18px at lg by convention). Centred. Pass it as a child; the button never adds its own.', selector: 'button svg' },
    ],
  },
  usage: {
    use: ['Toolbar and table row actions: download, edit, more.', 'Menu triggers with a three-dot or chevron glyph.', 'Repeated, universally understood actions: add, close, refresh.'],
    avoid: [
      { text: 'Actions whose icon is ambiguous. Add the word.', instead: { slug: 'button', label: 'Button' } },
      { text: 'Dismissing a panel or alert.', instead: { slug: 'close-button', label: 'CloseButton' } },
      { text: 'A control that stays on or off.', instead: { slug: 'toggle-button', label: 'ToggleButton' } },
      { text: 'Navigating to another page.', instead: { slug: 'link-button', label: 'LinkButton' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'variant', label: 'Variant', options: ['primary', 'secondary', 'ghost', 'soft', 'danger'] },
      { kind: 'segmented', key: 'size', label: 'Size', options: ['xs', 'sm', 'md', 'lg'] },
      { kind: 'text', key: 'label', label: 'Accessible label', presets: ['Download invoice', 'More actions', 'Notifications'] },
      { kind: 'toggle', key: 'isLoading', label: 'Loading' },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { variant: 'secondary', size: 'md', label: 'Download invoice', isLoading: false, isDisabled: false },
    render: (p, ev) => (
      <IconButton variant={p.variant as 'secondary'} size={p.size as 'md'} aria-label={String(p.label)} isLoading={Boolean(p.isLoading)} isDisabled={Boolean(p.isDisabled)} onPress={() => ev('onPress')}>
        <Download size={p.size === 'xs' ? 12 : p.size === 'lg' ? 18 : 16} />
      </IconButton>
    ),
    code: (p) => {
      const sz = p.size === 'xs' ? 12 : p.size === 'lg' ? 18 : 16;
      const attrs = [p.variant !== 'secondary' && `variant="${p.variant}"`, p.size !== 'md' && `size="${p.size}"`, p.isLoading && 'isLoading', p.isDisabled && 'isDisabled'].filter(Boolean).join(' ');
      return `<IconButton aria-label="${p.label}"${attrs ? ' ' + attrs : ''} onPress={download}>\n  <Download size={${sz}} />\n</IconButton>`;
    },
  },
  states: [
    { name: 'Default', description: 'Secondary, 36px square.', Render: () => <IconButton aria-label="Download invoice"><Download size={16} /></IconButton> },
    { name: 'Primary', description: 'One per surface, for the main icon action.', Render: () => <IconButton aria-label="Add" variant="primary"><Plus size={16} /></IconButton> },
    { name: 'Ghost', description: 'Lowest emphasis, for dense rows.', Render: () => <IconButton aria-label="More" variant="ghost"><MoreHorizontal size={16} /></IconButton> },
    { name: 'Soft', description: 'Accent-tinted fill.', Render: () => <IconButton aria-label="Notifications" variant="soft"><Bell size={16} /></IconButton> },
    { name: 'Danger', description: 'Destructive. Pair with a confirmation.', Render: () => <IconButton aria-label="Delete invoice" variant="danger"><Trash2 size={16} /></IconButton> },
    { name: 'Disabled', description: '50% opacity, not focusable by pointer.', Render: () => <IconButton aria-label="Download invoice" isDisabled><Download size={16} /></IconButton> },
    { name: 'Loading', description: 'Spinner replaces the icon in place. Size does not change.', Render: () => <IconButton aria-label="Downloading" isLoading><Download size={16} /></IconButton> },
  ],
  sections: [
    {
      type: 'itemTypes', id: 'sizes', title: 'Sizes', intro: 'Four squares. Pick the size that matches the surrounding text row.',
      items: [
        { name: 'xs, 24px', description: 'Inside tags and dense tables. 12px icon.', Render: () => <IconButton aria-label="Add" size="xs"><Plus size={12} /></IconButton> },
        { name: 'sm, 32px', description: 'Toolbars and card headers. 16px icon.', Render: () => <IconButton aria-label="Add" size="sm"><Plus size={16} /></IconButton> },
        { name: 'md, 36px', description: 'Default. Sits beside a md Button.', Render: () => <IconButton aria-label="Add" size="md"><Plus size={16} /></IconButton> },
        { name: 'lg, 40px', description: 'Touch-first layouts. 18px icon.', Render: () => <IconButton aria-label="Add" size="lg"><Plus size={18} /></IconButton> },
      ],
    },
    {
      type: 'rules', id: 'rules', title: 'Rules',
      items: [
        { title: 'Always name it', body: 'aria-label is a required prop. Say what the button does, not what the icon looks like: "Download invoice", not "Arrow".' },
        { title: 'Add a tooltip', body: 'A Tooltip with the same text helps sighted users who do not know the glyph. Link them to the same string.' },
        { title: 'Stay in the row', body: 'Icon buttons in a row use one variant and one size. Put destructive ones last.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Verb + object', body: 'Download invoice, Delete row. Sentence case, no period.' },
      { title: 'State the toggle target', body: 'If the label changes with state, name the action you will take: "Mute alerts", then "Unmute alerts".' },
      { title: 'Match the tooltip', body: 'Tooltip text and aria-label are identical.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['Enter', 'Space'], action: 'Activates the button.' },
      { keys: ['Tab'], action: 'Moves focus to or past the button.' },
    ],
    notes: [
      'Renders a native button with aria-label. The TypeScript type makes aria-label required.',
      'Loading sets aria-busy and ignores presses; the label stays in the accessible name.',
      'Touch target: xs (24px) and sm (32px) are below 44px. Space them at least 8px apart or use lg on touch layouts.',
      'Focus ring is 2px accent, 2px offset, keyboard only.',
    ],
    reducedMotion: 'Press scale and the loading spinner fall back to opacity-only.',
  },
  props: [
    { name: 'aria-label', type: 'string', description: 'Required accessible name.' },
    { name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'soft' | 'danger'", default: "'secondary'", description: 'Visual style. Note that IconButton defaults to secondary while Button defaults to primary.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Square 24, 32, 36, 40px.' },
    { name: 'isLoading', type: 'boolean', default: 'false', description: 'Shows a spinner and blocks presses.' },
    { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disables interaction.' },
    { name: 'children', type: 'ReactNode', description: 'The icon.' },
    { name: 'onPress', type: '(e: PressEvent) => void', description: 'Fires for pointer, keyboard and touch.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'StyleX overrides, applied last.' },
  ],
  related: ['button', 'close-button', 'toggle-button', 'tooltip', 'dropdown-menu'],
};
export default page;
