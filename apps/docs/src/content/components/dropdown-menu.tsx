import { Copy, Pencil, Trash2 } from 'lucide-react';
import { Button, Kbd } from 'oniva-ui';
import type { DocPage } from '../types';

// The open menu is a popover. The stage composes the same surface and item rows (200px min, 12px radius,
// 4px padding, 8px item radius, 14px text) under a real trigger Button.
const Item = ({ icon, label, shortcut, danger, active, disabled }: { icon?: React.ReactNode; label: string; shortcut?: string; danger?: boolean; active?: boolean; disabled?: boolean }) => (
  <div role="menuitem" aria-disabled={disabled || undefined} data-part={active ? 'active' : danger ? 'danger' : undefined} style={{ alignItems: 'center', background: active ? 'var(--oniva-color-surface-hover)' : 'transparent', borderRadius: 8, color: disabled ? 'var(--oniva-color-text-disabled)' : danger ? 'var(--oniva-color-text-error)' : 'var(--oniva-color-text)', display: 'flex', fontSize: 14, gap: 8, padding: '6px 8px' }}>
    {icon}<span style={{ flexGrow: 1 }}>{label}</span>{shortcut && <Kbd>{shortcut}</Kbd>}
  </div>
);
const Menu = ({ danger = true, disabled = false, label = 'Actions' }: { danger?: boolean; disabled?: boolean; label?: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <Button variant="secondary">{label}</Button>
    <div role="menu" aria-label="Invoice actions" style={{ background: 'var(--oniva-color-surface)', border: '1px solid var(--oniva-color-border)', borderRadius: 12, boxShadow: 'var(--oniva-shadow-dropdown)', display: 'flex', flexDirection: 'column', gap: 2, minWidth: 200, padding: 4 }}>
      <Item active icon={<Pencil size={16} />} label="Edit invoice" shortcut="⌘E" />
      <Item icon={<Copy size={16} />} label="Duplicate" disabled={disabled} />
      <div role="separator" style={{ background: 'var(--oniva-color-separator)', height: 1, margin: '2px 0' }} />
      {danger && <Item danger icon={<Trash2 size={16} />} label="Delete" />}
    </div>
  </div>
);

const page: DocPage = {
  slug: 'dropdown-menu',
  status: 'Stable',
  version: '0.1.0',
  importName: 'DropdownMenu',
  group: ['Components', 'Overlays'],
  sourcePath: 'components/DropdownMenu',
  lede: 'A list of actions opened from a button. Arrow keys move, type-ahead jumps, Enter runs.',
  anatomy: {
    intro: 'Five parts. The trigger, surface and items are always present; separators and shortcuts are optional.',
    Render: () => <Menu />,
    parts: [
      { name: 'Trigger', description: 'Any pressable. aria-haspopup="menu", aria-expanded follows state.', selector: 'button' },
      { name: 'Surface', description: '200px minimum width, 12px radius, 4px padding, 2px gap, floating shadow.', selector: '[role="menu"]' },
      { name: 'Active item', description: '8px radius, 6px by 8px padding, 14px text, 16px icon, 8px gap. Highlight follows keyboard and hover.', selector: '[data-part="active"]' },
      { name: 'Separator', description: '1px line that splits unrelated groups. Use DropdownMenuSection with a title for labelled groups.', selector: '[role="separator"]' },
      { name: 'Danger item', description: 'variant="danger" colors the row with the error text token. Keep it last, below a separator.', selector: '[data-part="danger"]' },
    ],
  },
  usage: {
    use: ['Row or card actions: Edit, Duplicate, Delete.', 'Overflow menus that hold secondary toolbar actions.', 'Account and workspace switchers with 3 to 10 items.'],
    avoid: [
      { text: 'Choosing a form value.', instead: { slug: 'select', label: 'Select' } },
      { text: 'Right-click on a region.', instead: { slug: 'context-menu', label: 'ContextMenu' } },
      { text: 'Anything with inputs or checkboxes beyond simple toggles.', instead: { slug: 'popover', label: 'Popover' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'text', key: 'label', label: 'Trigger label', presets: ['Actions', 'More'] },
      { kind: 'toggle', key: 'danger', label: 'Danger item' },
      { kind: 'toggle', key: 'disabled', label: 'Disable Duplicate' },
      { kind: 'select', key: 'placement', label: 'Placement', options: ['bottom start', 'bottom end', 'top start', 'right top'] },
    ],
    initial: { label: 'Actions', danger: true, disabled: false, placement: 'bottom start' },
    render: (p, ev) => <div onClick={() => ev('onAction("edit")')}><Menu label={String(p.label)} danger={Boolean(p.danger)} disabled={Boolean(p.disabled)} /></div>,
    code: (p) => `<DropdownMenu>\n  <Button variant="secondary">${p.label}</Button>\n  <DropdownMenuContent${p.placement !== 'bottom start' ? ` placement="${p.placement}"` : ''} onAction={run}>\n    <DropdownMenuItem id="edit" icon={<Pencil />} shortcut="⌘E">Edit invoice</DropdownMenuItem>\n    <DropdownMenuItem id="duplicate"${p.disabled ? ' isDisabled' : ''}>Duplicate</DropdownMenuItem>\n${p.danger ? '    <DropdownMenuSeparator />\n    <DropdownMenuItem id="delete" variant="danger">Delete</DropdownMenuItem>\n' : ''}  </DropdownMenuContent>\n</DropdownMenu>`,
  },
  states: [
    { name: 'Default', description: 'First item highlighted from the keyboard.', Render: () => <Menu /> },
    { name: 'Disabled item', description: 'Skipped by arrow keys, announced as dimmed.', Render: () => <Menu disabled /> },
    { name: 'No danger', description: 'Menus without destructive actions have no separator tail.', Render: () => <Menu danger={false} /> },
    { name: 'Long label', description: 'Trigger grows; the menu keeps its 200px minimum.', Render: () => <Menu label="Invoice INV-1042 actions" /> },
  ],
  sections: [
    { type: 'text', id: 'choosing-an-overlay', title: 'Choosing an overlay', body: <>Menus are for commands, popovers for controls. The <a href="#/components/dialog">comparison on Dialog</a> covers the rest.</> },
    {
      type: 'itemTypes', id: 'item-types', title: 'Item types', intro: 'Everything inside the menu surface.',
      items: [
        { name: 'DropdownMenuItem', description: 'Action row with optional icon and shortcut.', Render: () => <div style={{ width: 200 }}><Item icon={<Pencil size={16} />} label="Edit invoice" shortcut="⌘E" /></div> },
        { name: 'Danger variant', description: 'Destructive action in error color.', Render: () => <div style={{ width: 200 }}><Item danger icon={<Trash2 size={16} />} label="Delete" /></div> },
        { name: 'DropdownMenuSection', description: 'Titled group of items with 12px muted heading.', Render: () => <div style={{ width: 200 }}><div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 12, padding: '6px 8px' }}>Export</div><Item label="PDF" /></div> },
        { name: 'DropdownMenuSubmenu', description: 'Item that opens a nested menu on hover, Right arrow or Enter.', Render: () => <div style={{ width: 200 }}><Item label="Move to ›" /></div> },
      ],
    },
  ],
  content: { rules: [{ title: 'Verb first', body: 'Edit invoice, Duplicate, Archive.' }, { title: 'Sentence case', body: 'Move to folder, not Move To Folder.' }, { title: 'Delete last', body: 'Separate it and color it danger.' }, { title: 'Under 8 items', body: 'Group with sections beyond that, or use a CommandPalette.' }] },
  accessibility: {
    keyboard: [
      { keys: ['Enter', 'Space', '↓'], action: 'Opens the menu from the trigger and focuses the first item.' },
      { keys: ['↑', '↓'], action: 'Moves between items; disabled items are skipped.' },
      { keys: ['→'], action: 'Opens a submenu. ← closes it.' },
      { keys: ['A–Z'], action: 'Type-ahead to the matching item.' },
      { keys: ['Enter', 'Space'], action: 'Runs the item and closes the menu.' },
      { keys: ['Esc'], action: 'Closes and returns focus to the trigger.' },
    ],
    notes: ['role="menu" with role="menuitem" children; shortcuts are shown but you must bind them yourself.', 'Icons are decorative; the label is the accessible name.', 'Items are 32px tall; add padding for coarse pointers if needed.'],
    reducedMotion: 'The pop-in scale is removed; the menu appears immediately.',
  },
  props: [
    { name: 'DropdownMenu', type: 'MenuTrigger props', description: 'Wraps a trigger and DropdownMenuContent. Supports isOpen, defaultOpen, onOpenChange.' },
    { name: 'DropdownMenuContent.placement', type: 'Placement', default: "'bottom start'", description: 'Menu side.' },
    { name: 'DropdownMenuContent.offset', type: 'number', default: '4', description: 'Gap from the trigger.' },
    { name: 'DropdownMenuContent.onAction', type: '(key: Key) => void', description: 'Fires with the item id.' },
    { name: 'DropdownMenuContent.triggerRef', type: 'RefObject', description: 'Anchor other than the trigger.' },
    { name: 'DropdownMenuContent.xstyle', type: 'StyleXStyles', description: 'Surface overrides.' },
    { name: 'DropdownMenuItem.icon', type: 'ReactNode', description: '16px leading icon.' },
    { name: 'DropdownMenuItem.shortcut', type: 'string', description: 'Trailing Kbd text.' },
    { name: 'DropdownMenuItem.variant', type: "'default' | 'danger'", default: "'default'", description: 'Danger color.' },
    { name: 'DropdownMenuItem.id / isDisabled / href / onAction', type: 'RAC MenuItem props', description: 'Identity, disabled and link behavior.' },
    { name: 'DropdownMenuSection.title', type: 'ReactNode', description: 'Group heading.' },
    { name: 'DropdownMenuSubmenu.delay', type: 'number', description: 'Hover delay before the submenu opens.' },
    { name: 'DropdownMenuSeparator', type: 'component', description: '1px divider.' },
  ],
  related: ['context-menu', 'popover', 'select', 'command-palette'],
};
export default page;
