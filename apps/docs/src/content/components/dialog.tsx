import { Button, Dialog, DialogBody, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from 'oniva-ui';
import type { DocPage } from '../types';

// The real Dialog is a modal portal. The stages render the same Dialog, header, body and footer
// pieces inline (no Modal wrapper, no backdrop), so every measurement here is the library's own.
const Panel = ({ title = 'Invite a teammate', body = 'Teammates can view and comment on the Q4 Revenue workspace.', width = 400, close = true, confirm = 'Send invite', disabled = false }: { title?: string; body?: string; width?: number; close?: boolean; confirm?: string; disabled?: boolean }) => (
  <div style={{ background: 'var(--oniva-color-surface)', border: '1px solid var(--oniva-color-border)', borderRadius: 16, boxShadow: 'var(--oniva-shadow-xl)', overflow: 'hidden', width }}>
    <Dialog showCloseButton={close} aria-label={title}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{body}</DialogDescription>
      </DialogHeader>
      <DialogBody>
        <div style={{ border: '1px solid var(--oniva-color-border)', borderRadius: 10, color: 'var(--oniva-color-text-muted)', fontSize: 14, padding: '9px 12px' }}>maya@northwind.co</div>
      </DialogBody>
      <DialogFooter>
        <Button variant="secondary">Cancel</Button>
        <Button isDisabled={disabled}>{confirm}</Button>
      </DialogFooter>
    </Dialog>
  </div>
);

const Row = ({ name, use, when }: { name: string; use: string; when: string }) => (
  <tr>
    <th scope="row" style={{ padding: '10px 12px', textAlign: 'start', whiteSpace: 'nowrap' }}>{name}</th>
    <td style={{ padding: '10px 12px' }}>{use}</td>
    <td style={{ padding: '10px 12px' }}>{when}</td>
  </tr>
);

const Choosing = () => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ borderCollapse: 'collapse', fontSize: 14, width: '100%' }}>
      <caption style={{ color: 'var(--oniva-color-text-muted)', paddingBottom: 8, textAlign: 'start' }}>Pick by how much attention the content deserves, then by how long it stays.</caption>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--oniva-color-border)' }}>
          <th scope="col" style={{ padding: '8px 12px', textAlign: 'start' }}>Overlay</th>
          <th scope="col" style={{ padding: '8px 12px', textAlign: 'start' }}>Blocks the page</th>
          <th scope="col" style={{ padding: '8px 12px', textAlign: 'start' }}>Use it when</th>
        </tr>
      </thead>
      <tbody>
        <Row name="Dialog" use="Yes, centered, focus trapped" when="A short task or decision that needs a full answer: invite, rename, confirm settings." />
        <Row name="AlertDialog" use="Yes, cannot be dismissed outside" when="A destructive or irreversible choice with one clear confirm." />
        <Row name="Drawer" use="Yes, side panel" when="Editing or inspecting a record while the list stays visible behind it." />
        <Row name="BottomSheet" use="Yes on mobile, draggable" when="Touch-first actions and pickers. Below 640px, Dialog already becomes a sheet." />
        <Row name="Popover" use="No, anchored, click to open" when="Small interactive content tied to one control: filters, date picker, share link." />
        <Row name="HoverCard" use="No, anchored, hover or focus" when="A read-only preview of a link target: profile, invoice summary." />
        <Row name="Tooltip" use="No, anchored, hover or focus" when="A one-line label for an icon or a truncated value. Never interactive." />
      </tbody>
    </table>
  </div>
);

const page: DocPage = {
  slug: 'dialog',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Dialog',
  group: ['Components', 'Overlays'],
  sourcePath: 'components/Dialog',
  lede: 'A centered modal that asks for one task or decision. It traps focus, dims the page, and turns into a bottom sheet below 640px.',
  anatomy: {
    intro: 'Six parts. The panel, title and footer are always present; the description and close button are optional. The stage renders the dialog inline without a backdrop because the real one lives in a portal.',
    Render: () => <Panel />,
    parts: [
      { name: 'Panel', description: '400px (sm), 480px (md, default) or 640px (lg) wide, 16px radius, 1px border, xl shadow. Full width and square bottom corners below 640px.', selector: '[role="dialog"]' },
      { name: 'Title', description: 'Level 2 heading, 18px semibold. Names the dialog for screen readers.', selector: '[role="dialog"] h2' },
      { name: 'Description', description: '14px regular in muted text. Header padding is 20px block, 24px inline, 56px at the end to clear the close button.', selector: '[role="dialog"] p' },
      { name: 'Body', description: '14px text, 24px inline padding, scrolls on its own when the panel hits the viewport height.', selector: '[role="dialog"] > div:nth-of-type(2)' },
      { name: 'Footer', description: 'Inset surface, top border, 12px block and 24px inline padding, 8px gap. Actions align to the end; the primary action is last.', selector: '[role="dialog"] > div:nth-of-type(3)' },
      { name: 'Close button', description: '28px square, 8px radius, 16px X icon. Closes through the close slot. Turn off with showCloseButton={false} when the footer already closes.', selector: '[role="dialog"] button[aria-label="Close"]' },
    ],
  },
  usage: {
    use: ['A short task that needs the user to finish before going on: invite, rename, create.', 'A decision with consequences that deserves explanation text.', 'Collecting two to five fields without leaving the page.'],
    avoid: [
      { text: 'Confirming a delete or other irreversible action.', instead: { slug: 'alert-dialog', label: 'AlertDialog' } },
      { text: 'Editing a record while keeping the list visible.', instead: { slug: 'drawer', label: 'Drawer' } },
      { text: 'Small controls anchored to a button, like a filter.', instead: { slug: 'popover', label: 'Popover' } },
      { text: 'A label or hint for an icon.', instead: { slug: 'tooltip', label: 'Tooltip' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'size', label: 'Size', options: ['sm', 'md', 'lg'] },
      { kind: 'text', key: 'title', label: 'Title', presets: ['Invite a teammate', 'Rename workspace'] },
      { kind: 'toggle', key: 'closeButton', label: 'Close button' },
      { kind: 'toggle', key: 'dismissable', label: 'Dismiss on outside click' },
    ],
    initial: { size: 'md', title: 'Invite a teammate', closeButton: true, dismissable: true },
    render: (p, ev) => (
      <div onClick={() => ev('onOpenChange(true)')}>
        <Panel title={String(p.title)} width={p.size === 'sm' ? 400 : p.size === 'lg' ? 640 : 480} close={Boolean(p.closeButton)} />
      </div>
    ),
    code: (p) =>
      `<DialogTrigger>\n  <Button>Invite teammate</Button>\n  <Modal${p.size !== 'md' ? ` size="${p.size}"` : ''}${p.dismissable ? '' : ' isDismissable={false}'}>\n    <Dialog${p.closeButton ? '' : ' showCloseButton={false}'}>\n      <DialogHeader>\n        <DialogTitle>${p.title}</DialogTitle>\n      </DialogHeader>\n      <DialogBody>…</DialogBody>\n      <DialogFooter>…</DialogFooter>\n    </Dialog>\n  </Modal>\n</DialogTrigger>`,
  },
  states: [
    { name: 'Default', description: 'Title, description, one field, two actions.', Render: () => <div style={{ transform: 'scale(.8)', transformOrigin: 'center' }}><Panel /></div> },
    { name: 'No close button', description: 'showCloseButton off. The footer is the only way out besides Esc.', Render: () => <div style={{ transform: 'scale(.8)', transformOrigin: 'center' }}><Panel close={false} /></div> },
    { name: 'Disabled confirm', description: 'The primary action stays disabled until the field is valid.', Render: () => <div style={{ transform: 'scale(.8)', transformOrigin: 'center' }}><Panel disabled /></div> },
    { name: 'Long title', description: 'Titles wrap inside the 56px end padding and never run under the X.', Render: () => <div style={{ transform: 'scale(.8)', transformOrigin: 'center' }}><Panel title="Invite a teammate to the Q4 Revenue forecasting workspace" /></div> },
    { name: 'Mobile', description: 'Below 640px the panel is full width, squares its bottom corners and slides up as a sheet.', Render: () => <div style={{ transform: 'scale(.8)', transformOrigin: 'center' }}><Panel width={320} /></div> },
  ],
  sections: [
    { type: 'custom', id: 'choosing-an-overlay', title: 'Choosing an overlay', Render: Choosing },
    {
      type: 'numbered',
      id: 'dialog-rules',
      title: 'Rules for a good dialog',
      items: [
        { title: 'One job', body: 'If the dialog needs tabs or steps, it wants a page or a Drawer.' },
        { title: 'Primary action last', body: 'Cancel on the left, the confirming action on the right. Name the action, never OK.' },
        { title: 'Never stack', body: 'Do not open a dialog from a dialog. Replace the content or use an AlertDialog only for destructive follow-ups.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Title is the task', body: 'Invite a teammate, Rename workspace. Sentence case, no trailing period.' },
      { title: 'Buttons repeat the verb', body: 'Send invite, Save name. Not Submit or Yes.' },
      { title: 'Description adds a consequence', body: 'Say what happens next in one sentence. Skip it if the title is enough.' },
      { title: 'Keep the title under 50 characters', body: 'Longer titles wrap and push the body down.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['Tab', 'Shift+Tab'], action: 'Cycles through focusable elements inside the dialog; focus never leaves.' },
      { keys: ['Esc'], action: 'Closes the dialog (unless isKeyboardDismissDisabled) and returns focus to the trigger.' },
      { keys: ['Enter', 'Space'], action: 'Activates the focused button, including Close.' },
    ],
    notes: [
      'Renders role="dialog" labelled by the title heading (slot="title"). Provide aria-label when there is no title.',
      'The rest of the page is made inert while open; the background does not scroll.',
      'Focus moves into the dialog on open and returns to the trigger on close.',
      'Close button is 28px; keep footer buttons at 36px or larger for touch.',
    ],
    reducedMotion: 'The scale and slide animations are replaced with a plain fade; exit takes 0.01ms.',
  },
  props: [
    { name: 'Modal.size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Panel width: 400, 480, 640px. Full width below 640px.' },
    { name: 'Modal.isDismissable', type: 'boolean', default: 'true', description: 'Clicking the backdrop closes the dialog.' },
    { name: 'Modal.isOpen / defaultOpen / onOpenChange', type: 'boolean / (open) => void', description: 'Controlled or initial state when not inside a DialogTrigger.' },
    { name: 'Modal.isKeyboardDismissDisabled', type: 'boolean', default: 'false', description: 'Disables Esc to close.' },
    { name: 'Modal.xstyle / overlayXstyle', type: 'StyleXStyles', description: 'Overrides for the panel and the backdrop.' },
    { name: 'Dialog.showCloseButton', type: 'boolean', default: 'true', description: 'Shows the top-right X.' },
    { name: 'Dialog.children', type: 'ReactNode | (opts: { close }) => ReactNode', description: 'Render prop receives close() for footer buttons.' },
    { name: 'Dialog.aria-label', type: 'string', description: 'Required when there is no DialogTitle.' },
    { name: 'DialogHeader / DialogBody / DialogFooter', type: 'div props + xstyle', description: 'Layout slots with the paddings above.' },
    { name: 'DialogTitle / DialogDescription', type: 'children + xstyle', description: 'Level 2 heading and muted paragraph.' },
    { name: 'DialogCloseButton', type: "{ 'aria-label'?: string }", default: "'Close'", description: 'Standalone X if you hide the default one.' },
  ],
  related: ['alert-dialog', 'drawer', 'bottom-sheet', 'popover', 'tooltip'],
};
export default page;
