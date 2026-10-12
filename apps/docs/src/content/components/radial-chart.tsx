import { ChartCard, ChartLegend, EmptyState, RadialChart, Skeleton } from 'oniva-ui';
import type { DocPage } from '../types';

const goals = [
  { label: 'Revenue', value: 82, tone: 1 },
  { label: 'Signups', value: 64, tone: 4 },
  { label: 'Retention', value: 47, tone: 3 },
];

const Stage = () => (
  <div style={{ alignItems: 'center', display: 'flex', gap: 24 }}>
    <RadialChart items={goals} size={220} centerValue="64%" centerLabel="Average" />
    <ChartLegend orientation="vertical" items={goals.map((g) => ({ label: g.label, tone: g.tone, value: g.value + '%' }))} />
  </div>
);

const Shape = () => (
  <div style={{ display: 'grid', gap: 12 }}>
    <pre tabIndex={0} style={{ margin: 0, padding: 12, borderRadius: 10, overflow: 'auto', fontSize: 12.5, lineHeight: '18px', background: 'var(--oniva-color-surface-inset)', color: 'var(--oniva-color-text)' }}>
      <code>{"interface RadialItem {\n  label: string;\n  value: number;\n  max?: number;   // full-scale for this ring, default 100\n  tone?: number;  // 1 to 10, defaults to position + 1\n}\n\n[\n  { label: 'Revenue', value: 82 },\n  { label: 'Orders', value: 8200, max: 10000 },\n]\n// <RadialChart items={items} centerValue=\"64%\" centerLabel=\"Average\" />"}</code>
    </pre>
    <ul style={{ margin: 0, paddingInlineStart: 18, display: 'grid', gap: 4, fontSize: 14, lineHeight: '20px' }}>
      <li>{"Prop is items, not data."}</li>
      <li>{"Values above max clamp to a full ring."}</li>
      <li>{"The first item is the outermost ring. Put the most important goal first."}</li>
      <li>{"Use 2 to 4 items. Rings shrink 20px per item, so a 220px dial fits four."}</li>
    </ul>
  </div>
);

const page: DocPage = {
  slug: "radial-chart",
  status: 'Stable',
  version: '0.1.0',
  importName: "RadialChart",
  group: ['Components', 'Charts'],
  sourcePath: "charts/RadialChart",
  lede: "Concentric bars on a 270-degree arc. It handles two to four progress values compared on one dial, each against its own maximum.",
  anatomy: {
    intro: "Four parts. The track and bars are always present. Center text is optional.",
    Render: Stage,
    parts: [
      { name: "Track", description: "Each ring has a full-sweep track in the chart track colour, 14px thick, 6px gap between rings.", selector: "svg[role=\"group\"] path:first-of-type" },
      { name: "Bar", description: "Rounded arc filled to value / max of the sweep. The outermost ring is the first item.", selector: "svg[role=\"group\"] path:nth-of-type(2)" },
      { name: "Chart", description: "220px square, 270-degree sweep opening at the bottom. Bars sweep in over 700ms.", selector: "svg[role=\"group\"]" },
      { name: "Center content", description: "centerValue and centerLabel in the middle of the rings.", selector: "div > span:first-of-type", fallback: { x: 50, y: 50 } },
      { name: "Legend", description: "Vertical ChartLegend with values.", selector: "ul" },
    ],
  },
  usage: {
    use: ["2 to 4 goals compared on one dial: revenue, signups, retention.","Percent-of-target dashboards where each item has a max.","A compact summary tile with a centre figure."],
    avoid: [
      { text: "A single value on a range.", instead: { slug: "gauge", label: "Gauge" } },
      { text: "Fitness-style daily goals with a closed ring.", instead: { slug: "activity-rings", label: "ActivityRings" } },
      { text: "Comparing more than four items.", instead: { slug: "bar-list", label: "BarList" } },
      { text: "Parts of a whole.", instead: { slug: "donut-chart", label: "DonutChart" } },
    ],
  },
  playground: {
    controls: [
      { kind: 'number', key: 'size', label: 'Size (px)', min: 140, max: 300, step: 20 },
      { kind: 'number', key: 'thickness', label: 'Thickness (px)', min: 6, max: 24, step: 2 },
      { kind: 'number', key: 'sweep', label: 'Sweep (deg)', min: 180, max: 360, step: 30 },
      { kind: 'segmented', key: 'valueFormat', label: 'Format', options: ['number', 'percent'] },
      { kind: 'text', key: 'centerLabel', label: 'Center label', presets: ['Average', 'Goals', 'Quarter'] },
    ],
    initial: { size: 220, thickness: 14, sweep: 270, valueFormat: 'percent', centerLabel: 'Average' },
    render: (p) => (
      <RadialChart items={goals} size={Number(p.size)} thickness={Number(p.thickness)} sweep={Number(p.sweep)} valueFormat={p.valueFormat as 'percent'} centerValue="64%" centerLabel={String(p.centerLabel)} />
    ),
    code: (p) => {
      const attrs = [p.size !== 220 && `size={${p.size}}`, p.thickness !== 14 && `thickness={${p.thickness}}`, p.sweep !== 270 && `sweep={${p.sweep}}`, p.valueFormat !== 'number' && `valueFormat="${p.valueFormat}"`, `centerLabel="${p.centerLabel}"`].filter(Boolean).join(' ');
      return `<RadialChart items={goals} ${attrs} />`;
    },
  },
  states: [
    { name: "Default", description: "Three rings, 270-degree sweep.", Render: () => (
      <RadialChart items={goals} size={200} valueFormat="percent" centerValue="64%" centerLabel="Average" />
    ) },
    { name: "Half sweep", description: "sweep={180} gives a semicircle. For a single bounded value use Gauge.", Render: () => (
      <RadialChart items={goals} size={200} sweep={180} valueFormat="percent" />
    ) },
    { name: "Custom max", description: "Each item can have its own max. Here 8.2K of 10K.", Render: () => (
      <RadialChart items={[{ label: 'Orders', value: 8200, max: 10000, tone: 1 }, { label: 'Refunds', value: 120, max: 500, tone: 3 }]} size={200} centerValue="82%" centerLabel="Orders" />
    ) },
    { name: "Thin rings", description: "thickness 8 for tight tiles.", Render: () => (
      <RadialChart items={goals} size={200} thickness={8} valueFormat="percent" />
    ) },
    { name: "Loading", description: "Skeleton at the chart height. The chart is not mounted until data exists.", Render: () => (
<ChartCard title="Quarterly goals"><Skeleton variant="rect" width="100%" height={240} /></ChartCard>
    ) },
    { name: "Empty", description: "No data in range. Say why and offer a way out. The chart is not mounted.", Render: () => (
<ChartCard title="Quarterly goals"><EmptyState title="No data for this range" description="Pick a longer period or check that the source is connected." /></ChartCard>
    ) },
    { name: "Single point", description: "One ring is a progress dial. Use Gauge if the value is a score on a range.", Render: () => (
      <RadialChart items={goals.slice(0, 1)} size={180} valueFormat="percent" centerValue="82%" centerLabel="Revenue" />
    ) },
  ],
  sections: [
    {
      type: 'text', id: 'choosing-a-chart', title: 'Choosing a chart',
      body: (<p style={{ margin: 0 }}>Use a radial chart to compare progress on a few goals that each have a ceiling. See the full decision table on <a href="#/components/bar-chart">Bar chart</a>.</p>),
    },
    { type: 'custom', id: 'data-shape', title: 'Data shape', Render: Shape },
    {
      type: 'rules', id: 'formatting', title: 'Axes, labels and numbers',
      items: [
        { title: "Tabular numerals", body: "Axis labels (11px, medium, muted), tooltip values and legend values use tabular-nums, so digits stay in place when values change." },
        { title: "Values are against max", body: "The arc length is value / max, clamped to 0 to 1. Format the number with valueFormat: \"percent\" appends % to the raw value." },
        { title: "Center holds the headline", body: "One number and a one-word caption. Compute the average or the most important ring yourself." },
        { title: "Tooltip shows value and max", body: "Hover or focus shows the ring label, value and its max in the valueFormat." },
        { title: "Units belong in the format", body: "Use valueFormat=\"currency\", \"percent\" or a function such as (n) => `${n} ms`. Never concatenate units into category labels." },
      ],
    },
    {
      type: 'rules', id: 'color-and-palette', title: 'Color and palette',
      items: [
        { title: "Ten chart tokens", body: "--oniva-color-chart-1 to --oniva-color-chart-10 are fixed hues, independent of the accent. Pick by position or pass tone (1-based). Tone wraps after 10." },
        { title: "One tone per ring", body: "Outer ring is tone 1 by default, then 2, 3, 4. Keep meaning stable across charts." },
        { title: "Track is neutral", body: "The empty arc uses the chart track colour (1.3:1), which is a guide, not data." },
        { title: "Label the rings", body: "Rings carry no text, so always pair with a ChartLegend or the data is unreadable in grayscale." },
        { title: "Color-blind safe", body: "Every mark is at least 3:1 on white. In the light palette, series 1 to 10 stay at least 3.3 delta E apart under protanopia, deuteranopia and tritanopia simulation. Do not rely on that alone: label series in the legend or tooltip." },
        { title: "Track and grid", body: "Empty tracks and gridlines use --oniva-color-chart-track. The hover band uses --oniva-color-chart-cursor." },
      ],
    },
    {
      type: 'rules', id: 'keyboard-exploration', title: 'Keyboard exploration',
      intro: "Tab to the chart, then use the arrow keys to step through each ring. Each stop opens its tooltip.",
      items: [
        { title: 'One tab stop', body: 'The chart is a single focusable group (tabindex 0). Tab enters it once and the next Tab leaves it, so a page with six charts costs six tab stops, not hundreds.' },
        { title: 'Arrows move between rings', body: "Right and Down move to the next ring, Left and Up to the previous one, in data order. Home and End jump to the first and last." },
        { title: 'Focus shows the tooltip', body: 'Moving focus opens the same tooltip as hover, anchored to the focused mark. Esc closes it without moving focus. The focused mark gets a 2px focus ring, 2px offset.' },
      ],
    },
    {
      type: 'rules', id: 'empty-loading-single', title: 'Empty, loading and single-point states',
      intro: "The chart does not draw its own placeholder. Decide before you mount it.",
      items: [
        { title: "Loading", body: "Render a Skeleton at the same height (240px here) so the card does not jump. Mount the chart when data arrives so the entrance animation plays once." },
        { title: "Empty", body: "Use EmptyState inside the ChartCard. Name the cause (No orders in this range) and give one action. Do not render an empty plot with axes." },
        { title: "One point", body: "A single ring reads as a progress dial and works fine. Add a center value so the number is visible without hovering." },
      ],
    },
    {
      type: 'rules', id: 'motion', title: 'Motion',
      items: [
        { title: "Entrance", body: "Every ring sweeps from 0 to its value over 700ms when 15% is in view." },
        { title: "Data updates", body: "Changing values tweens each ring over 700ms (ease-out quart). The sweep restarts only on first view." },
        { title: "Reduced motion", body: "With prefers-reduced-motion the entrance animation is removed (animation-name none) and value tweens jump straight to the final value. Tooltip movement drops to 0.01ms." },
      ],
    },

  ],
  content: { rules: [
    { title: "Item labels are nouns", body: "Revenue, Signups. One or two words." },
    { title: "Center caption", body: "Average, Goals. One word." },
    { title: "Percent, not fractions", body: "Pass 82 for 82%, not 0.82, and set max to 100." },
  ] },
  accessibility: {
    keyboard: [
      { keys: ["Tab"], action: "Moves focus into the chart, then out to the next control. The chart is one tab stop." },
      { keys: ["→","↓"], action: "Moves focus to the next ring. In right-to-left layouts → and ← swap." },
      { keys: ["←","↑"], action: "Moves focus to the previous ring." },
      { keys: ["Home","End"], action: "Jumps to the first or last ring." },
      { keys: ["Esc"], action: "Closes the tooltip. Focus stays where it is." },
    ],
    notes: ["The dial is an svg with role=\"group\" and aria-roledescription=\"chart\". Default label lists every item and value.","Each ring bar is a role=\"graphics-symbol\" stop with its label and value.","A visually hidden table lists Item, Value and Max.","Center text is real DOM text and is read with the chart."],
    reducedMotion: "Entrance animation is removed and value tweens jump to the final value. Tooltip movement drops to 0.01ms.",
  },
  props: [
    { name: "items", type: "RadialItem[]", description: "Rings from outermost: label, value, max, tone." },
    { name: "size", type: "number", default: "220", description: "Width and height in px." },
    { name: "thickness", type: "number", default: "14", description: "Ring thickness in px. 6px gap between rings." },
    { name: "sweep", type: "number", default: "270", description: "Total sweep in degrees." },
    { name: "valueFormat", type: "ValueFormat", default: "'number'", description: "'number', 'compact', 'currency' (USD, no decimals), 'percent' or a function." },
    { name: "centerValue", type: "ReactNode", description: "Center headline." },
    { name: "centerLabel", type: "ReactNode", description: "Caption under the center value." },
    { name: "label", type: "string", description: "Accessible summary of the chart." },
    { name: "xstyle", type: "StyleXStyles", description: "StyleX overrides for the wrapper." },
  ],
  related: ["activity-rings","gauge","donut-chart","chart-legend","ring-progress"],
};
export default page;
