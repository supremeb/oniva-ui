import { Button, Checkbox } from 'oniva-ui';
import type { DocPage } from '../types';

// The real Popover needs an open trigger. The stage draws the same surface (xl radius, dropdown
// floating shadow, 16px padded dialog) with an arrow, next to a real trigger Button.
const Surface = ({ width = 260, pad = 16, children, arrow = true }: { width?: number; pad?: number; children: React.ReactNode; arrow?: boolean }) => (
  <div style={{ alignItems: 'flex-start', display: 'flex', flexDirection: 'column', gap: 8 }}>
    <Button variant="secondary">Filters</Button>
    <div role="dialog" aria-label="Filters" style={{ background: 'var(--oniva-color-surface)', border: '1px solid var(--oniva-color-border)', borderRadius: 12, boxShadow: 'var(--oniva-shadow-dropdown)', fontSize: 14, maxWidth: 360, minWidth: 200, padding: pad, position: 'relative', width }}>
      {arrow && <svg data-part="arrow" aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" style={{ fill: 'var(--oniva-color-surface)', left: 20, position: 'absolute', stroke: 'var(--oniva-color-border)', top: -7, transform: 'rotate(180deg)' }}><path d="M0 0 L6 6 L12 0" /></svg>}
      {children}
    </div>
  </div>
);
const Filters = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <strong style={{ fontSize: 14 }}>Status</strong>
    <Checkbox defaultSelected>Paid</Checkbox>
    <Checkbox>Overdue</Checkbox>
    <Checkbox>Draft</Checkbox>
  </div>
);

const page: DocPage = {
  slug: 'popover',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Popover',
  group: ['Components', 'Overlays'],
  sourcePath: 'components/Popover',
  lede: 'A floating panel anchored to the control that opened it. It holds small interactive content and closes on outside click or Esc.',
  anatomy: {
    intro: 'Four parts. The surface and content are always present; the arrow is optional. The stage freezes an open popover beside its trigger.',
    Render: () => <Surface><Filters /></Surface>,
    parts: [
      { name: 'Trigger', description: 'Any pressable control. It keeps focus context and receives focus back on close.', selector: 'button' },
      { name: 'Surface', description: '200px min, 360px max width, 12px radius, 1px border, floating shadow, 8px offset from the trigger.', selector: '[role="dialog"]' },
      { name: 'Content', description: '16px padding (noPadding removes it). Wrapped in a labelled dialog for focus management.', selector: '[role="dialog"] strong' },
      { name: 'Arrow', description: 'Optional 12px pointer (showArrow); adds 4px to the offset.', selector: '[data-part="arrow"]' },
    ],
  },
  usage: {
    use: ['Small interactive content tied to one control: filters, a date picker, share settings.', 'Inline forms of one to three fields.', 'Content the user may want to leave open while they look elsewhere.'],
    avoid: [
      { text: 'A list of commands.', instead: { slug: 'dropdown-menu', label: 'DropdownMenu' } },
      { text: 'A read-only preview on hover.', instead: { slug: 'hover-card', label: 'HoverCard' } },
      { text: 'A one-line hint.', instead: { slug: 'tooltip', label: 'Tooltip' } },
      { text: 'Tasks that need full attention.', instead: { slug: 'dialog', label: 'Dialog' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'toggle', key: 'showArrow', label: 'Show arrow' },
      { kind: 'toggle', key: 'noPadding', label: 'No padding' },
      { kind: 'select', key: 'placement', label: 'Placement', options: ['bottom', 'bottom start', 'top', 'right'] },
      { kind: 'number', key: 'offset', label: 'Offset', min: 0, max: 24, step: 2 },
    ],
    initial: { showArrow: true, noPadding: false, placement: 'bottom start', offset: 8 },
    render: (p, ev) => (
      <div onClick={() => ev('onOpenChange(true)')}>
        <Surface arrow={Boolean(p.showArrow)} pad={p.noPadding ? 0 : 16}><Filters /></Surface>
      </div>
    ),
    code: (p) => `<PopoverTrigger>\n  <Button variant="secondary">Filters</Button>\n  <Popover${p.showArrow ? ' showArrow' : ''}${p.noPadding ? ' noPadding' : ''} placement="${p.placement}"${Number(p.offset) !== 8 ? ` offset={${p.offset}}` : ''} aria-label="Filters">\n    …\n  </Popover>\n</PopoverTrigger>`,
  },
  states: [
    { name: 'With arrow', description: 'Arrow points at the trigger.', Render: () => <Surface><Filters /></Surface> },
    { name: 'Without arrow', description: 'Default. 8px gap, no pointer.', Render: () => <Surface arrow={false}><Filters /></Surface> },
    { name: 'No padding', description: 'For lists or calendars that supply their own spacing.', Render: () => <Surface arrow={false} pad={0}><div style={{ padding: '10px 14px' }}>Edge to edge content</div></Surface> },
    { name: 'Wide', description: 'Capped at 360px; longer content wraps.', Render: () => <Surface width={360} arrow={false}><span>Anyone with the link can view this report. Turn off link access to revoke it for all 14 viewers.</span></Surface> },
  ],
  sections: [
    { type: 'text', id: 'choosing-an-overlay', title: 'Choosing an overlay', body: <>Popovers are anchored and non-blocking: the page behind stays usable. For when to pick a popover over a dialog, drawer or tooltip, see the <a href="#/components/dialog">comparison on Dialog</a>.</> },
    {
      type: 'rules', id: 'popover-recipes', title: 'Composition recipes',
      items: [
        { title: 'Filter popover', body: 'Button trigger, checkboxes or a RadioGroup, footer with Clear and Apply.' },
        { title: 'Date picker', body: 'noPadding with a Calendar inside; the calendar owns its 16px padding.' },
        { title: 'Share link', body: 'Read-only input plus a copy IconButton; confirm with a Toast.' },
      ],
    },
  ],
  content: { rules: [{ title: 'Name it', body: 'Always pass aria-label; match the trigger text.' }, { title: 'Short headings', body: 'One or two words, 14px semibold.' }, { title: 'Apply or auto-apply', body: 'Say which. If changes apply live, add no footer buttons.' }] },
  accessibility: {
    keyboard: [
      { keys: ['Enter', 'Space'], action: 'Opens from the trigger and moves focus into the popover.' },
      { keys: ['Tab'], action: 'Moves through content; focus is contained while open.' },
      { keys: ['Esc'], action: 'Closes and returns focus to the trigger.' },
    ],
    notes: ['Inner content is a role="dialog" named by aria-label.', 'Outside click closes it. Scrolling the page repositions it.', 'It flips to the opposite side when there is no room.'],
    reducedMotion: 'The 0.96 scale-in is removed; the popover appears without animation.',
  },
  props: [
    { name: 'children', type: 'ReactNode | ({ close }) => ReactNode', description: 'Content, or a render prop with close().' },
    { name: 'aria-label', type: 'string', description: 'Accessible name for the popover dialog.' },
    { name: 'showArrow', type: 'boolean', default: 'false', description: 'Pointer towards the trigger.' },
    { name: 'noPadding', type: 'boolean', default: 'false', description: 'Removes the 16px padding.' },
    { name: 'placement', type: 'Placement', default: "'bottom'", description: 'RAC placement, such as top, bottom start, right.' },
    { name: 'offset', type: 'number', default: '8', description: 'Gap from the trigger in px (+4 with arrow).' },
    { name: 'isOpen / defaultOpen / onOpenChange', type: 'boolean / (open) => void', description: 'Controlled state.' },
    { name: 'className / xstyle / contentXstyle', type: 'string / StyleXStyles', description: 'Overrides for the surface and inner dialog.' },
    { name: 'PopoverTrigger', type: 'component', description: 'Wraps a pressable trigger and the Popover.' },
  ],
  related: ['dialog', 'dropdown-menu', 'tooltip', 'hover-card', 'date-picker'],
};
export default page;
