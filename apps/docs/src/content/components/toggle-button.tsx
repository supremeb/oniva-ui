import { Bell, BellOff, Star } from 'lucide-react';
import { ToggleButton } from 'oniva-ui';
import type { DocPage } from '../types';

const page: DocPage = {
  slug: 'toggle-button',
  status: 'Stable',
  version: '0.1.0',
  importName: 'ToggleButton',
  group: ['Components', 'Actions'],
  sourcePath: 'components/ToggleButton',
  lede: 'A button that stays pressed. It handles on/off choices that take effect immediately: mute, favourite, bold.',
  anatomy: {
    intro: 'Three parts. The container and label are required. The icon is optional. Selected state changes fill, border and text colour together.',
    Render: () => (
      <ToggleButton defaultSelected startIcon={<Bell size={16} />}>
        Mute alerts
      </ToggleButton>
    ),
    parts: [
      { name: 'Container', description: 'Native button with aria-pressed. 36px tall at md, 10px radius, 12px padding, 1px border. Selected secondary: accent-soft fill and accent border.', selector: 'button[aria-pressed]' },
      { name: 'Leading icon', description: '16px lucide icon, 6px gap. Swap the glyph with the state (Bell to BellOff) so state is not carried by colour alone.', selector: 'button svg:first-of-type' },
      { name: 'Label', description: '14px, medium weight. Name the thing being toggled, not the state.', selector: 'button', fallback: { x: 65, y: 50 } },
    ],
  },
  usage: {
    use: ['Instant on/off preferences: Mute alerts, Favourite.', 'Formatting toggles in editor toolbars (icon-only).', 'Filters that can be pressed on and off independently.'],
    avoid: [
      { text: 'A setting that is saved with a form.', instead: { slug: 'switch', label: 'Switch' } },
      { text: 'Choosing exactly one of several options.', instead: { slug: 'toggle-button-group', label: 'ToggleButtonGroup' } },
      { text: 'Triggering a one-off action.', instead: { slug: 'button', label: 'Button' } },
      { text: 'Agreeing to terms or ticking list rows.', instead: { slug: 'checkbox', label: 'Checkbox' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'variant', label: 'Variant', options: ['secondary', 'ghost', 'soft'] },
      { kind: 'segmented', key: 'size', label: 'Size', options: ['xs', 'sm', 'md', 'lg'] },
      { kind: 'text', key: 'label', label: 'Label', presets: ['Mute alerts', 'Favourite', 'Pin to top'] },
      { kind: 'toggle', key: 'defaultSelected', label: 'Selected at start' },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { variant: 'secondary', size: 'md', label: 'Mute alerts', defaultSelected: true, isDisabled: false },
    render: (p, ev) => (
      <ToggleButton
        key={String(p.defaultSelected)}
        variant={p.variant as 'secondary'}
        size={p.size as 'md'}
        defaultSelected={Boolean(p.defaultSelected)}
        isDisabled={Boolean(p.isDisabled)}
        startIcon={<Bell size={16} />}
        onChange={(on) => ev(`onChange: ${on}`)}
      >
        {String(p.label)}
      </ToggleButton>
    ),
    code: (p) => {
      const attrs = [p.variant !== 'secondary' && `variant="${p.variant}"`, p.size !== 'md' && `size="${p.size}"`, p.defaultSelected && 'defaultSelected', p.isDisabled && 'isDisabled'].filter(Boolean).join(' ');
      return `<ToggleButton${attrs ? ' ' + attrs : ''} startIcon={<Bell size={16} />} onChange={setMuted}>${p.label}</ToggleButton>`;
    },
  },
  states: [
    { name: 'Off', description: 'aria-pressed="false". Looks like a secondary Button.', Render: () => <ToggleButton>Mute alerts</ToggleButton> },
    { name: 'On', description: 'aria-pressed="true". Accent-soft fill, accent border and text.', Render: () => <ToggleButton defaultSelected>Mute alerts</ToggleButton> },
    { name: 'On, ghost', description: 'Selected ghost uses the tertiary surface and full text colour.', Render: () => <ToggleButton variant="ghost" defaultSelected>Pinned</ToggleButton> },
    { name: 'On, soft', description: 'Selected soft deepens the accent tint.', Render: () => <ToggleButton variant="soft" defaultSelected>Watching</ToggleButton> },
    { name: 'Icon only', description: 'Needs aria-label. Square at the size width.', Render: () => <ToggleButton isIconOnly aria-label="Favourite" defaultSelected><Star size={16} /></ToggleButton> },
    { name: 'Swapped glyph', description: 'The icon and label change with state.', Render: () => <ToggleButton defaultSelected startIcon={<BellOff size={16} />}>Muted</ToggleButton> },
    { name: 'Disabled', description: '50% opacity, no toggle.', Render: () => <ToggleButton isDisabled defaultSelected>Mute alerts</ToggleButton> },
  ],
  sections: [
    {
      type: 'rules', id: 'rules', title: 'Rules',
      items: [
        { title: 'Effect is immediate', body: 'If the change waits for a Save button, use Switch or Checkbox instead.' },
        { title: 'State is more than colour', body: 'Accent fill and border change together, and the glyph or label should change too. The only non-colour signal otherwise is aria-pressed.' },
        { title: 'Keep the label constant', body: 'A label that flips from "Mute" to "Unmute" reads as an action, not a state. Prefer a fixed noun or swap to "Muted".' },
      ],
    },
    {
      type: 'dodont', id: 'do-and-dont', title: 'Do and don’t',
      items: [
        { kind: 'do', caption: 'Fixed noun, glyph reflects state.', example: () => <ToggleButton defaultSelected startIcon={<Star size={16} />}>Favourite</ToggleButton> },
        { kind: 'dont', caption: 'Verb label that flips. Users cannot tell state from action.', example: () => <ToggleButton defaultSelected>Click to unfavourite</ToggleButton> },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Noun or past participle', body: 'Favourite, Pinned, Muted. Not Toggle favourite.' },
      { title: 'Icon-only needs a label', body: 'aria-label names the thing: "Favourite", not "Star".' },
      { title: 'One to two words', body: 'The button stays about 120px wide at md.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['Enter', 'Space'], action: 'Toggles the pressed state.' },
      { keys: ['Tab'], action: 'Moves focus to or past the button.' },
    ],
    notes: [
      'Built on React Aria ToggleButton: native button with aria-pressed="true" or "false". Screen readers announce "Mute alerts, toggle button, pressed".',
      'Do not change the accessible name when pressed. The state is already announced.',
      'Inside a ToggleButtonGroup with selectionMode="single" it takes role="radio" and uses arrow keys instead.',
      'Focus ring is 2px accent, 2px offset, keyboard only.',
    ],
    reducedMotion: 'Colour transitions and the 0.97 press scale drop to 0.01ms.',
  },
  props: [
    { name: 'isSelected / defaultSelected', type: 'boolean', default: 'false', description: 'Controlled or initial pressed state.' },
    { name: 'onChange', type: '(isSelected: boolean) => void', description: 'Fires when the state flips.' },
    { name: 'variant', type: "'secondary' | 'ghost' | 'soft'", default: "'secondary'", description: 'Visual style. Inside a group the group variant applies.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Height 24, 32, 36, 40.' },
    { name: 'isIconOnly', type: 'boolean', default: 'false', description: 'Square button. Requires aria-label.' },
    { name: 'startIcon', type: 'ReactNode', description: 'Icon before the label.' },
    { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disables interaction.' },
    { name: 'id', type: 'Key', description: 'Required as a key when used inside a ToggleButtonGroup.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'StyleX overrides, applied last.' },
  ],
  related: ['toggle-button-group', 'switch', 'checkbox', 'button', 'icon-button'],
};
export default page;
