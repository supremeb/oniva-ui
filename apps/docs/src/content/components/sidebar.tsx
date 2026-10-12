import { BarChart3, Home, Receipt, Settings, Users } from 'lucide-react';
import { Sidebar, SidebarAccount, SidebarContent, SidebarFooter, SidebarHeader, SidebarItem, SidebarMenu, SidebarSearch, SidebarSection } from 'oniva-ui';
import type { DocPage } from '../types';

const Nav = ({ collapsed = false, active = 'Home', compact = false }: { collapsed?: boolean; active?: string; compact?: boolean }) => (
  <div style={{ height: compact ? 420 : 520, display: 'flex' }}>
    <Sidebar collapsed={collapsed} aria-label="Main">
      <SidebarHeader name="Northwind" />
      <SidebarSearch hint="⌘L" />
      <SidebarContent>
        <SidebarSection title="Workspace">
          <SidebarMenu>
            <SidebarItem href="#" icon={<Home size={18} />} isActive={active === 'Home'} badge="12">Home</SidebarItem>
            <SidebarItem href="#" icon={<Receipt size={18} />} isActive={active === 'Invoices'}>Invoices</SidebarItem>
            <SidebarItem href="#" icon={<Users size={18} />} isActive={active === 'Customers'}>Customers</SidebarItem>
            <SidebarItem href="#" icon={<BarChart3 size={18} />}>Reports</SidebarItem>
          </SidebarMenu>
        </SidebarSection>
        <SidebarSection title="Admin" collapsible>
          <SidebarMenu><SidebarItem href="#" icon={<Settings size={18} />}>Settings</SidebarItem></SidebarMenu>
        </SidebarSection>
      </SidebarContent>
      <SidebarFooter><SidebarAccount name="Maya Chen" email="maya@northwind.co" /></SidebarFooter>
    </Sidebar>
  </div>
);
const S = ({ children }: { children: React.ReactNode }) => <div style={{ transform: 'scale(.7)', transformOrigin: 'top center', height: 300 }}>{children}</div>;

const page: DocPage = {
  slug: 'sidebar',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Sidebar',
  group: ['Components', 'Navigation'],
  sourcePath: 'components/Sidebar',
  lede: 'A floating app navigation panel with workspace switcher, search, sectioned items and an account card. It collapses to a 68px icon rail.',
  anatomy: {
    intro: 'Seven parts. Panel, items and content are required; header, search, sections and account are optional.',
    Render: () => <Nav />,
    parts: [
      { name: 'Panel', description: '260px wide (68px collapsed), 24px radius, 12px padding, full height.', selector: 'aside' },
      { name: 'Header', description: 'Workspace switcher with 32px avatar and a collapse toggle.', selector: 'aside > :first-child' },
      { name: 'Search', description: '40px tall field with a keyboard hint; becomes a 40px icon button when collapsed.', selector: 'aside [role="searchbox"], aside input[type="search"]' },
      { name: 'Section title', description: '12px muted label. collapsible makes it a disclosure button.', selector: 'aside button[aria-expanded]:not([aria-label])' },
      { name: 'Active item', description: '40px tall, 10px radius, 18px icon. Active is a solid accent pill with white text and aria-current="page".', selector: 'aside a[aria-current="page"]' },
      { name: 'Badge', description: 'Pill with count or tag, 12px text, 8px side padding.', selector: 'aside a[aria-current="page"] span:last-child' },
      { name: 'Account', description: 'Card with avatar, name and email, 12px radius, 8px padding.', selector: 'aside > :last-child' },
    ],
  },
  usage: {
    use: ['Apps with more than 5 destinations or grouped sections.', 'Persistent navigation next to dense content.', 'Workspace products that need a switcher and account.'],
    avoid: [
      { text: 'Marketing sites with a few links.', instead: { slug: 'navbar', label: 'Navbar' } },
      { text: 'A temporary panel for a record.', instead: { slug: 'drawer', label: 'Drawer' } },
      { text: 'Switching views within one page.', instead: { slug: 'tabs', label: 'Tabs' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'toggle', key: 'collapsed', label: 'Collapsed' },
      { kind: 'select', key: 'active', label: 'Active item', options: ['Home', 'Invoices', 'Customers'] },
    ],
    initial: { collapsed: false, active: 'Home' },
    render: (p, ev) => <div onClick={() => ev('onCollapsedChange')}><Nav compact collapsed={Boolean(p.collapsed)} active={String(p.active)} /></div>,
    code: (p) => `<Sidebar${p.collapsed ? ' collapsed' : ''}>\n  <SidebarHeader name="Northwind" />\n  <SidebarSearch hint="⌘L" />\n  <SidebarContent>\n    <SidebarSection title="Workspace">\n      <SidebarMenu>\n        <SidebarItem href="/" icon={<Home />}${p.active === 'Home' ? ' isActive' : ''} badge="12">Home</SidebarItem>\n        <SidebarItem href="/invoices" icon={<Receipt />}${p.active === 'Invoices' ? ' isActive' : ''}>Invoices</SidebarItem>\n      </SidebarMenu>\n    </SidebarSection>\n  </SidebarContent>\n  <SidebarFooter><SidebarAccount name="Maya Chen" email="maya@northwind.co" /></SidebarFooter>\n</Sidebar>`,
  },
  states: [
    { name: 'Expanded', description: '260px with labels and badges.', Render: () => <S><Nav compact /></S> },
    { name: 'Collapsed', description: '68px rail; labels become tooltips.', Render: () => <S><Nav compact collapsed /></S> },
    { name: 'Other active item', description: 'Only one item carries aria-current.', Render: () => <S><Nav compact active="Customers" /></S> },
  ],
  sections: [
    { type: 'rules', id: 'sb-recipes', title: 'Composition recipes', items: [{ title: 'With LayoutShell', body: 'Place Sidebar in the shell sidebar slot; the shell handles the mobile drawer.' }, { title: 'Workspace menu', body: 'onSwitch on SidebarHeader opens a DropdownMenu of workspaces.' }, { title: 'Persist collapse', body: 'Control collapsed and store it per user.' }] },
    { type: 'numbered', id: 'sb-structure', title: 'Structure', items: [{ title: 'Group by job', body: 'Workspace, Admin. 3 to 7 items per section.' }, { title: 'Collapse the rare', body: 'Make seldom-used sections collapsible.' }, { title: 'Badges for counts', body: 'Use them for unread or pending, not totals.' }] },
  ],
  content: { rules: [{ title: 'Nouns, one or two words', body: 'Invoices, Customers.' }, { title: 'Section titles are categories', body: 'Workspace, Admin. Sentence case.' }, { title: 'Badges stay short', body: 'Counts to 99+; tags like NEW in caps.' }] },
  accessibility: {
    keyboard: [{ keys: ['Tab', 'Shift+Tab'], action: 'Moves through the toggle, search, items and account.' }, { keys: ['Enter'], action: 'Follows a link or toggles a section.' }, { keys: ['Space'], action: 'Toggles a collapsible section.' }],
    notes: ['A landmark with the aria-label you pass.', 'The current item has aria-current="page"; collapsible titles expose aria-expanded.', 'In the collapsed rail, items keep their accessible names via aria-label.'],
    reducedMotion: 'Collapse and expand snap without width animation.',
  },
  props: [
    { name: 'Sidebar.collapsed / defaultCollapsed', type: 'boolean', default: 'false', description: 'Controlled or initial rail state.' },
    { name: 'Sidebar.onCollapsedChange', type: '(collapsed: boolean) => void', description: 'Fires on toggle.' },
    { name: 'SidebarHeader.name', type: 'string', description: 'Required. Workspace name.' },
    { name: 'SidebarHeader.avatarSrc / onSwitch / toggleLabel', type: 'string / () => void / string', description: 'Avatar, switcher handler, toggle label.' },
    { name: 'SidebarSearch.placeholder / hint', type: 'string', description: 'Search field text and key hint. Accepts SearchField props.' },
    { name: 'SidebarSection.title / collapsible / defaultOpen', type: 'string / boolean / boolean', description: 'Heading and disclosure.' },
    { name: 'SidebarItem.icon / badge / isActive', type: 'ReactNode / ReactNode / boolean', description: '18px icon, trailing pill, current page.' },
    { name: 'SidebarItem.href / onPress', type: 'string / () => void', description: 'Link target.' },
    { name: 'SidebarAccount.name / email / avatarSrc / onPress', type: 'string / string / string / () => void', description: 'Account card.' },
    { name: 'useSidebar()', type: '() => { collapsed }', description: 'Read collapse state in custom children.' },
  ],
  related: ['layout-shell', 'navbar', 'drawer', 'tabs'],
};
export default page;
