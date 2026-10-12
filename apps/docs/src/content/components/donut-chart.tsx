import { ChartCard, ChartLegend, DonutChart, EmptyState, PieChart, Skeleton } from 'oniva-ui';
import type { DocPage } from '../types';

const sources = [
  { label: 'Organic search', value: 18420, tone: 1 },
  { label: 'Direct', value: 11260, tone: 4 },
  { label: 'Referral', value: 7840, tone: 3 },
  { label: 'Social', value: 4310, tone: 6 },
  { label: 'Email', value: 2970, tone: 5 },
];

const Stage = () => (
  <div style={{ alignItems: 'center', display: 'flex', gap: 24 }}>
    <DonutChart data={sources} size={200} />
    <ChartLegend orientation="vertical" items={sources.map((s) => ({ label: s.label, tone: s.tone, value: s.value.toLocaleString('en-US') }))} />
  </div>
);

const Shape = () => (
  <div style={{ display: 'grid', gap: 12 }}>
    <pre tabIndex={0} style={{ margin: 0, padding: 12, borderRadius: 10, overflow: 'auto', fontSize: 12.5, lineHeight: '18px', background: 'var(--oniva-color-surface-inset)', color: 'var(--oniva-color-text)' }}>
      <code>{"interface DonutSlice {\n  label: string;\n  value: number;  // raw amount, not a percentage\n  tone?: number;  // 1 to 10, defaults to position + 1\n}\n\n[\n  { label: 'Organic search', value: 18420 },\n  { label: 'Direct', value: 11260 },\n]\n// <DonutChart data={data} centerLabel=\"Sessions\" />  // PieChart takes the same props"}</code>
    </pre>
    <ul style={{ margin: 0, paddingInlineStart: 18, display: 'grid', gap: 4, fontSize: 14, lineHeight: '20px' }}>
      <li>{"Pass raw values. Shares are computed from the total."}</li>
      <li>{"Slices keep data order and start at 12 o'clock, clockwise. Sort largest first yourself."}</li>
      <li>{"The total is the sum of all values. Zero or negative values draw nothing."}</li>
      <li>{"Pass 2 to 5 slices. Past five, group the tail into Other."}</li>
    </ul>
  </div>
);

const page: DocPage = {
  slug: "donut-chart",
  status: 'Stable',
  version: '0.1.0',
  importName: "DonutChart",
  group: ['Components', 'Charts'],
  sourcePath: "charts/DonutChart",
  lede: "A ring split into slices for parts of one whole. It handles composition at a glance: the share of each part and the total in the centre.",
  anatomy: {
    intro: "Four parts. The ring and slices are always present. The center label is optional (donut only) and the legend comes from ChartLegend.",
    Render: Stage,
    parts: [
      { name: "Slice", description: "Arc with rounded corners (up to 8px) and a 3px gap between neighbours. Ring thickness is 32% of the radius by default.", selector: "svg[role=\"group\"] path" },
      { name: "Ring", description: "200px diameter by default. The ring sweeps in clockwise over 700ms when it scrolls into view.", selector: "svg[role=\"group\"]" },
      { name: "Center value", description: "The total, 24px-style semibold with tabular numerals, rolling via AnimatedNumber. Override with centerValue.", selector: "div > span:first-of-type", fallback: { x: 50, y: 45 } },
      { name: "Center label", description: "Caption under the value. Defaults to Total.", selector: "div > span:nth-of-type(2)", fallback: { x: 50, y: 60 } },
      { name: "Legend", description: "Vertical ChartLegend with values: 10px swatches, 13px labels, values right-aligned and tabular.", selector: "ul" },
    ],
  },
  usage: {
    use: ["Composition of one whole: traffic sources, spend by category, plan mix.","Five slices or fewer, with a clear largest slice.","A total that deserves the center: orders, revenue, seats."],
    avoid: [
      { text: "Comparing exact values across many categories.", instead: { slug: "bar-chart", label: "BarChart" } },
      { text: "More than five parts or tiny slices under 3%.", instead: { slug: "bar-list", label: "BarList" } },
      { text: "One percentage against a goal.", instead: { slug: "gauge", label: "Gauge" } },
      { text: "Progress toward several goals.", instead: { slug: "activity-rings", label: "ActivityRings" } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'variant', label: 'Variant', options: ['donut', 'pie'] },
      { kind: 'number', key: 'size', label: 'Size (px)', min: 120, max: 280, step: 20 },
      { kind: 'number', key: 'thickness', label: 'Thickness (%)', min: 10, max: 60, step: 5 },
      { kind: 'number', key: 'gap', label: 'Gap (px)', min: 0, max: 8, step: 1 },
      { kind: 'segmented', key: 'valueFormat', label: 'Format', options: ['number', 'compact', 'currency'] },
      { kind: 'text', key: 'centerLabel', label: 'Center label', presets: ['Total', 'Sessions', 'Visits'] },
    ],
    initial: { variant: 'donut', size: 200, thickness: 32, gap: 3, valueFormat: 'number', centerLabel: 'Sessions' },
    render: (p) => (
      <DonutChart data={sources} variant={p.variant as 'donut'} size={Number(p.size)} thickness={Number(p.thickness) / 100} gap={Number(p.gap)} valueFormat={p.valueFormat as 'number'} centerLabel={String(p.centerLabel)} />
    ),
    code: (p) => {
      const attrs = [p.variant === 'pie' && 'variant="pie"', p.size !== 200 && `size={${p.size}}`, p.thickness !== 32 && `thickness={${Number(p.thickness) / 100}}`, p.gap !== 3 && `gap={${p.gap}}`, p.valueFormat !== 'number' && `valueFormat="${p.valueFormat}"`, p.centerLabel !== 'Total' && `centerLabel="${p.centerLabel}"`].filter(Boolean).join(' ');
      return `<DonutChart data={sources}${attrs ? ' ' + attrs : ''} />`;
    },
  },
  states: [
    { name: "Donut", description: "Default. Total in the centre.", Render: () => (
      <DonutChart data={sources} size={180} />
    ) },
    { name: "Pie", description: "PieChart fills the centre. No centre text.", Render: () => (
      <PieChart data={sources} size={180} />
    ) },
    { name: "Custom center", description: "centerValue and centerLabel replace the total.", Render: () => (
      <DonutChart data={sources} size={180} centerValue="62%" centerLabel="Organic + direct" />
    ) },
    { name: "Thin ring", description: "thickness 0.18 reads lighter next to dense text.", Render: () => (
      <DonutChart data={sources} size={180} thickness={0.18} gap={4} />
    ) },
    { name: "Currency", description: "valueFormat styles the total and tooltip values.", Render: () => (
      <DonutChart data={sources} size={180} valueFormat="compact" centerLabel="Visits" />
    ) },
    { name: "Loading", description: "Skeleton at the chart height. The chart is not mounted until data exists.", Render: () => (
<ChartCard title="Traffic sources"><Skeleton variant="rect" width="100%" height={220} /></ChartCard>
    ) },
    { name: "Empty", description: "No data in range. Say why and offer a way out. The chart is not mounted.", Render: () => (
<ChartCard title="Traffic sources"><EmptyState title="No data for this range" description="Pick a longer period or check that the source is connected." /></ChartCard>
    ) },
    { name: "Single point", description: "One slice is a full ring. It still works, but a single number says the same.", Render: () => (
      <DonutChart data={sources.slice(0, 1)} size={180} centerLabel="Organic only" />
    ) },
  ],
  sections: [
    {
      type: 'text', id: 'choosing-a-chart', title: 'Choosing a chart',
      body: (<p style={{ margin: 0 }}>Use a donut chart to show how one total divides into a few parts. See the full decision table on <a href="#/components/bar-chart">Bar chart</a>.</p>),
    },
    { type: 'custom', id: 'data-shape', title: 'Data shape', Render: Shape },
    {
      type: 'rules', id: 'formatting', title: 'Axes, labels and numbers',
      items: [
        { title: "Tabular numerals", body: "Axis labels (11px, medium, muted), tooltip values and legend values use tabular-nums, so digits stay in place when values change." },
        { title: "Percent in the tooltip, value in the center", body: "The tooltip shows the value and the rounded share (31%). The center shows the total using valueFormat." },
        { title: "Round shares, never decimals", body: "Shares round to whole percents, so five slices can sum to 99 or 101. Do not add decimals to hide it." },
        { title: "Center text is short", body: "A number of 6 characters or fewer and a one-word caption fit a 200px donut. Use compact for large totals." },
        { title: "Units belong in the format", body: "Use valueFormat=\"currency\", \"percent\" or a function such as (n) => `${n} ms`. Never concatenate units into category labels." },
      ],
    },
    {
      type: 'rules', id: 'color-and-palette', title: 'Color and palette',
      items: [
        { title: "Ten chart tokens", body: "--oniva-color-chart-1 to --oniva-color-chart-10 are fixed hues, independent of the accent. Pick by position or pass tone (1-based). Tone wraps after 10." },
        { title: "Largest slice first", body: "Tone 1 on the biggest slice, then step through the palette. Adjacent slices always differ in hue." },
        { title: "Five slices", body: "Stay at five or fewer. The ring has no pattern fills, so color is the only separator; add values in the legend." },
        { title: "Gap carries separation", body: "The 3px gap separates slices where two similar hues touch, helping color-blind readers." },
        { title: "Color-blind safe", body: "Every mark is at least 3:1 on white. In the light palette, series 1 to 10 stay at least 3.3 delta E apart under protanopia, deuteranopia and tritanopia simulation. Do not rely on that alone: label series in the legend or tooltip." },
        { title: "Track and grid", body: "Empty tracks and gridlines use --oniva-color-chart-track. The hover band uses --oniva-color-chart-cursor." },
      ],
    },
    {
      type: 'rules', id: 'keyboard-exploration', title: 'Keyboard exploration',
      intro: "Tab to the chart, then use the arrow keys to step through each slice. Each stop opens its tooltip.",
      items: [
        { title: 'One tab stop', body: 'The chart is a single focusable group (tabindex 0). Tab enters it once and the next Tab leaves it, so a page with six charts costs six tab stops, not hundreds.' },
        { title: 'Arrows move between slices', body: "Right and Down move to the next slice, Left and Up to the previous one, in data order. Home and End jump to the first and last." },
        { title: 'Focus shows the tooltip', body: 'Moving focus opens the same tooltip as hover, anchored to the focused mark. Esc closes it without moving focus. The focused mark gets a 2px focus ring, 2px offset.' },
      ],
    },
    {
      type: 'rules', id: 'empty-loading-single', title: 'Empty, loading and single-point states',
      intro: "The chart does not draw its own placeholder. Decide before you mount it.",
      items: [
        { title: "Loading", body: "Render a Skeleton at the same height (220px here) so the card does not jump. Mount the chart when data arrives so the entrance animation plays once." },
        { title: "Empty", body: "Use EmptyState inside the ChartCard. Name the cause (No orders in this range) and give one action. Do not render an empty plot with axes." },
        { title: "One point", body: "One slice draws a complete ring in one color. That communicates 100% only. Show the number and label instead." },
      ],
    },
    {
      type: 'rules', id: 'motion', title: 'Motion',
      items: [
        { title: "Entrance", body: "The ring sweeps clockwise from 12 o'clock over 700ms when 15% is in view. Slices are clipped to the sweep angle, so one slice does not finish before the sweep reaches it." },
        { title: "Data updates", body: "Changing values tweens each slice over 500ms (ease-out quart) and re-normalises angles every frame, so slices glide between periods. A change in slice count snaps." },
        { title: "Reduced motion", body: "With prefers-reduced-motion the entrance animation is removed (animation-name none) and value tweens jump straight to the final value. Tooltip movement drops to 0.01ms." },
      ],
    },

  ],
  content: { rules: [
    { title: "Slice labels are nouns", body: "Organic search, Direct. Under 20 characters." },
    { title: "Center caption names the total", body: "Sessions, Orders. One word." },
    { title: "Title says the whole", body: "Traffic sources, not Donut chart." },
  ] },
  accessibility: {
    keyboard: [
      { keys: ["Tab"], action: "Moves focus into the chart, then out to the next control. The chart is one tab stop." },
      { keys: ["→","↓"], action: "Moves focus to the next slice. In right-to-left layouts → and ← swap." },
      { keys: ["←","↑"], action: "Moves focus to the previous slice." },
      { keys: ["Home","End"], action: "Jumps to the first or last slice." },
      { keys: ["Esc"], action: "Closes the tooltip. Focus stays where it is." },
    ],
    notes: ["The ring is an svg with role=\"group\", aria-roledescription=\"chart\" and a label such as \"Donut chart: Organic search 18,420, Direct 11,260\".","Each slice is role=\"graphics-symbol\" with a label like \"Direct: 11,260 (24%)\".","A visually hidden table lists Slice, Value and Share.","The center text is in the DOM, so it is read after the chart."],
    reducedMotion: "Entrance animation is removed and value tweens jump to the final value. Tooltip movement drops to 0.01ms.",
  },
  props: [
    { name: "data", type: "DonutSlice[]", description: "Slices: label, value, optional tone." },
    { name: "variant", type: "'donut' | 'pie'", default: "'donut'", description: "pie fills the center. PieChart is the same component with variant pie." },
    { name: "size", type: "number", default: "200", description: "Diameter in px." },
    { name: "thickness", type: "number", default: "0.32", description: "Ring thickness as a fraction of the radius." },
    { name: "gap", type: "number", default: "3", description: "Gap between slices in px." },
    { name: "valueFormat", type: "ValueFormat", default: "'number'", description: "'number', 'compact', 'currency' (USD, no decimals), 'percent' or a function." },
    { name: "centerValue", type: "ReactNode", description: "Replaces the total in the center (donut only)." },
    { name: "centerLabel", type: "ReactNode", default: "'Total'", description: "Caption under the center value." },
    { name: "label", type: "string", description: "Accessible summary of the chart." },
    { name: "xstyle", type: "StyleXStyles", description: "StyleX overrides for the wrapper." },
  ],
  related: ["bar-chart","bar-list","radial-chart","gauge","chart-legend"],
};
export default page;
