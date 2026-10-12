import { ChartCard, EmptyState, ScatterChart, Skeleton } from 'oniva-ui';
import type { DocPage } from '../types';

const customers = [
  { name: 'Northwind', orders: 12, spend: 4.2, seats: 40, tier: 'SMB' },
  { name: 'Acme Corp', orders: 34, spend: 12.8, seats: 120, tier: 'Enterprise' },
  { name: 'Globex', orders: 22, spend: 7.5, seats: 64, tier: 'Mid-market' },
  { name: 'Initech', orders: 9, spend: 2.1, seats: 18, tier: 'SMB' },
  { name: 'Umbrella', orders: 41, spend: 18.9, seats: 210, tier: 'Enterprise' },
  { name: 'Hooli', orders: 28, spend: 15.3, seats: 150, tier: 'Enterprise' },
  { name: 'Wonka', orders: 15, spend: 5.9, seats: 36, tier: 'SMB' },
  { name: 'Soylent', orders: 31, spend: 10.2, seats: 96, tier: 'Mid-market' },
];

const Stage = () => (
  <div style={{ width: 520 }}>
    <ChartCard title="Customer spend vs orders">
      <ScatterChart data={customers} xKey="orders" yKey="spend" sizeKey="seats" groupKey="tier" nameKey="name" xLabel="Orders" yLabel="Spend ($K)" sizeLabel="Seats" height={300} />
    </ChartCard>
  </div>
);

const Shape = () => (
  <div style={{ display: 'grid', gap: 12 }}>
    <pre tabIndex={0} style={{ margin: 0, padding: 12, borderRadius: 10, overflow: 'auto', fontSize: 12.5, lineHeight: '18px', background: 'var(--oniva-color-surface-inset)', color: 'var(--oniva-color-text)' }}>
      <code>{"type ChartDatum = Record<string, string | number>;\n// one row per point; you name the fields\n\n[\n  { name: 'Northwind', orders: 12, spend: 4.2, seats: 40, tier: 'SMB' },\n  { name: 'Acme Corp', orders: 34, spend: 12.8, seats: 120, tier: 'Enterprise' },\n]\n// <ScatterChart data={data} xKey=\"orders\" yKey=\"spend\" sizeKey=\"seats\" groupKey=\"tier\" nameKey=\"name\" />"}</code>
    </pre>
    <ul style={{ margin: 0, paddingInlineStart: 18, display: 'grid', gap: 4, fontSize: 14, lineHeight: '20px' }}>
      <li>{"xKey and yKey are required numeric fields. Axes start at 0 and run to a nice maximum."}</li>
      <li>{"sizeKey scales area, not radius, so a point twice the value is twice the area."}</li>
      <li>{"groupKey takes any field. Each distinct value gets the next palette color."}</li>
      <li>{"nameKey titles the tooltip. Without it points are called #1, #2."}</li>
    </ul>
  </div>
);

const page: DocPage = {
  slug: "scatter-chart",
  status: 'Stable',
  version: '0.1.0',
  importName: "ScatterChart",
  group: ['Components', 'Charts'],
  sourcePath: "charts/ScatterChart",
  lede: "Dots on two numeric axes. It handles correlation and outliers, with optional bubble size and color groups.",
  anatomy: {
    intro: "Five parts. The plot, axes and points are always present. Size and group encode a third and fourth variable and are optional.",
    Render: Stage,
    parts: [
      { name: "Plot", description: "Responsive svg, 300px tall. Margins: 52px left, 44px bottom, 16px right, 12px top.", selector: "svg[role=\"group\"]" },
      { name: "Point", description: "Circle, radius 4px minimum. With sizeKey the area scales (sqrt) up to 22px radius.", selector: "svg[role=\"group\"] circle" },
      { name: "Y axis and gridlines", description: "Four nice ticks with dashed gridlines. 11px muted labels.", selector: "svg[role=\"group\"] > g[aria-hidden=\"true\"]:first-of-type text" },
      { name: "Axis titles", description: "xLabel under the x axis and yLabel rotated in the left margin.", selector: "svg[role=\"group\"] text[transform]" },
      { name: "Group colors", description: "groupKey maps each distinct value to chart 1, 2, 3 in order of first appearance.", selector: "svg[role=\"group\"] > circle:nth-of-type(2)" },
    ],
  },
  usage: {
    use: ["Correlation between two measures: spend vs orders.","Finding outliers and clusters across 10 to 200 points.","Bubble charts with a third measure on size."],
    avoid: [
      { text: "A trend over time.", instead: { slug: "line-chart", label: "LineChart" } },
      { text: "Comparing a handful of categories.", instead: { slug: "bar-chart", label: "BarChart" } },
      { text: "A density grid across two dimensions.", instead: { slug: "heatmap", label: "Heatmap" } },
    ],
  },
  playground: {
    controls: [
      { kind: 'toggle', key: 'size', label: 'Size by seats' },
      { kind: 'toggle', key: 'group', label: 'Color by tier' },
      { kind: 'segmented', key: 'yFormat', label: 'Y format', options: ['number', 'compact', 'currency'] },
      { kind: 'number', key: 'height', label: 'Height (px)', min: 220, max: 420, step: 20 },
    ],
    initial: { size: true, group: true, yFormat: 'number', height: 300 },
    render: (p) => (
      <div style={{ width: 'min(520px, 100%)' }}><ScatterChart data={customers} xKey="orders" yKey="spend" sizeKey={p.size ? 'seats' : undefined} groupKey={p.group ? 'tier' : undefined} nameKey="name" xLabel="Orders" yLabel="Spend ($K)" sizeLabel="Seats" yFormat={p.yFormat as 'number'} height={Number(p.height)} /></div>
    ),
    code: (p) => {
      const attrs = [p.size && 'sizeKey="seats"', p.group && 'groupKey="tier"', p.yFormat !== 'number' && `yFormat="${p.yFormat}"`, p.height !== 300 && `height={${p.height}}`].filter(Boolean).join(' ');
      return `<ScatterChart data={customers} xKey="orders" yKey="spend" nameKey="name"${attrs ? ' ' + attrs : ''} />`;
    },
  },
  states: [
    { name: "Scatter", description: "Uniform dots, no groups.", Render: () => (
      <div style={{ width: 460 }}><ScatterChart data={customers} xKey="orders" yKey="spend" nameKey="name" xLabel="Orders" yLabel="Spend ($K)" height={240} /></div>
    ) },
    { name: "Bubble", description: "sizeKey scales the area of each dot.", Render: () => (
      <div style={{ width: 460 }}><ScatterChart data={customers} xKey="orders" yKey="spend" sizeKey="seats" nameKey="name" xLabel="Orders" yLabel="Spend ($K)" sizeLabel="Seats" height={240} /></div>
    ) },
    { name: "Grouped", description: "groupKey assigns one palette color per tier.", Render: () => (
      <div style={{ width: 460 }}><ScatterChart data={customers} xKey="orders" yKey="spend" groupKey="tier" nameKey="name" xLabel="Orders" yLabel="Spend ($K)" height={240} /></div>
    ) },
    { name: "Loading", description: "Skeleton at the chart height. The chart is not mounted until data exists.", Render: () => (
<ChartCard title="Customer spend vs orders"><Skeleton variant="rect" width="100%" height={300} /></ChartCard>
    ) },
    { name: "Empty", description: "No data in range. Say why and offer a way out. The chart is not mounted.", Render: () => (
<ChartCard title="Customer spend vs orders"><EmptyState title="No data for this range" description="Pick a longer period or check that the source is connected." /></ChartCard>
    ) },
    { name: "Single point", description: "One dot has no relationship to show. Axes scale to its value.", Render: () => (
      <div style={{ width: 460 }}><ScatterChart data={customers.slice(0, 1)} xKey="orders" yKey="spend" nameKey="name" xLabel="Orders" yLabel="Spend ($K)" height={220} /></div>
    ) },
  ],
  sections: [
    {
      type: 'text', id: 'choosing-a-chart', title: 'Choosing a chart',
      body: (<p style={{ margin: 0 }}>Use a scatter chart when you want to see whether two measures move together. See the full decision table on <a href="#/components/bar-chart">Bar chart</a>.</p>),
    },
    { type: 'custom', id: 'data-shape', title: 'Data shape', Render: Shape },
    {
      type: 'rules', id: 'formatting', title: 'Axes, labels and numbers',
      items: [
        { title: "Tabular numerals", body: "Axis labels (11px, medium, muted), tooltip values and legend values use tabular-nums, so digits stay in place when values change." },
        { title: "Two formats", body: "xFormat and yFormat style the axes and tooltip rows independently. Axis ticks compact automatically." },
        { title: "Name the axes", body: "xLabel and yLabel appear in the plot and tooltip. Include units: Spend ($K)." },
        { title: "Axes start at zero", body: "Both axes begin at 0. Outliers stretch the range; consider a log scale outside this component." },
        { title: "Units belong in the format", body: "Use valueFormat=\"currency\", \"percent\" or a function such as (n) => `${n} ms`. Never concatenate units into category labels." },
      ],
    },
    {
      type: 'rules', id: 'color-and-palette', title: 'Color and palette',
      items: [
        { title: "Ten chart tokens", body: "--oniva-color-chart-1 to --oniva-color-chart-10 are fixed hues, independent of the accent. Pick by position or pass tone (1-based). Tone wraps after 10." },
        { title: "Groups, not gradients", body: "Color encodes category (groupKey), size encodes magnitude. Do not encode two measures in color." },
        { title: "Three groups", body: "Keep to three or four groups. Overlapping dots of similar hue are hard to separate." },
        { title: "Overplotting", body: "Overlapping dots hide each other. Keep point counts under about 200 and let hover or arrow keys reveal each one." },
        { title: "Color-blind safe", body: "Every mark is at least 3:1 on white. In the light palette, series 1 to 10 stay at least 3.3 delta E apart under protanopia, deuteranopia and tritanopia simulation. Do not rely on that alone: label series in the legend or tooltip." },
        { title: "Track and grid", body: "Empty tracks and gridlines use --oniva-color-chart-track. The hover band uses --oniva-color-chart-cursor." },
      ],
    },
    {
      type: 'rules', id: 'keyboard-exploration', title: 'Keyboard exploration',
      intro: "Tab to the chart, then use the arrow keys to step through each point. Each stop opens its tooltip.",
      items: [
        { title: 'One tab stop', body: 'The chart is a single focusable group (tabindex 0). Tab enters it once and the next Tab leaves it, so a page with six charts costs six tab stops, not hundreds.' },
        { title: 'Arrows move between points', body: "Right and Down move to the next point, Left and Up to the previous one, in data order. Home and End jump to the first and last." },
        { title: 'Focus shows the tooltip', body: 'Moving focus opens the same tooltip as hover, anchored to the focused mark. Esc closes it without moving focus. The focused mark gets a 2px focus ring, 2px offset.' },
      ],
    },
    {
      type: 'rules', id: 'empty-loading-single', title: 'Empty, loading and single-point states',
      intro: "The chart does not draw its own placeholder. Decide before you mount it.",
      items: [
        { title: "Loading", body: "Render a Skeleton at the same height (300px here) so the card does not jump. Mount the chart when data arrives so the entrance animation plays once." },
        { title: "Empty", body: "Use EmptyState inside the ChartCard. Name the cause (No orders in this range) and give one action. Do not render an empty plot with axes." },
        { title: "One point", body: "One point sits on axes scaled to itself, so it says nothing about a relationship. Show it as a KPI. Aim for 10 or more points before a scatter is useful." },
      ],
    },
    {
      type: 'rules', id: 'motion', title: 'Motion',
      items: [
        { title: "Entrance", body: "Points pop in over 350ms (scale from 0). Released when 15% is in view." },
        { title: "Data updates", body: "Changing the data tweens existing values over 400ms (ease-out quart) instead of replacing the marks. If the number of rows changes, the chart snaps to the new data." },
        { title: "Reduced motion", body: "With prefers-reduced-motion the entrance animation is removed (animation-name none) and value tweens jump straight to the final value. Tooltip movement drops to 0.01ms." },
      ],
    },

  ],
  content: { rules: [
    { title: "Axis titles carry units", body: "Orders, Spend ($K). Under 18 characters." },
    { title: "Point names are real names", body: "Acme Corp, not row 2." },
    { title: "Title names the relationship", body: "Customer spend vs orders." },
  ] },
  accessibility: {
    keyboard: [
      { keys: ["Tab"], action: "Moves focus into the chart, then out to the next control. The chart is one tab stop." },
      { keys: ["→","↓"], action: "Moves focus to the next point. In right-to-left layouts → and ← swap." },
      { keys: ["←","↑"], action: "Moves focus to the previous point." },
      { keys: ["Home","End"], action: "Jumps to the first or last point." },
      { keys: ["Esc"], action: "Closes the tooltip. Focus stays where it is." },
    ],
    notes: ["The plot is an svg with role=\"group\" and a label like \"Bubble chart of Spend against Orders, 8 points\".","Each point is a role=\"graphics-symbol\" stop with name and values.","A visually hidden table lists name, x, y and size.","Arrow keys follow data order, not screen position, so sort data by x for a left-to-right reading."],
    reducedMotion: "Entrance animation is removed and value tweens jump to the final value. Tooltip movement drops to 0.01ms.",
  },
  props: [
    { name: "data", type: "ChartDatum[]", description: "Rows. Each row has the index field and one numeric field per series." },
    { name: "xKey", type: "string", description: "Numeric field for the x axis." },
    { name: "yKey", type: "string", description: "Numeric field for the y axis." },
    { name: "sizeKey", type: "string", description: "Numeric field mapped to bubble area." },
    { name: "groupKey", type: "string", description: "Field that picks the palette color." },
    { name: "nameKey", type: "string", description: "Field used as the point name in tooltips." },
    { name: "xLabel / yLabel", type: "string", description: "Axis titles." },
    { name: "xFormat / yFormat", type: "ValueFormat", default: "'number'", description: "Axis and tooltip formats." },
    { name: "sizeLabel", type: "string", description: "Tooltip name for the size value." },
    { name: "height", type: "number", default: "300", description: "Plot height in px." },
    { name: "label", type: "string", description: "Accessible summary of the chart." },
    { name: "xstyle", type: "StyleXStyles", description: "StyleX overrides for the wrapper." },
  ],
  related: ["line-chart","heatmap","bar-chart","chart-tooltip","chart-card"],
};
export default page;
