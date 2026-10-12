import { Button } from 'oniva-ui';
import type { DocPage } from '../types';

// The real Drawer is a fixed modal. The stage draws the same panel edge-attached inside a frame
// (right: 16px left radius; widths 320, 420, 560).
const Panel = ({ side = 'right', width = 220, close = true, title = 'Invoice INV-1042' }: { side?: 'left' | 'right'; width?: number; close?: boolean; title?: string }) => (
  <div data-part="backdrop" style={{ background: 'var(--oniva-color-overlay)', borderRadius: 12, display: 'flex', flexDirection: side === 'right' ? 'row-reverse' : 'row', height: 260, overflow: 'hidden', width: 360 }}>
    <aside role="dialog" aria-label={title} style={{ background: 'var(--oniva-color-surface)', border: '1px solid var(--oniva-color-border)', borderRadius: side === 'right' ? '16px 0 0 16px' : '0 16px 16px 0', boxShadow: 'var(--oniva-shadow-xl)', boxSizing: 'border-box', height: '100%', position: 'relative', width }}>
      {close && <button aria-label="Close" type="button" style={{ background: 'transparent', border: 0, borderRadius: 8, color: 'var(--oniva-color-text-muted)', height: 28, insetInlineEnd: 16, position: 'absolute', top: 16, width: 28 }}>×</button>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '20px 56px 12px 24px' }}>
        <h2 data-part="title" style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{title}</h2>
        <p style={{ color: 'var(--oniva-color-text-muted)', fontSize: 14, margin: 0 }}>Northwind Ltd, due 14 Nov</p>
      </div>
      <div data-part="body" style={{ fontSize: 14, padding: '0 24px' }}>Amount: $4,280.00</div>
      <div data-part="footer" style={{ borderTop: '1px solid var(--oniva-color-border)', bottom: 0, display: 'flex', gap: 8, justifyContent: 'flex-end', padding: '12px 24px', position: 'absolute', width: '100%', boxSizing: 'border-box' }}><Button variant="secondary" size="sm">Close</Button><Button size="sm">Send</Button></div>
    </aside>
  </div>
);
const S = ({ children }: { children: React.ReactNode }) => <div style={{ transform: 'scale(.8)', transformOrigin: 'center' }}>{children}</div>;

const page: DocPage = {
  slug: 'drawer',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Drawer',
  group: ['Components', 'Overlays'],
  sourcePath: 'components/Drawer',
  lede: 'An edge-attached panel for inspecting or editing a record while the page behind stays in view. Slides from the right, left or bottom and can be dragged away.',
  anatomy: {
    intro: 'Five parts. The panel and title are always present; the close button and footer are optional. Drawn inline in a frame because the real drawer is viewport-fixed.',
    Render: () => <Panel />,
    parts: [
      { name: 'Backdrop', description: 'Overlay color, 40% black. Click it or press Esc to close (isDismissable).', selector: '[data-part="backdrop"]' },
      { name: 'Panel', description: 'Right and left: 320 (sm), 420 (md, default) or 560px (lg), 16px radius on the free edge. Bottom: full width, 16px top radius.', selector: '[role="dialog"]' },
      { name: 'Title', description: '18px semibold heading. Header padding 20px, 56px at the end for the X.', selector: '[data-part="title"]' },
      { name: 'Close button', description: '28px square at 16px from the top and end. showCloseButton={false} hides it.', selector: 'button[aria-label="Close"]' },
      { name: 'Footer', description: 'Pinned actions with a top border; the body scrolls above it.', selector: '[data-part="footer"]' },
    ],
  },
  usage: {
    use: ['Viewing or editing a row from a table without losing your place.', 'Secondary flows with 4 to 10 fields.', 'Mobile-style bottom drawers with a scaled background.'],
    avoid: [
      { text: 'Short blocking decisions.', instead: { slug: 'dialog', label: 'Dialog' } },
      { text: 'Persistent navigation.', instead: { slug: 'sidebar', label: 'Sidebar' } },
      { text: 'Touch pickers with snap heights.', instead: { slug: 'bottom-sheet', label: 'BottomSheet' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'side', label: 'Side', options: ['right', 'left', 'bottom'] },
      { kind: 'segmented', key: 'size', label: 'Size', options: ['sm', 'md', 'lg'] },
      { kind: 'toggle', key: 'showCloseButton', label: 'Close button' },
      { kind: 'toggle', key: 'dismissable', label: 'Dismissable' },
    ],
    initial: { side: 'right', size: 'md', showCloseButton: true, dismissable: true },
    render: (p, ev) => <div onClick={() => ev('onOpenChange(false)')}><Panel side={p.side === 'left' ? 'left' : 'right'} width={p.size === 'sm' ? 160 : p.size === 'lg' ? 280 : 220} close={Boolean(p.showCloseButton)} /></div>,
    code: (p) => `<DrawerTrigger>\n  <Button>Open invoice</Button>\n  <Drawer${p.side !== 'right' ? ` side="${p.side}"` : ''}${p.size !== 'md' ? ` size="${p.size}"` : ''}${p.showCloseButton ? '' : ' showCloseButton={false}'}${p.dismissable ? '' : ' isDismissable={false}'}>\n    …\n  </Drawer>\n</DrawerTrigger>`,
  },
  states: [
    { name: 'Right', description: 'Default side. Rounds the left corners.', Render: () => <S><Panel /></S> },
    { name: 'Left', description: 'Rounds the right corners.', Render: () => <S><Panel side="left" /></S> },
    { name: 'Narrow', description: 'sm is 320px.', Render: () => <S><Panel width={160} /></S> },
    { name: 'No close button', description: 'Footer or drag is the way out.', Render: () => <S><Panel close={false} /></S> },
  ],
  sections: [
    { type: 'text', id: 'choosing-an-overlay', title: 'Choosing an overlay', body: <>Drawers keep context. For when a drawer beats a dialog, popover or sheet, see the <a href="#/components/dialog">comparison on Dialog</a>.</> },
    {
      type: 'rules', id: 'drawer-recipes', title: 'Composition recipes',
      items: [
        { title: 'Record detail', body: 'Header with title and status Badge, scrolling body, pinned footer with Save.' },
        { title: 'Bottom drawer with scale', body: 'Set scaleBackground on a bottom drawer to shrink the page like a native sheet.' },
        { title: 'Drag to dismiss', body: 'isDragDismissable lets users swipe toward the edge; velocity decides.' },
      ],
    },
  ],
  content: { rules: [{ title: 'Title is the record', body: 'Invoice INV-1042, not Details.' }, { title: 'Footer verbs', body: 'Save changes, Discard. Never OK.' }, { title: 'Unsaved changes', body: 'Confirm with an AlertDialog, not a second drawer.' }] },
  accessibility: {
    keyboard: [
      { keys: ['Tab', 'Shift+Tab'], action: 'Moves within the drawer; focus is trapped.' },
      { keys: ['Esc'], action: 'Closes and returns focus to the trigger.' },
    ],
    notes: ['Modal dialog; name it with a DialogTitle or aria-label.', 'The page behind is inert and scroll-locked.', 'Dragging is optional; the X button and Esc always work.'],
    reducedMotion: 'Slide animations are disabled; the drawer appears and leaves instantly.',
  },
  props: [
    { name: 'side', type: "'left' | 'right' | 'bottom'", default: "'right'", description: 'Edge it attaches to.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Width 320, 420, 560px for left and right.' },
    { name: 'showCloseButton', type: 'boolean', default: 'true', description: 'Top-right X.' },
    { name: 'isDragDismissable', type: 'boolean', default: 'true', description: 'Drag to dismiss.' },
    { name: 'scaleBackground', type: 'boolean | string', default: 'false', description: 'Bottom only. true targets [data-oniva-drawer-wrapper], or pass a selector.' },
    { name: 'isDismissable', type: 'boolean', default: 'true', description: 'Backdrop click closes.' },
    { name: 'isOpen / defaultOpen / onOpenChange', type: 'boolean / (open) => void', description: 'Controlled state.' },
    { name: 'aria-label', type: 'string', description: 'Name when there is no DialogTitle.' },
    { name: 'className / xstyle', type: 'string / StyleXStyles', description: 'Panel overrides.' },
    { name: 'DrawerTrigger', type: 'component', description: 'Alias of DialogTrigger.' },
  ],
  related: ['dialog', 'bottom-sheet', 'sidebar', 'alert-dialog'],
};
export default page;
