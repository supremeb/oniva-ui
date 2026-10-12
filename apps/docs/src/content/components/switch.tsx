import { Switch } from 'oniva-ui';
import type { DocPage } from '../types';

type P = {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  isSelected?: boolean;
  isDisabled?: boolean;
  onChange?: (v: boolean) => void;
};

const Basic = (p: P) => (
  <div style={{ width: 300 }}>
    <Switch size={p.size} defaultSelected={p.isSelected} isDisabled={p.isDisabled} onChange={p.onChange}>
      {p.text ?? 'Auto-pay invoices'}
    </Switch>
  </div>
);

const page: DocPage = {
  slug: 'switch',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Switch',
  group: ['Components', 'Forms'],
  sourcePath: 'components/Switch',
  lede: 'An on/off control that takes effect the moment it is flipped. It handles settings and feature toggles where the result is immediate.',
  anatomy: {
    intro: 'Three parts. The track and knob are always present; the label is strongly recommended and only omitted with aria-label.',
    Render: () => <Basic isSelected />,
    parts: [
      { name: 'Track', description: '44×24px at md (36×20 sm, 56×32 lg), fully rounded. Off is a neutral fill; on uses the accent gradient.', selector: 'label > span:nth-child(2)' },
      { name: 'Knob', description: '18px circle at md, 2px inset, slides 20px. Mirrors in RTL. White on the accent track.', selector: 'label > span:nth-child(2) > span' },
      { name: 'Label', description: '14px, text color, 10px from the track. Click the label to toggle.', selector: 'label > span:nth-child(3)', fallback: { x: 70, y: 50 } },
    ],
  },
  usage: {
    use: ['Settings that apply immediately: notifications, auto-pay.', 'Turning a feature on or off for a workspace.', 'A binary preference with a clear current state.', 'Compact lists of toggles, one per row.'],
    avoid: [
      { text: 'A choice that is saved later with a form.', instead: { slug: 'checkbox', label: 'Checkbox' } },
      { text: 'Two named options such as Monthly / Annual.', instead: { slug: 'segmented-control', label: 'SegmentedControl' } },
      { text: 'An action that runs once, like Export.', instead: { slug: 'button', label: 'Button' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'text', key: 'text', label: 'Label', presets: ['Auto-pay invoices', 'Weekly digest', 'Two-step sign-in'] },
      { kind: 'segmented', key: 'size', label: 'Size', options: ['sm', 'md', 'lg'] },
      { kind: 'toggle', key: 'isSelected', label: 'On' },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { text: 'Auto-pay invoices', size: 'md', isSelected: true, isDisabled: false },
    render: (p, onEvent) => (
      <Basic
        key={`${p.isSelected}`}
        text={String(p.text)}
        size={p.size as 'sm' | 'md' | 'lg'}
        isSelected={Boolean(p.isSelected)}
        isDisabled={Boolean(p.isDisabled)}
        onChange={(v) => onEvent(`onChange(${v})`)}
      />
    ),
    code: (p) => `<Switch${p.size !== 'md' ? ` size="${p.size}"` : ''}${p.isSelected ? ' defaultSelected' : ''}${p.isDisabled ? ' isDisabled' : ''} onChange={setAutoPay}>\n  ${p.text}\n</Switch>`,
  },
  states: [
    { name: 'Off', description: 'Neutral track, knob at the start.', Render: () => <Basic /> },
    { name: 'On', description: 'Accent track, knob slid to the end.', Render: () => <Basic isSelected /> },
    { name: 'Disabled off', description: '50% opacity, not-allowed cursor.', Render: () => <Basic isDisabled /> },
    { name: 'Disabled on', description: 'Locked in the on position, for example by an admin policy.', Render: () => <Basic isDisabled isSelected text="Two-step sign-in (required by admin)" /> },
    { name: 'Sizes', description: 'sm 36×20, md 44×24, lg 56×32.', Render: () => (
      <div style={{ display: 'grid', gap: 12 }}>
        <Switch size="sm" defaultSelected>Small</Switch>
        <Switch size="md" defaultSelected>Medium</Switch>
        <Switch size="lg" defaultSelected>Large</Switch>
      </div>
    ) },
    { name: 'Long label', description: 'Wraps; the track stays vertically centered.', Render: () => <Basic isSelected text="Send me a weekly digest of unpaid invoices and upcoming payouts" /> },
  ],
  sections: [
    {
      type: 'numbered',
      id: 'validation',
      title: 'Validation',
      intro: 'A switch has no invalid state because both values are legal. Failure is about the save, not the value.',
      items: [
        { title: 'Apply immediately', body: 'The flip is the commit. If it needs a Save step, use a Checkbox.' },
        { title: 'Revert on failure', body: 'If the request fails, flip the switch back and show a Toast: "Could not turn on auto-pay. Try again."' },
        { title: 'Explain locked states', body: 'When disabled by policy, say why in the label or a tooltip: "(required by admin)".' },
        { title: 'Confirm only destructive offs', body: 'Turning off two-step sign-in warrants a dialog. Turning off a digest does not.' },
      ],
    },
    {
      type: 'dodont',
      id: 'labels',
      title: 'Labels',
      items: [
        { kind: 'do', caption: 'Label the feature. On means on.', example: () => <Basic isSelected text="Auto-pay invoices" /> },
        { kind: 'dont', caption: 'Do not label the action. "Enable" reads the same in both states.', example: () => <Basic text="Enable auto-pay" /> },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Name the setting', body: 'A noun phrase: Auto-pay invoices, Weekly digest.' },
      { title: 'State, not verb', body: 'The position shows the state. Do not write "Turn on".' },
      { title: 'Never use On/Off text', body: 'Do not add visible On/Off words inside the track.' },
      { title: 'Length', body: 'Under 40 characters. Put detail in the row description beside it.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['Tab', 'Shift+Tab'], action: 'Moves focus to and from the switch.' },
      { keys: ['Space'], action: 'Toggles the switch.' },
      { keys: ['Enter'], action: 'Not handled by a switch. Use Space.' },
    ],
    notes: [
      'Built on React Aria Switch: a native checkbox with role="switch".',
      'Screen readers announce: label, "switch", "on" or "off".',
      'Focus shows a 2px focus ring around the track.',
      'The knob uses translate with :dir(rtl) mirroring, so it works in right-to-left layouts.',
      'Track height is 20 to 32px. Wrap rows to at least 44px tall for touch.',
    ],
    reducedMotion: 'The knob slide and track fill change instantly.',
  },
  props: [
    { name: 'children', type: 'ReactNode', description: 'Label. Use aria-label when omitted.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Track size: 36×20, 44×24 or 56×32.' },
    { name: 'isSelected / defaultSelected', type: 'boolean', default: 'false', description: 'Controlled or initial on state.' },
    { name: 'onChange', type: '(isSelected: boolean) => void', description: 'Fires when flipped.' },
    { name: 'isDisabled / isReadOnly', type: 'boolean', default: 'false', description: 'States.' },
    { name: 'name / value', type: 'string', description: 'Native form submission.' },
    { name: 'style', type: 'CSSProperties', description: 'Inline style on the root.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Root style override.' },
    { name: 'ref', type: 'Ref<HTMLLabelElement>', description: 'Forwarded to the label.' },
  ],
  related: ['checkbox', 'toggle-button', 'segmented-control', 'radio-group'],
};
export default page;
