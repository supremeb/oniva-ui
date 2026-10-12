import { File, Folder } from 'lucide-react';
import { TreeView, TreeViewItem } from 'oniva-ui';
import type { DocPage } from '../types';

type Mode = 'none' | 'single' | 'multiple';
const Demo = (p: { mode?: Mode; open?: string[]; icons?: boolean; disabled?: boolean; onEvent?: (n: string) => void }) => (
  <div style={{ width: 300 }}>
    <TreeView
      aria-label="Project files"
      selectionMode={p.mode ?? 'single'}
      defaultExpandedKeys={p.open ?? ['src']}
      defaultSelectedKeys={['button']}
      disabledKeys={p.disabled ? ['readme'] : undefined}
      onSelectionChange={() => p.onEvent?.('onSelectionChange')}
      onExpandedChange={() => p.onEvent?.('onExpandedChange')}
    >
      <TreeViewItem id="src" title="src" icon={p.icons ? <Folder size={16} /> : undefined}>
        <TreeViewItem id="components" title="components" icon={p.icons ? <Folder size={16} /> : undefined}>
          <TreeViewItem id="button" title="Button.tsx" icon={p.icons ? <File size={16} /> : undefined} />
          <TreeViewItem id="input" title="Input.tsx" icon={p.icons ? <File size={16} /> : undefined} />
        </TreeViewItem>
        <TreeViewItem id="index" title="index.ts" icon={p.icons ? <File size={16} /> : undefined} />
      </TreeViewItem>
      <TreeViewItem id="readme" title="README.md" icon={p.icons ? <File size={16} /> : undefined} />
    </TreeView>
  </div>
);

const page: DocPage = {
  slug: 'tree-view',
  status: 'Stable',
  version: '0.1.0',
  importName: 'TreeView',
  group: ['Components', 'Data display'],
  sourcePath: 'components/TreeView',
  lede: 'A keyboard-navigable hierarchy with expandable branches and optional selection. For file trees, category pickers and nested navigation.',
  anatomy: {
    intro: 'Five parts. The tree, rows and labels are always present; chevrons appear on branches and icons are optional.',
    Render: () => <Demo icons open={['src', 'components']} />,
    parts: [
      { name: 'Tree', description: 'role="treegrid"-style container, 12px radius, 4px padding, 2px between rows.', selector: '[role="treegrid"]' },
      { name: 'Row', description: '36px minimum height, 8px radius, 14px text. Indent grows 18px per level from an 8px base. Selected rows tint.', selector: '[role="row"][aria-label="components"]' },
      { name: 'Chevron', description: '16px button with a 14px icon on branches only. Rotates 90 degrees open. Leaves get a 16px spacer to keep labels aligned.', selector: '[role="row"]:first-child button[slot="chevron"]' },
      { name: 'Icon', description: '16px muted icon, accent when selected. Decorative.', selector: '[role="row"]:first-child [role="gridcell"] > span[aria-hidden="true"]' },
      { name: 'Label', description: '14px medium. The title also feeds typeahead.', selector: '[role="row"]:first-child [role="gridcell"] > span:last-child' },
    ],
  },
  usage: {
    use: ['File and folder browsers.', 'Nested categories for filtering or navigation.', 'Hierarchies deeper than two levels.'],
    avoid: [
      { text: 'A flat list of sections.', instead: { slug: 'accordion', label: 'Accordion' } },
      { text: 'Top-level navigation.', instead: { slug: 'sidebar', label: 'Sidebar' } },
      { text: 'Choosing from a flat set.', instead: { slug: 'list-box', label: 'ListBox' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'mode', label: 'Selection', options: ['none', 'single', 'multiple'] },
      { kind: 'toggle', key: 'icons', label: 'Icons' },
      { kind: 'toggle', key: 'expanded', label: 'Expand all' },
      { kind: 'toggle', key: 'disabled', label: 'Disable README' },
    ],
    initial: { mode: 'single', icons: true, expanded: false, disabled: false },
    render: (p, onEvent) => <Demo key={`${p.mode}${p.expanded}`} mode={p.mode as Mode} icons={Boolean(p.icons)} open={p.expanded ? ['src', 'components'] : ['src']} disabled={Boolean(p.disabled)} onEvent={onEvent} />,
    code: (p) => `<TreeView aria-label="Project files"${p.mode !== 'none' ? ` selectionMode="${p.mode}"` : ''} defaultExpandedKeys={['src']}>\n  <TreeViewItem id="src" title="src"${p.icons ? ' icon={<Folder size={16} />}' : ''}>\n    <TreeViewItem id="index" title="index.ts" />\n  </TreeViewItem>\n</TreeView>`,
  },
  states: [
    { name: 'Collapsed', description: 'Only top-level rows; chevrons point right.', Render: () => <Demo open={[]} icons /> },
    { name: 'Expanded', description: 'Branches open with 18px indent per level.', Render: () => <Demo open={['src', 'components']} icons /> },
    { name: 'Multiple selection', description: 'Several rows tinted.', Render: () => <Demo mode="multiple" open={['src', 'components']} /> },
    { name: 'Disabled row', description: 'Muted, skipped by arrow keys.', Render: () => <Demo disabled /> },
    { name: 'No selection', description: 'Navigation-only tree.', Render: () => <Demo mode="none" /> },
  ],
  sections: [
    { type: 'rules', id: 'rules', title: 'Rules', items: [
      { title: 'Keep depth under 5', body: 'Deeper trees squeeze labels. Flatten or use breadcrumbs.' },
      { title: 'Persist expansion', body: 'Control expandedKeys and restore it across visits so users keep their place.' },
      { title: 'Lazy load branches', body: 'Load children on expand and show a Spinner row while waiting.' },
    ] },
    { type: 'rules', id: 'recipes', title: 'Composition', items: [
      { title: 'With a detail pane', body: 'Selecting a leaf updates a preview beside the tree.' },
      { title: 'With search', body: 'Filter the data, then expand every key of matching branches.' },
    ] },
  ],
  content: { rules: [
    { title: 'Titles', body: 'Names as stored: file names keep extensions and case.' },
    { title: 'Categories', body: 'Plural nouns for groups, sentence case.' },
    { title: 'Empty branch', body: 'Show a muted leaf "Empty" rather than a chevron that opens nothing.' },
  ] },
  accessibility: {
    keyboard: [
      { keys: ['↑', '↓'], action: 'Moves between visible rows.' },
      { keys: ['→'], action: 'Expands a closed branch; on an open branch moves to the first child.' },
      { keys: ['←'], action: 'Collapses an open branch; otherwise moves to the parent.' },
      { keys: ['Space'], action: 'Toggles selection.' },
      { keys: ['Enter'], action: 'Runs the row action.' },
      { keys: ['Home', 'End'], action: 'First and last visible row.' },
      { keys: ['A–Z'], action: 'Typeahead on titles.' },
    ],
    notes: ['React Aria Tree: aria-level, aria-expanded on branches, aria-selected on selectable rows.', 'Chevrons are a separate labelled expand button; the row stays a single tab stop.', 'Icons are aria-hidden.'],
    reducedMotion: 'The chevron rotation is removed.',
  },
  props: [
    { name: 'aria-label', type: 'string', description: 'Required name.' },
    { name: 'selectionMode', type: "'none' | 'single' | 'multiple'", default: "'none'", description: 'Selection behaviour.' },
    { name: 'selectedKeys / defaultSelectedKeys', type: 'Iterable<Key>', description: 'Controlled or initial selection.' },
    { name: 'expandedKeys / defaultExpandedKeys', type: 'Iterable<Key>', description: 'Controlled or initial open branches.' },
    { name: 'onExpandedChange', type: '(keys: Set<Key>) => void', description: 'Fires when branches open or close.' },
    { name: 'onSelectionChange / onAction', type: 'callbacks', description: 'Selection and activation.' },
    { name: 'disabledKeys', type: 'Iterable<Key>', description: 'Disable rows.' },
    { name: 'TreeViewItem.title', type: 'string', description: 'Required label and typeahead text.' },
    { name: 'TreeViewItem.icon', type: 'ReactNode', description: 'Leading icon.' },
    { name: 'TreeViewItem.children', type: 'ReactNode', description: 'Nested TreeViewItems.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Style override.' },
  ],
  related: ['accordion', 'list', 'list-box', 'sidebar'],
};
export default page;
