import { Plus, ArrowRight, Trash2, Download } from 'lucide-react';
import { Button } from 'oniva-ui';
import type { DocPage } from '../types';

const row = { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' } as const;

const page: DocPage = {
  slug: 'button',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Button',
  group: ['Components', 'Actions'],
  sourcePath: 'components/Button',
  lede: 'Triggers one action. Five variants, four sizes, and a loading state that keeps its width so the layout never jumps.',
  anatomy: {
    intro: 'Six parts. The container and label are always present. Icons are optional and sit 6px from the label. The spinner replaces the label visually while keeping it in the accessible name.',
    Render: () => (
      <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <Button startIcon={<Plus size={16} />} endIcon={<ArrowRight size={16} />}>New invoice</Button>
        <div style={{ alignItems: 'center', display: 'flex', gap: 16 }}>
          <Button variant="secondary" isLoading>Saving</Button>
          <Button variant="secondary" isIconOnly aria-label="Download"><Download size={16} /></Button>
        </div>
      </div>
    ),
    parts: [
      { name: 'Container', description: 'Native button. 36px tall at md, 10px radius, 12px horizontal padding, 14px text.', selector: 'button:not([data-pending]):not([aria-label])' },
      { name: 'Leading icon', description: '16px lucide icon, 6px gap to the label. Decorative, so aria-hidden.', selector: 'button:not([data-pending]):not([aria-label]) svg:first-of-type' },
      { name: 'Label', description: '14px medium. Sentence case, verb first, two to three words.', selector: 'button:not([data-pending]):not([aria-label]) > span:first-of-type', fallback: { x: 50, y: 30 } },
      { name: 'Trailing icon', description: 'Direction (arrow) or a menu (chevron). Never decoration.', selector: 'button:not([data-pending]):not([aria-label]) svg:last-of-type' },
      { name: 'Spinner', description: 'Centred, 800ms linear rotation. Under reduced motion it pulses opacity instead.', selector: 'button[data-pending] svg' },
      { name: 'Icon-only button', description: 'Square: 36px at md. Needs an aria-label. Use IconButton for toolbars.', selector: 'button[aria-label="Download"]' },
    ],
  },
  usage: {
    use: ['Submitting a form or starting a process.', 'The one primary action on a surface: one primary per view.', 'Actions in dialogs, cards and toolbars.', 'Anything that changes data, not just the view.'],
    avoid: [
      { text: 'Navigating to another page.', instead: { slug: 'link-button', label: 'LinkButton' } },
      { text: 'A control that shows only an icon in a dense toolbar.', instead: { slug: 'icon-button', label: 'IconButton' } },
      { text: 'Switching a state on and off.', instead: { slug: 'toggle-button', label: 'ToggleButton' } },
      { text: 'Grouped, mutually related actions in one bar.', instead: { slug: 'button-group', label: 'ButtonGroup' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'variant', label: 'Variant', options: ['primary', 'secondary', 'ghost', 'soft', 'danger'] },
      { kind: 'segmented', key: 'size', label: 'Size', options: ['xs', 'sm', 'md', 'lg'] },
      { kind: 'text', key: 'label', label: 'Label', presets: ['Save changes', 'Delete', 'Continue'] },
      { kind: 'toggle', key: 'icon', label: 'Leading icon' },
      { kind: 'toggle', key: 'isLoading', label: 'Loading' },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { variant: 'primary', size: 'md', label: 'Save changes', icon: false, isLoading: false, isDisabled: false },
    render: (p, ev) => (
      <Button variant={p.variant as 'primary'} size={p.size as 'md'} startIcon={p.icon ? <Plus size={16} /> : undefined} isLoading={Boolean(p.isLoading)} isDisabled={Boolean(p.isDisabled)} onPress={() => ev('onPress')}>
        {String(p.label)}
      </Button>
    ),
    code: (p) => {
      const attrs = [p.variant !== 'primary' && `variant="${p.variant}"`, p.size !== 'md' && `size="${p.size}"`, p.icon && 'startIcon={<Plus size={16} />}', p.isLoading && 'isLoading', p.isDisabled && 'isDisabled'].filter(Boolean).join(' ');
      return `<Button${attrs ? ' ' + attrs : ''} onPress={save}>${p.label}</Button>`;
    },
  },
  states: [
    { name: 'Primary', description: 'Flat accent fill with a contact shadow, one per view. Default variant.', Render: () => <Button>Save</Button> },
    { name: 'Secondary', description: 'Surface fill, 1px border and a raised shadow. Sits next to a primary.', Render: () => <Button variant="secondary">Cancel</Button> },
    { name: 'Disabled', description: 'Opacity 0.5, not-allowed cursor, not focusable by pointer. Explain why nearby.', Render: () => <Button isDisabled>Save</Button> },
    { name: 'Loading', description: 'Spinner over the label. Width is preserved and presses are blocked.', Render: () => <Button isLoading>Saving</Button> },
    { name: 'Danger', description: 'Flat red fill for destructive actions. Pair with a confirm step.', Render: () => <Button variant="danger" startIcon={<Trash2 size={16} />}>Delete</Button> },
    { name: 'Ghost', description: 'No fill until hover. Lowest emphasis, for toolbars and rows.', Render: () => <Button variant="ghost">Cancel</Button> },
    { name: 'Soft', description: 'Accent-tinted fill for secondary emphasis.', Render: () => <Button variant="soft">Invite</Button> },
    { name: 'Icon only', description: 'Square, 36px at md. aria-label is required.', Render: () => <Button variant="secondary" isIconOnly aria-label="Add"><Plus size={16} /></Button> },
  ],
  sections: [
    {
      type: 'numbered', id: 'choosing-a-variant', title: 'Choosing a variant', intro: 'Emphasis decreases from primary to ghost. Pick the lowest emphasis that still reads as clickable.',
      items: [
        { title: 'One primary per view', body: 'The thing most people came to do. Two primaries split attention and neither wins.' },
        { title: 'Secondary is the default pair', body: 'Next to a primary or standing alone in a dialog footer. Cancel is secondary or ghost, never primary.' },
        { title: 'Ghost or soft for repeats', body: 'Toolbars, table rows and anything that appears more than three times on a screen.' },
      ],
    },
    {
      type: 'rules', id: 'behaviour', title: 'Behaviour rules',
      items: [
        { title: 'Loading, not disabled', body: 'After a press that takes time, show isLoading. A disabled button gives no feedback and no reason.' },
        { title: 'Confirm destructive actions', body: 'Danger opens an AlertDialog that names the object. Do not delete on the first press.' },
        { title: 'Keep the label', body: 'Do not swap the label for “Loading…”. The spinner already says so, and the width stays put.' },
      ],
    },
    {
      type: 'itemTypes', id: 'sizes', title: 'Sizes', intro: 'Four heights. Use md by default and lg only on touch-first screens.',
      items: [
        { name: 'xs, 24px', description: '8px padding, 12px text, 4px radius. Dense tables only.', Render: () => <Button size="xs">Edit</Button> },
        { name: 'sm, 32px', description: '10px padding, 8px radius. Toolbars and card actions.', Render: () => <Button size="sm">Edit</Button> },
        { name: 'md, 36px', description: '12px padding, 10px radius. The default.', Render: () => <Button size="md">Edit</Button> },
        { name: 'lg, 40px', description: '16px padding, 10px radius. Forms on mobile and hero actions.', Render: () => <Button size="lg">Edit</Button> },
      ],
    },
    {
      type: 'dodont', id: 'do-and-dont', title: 'Do and don’t',
      items: [
        { kind: 'do', caption: 'Verb first, sentence case, names the object.', example: () => <Button>Create invoice</Button> },
        { kind: 'dont', caption: 'Vague labels and Title Case.', example: () => <Button>Submit Form</Button> },
        { kind: 'do', caption: 'Primary on the right, secondary beside it.', example: () => <div style={row}><Button variant="secondary">Cancel</Button><Button>Save</Button></div> },
        { kind: 'dont', caption: 'Two primaries compete for the same click.', example: () => <div style={row}><Button>Save</Button><Button>Publish</Button></div> },
      ],
    },
  ],
  content: {
    title: 'Content',
    rules: [
      { title: 'Verb plus object', body: 'Create invoice, not New. Two to three words, under 24 characters.' },
      { title: 'Sentence case', body: 'Save changes, not Save Changes. Product names keep their own casing.' },
      { title: 'No trailing punctuation', body: 'No periods. An ellipsis only when the button opens a step needing more input: Rename…' },
      { title: 'Say what happens', body: 'Delete invoice beats Delete beats OK. Never Yes or No.' },
      { title: 'Loading label is the action', body: 'Keep “Save changes” while loading. The spinner shows progress.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['Enter'], action: 'Activates the button.' },
      { keys: ['Space'], action: 'Activates the button on key up.' },
      { keys: ['Tab'], action: 'Moves focus to the next focusable element.' },
      { keys: ['Shift', 'Tab'], action: 'Moves focus to the previous focusable element.' },
    ],
    notes: [
      'Renders a native button, so the role and name come from the browser. Icon-only buttons need an aria-label.',
      'Loading maps to React Aria isPending: the label stays in the accessible name, presses are ignored and aria-disabled is set.',
      'The focus ring is 2px, accent, offset 2px, and shows for keyboard focus only.',
      'Hit area: 36px at md. Use lg (40px) on touch-first screens and keep 8px between neighbours.',
      'Color is never the only signal: danger buttons also carry a verb like Delete.',
    ],
    reducedMotion: 'The press scale (0.97) is kept for pointer only and the spinner pulses opacity instead of rotating.',
  },
  props: [
    { name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'soft' | 'danger'", default: "'primary'", description: 'Visual style.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Height 24, 32, 36 and 40px.' },
    { name: 'isLoading', type: 'boolean', default: 'false', description: 'Shows a spinner, keeps width and blocks presses (RAC isPending).' },
    { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disables interaction and dims to 0.5.' },
    { name: 'isIconOnly', type: 'boolean', default: 'false', description: 'Square button for a single icon. Provide aria-label.' },
    { name: 'startIcon', type: 'ReactNode', description: '16px icon before the label.' },
    { name: 'endIcon', type: 'ReactNode', description: '16px icon after the label.' },
    { name: 'onPress', type: '(e: PressEvent) => void', description: 'Fires for pointer, keyboard and touch.' },
    { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'Native button type. Use submit inside forms.' },
    { name: 'form / name / value', type: 'string', description: 'Native form association props from React Aria.' },
    { name: 'autoFocus', type: 'boolean', description: 'Focuses on mount.' },
    { name: 'className', type: 'string', description: 'Class on the button.' },
    { name: 'style', type: 'CSSProperties', description: 'Inline style on the button.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'StyleX overrides, applied last.' },
    { name: 'ref', type: 'Ref<HTMLButtonElement>', description: 'Ref to the button element.' },
  ],
  related: ['icon-button', 'link-button', 'button-group', 'toggle-button', 'alert-dialog'],
};
export default page;
