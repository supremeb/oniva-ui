import { Collapsible } from 'oniva-ui';
import type { DocPage } from '../types';

const Demo = (p: { open?: boolean; disabled?: boolean; label?: string; onEvent?: (n: string) => void }) => (
  <div style={{ width: 320 }}>
    <Collapsible trigger={p.label ?? 'Advanced options'} defaultExpanded={p.open} isDisabled={p.disabled} onExpandedChange={() => p.onEvent?.('onExpandedChange')}>
      Retry failed webhooks up to 5 times with exponential backoff. Deliveries older than 72 hours are dropped.
    </Collapsible>
  </div>
);

const page: DocPage = {
  slug: 'collapsible',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Collapsible',
  group: ['Components', 'Data display'],
  sourcePath: 'components/Collapsible',
  lede: 'One compact show/hide region. Use it to tuck optional detail behind a single trigger without leaving the page.',
  anatomy: {
    intro: 'Four parts. The trigger and chevron are always present; the panel renders its content when open.',
    Render: () => <Demo open />,
    parts: [
      { name: 'Heading', description: 'The trigger sits in an h3 with zero margin, so the label joins the page outline. Choose surrounding headings to match.', selector: 'h3' },
      { name: 'Trigger', description: 'Inline button inside an h3. 32px tall, 8px side padding, 8px radius, 14px medium text. Hover uses the inset surface tint.', selector: 'h3 button' },
      { name: 'Chevron', description: '16px, muted, leading. Rotates 90 degrees when open.', selector: 'h3 button svg' },
      { name: 'Panel', description: '14px muted text on a 22px line, 8px inline start padding, 4px top padding. Height animates.', selector: '[role="group"] > div > div', fallback: { x: 50, y: 70 } },
    ],
  },
  usage: {
    use: ['Optional advanced settings under a form section.', 'Long secondary detail such as logs or raw payloads.', '"Show more" content that is not part of the main task.'],
    avoid: [
      { text: 'A list of related sections.', instead: { slug: 'accordion', label: 'Accordion' } },
      { text: 'A short explanation tied to a control.', instead: { slug: 'tooltip', label: 'Tooltip' } },
      { text: 'Switching between peer views.', instead: { slug: 'tabs', label: 'Tabs' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'text', key: 'label', label: 'Trigger', presets: ['Advanced options', 'Show raw payload', 'More filters'] },
      { kind: 'toggle', key: 'open', label: 'Expanded' },
      { kind: 'toggle', key: 'disabled', label: 'Disabled' },
    ],
    initial: { label: 'Advanced options', open: false, disabled: false },
    render: (p, onEvent) => <Demo key={String(p.open)} label={String(p.label)} open={Boolean(p.open)} disabled={Boolean(p.disabled)} onEvent={onEvent} />,
    code: (p) => `<Collapsible trigger="${p.label}"${p.open ? ' defaultExpanded' : ''}${p.disabled ? ' isDisabled' : ''}>\n  Retry failed webhooks up to 5 times.\n</Collapsible>`,
  },
  states: [
    { name: 'Closed', description: 'Chevron points right, panel hidden.', Render: () => <Demo /> },
    { name: 'Open', description: 'Chevron points down, panel visible.', Render: () => <Demo open /> },
    { name: 'Disabled', description: 'Muted trigger, not focusable.', Render: () => <Demo disabled /> },
    { name: 'Long label', description: 'Trigger grows with its text; keep it to one line.', Render: () => <Demo label="Show delivery attempts from the last 72 hours" /> },
  ],
  sections: [
    { type: 'rules', id: 'rules', title: 'Rules', items: [
      { title: 'Label the contents', body: 'Name what is hidden ("Advanced options"), not the action ("Click to expand").' },
      { title: 'Never hide required input', body: 'If the form cannot be submitted without it, show it.' },
      { title: 'Keep state local', body: 'Do not persist the open state across visits unless the user set it.' },
    ] },
    { type: 'rules', id: 'recipes', title: 'Composition', items: [
      { title: 'Inside a form', body: 'Place under the last required field. Fields in the panel keep their own labels.' },
      { title: 'Inside a card', body: 'Use for log or payload detail below a Description list.' },
    ] },
  ],
  content: { rules: [
    { title: 'Trigger', body: 'A noun phrase, 2 to 4 words. Do not toggle the text between "Show" and "Hide"; the chevron shows state.' },
    { title: 'Panel', body: 'Same voice as the surrounding page; no heading inside.' },
  ] },
  accessibility: {
    keyboard: [
      { keys: ['Tab'], action: 'Focuses the trigger.' },
      { keys: ['Enter', 'Space'], action: 'Toggles the panel.' },
    ],
    notes: ['The trigger is a button with aria-expanded inside an h3, so it appears in the heading outline. Pick a surrounding heading level that makes sense.', 'The panel is a group labelled by the trigger.', 'The chevron is aria-hidden.'],
    reducedMotion: 'Height animation and chevron rotation are removed.',
  },
  props: [
    { name: 'trigger', type: 'ReactNode', description: 'Trigger label.' },
    { name: 'isExpanded / defaultExpanded', type: 'boolean', default: 'false', description: 'Controlled or initial open state.' },
    { name: 'onExpandedChange', type: '(open: boolean) => void', description: 'Fires when toggled.' },
    { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disable the trigger.' },
    { name: 'children', type: 'ReactNode', description: 'Panel content.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Style override.' },
  ],
  related: ['accordion', 'tabs', 'tooltip'],
};
export default page;
