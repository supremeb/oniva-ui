import { ChartCard, ChartLegend, EmptyState, RadarChart, Skeleton } from 'oniva-ui';
import type { DocPage } from '../types';

const skills = [
  { skill: 'Research', you: 82, team: 68 },
  { skill: 'Visual design', you: 91, team: 74 },
  { skill: 'Prototyping', you: 76, team: 71 },
  { skill: 'Engineering', you: 64, team: 52 },
  { skill: 'Strategy', you: 70, team: 77 },
  { skill: 'Writing', you: 58, team: 63 },
];
const skillSeries = [
  { key: 'you', label: 'You', tone: 1 },
  { key: 'team', label: 'Team average', tone: 3 },
];

const Stage = () => (
  <div style={{ width: 380 }}>
    <ChartCard title="Skills profile" legend={<ChartLegend items={[{ label: 'You', tone: 1 }, { label: 'Team average', tone: 3 }]} />}>
      <RadarChart data={skills} index="skill" series={skillSeries} height={300} />
    </ChartCard>
  </div>
);

const Shape = () => (
  <div style={{ display: 'grid', gap: 12 }}>
    <pre tabIndex={0} style={{ margin: 0, padding: 12, borderRadius: 10, overflow: 'auto', fontSize: 12.5, lineHeight: '18px', background: 'var(--oniva-color-surface-inset)', color: 'var(--oniva-color-text)' }}>
      <code>{"type ChartDatum = Record<string, string | number>;\n// one row per axis, one numeric field per series\n\n[\n  { skill: 'Research', you: 82, team: 68 },\n  { skill: 'Visual design', you: 91, team: 74 },\n]\n// <RadarChart data={data} index=\"skill\" series={[{ key: 'you' }, { key: 'team' }]} max={100} />"}</code>
    </pre>
    <ul style={{ margin: 0, paddingInlineStart: 18, display: 'grid', gap: 4, fontSize: 14, lineHeight: '20px' }}>
      <li>{"Each row is one axis. index names the axis label."}</li>
      <li>{"Axes go clockwise from 12 o'clock in data order."}</li>
      <li>{"All values share one scale. max defaults to the data max rounded up to the next 10; pass max for a fixed scale."}</li>
      <li>{"Use 5 to 8 rows and at most two series."}</li>
    </ul>
  </div>
);

const page: DocPage = {
  slug: "radar-chart",
  status: 'Stable',
  version: '0.1.0',
  importName: "RadarChart",
  group: ['Components', 'Charts'],
  sourcePath: "charts/RadarChart",
  lede: "A polygon per series across 5 to 8 axes. It handles profile comparison: where one person or product is stronger than another.",
  anatomy: {
    intro: "Five parts. The rings, axes and polygon are always present. The legend comes from ChartLegend.",
    Render: Stage,
    parts: [
      { name: "Plot", description: "Responsive svg, 300px tall. The radar fits the smaller of width and height.", selector: "svg[role=\"group\"]" },
      { name: "Rings", description: "Four concentric polygons in the track colour (levels). The outer ring is max, default the data max rounded up to 10.", selector: "svg[role=\"group\"] > g[aria-hidden=\"true\"] polygon" },
      { name: "Axis labels", description: "One per spoke, 11px muted, set outside the outer ring.", selector: "svg[role=\"group\"] text" },
      { name: "Series polygon", description: "Filled shape with a stroke in the series colour. Later series draw on top.", selector: "svg[role=\"group\"] > g:not([aria-hidden]) > polygon" },
      { name: "Legend", description: "ChartLegend under the plot.", selector: "ul" },
    ],
  },
  usage: {
    use: ["Comparing 2 profiles across 5 to 8 axes: skills, product ratings.","Spotting the shape of a strength, not the exact number.","Scores on the same scale, such as 0 to 100."],
    avoid: [
      { text: "Exact comparisons. Radar areas mislead.", instead: { slug: "bar-chart", label: "BarChart" } },
      { text: "Fewer than 5 axes or axes with different units.", instead: { slug: "bar-list", label: "BarList" } },
      { text: "Change over time.", instead: { slug: "line-chart", label: "LineChart" } },
    ],
  },
  playground: {
    controls: [
      { kind: 'toggle', key: 'two', label: 'Compare with team' },
      { kind: 'number', key: 'levels', label: 'Levels', min: 2, max: 6, step: 1 },
      { kind: 'number', key: 'max', label: 'Max', min: 80, max: 120, step: 10 },
      { kind: 'number', key: 'height', label: 'Height (px)', min: 240, max: 360, step: 20 },
    ],
    initial: { two: true, levels: 4, max: 100, height: 300 },
    render: (p) => (
      <div style={{ width: 'min(400px, 100%)' }}><RadarChart data={skills} index="skill" series={p.two ? skillSeries : skillSeries.slice(0, 1)} levels={Number(p.levels)} max={Number(p.max)} height={Number(p.height)} /></div>
    ),
    code: (p) => {
      const attrs = [p.levels !== 4 && `levels={${p.levels}}`, `max={${p.max}}`, p.height !== 300 && `height={${p.height}}`].filter(Boolean).join(' ');
      return `<RadarChart data={skills} index="skill" series={${p.two ? 'series' : "[{ key: 'you' }]"}} ${attrs} />`;
    },
  },
  states: [
    { name: "Two series", description: "Compare a profile to a baseline.", Render: () => (
      <div style={{ width: 340 }}><RadarChart data={skills} index="skill" series={skillSeries} height={280} /></div>
    ) },
    { name: "One series", description: "A single profile.", Render: () => (
      <div style={{ width: 340 }}><RadarChart data={skills} index="skill" series={skillSeries.slice(0, 1)} height={280} /></div>
    ) },
    { name: "Fewer levels", description: "levels={2} for a cleaner grid.", Render: () => (
      <div style={{ width: 340 }}><RadarChart data={skills} index="skill" series={skillSeries} levels={2} height={280} /></div>
    ) },
    { name: "Fixed max", description: "max={100} keeps a 0 to 100 score honest.", Render: () => (
      <div style={{ width: 340 }}><RadarChart data={skills} index="skill" series={skillSeries} max={100} height={280} /></div>
    ) },
    { name: "Loading", description: "Skeleton at the chart height. The chart is not mounted until data exists.", Render: () => (
<ChartCard title="Skills profile"><Skeleton variant="rect" width="100%" height={300} /></ChartCard>
    ) },
    { name: "Empty", description: "No data in range. Say why and offer a way out. The chart is not mounted.", Render: () => (
<ChartCard title="Skills profile"><EmptyState title="No data for this range" description="Pick a longer period or check that the source is connected." /></ChartCard>
    ) },
    { name: "Single point", description: "Two axes collapse the shape to a line. Radar needs three or more, ideally five.", Render: () => (
      <div style={{ width: 340 }}><RadarChart data={skills.slice(0, 2)} index="skill" series={skillSeries.slice(0, 1)} height={280} /></div>
    ) },
  ],
  sections: [
    {
      type: 'text', id: 'choosing-a-chart', title: 'Choosing a chart',
      body: (<p style={{ margin: 0 }}>Use a radar chart to compare shape across several axes that share one scale. See the full decision table on <a href="#/components/bar-chart">Bar chart</a>.</p>),
    },
    { type: 'custom', id: 'data-shape', title: 'Data shape', Render: Shape },
    {
      type: 'rules', id: 'formatting', title: 'Axes, labels and numbers',
      items: [
        { title: "Tabular numerals", body: "Axis labels (11px, medium, muted), tooltip values and legend values use tabular-nums, so digits stay in place when values change." },
        { title: "One scale for every axis", body: "Radar has no per-axis units. Normalise to 0 to 100 before charting." },
        { title: "No ring numbers", body: "Rings are guides without labels. Put the scale in the caption: \"Scores 0 to 100\"." },
        { title: "Tooltip shows exact values", body: "Each vertex shows axis name and series values in valueFormat." },
        { title: "Units belong in the format", body: "Use valueFormat=\"currency\", \"percent\" or a function such as (n) => `${n} ms`. Never concatenate units into category labels." },
      ],
    },
    {
      type: 'rules', id: 'color-and-palette', title: 'Color and palette',
      items: [
        { title: "Ten chart tokens", body: "--oniva-color-chart-1 to --oniva-color-chart-10 are fixed hues, independent of the accent. Pick by position or pass tone (1-based). Tone wraps after 10." },
        { title: "Two series maximum", body: "Overlapping polygons hide each other past two. The second series uses a translucent fill so the first shows through." },
        { title: "Distinct hues", body: "Use tone 1 and 3 (teal and pink), which stay separate under all color-blind simulations." },
        { title: "Color-blind safe", body: "Every mark is at least 3:1 on white. In the light palette, series 1 to 10 stay at least 3.3 delta E apart under protanopia, deuteranopia and tritanopia simulation. Do not rely on that alone: label series in the legend or tooltip." },
        { title: "Track and grid", body: "Empty tracks and gridlines use --oniva-color-chart-track. The hover band uses --oniva-color-chart-cursor." },
      ],
    },
    {
      type: 'rules', id: 'keyboard-exploration', title: 'Keyboard exploration',
      intro: "Tab to the chart, then use the arrow keys to step through each vertex. Each stop opens its tooltip.",
      items: [
        { title: 'One tab stop', body: 'The chart is a single focusable group (tabindex 0). Tab enters it once and the next Tab leaves it, so a page with six charts costs six tab stops, not hundreds.' },
        { title: 'Arrows move between vertices', body: "Right and Down move to the next vertex, Left and Up to the previous one, in data order. Home and End jump to the first and last." },
        { title: 'Focus shows the tooltip', body: 'Moving focus opens the same tooltip as hover, anchored to the focused mark. Esc closes it without moving focus. The focused mark gets a 2px focus ring, 2px offset.' },
      ],
    },
    {
      type: 'rules', id: 'empty-loading-single', title: 'Empty, loading and single-point states',
      intro: "The chart does not draw its own placeholder. Decide before you mount it.",
      items: [
        { title: "Loading", body: "Render a Skeleton at the same height (300px here) so the card does not jump. Mount the chart when data arrives so the entrance animation plays once." },
        { title: "Empty", body: "Use EmptyState inside the ChartCard. Name the cause (No orders in this range) and give one action. Do not render an empty plot with axes." },
        { title: "One point", body: "Under three axes the polygon degenerates to a line or a point. Use five to eight axes, or switch to bars." },
      ],
    },
    {
      type: 'rules', id: 'motion', title: 'Motion',
      items: [
        { title: "Entrance", body: "Vertices pop in over 350ms with the polygon fade. Released when 15% is in view." },
        { title: "Data updates", body: "Changing the data tweens existing values over 400ms (ease-out quart) instead of replacing the marks. If the number of rows changes, the chart snaps to the new data." },
        { title: "Reduced motion", body: "With prefers-reduced-motion the entrance animation is removed (animation-name none) and value tweens jump straight to the final value. Tooltip movement drops to 0.01ms." },
      ],
    },

  ],
  content: { rules: [
    { title: "Axis labels are nouns", body: "Research, Strategy. One or two words, under 14 characters." },
    { title: "Series labels", body: "You, Team average." },
    { title: "State the scale", body: "Add \"0 to 100\" in the card subtitle or label." },
  ] },
  accessibility: {
    keyboard: [
      { keys: ["Tab"], action: "Moves focus into the chart, then out to the next control. The chart is one tab stop." },
      { keys: ["→","↓"], action: "Moves focus to the next vertex. In right-to-left layouts → and ← swap." },
      { keys: ["←","↑"], action: "Moves focus to the previous vertex." },
      { keys: ["Home","End"], action: "Jumps to the first or last vertex." },
      { keys: ["Esc"], action: "Closes the tooltip. Focus stays where it is." },
    ],
    notes: ["The plot is an svg with role=\"group\" and aria-roledescription=\"chart\".","Each vertex is a role=\"graphics-symbol\" stop with the axis name and values.","A visually hidden table lists each axis with one column per series.","Rings and spokes are aria-hidden."],
    reducedMotion: "Entrance animation is removed and value tweens jump to the final value. Tooltip movement drops to 0.01ms.",
  },
  props: [
    { name: "data", type: "ChartDatum[]", description: "Rows. Each row has the index field and one numeric field per series." },
    { name: "index", type: "string", description: "Field holding the axis name." },
    { name: "series", type: "ChartSeries[]", description: "One polygon per series. Pass two to compare." },
    { name: "max", type: "number", description: "Value at the outer ring. Default: data max rounded up to 10." },
    { name: "levels", type: "number", default: "4", description: "Number of concentric rings." },
    { name: "valueFormat", type: "ValueFormat", default: "'number'", description: "'number', 'compact', 'currency' (USD, no decimals), 'percent' or a function." },
    { name: "height", type: "number", default: "300", description: "Plot height in px." },
    { name: "label", type: "string", description: "Accessible summary of the chart." },
    { name: "xstyle", type: "StyleXStyles", description: "StyleX overrides for the wrapper." },
  ],
  related: ["bar-chart","scatter-chart","radial-chart","chart-legend","chart-card"],
};
export default page;
