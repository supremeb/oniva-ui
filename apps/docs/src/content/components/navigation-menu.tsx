import { NavigationMenu, NavigationMenuItemLink, NavigationMenuLink, NavigationMenuTrigger } from 'oniva-ui';
import type { DocPage } from '../types';

const Menu = ({ compact = false }: { compact?: boolean }) => (
  <NavigationMenu aria-label="Site">
    <NavigationMenuLink href="#" isActive>Home</NavigationMenuLink>
    <NavigationMenuTrigger label="Products" panelLabel="Products">
      <NavigationMenuItemLink href="#" title="Payments" description={compact ? undefined : 'Accept cards and bank transfers'} />
      <NavigationMenuItemLink href="#" title="Invoicing" description={compact ? undefined : 'Send and track invoices'} />
    </NavigationMenuTrigger>
    <NavigationMenuLink href="#">Pricing</NavigationMenuLink>
  </NavigationMenu>
);
// The panel is a popover opened from the trigger. The stage composes the same panel markup
// (280px min, 12px radius, 8px padding, 10px item padding) below the real menu bar.
const Open = ({ items = [['Payments', 'Accept cards and bank transfers'], ['Invoicing', 'Send and track invoices']] }: { items?: string[][] }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <Menu />
    <div role="group" aria-label="Products" data-part="panel" style={{ background: 'var(--oniva-color-surface)', border: '1px solid var(--oniva-color-border)', borderRadius: 12, boxShadow: 'var(--oniva-shadow-dropdown)', marginInlineStart: 80, minWidth: 280, padding: 8 }}>
      {items.map(([t, d], i) => (
        <a key={t} href="#" data-part={i === 0 ? 'item' : undefined} style={{ background: i === 0 ? 'var(--oniva-color-surface-hover)' : 'transparent', borderRadius: 10, color: 'inherit', display: 'block', padding: 10, textDecoration: 'none' }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{t}</div>
          <div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13 }}>{d}</div>
        </a>
      ))}
    </div>
  </div>
);

const page: DocPage = {
  slug: 'navigation-menu',
  status: 'Stable',
  version: '0.1.0',
  importName: 'NavigationMenu',
  group: ['Components', 'Navigation'],
  sourcePath: 'components/NavigationMenu',
  lede: 'Site-level navigation where some entries are plain links and others open a panel of links with descriptions.',
  anatomy: {
    intro: 'Four parts. The bar and links are always present; triggers and panels are used for grouped destinations. The open panel is drawn inline because it mounts in a popover.',
    Render: () => <Open />,
    parts: [
      { name: 'Menu bar', description: 'A nav landmark with a flat list of links and triggers, 4px gap.', selector: 'nav' },
      { name: 'Link', description: '36px tall, 10px radius, 14px text, 12px side padding. Active carries aria-current="page".', selector: 'nav a[aria-current="page"]' },
      { name: 'Trigger', description: 'Same 36px height as a link, with a chevron. aria-expanded follows the panel.', selector: 'nav button' },
      { name: 'Panel item', description: '280px minimum panel, 12px radius, 8px padding. Each item: 14px medium title and 13px muted description in a 10px padded, 10px radius row.', selector: '[data-part="item"]' },
    ],
  },
  usage: {
    use: ['Marketing or docs headers with grouped destinations.', 'Sections that need a one-line description to be understood.', 'Menus of 4 to 8 links per panel.'],
    avoid: [
      { text: 'Flat app navigation of a few links.', instead: { slug: 'navbar', label: 'Navbar' } },
      { text: 'Lists of commands.', instead: { slug: 'dropdown-menu', label: 'DropdownMenu' } },
      { text: 'Deep trees inside an app.', instead: { slug: 'sidebar', label: 'Sidebar' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'text', key: 'label', label: 'Trigger label', presets: ['Products', 'Resources'] },
      { kind: 'toggle', key: 'descriptions', label: 'Descriptions' },
      { kind: 'select', key: 'items', label: 'Panel items', options: ['2', '3', '4'] },
    ],
    initial: { label: 'Products', descriptions: true, items: '2' },
    render: (p, ev) => {
      const all = [['Payments', 'Accept cards and bank transfers'], ['Invoicing', 'Send and track invoices'], ['Payouts', 'Pay vendors in 40+ currencies'], ['Billing', 'Recurring plans and usage']];
      return <div onClick={() => ev('onOpenChange(true)')}><Open items={all.slice(0, Number(p.items)).map(([t, d]): string[] => [t as string, p.descriptions ? (d as string) : ''])} /></div>;
    },
    code: (p) => `<NavigationMenu aria-label="Site">\n  <NavigationMenuLink href="/" isActive>Home</NavigationMenuLink>\n  <NavigationMenuTrigger label="${p.label}">\n    <NavigationMenuItemLink href="/payments" title="Payments"${p.descriptions ? ' description="Accept cards and bank transfers"' : ''} />\n  </NavigationMenuTrigger>\n</NavigationMenu>`,
  },
  states: [
    { name: 'Closed', description: 'Links and trigger with chevron.', Render: () => <Menu /> },
    { name: 'Open', description: 'Panel under the trigger with described links.', Render: () => <Open /> },
    { name: 'Titles only', description: 'Omit descriptions for obvious destinations.', Render: () => <Open items={[['Payments', ''], ['Invoicing', '']]} /> },
    { name: 'Long description', description: 'Descriptions wrap within the panel.', Render: () => <Open items={[['Payments', 'Accept cards, wallets and bank transfers in 135 currencies with one integration']]} /> },
  ],
  sections: [
    { type: 'rules', id: 'nm-recipes', title: 'Composition recipes', items: [{ title: 'With Navbar', body: 'Put NavigationMenu in the Navbar link slot for mixed link and panel navigation.' }, { title: 'Active section', body: 'Mark the link of the current section active; triggers do not carry active state.' }, { title: 'Mobile', body: 'Collapse to a Drawer with the same links as a flat list.' }] },
    { type: 'numbered', id: 'nm-panel-rules', title: 'Writing a panel', items: [{ title: 'Title is the destination', body: 'Payments, not Learn about payments.' }, { title: 'Description is the benefit', body: 'One line under 50 characters.' }, { title: 'Group by task', body: 'Max 6 items per panel; split into two triggers beyond that.' }] },
  ],
  content: { rules: [{ title: 'Titles: 1 to 2 words', body: 'Nouns in sentence case.' }, { title: 'Descriptions: sentence case, no period', body: 'Accept cards and bank transfers.' }, { title: 'Label triggers by category', body: 'Products, Resources, Company.' }] },
  accessibility: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves between links and triggers.' },
      { keys: ['Enter', 'Space'], action: 'Opens the panel from a trigger, then focuses the first link.' },
      { keys: ['Tab'], action: 'Walks through the panel links.' },
      { keys: ['Esc'], action: 'Closes the panel and returns focus to the trigger.' },
    ],
    notes: ['A nav landmark; triggers are buttons with aria-expanded and aria-haspopup.', 'The panel is a named group (panelLabel) so screen readers announce its context.', 'Links are real anchors, so middle-click and copy link work.'],
    reducedMotion: 'The panel opens without scale animation.',
  },
  props: [
    { name: 'NavigationMenu.aria-label', type: 'string', description: 'Landmark name.' },
    { name: 'NavigationMenuLink.isActive', type: 'boolean', description: 'Current page.' },
    { name: 'NavigationMenuLink.href / onPress', type: 'string / () => void', description: 'Link target.' },
    { name: 'NavigationMenuTrigger.label', type: 'ReactNode', description: 'Button label.' },
    { name: 'NavigationMenuTrigger.children', type: 'ReactNode', description: 'Panel content.' },
    { name: 'NavigationMenuTrigger.panelLabel', type: 'string', description: 'Accessible name of the panel.' },
    { name: 'NavigationMenuItemLink.title', type: 'string', description: 'Required. Link title.' },
    { name: 'NavigationMenuItemLink.description', type: 'string', description: 'Muted second line.' },
    { name: 'NavigationMenuItemLink.href', type: 'string', description: 'Link target.' },
  ],
  related: ['navbar', 'dropdown-menu', 'sidebar', 'popover'],
};
export default page;
