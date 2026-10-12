import { Home } from 'lucide-react';
import { Breadcrumb, Breadcrumbs } from 'oniva-ui';
import type { DocPage } from '../types';

const Trail = ({ items = ['Workspace', 'Projects', 'Atlas redesign'], home = false, label = 'Breadcrumb' }: { items?: string[]; home?: boolean; label?: string }) => (
  <Breadcrumbs aria-label={label}>
    {items.map((t, i) => (
      i === items.length - 1
        ? <Breadcrumb key={t}>{t}</Breadcrumb>
        : <Breadcrumb key={t} href="#" icon={home && i === 0 ? <Home size={14} /> : undefined}>{t}</Breadcrumb>
    ))}
  </Breadcrumbs>
);

const page: DocPage = {
  slug: 'breadcrumbs',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Breadcrumbs',
  group: ['Components', 'Navigation'],
  sourcePath: 'components/Breadcrumbs',
  lede: 'A trail of links from the root to the current page. It shows where you are and gets you back up the hierarchy in one click.',
  anatomy: {
    intro: 'Four parts. Links and the current page are always present; icons and custom separators are optional.',
    Render: () => <Trail home />,
    parts: [
      { name: 'List', description: 'An ordered list inside a nav landmark, 14px text, 8px between crumb and separator.', selector: 'ol' },
      { name: 'Link', description: 'Muted, medium weight, 6px radius focus ring. Turns to full text color on hover.', selector: 'ol li:first-child a' },
      { name: 'Separator', description: 'Chevron by default; pass separator to a Breadcrumb to replace it. Hidden from screen readers.', selector: 'ol li:first-child > span[aria-hidden="true"]' },
      { name: 'Current page', description: 'Last crumb. Plain text, aria-current="page", not a link.', selector: 'ol li:last-child' },
    ],
  },
  usage: {
    use: ['Hierarchies three or more levels deep: workspace, project, document.', 'Pages reachable from many places, where Back would be ambiguous.', 'Above a page title to show context.'],
    avoid: [
      { text: 'Switching between sibling views.', instead: { slug: 'tabs', label: 'Tabs' } },
      { text: 'Showing progress through a flow.', instead: { slug: 'stepper', label: 'Stepper' } },
      { text: 'Primary site navigation.', instead: { slug: 'navbar', label: 'Navbar' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'select', key: 'depth', label: 'Depth', options: ['2', '3', '4'] },
      { kind: 'toggle', key: 'home', label: 'Home icon' },
      { kind: 'text', key: 'current', label: 'Current page', presets: ['Atlas redesign', 'INV-1042'] },
    ],
    initial: { depth: '3', home: false, current: 'Atlas redesign' },
    render: (p, ev) => {
      const all = ['Workspace', 'Projects', 'Q4 planning', String(p.current)];
      const n = Number(p.depth);
      const items = [...all.slice(0, n - 1), String(p.current)];
      return <div onClick={() => ev('onPress(link)')}><Trail items={items} home={Boolean(p.home)} /></div>;
    },
    code: (p) => `<Breadcrumbs aria-label="Breadcrumb">\n  <Breadcrumb href="/"${p.home ? ' icon={<Home size={14} />}' : ''}>Workspace</Breadcrumb>\n  <Breadcrumb href="/projects">Projects</Breadcrumb>\n  <Breadcrumb>${p.current}</Breadcrumb>\n</Breadcrumbs>`,
  },
  states: [
    { name: 'Default', description: 'Three levels, current page is text.', Render: () => <Trail /> },
    { name: 'With home icon', description: 'icon on the first crumb.', Render: () => <Trail home /> },
    { name: 'Long labels', description: 'Wraps onto a second line rather than truncating.', Render: () => <div style={{ width: 260 }}><Trail items={['Northwind Europe', 'Quarterly forecasts', 'Q4 regional revenue breakdown']} /></div> },
    { name: 'Two levels', description: 'The minimum useful trail.', Render: () => <Trail items={['Invoices', 'INV-1042']} /> },
  ],
  sections: [
    {
      type: 'numbered', id: 'trail-rules', title: 'Building a trail',
      items: [
        { title: 'Start at the root', body: 'First crumb is where the user can go back to, usually the workspace.' },
        { title: 'End on the current page', body: 'Last crumb has no href and matches the page heading.' },
        { title: 'Skip it on top-level pages', body: 'One crumb is just a title. Show the trail from depth two.' },
      ],
    },
  ],
  content: { rules: [{ title: 'Match page titles', body: 'The crumb text equals the heading of the page it links to.' }, { title: 'Nouns, sentence case', body: 'Projects, Atlas redesign.' }, { title: 'Under 24 characters', body: 'Shorten long names; the full name is on the page.' }] },
  accessibility: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves between links; the current page is skipped.' },
      { keys: ['Enter'], action: 'Follows the focused link.' },
    ],
    notes: ['Renders nav with the aria-label you pass (default pattern: "Breadcrumb") around an ordered list.', 'The last item has aria-current="page".', 'Separators are decorative and not announced.'],
    reducedMotion: 'Hover color changes are not animated.',
  },
  props: [
    { name: 'Breadcrumbs.aria-label', type: 'string', description: 'Landmark name. Required for a good screen reader experience.' },
    { name: 'Breadcrumbs.children', type: 'Breadcrumb elements', description: 'The crumbs, in order.' },
    { name: 'Breadcrumbs.onAction', type: '(key) => void', description: 'Fires when a crumb with an id is pressed.' },
    { name: 'Breadcrumbs.isDisabled', type: 'boolean', description: 'Disables every link.' },
    { name: 'Breadcrumb.href', type: 'string', description: 'Link target. Omit on the current page.' },
    { name: 'Breadcrumb.onPress', type: '() => void', description: 'Handler for client-side routing.' },
    { name: 'Breadcrumb.icon', type: 'ReactNode', description: 'Leading icon, 6px gap.' },
    { name: 'Breadcrumb.separator', type: 'ReactNode', default: 'Chevron', description: 'Custom separator.' },
    { name: 'className / style / xstyle', type: 'string / CSSProperties / StyleXStyles', description: 'Overrides.' },
  ],
  related: ['tabs', 'navbar', 'sidebar', 'link'],
};
export default page;
