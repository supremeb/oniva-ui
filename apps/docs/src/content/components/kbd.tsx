import { KbdGroup } from 'oniva-ui';
import type { DocPage } from '../types';

const Demo = (p: { size?: 'sm' | 'md' | 'lg'; keys?: string[] }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
    Open the palette with <KbdGroup keys={p.keys ?? ['⌘', 'K']} size={p.size} />
  </div>
);

const page: DocPage = {
  slug: 'kbd',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Kbd',
  group: ['Components', 'Data display'],
  sourcePath: 'components/Kbd',
  lede: 'A key cap for shortcuts in help text, menus and tooltips. Renders a semantic kbd element, one per key.',
  anatomy: {
    intro: 'Three parts. KbdGroup is optional and spaces several caps; each Kbd is one key.',
    Render: () => <Demo />,
    parts: [
      { name: 'Group', description: 'Inline flex, 4px gap between caps. Pass keys or children.', selector: 'div > span' },
      { name: 'Modifier cap', description: 'Symbols such as the command key use the same cap. 20px minimum width keeps single glyphs square-ish.', selector: 'kbd:nth-of-type(1)' },
      { name: 'Key cap', description: 'md: 20px tall, 12px semibold text, 4px radius, 6px side padding, 20px minimum width. Tabular numerals.', selector: 'kbd:last-of-type' },
    ],
  },
  usage: {
    use: ['Showing a shortcut next to a menu item or button.', 'Documenting key combinations in help text.', 'Hints inside a search field, such as the slash key.'],
    avoid: [
      { text: 'Inline code, file names or values.', instead: { slug: 'tag', label: 'Tag' } },
      { text: 'A pressable button that looks like a key.', instead: { slug: 'button', label: 'Button' } },
      { text: 'Labelling a state or count.', instead: { slug: 'badge', label: 'Badge' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'size', label: 'Size', options: ['sm', 'md', 'lg'] },
      { kind: 'text', key: 'keys', label: 'Keys (comma separated)', presets: ['⌘,K', 'Ctrl,Shift,P', 'Esc'] },
    ],
    initial: { size: 'md', keys: '⌘,K' },
    render: (p) => <Demo size={p.size as 'sm' | 'md' | 'lg'} keys={String(p.keys).split(',').map((k) => k.trim()).filter(Boolean)} />,
    code: (p) => `<KbdGroup keys={[${String(p.keys).split(',').map((k) => `'${k.trim()}'`).join(', ')}]}${p.size !== 'md' ? ` size="${p.size}"` : ''} />`,
  },
  states: [
    { name: 'Small', description: '18px tall, 11px text.', Render: () => <Demo size="sm" /> },
    { name: 'Medium', description: '20px tall, 12px text. The default.', Render: () => <Demo /> },
    { name: 'Large', description: '24px tall, 13px text, 8px side padding.', Render: () => <Demo size="lg" /> },
    { name: 'Wide key', description: 'Words grow the cap; padding stays fixed.', Render: () => <Demo keys={['Shift', 'Enter']} /> },
  ],
  sections: [
    { type: 'rules', id: 'rules', title: 'Rules', items: [
      { title: 'One key per cap', body: 'Never put "Ctrl+K" in a single Kbd. Use KbdGroup so each key reads on its own.' },
      { title: 'Match the platform', body: 'Show ⌘ on macOS and Ctrl elsewhere. Do not show both.' },
      { title: 'Not interactive', body: 'A cap is a label. If it can be pressed, it is a Button.' },
    ] },
    { type: 'rules', id: 'recipes', title: 'Composition', items: [
      { title: 'In a menu item', body: 'Right-align the group in the item; sm size keeps rows at their normal height.' },
      { title: 'In a tooltip', body: 'Follow the action name: "Search ⌘ K".' },
    ] },
  ],
  content: { rules: [
    { title: 'Symbols', body: 'Use ⌘ ⇧ ⌥ ⌃ for macOS modifiers; spell out Ctrl, Shift, Alt elsewhere.' },
    { title: 'Letters', body: 'Uppercase single letters: K, not k.' },
    { title: 'Names', body: 'Esc, Enter, Tab, Space. Title case, no "key" suffix.' },
  ] },
  accessibility: {
    keyboard: [{ keys: ['None'], action: 'Not focusable and not interactive.' }],
    notes: ['Renders a native kbd element, which assistive tech reads as keyboard input.', 'Symbols such as ⌘ are read inconsistently. Put the key name in surrounding text or an aria-label on the group for critical shortcuts.', 'Do not rely on the caps alone to convey an action.'],
  },
  props: [
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Cap height: 18, 20 or 24px.' },
    { name: 'children', type: 'ReactNode', description: 'The key label.' },
    { name: 'KbdGroup.keys', type: 'string[]', description: 'Keys rendered as separate caps.' },
    { name: 'KbdGroup.size', type: "'sm' | 'md' | 'lg'", description: 'Size passed to every cap.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Style override.' },
  ],
  related: ['command-palette', 'tooltip', 'dropdown-menu', 'badge'],
};
export default page;
