import { useState, type CSSProperties } from 'react';
import { Search, FileText, Plus, Users, Moon, UserPlus, LogOut, Sparkles } from 'lucide-react';
import { Button, CommandPalette, Kbd, fuzzyMatch, type CommandGroup } from 'oniva-ui';
import type { DocPage } from '../types';

// The open palette is a modal overlay and cannot be locked inside a stage, so every stage composes the same
// structure from real Kbd + tokens, with the measurements of CommandPalette.tsx (52px field, 8px list padding,
// 32px rows, 8px radius). The playground also mounts the real palette behind a button.

interface Row { id: string; label: string; icon: typeof Plus; shortcut?: string; danger?: boolean }
interface Group { id: string; title: string; rows: Row[] }

const GROUPS: Group[] = [
  { id: 'go', title: 'Go to', rows: [{ id: 'invoices', label: 'Invoices', icon: FileText }, { id: 'customers', label: 'Customers', icon: Users }] },
  { id: 'actions', title: 'Actions', rows: [{ id: 'new-invoice', label: 'Create invoice', icon: Plus, shortcut: '⌘N' }, { id: 'invite', label: 'Invite teammate', icon: UserPlus }, { id: 'theme', label: 'Toggle dark mode', icon: Moon, shortcut: '⌘D' }, { id: 'sign-out', label: 'Sign out', icon: LogOut, danger: true }] },
];

const palette: CommandGroup[] = GROUPS.map((g) => ({ id: g.id, title: g.title, items: g.rows.map((r) => ({ id: r.id, label: r.label, shortcut: r.shortcut, icon: <r.icon size={16} />, variant: r.danger ? ('danger' as const) : ('default' as const) })) }));

const v = (n: string) => `var(--oniva-${n})`;
const label: CSSProperties = { color: v('color-text-muted'), fontSize: 12, fontWeight: 500, lineHeight: '17px', padding: '6px 8px' };

function Panel({ query = '', width = 460, footer = true, shortcuts = true, empty, chosen, placeholder = 'Search commands…' }: { query?: string; width?: number; footer?: boolean; shortcuts?: boolean; empty?: boolean; chosen?: string; placeholder?: string }) {
  const groups = GROUPS.map((g) => ({ ...g, rows: g.rows.filter((r) => fuzzyMatch(r.label, query)) })).filter((g) => g.rows.length);
  const none = empty || (query && groups.length === 0);
  let first = true;
  return (
    <div role="dialog" aria-label="Command palette" style={{ background: v('color-surface'), border: `1px solid ${v('color-border')}`, borderRadius: 12, boxShadow: v('shadow-xl'), maxWidth: '100%', overflow: 'hidden', width }}>
      <div data-part="field" style={{ alignItems: 'center', borderBottom: `1px solid ${v('color-border')}`, color: v('color-icon-muted'), display: 'flex', gap: 10, padding: '0 16px' }}>
        <Search size={18} aria-hidden="true" data-part="icon" />
        <span data-part="input" style={{ color: query ? v('color-text') : v('color-text-placeholder'), flex: 1, fontSize: 16, height: 52, lineHeight: '52px', whiteSpace: 'nowrap' }}>{query || placeholder}</span>
      </div>
      <div role="listbox" aria-label="Commands" style={{ padding: 8 }}>
        {chosen ? (
          <div role="status" style={{ alignItems: 'center', color: v('color-text-muted'), display: 'flex', fontSize: 14, gap: 8, justifyContent: 'center', padding: '28px 16px' }}>
            <Sparkles size={16} aria-hidden="true" /> {chosen}
          </div>
        ) : none ? (
          <div data-part="empty" style={{ color: v('color-text-muted'), fontSize: 14, padding: '32px 16px', textAlign: 'center' }}>
            No commands match “{query || 'quarterly'}”. Try a broader term.
          </div>
        ) : (
          groups.map((g) => (
            <div key={g.id} role="group" aria-label={g.title} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div data-part="section" style={label}>{g.title}</div>
              {g.rows.map((r) => {
                const on = first;
                first = false;
                return (
                  <div key={r.id} role="option" aria-selected={on} data-part={on ? 'item' : undefined} style={{ alignItems: 'center', background: on ? v('color-surface-tertiary') : 'transparent', borderRadius: 8, color: r.danger ? v('color-danger-fg') : v('color-text'), display: 'flex', fontSize: 14, fontWeight: 500, gap: 8, lineHeight: '20px', minHeight: 32, padding: '6px 8px' }}>
                    <r.icon size={16} aria-hidden="true" />
                    <span>{r.label}</span>
                    {shortcuts && r.shortcut ? <span data-part="shortcut" style={{ color: v('color-text-muted'), fontSize: 12, marginInlineStart: 'auto' }}>{r.shortcut}</span> : null}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
      {footer ? (
        <div data-part="footer" style={{ alignItems: 'center', background: v('color-surface-inset'), borderTop: `1px solid ${v('color-border')}`, color: v('color-text-muted'), display: 'flex', fontSize: 12, gap: 16, padding: '8px 16px' }}>
          <span style={{ alignItems: 'center', display: 'inline-flex', gap: 6 }}><Kbd size="sm">↑↓</Kbd> navigate</span>
          <span style={{ alignItems: 'center', display: 'inline-flex', gap: 6 }}><Kbd size="sm">↵</Kbd> select</span>
          <span style={{ alignItems: 'center', display: 'inline-flex', gap: 6 }}><Kbd size="sm">esc</Kbd> close</span>
        </div>
      ) : null}
    </div>
  );
}

function Real({ placeholder, hotkey, onEvent }: { placeholder: string; hotkey: boolean; onEvent: (e: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Button variant="secondary" onPress={() => { setOpen(true); onEvent('onOpenChange(true)'); }} endIcon={<Kbd>⌘K</Kbd>}>Open the real palette</Button>
      <CommandPalette groups={palette} isOpen={open} onOpenChange={(o) => { setOpen(o); onEvent(`onOpenChange(${o})`); }} placeholder={placeholder} hotkey={hotkey} onSelect={(i) => onEvent(`onSelect("${i.id}")`)} />
    </div>
  );
}

const rowStage = { display: 'flex', flexDirection: 'column', gap: 24 } as const;

const page: DocPage = {
  slug: 'command-palette',
  status: 'Stable',
  version: '0.1.0',
  importName: 'CommandPalette',
  group: ['Components', 'Navigation'],
  sourcePath: 'components/CommandPalette',
  lede: 'A keyboard-first palette for jumping to any page or running any command. It handles four moments: before you type, while you type, after you choose, and when nothing matches.',
  anatomy: {
    intro: 'Seven parts. The field, section labels and rows are always present. Shortcut hints and the footer are optional.',
    Render: () => <Panel query="inv" footer width={440} />,
    parts: [
      { name: 'Panel', description: '560px wide (max 100% minus 32px), surface fill, 1px border, xl shadow. Fades in over 80ms with no scale.', selector: '[role="dialog"]' },
      { name: 'Search icon', description: '18px lucide icon in icon-muted, 10px gap to the input. Decorative, aria-hidden.', selector: '[data-part="icon"]' },
      { name: 'Search input', description: '52px tall, 16/22 text. Placeholder uses text-placeholder. Focus lands here on open.', selector: '[data-part="input"]' },
      { name: 'Section label', description: '12px medium, text-muted, 6px by 8px padding. Names the group: Go to, Actions.', selector: '[data-part="section"]' },
      { name: 'Highlighted row', description: '32px minimum, 8px radius, surface-tertiary fill. Exactly one at a time; the highlight is instant in.', selector: '[role="option"][aria-selected="true"]' },
      { name: 'Shortcut hint', description: '12px medium, text-muted, pushed to the end with 16px of space. Hints a key, does not bind it.', selector: '[data-part="shortcut"]', fallback: { x: 88, y: 55 } },
      { name: 'Footer', description: 'surface-inset fill, 8px by 16px padding, 12px text. Three Kbd hints: navigate, select, close.', selector: '[data-part="footer"]' },
    ],
  },
  usage: {
    use: ['Jumping to a known page or running a command by name.', 'Keeping power users on the keyboard in apps with more than about 15 destinations.', 'Surfacing actions that are hard to find in menus.', 'One global entry point bound to ⌘K.'],
    avoid: [
      { text: 'Filtering a table or list on the page.', instead: { slug: 'search-field', label: 'SearchField' } },
      { text: 'Choosing a value in a form.', instead: { slug: 'combobox', label: 'Combobox' } },
      { text: 'A short list of actions on one element.', instead: { slug: 'dropdown-menu', label: 'DropdownMenu' } },
      { text: 'The only way to reach a feature. Keep a visible path too.', instead: { slug: 'navbar', label: 'Navbar' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'text', key: 'query', label: 'Query', presets: ['inv', 'cust', 'quarterly'], group: 'Query' },
      { kind: 'segmented', key: 'width', label: 'Width', options: ['Compact', 'Full'] },
      { kind: 'toggle', key: 'footer', label: 'Footer' },
      { kind: 'toggle', key: 'shortcuts', label: 'Shortcut hints' },
      { kind: 'toggle', key: 'hotkey', label: 'Bind ⌘K' },
    ],
    initial: { query: 'inv', width: 'Full', footer: true, shortcuts: true, hotkey: false },
    render: (p, ev) => (
      <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: '100%' }}>
        <Panel query={String(p.query)} width={p.width === 'Full' ? 460 : 340} footer={Boolean(p.footer)} shortcuts={Boolean(p.shortcuts)} />
        <Real placeholder="Search commands…" hotkey={Boolean(p.hotkey)} onEvent={ev} />
      </div>
    ),
    code: (p) => `<CommandPalette\n  groups={groups}${p.hotkey ? '' : '\n  hotkey={false}'}\n  placeholder="Search commands…"\n  onSelect={(item) => run(item.id)}\n/>`,
  },
  states: [
    { name: 'Before typing', description: 'Every group, first row highlighted. Shortcuts show next to the rows that have one.', Render: () => <Panel width={360} footer={false} /> },
    { name: 'Typing', description: 'Fuzzy subsequence match. “inv” keeps Invoices and Invite teammate; the first match is highlighted.', Render: () => <Panel query="inv" width={360} footer={false} /> },
    { name: 'Chosen', description: 'Enter runs the row, closes the palette and returns focus to the opener.', Render: () => <Panel chosen="Opened Invoices" width={360} footer={false} /> },
    { name: 'Nothing matches', description: 'emptyMessage replaces the list. 14px, text-muted, centred, 32px of padding.', Render: () => <Panel query="quarterly" width={360} footer={false} /> },
    { name: 'Danger row', description: 'variant="danger" tints the label. Keep it out of the first position.', Render: () => <Panel query="sign" width={360} footer={false} /> },
    { name: 'No footer', description: 'The footer is decoration. Drop it in embedded or touch-first contexts.', Render: () => <Panel query="cust" width={360} footer={false} shortcuts={false} /> },
  ],
  sections: [
    {
      type: 'numbered', id: 'cant-find-it', title: 'Can’t find it',
      intro: 'An empty result is the moment most likely to lose someone. Never stop at “No results”. Every empty state does three things, in this order.',
      items: [
        { title: 'Say what happened', body: 'Repeat the query back exactly as typed so a typo is easy to spot. One line, and never blame the user.' },
        { title: 'Offer a way forward', body: 'Put one useful action right under the message, such as searching the docs or asking an assistant. Make it the first row so Enter still does something.' },
        { title: 'Suggest close matches', body: 'List only real commands, ranked by spelling similarity, never more than two. When nothing is close, show your most popular commands instead of a bad guess.' },
      ],
    },
    {
      type: 'rules', id: 'cant-find-rules', title: 'Empty state rules',
      items: [
        { title: 'Keep the query', body: 'Do not clear the field on empty. People fix a typo faster than they retype.' },
        { title: 'Keep the layout', body: 'The empty state is about the same height as results, so the panel does not collapse and jump.' },
        { title: 'No upsell here', body: 'Hide promos when nothing matches. A sales pitch in a dead end reads as a bait and switch.' },
      ],
    },
    {
      type: 'itemTypes', id: 'item-types', title: 'Item types', intro: 'Three kinds of row. Mix them in separate groups, not in one.',
      items: [
        { name: 'Destination', description: 'A noun. Opens a page. No shortcut.', Render: () => <Panel query="cust" width={340} footer={false} shortcuts={false} /> },
        { name: 'Command', description: 'A verb. Runs now. Shows its shortcut when it has one.', Render: () => <Panel query="create" width={340} footer={false} /> },
        { name: 'Destructive', description: 'A verb with consequences. Danger tone, never highlighted first.', Render: () => <Panel query="sign" width={340} footer={false} /> },
      ],
    },
    {
      type: 'dodont', id: 'do-dont', title: 'Do and don’t',
      items: [
        { kind: 'do', caption: 'Verb first for commands, noun for destinations.', example: () => <Panel query="create" width={300} footer={false} /> },
        { kind: 'dont', caption: 'Don’t stop at “No results”. Echo the query and say what to try.', text: 'No results.' },
      ],
    },
    { type: 'custom', id: 'composition', title: 'Composition', Render: () => <div style={rowStage}><p style={{ color: 'var(--oniva-color-text-muted)', margin: 0, maxWidth: 640 }}>Mount one palette near the app root with <code>hotkey</code> on. Give secondary triggers (a search button in the header) <code>isOpen</code> and <code>onOpenChange</code> and set <code>hotkey=&#123;false&#125;</code> on the others. Only one palette may bind ⌘K per page.</p></div> },
  ],
  content: {
    title: 'Content',
    rules: [
      { title: 'Commands are verbs', body: 'Create invoice, Toggle dark mode, Invite teammate. Sentence case, no trailing punctuation.' },
      { title: 'Destinations are nouns', body: 'Invoices, Customers, Revenue report. Add synonyms through keywords, not extra rows.' },
      { title: 'Group names are short', body: 'One or two words: Go to, Actions, Recent. Three groups before the list scrolls.' },
      { title: 'Placeholder names both modes', body: '“Search commands…” or “Jump to…”. Under 28 characters.' },
      { title: 'Empty message echoes the query', body: 'No commands match “quarterly”. Try a broader term.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['⌘', 'K'], action: 'Opens or closes the palette when hotkey is on. Ctrl+K on Windows and Linux.' },
      { keys: ['↑', '↓'], action: 'Moves the highlight. Skips disabled rows.' },
      { keys: ['Home'], action: 'Highlights the first row.' },
      { keys: ['End'], action: 'Highlights the last row.' },
      { keys: ['Enter'], action: 'Runs the highlighted row, closes the palette and calls onSelect.' },
      { keys: ['Esc'], action: 'Closes without running anything and returns focus to the opener.' },
      { keys: ['Tab'], action: 'Stays inside the dialog. Focus is trapped while open.' },
      { keys: ['Backspace'], action: 'Edits the query. An empty field does nothing.' },
    ],
    notes: [
      'A modal dialog labelled “Command palette” holds a search field and a menu named “Commands”. Section labels are group headings.',
      'The footer is aria-hidden: its hints repeat what the roles already announce.',
      'Focus moves to the input on open and back to the trigger on close.',
      'Rows are 32px tall, below the 44px touch target. On touch-first screens use a Drawer or BottomSheet with a search field instead.',
    ],
    reducedMotion: 'The panel fades in over 80ms with no scale or movement. Highlights are never animated in, and fade out over 120ms.',
  },
  props: [
    { name: 'groups', type: 'CommandGroup[]', description: 'Groups of { id, title, items }. Each item: id, label, icon, shortcut, keywords, isDisabled, variant.' },
    { name: 'onSelect', type: '(item: CommandItem) => void', description: 'Called with the chosen item after the palette closes.' },
    { name: 'isOpen', type: 'boolean', description: 'Controlled open state.' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial open state when uncontrolled.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called on every open and close.' },
    { name: 'placeholder', type: 'string', default: '"Search commands…"', description: 'Placeholder for the search input.' },
    { name: 'hotkey', type: 'boolean', default: 'true', description: 'Registers a global ⌘K / Ctrl+K toggle.' },
    { name: 'emptyMessage', type: 'ReactNode', default: '"No commands found. Try a different search."', description: 'Shown when the query matches nothing.' },
    { name: 'aria-label', type: 'string', default: '"Command palette"', description: 'Accessible name of the dialog.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'StyleX override for the panel.' },
    { name: 'className', type: 'string', description: 'Class on the dialog element.' },
    { name: 'ref', type: 'Ref<HTMLElement>', description: 'Ref to the dialog element.' },
    { name: 'fuzzyMatch', type: '(text: string, query: string) => boolean', description: 'Exported helper. Case and diacritic insensitive subsequence match used by the filter.' },
  ],
  related: ['search-field', 'combobox', 'dropdown-menu', 'kbd', 'dialog'],
};
export default page;
