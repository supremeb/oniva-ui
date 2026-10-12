import { Bell, Globe, Lock } from 'lucide-react';
import { ListBox, ListBoxItem, ListBoxSection } from 'oniva-ui';
import type { DocPage } from '../types';

type Mode = 'single' | 'multiple';
const Demo = (p: { mode?: Mode; icons?: boolean; sections?: boolean; disabled?: boolean; onEvent?: (n: string) => void }) => {
  const items = [
    <ListBoxItem key="public" id="public" icon={p.icons ? <Globe size={16} /> : undefined} description="Anyone with the link">Public</ListBoxItem>,
    <ListBoxItem key="team" id="team" icon={p.icons ? <Bell size={16} /> : undefined} description="Members of Design" trailing="24">Team</ListBoxItem>,
    <ListBoxItem key="private" id="private" icon={p.icons ? <Lock size={16} /> : undefined} description="Only you" isDisabled={p.disabled}>Private</ListBoxItem>,
  ];
  return (
    <div style={{ width: 300 }}>
      <ListBox aria-label="Visibility" selectionMode={p.mode ?? 'single'} defaultSelectedKeys={['team']} onSelectionChange={() => p.onEvent?.('onSelectionChange')}>
        {p.sections ? (
          <>
            <ListBoxSection title="Visible to others">{items.slice(0, 2)}</ListBoxSection>
            <ListBoxSection title="Hidden">{items.slice(2)}</ListBoxSection>
          </>
        ) : items}
      </ListBox>
    </div>
  );
};

const page: DocPage = {
  slug: 'list-box',
  status: 'Stable',
  version: '0.1.0',
  importName: 'ListBox',
  group: ['Components', 'Data display'],
  sourcePath: 'components/ListBox',
  lede: 'A visible list of options to choose from, one or several. The inline version of what Select shows in a popover.',
  anatomy: {
    intro: 'Five parts. The container and options are always present; sections, icons and trailing text are optional.',
    Render: () => <Demo icons sections />,
    parts: [
      { name: 'Container', description: '[role="listbox"], 12px radius, 4px padding, 2px between options.', selector: '[role="listbox"]' },
      { name: 'Section header', description: '12px semibold muted heading, 6px by 8px padding. Groups are labelled for screen readers.', selector: '[role="group"]:first-child header' },
      { name: 'Option', description: '36px minimum height, 8px radius, 6px by 8px padding, 10px gap, 14px text. Selected options tint.', selector: '[role="option"][aria-selected="true"]' },
      { name: 'Icon and check', description: '16px leading icon (accent when selected). In multiple mode a trailing 16px check marks selected options.', selector: '[role="option"] span[aria-hidden="true"]' },
      { name: 'Description and trailing', description: 'Second line in 12px muted; trailing text such as a count on the right.', selector: '[role="option"] [slot="description"]' },
    ],
  },
  usage: {
    use: ['Choosing 3 to 10 options that should stay visible.', 'Settings where each choice needs an explanation.', 'The panel of a custom picker.'],
    avoid: [
      { text: 'Compact field in a form.', instead: { slug: 'select', label: 'Select' } },
      { text: 'Rows that open things or hold actions.', instead: { slug: 'list', label: 'List' } },
      { text: 'Two or three mutually exclusive options.', instead: { slug: 'radio-group', label: 'RadioGroup' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'mode', label: 'Selection', options: ['single', 'multiple'] },
      { kind: 'toggle', key: 'icons', label: 'Icons' },
      { kind: 'toggle', key: 'sections', label: 'Sections' },
      { kind: 'toggle', key: 'disabled', label: 'Disable Private' },
    ],
    initial: { mode: 'single', icons: true, sections: false, disabled: false },
    render: (p, onEvent) => <Demo key={String(p.mode)} mode={p.mode as Mode} icons={Boolean(p.icons)} sections={Boolean(p.sections)} disabled={Boolean(p.disabled)} onEvent={onEvent} />,
    code: (p) => `<ListBox aria-label="Visibility"${p.mode === 'multiple' ? ' selectionMode="multiple"' : ''} defaultSelectedKeys={['team']}>\n  <ListBoxItem id="public" description="Anyone with the link">Public</ListBoxItem>\n  <ListBoxItem id="team" description="Members of Design">Team</ListBoxItem>${p.disabled ? '\n  <ListBoxItem id="private" isDisabled>Private</ListBoxItem>' : ''}\n</ListBox>`,
  },
  states: [
    { name: 'Single', description: 'One selected option, tinted.', Render: () => <Demo icons /> },
    { name: 'Multiple', description: 'Selected options show a trailing check.', Render: () => <Demo mode="multiple" icons /> },
    { name: 'Sections', description: 'Headers group related options.', Render: () => <Demo sections /> },
    { name: 'Disabled option', description: 'Muted and skipped by arrow keys.', Render: () => <Demo disabled icons /> },
  ],
  sections: [
    { type: 'rules', id: 'rules', title: 'Rules', items: [
      { title: 'Always one selected by default', body: 'In single mode preselect the safest option so the form can submit.' },
      { title: 'Group past 7 options', body: 'Use sections with short headers once options pass seven.' },
      { title: 'Describe the difference', body: 'Add a description only when options are not self-explanatory.' },
    ] },
    { type: 'rules', id: 'recipes', title: 'Composition', items: [
      { title: 'Inside a Popover', body: 'ListBox is the panel of Select and Combobox. Reuse it in custom pickers.' },
      { title: 'In a form field', body: 'Wrap with a visible label; aria-label alone is not enough for a labelled field.' },
    ] },
  ],
  content: { rules: [
    { title: 'Options', body: 'Nouns or short noun phrases, sentence case.' },
    { title: 'Descriptions', body: 'One line, under 40 characters, no period.' },
    { title: 'Section titles', body: 'Plain category names, 1 to 2 words.' },
  ] },
  accessibility: {
    keyboard: [
      { keys: ['↑', '↓'], action: 'Moves focus between options.' },
      { keys: ['Space', 'Enter'], action: 'Selects the focused option.' },
      { keys: ['A–Z'], action: 'Typeahead jumps to a matching option.' },
      { keys: ['Home', 'End'], action: 'First and last option.' },
      { keys: ['Ctrl', 'A'], action: 'Selects all (multiple).' },
    ],
    notes: ['role="listbox" with options; multiple adds aria-multiselectable.', 'Selected state is aria-selected, not only the tint or check.', 'Sections are labelled groups. Disabled options carry aria-disabled.', 'Provide an aria-label.'],
    reducedMotion: 'Color transitions only.',
  },
  props: [
    { name: 'aria-label', type: 'string', description: 'Required name.' },
    { name: 'selectionMode', type: "'single' | 'multiple'", default: "'single'", description: 'Selection behaviour.' },
    { name: 'selectedKeys / defaultSelectedKeys', type: 'Iterable<Key>', description: 'Controlled or initial selection.' },
    { name: 'onSelectionChange', type: '(keys: Selection) => void', description: 'Fires on selection.' },
    { name: 'disabledKeys', type: 'Iterable<Key>', description: 'Disable options.' },
    { name: 'items / renderEmptyState', type: 'Iterable<T> / () => ReactNode', description: 'Dynamic collections and empty content.' },
    { name: 'ListBoxItem.icon / description / trailing', type: 'ReactNode', description: 'Leading icon, second line, trailing text.' },
    { name: 'ListBoxSection.title', type: 'ReactNode', description: 'Header for a group.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Style override.' },
  ],
  related: ['select', 'list', 'combobox', 'radio-group'],
};
export default page;
