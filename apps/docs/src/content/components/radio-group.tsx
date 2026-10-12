import { Radio, RadioGroup } from 'oniva-ui';
import type { DocPage } from '../types';

type P = {
  label?: string;
  cards?: boolean;
  orientation?: 'vertical' | 'horizontal';
  isInvalid?: boolean;
  isDisabled?: boolean;
  description?: string;
  error?: string;
  value?: string;
  onChange?: (v: string) => void;
};

const Basic = (p: P) => (
  <div style={{ width: 340 }}>
    <RadioGroup
      label={p.label ?? 'Billing cycle'}
      description={p.description}
      errorMessage={p.error}
      cards={p.cards}
      orientation={p.orientation}
      isInvalid={p.isInvalid}
      isDisabled={p.isDisabled}
      defaultValue={p.value === undefined ? 'monthly' : p.value || undefined}
      onChange={p.onChange}
    >
      <Radio value="monthly" variant={p.cards ? 'card' : 'default'} description={p.cards ? 'Cancel anytime' : undefined} trailing={p.cards ? '$29' : undefined}>
        Monthly
      </Radio>
      <Radio value="annual" variant={p.cards ? 'card' : 'default'} description={p.cards ? 'Two months free' : undefined} trailing={p.cards ? '$290' : undefined}>
        Annual
      </Radio>
      <Radio value="custom" variant={p.cards ? 'card' : 'default'} description={p.cards ? 'Talk to sales' : undefined} trailing={p.cards ? 'Custom' : undefined}>
        Custom
      </Radio>
    </RadioGroup>
  </div>
);

const page: DocPage = {
  slug: 'radio-group',
  status: 'Stable',
  version: '0.1.0',
  importName: 'RadioGroup',
  group: ['Components', 'Forms'],
  sourcePath: 'components/RadioGroup',
  lede: 'Choose exactly one option from a short list where every option stays visible. It handles plain choices and richer card choices with prices or detail.',
  anatomy: {
    intro: 'Five parts. The group label and radios are always present. Description and error are optional; the card variant adds a border and trailing slot.',
    Render: () => <Basic cards description="You can switch plans later." />,
    parts: [
      { name: 'Group label', description: '14px medium, names the question. It labels the radiogroup, so it is required for assistive tech.', selector: '[role="radiogroup"] > span:first-child' },
      { name: 'Radio', description: '16px circle with a 1px control border and a 6px inner pip when selected. Hover darkens the border.', selector: '[role="radiogroup"] label:first-of-type > span:nth-child(2)' },
      { name: 'Option label', description: '14px medium. Cards add a 12px padding, 10px radius border that turns accent when selected.', selector: '[role="radiogroup"] label:first-of-type > span:nth-child(3)' },
      { name: 'Trailing', description: 'Card only. Right-aligned value such as a price. Keep to one short token.', selector: '[role="radiogroup"] label:first-of-type > span:nth-child(4)', fallback: { x: 90, y: 40 } },
      { name: 'Description', description: '13px muted help text, below the group or below an option label.', selector: '[slot="description"]', fallback: { x: 40, y: 92 } },
    ],
  },
  usage: {
    use: ['Two to five mutually exclusive options.', 'Plans or shipping choices that need price and detail (card variant).', 'Choices the user must compare, so all options stay on screen.', 'A required answer with no sensible default.'],
    avoid: [
      { text: 'More than about six options.', instead: { slug: 'select', label: 'Select' } },
      { text: 'An on/off choice.', instead: { slug: 'switch', label: 'Switch' } },
      { text: 'Switching a view or filter inline.', instead: { slug: 'segmented-control', label: 'SegmentedControl' } },
      { text: 'Picking several options.', instead: { slug: 'checkbox-group', label: 'CheckboxGroup' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'text', key: 'label', label: 'Group label', presets: ['Billing cycle', 'Delivery speed', 'Plan'] },
      { kind: 'toggle', key: 'cards', label: 'Card variant' },
      { kind: 'segmented', key: 'orientation', label: 'Orientation', options: ['vertical', 'horizontal'] },
      { kind: 'toggle', key: 'isInvalid', label: 'Invalid' },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { label: 'Billing cycle', cards: false, orientation: 'vertical', isInvalid: false, isDisabled: false },
    render: (p, onEvent) => (
      <Basic
        label={String(p.label)}
        cards={Boolean(p.cards)}
        orientation={p.orientation as 'vertical' | 'horizontal'}
        isInvalid={Boolean(p.isInvalid)}
        isDisabled={Boolean(p.isDisabled)}
        error="Choose a billing cycle."
        onChange={(v) => onEvent(`onChange("${v}")`)}
      />
    ),
    code: (p) =>
      `<RadioGroup label="${p.label}" defaultValue="monthly"${p.cards ? ' cards' : ''}${p.orientation === 'horizontal' ? ' orientation="horizontal"' : ''}${p.isInvalid ? ' isInvalid errorMessage="Choose a billing cycle."' : ''}${p.isDisabled ? ' isDisabled' : ''}>\n  <Radio value="monthly"${p.cards ? ' variant="card" trailing="$29"' : ''}>Monthly</Radio>\n  <Radio value="annual"${p.cards ? ' variant="card" trailing="$290"' : ''}>Annual</Radio>\n</RadioGroup>`,
  },
  states: [
    { name: 'Selected', description: 'One pip, one answer.', Render: () => <Basic /> },
    { name: 'No selection', description: 'Nothing chosen. Required groups start here.', Render: () => <Basic value="" /> },
    { name: 'Cards', description: 'Bordered rows with detail and a trailing value.', Render: () => <Basic cards /> },
    { name: 'Horizontal', description: '20px gap, wraps. For 2 to 3 short labels.', Render: () => <Basic orientation="horizontal" /> },
    { name: 'Invalid', description: 'Red group message under the options.', Render: () => <Basic value="" isInvalid error="Choose a billing cycle." /> },
    { name: 'Disabled', description: '50% opacity, not focusable.', Render: () => <Basic isDisabled /> },
  ],
  sections: [
    {
      type: 'numbered',
      id: 'validation',
      title: 'Validation',
      intro: 'Validation lives on the group, never on one radio.',
      items: [
        { title: 'Mark the group required', body: 'isRequired on RadioGroup blocks submit when nothing is chosen.' },
        { title: 'Do not preselect to dodge the error', body: 'Preselect only when one option is right for most people, such as the standard shipping speed.' },
        { title: 'Show the error after submit', body: 'An empty group is not wrong until the user tries to continue.' },
        { title: 'Name the missing choice', body: '"Choose a billing cycle", not "Required".' },
        { title: 'Cannot be unselected', body: 'Once chosen, a radio cannot be cleared. Add a "None" option if skipping is valid.' },
      ],
    },
    {
      type: 'rules',
      id: 'layout',
      title: 'Layout rules',
      items: [
        { title: 'Vertical by default', body: '12px between options. Scans faster than a row.' },
        { title: 'Horizontal only for short labels', body: 'Two or three options under 12 characters each.' },
        { title: 'Cards for detail', body: '8px between cards. Put price or limits in trailing, explanation in the description.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Group label', body: 'A question or noun: Billing cycle, Delivery speed. No colon.' },
      { title: 'Options', body: 'Parallel, sentence case, under 24 characters. Do not repeat the group label in each.' },
      { title: 'Order', body: 'Logical (small to large, cheap to expensive) or most common first.' },
      { title: 'Card description', body: 'One short fragment: "Cancel anytime".' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['Tab', 'Shift+Tab'], action: 'Moves focus into the group on the selected radio, or the first radio if none.' },
      { keys: ['↓', '→'], action: 'Selects and focuses the next radio.' },
      { keys: ['↑', '←'], action: 'Selects and focuses the previous radio.' },
      { keys: ['Space'], action: 'Selects the focused radio.' },
    ],
    notes: [
      'Built on React Aria RadioGroup: role="radiogroup" with native radios.',
      'Screen readers announce the group label, then "radio button, 1 of 3, selected".',
      'The group is a single tab stop. Arrow keys move and select.',
      'Focus shows a 2px focus ring around the radio dot.',
      'Cards are fully clickable; minimum card height is 44px with padding.',
    ],
    reducedMotion: 'The pip scale animation shortens to near-instant.',
  },
  props: [
    { name: 'label', type: 'ReactNode', description: 'Group label.' },
    { name: 'description', type: 'ReactNode', description: 'Group help text.' },
    { name: 'errorMessage', type: 'string | (v) => string', description: 'Shown when the group is invalid.' },
    { name: 'cards', type: 'boolean', default: 'false', description: 'Tighter 8px gap for card radios.' },
    { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Layout direction.' },
    { name: 'value / defaultValue', type: 'string', description: 'Controlled or initial selection.' },
    { name: 'onChange', type: '(value: string) => void', description: 'Fires when selection changes.' },
    { name: 'isRequired / isInvalid / isDisabled / isReadOnly', type: 'boolean', default: 'false', description: 'Group states.' },
    { name: 'Radio: value', type: 'string', description: 'Required. The value when selected.' },
    { name: 'Radio: variant', type: "'default' | 'card'", default: "'default'", description: 'Plain or bordered card.' },
    { name: 'Radio: description', type: 'ReactNode', description: 'Secondary text under the option label.' },
    { name: 'Radio: trailing', type: 'ReactNode', description: 'Card only. Trailing content such as a price.' },
    { name: 'Radio: isDisabled', type: 'boolean', default: 'false', description: 'Disable a single option.' },
  ],
  related: ['segmented-control', 'select', 'checkbox-group', 'switch', 'fieldset'],
};
export default page;
