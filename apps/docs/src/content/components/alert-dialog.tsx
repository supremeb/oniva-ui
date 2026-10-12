import { AlertTriangle, Info } from 'lucide-react';
import { Button, DialogDescription, DialogTitle } from 'oniva-ui';
import { Dialog as AriaDialog } from 'react-aria-components';
import type { DocPage } from '../types';

// The real AlertDialog mounts in a Modal portal. The stage renders the same markup inline:
// role="alertdialog", the 40px badge, DialogTitle/Description and the two Buttons, with no backdrop.
const Panel = ({ variant = 'danger', title = 'Delete invoice INV-1042?', body = 'This removes the invoice and its payment history. You cannot undo this.', confirm, cancel = 'Cancel' }: { variant?: 'default' | 'danger'; title?: string; body?: string; confirm?: string; cancel?: string }) => (
  <div style={{ background: 'var(--oniva-color-surface)', border: '1px solid var(--oniva-color-border)', borderRadius: 16, boxShadow: 'var(--oniva-shadow-xl)', width: 400 }}>
    <AriaDialog role="alertdialog" aria-label={title} style={{ display: 'flex', flexDirection: 'column', gap: 16, outline: 'none', padding: 24 }}>
      <div style={{ alignItems: 'flex-start', display: 'flex', gap: 14 }}>
        <span data-part="badge" aria-hidden="true" style={{ alignItems: 'center', background: variant === 'danger' ? 'var(--oniva-color-danger-bg)' : 'var(--oniva-color-info-bg)', borderRadius: 9999, color: variant === 'danger' ? 'var(--oniva-color-danger-fg)' : 'var(--oniva-color-info-fg)', display: 'inline-flex', flexShrink: 0, height: 40, justifyContent: 'center', width: 40 }}>
          {variant === 'danger' ? <AlertTriangle size={20} /> : <Info size={20} />}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, paddingTop: 2 }}>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{body}</DialogDescription>
        </div>
      </div>
      <div data-part="actions" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button variant="secondary">{cancel}</Button>
        <Button variant={variant === 'danger' ? 'danger' : 'primary'}>{confirm ?? (variant === 'danger' ? 'Delete' : 'Confirm')}</Button>
      </div>
    </AriaDialog>
  </div>
);
const Scaled = ({ children }: { children: React.ReactNode }) => <div style={{ transform: 'scale(.8)', transformOrigin: 'center' }}>{children}</div>;

const page: DocPage = {
  slug: 'alert-dialog',
  status: 'Stable',
  version: '0.1.0',
  importName: 'AlertDialog',
  group: ['Components', 'Overlays'],
  sourcePath: 'components/AlertDialog',
  lede: 'A confirmation that interrupts on purpose. It cannot be dismissed by clicking outside, and focus starts on Cancel so Enter never destroys anything.',
  anatomy: {
    intro: 'Five parts. All are always present except the description. Rendered inline here because the real one opens in a modal portal.',
    Render: () => <Panel />,
    parts: [
      { name: 'Panel', description: 'role="alertdialog", 400px wide (the sm Modal), 16px radius, 24px padding, 16px gap.', selector: '[role="alertdialog"]' },
      { name: 'Icon badge', description: '40px circle, 20px icon. Info colors by default, danger colors for variant="danger".', selector: '[data-part="badge"]' },
      { name: 'Title', description: 'Level 2 heading, 18px semibold. State the action and the object.', selector: '[role="alertdialog"] h2' },
      { name: 'Description', description: '14px muted. Says what is lost or changed.', selector: '[role="alertdialog"] p' },
      { name: 'Actions', description: 'Cancel (secondary, autofocus) then confirm (primary or danger), end-aligned, 8px gap.', selector: '[data-part="actions"]' },
    ],
  },
  usage: {
    use: ['Deleting, removing access or discarding unsaved work.', 'Any action that cannot be undone and needs an explicit yes.', 'Confirming a costly action, like sending an invoice to 200 customers.'],
    avoid: [
      { text: 'Collecting input or showing details.', instead: { slug: 'dialog', label: 'Dialog' } },
      { text: 'Actions that can be undone. Do it and offer Undo.', instead: { slug: 'toast', label: 'Toast' } },
      { text: 'Informational notices that need no decision.', instead: { slug: 'alert', label: 'Alert' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'variant', label: 'Variant', options: ['default', 'danger'] },
      { kind: 'text', key: 'title', label: 'Title', presets: ['Delete invoice INV-1042?', 'Discard unsaved changes?'] },
      { kind: 'text', key: 'confirm', label: 'Confirm label', presets: ['Delete invoice', 'Discard', 'Confirm'] },
    ],
    initial: { variant: 'danger', title: 'Delete invoice INV-1042?', confirm: 'Delete invoice' },
    render: (p, ev) => (
      <div onClick={() => ev('onConfirm()')}>
        <Panel variant={p.variant as 'default' | 'danger'} title={String(p.title)} confirm={String(p.confirm)} />
      </div>
    ),
    code: (p) => `<AlertDialogTrigger>\n  <Button variant="danger">Delete</Button>\n  <AlertDialog\n    title="${p.title}"${p.variant === 'danger' ? '\n    variant="danger"' : ''}\n    confirmLabel="${p.confirm}"\n    onConfirm={remove}\n  >\n    This removes the invoice and its payment history.\n  </AlertDialog>\n</AlertDialogTrigger>`,
  },
  states: [
    { name: 'Danger', description: 'Red badge and danger confirm for destructive actions.', Render: () => <Scaled><Panel /></Scaled> },
    { name: 'Default', description: 'Info badge and primary confirm for non-destructive confirmations.', Render: () => <Scaled><Panel variant="default" title="Send to 214 customers?" body="Each customer receives the March statement by email." confirm="Send statements" /></Scaled> },
    { name: 'Custom labels', description: 'Both labels rewritten to name the outcome.', Render: () => <Scaled><Panel title="Discard unsaved changes?" body="Your edits to Q4 forecast will be lost." confirm="Discard" cancel="Keep editing" /></Scaled> },
    { name: 'Long body', description: 'The text column wraps; the badge keeps its 40px size.', Render: () => <Scaled><Panel title="Remove Maya Chen from Northwind?" body="Maya loses access to 12 workspaces, 48 saved reports and every shared dashboard immediately. Her drafts are reassigned to you." confirm="Remove member" /></Scaled> },
  ],
  sections: [
    { type: 'text', id: 'choosing-an-overlay', title: 'Choosing an overlay', body: <>Alert dialogs are the strictest overlay: blocking, not dismissable outside, one decision. See the <a href="#/components/dialog">full comparison on Dialog</a>.</> },
    {
      type: 'numbered', id: 'confirm-rules', title: 'Writing the confirmation',
      items: [
        { title: 'Name the object', body: 'Delete invoice INV-1042? beats Are you sure?' },
        { title: 'Say what is lost', body: 'One sentence on consequences, including whether it can be undone.' },
        { title: 'Label the button with the verb', body: 'Delete invoice, not Yes or OK. Rename Cancel only to clarify, like Keep editing.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Title is a question', body: 'End with a question mark and include the object name.' },
      { title: 'Confirm repeats the title verb', body: 'Title says Delete, button says Delete invoice.' },
      { title: 'No exclamation marks', body: 'The stakes are already clear. Stay calm.' },
      { title: 'Keep the body to two sentences', body: 'Consequence first, then reversibility.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['Tab', 'Shift+Tab'], action: 'Moves between Cancel and the confirm button; focus stays trapped.' },
      { keys: ['Enter', 'Space'], action: 'Activates the focused button. Initial focus is Cancel.' },
      { keys: ['Esc'], action: 'Cancels and closes, returning focus to the trigger.' },
    ],
    notes: ['role="alertdialog" labelled by the title and described by the body, so screen readers read both on open.', 'Outside click does nothing (isDismissable is false); only Esc, Cancel or Confirm close it.', 'Both buttons use slot="close", so they close the dialog after running the handler.'],
    reducedMotion: 'The scale-in becomes a fade, same as Dialog. Below 640px it still presents as a bottom sheet.',
  },
  props: [
    { name: 'title', type: 'ReactNode', description: 'Required. Heading text.' },
    { name: 'children', type: 'ReactNode', description: 'Description under the title.' },
    { name: 'variant', type: "'default' | 'danger'", default: "'default'", description: 'Danger swaps the icon, badge colors and confirm button.' },
    { name: 'confirmLabel', type: 'string', default: "'Confirm' | 'Delete' (danger)", description: 'Confirm button text.' },
    { name: 'cancelLabel', type: 'string', default: "'Cancel'", description: 'Cancel button text.' },
    { name: 'onConfirm / onCancel', type: '() => void', description: 'Handlers; the dialog closes after each.' },
    { name: 'icon', type: 'ReactNode', description: 'Replaces the AlertTriangle / Info icon.' },
    { name: 'isOpen / onOpenChange', type: 'boolean / (open) => void', description: 'Controlled open state. Otherwise wrap in AlertDialogTrigger.' },
    { name: 'className / xstyle', type: 'string / StyleXStyles', description: 'Style overrides for the dialog.' },
  ],
  related: ['dialog', 'toast', 'alert', 'button'],
};
export default page;
