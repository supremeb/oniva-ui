import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardHeaderText, CardTitle, Tile } from 'oniva-ui';
import type { DocPage } from '../types';

const Demo = ({ variant = 'inset', padding = 'md', title = 'Monthly revenue', footer = true }: { variant?: 'inset' | 'outline'; padding?: 'none' | 'sm' | 'md' | 'lg'; title?: string; footer?: boolean }) => (
  <div style={{ width: 360 }}>
    <Card data-part="card" variant={variant}>
      <CardHeader>
        <CardHeaderText>
          <CardTitle>{title}</CardTitle>
          <CardDescription>October 2026, all regions</CardDescription>
        </CardHeaderText>
      </CardHeader>
      <CardContent>
        <Tile padding={padding}><strong style={{ fontSize: 24 }}>$48,210</strong><div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13 }}>Up 8.2% vs. September</div></Tile>
      </CardContent>
      {footer && <CardFooter><Button size="sm" variant="secondary">View report</Button></CardFooter>}
    </Card>
  </div>
);

const page: DocPage = {
  slug: 'card',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Card',
  group: ['Components', 'Layout'],
  sourcePath: 'components/Card',
  lede: 'The surface that groups related content. An inset card is a gray outer frame that holds white tiles; an outline card is a single bordered panel.',
  anatomy: {
    intro: 'Six parts. The card and content are always present; header, tile and footer are optional.',
    Render: () => <Demo />,
    parts: [
      { name: 'Card', description: '16px radius. Inset: gray inset surface with 8px padding and 4px gap. Outline: surface fill, 1px border, xs shadow.', selector: '[data-part="card"]' },
      { name: 'Header', description: '6px by 8px padding, 8px gap. Holds title text and optional actions.', selector: '[data-part="card"] > :first-child' },
      { name: 'Title', description: '14px medium. Names the card.', selector: 'h3' },
      { name: 'Description', description: '12px muted line under the title.', selector: 'h3 + p' },
      { name: 'Tile', description: 'White inner panel, 8px radius. padding none, sm (8), md (12, default), lg (16).', selector: 'strong' },
      { name: 'Footer', description: '6px by 8px padding, 8px gap. Actions align here.', selector: 'button' },
    ],
  },
  usage: {
    use: ['Grouping a metric, list or form with a title.', 'Dashboards: one inset card per section, tiles for each metric.', 'Settings panels with a header and footer actions.'],
    avoid: [
      { text: 'Splitting the page into regions without a title.', instead: { slug: 'stack', label: 'Stack' } },
      { text: 'Floating content over the page.', instead: { slug: 'popover', label: 'Popover' } },
      { text: 'A divider between two blocks.', instead: { slug: 'separator', label: 'Separator' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'variant', label: 'Variant', options: ['inset', 'outline'] },
      { kind: 'segmented', key: 'padding', label: 'Tile padding', options: ['none', 'sm', 'md', 'lg'] },
      { kind: 'text', key: 'title', label: 'Title', presets: ['Monthly revenue', 'Open invoices'] },
      { kind: 'toggle', key: 'footer', label: 'Footer' },
    ],
    initial: { variant: 'inset', padding: 'md', title: 'Monthly revenue', footer: true },
    render: (p) => <Demo variant={p.variant as 'inset' | 'outline'} padding={p.padding as 'none' | 'sm' | 'md' | 'lg'} title={String(p.title)} footer={Boolean(p.footer)} />,
    code: (p) => `<Card${p.variant !== 'inset' ? ` variant="${p.variant}"` : ''}>\n  <CardHeader>\n    <CardHeaderText>\n      <CardTitle>${p.title}</CardTitle>\n      <CardDescription>October 2026</CardDescription>\n    </CardHeaderText>\n  </CardHeader>\n  <CardContent>\n    <Tile${p.padding !== 'md' ? ` padding="${p.padding}"` : ''}>…</Tile>\n  </CardContent>${p.footer ? '\n  <CardFooter>…</CardFooter>' : ''}\n</Card>`,
  },
  states: [
    { name: 'Inset', description: 'Gray frame with a white tile.', Render: () => <Demo /> },
    { name: 'Outline', description: 'Bordered surface with a subtle shadow.', Render: () => <Demo variant="outline" /> },
    { name: 'Tile padding lg', description: '16px inner padding for hero numbers.', Render: () => <Demo padding="lg" /> },
    { name: 'No footer', description: 'Read-only cards need no actions.', Render: () => <Demo footer={false} /> },
    { name: 'Long title', description: 'Wraps; keep titles under 40 characters.', Render: () => <Demo title="Monthly recurring revenue across all regions and plans" /> },
  ],
  sections: [
    { type: 'rules', id: 'card-recipes', title: 'Composition recipes', items: [{ title: 'Metric grid', body: 'Grid minColumnWidth=240 of Cards, each with one Tile.' }, { title: 'Form card', body: 'Outline card, fields in CardContent, Save and Cancel in CardFooter.' }, { title: 'Nested cards', body: 'Do not nest a Card in a Card. Use Tiles inside.' }] },
    { type: 'dodont', id: 'card-dodont', title: 'Do and don\'t', items: [{ kind: 'do', caption: 'One title per card, then tiles for details.', text: 'Revenue card → three tiles: MRR, churn, ARPU.' }, { kind: 'dont', caption: 'Do not stack card inside card to create hierarchy.', text: 'Card → Card → Card creates three borders and 24px lost padding.' }] },
  ],
  content: { rules: [{ title: 'Title names the content', body: 'Monthly revenue, not Overview.' }, { title: 'Description gives scope', body: 'Date range or filter. Muted, one line.' }, { title: 'Footer holds one primary action', body: 'View report, Save changes.' }] },
  accessibility: {
    keyboard: [{ keys: ['Tab'], action: 'Cards are not focusable; focus goes to interactive children in DOM order.' }],
    notes: ['A plain div; add role="region" and aria-labelledby the title for landmark cards.', 'CardTitle renders a heading; pick the level that fits your outline.', 'Make a whole card clickable by wrapping the title in a link, not the card in a button.'],
    reducedMotion: 'Cards have no motion.',
  },
  props: [
    { name: 'Card.variant', type: "'inset' | 'outline'", default: "'inset'", description: 'Gray outer frame, or bordered panel.' },
    { name: 'Tile.padding', type: "'none' | 'sm' | 'md' | 'lg'", default: "'md'", description: '0, 8, 12, 16px.' },
    { name: 'CardHeader / CardHeaderText / CardTitle / CardDescription / CardContent / CardFooter', type: 'div or heading props', description: 'Layout parts; accept className and xstyle.' },
    { name: 'className / xstyle', type: 'string / StyleXStyles', description: 'Overrides on every part.' },
  ],
  related: ['grid', 'stack', 'separator', 'kpi-strip'],
};
export default page;
