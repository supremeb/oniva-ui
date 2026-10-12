import { Avatar, Button } from 'oniva-ui';
import type { DocPage } from '../types';

// The real HoverCardContent mounts only while the trigger is hovered. The stage draws the same card
// (280px, 12px radius, 16px padding, dropdown shadow) under a real link-style trigger.
const Card = ({ name = 'Maya Chen', role = 'Finance lead, Northwind', body = 'Owns 12 workspaces. Last active 2 hours ago.', action = true }: { name?: string; role?: string; body?: string; action?: boolean }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <a href="#/components/hover-card" data-part="trigger" style={{ color: 'var(--oniva-color-accent-text)', fontSize: 14, fontWeight: 500 }}>@maya</a>
    <div role="dialog" aria-label={name} style={{ background: 'var(--oniva-color-surface)', border: '1px solid var(--oniva-color-border)', borderRadius: 12, boxShadow: 'var(--oniva-shadow-dropdown)', fontSize: 14, lineHeight: '20px', padding: 16, width: 280 }}>
      <div style={{ alignItems: 'center', display: 'flex', gap: 12 }}>
        <Avatar name={name} />
        <div><div data-part="title" style={{ fontWeight: 600 }}>{name}</div><div style={{ color: 'var(--oniva-color-text-muted)' }}>{role}</div></div>
      </div>
      <p data-part="body" style={{ color: 'var(--oniva-color-text-muted)', margin: '12px 0 0' }}>{body}</p>
      {action && <div data-part="action" style={{ marginTop: 12 }}><Button size="sm" variant="secondary">View profile</Button></div>}
    </div>
  </div>
);

const page: DocPage = {
  slug: 'hover-card',
  status: 'Stable',
  version: '0.1.0',
  importName: 'HoverCard',
  group: ['Components', 'Overlays'],
  sourcePath: 'components/HoverCard',
  lede: 'A richer preview that opens when a link is hovered, focused or long-pressed. It can hold links and buttons, unlike a tooltip.',
  anatomy: {
    intro: 'Four parts. The trigger and card are required; the body and action row depend on the record.',
    Render: () => <Card />,
    parts: [
      { name: 'Trigger', description: 'A focusable Link or Button. Opens after 500ms, closes after 150ms.', selector: '[data-part="trigger"]' },
      { name: 'Card', description: '280px wide, 12px radius, 1px border, dropdown shadow, 16px padding, bottom start, 8px offset.', selector: '[role="dialog"]' },
      { name: 'Summary', description: 'Avatar plus 14px semibold name and muted role. The reason the card exists.', selector: '[data-part="title"]' },
      { name: 'Actions', description: 'Optional small buttons. Keep to one; a second action belongs on the page behind.', selector: '[data-part="action"]' },
    ],
  },
  usage: {
    use: ['Previewing a person, invoice or workspace behind a link.', 'Showing three to five facts so users can skip a click.', 'Content that also exists on the page the link opens.'],
    avoid: [
      { text: 'A one-line label.', instead: { slug: 'tooltip', label: 'Tooltip' } },
      { text: 'Content users must be able to reach on touch only. Hover cards are an enhancement.', instead: { slug: 'popover', label: 'Popover' } },
      { text: 'Forms or multi-step interaction.', instead: { slug: 'dialog', label: 'Dialog' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'text', key: 'name', label: 'Name', presets: ['Maya Chen', 'Invoice INV-1042'] },
      { kind: 'toggle', key: 'action', label: 'Action button' },
      { kind: 'number', key: 'delay', label: 'Delay (ms)', min: 0, max: 1500, step: 100 },
    ],
    initial: { name: 'Maya Chen', action: true, delay: 500 },
    render: (p, ev) => (
      <div onMouseEnter={() => ev('onOpenChange(true)')} onMouseLeave={() => ev('onOpenChange(false)')}>
        <Card name={String(p.name)} action={Boolean(p.action)} />
      </div>
    ),
    code: (p) => `<HoverCard${Number(p.delay) !== 500 ? ` delay={${p.delay}}` : ''}>\n  <Link href="/people/maya">@maya</Link>\n  <HoverCardContent>\n    <strong>${p.name}</strong>\n    …\n  </HoverCardContent>\n</HoverCard>`,
  },
  states: [
    { name: 'Person', description: 'Avatar, role, one fact, one action.', Render: () => <Card /> },
    { name: 'No action', description: 'Pure preview; the whole trigger link is the action.', Render: () => <Card action={false} /> },
    { name: 'Long content', description: 'Text wraps inside the fixed 280px width.', Render: () => <Card name="Alexandra Papadopoulos-Whitfield" role="Head of Treasury Operations, Northwind Europe" body="Owns 48 workspaces across 6 regions. Last active 2 hours ago on the Q4 forecast." /> },
    { name: 'Compact', description: 'Short record with no body text.', Render: () => <Card body="" action={false} /> },
  ],
  sections: [
    { type: 'text', id: 'choosing-an-overlay', title: 'Choosing an overlay', body: <>Hover cards are read-mostly previews. See the <a href="#/components/dialog">comparison on Dialog</a> for the difference from tooltips, popovers and dialogs.</> },
    {
      type: 'rules', id: 'hovercard-rules', title: 'Rules',
      items: [
        { title: 'Never the only path', body: 'Touch users get it on long-press only. The link target must contain the same information.' },
        { title: 'Keep it scannable', body: 'Name, one line of context, up to three facts.' },
        { title: 'One action at most', body: 'A card full of buttons is a Popover.' },
      ],
    },
  ],
  content: { rules: [{ title: 'Lead with the name', body: 'Same text as the link label.' }, { title: 'Facts, not prose', body: 'Last active 2 hours ago. Not a sentence about the person.' }, { title: 'Action is a verb', body: 'View profile, Open invoice.' }] },
  accessibility: {
    keyboard: [
      { keys: ['Tab'], action: 'Focusing the trigger opens the card after the delay.' },
      { keys: ['Esc'], action: 'Closes the card and keeps focus on the trigger.' },
      { keys: ['Tab'], action: 'From the trigger, moves into the card when it contains focusable items.' },
    ],
    notes: ['Hover, focus and long-press all open the card.', 'Content is in a popover; keep it supplementary because screen reader support for hover previews varies.', 'Pointer can move from trigger to card without closing during the 150ms grace window.'],
    reducedMotion: 'The scale-in is removed; the card appears without animation.',
  },
  props: [
    { name: 'HoverCard.children', type: 'ReactNode', description: 'A focusable trigger followed by HoverCardContent.' },
    { name: 'HoverCard.delay', type: 'number', default: '500', description: 'ms before opening.' },
    { name: 'HoverCard.closeDelay', type: 'number', default: '150', description: 'ms before closing.' },
    { name: 'HoverCard.isDisabled / isOpen / onOpenChange', type: 'boolean / (open) => void', description: 'Disable or control state.' },
    { name: 'HoverCardContent.placement', type: 'Placement', default: "'bottom start'", description: 'Side and alignment.' },
    { name: 'HoverCardContent.offset', type: 'number', default: '8', description: 'Gap from the trigger.' },
    { name: 'HoverCardContent.className / xstyle', type: 'string / StyleXStyles', description: 'Card overrides.' },
  ],
  related: ['tooltip', 'popover', 'avatar', 'link'],
};
export default page;
