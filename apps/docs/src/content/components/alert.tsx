import { Alert, Button } from 'oniva-ui';
import type { DocPage } from '../types';

type V = 'info' | 'success' | 'warning' | 'danger';
const Demo = (p: { variant?: V; appearance?: 'callout' | 'banner'; title?: string; description?: string; actions?: boolean; dismiss?: boolean; onEvent?: (n: string) => void }) => (
  <div style={{ width: 460 }}>
    <Alert
      variant={p.variant}
      appearance={p.appearance}
      title={p.title ?? 'Payment failed'}
      description={p.description ?? 'Your card ending 4242 was declined. Update it to keep your Scale plan.'}
      actions={p.actions ? <><Button size="sm">Update card</Button><Button size="sm" variant="ghost">Dismiss</Button></> : undefined}
      onDismiss={p.dismiss ? () => p.onEvent?.('onDismiss') : undefined}
    />
  </div>
);

const page: DocPage = {
  slug: 'alert',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Alert',
  group: ['Components', 'Feedback'],
  sourcePath: 'components/Alert',
  lede: 'An inline message about the page or a section: what happened and what to do. Four tones, callout or banner, with actions and dismiss.',
  anatomy: {
    intro: 'Six parts. The container and icon are always present; title, description, actions and dismiss are optional but a title or description is required.',
    Render: () => <Demo variant="danger" actions dismiss />,
    parts: [
      { name: 'Container', description: 'Callout: inset surface, 10px radius, 1px border, no shadow, 12px padding and gap. Banner: solid tinted fill, no border or shadow. role="alert" for warning and danger, role="status" otherwise.', selector: '[role="alert"], [role="status"]' },
      { name: 'Icon', description: 'Status glyph in a 24px circle with a halo (callout, 14px glyph) or bare (banner, 18px). Pass icon={null} to hide.', selector: 'span[aria-hidden="true"]' },
      { name: 'Title', description: '14px semibold. Say what happened in under 8 words.', selector: '[role="alert"] > div > div:first-child, [role="status"] > div > div:first-child' },
      { name: 'Description', description: '13px muted (inherits color in banners). Say why and what to do next.', selector: '[role="alert"] > div > div:nth-child(2), [role="status"] > div > div:nth-child(2)' },
      { name: 'Actions', description: 'Buttons under the text with 8px gap. Use sm buttons; one primary at most.', selector: '[role="alert"] > div > div:last-child > button:first-child, [role="alert"] > div > div:last-child button:first-of-type', fallback: { x: 15, y: 80 } },
      { name: 'Dismiss', description: 'Close button labelled "Dismiss", shown only with onDismiss.', selector: 'button[aria-label="Dismiss"]', fallback: { x: 96, y: 15 } },
    ],
  },
  usage: {
    use: ['Page or section level status: failed payment, expiring trial.', 'Form-level errors that summarize what to fix.', 'Persistent notices that stay until resolved or dismissed.'],
    avoid: [
      { text: 'Confirmation of an action that disappears on its own.', instead: { slug: 'toast', label: 'Toast' } },
      { text: 'A decision that blocks progress.', instead: { slug: 'dialog', label: 'Dialog' } },
      { text: 'A short status label on a row.', instead: { slug: 'badge', label: 'Badge' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'variant', label: 'Variant', options: ['info', 'success', 'warning', 'danger'] },
      { kind: 'segmented', key: 'appearance', label: 'Appearance', options: ['callout', 'banner'] },
      { kind: 'text', key: 'title', label: 'Title', presets: ['Payment failed', 'Trial ends in 3 days', 'Changes saved'] },
      { kind: 'toggle', key: 'actions', label: 'Actions' },
      { kind: 'toggle', key: 'dismiss', label: 'Dismissible' },
    ],
    initial: { variant: 'danger', appearance: 'callout', title: 'Payment failed', actions: true, dismiss: false },
    render: (p, onEvent) => <Demo variant={p.variant as V} appearance={p.appearance as 'callout' | 'banner'} title={String(p.title)} actions={Boolean(p.actions)} dismiss={Boolean(p.dismiss)} onEvent={onEvent} />,
    code: (p) => `<Alert${p.variant !== 'info' ? ` variant="${p.variant}"` : ''}${p.appearance === 'banner' ? ' appearance="banner"' : ''}\n  title="${p.title}"\n  description="Your card ending 4242 was declined."${p.actions ? '\n  actions={<Button size="sm">Update card</Button>}' : ''}${p.dismiss ? '\n  onDismiss={() => setOpen(false)}' : ''}\n/>`,
  },
  states: [
    { name: 'Info', description: 'Neutral news. role="status".', Render: () => <Demo variant="info" title="Scheduled maintenance" description="Sunday 02:00 to 03:00 UTC. Exports may be delayed." /> },
    { name: 'Success', description: 'Completed. role="status".', Render: () => <Demo variant="success" title="Invoice sent" description="Northwind Traders received INV-2041." /> },
    { name: 'Warning', description: 'Needs attention soon. role="alert".', Render: () => <Demo variant="warning" title="Trial ends in 3 days" description="Add a payment method to keep your projects." /> },
    { name: 'Danger with actions', description: 'Blocking problem with a fix.', Render: () => <Demo variant="danger" actions dismiss /> },
    { name: 'Banner', description: 'Solid tinted fill for page-wide notices.', Render: () => <Demo variant="warning" appearance="banner" title="Read-only mode" description="Editing is paused while we migrate your workspace." /> },
  ],
  sections: [
    { type: 'rules', id: 'rules', title: 'Rules', items: [
      { title: 'Match tone to consequence', body: 'Danger for things that failed or will fail, warning for things that will soon, info and success for the rest.' },
      { title: 'Place near the cause', body: 'Form errors at the top of the form; billing issues at the top of the page; field issues next to the field.' },
      { title: 'One at a time', body: 'Stack at most two. Merge messages that share a cause.' },
      { title: 'Always give the way out', body: 'Every warning and danger alert has an action or a clear instruction.' },
    ] },
    { type: 'dodont', id: 'dodont', title: 'Do and don\'t', items: [
      { kind: 'do', caption: 'Say what happened and what to do.', example: () => <Demo variant="danger" title="Payment failed" description="Your card was declined. Update it to keep your plan." /> },
      { kind: 'dont', caption: 'Vague, no next step.', example: () => <Demo variant="danger" title="Error" description="Something went wrong." /> },
    ] },
  ],
  content: { rules: [
    { title: 'Title', body: 'Sentence case, no period, under 8 words: the fact, not the feeling.' },
    { title: 'Description', body: 'One or two sentences. Cause, then action. No "Please" and no apologies.' },
    { title: 'Action labels', body: 'Verb first and specific: Update card, not Fix.' },
    { title: 'Dismiss', body: 'Only for notices that do not require action.' },
  ] },
  accessibility: {
    keyboard: [
      { keys: ['Tab'], action: 'Reaches action buttons and Dismiss in reading order.' },
      { keys: ['Enter', 'Space'], action: 'Activates the focused button.' },
    ],
    notes: ['Warning and danger use role="alert" (assertive); info and success use role="status" (polite). Alerts rendered with the page are not announced; only ones inserted later are.', 'The icon is aria-hidden; the title states the severity in words where it matters.', 'Dismiss is labelled "Dismiss". Move focus to a sensible element after removal.'],
  },
  props: [
    { name: 'variant', type: "'info' | 'success' | 'warning' | 'danger'", default: "'info'", description: 'Tone and icon.' },
    { name: 'appearance', type: "'callout' | 'banner'", default: "'callout'", description: 'Inset card or solid fill.' },
    { name: 'title', type: 'ReactNode', description: 'Heading line.' },
    { name: 'description', type: 'ReactNode', description: 'Body text; children also work.' },
    { name: 'icon', type: 'ReactNode | null', description: 'Custom icon, or null to hide.' },
    { name: 'actions', type: 'ReactNode', description: 'Buttons under the text.' },
    { name: 'onDismiss', type: '() => void', description: 'Shows the Dismiss button.' },
    { name: 'role', type: 'string', default: 'by variant', description: 'Override the live-region role.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Style override.' },
  ],
  related: ['toast', 'dialog', 'badge', 'empty-state'],
};
export default page;
