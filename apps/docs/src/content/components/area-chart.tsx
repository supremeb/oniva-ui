import { AreaChart, ChartCard, ChartLegend, EmptyState, Skeleton } from 'oniva-ui';
import type { DocPage } from '../types';

const revenue = [
  { month: 'Jan', revenue: 42800, expenses: 31200, margin: 27 },
  { month: 'Feb', revenue: 46100, expenses: 32800, margin: 29 },
  { month: 'Mar', revenue: 51900, expenses: 34100, margin: 34 },
  { month: 'Apr', revenue: 49600, expenses: 35900, margin: 28 },
  { month: 'May', revenue: 57300, expenses: 36400, margin: 36 },
  { month: 'Jun', revenue: 63200, expenses: 38800, margin: 39 },
  { month: 'Jul', revenue: 61400, expenses: 40100, margin: 35 },
  { month: 'Aug', revenue: 68700, expenses: 41300, margin: 40 },
  { month: 'Sep', revenue: 73900, expenses: 43700, margin: 41 },
];
const series = [
  { key: 'revenue', label: 'Revenue', tone: 1 },
  { key: 'expenses', label: 'Expenses', tone: 3 },
];

const Stage = () => (
  <div style={{ width: 520 }}>
    <ChartCard title="Revenue" value="$73,900" unit="September" delta={{ label: '7.6%', trend: 'up' }} legend={<ChartLegend items={[{ label: 'Revenue', tone: 1 }, { label: 'Expenses', tone: 3 }]} />}>
      <AreaChart data={revenue} index="month" series={series} valueFormat="currency" height={220} />
    </ChartCard>
  </div>
);

const Shape = () => (
  <div style={{ display: 'grid', gap: 12 }}>
    <pre tabIndex={0} style={{ margin: 0, padding: 12, borderRadius: 10, overflow: 'auto', fontSize: 12.5, lineHeight: '18px', background: 'var(--oniva-color-surface-inset)', color: 'var(--oniva-color-text)' }}>
      <code>{"type ChartDatum = Record<string, string | number>;\n\ninterface ChartSeries {\n  key: string;     // field in each datum\n  label?: string;  // legend + tooltip name, defaults to key\n  tone?: number;   // 1 to 10, defaults to position + 1\n}\n\n// data, one row per x value, in order\n[\n  { month: 'Jan', revenue: 42800, expenses: 31200 },\n  { month: 'Feb', revenue: 46100, expenses: 32800 },\n]\n// <AreaChart data={data} index=\"month\" series={[{ key: 'revenue', label: 'Revenue' }]} stacked />"}</code>
    </pre>
    <ul style={{ margin: 0, paddingInlineStart: 18, display: 'grid', gap: 4, fontSize: 14, lineHeight: '20px' }}>
      <li>{"Rows must be ordered by x. Areas connect them in array order."}</li>
      <li>{"Stacking order is the series order: the first series sits at the bottom."}</li>
      <li>{"With stacked=\"percent\" values are normalised per row, so raw numbers are fine."}</li>
      <li>{"Missing values count as 0."}</li>
    </ul>
  </div>
);

const page: DocPage = {
  slug: "area-chart",
  status: 'Stable',
  version: '0.1.0',
  importName: "AreaChart",
  group: ['Components', 'Charts'],
  sourcePath: "charts/AreaChart",
  lede: "A line with the area under it filled. It handles volume over time: one series with a gradient, or stacked series that sum to a total.",
  anatomy: {
    intro: "Six parts. The plot, area and line are always present. Gridlines and the value axis are optional.",
    Render: Stage,
    parts: [
      { name: "Plot", description: "Responsive svg, 220px here. Margins: 48px left, 28px bottom, 12px right, 10px top.", selector: "svg[role=\"group\"]" },
      { name: "Area fill", description: "Gradient from the series colour to transparent by default. fill also takes dots, lines, grid or solid. Revealed with a left-to-right wipe.", selector: "svg[role=\"group\"] > g:not([aria-hidden]) path:first-of-type" },
      { name: "Line", description: "2px stroke on top of the fill. Curve is monotone by default.", selector: "svg[role=\"group\"] > g:not([aria-hidden]) path:nth-of-type(2)" },
      { name: "Gridlines and value axis", description: "Dashed 3 4 gridlines, solid zero line, 11px muted labels.", selector: "svg[role=\"group\"] > g[aria-hidden=\"true\"] text" },
      { name: "Hover column", description: "One invisible full-height column per x value. Hover or focus shows the cursor line and the tooltip. This is the keyboard stop.", selector: "svg[role=\"group\"] > rect[role=\"graphics-symbol\"]" },
      { name: "Legend", description: "ChartLegend with 10px swatches.", selector: "ul" },
    ],
  },
  usage: {
    use: ["Volume or cumulative totals over time: traffic, spend, revenue.","Stacked series that sum to a total, with stacked.","Part-to-whole over time with stacked=\"percent\"."],
    avoid: [
      { text: "Comparing precise values between series that overlap.", instead: { slug: "line-chart", label: "LineChart" } },
      { text: "Comparing discrete categories.", instead: { slug: "bar-chart", label: "BarChart" } },
      { text: "A tiny trend in a table row.", instead: { slug: "sparkline", label: "Sparkline" } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'stacked', label: 'Stacking', options: ['off', 'stacked', 'percent'] },
      { kind: 'segmented', key: 'fill', label: 'Fill', options: ['gradient', 'solid', 'dots', 'lines', 'grid'] },
      { kind: 'segmented', key: 'curve', label: 'Curve', options: ['monotone', 'linear', 'natural', 'step', 'basis'] },
      { kind: 'segmented', key: 'valueFormat', label: 'Format', options: ['number', 'compact', 'currency'] },
      { kind: 'toggle', key: 'glow', label: 'Glow' },
    ],
    initial: { stacked: 'off', fill: 'gradient', curve: 'monotone', valueFormat: 'currency', glow: false },
    render: (p) => (
      <div style={{ width: 'min(520px, 100%)' }}>
        <AreaChart key={String(p.stacked)} data={revenue} index="month" series={series} stacked={p.stacked === 'off' ? false : p.stacked === 'percent' ? 'percent' : true} fill={p.fill as 'gradient'} curve={p.curve as 'monotone'} valueFormat={p.valueFormat as 'currency'} glow={Boolean(p.glow)} height={240} />
      </div>
    ),
    code: (p) => {
      const attrs = [p.stacked === 'stacked' && 'stacked', p.stacked === 'percent' && 'stacked="percent"', p.fill !== 'gradient' && `fill="${p.fill}"`, p.curve !== 'monotone' && `curve="${p.curve}"`, p.valueFormat !== 'number' && `valueFormat="${p.valueFormat}"`, p.glow && 'glow'].filter(Boolean).join(' ');
      return `<AreaChart data={revenue} index="month" series={series}${attrs ? ' ' + attrs : ''} />`;
    },
  },
  states: [
    { name: "Default", description: "Overlapping areas, gradient fade, monotone curve.", Render: () => (
      <div style={{ width: 460 }}><AreaChart data={revenue} index="month" series={series} valueFormat="currency" height={200} /></div>
    ) },
    { name: "Stacked", description: "Series sum to a total. The top edge is the total.", Render: () => (
      <div style={{ width: 460 }}><AreaChart data={revenue} index="month" series={series} stacked valueFormat="currency" height={200} /></div>
    ) },
    { name: "Percent", description: "Each x normalises to 100%. Axis shows 0 to 100%.", Render: () => (
      <div style={{ width: 460 }}><AreaChart data={revenue} index="month" series={series} stacked="percent" height={200} /></div>
    ) },
    { name: "Pattern fill", description: "dots, lines or grid add a texture beyond hue.", Render: () => (
      <div style={{ width: 460 }}><AreaChart data={revenue} index="month" series={series} fill="lines" valueFormat="currency" height={200} /></div>
    ) },
    { name: "No axes", description: "Hide gridlines and both axes for a hero strip. Pair with a headline number.", Render: () => (
      <div style={{ width: 460 }}><AreaChart data={revenue} index="month" series={series.slice(0, 1)} showGrid={false} showXAxis={false} showYAxis={false} height={120} /></div>
    ) },
    { name: "Loading", description: "Skeleton at the chart height. The chart is not mounted until data exists.", Render: () => (
<ChartCard title="Revenue"><Skeleton variant="rect" width="100%" height={240} /></ChartCard>
    ) },
    { name: "Empty", description: "No data in range. Say why and offer a way out. The chart is not mounted.", Render: () => (
<ChartCard title="Revenue"><EmptyState title="No data for this range" description="Pick a longer period or check that the source is connected." /></ChartCard>
    ) },
    { name: "Single point", description: "One row has no area to fill. The chart renders without a shape; show a number instead.", Render: () => (
      <div style={{ width: 460 }}><AreaChart data={revenue.slice(0, 1)} index="month" series={series.slice(0, 1)} valueFormat="currency" height={160} /></div>
    ) },
  ],
  sections: [
    {
      type: 'text', id: 'choosing-a-chart', title: 'Choosing a chart',
      body: (<p style={{ margin: 0 }}>Use an area chart when the filled volume matters as much as the trend. See the full decision table on <a href="#/components/bar-chart">Bar chart</a>.</p>),
    },
    { type: 'custom', id: 'data-shape', title: 'Data shape', Render: Shape },
    {
      type: 'rules', id: 'formatting', title: 'Axes, labels and numbers',
      items: [
        { title: "Tabular numerals", body: "Axis labels (11px, medium, muted), tooltip values and legend values use tabular-nums, so digits stay in place when values change." },
        { title: "Compact on the axis, full in the tooltip", body: "The axis compacts ($12K). The tooltip shows the full value per series." },
        { title: "Percent axis", body: "stacked=\"percent\" shows 0%, 25%, 50%, 75%, 100% and ignores valueFormat for ticks." },
        { title: "Zero baseline", body: "Area encodes size, so the axis always starts at 0." },
        { title: "Units belong in the format", body: "Use valueFormat=\"currency\", \"percent\" or a function such as (n) => `${n} ms`. Never concatenate units into category labels." },
      ],
    },
    {
      type: 'rules', id: 'color-and-palette', title: 'Color and palette',
      items: [
        { title: "Ten chart tokens", body: "--oniva-color-chart-1 to --oniva-color-chart-10 are fixed hues, independent of the accent. Pick by position or pass tone (1-based). Tone wraps after 10." },
        { title: "Series count", body: "Up to four areas. Order the largest series at the bottom when stacked." },
        { title: "Overlap needs transparency", body: "The default gradient keeps overlapped series readable. Solid fills hide the series behind them; use fill=\"gradient\" or a pattern." },
        { title: "Pattern fills", body: "fill=\"dots\", \"lines\" or \"grid\" adds a second channel beyond hue." },
        { title: "Color-blind safe", body: "Every mark is at least 3:1 on white. In the light palette, series 1 to 10 stay at least 3.3 delta E apart under protanopia, deuteranopia and tritanopia simulation. Do not rely on that alone: label series in the legend or tooltip." },
        { title: "Track and grid", body: "Empty tracks and gridlines use --oniva-color-chart-track. The hover band uses --oniva-color-chart-cursor." },
      ],
    },
    {
      type: 'rules', id: 'keyboard-exploration', title: 'Keyboard exploration',
      intro: "Tab to the chart, then use the arrow keys to read one x value at a time. Each stop lists every series at that x.",
      items: [
        { title: 'One tab stop', body: 'The chart is a single focusable group (tabindex 0). Tab enters it once and the next Tab leaves it, so a page with six charts costs six tab stops, not hundreds.' },
        { title: 'Arrows move between x values', body: "Right and Down move to the next x, Left and Up to the previous one. Home and End jump to the first and last. Each stop shows all series at that x." },
        { title: 'Focus shows the tooltip', body: 'Moving focus opens the same tooltip as hover, anchored to the focused mark. Esc closes it without moving focus. The focused mark gets a 2px focus ring, 2px offset.' },
      ],
    },
    {
      type: 'rules', id: 'empty-loading-single', title: 'Empty, loading and single-point states',
      intro: "The chart does not draw its own placeholder. Decide before you mount it.",
      items: [
        { title: "Loading", body: "Render a Skeleton at the same height (240px here) so the card does not jump. Mount the chart when data arrives so the entrance animation plays once." },
        { title: "Empty", body: "Use EmptyState inside the ChartCard. Name the cause (No orders in this range) and give one action. Do not render an empty plot with axes." },
        { title: "One point", body: "An area needs at least two points to enclose any space. With one row nothing is visible, so render a KPI value until a second point exists." },
      ],
    },
    {
      type: 'rules', id: 'motion', title: 'Motion',
      items: [
        { title: "Entrance", body: "The fill is wiped in left to right and the line is drawn over 800ms, both released when 15% of the chart is in view." },
        { title: "Data updates", body: "Changing the data tweens existing values over 400ms (ease-out quart) instead of replacing the marks. If the number of rows changes, the chart snaps to the new data." },
        { title: "Reduced motion", body: "With prefers-reduced-motion the entrance animation is removed (animation-name none) and value tweens jump straight to the final value. Tooltip movement drops to 0.01ms." },
      ],
    },

  ],
  content: { rules: [
    { title: "Title names the measure", body: "Revenue, Active users. Not Area chart." },
    { title: "Series labels are nouns", body: "Organic, Paid. Short enough for a 13px legend." },
    { title: "State stacking in the label", body: "When stacked, say so: \"Revenue by plan, stacked\"." },
  ] },
  accessibility: {
    keyboard: [
      { keys: ["Tab"], action: "Moves focus into the chart, then out to the next control. The chart is one tab stop." },
      { keys: ["→","↓"], action: "Moves focus to the next point. In right-to-left layouts → and ← swap." },
      { keys: ["←","↑"], action: "Moves focus to the previous point." },
      { keys: ["Home","End"], action: "Jumps to the first or last point." },
      { keys: ["Esc"], action: "Closes the tooltip. Focus stays where it is." },
    ],
    notes: ["The plot is an svg with role=\"group\", aria-roledescription=\"chart\" and an aria-label (default describes the series and index).","Each mark is role=\"graphics-symbol\" with aria-roledescription=\"data point\" and a label such as \"Mon: Steps 8,420\".","A visually hidden table mirrors the data (caption, column headers, row headers), so screen reader users can read it row by row.","Axis labels, gridlines and decorative fills are aria-hidden so the data is not read twice."],
    reducedMotion: "Entrance animation is removed and value tweens jump to the final value. Tooltip movement drops to 0.01ms.",
  },
  props: [
    { name: "data", type: "ChartDatum[]", description: "Rows. Each row has the index field and one numeric field per series." },
    { name: "index", type: "string", description: "Field that holds the category (x axis) label." },
    { name: "series", type: "ChartSeries[]", description: "Series definitions: key, label, tone (1 to 10)." },
    { name: "stacked", type: "boolean | 'percent'", default: "false", description: "Stack series. 'percent' normalises to 100%." },
    { name: "curve", type: "'linear' | 'monotone' | 'natural' | 'step' | 'basis'", default: "'monotone'", description: "Interpolation." },
    { name: "gradient", type: "boolean", default: "true", description: "Gradient fade under each line. Shorthand for fill." },
    { name: "fill", type: "'solid' | 'gradient' | 'dots' | 'lines' | 'grid'", description: "Fill treatment. Overrides gradient." },
    { name: "glow", type: "boolean", default: "false", description: "Soft blur behind the lines." },
    { name: "valueFormat", type: "ValueFormat", default: "'number'", description: "'number', 'compact', 'currency' (USD, no decimals), 'percent' or a function." },
    { name: "height", type: "number", default: "240", description: "Plot height in px. Width fills the container." },
    { name: "showGrid / showXAxis / showYAxis", type: "boolean", default: "true", description: "Toggle gridlines and axis labels." },
    { name: "label", type: "string", description: "Accessible summary of the chart." },
    { name: "xstyle", type: "StyleXStyles", description: "StyleX overrides for the wrapper." },
  ],
  related: ["line-chart","bar-chart","sparkline","chart-card","chart-legend"],
};
export default page;
