import { SegmentedControl, SegmentedControlItem } from 'oniva-ui';
import type { DocPage } from '../types';

type P = { size?: 'sm' | 'md'; fullWidth?: boolean; isDisabled?: boolean; value?: string; onChange?: (v: string) => void };

const Basic = (p: P) => (
  <div style={{ width: 320 }}>
    <SegmentedControl aria-label="Time range" size={p.size} fullWidth={p.fullWidth} isDisabled={p.isDisabled} defaultValue={p.value ?? '30d'} onChange={p.onChange}>
      <SegmentedControlItem value="7d">7 days</SegmentedControlItem>
      <SegmentedControlItem value="30d">30 days</SegmentedControlItem>
      <SegmentedControlItem value="90d">90 days</SegmentedControlItem>
    </SegmentedControl>
  </div>
);

const page: DocPage = {
  slug: 'segmented-control',
  status: 'Stable',
  version: '0.1.0',
  importName: 'SegmentedControl',
  group: ['Components', 'Forms'],
  sourcePath: 'components/SegmentedControl',
  lede: 'A row of mutually exclusive options that switches a view or setting at once. It handles choosing one of two to five short options.',
  anatomy: {
    intro: 'Three parts. The track and segments are always present; one segment is always selected.',
    Render: () => <Basic />,
    parts: [
      { name: 'Track', description: '10px radius container with 4px padding and 2px gap between segments. A radiogroup.', selector: '[role="radiogroup"]' },
      { name: 'Segment', description: '28px tall at md (24 sm), 6px radius, 10px horizontal padding, 14px text (13 sm).', selector: '[role="radiogroup"] label:first-of-type' },
      { name: 'Selected segment', description: 'Raised surface with a shadow and full-strength text. Unselected text is muted.', selector: '[role="radiogroup"] label[data-selected]' },
    ],
  },
  usage: {
    use: ['Switching a view: List / Board / Timeline.', 'A time range or granularity.', 'A two or three way setting with short labels.', 'Choices that apply instantly.'],
    avoid: [
      { text: 'More than five options.', instead: { slug: 'select', label: 'Select' } },
      { text: 'Navigating between pages.', instead: { slug: 'tabs', label: 'Tabs' } },
      { text: 'Options with descriptions or prices.', instead: { slug: 'radio-group', label: 'RadioGroup' } },
      { text: 'On or off.', instead: { slug: 'switch', label: 'Switch' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'size', label: 'Size', options: ['sm', 'md'] },
      { kind: 'toggle', key: 'fullWidth', label: 'Full width' },
      { kind: 'select', key: 'value', label: 'Selected', options: ['7d', '30d', '90d'] },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { size: 'md', fullWidth: false, value: '30d', isDisabled: false },
    render: (p, onEvent) => (
      <Basic key={String(p.value)} size={p.size as 'sm' | 'md'} fullWidth={Boolean(p.fullWidth)} value={String(p.value)} isDisabled={Boolean(p.isDisabled)} onChange={(v) => onEvent(`onChange("${v}")`)} />
    ),
    code: (p) => `<SegmentedControl aria-label="Time range" defaultValue="${p.value}"${p.size === 'sm' ? ' size="sm"' : ''}${p.fullWidth ? ' fullWidth' : ''}${p.isDisabled ? ' isDisabled' : ''} onChange={setRange}>\n  <SegmentedControlItem value="7d">7 days</SegmentedControlItem>\n  <SegmentedControlItem value="30d">30 days</SegmentedControlItem>\n  <SegmentedControlItem value="90d">90 days</SegmentedControlItem>\n</SegmentedControl>`,
  },
  states: [
    { name: 'Middle selected', description: 'One segment raised.', Render: () => <Basic /> },
    { name: 'First selected', description: 'Selection moves with a short slide.', Render: () => <Basic value="7d" /> },
    { name: 'Small', description: '24px segments for toolbars.', Render: () => <Basic size="sm" /> },
    { name: 'Full width', description: 'Equal segments filling the container.', Render: () => <Basic fullWidth /> },
    { name: 'Disabled', description: 'Muted, not focusable.', Render: () => <Basic isDisabled /> },
  ],
  sections: [
    {
      type: 'numbered',
      id: 'validation',
      title: 'Validation',
      intro: 'A segmented control always has a value, so there is nothing to validate by default.',
      items: [
        { title: 'Always preselect', body: 'Give it a defaultValue. There is no empty state; if the answer must be explicit, use RadioGroup.' },
        { title: 'Disable, do not hide', body: 'If an option does not apply, disable that segment and explain in nearby text.' },
        { title: 'Apply at once', body: 'The change is the commit. Do not pair with a Save button.' },
        { title: 'Handle failure', body: 'If the change cannot load data, revert to the previous segment and show a Toast.' },
      ],
    },
    {
      type: 'rules',
      id: 'rules',
      title: 'Rules',
      items: [
        { title: 'Two to five segments', body: 'Past five the labels get cramped in 320px. Use Select.' },
        { title: 'Equal weight', body: 'Labels are similar length. Use fullWidth when widths differ a lot.' },
        { title: 'Order', body: 'Natural order: small to large, or the frequency of use.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Labels', body: 'One or two words, sentence case: 7 days, List.' },
      { title: 'Parallel', body: 'All numbers, all nouns, or all verbs. Do not mix.' },
      { title: 'Name the group', body: 'aria-label describes the setting ("Time range") because there is no visible label.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['Tab', 'Shift+Tab'], action: 'Moves focus into and out of the control on the selected segment.' },
      { keys: ['←', '→'], action: 'Selects the previous or next segment.' },
      { keys: ['↑', '↓'], action: 'Same as left and right.' },
      { keys: ['Space'], action: 'Selects the focused segment.' },
    ],
    notes: [
      'Built on React Aria RadioGroup: role="radiogroup" with native radios, horizontal.',
      'Screen readers announce "<label>, radio button, 2 of 3, selected".',
      'Always provide aria-label or aria-labelledby for the group.',
      'Focus shows a 2px ring on the segment.',
      'Segments are 24 to 28px tall; for touch, use md and surround with 8px of space.',
    ],
    reducedMotion: 'The selection indicator changes instantly.',
  },
  props: [
    { name: 'value / defaultValue', type: 'string', description: 'Controlled or initial selection.' },
    { name: 'onChange', type: '(value: string) => void', description: 'Fires when the selection changes.' },
    { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Segment height 24 or 28px.' },
    { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretch with equal segments.' },
    { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disable all segments.' },
    { name: 'aria-label', type: 'string', description: 'Required accessible name.' },
    { name: 'SegmentedControlItem: value', type: 'string', description: 'Required option value.' },
    { name: 'SegmentedControlItem: isDisabled', type: 'boolean', default: 'false', description: 'Disable one segment.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Root style override.' },
  ],
  related: ['radio-group', 'tabs', 'toggle-button-group', 'select', 'switch'],
};
export default page;
