import { ChartCard, EmptyState, SankeyChart, Skeleton } from 'oniva-ui';
import type { DocPage } from '../types';

const nodes = [
  { id: 'search', label: 'Search' },
  { id: 'social', label: 'Social' },
  { id: 'direct', label: 'Direct' },
  { id: 'landing', label: 'Landing page' },
  { id: 'docs', label: 'Docs' },
  { id: 'signup', label: 'Signup' },
  { id: 'bounce', label: 'Bounced' },
  { id: 'paid', label: 'Paid plan' },
  { id: 'free', label: 'Free plan' },
];
const links = [
  { source: 'search', target: 'landing', value: 420 },
  { source: 'search', target: 'docs', value: 260 },
  { source: 'social', target: 'landing', value: 210 },
  { source: 'direct', target: 'landing', value: 180 },
  { source: 'direct', target: 'docs', value: 90 },
  { source: 'landing', target: 'signup', value: 310 },
  { source: 'landing', target: 'bounce', value: 500 },
  { source: 'docs', target: 'signup', value: 160 },
  { source: 'docs', target: 'bounce', value: 190 },
  { source: 'signup', target: 'paid', value: 120 },
  { source: 'signup', target: 'free', value: 350 },
];

const Stage = () => (
  <div style={{ width: 640 }}>
    <ChartCard title="Acquisition flow" value="1,360" unit="sessions">
      <SankeyChart nodes={nodes} links={links} height={340} />
    </ChartCard>
  </div>
);

const Shape = () => (
  <div style={{ display: 'grid', gap: 12 }}>
    <pre tabIndex={0} style={{ margin: 0, padding: 12, borderRadius: 10, overflow: 'auto', fontSize: 12.5, lineHeight: '18px', background: 'var(--oniva-color-surface-inset)', color: 'var(--oniva-color-text)' }}>
      <code>{"interface SankeyNodeInput { id: string; label?: string; tone?: number }\ninterface SankeyLinkInput { source: string; target: string; value: number }\n\nnodes = [{ id: 'search', label: 'Search' }, { id: 'landing', label: 'Landing page' }]\nlinks = [{ source: 'search', target: 'landing', value: 420 }]\n// <SankeyChart nodes={nodes} links={links} />"}</code>
    </pre>
    <ul style={{ margin: 0, paddingInlineStart: 18, display: 'grid', gap: 4, fontSize: 14, lineHeight: '20px' }}>
      <li>{"source and target are node ids, not labels."}</li>
      <li>{"Columns are computed from the links, left to right. No cycles: a node cannot lead back to itself."}</li>
      <li>{"Node height equals the larger of its inflow and outflow, so inflow and outflow should match."}</li>
      <li>{"tone defaults to position in the nodes array (1 to 10, wrapping)."}</li>
    </ul>
  </div>
);

const page: DocPage = {
  slug: "sankey-chart",
  status: 'Stable',
  version: '0.1.0',
  importName: "SankeyChart",
  group: ['Components', 'Charts'],
  sourcePath: "charts/SankeyChart",
  lede: "Flows between stages, with link width proportional to volume. It handles journeys with branching: where traffic comes from, where it goes, and where it leaves.",
  anatomy: {
    intro: "Four parts. Nodes, links and node labels are always present. Each link blends the source node color into the target node color, and its tooltip appears on hover and focus.",
    Render: Stage,
    parts: [
      { name: "Node", description: "12px wide rounded bar. Height is the node total. 16px vertical padding between nodes in a column.", selector: "svg[role=\"group\"] > g:not([aria-hidden]) rect" },
      { name: "Link", description: "Curved band from source to target. Stroke width equals the flow value. Gradient from source tone to target tone. 50% opacity, 85% on hover or focus.", selector: "svg[role=\"group\"] > path" },
      { name: "Node label", description: "11px label to the right of the last column, inside a 96px reserved margin.", selector: "svg[role=\"group\"] text" },
      { name: "Plot", description: "340px tall by default. Layout from d3-sankey with an 8px pad.", selector: "svg[role=\"group\"]" },
    ],
  },
  usage: {
    use: ["Journeys with branching: sources to pages to outcomes.","Budget or resource allocation from sources to sinks.","Seeing the biggest paths at a glance across 3 to 4 columns."],
    avoid: [
      { text: "A single linear drop-off.", instead: { slug: "funnel-chart", label: "FunnelChart" } },
      { text: "Comparing a few categories.", instead: { slug: "bar-chart", label: "BarChart" } },
      { text: "Data with cycles or backward flow.", instead: { slug: "bar-chart", label: "BarChart" } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'valueFormat', label: 'Format', options: ['number', 'compact'] },
      { kind: 'number', key: 'height', label: 'Height (px)', min: 240, max: 440, step: 20 },
      { kind: 'toggle', key: 'tones', label: 'Custom node tones' },
    ],
    initial: { valueFormat: 'number', height: 340, tones: false },
    render: (p) => (
      <div style={{ width: 'min(640px, 100%)' }}><SankeyChart nodes={p.tones ? nodes.map((n, i) => ({ ...n, tone: (i % 3) * 3 + 1 })) : nodes} links={links} valueFormat={p.valueFormat as 'number'} height={Number(p.height)} /></div>
    ),
    code: (p) => {
      const attrs = [p.valueFormat !== 'number' && `valueFormat="${p.valueFormat}"`, p.height !== 340 && `height={${p.height}}`].filter(Boolean).join(' ');
      return `<SankeyChart nodes={nodes} links={links}${attrs ? ' ' + attrs : ''} />`;
    },
  },
  states: [
    { name: "Default", description: "Nodes colored by position in the palette.", Render: () => (
      <div style={{ width: 600 }}><SankeyChart nodes={nodes} links={links} height={300} /></div>
    ) },
    { name: "Two columns", description: "A simple source to outcome split.", Render: () => (
      <div style={{ width: 600 }}><SankeyChart nodes={[{ id: 'a', label: 'Search' }, { id: 'b', label: 'Direct' }, { id: 'c', label: 'Signup' }, { id: 'd', label: 'Bounce' }]} links={[{ source: 'a', target: 'c', value: 140 }, { source: 'a', target: 'd', value: 260 }, { source: 'b', target: 'c', value: 90 }, { source: 'b', target: 'd', value: 80 }]} height={220} /></div>
    ) },
    { name: "Compact values", description: "valueFormat=\"compact\" for large flows.", Render: () => (
      <div style={{ width: 600 }}><SankeyChart nodes={nodes} links={links.map((l) => ({ ...l, value: l.value * 100 }))} valueFormat="compact" height={300} /></div>
    ) },
    { name: "Loading", description: "Skeleton at the chart height. The chart is not mounted until data exists.", Render: () => (
<ChartCard title="Acquisition flow"><Skeleton variant="rect" width="100%" height={340} /></ChartCard>
    ) },
    { name: "Empty", description: "No data in range. Say why and offer a way out. The chart is not mounted.", Render: () => (
<ChartCard title="Acquisition flow"><EmptyState title="No data for this range" description="Pick a longer period or check that the source is connected." /></ChartCard>
    ) },
    { name: "Single point", description: "One link between two nodes is a single band. Show it as a number with an arrow.", Render: () => (
      <div style={{ width: 400 }}><SankeyChart nodes={[{ id: 'a', label: 'Search' }, { id: 'b', label: 'Signup' }]} links={[{ source: 'a', target: 'b', value: 120 }]} height={160} /></div>
    ) },
  ],
  sections: [
    {
      type: 'text', id: 'choosing-a-chart', title: 'Choosing a chart',
      body: (<p style={{ margin: 0 }}>Use a Sankey diagram when quantities split and merge between stages. See the full decision table on <a href="#/components/bar-chart">Bar chart</a>.</p>),
    },
    { type: 'custom', id: 'data-shape', title: 'Data shape', Render: Shape },
    {
      type: 'rules', id: 'formatting', title: 'Axes, labels and numbers',
      items: [
        { title: "Tabular numerals", body: "Axis labels (11px, medium, muted), tooltip values and legend values use tabular-nums, so digits stay in place when values change." },
        { title: "Plain numbers beat percents", body: "Flow values are absolute, formatted with valueFormat. Show totals in the card title, not as percents on links." },
        { title: "Label length", body: "Node labels live in a 96px margin at 11px. Keep labels under 14 characters or they clip." },
        { title: "Tooltip shows From to To", body: "The title reads \"Search → Landing page\" with the formatted flow." },
        { title: "Units belong in the format", body: "Use valueFormat=\"currency\", \"percent\" or a function such as (n) => `${n} ms`. Never concatenate units into category labels." },
      ],
    },
    {
      type: 'rules', id: 'color-and-palette', title: 'Color and palette',
      items: [
        { title: "Ten chart tokens", body: "--oniva-color-chart-1 to --oniva-color-chart-10 are fixed hues, independent of the accent. Pick by position or pass tone (1-based). Tone wraps after 10." },
        { title: "Color by node", body: "Each node takes a palette tone by position. A link blends source and target tone." },
        { title: "Nine nodes, nine colors", body: "Past ten nodes colors repeat. Pass tone to group nodes (all outcomes in one hue)." },
        { title: "Links are translucent", body: "Links render at 50% opacity so overlaps stay readable. Hover or focus raises one link to 85%." },
        { title: "Color-blind safe", body: "Every mark is at least 3:1 on white. In the light palette, series 1 to 10 stay at least 3.3 delta E apart under protanopia, deuteranopia and tritanopia simulation. Do not rely on that alone: label series in the legend or tooltip." },
        { title: "Track and grid", body: "Empty tracks and gridlines use --oniva-color-chart-track. The hover band uses --oniva-color-chart-cursor." },
      ],
    },
    {
      type: 'rules', id: 'keyboard-exploration', title: 'Keyboard exploration',
      intro: "Tab to the chart, then use the arrow keys to step through each flow. Each stop opens its tooltip.",
      items: [
        { title: 'One tab stop', body: 'The chart is a single focusable group (tabindex 0). Tab enters it once and the next Tab leaves it, so a page with six charts costs six tab stops, not hundreds.' },
        { title: 'Arrows move between flows', body: "Right and Down move to the next flow (link) in data order, Left and Up to the previous. Home and End jump to the first and last. Each stop opens a tooltip with source, target and value." },
        { title: 'Focus shows the tooltip', body: 'Moving focus opens the same tooltip as hover, anchored to the focused mark. Esc closes it without moving focus. The focused mark gets a 2px focus ring, 2px offset.' },
      ],
    },
    {
      type: 'rules', id: 'empty-loading-single', title: 'Empty, loading and single-point states',
      intro: "The chart does not draw its own placeholder. Decide before you mount it.",
      items: [
        { title: "Loading", body: "Render a Skeleton at the same height (340px here) so the card does not jump. Mount the chart when data arrives so the entrance animation plays once." },
        { title: "Empty", body: "Use EmptyState inside the ChartCard. Name the cause (No orders in this range) and give one action. Do not render an empty plot with axes." },
        { title: "One point", body: "One link draws one band between two nodes. A flow diagram needs at least two branches to be worth the space." },
      ],
    },
    {
      type: 'rules', id: 'motion', title: 'Motion',
      items: [
        { title: "Entrance", body: "Links and nodes fade in together over 400ms. There is no draw-in, so large diagrams stay calm." },
        { title: "Data updates", body: "Sankey does not tween. Changing nodes or links re-runs the layout and the new diagram replaces the old one." },
        { title: "Reduced motion", body: "With prefers-reduced-motion the entrance animation is removed (animation-name none) and value tweens jump straight to the final value. Tooltip movement drops to 0.01ms." },
      ],
    },

  ],
  content: { rules: [
    { title: "Node labels are nouns", body: "Search, Landing page, Paid plan." },
    { title: "Title names the journey", body: "Acquisition flow, Budget allocation." },
    { title: "Totals in the card", body: "Say what the left edge sums to: 1,360 sessions." },
  ] },
  accessibility: {
    keyboard: [
      { keys: ["Tab"], action: "Moves focus into the chart, then out to the next control. The chart is one tab stop." },
      { keys: ["→","↓"], action: "Moves focus to the next flow. In right-to-left layouts → and ← swap." },
      { keys: ["←","↑"], action: "Moves focus to the previous flow." },
      { keys: ["Home","End"], action: "Jumps to the first or last flow." },
      { keys: ["Esc"], action: "Closes the tooltip. Focus stays where it is." },
    ],
    notes: ["The diagram is an svg with role=\"group\" and a label such as \"Flow diagram with 9 nodes and 11 flows\".","Each link is a role=\"graphics-symbol\" stop labeled \"Search to Landing page: 420\".","A visually hidden table lists From, To and Value for every link.","Nodes are decorative; the data lives in the links and the table."],
    reducedMotion: "Entrance animation is removed and value tweens jump to the final value. Tooltip movement drops to 0.01ms.",
  },
  props: [
    { name: "nodes", type: "SankeyNodeInput[]", description: "Nodes: id, optional label and tone." },
    { name: "links", type: "SankeyLinkInput[]", description: "Flows: source id, target id, value." },
    { name: "valueFormat", type: "ValueFormat", default: "'number'", description: "'number', 'compact', 'currency' (USD, no decimals), 'percent' or a function." },
    { name: "height", type: "number", default: "340", description: "Plot height in px." },
    { name: "label", type: "string", description: "Accessible summary of the chart." },
    { name: "xstyle", type: "StyleXStyles", description: "StyleX overrides for the wrapper." },
  ],
  related: ["funnel-chart","bar-chart","chart-tooltip","chart-card","stage-bars"],
};
export default page;
