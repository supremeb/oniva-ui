import { Bell } from 'lucide-react';
import { Button, VisuallyHidden } from 'oniva-ui';
import type { DocPage } from '../types';

const Sample = () => (
  <Button variant="secondary" isIconOnly>
    <Bell size={16} />
    <VisuallyHidden>3 unread notifications</VisuallyHidden>
  </Button>
);

const page: DocPage = {
  slug: 'visually-hidden',
  status: 'Stable',
  version: '0.1.0',
  importName: 'VisuallyHidden',
  group: ['Components', 'Utilities'],
  sourcePath: 'components/VisuallyHidden',
  lede: 'Hides content from the screen while keeping it readable by assistive tech. It handles icon-only buttons, extra context for repeated links and live announcements.',
  anatomy: {
    intro: 'Two parts. The visible host is yours. The hidden span is the component and renders nothing you can see.',
    Render: Sample,
    parts: [
      { name: 'Host', description: 'The control that needs a name. Here an icon-only Button, 36px square.', selector: 'button' },
      { name: 'Visible glyph', description: 'The icon that sighted users see. Mark it aria-hidden or let Icon do it.', selector: 'button svg' },
      { name: 'Hidden text', description: 'A span clipped to a 1px box, absolutely positioned, overflow hidden, no margin. It is not display: none, so it stays in the accessibility tree.', selector: 'button > span', fallback: { x: 50, y: 50 } },
    ],
  },
  usage: {
    use: ['Naming icon-only controls when aria-label is not available.', 'Adding context to repeated links: "Read more" plus the article name.', 'Announcements inside aria-live regions.'],
    avoid: [
      { text: 'Hiding content from everyone. Use conditional rendering.', instead: { slug: 'presence', label: 'Presence' } },
      { text: 'Naming an IconButton. It already requires aria-label.', instead: { slug: 'icon-button', label: 'IconButton' } },
      { text: 'Critical instructions only screen reader users hear. Show them to all.', instead: { slug: 'field', label: 'Field' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'text', key: 'text', label: 'Hidden text', presets: ['3 unread notifications', 'Opens in a new tab', 'Required'] },
      { kind: 'toggle', key: 'visible', label: 'Reveal (debug)' },
    ],
    initial: { text: '3 unread notifications', visible: false },
    render: (p) => (
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Button variant="secondary" isIconOnly>
          <Bell size={16} />
          <VisuallyHidden>{String(p.text)}</VisuallyHidden>
        </Button>
        {p.visible ? <span style={{ fontSize: 13 }}>Screen reader hears: “{String(p.text)}”</span> : null}
      </div>
    ),
    code: (p) => `<Button variant="secondary" isIconOnly>\n  <Bell size={16} />\n  <VisuallyHidden>${p.text}</VisuallyHidden>\n</Button>`,
  },
  states: [
    { name: 'Icon-only button', description: 'The button has no visible text but reads "3 unread notifications, button".', Render: Sample },
    { name: 'Repeated link context', description: 'The visible text is short; the hidden text makes each link unique.', Render: () => <span>Read more<VisuallyHidden> about payout schedules</VisuallyHidden></span> },
    { name: 'External link hint', description: 'Announces that the link leaves the page.', Render: () => <a href="#/components/visually-hidden">Stripe dashboard<VisuallyHidden> (opens in a new tab)</VisuallyHidden></a> },
    { name: 'As a div', description: 'elementType changes the element. Default is span.', Render: () => <div role="status"><VisuallyHidden elementType="div">Invoice saved</VisuallyHidden><span>Saved</span></div> },
  ],
  sections: [
    {
      type: 'rules', id: 'rules', title: 'Rules',
      items: [
        { title: 'Prefer visible text', body: 'Everyone benefits from a visible label. Use VisuallyHidden only where space forbids it.' },
        { title: 'aria-label first', body: 'On a single control aria-label is shorter. Use VisuallyHidden when the text must be translated as content or be part of a sentence.' },
        { title: 'Never hide focusable content', body: 'A focusable child inside would be focused with no visible ring. VisuallyHidden is for text only.' },
      ],
    },
    {
      type: 'dodont', id: 'do-and-dont', title: 'Do and don’t',
      items: [
        { kind: 'do', caption: 'Describe what the control does.', example: Sample },
        { kind: 'dont', caption: 'Repeating what the visible label already says.', example: () => <Button variant="secondary">Save<VisuallyHidden> button</VisuallyHidden></Button> },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Short and specific', body: '"3 unread notifications", not "Notifications icon".' },
      { title: 'No role words', body: 'Never add "button", "link" or "image". Roles are announced.' },
      { title: 'Lead with the key word', body: 'Screen reader users skim. Put the topic first.' },
    ],
  },
  accessibility: {
    keyboard: [{ keys: ['None'], action: 'Not interactive. It is never a tab stop.' }],
    notes: [
      'Built on React Aria VisuallyHidden. The span is clipped, not removed, so it stays in the accessibility tree and is included in the accessible name of its parent.',
      'It is skipped by display: none and visibility: hidden. Do not combine them.',
      'Text is selectable by keyboard users with virtual cursors and found by in-page search in some browsers. Keep it short.',
    ],
    reducedMotion: 'No motion.',
  },
  props: [
    { name: 'children', type: 'ReactNode', description: 'Content to hide visually.' },
    { name: 'elementType', type: 'string | JSXElementConstructor', default: "'span'", description: 'Rendered element.' },
    { name: 'isFocusable', type: 'boolean', default: 'false', description: 'Reveal the content when focus lands inside, for skip links.' },
  ],
  related: ['icon-button', 'icon', 'link', 'field'],
};
export default page;
