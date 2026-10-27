import { Bell } from 'lucide-react';
import { Button, IconButton, Navbar, NavbarLink } from 'oniva-ui';
import type { DocPage } from '../types';

const Bar = ({ floating = false, active = 'Dashboard', links = ['Dashboard', 'Reports', 'Customers'], end = true, width = 560 }: { floating?: boolean; active?: string; links?: string[]; end?: boolean; width?: number }) => (
  <div style={{ background: floating ? 'var(--oniva-color-surface-inset)' : undefined, padding: floating ? 12 : 0, width }}>
    <Navbar floating={floating} brand="Oniva" aria-label="Primary" end={end ? <><IconButton aria-label="Notifications"><Bell size={16} /></IconButton><Button size="sm">Upgrade</Button></> : undefined}>
      {links.map((l) => <NavbarLink key={l} href="#" isActive={l === active}>{l}</NavbarLink>)}
    </Navbar>
  </div>
);
const S = ({ children }: { children: React.ReactNode }) => <div style={{ transform: 'scale(.75)', transformOrigin: 'center' }}>{children}</div>;

const page: DocPage = {
  slug: 'navbar',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Navbar',
  group: ['Components', 'Navigation'],
  sourcePath: 'components/Navbar',
  lede: 'A 56px top bar with the brand, primary links and account actions. Flat with a bottom border, or floating as a rounded card.',
  anatomy: {
    intro: 'Four parts. The bar and links are always present; the brand and end actions are optional.',
    Render: () => <Bar />,
    parts: [
      { name: 'Bar', description: '56px tall, 16px side padding, full width. Flat has a bottom border; floating has a 20px radius and a full 1px border, still no shadow.', selector: 'nav' },
      { name: 'Brand', description: '16px semibold text or logo at the start.', selector: 'header > div:first-child' },
      { name: 'Active link', description: '36px tall, 10px radius, 14px text, 12px side padding. Active uses the selected fill and aria-current="page".', selector: 'nav a[aria-current="page"]' },
      { name: 'End actions', description: 'Buttons and avatar pushed to the far end. Keep to two or three.', selector: 'header button:last-of-type' },
    ],
  },
  usage: {
    use: ['Top-level navigation of 3 to 7 destinations.', 'Marketing and app shells that need a persistent header.', 'Floating mode over a content canvas.'],
    avoid: [
      { text: 'Deep or long navigation trees.', instead: { slug: 'sidebar', label: 'Sidebar' } },
      { text: 'Links with described submenus.', instead: { slug: 'navigation-menu', label: 'NavigationMenu' } },
      { text: 'Switching views inside a page.', instead: { slug: 'tabs', label: 'Tabs' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'toggle', key: 'floating', label: 'Floating' },
      { kind: 'toggle', key: 'sticky', label: 'Sticky' },
      { kind: 'toggle', key: 'end', label: 'End actions' },
      { kind: 'select', key: 'active', label: 'Active link', options: ['Dashboard', 'Reports', 'Customers'] },
    ],
    initial: { floating: false, sticky: false, end: true, active: 'Dashboard' },
    render: (p, ev) => <div onClick={() => ev('onPress(link)')}><Bar floating={Boolean(p.floating)} end={Boolean(p.end)} active={String(p.active)} /></div>,
    code: (p) => `<Navbar brand="Oniva"${p.floating ? ' floating' : ''}${p.sticky ? ' sticky' : ''}${p.end ? ' end={<Button size="sm">Upgrade</Button>}' : ''}>\n  <NavbarLink href="/" isActive${p.active === 'Dashboard' ? '' : '={false}'}>Dashboard</NavbarLink>\n  <NavbarLink href="/reports"${p.active === 'Reports' ? ' isActive' : ''}>Reports</NavbarLink>\n  <NavbarLink href="/customers"${p.active === 'Customers' ? ' isActive' : ''}>Customers</NavbarLink>\n</Navbar>`,
  },
  states: [
    { name: 'Flat', description: 'Bottom border, edge to edge.', Render: () => <S><Bar /></S> },
    { name: 'Floating', description: 'Rounded bar with a full 1px border over an inset canvas.', Render: () => <S><Bar floating /></S> },
    { name: 'Second link active', description: 'Only one link carries aria-current.', Render: () => <S><Bar active="Reports" /></S> },
    { name: 'Without actions', description: 'Brand and links only.', Render: () => <S><Bar end={false} /></S> },
    { name: 'Narrow', description: 'At 360px, links crowd; keep 3 or fewer or switch to a Drawer menu.', Render: () => <Bar links={['Home', 'Reports']} active="Home" end={false} width={320} /> },
  ],
  sections: [
    {
      type: 'rules', id: 'navbar-recipes', title: 'Composition recipes',
      items: [
        { title: 'App header', body: 'Brand, 4 links, search IconButton and Avatar menu via DropdownMenu.' },
        { title: 'Marketing header', body: 'NavigationMenu for products and resources, primary Button at the end.' },
        { title: 'Sticky', body: 'sticky pins to the top; pair with a flat bar so content scrolls under the border.' },
      ],
    },
  ],
  content: { rules: [{ title: 'One word links', body: 'Dashboard, Reports, Customers.' }, { title: 'Nouns, not verbs', body: 'Links are destinations. Actions go in the end slot.' }, { title: 'Max 7 links', body: 'More than that belongs in a Sidebar.' }] },
  accessibility: {
    keyboard: [{ keys: ['Tab', 'Shift+Tab'], action: 'Moves through links and end actions in DOM order.' }, { keys: ['Enter'], action: 'Follows the focused link.' }],
    notes: ['Renders a nav landmark named by aria-label (default Primary). Use distinct labels if there is more than one.', 'The active link has aria-current="page".', 'Links are 36px tall; add padding in touch-first layouts.'],
    reducedMotion: 'Hover fills change instantly.',
  },
  props: [
    { name: 'brand', type: 'ReactNode', description: 'Start block.' },
    { name: 'end', type: 'ReactNode', description: 'End actions.' },
    { name: 'children', type: 'NavbarLink elements', description: 'Primary links.' },
    { name: 'floating', type: 'boolean', default: 'false', description: 'Rounded bar with a full border instead of a bottom rule.' },
    { name: 'sticky', type: 'boolean', default: 'false', description: 'position: sticky at the top.' },
    { name: 'aria-label', type: 'string', default: "'Primary'", description: 'Landmark name.' },
    { name: 'NavbarLink.isActive', type: 'boolean', default: 'false', description: 'Current page styling and aria-current.' },
    { name: 'NavbarLink.href / onPress', type: 'string / () => void', description: 'Link target or handler.' },
    { name: 'className / style / xstyle', type: 'string / CSSProperties / StyleXStyles', description: 'Overrides.' },
  ],
  related: ['navigation-menu', 'sidebar', 'tabs', 'breadcrumbs'],
};
export default page;
