import { FileText, FolderOpen, Image } from 'lucide-react';
import { Badge, List, ListItem } from 'oniva-ui';
import type { DocPage } from '../types';

type Mode = 'none' | 'single' | 'multiple';
const Demo = (p: { mode?: Mode; icons?: boolean; disabled?: boolean; empty?: boolean; long?: boolean; onEvent?: (n: string) => void }) => (
  <div style={{ width: 360 }}>
    <List
      aria-label="Recent files"
      selectionMode={p.mode ?? 'none'}
      defaultSelectedKeys={p.mode && p.mode !== 'none' ? ['q3'] : undefined}
      disabledKeys={p.disabled ? ['brand'] : undefined}
      onSelectionChange={() => p.onEvent?.('onSelectionChange')}
      onAction={() => p.onEvent?.('onAction')}
      renderEmptyState={() => <div style={{ padding: 20, textAlign: 'center', fontSize: 14, color: 'var(--oniva-color-text-muted)' }}>No recent files. Upload one to get started.</div>}
    >
      {p.empty ? [] : [
        <ListItem key="q3" id="q3" icon={p.icons ? <FileText size={16} /> : undefined} description="Edited 2h ago" trailing={<Badge size="sm">2.4 MB</Badge>}>
          {p.long ? 'Q3 revenue report with regional breakdown and forecast (final v7).pdf' : 'Q3 revenue report.pdf'}
        </ListItem>,
        <ListItem key="brand" id="brand" icon={p.icons ? <Image size={16} /> : undefined} description="Edited yesterday" trailing="8.1 MB">Brand assets.zip</ListItem>,
        <ListItem key="contracts" id="contracts" icon={p.icons ? <FolderOpen size={16} /> : undefined} description="12 items">Contracts</ListItem>,
      ]}
    </List>
  </div>
);

const page: DocPage = {
  slug: 'list',
  status: 'Stable',
  version: '0.1.0',
  importName: 'List',
  group: ['Components', 'Data display'],
  sourcePath: 'components/List',
  lede: 'Rows with an icon, a label, a description and trailing content, with optional selection and row actions. Built on a React Aria GridList.',
  anatomy: {
    intro: 'Six parts. The container, row and label are always present; checkbox, icon, description and trailing content are optional.',
    Render: () => <Demo mode="multiple" icons />,
    parts: [
      { name: 'Container', description: '12px radius, 4px padding, 2px between rows. Focus-visible shows a ring on the list.', selector: '[role="grid"]' },
      { name: 'Row', description: '36px minimum height, 8px radius, 6px by 8px padding, 10px gap, 14px text. Selected rows tint; keyboard focus draws a ring.', selector: '[role="row"][data-selected]' },
      { name: 'Checkbox', description: 'Shown when selectionMode is multiple. Selects without opening the row.', selector: '[role="row"]:first-child input[type="checkbox"]' },
      { name: 'Icon', description: '16px, muted; accent when selected. Decorative.', selector: '[role="row"]:first-child [role="gridcell"] > span[aria-hidden="true"]' },
      { name: 'Label and description', description: 'Label 14px medium. Description 12px muted on a second line, linked as the row description.', selector: '[role="row"]:first-child [slot="description"]' },
      { name: 'Trailing', description: 'Right-aligned 12px muted slot for a badge, size, count or action buttons.', selector: '[role="row"]:first-child [role="gridcell"] > span:last-child' },
    ],
  },
  usage: {
    use: ['Files, members, settings entries with secondary text.', 'Rows that open something (onAction) or can be multi-selected.', 'Rows with trailing badges or buttons.'],
    avoid: [
      { text: 'Choosing a value for a field.', instead: { slug: 'list-box', label: 'ListBox' } },
      { text: 'Messages with read state and swipe.', instead: { slug: 'inbox-list', label: 'InboxList' } },
      { text: 'Columns of comparable data.', instead: { slug: 'table', label: 'Table' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'mode', label: 'Selection', options: ['none', 'single', 'multiple'] },
      { kind: 'toggle', key: 'icons', label: 'Icons' },
      { kind: 'toggle', key: 'disabled', label: 'Disabled row' },
      { kind: 'toggle', key: 'empty', label: 'Empty' },
    ],
    initial: { mode: 'none', icons: true, disabled: false, empty: false },
    render: (p, onEvent) => <Demo key={`${p.mode}${p.empty}`} mode={p.mode as Mode} icons={Boolean(p.icons)} disabled={Boolean(p.disabled)} empty={Boolean(p.empty)} onEvent={onEvent} />,
    code: (p) => `<List aria-label="Recent files"${p.mode !== 'none' ? ` selectionMode="${p.mode}"` : ''} onAction={(key) => open(key)}>\n  <ListItem id="q3"${p.icons ? ' icon={<FileText size={16} />}' : ''} description="Edited 2h ago" trailing="2.4 MB">Q3 revenue report.pdf</ListItem>${p.disabled ? '\n  <ListItem id="brand" isDisabled>Brand assets.zip</ListItem>' : ''}\n</List>`,
  },
  states: [
    { name: 'Default', description: 'Plain rows with description and trailing text.', Render: () => <Demo icons /> },
    { name: 'Multiple selection', description: 'Checkboxes and tinted selected row.', Render: () => <Demo mode="multiple" icons /> },
    { name: 'Single selection', description: 'One row selected; no checkboxes.', Render: () => <Demo mode="single" icons /> },
    { name: 'Disabled row', description: 'Muted, not selectable.', Render: () => <Demo icons disabled mode="multiple" /> },
    { name: 'Long label', description: 'Labels wrap; keep them to one line where you can.', Render: () => <Demo long icons /> },
    { name: 'Empty', description: 'Pass renderEmptyState with a next step.', Render: () => <Demo empty /> },
  ],
  sections: [
    { type: 'rules', id: 'rules', title: 'Rules', items: [
      { title: 'One action per row', body: 'The row opens something (onAction). Extra actions go in trailing as buttons, never nested rows.' },
      { title: 'Description earns its line', body: 'Use it for state or metadata users scan: "Edited 2h ago". Skip it when it only repeats the label.' },
      { title: 'Selection is explicit', body: 'Use checkboxes for bulk selection; single selection for a current item.' },
    ] },
    { type: 'rules', id: 'recipes', title: 'Composition', items: [
      { title: 'With Avatar', body: 'Put an Avatar in icon for people lists.' },
      { title: 'With bulk actions', body: 'When rows are selected, show a bar above the list: "3 selected", Move, Delete.' },
      { title: 'Loading', body: 'Render Skeleton rows of 36px until items arrive.' },
    ] },
  ],
  content: { rules: [
    { title: 'Labels', body: 'The object name as users know it: the file, the person. Do not add a verb.' },
    { title: 'Descriptions', body: 'Short and factual: a date, a count, a role. Under 40 characters.' },
    { title: 'Empty', body: 'Say why and offer a next step.' },
  ] },
  accessibility: {
    keyboard: [
      { keys: ['↑', '↓'], action: 'Moves between rows.' },
      { keys: ['Space'], action: 'Toggles selection of the focused row.' },
      { keys: ['Enter'], action: 'Runs onAction for the row.' },
      { keys: ['Tab'], action: 'Moves to the next interactive element inside the row.' },
      { keys: ['Ctrl', 'A'], action: 'Selects all rows (multiple).' },
      { keys: ['Esc'], action: 'Clears the selection.' },
      { keys: ['Home', 'End'], action: 'First and last row.' },
    ],
    notes: ['role="grid" with rows, so rows can hold buttons and checkboxes.', 'Description is announced as the row description.', 'Icons are aria-hidden; always include a text label.', 'Provide an aria-label on the list.'],
    reducedMotion: 'Only color transitions; nothing to remove.',
  },
  props: [
    { name: 'aria-label', type: 'string', description: 'Required name.' },
    { name: 'selectionMode', type: "'none' | 'single' | 'multiple'", default: "'none'", description: 'Selection behaviour.' },
    { name: 'selectedKeys / defaultSelectedKeys', type: "'all' | Iterable<Key>", description: 'Controlled or initial selection.' },
    { name: 'onSelectionChange', type: '(keys: Selection) => void', description: 'Fires on selection.' },
    { name: 'onAction', type: '(key: Key) => void', description: 'Row activation.' },
    { name: 'disabledKeys', type: 'Iterable<Key>', description: 'Rows that cannot be used.' },
    { name: 'items / renderEmptyState', type: 'Iterable<T> / () => ReactNode', description: 'Dynamic collections and empty content.' },
    { name: 'ListItem.icon / description / trailing', type: 'ReactNode', description: 'Leading icon, second line, trailing slot.' },
    { name: 'ListItem.id / textValue', type: 'Key / string', description: 'Identity and typeahead text.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Style override.' },
  ],
  related: ['list-box', 'inbox-list', 'table', 'tree-view'],
};
export default page;
