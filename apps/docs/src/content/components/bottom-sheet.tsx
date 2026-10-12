import { Button } from 'oniva-ui';
import type { DocPage } from '../types';

// The real BottomSheet is a fixed, viewport-sized modal. The stage draws the same panel (top corners 16px,
// 36 by 4 handle in a 28px zone) in a phone-width frame.
const Sheet = ({ height = 220, handle = true, title = 'Share report' }: { height?: number; handle?: boolean; title?: string }) => (
  <div data-part="backdrop" style={{ alignItems: 'flex-end', background: 'var(--oniva-color-overlay)', borderRadius: 12, display: 'flex', height: 300, overflow: 'hidden', width: 300 }}>
    <div role="dialog" aria-label={title} style={{ background: 'var(--oniva-color-surface)', border: '1px solid var(--oniva-color-border)', borderRadius: '16px 16px 0 0', boxShadow: 'var(--oniva-shadow-xl)', boxSizing: 'border-box', height, width: '100%' }}>
      {handle && <div data-part="handle-zone" style={{ display: 'flex', height: 28, justifyContent: 'center', paddingTop: 8, boxSizing: 'border-box' }}><span data-part="handle" style={{ background: 'var(--oniva-color-border-hover)', borderRadius: 9999, height: 4, width: 36 }} /></div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '4px 20px 20px' }}>
        <h2 data-part="title" style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{title}</h2>
        <p style={{ color: 'var(--oniva-color-text-muted)', fontSize: 14, margin: 0 }}>Anyone at Northwind can view the Q4 revenue report.</p>
        <Button>Copy link</Button>
      </div>
    </div>
  </div>
);
const S = ({ children }: { children: React.ReactNode }) => <div style={{ transform: 'scale(.75)', transformOrigin: 'center' }}>{children}</div>;

const page: DocPage = {
  slug: 'bottom-sheet',
  status: 'Stable',
  version: '0.1.0',
  importName: 'BottomSheet',
  group: ['Components', 'Overlays'],
  sourcePath: 'components/BottomSheet',
  lede: 'A touch-first panel that rises from the bottom edge, rests at snap heights, and is dragged or flicked away.',
  anatomy: {
    intro: 'Four parts. The backdrop and panel are always present; the handle is on by default. Drawn inline in a phone-width frame because the real sheet is viewport-fixed.',
    Render: () => <Sheet />,
    parts: [
      { name: 'Backdrop', description: 'Overlay color at 40% black. Opacity follows the drag progress.', selector: '[data-part="backdrop"]' },
      { name: 'Panel', description: 'Full width, 16px top radius, 1px border, xl shadow. Height is a fraction of the viewport, default snaps 40% and 90%.', selector: '[role="dialog"]' },
      { name: 'Handle', description: '36 by 4px pill centered in a 28px drag zone with 8px top padding. Drag, flick, or press arrows on it to change snap.', selector: '[data-part="handle"]' },
      { name: 'Content', description: 'Scrolls only when the sheet is at its top snap, so drags and scrolls never fight.', selector: '[data-part="title"]' },
    ],
  },
  usage: {
    use: ['Mobile pickers, share sheets and quick actions.', 'Content with a peek state and an expanded state, like a map list.', 'Anything the user should dismiss with a thumb flick.'],
    avoid: [
      { text: 'Desktop panels beside the page.', instead: { slug: 'drawer', label: 'Drawer' } },
      { text: 'Centered tasks. Dialog already becomes a sheet below 640px.', instead: { slug: 'dialog', label: 'Dialog' } },
      { text: 'Confirmations.', instead: { slug: 'alert-dialog', label: 'AlertDialog' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'toggle', key: 'showHandle', label: 'Handle' },
      { kind: 'select', key: 'snap', label: 'Snap points', options: ['0.4, 0.9', '0.5', '0.3, 0.6, 0.95'] },
      { kind: 'toggle', key: 'dismissable', label: 'Dismissable' },
    ],
    initial: { showHandle: true, snap: '0.4, 0.9', dismissable: true },
    render: (p, ev) => <div onClick={() => ev('onSnapChange(0)')}><Sheet handle={Boolean(p.showHandle)} height={p.snap === '0.5' ? 180 : 220} /></div>,
    code: (p) => `<BottomSheetTrigger>\n  <Button>Share</Button>\n  <BottomSheet${p.snap !== '0.4, 0.9' ? ` snapPoints={[${p.snap}]}` : ''}${p.showHandle ? '' : ' showHandle={false}'}${p.dismissable ? '' : ' isDismissable={false}'} aria-label="Share report">\n    …\n  </BottomSheet>\n</BottomSheetTrigger>`,
  },
  states: [
    { name: 'Low snap', description: 'First snap point, 40% of the viewport.', Render: () => <S><Sheet /></S> },
    { name: 'Expanded', description: 'Top snap, 90%. Content scrolls here.', Render: () => <S><Sheet height={270} /></S> },
    { name: 'No handle', description: 'showHandle off; give another close path.', Render: () => <S><Sheet handle={false} /></S> },
    { name: 'Long title', description: 'Wraps; keep under two lines.', Render: () => <S><Sheet title="Share the Q4 revenue forecast with the regional finance team" height={250} /></S> },
  ],
  sections: [
    { type: 'text', id: 'choosing-an-overlay', title: 'Choosing an overlay', body: <>Use a sheet when the thumb is the pointer. For the full comparison with dialogs, drawers and popovers, see <a href="#/components/dialog">Dialog</a>.</> },
    {
      type: 'rules', id: 'sheet-gestures', title: 'Gestures',
      items: [
        { title: 'Drag between snaps', body: 'Release near a snap to settle; velocity decides the direction.' },
        { title: 'Flick down to dismiss', body: 'From the lowest snap only, and only when isDismissable is true.' },
        { title: 'Scroll at the top', body: 'Inner content scrolls only at the highest snap.' },
      ],
    },
  ],
  content: { rules: [{ title: 'Title names the task', body: 'Share report, Choose a region.' }, { title: 'Primary action at the bottom', body: 'Within thumb reach, full width.' }, { title: 'Show the peek', body: 'At the lowest snap the main action must already be visible.' }] },
  accessibility: {
    keyboard: [
      { keys: ['Tab'], action: 'Cycles through content inside the sheet.' },
      { keys: ['↑', '↓'], action: 'On the handle, moves between snap points.' },
      { keys: ['Esc'], action: 'Closes the sheet and returns focus to the trigger.' },
    ],
    notes: ['A modal dialog; provide aria-label or a DialogTitle.', 'Dragging is an enhancement; every size change and dismissal also works with the keyboard.', 'Handle zone is 28px tall; the footer button should be 44px for touch.'],
    reducedMotion: 'Slide in and out animations are disabled; snap changes happen without easing.',
  },
  props: [
    { name: 'snapPoints', type: 'number[]', default: '[0.4, 0.9]', description: 'Visible heights as viewport fractions, ascending.' },
    { name: 'snap / defaultSnap', type: 'number', default: '0', description: 'Controlled or initial snap index.' },
    { name: 'onSnapChange', type: '(index: number) => void', description: 'Fires when the snap changes.' },
    { name: 'showHandle', type: 'boolean', default: 'true', description: 'Grab handle.' },
    { name: 'isDismissable', type: 'boolean', default: 'true', description: 'Backdrop click and flick down close it.' },
    { name: 'isOpen / defaultOpen / onOpenChange', type: 'boolean / (open) => void', description: 'Controlled state.' },
    { name: 'aria-label', type: 'string', description: 'Name when there is no DialogTitle.' },
    { name: 'className / xstyle', type: 'string / StyleXStyles', description: 'Panel overrides.' },
    { name: 'BottomSheetTrigger', type: 'component', description: 'Alias of DialogTrigger.' },
  ],
  related: ['drawer', 'dialog', 'popover', 'toast'],
};
export default page;
