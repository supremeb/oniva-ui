import { ResizablePanel, ResizablePanels } from 'oniva-ui';
import type { DocPage } from '../types';

const Pane = ({ children }: { children: React.ReactNode }) => <div style={{ fontSize: 14, padding: 16 }}>{children}</div>;
const Demo = ({ direction = 'horizontal', size = 30, min = 20, onResize }: { direction?: 'horizontal' | 'vertical'; size?: number; min?: number; onResize?: (s: number[]) => void }) => (
  <div style={{ border: '1px solid var(--oniva-color-border)', borderRadius: 12, height: 200, overflow: 'hidden', width: 420 }}>
    <ResizablePanels direction={direction} aria-label="Mail" onResize={onResize}>
      <ResizablePanel defaultSize={size} minSize={min} aria-label="Inbox"><Pane><strong>Inbox</strong><div style={{ color: 'var(--oniva-color-text-muted)' }}>12 unread</div></Pane></ResizablePanel>
      <ResizablePanel aria-label="Message"><Pane><strong>Invoice INV-1042</strong><div style={{ color: 'var(--oniva-color-text-muted)' }}>Due 14 Nov</div></Pane></ResizablePanel>
    </ResizablePanels>
  </div>
);

const page: DocPage = {
  slug: 'resizable-panels',
  status: 'Stable',
  version: '0.1.0',
  importName: 'ResizablePanels',
  group: ['Components', 'Layout'],
  sourcePath: 'components/ResizablePanels',
  lede: 'Two or more panes the user can resize by dragging or with arrow keys. Sizes are percentages and each pane has a minimum.',
  anatomy: {
    intro: 'Four parts. At least two panels and one handle between each pair.',
    Render: () => <Demo />,
    parts: [
      { name: 'Group', description: 'Fills its parent (100% by 100%). Give the parent a height.', selector: '[aria-label="Mail"]' },
      { name: 'Panel', description: 'role="group" with tabIndex 0. defaultSize in percent (unset panels share the rest), minSize default 10.', selector: '[role="group"][aria-label="Inbox"]' },
      { name: 'Handle', description: 'role="separator", 12px hit target with a 2px line. Focus shows a 32 by 4px pill. Arrow keys move 16px.', selector: '[role="separator"]' },
      { name: 'Second panel', description: 'Takes the remaining space.', selector: '[role="group"][aria-label="Message"]' },
    ],
  },
  usage: {
    use: ['Master-detail layouts like inbox and message.', 'Editors with a canvas and an inspector.', 'Console panels the user sizes to taste.'],
    avoid: [
      { text: 'Fixed-width navigation.', instead: { slug: 'sidebar', label: 'Sidebar' } },
      { text: 'Temporary side panels.', instead: { slug: 'drawer', label: 'Drawer' } },
      { text: 'Equal columns that never change.', instead: { slug: 'grid', label: 'Grid' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'direction', label: 'Direction', options: ['horizontal', 'vertical'] },
      { kind: 'number', key: 'size', label: 'First panel %', min: 10, max: 80, step: 5 },
      { kind: 'number', key: 'min', label: 'Min size %', min: 5, max: 40, step: 5 },
    ],
    initial: { direction: 'horizontal', size: 30, min: 20 },
    render: (p, ev) => <Demo key={`${p.direction}${p.size}${p.min}`} direction={p.direction as 'horizontal' | 'vertical'} size={Number(p.size)} min={Number(p.min)} onResize={(s) => ev(`onResize([${s.map((n) => Math.round(n)).join(', ')}])`)} />,
    code: (p) => `<ResizablePanels${p.direction === 'vertical' ? ' direction="vertical"' : ''} aria-label="Mail" onResize={save}>\n  <ResizablePanel defaultSize={${p.size}} minSize={${p.min}} aria-label="Inbox">…</ResizablePanel>\n  <ResizablePanel aria-label="Message">…</ResizablePanel>\n</ResizablePanels>`,
  },
  states: [
    { name: 'Horizontal 30/70', description: 'Default two panes side by side.', Render: () => <Demo /> },
    { name: 'Vertical', description: 'Stacked panes; handle is horizontal.', Render: () => <Demo direction="vertical" /> },
    { name: 'Even split', description: 'Without defaultSize, panes share space equally.', Render: () => <Demo size={50} /> },
    { name: 'Narrow minimum', description: 'minSize 5 lets the pane almost collapse.', Render: () => <Demo size={10} min={5} /> },
  ],
  sections: [
    { type: 'rules', id: 'rp-recipes', title: 'Composition recipes', items: [{ title: 'Persist sizes', body: 'Store onResize values and pass them back as defaultSize.' }, { title: 'Inside LayoutShell', body: 'Give the content area a fixed height so panels can fill it.' }, { title: 'Scrolling panes', body: 'Put a ScrollArea inside each panel; the panel itself does not scroll.' }] },
    { type: 'numbered', id: 'rp-rules', title: 'Rules', items: [{ title: 'Always set minSize', body: 'Prevent panes collapsing to unusable widths.' }, { title: 'Name every panel', body: 'aria-label feeds the handle label, such as Resize Inbox.' }, { title: 'Collapsed on mobile', body: 'Below 640px, stack panes or switch to a single view with Tabs.' }] },
  ],
  content: { rules: [{ title: 'Panel names are nouns', body: 'Inbox, Message, Inspector.' }, { title: 'No instructions in the UI', body: 'The cursor and focus pill show it is draggable.' }] },
  accessibility: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus to panels and handles.' },
      { keys: ['←', '→'], action: 'On a horizontal handle, moves 16px.' },
      { keys: ['↑', '↓'], action: 'On a vertical handle, moves 16px.' },
    ],
    notes: ['Handle is role="separator" with aria-valuenow, aria-valuemin and aria-valuemax in percent.', 'Panels are named groups; aria-label names the handle before each.', 'Pointer drag, touch and keyboard all use the same move logic.'],
    reducedMotion: 'Resizing is direct manipulation; there is no easing.',
  },
  props: [
    { name: 'ResizablePanels.direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Side by side or stacked.' },
    { name: 'ResizablePanels.onResize', type: '(sizes: number[]) => void', description: 'Percent sizes after each change.' },
    { name: 'ResizablePanels.aria-label', type: 'string', description: 'Group name.' },
    { name: 'ResizablePanel.defaultSize', type: 'number', description: 'Initial percent. Unset panels share the rest.' },
    { name: 'ResizablePanel.minSize', type: 'number', default: '10', description: 'Minimum percent.' },
    { name: 'ResizablePanel.aria-label', type: 'string', description: 'Panel and handle name.' },
  ],
  related: ['layout-shell', 'sidebar', 'scroll-area', 'grid'],
};
export default page;
