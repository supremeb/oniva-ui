import { Bold, Italic, Link2, Redo2, Underline, Undo2 } from 'lucide-react';
import { Toolbar, ToolbarButton, ToolbarSeparator, ToolbarToggleButton } from 'oniva-ui';
import type { DocPage } from '../types';

const Bar = ({ orientation = 'horizontal', boldOn = true, disabled = false }: { orientation?: 'horizontal' | 'vertical'; boldOn?: boolean; disabled?: boolean }) => (
  <Toolbar aria-label="Text formatting" orientation={orientation}>
    <ToolbarButton aria-label="Undo" isDisabled={disabled}><Undo2 size={16} /></ToolbarButton>
    <ToolbarButton aria-label="Redo" isDisabled={disabled}><Redo2 size={16} /></ToolbarButton>
    <ToolbarSeparator />
    <ToolbarToggleButton aria-label="Bold" isSelected={boldOn} isDisabled={disabled}><Bold size={16} /></ToolbarToggleButton>
    <ToolbarToggleButton aria-label="Italic" isDisabled={disabled}><Italic size={16} /></ToolbarToggleButton>
    <ToolbarToggleButton aria-label="Underline" isDisabled={disabled}><Underline size={16} /></ToolbarToggleButton>
    <ToolbarSeparator />
    <ToolbarButton isDisabled={disabled}><Link2 size={16} /> Link</ToolbarButton>
  </Toolbar>
);

const page: DocPage = {
  slug: 'toolbar',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Toolbar',
  group: ['Components', 'Navigation'],
  sourcePath: 'components/Toolbar',
  lede: 'A grouped row of related actions that behaves as a single tab stop. Arrow keys move between buttons, so a dense editor bar costs one Tab.',
  anatomy: {
    intro: 'Four parts. The container and at least one button are required; toggles and separators are optional.',
    Render: () => <Bar />,
    parts: [
      { name: 'Container', description: 'role="toolbar", 12px radius, 4px padding, inline-flex. Roving tabindex: one tab stop.', selector: '[role="toolbar"]' },
      { name: 'Button', description: 'ToolbarButton: 32px tall, 8px radius, 14px text, 8px side padding. Icon-only buttons need an aria-label.', selector: '[role="toolbar"] button:first-of-type' },
      { name: 'Toggle button', description: 'ToolbarToggleButton keeps pressed state; aria-pressed="true" fills the button.', selector: '[aria-pressed="true"]' },
      { name: 'Separator', description: '1px line with 4px margin that runs perpendicular to the toolbar axis.', selector: 'div[role="separator"]:first-of-type' },
    ],
  },
  usage: {
    use: ['Editor formatting bars and canvas tools.', 'Table or chart controls grouped above content.', 'Any 4+ related actions where Tab stops would add up.'],
    avoid: [
      { text: 'Two or three actions in a form. Use plain buttons.', instead: { slug: 'button-group', label: 'ButtonGroup' } },
      { text: 'Exclusive view choice.', instead: { slug: 'segmented-control', label: 'SegmentedControl' } },
      { text: 'Overflowing action lists.', instead: { slug: 'dropdown-menu', label: 'DropdownMenu' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'orientation', label: 'Orientation', options: ['horizontal', 'vertical'] },
      { kind: 'toggle', key: 'boldOn', label: 'Bold pressed' },
      { kind: 'toggle', key: 'disabled', label: 'Disabled' },
    ],
    initial: { orientation: 'horizontal', boldOn: true, disabled: false },
    render: (p, ev) => <div onClick={() => ev('onPress')}><Bar orientation={p.orientation as 'horizontal' | 'vertical'} boldOn={Boolean(p.boldOn)} disabled={Boolean(p.disabled)} /></div>,
    code: (p) => `<Toolbar aria-label="Text formatting"${p.orientation === 'vertical' ? ' orientation="vertical"' : ''}>\n  <ToolbarButton aria-label="Undo"${p.disabled ? ' isDisabled' : ''}><Undo2 /></ToolbarButton>\n  <ToolbarSeparator />\n  <ToolbarToggleButton aria-label="Bold"${p.boldOn ? ' isSelected' : ''}><Bold /></ToolbarToggleButton>\n</Toolbar>`,
  },
  states: [
    { name: 'Default', description: 'Bold pressed.', Render: () => <Bar /> },
    { name: 'Nothing pressed', description: 'Toggles at rest.', Render: () => <Bar boldOn={false} /> },
    { name: 'Disabled', description: 'Every control dimmed; focus skips them.', Render: () => <Bar disabled /> },
    { name: 'Vertical', description: 'Separators turn horizontal; Up and Down arrows move.', Render: () => <Bar orientation="vertical" /> },
  ],
  sections: [
    { type: 'rules', id: 'tb-recipes', title: 'Composition recipes', items: [{ title: 'Editor', body: 'History, formatting, insert, separated by ToolbarSeparator.' }, { title: 'With tooltips', body: 'Wrap icon-only buttons in Tooltip so names are visible.' }, { title: 'Overflow', body: 'Move the last group into a DropdownMenu below your narrowest width.' }] },
    { type: 'numbered', id: 'tb-grouping', title: 'Grouping', items: [{ title: 'Group by function', body: 'Undo and Redo together, then formatting, then insert.' }, { title: 'Max 12 controls', body: 'More needs a second row or a menu.' }, { title: 'Pressed means on', body: 'Use toggles for states that stay on, buttons for one-shot actions.' }] },
  ],
  content: { rules: [{ title: 'Icon buttons get aria-labels', body: 'Undo, Bold. Verbs or the property name.' }, { title: 'Label the toolbar', body: 'aria-label such as Text formatting.' }, { title: 'Text buttons are short', body: 'Link, Table. One word.' }] },
  accessibility: {
    keyboard: [
      { keys: ['Tab'], action: 'Enters the toolbar on the last focused control; a second Tab leaves it.' },
      { keys: ['←', '→'], action: 'Moves between controls (↑ ↓ in vertical). Does not wrap.' },
      { keys: ['Enter', 'Space'], action: 'Activates a button or toggles a toggle.' },
    ],
    notes: ['role="toolbar" with aria-orientation; required aria-label.', 'Toggles expose aria-pressed.', 'Separators are role="separator" with the perpendicular orientation.', 'Buttons are 32px; ensure a 24px minimum gap target and add spacing for touch.'],
    reducedMotion: 'Hover and pressed fills change instantly.',
  },
  props: [
    { name: 'Toolbar.orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout and arrow keys.' },
    { name: 'Toolbar.aria-label', type: 'string', description: 'Required. Toolbar name.' },
    { name: 'ToolbarButton', type: 'RAC Button props', description: 'onPress, isDisabled, aria-label, children.' },
    { name: 'ToolbarToggleButton.isSelected / defaultSelected', type: 'boolean', description: 'Controlled or initial pressed state.' },
    { name: 'ToolbarToggleButton.onChange', type: '(selected: boolean) => void', description: 'Fires when toggled.' },
    { name: 'ToolbarSeparator.xstyle', type: 'StyleXStyles', description: 'Separator overrides.' },
    { name: 'className / style / xstyle', type: 'string / CSSProperties / StyleXStyles', description: 'Overrides on every part.' },
  ],
  related: ['button-group', 'segmented-control', 'dropdown-menu', 'tooltip'],
};
export default page;
