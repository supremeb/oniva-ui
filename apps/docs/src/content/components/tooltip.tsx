import { Plus } from 'lucide-react';
import { IconButton } from 'oniva-ui';
import type { DocPage } from '../types';

// The real Tooltip only mounts while hovered. The stage draws the same inverted surface
// (text color as background, bg color as text) next to a real IconButton.
const Tip = ({ text = 'New invoice', arrow = true, width }: { text?: string; arrow?: boolean; width?: number }) => (
  <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
    <div role="tooltip" style={{ background: 'var(--oniva-color-text)', borderRadius: 8, boxShadow: 'var(--oniva-shadow-md)', color: 'var(--oniva-color-bg)', fontSize: 12, fontWeight: 500, lineHeight: '16px', maxWidth: 260, padding: '6px 10px', width }}>{text}</div>
    {arrow && <svg data-part="arrow" aria-hidden="true" width="8" height="8" viewBox="0 0 8 8" style={{ fill: 'var(--oniva-color-text)', transform: 'rotate(180deg)' }}><path d="M0 0 L4 4 L8 0" /></svg>}
    <IconButton aria-label={text}><Plus size={16} /></IconButton>
  </div>
);

const page: DocPage = {
  slug: 'tooltip',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Tooltip',
  group: ['Components', 'Overlays'],
  sourcePath: 'components/Tooltip',
  lede: 'A one-line label that appears on hover or keyboard focus. It names icon-only controls and never holds anything interactive.',
  anatomy: {
    intro: 'Three parts. The trigger and bubble are required; the arrow is on by default.',
    Render: () => <Tip />,
    parts: [
      { name: 'Trigger', description: 'A focusable control such as IconButton. The tooltip describes it; it does not replace its aria-label.', selector: 'button' },
      { name: 'Bubble', description: 'Inverted surface, 8px radius, 6px by 10px padding, 12px medium text, 260px max width.', selector: '[role="tooltip"]' },
      { name: 'Arrow', description: '8px pointer, same fill as the bubble. Bubble sits 6px (+2 with arrow) from the trigger.', selector: '[data-part="arrow"]' },
    ],
  },
  usage: {
    use: ['Naming icon-only buttons: New invoice, Copy link.', 'Showing the full value of truncated text.', 'Spelling out a keyboard shortcut next to the name.'],
    avoid: [
      { text: 'Links, buttons or any interactive content.', instead: { slug: 'popover', label: 'Popover' } },
      { text: 'Rich previews of a person or record.', instead: { slug: 'hover-card', label: 'HoverCard' } },
      { text: 'Essential instructions or error text. Touch users never see tooltips.', instead: { slug: 'field', label: 'Field helper text' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'text', key: 'content', label: 'Text', presets: ['New invoice', 'Copy link ⌘C', 'Archived invoices from the last 90 days'] },
      { kind: 'select', key: 'placement', label: 'Placement', options: ['top', 'bottom', 'left', 'right'] },
      { kind: 'toggle', key: 'showArrow', label: 'Arrow' },
      { kind: 'number', key: 'delay', label: 'Delay (ms)', min: 0, max: 1000, step: 100 },
    ],
    initial: { content: 'New invoice', placement: 'top', showArrow: true, delay: 300 },
    render: (p, ev) => (
      <div onMouseEnter={() => ev('onOpenChange(true)')} onMouseLeave={() => ev('onOpenChange(false)')}>
        <Tip text={String(p.content)} arrow={Boolean(p.showArrow)} />
      </div>
    ),
    code: (p) => `<Tooltip content="${p.content}"${p.placement !== 'top' ? ` placement="${p.placement}"` : ''}${p.showArrow ? '' : ' showArrow={false}'}${Number(p.delay) !== 300 ? ` delay={${p.delay}}` : ''}>\n  <IconButton aria-label="New invoice"><Plus /></IconButton>\n</Tooltip>`,
  },
  states: [
    { name: 'Default', description: 'Short label with arrow.', Render: () => <Tip /> },
    { name: 'With shortcut', description: 'Name plus shortcut, still one line.', Render: () => <Tip text="Copy link ⌘C" /> },
    { name: 'No arrow', description: 'showArrow off for dense toolbars.', Render: () => <Tip arrow={false} /> },
    { name: 'Long content', description: 'Wraps at 260px. If it needs more, use a HoverCard.', Render: () => <Tip text="Archived invoices stay searchable for 90 days, then are removed permanently." width={260} /> },
  ],
  sections: [
    { type: 'text', id: 'choosing-an-overlay', title: 'Choosing an overlay', body: <>Tooltips are the lightest overlay: text only, hover or focus, never blocking. See the <a href="#/components/dialog">comparison on Dialog</a> for when something heavier is right.</> },
    {
      type: 'rules', id: 'timing', title: 'Timing',
      items: [
        { title: '300ms open delay', body: 'Prevents flicker while the pointer crosses a toolbar. Tune with delay.' },
        { title: '100ms close delay', body: 'Lets the pointer move onto the bubble without it vanishing.' },
        { title: 'Warm window', body: 'Within 300ms of another tooltip closing, the next one appears instantly with no animation.' },
      ],
    },
  ],
  content: { rules: [{ title: 'Sentence case, no period', body: 'New invoice, not New Invoice.' }, { title: 'Under 6 words', body: 'Anything longer belongs in a HoverCard or helper text.' }, { title: 'Name the action', body: 'Verb or noun matching the button, not a description of the icon.' }] },
  accessibility: {
    keyboard: [
      { keys: ['Tab'], action: 'Focusing the trigger shows the tooltip after the delay.' },
      { keys: ['Esc'], action: 'Hides the tooltip.' },
    ],
    notes: ['role="tooltip" is linked to the trigger with aria-describedby.', 'Icon-only triggers still need an aria-label; the tooltip is the sighted equivalent.', 'Hover and focus both open it. Touch devices do not, so never hide required information here.'],
    reducedMotion: 'The 0.96 scale and fade are removed; the tooltip just appears.',
  },
  props: [
    { name: 'content', type: 'ReactNode', description: 'Required. Tooltip text.' },
    { name: 'children', type: 'ReactNode', description: 'Required. A focusable trigger.' },
    { name: 'placement', type: 'Placement', default: "'top'", description: 'Side relative to the trigger.' },
    { name: 'showArrow', type: 'boolean', default: 'true', description: '8px pointer.' },
    { name: 'delay', type: 'number', default: '300', description: 'ms before opening.' },
    { name: 'closeDelay', type: 'number', default: '100', description: 'ms before closing.' },
    { name: 'offset', type: 'number', default: '6', description: 'Gap from the trigger (+2 with arrow).' },
    { name: 'trigger', type: "'focus'", description: 'Open on focus only, not hover.' },
    { name: 'isDisabled', type: 'boolean', description: 'Never opens.' },
    { name: 'className / xstyle', type: 'string / StyleXStyles', description: 'Bubble overrides.' },
  ],
  related: ['icon-button', 'hover-card', 'popover', 'kbd'],
};
export default page;
