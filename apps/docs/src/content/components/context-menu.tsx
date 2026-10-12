import { Copy, Pencil, Trash2 } from 'lucide-react';
import type { DocPage } from '../types';

// The real menu opens at the pointer in a portal. The stage draws the right-click region and the open menu
// at the pointer position using the same surface as DropdownMenu.
const Row = ({ icon, label, danger, active }: { icon: React.ReactNode; label: string; danger?: boolean; active?: boolean }) => (
  <div role="menuitem" data-part={active ? 'active' : undefined} style={{ alignItems: 'center', background: active ? 'var(--oniva-color-surface-hover)' : 'transparent', borderRadius: 8, color: danger ? 'var(--oniva-color-text-error)' : 'var(--oniva-color-text)', display: 'flex', fontSize: 14, gap: 8, padding: '6px 8px' }}>{icon}{label}</div>
);
const Demo = ({ disabled = false }: { disabled?: boolean }) => (
  <div data-part="region" style={{ background: 'var(--oniva-color-surface-inset)', border: '1px dashed var(--oniva-color-border-hover)', borderRadius: 12, height: 190, opacity: disabled ? 0.6 : 1, position: 'relative', width: 320 }}>
    <div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 14, padding: 16 }}>Invoice INV-1042 row</div>
    {!disabled && (
      <div role="menu" aria-label="Row actions" style={{ background: 'var(--oniva-color-surface)', border: '1px solid var(--oniva-color-border)', borderRadius: 12, boxShadow: 'var(--oniva-shadow-dropdown)', left: 80, minWidth: 200, padding: 4, position: 'absolute', top: 44 }}>
        <Row active icon={<Pencil size={16} />} label="Edit invoice" />
        <Row icon={<Copy size={16} />} label="Duplicate" />
        <div role="separator" style={{ background: 'var(--oniva-color-separator)', height: 1, margin: '2px 0' }} />
        <Row danger icon={<Trash2 size={16} />} label="Delete" />
      </div>
    )}
  </div>
);

const page: DocPage = {
  slug: 'context-menu',
  status: 'Stable',
  version: '0.1.0',
  importName: 'ContextMenu',
  group: ['Components', 'Overlays'],
  sourcePath: 'components/ContextMenu',
  lede: 'A menu that opens at the pointer on right-click, long-press or Shift+F10. It reuses the DropdownMenu items, so the content looks identical.',
  anatomy: {
    intro: 'Three parts. The region and menu are required; items follow DropdownMenu. The stage freezes the menu at a pointer position.',
    Render: () => <Demo />,
    parts: [
      { name: 'Region', description: 'Block wrapper that listens for contextmenu. Anything inside responds; nested regions win.', selector: '[data-part="region"]' },
      { name: 'Menu surface', description: '200px minimum, 12px radius, 4px padding, opens 2px below-right of the pointer, flips near edges.', selector: '[role="menu"]' },
      { name: 'Active item', description: 'Same 32px row as DropdownMenu. First item is focused on open.', selector: '[data-part="active"]' },
    ],
  },
  usage: {
    use: ['Shortcuts on rows, cards and canvas objects for power users.', 'Duplicating a dropdown menu that already exists on a visible button.', 'Surfaces where right-click is expected, like file lists.'],
    avoid: [
      { text: 'The only path to an action. Touch and keyboard users may miss it.', instead: { slug: 'dropdown-menu', label: 'DropdownMenu' } },
      { text: 'Form fields; they keep the browser menu for paste and spellcheck.', instead: { slug: 'input', label: 'Input' } },
      { text: 'Searching for any command.', instead: { slug: 'command-palette', label: 'CommandPalette' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
      { kind: 'text', key: 'menuLabel', label: 'Menu label', presets: ['Row actions', 'Context menu'] },
    ],
    initial: { isDisabled: false, menuLabel: 'Row actions' },
    render: (p, ev) => <div onContextMenu={(e) => { e.preventDefault(); ev('onContextMenu'); }}><Demo disabled={Boolean(p.isDisabled)} /></div>,
    code: (p) => `<ContextMenu\n  menuLabel="${p.menuLabel}"${p.isDisabled ? '\n  isDisabled' : ''}\n  onAction={run}\n  menu={\n    <>\n      <DropdownMenuItem id="edit">Edit invoice</DropdownMenuItem>\n      <DropdownMenuItem id="delete" variant="danger">Delete</DropdownMenuItem>\n    </>\n  }\n>\n  <InvoiceRow />\n</ContextMenu>`,
  },
  states: [
    { name: 'Open', description: 'Menu at the pointer with the first item active.', Render: () => <Demo /> },
    { name: 'Disabled', description: 'isDisabled leaves the native browser menu alone.', Render: () => <Demo disabled /> },
  ],
  sections: [
    { type: 'text', id: 'choosing-an-overlay', title: 'Choosing an overlay', body: <>A context menu is a dropdown menu with a different trigger. For the rest of the family, see <a href="#/components/dialog">Dialog</a>.</> },
    {
      type: 'rules', id: 'ctx-recipes', title: 'Composition recipes',
      items: [
        { title: 'Pair with a visible button', body: 'Put the same items in a DropdownMenu on a row overflow button so touch and keyboard users get them.' },
        { title: 'Share one menu', body: 'Define the items once and pass them to both menus.' },
        { title: 'Keep it short', body: 'Under seven items; use sections for more.' },
      ],
    },
  ],
  content: { rules: [{ title: 'Same words as the button menu', body: 'Labels must match so users learn once.' }, { title: 'Verb first', body: 'Edit invoice, Duplicate, Delete.' }, { title: 'Name the menu', body: 'menuLabel such as Row actions gives screen readers context.' }] },
  accessibility: {
    keyboard: [
      { keys: ['Shift', 'F10'], action: 'Opens the menu for the focused region.' },
      { keys: ['Menu key'], action: 'Opens the menu for the focused region.' },
      { keys: ['↑', '↓'], action: 'Moves between items.' },
      { keys: ['Enter'], action: 'Runs the item.' },
      { keys: ['Esc'], action: 'Closes and returns focus.' },
    ],
    notes: ['A menu with aria-label from menuLabel; the invisible anchor is aria-hidden and out of the tab order.', 'Long-press opens it on touch.', 'Regions must be focusable to support the keyboard path.'],
    reducedMotion: 'The pop-in scale is removed.',
  },
  props: [
    { name: 'menu', type: 'ReactNode', description: 'Required. DropdownMenuItem, Section, Separator or Submenu elements.' },
    { name: 'children', type: 'ReactNode', description: 'Required. The region content.' },
    { name: 'onAction', type: '(key: Key) => void', description: 'Fires with the item id.' },
    { name: 'menuLabel', type: 'string', default: "'Context menu'", description: 'Accessible name.' },
    { name: 'isDisabled', type: 'boolean', description: 'Skips the custom menu.' },
    { name: 'className / style / xstyle', type: 'string / CSSProperties / StyleXStyles', description: 'Region overrides.' },
    { name: 'menuXstyle', type: 'StyleXStyles', description: 'Menu surface overrides.' },
  ],
  related: ['dropdown-menu', 'command-palette', 'popover'],
};
export default page;
