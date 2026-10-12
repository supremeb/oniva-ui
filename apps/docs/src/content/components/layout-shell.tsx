import { Home, Receipt } from 'lucide-react';
import { Breadcrumb, Breadcrumbs, LayoutShell, Sidebar, SidebarContent, SidebarHeader, SidebarItem, SidebarMenu, SidebarSection } from 'oniva-ui';
import type { DocPage } from '../types';

const Demo = ({ header = true, sidebar = true, text = 'Revenue is up 8.2% vs. last month.' }: { header?: boolean; sidebar?: boolean; text?: string }) => (
  <div data-part="frame" style={{ border: '1px solid var(--oniva-color-border)', borderRadius: 16, height: 360, overflow: 'hidden', width: 640 }}>
    <LayoutShell
      sidebar={sidebar ? (
        <Sidebar aria-label="Main">
          <SidebarHeader name="Northwind" />
          <SidebarContent><SidebarSection><SidebarMenu>
            <SidebarItem href="#" icon={<Home size={18} />} isActive>Home</SidebarItem>
            <SidebarItem href="#" icon={<Receipt size={18} />}>Invoices</SidebarItem>
          </SidebarMenu></SidebarSection></SidebarContent>
        </Sidebar>
      ) : undefined}
      header={header ? <Breadcrumbs aria-label="Breadcrumb"><Breadcrumb href="#">Workspace</Breadcrumb><Breadcrumb>Overview</Breadcrumb></Breadcrumbs> : undefined}
    >
      <div style={{ fontSize: 14 }}>{text}</div>
    </LayoutShell>
  </div>
);

const page: DocPage = {
  slug: 'layout-shell',
  status: 'Stable',
  version: '0.1.0',
  importName: 'LayoutShell',
  group: ['Components', 'Layout'],
  sourcePath: 'components/LayoutShell',
  lede: 'The app frame: sidebar, header and a scrolling content card. Below 768px the sidebar becomes an off-canvas drawer.',
  anatomy: {
    intro: 'Four parts. The frame and content are always present; the sidebar and header are optional.',
    Render: () => <Demo />,
    parts: [
      { name: 'Frame', description: 'Full height, inset canvas, 12px padding and 12px gap on desktop; 0 padding on mobile.', selector: '[data-part="frame"]' },
      { name: 'Sidebar', description: 'Any element, usually a Sidebar (260px). Under 768px it moves into a drawer opened by the header menu button.', selector: 'aside' },
      { name: 'Header', description: '56px minimum height, 12px radius, 1px border, 16px side padding, 8px gap. Holds breadcrumbs, title and actions.', selector: 'header' },
      { name: 'Content', description: 'Scrollable surface, 12px radius, 1px border, 24px padding. Only this region scrolls.', selector: 'main' },
    ],
  },
  usage: {
    use: ['The outer layout of an application.', 'Pages with persistent navigation and a title bar.', 'Dashboards whose content scrolls under a fixed header.'],
    avoid: [
      { text: 'Marketing pages with a top bar only.', instead: { slug: 'navbar', label: 'Navbar' } },
      { text: 'Splitting content into user-sized panes.', instead: { slug: 'resizable-panels', label: 'ResizablePanels' } },
      { text: 'Grouping content inside the page.', instead: { slug: 'card', label: 'Card' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'toggle', key: 'sidebar', label: 'Sidebar' },
      { kind: 'toggle', key: 'header', label: 'Header' },
      { kind: 'text', key: 'text', label: 'Content text', presets: ['Revenue is up 8.2% vs. last month.', '12 invoices are awaiting payment.'] },
    ],
    initial: { sidebar: true, header: true, text: 'Revenue is up 8.2% vs. last month.' },
    render: (p, ev) => <div onClick={() => ev('onSidebarOpenChange(false)')}><Demo sidebar={Boolean(p.sidebar)} header={Boolean(p.header)} text={String(p.text)} /></div>,
    code: (p) => `<LayoutShell${p.sidebar ? '\n  sidebar={<Sidebar>…</Sidebar>}' : ''}${p.header ? '\n  header={<Breadcrumbs>…</Breadcrumbs>}' : ''}\n>\n  ${p.text}\n</LayoutShell>`,
  },
  states: [
    { name: 'Full', description: 'Sidebar, header and content.', Render: () => <div style={{ transform: 'scale(.55)', transformOrigin: 'top left', height: 210, width: 352 }}><Demo /></div> },
    { name: 'No sidebar', description: 'Header and content only.', Render: () => <div style={{ transform: 'scale(.55)', transformOrigin: 'top left', height: 210, width: 352 }}><Demo sidebar={false} /></div> },
    { name: 'No header', description: 'Sidebar and content; on mobile the menu button needs a header.', Render: () => <div style={{ transform: 'scale(.55)', transformOrigin: 'top left', height: 210, width: 352 }}><Demo header={false} /></div> },
  ],
  sections: [
    { type: 'rules', id: 'ls-recipes', title: 'Composition recipes', items: [{ title: 'Dashboard', body: 'Grid minColumnWidth={240} of Cards in the content area.' }, { title: 'Master-detail', body: 'ResizablePanels in the content area with ScrollArea panes.' }, { title: 'Control the drawer', body: 'sidebarOpen and onSidebarOpenChange let you close it after navigation.' }] },
    { type: 'numbered', id: 'ls-rules', title: 'Rules', items: [{ title: 'One shell per app', body: 'Do not nest shells.' }, { title: 'Content scrolls, chrome does not', body: 'Never add a second page-level scroll.' }, { title: 'Give it a height', body: 'The shell fills its parent; use 100dvh at the root.' }] },
  ],
  content: { rules: [{ title: 'Header shows location', body: 'Breadcrumbs or a page title, then actions at the end.' }, { title: 'One h1', body: 'Put the page heading in the content, not the header chrome.' }] },
  accessibility: {
    keyboard: [
      { keys: ['Tab'], action: 'Order is sidebar, header, content. Below 768px the sidebar is in a drawer reached from the menu button.' },
      { keys: ['Esc'], action: 'Closes the mobile drawer and returns focus to the menu button.' },
    ],
    notes: ['Renders header and main landmarks; the sidebar supplies the navigation landmark.', 'The mobile menu button has an accessible name and aria-expanded.', 'The drawer is modal on mobile and inert-traps the page.'],
    reducedMotion: 'The mobile drawer appears without sliding.',
  },
  props: [
    { name: 'sidebar', type: 'ReactNode', description: 'Usually a Sidebar. Off-canvas below 768px.' },
    { name: 'header', type: 'ReactNode', description: 'Top bar content.' },
    { name: 'children', type: 'ReactNode', description: 'Main content.' },
    { name: 'sidebarOpen', type: 'boolean', description: 'Controlled mobile drawer.' },
    { name: 'onSidebarOpenChange', type: '(open: boolean) => void', description: 'Fires when the drawer opens or closes.' },
    { name: 'className / style / xstyle', type: 'string / CSSProperties / StyleXStyles', description: 'Overrides.' },
  ],
  related: ['sidebar', 'navbar', 'resizable-panels', 'card', 'grid'],
};
export default page;
