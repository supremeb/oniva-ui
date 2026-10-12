import { Tag, TagGroup } from 'oniva-ui';
import type { DocPage } from '../types';

type C = 'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger' | 'outline';
const Demo = (p: { color?: C; mode?: 'none' | 'single' | 'multiple'; removable?: boolean; disabled?: boolean; label?: string; onEvent?: (n: string) => void }) => (
  <TagGroup
    label={p.label ?? 'Labels'}
    description="Applied to this invoice."
    selectionMode={p.mode ?? 'none'}
    defaultSelectedKeys={p.mode && p.mode !== 'none' ? ['design'] : undefined}
    disabledKeys={p.disabled ? ['design', 'q4', 'eu'] : undefined}
    onRemove={p.removable ? () => p.onEvent?.('onRemove') : undefined}
    onSelectionChange={() => p.onEvent?.('onSelectionChange')}
  >
    <Tag id="design" color={p.color}>design</Tag>
    <Tag id="q4" color={p.color}>Q4 launch</Tag>
    <Tag id="eu" color={p.color}>EU region</Tag>
  </TagGroup>
);

const page: DocPage = {
  slug: 'tag',
  status: 'Stable',
  version: '0.1.0',
  importName: 'TagGroup',
  group: ['Components', 'Data display'],
  sourcePath: 'components/Tag',
  lede: 'User-owned labels in a keyboard-navigable group. Plain, selectable or removable.',
  anatomy: {
    intro: 'Five parts. The group and tags are always present; label, description and remove button are optional.',
    Render: () => <Demo mode="multiple" removable color="accent" />,
    parts: [
      { name: 'Label', description: '13px medium, above the tags.', selector: 'span[id]:first-child, label', fallback: { x: 10, y: 10 } },
      { name: 'Tag list', description: 'Wrapping row, 6px gap. role="grid" with one row per tag.', selector: '[role="grid"]' },
      { name: 'Tag', description: '24px tall, 8px radius, 12px medium, 8px side padding, 1px border. Selected adds an accent border.', selector: '[role="row"]:first-child' },
      { name: 'Remove button', description: '18px button with a 12px X, expanded to a 24px hit area. Present when the group has onRemove.', selector: '[role="row"]:first-child button' },
      { name: 'Description', description: '12px muted help text under the list.', selector: '[slot="description"]', fallback: { x: 30, y: 90 } },
    ],
  },
  usage: {
    use: ['Labels users add: topics, owners, categories.', 'Filter chips that can be removed.', 'Multi-select from a short visible set.'],
    avoid: [
      { text: 'Read-only status on a row.', instead: { slug: 'badge', label: 'Badge' } },
      { text: 'Long option lists.', instead: { slug: 'multi-select', label: 'MultiSelect' } },
      { text: 'A single on/off choice.', instead: { slug: 'toggle-button', label: 'ToggleButton' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'select', key: 'color', label: 'Color', options: ['neutral', 'accent', 'info', 'success', 'warning', 'danger', 'outline'] },
      { kind: 'segmented', key: 'mode', label: 'Selection', options: ['none', 'single', 'multiple'] },
      { kind: 'toggle', key: 'removable', label: 'Removable' },
      { kind: 'toggle', key: 'disabled', label: 'Disabled' },
    ],
    initial: { color: 'neutral', mode: 'none', removable: false, disabled: false },
    render: (p, onEvent) => <Demo key={String(p.mode)} color={p.color as C} mode={p.mode as 'none' | 'single' | 'multiple'} removable={Boolean(p.removable)} disabled={Boolean(p.disabled)} onEvent={onEvent} />,
    code: (p) => `<TagGroup label="Labels"${p.mode !== 'none' ? ` selectionMode="${p.mode}"` : ''}${p.removable ? ' onRemove={(keys) => remove(keys)}' : ''}>\n  <Tag id="design"${p.color !== 'neutral' ? ` color="${p.color}"` : ''}>design</Tag>\n  <Tag id="q4">Q4 launch</Tag>\n</TagGroup>`,
  },
  states: [
    { name: 'Static', description: 'No selection or removal.', Render: () => <Demo /> },
    { name: 'Selectable', description: 'Selected tag has an accent border.', Render: () => <Demo mode="multiple" color="outline" /> },
    { name: 'Removable', description: 'X button on each tag.', Render: () => <Demo removable color="accent" /> },
    { name: 'Disabled', description: 'Half opacity, skipped by arrow keys.', Render: () => <Demo disabled mode="multiple" /> },
    { name: 'Semantic colors', description: 'Same tones as Badge.', Render: () => <Demo color="success" /> },
  ],
  sections: [
    { type: 'rules', id: 'rules', title: 'Rules', items: [
      { title: 'Removal is undoable', body: 'Removing a tag should be reversible or low stakes. Confirm only when it deletes data.' },
      { title: 'Cap visible tags', body: 'Show up to 5 then "+N more" in a Popover.' },
      { title: 'Empty is allowed', body: 'Use renderEmptyState to say "No labels yet" instead of rendering nothing.' },
    ] },
    { type: 'rules', id: 'recipes', title: 'Composition', items: [
      { title: 'In FilterBar', body: 'Active filters appear as removable tags beside a Clear all button.' },
      { title: 'With a field', body: 'Pair with a Combobox to add; the group shows what is chosen.' },
    ] },
  ],
  content: { rules: [
    { title: 'Length', body: 'One to three words, under 24 characters.' },
    { title: 'Casing', body: 'Match the user input; system tags use sentence case.' },
    { title: 'Filter chips', body: 'Show "Field: value", for example "Region: EU".' },
  ] },
  accessibility: {
    keyboard: [
      { keys: ['←', '→'], action: 'Moves focus between tags.' },
      { keys: ['Space', 'Enter'], action: 'Toggles selection when selectable.' },
      { keys: ['Backspace', 'Delete'], action: 'Removes the focused tag when removable.' },
      { keys: ['Tab'], action: 'Leaves the group (roving focus).' },
    ],
    notes: ['React Aria TagGroup: a grid of rows, with the label and description linked.', 'The remove button is labelled "Remove" with the tag text.', 'Selected state is exposed through aria-selected, not color alone.'],
    reducedMotion: 'The press scale on selectable tags is removed.',
  },
  props: [
    { name: 'label', type: 'ReactNode', description: 'Visible group label.' },
    { name: 'description', type: 'ReactNode', description: 'Help text under the list.' },
    { name: 'selectionMode', type: "'none' | 'single' | 'multiple'", default: "'none'", description: 'Selection behaviour.' },
    { name: 'selectedKeys / defaultSelectedKeys', type: 'Selection', description: 'Controlled or initial selection.' },
    { name: 'onSelectionChange', type: '(keys: Selection) => void', description: 'Fires on selection.' },
    { name: 'onRemove', type: '(keys: Set<Key>) => void', description: 'Enables the remove button.' },
    { name: 'items / renderEmptyState', type: 'Iterable<T> / () => ReactNode', description: 'Dynamic collections and empty text.' },
    { name: 'disabledKeys', type: 'Iterable<Key>', description: 'Disable specific tags.' },
    { name: 'Tag.color', type: "'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger' | 'outline'", default: "'neutral'", description: 'Tone.' },
    { name: 'Tag.icon', type: 'ReactNode', description: 'Leading icon or dot.' },
    { name: 'Tag.id / textValue', type: 'Key / string', description: 'Identity and typeahead text.' },
  ],
  related: ['badge', 'filter-bar', 'multi-select', 'combobox'],
};
export default page;
