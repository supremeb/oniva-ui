import { ChartCard, ChartLegend, EmptyState, LineChart, Skeleton } from 'oniva-ui';
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
    <ChartCard title="Revenue trend" value="$73,900" unit="September" legend={<ChartLegend items={[{ label: 'Revenue', tone: 1 }, { label: 'Expenses', tone: 3 }]} />}>
      <LineChart data={revenue} index="month" series={series} valueFormat="currency" dots height={220} />
    </ChartCard>
  </div>
);

const Shape = () => (
  <div style={{ display: 'grid', gap: 12 }}>
    <pre tabIndex={0} style={{ margin: 0, padding: 12, borderRadius: 10, overflow: 'auto', fontSize: 12.5, lineHeight: '18px', background: 'var(--oniva-color-surface-inset)', color: 'var(--oniva-color-text)' }}>
      <code>{"type ChartDatum = Record<string, string | number>;\n\ninterface ChartSeries {\n  key: string;     // field in each datum\n  label?: string;  // legend + tooltip name, defaults to key\n  tone?: number;   // 1 to 10, defaults to position + 1\n}\n\n// data, one row per x value, in order\n[\n  { month: 'Jan', revenue: 42800, expenses: 31200 },\n  { month: 'Feb', revenue: 46100, expenses: 32800 },\n]\n// <LineChart data={data} index=\"month\" series={[{ key: 'revenue', label: 'Revenue' }]} dots />"}</code>
    </pre>
    <ul style={{ margin: 0, paddingInlineStart: 18, display: 'grid', gap: 4, fontSize: 14, lineHeight: '20px' }}>
      <li>{"Rows must be ordered by x. The line connects them in array order."}</li>
      <li>{"Each series key must hold a number. A missing value is drawn as 0, so fill gaps explicitly."}</li>
      <li>{"Pass domain={[min, max]} to pin the y axis. By default it runs from 0 to a nice maximum."}</li>
      <li>{"Use 6 to 60 rows. Fewer reads as a bar chart; more is fine because dots can be turned off."}</li>
    </ul>
  </div>
);

const page: DocPage = {
  slug: "line-chart",
  status: 'Stable',
  version: '0.1.0',
  importName: "LineChart",
  group: ['Components', 'Charts'],
  sourcePath: "charts/LineChart",
  lede: "Lines for change over time. It handles three moments: reading the trend, comparing two or three series, and landing on one point to read its value.",
  anatomy: {
    intro: "Six parts. The plot, line and x labels are always present. Dots, gridlines and the value axis are optional.",
    Render: Stage,
    parts: [
      { name: "Plot", description: "Responsive svg, 220px here. Margins: 48px left for the axis, 28px bottom, 12px right, 10px top.", selector: "svg[role=\"group\"]" },
      { name: "Line", description: "Curved path (monotone by default), 1.75 to 2px stroke, round caps. Drawn left to right on entrance.", selector: "svg[role=\"group\"] > g > path[stroke]" },
      { name: "Data dot", description: "Shown with dots. A ring in the surface colour separates it from the line. Dots are decorative: the keyboard stops are the invisible columns behind them.", selector: "svg[role=\"group\"] circle" },
      { name: "Gridlines and value axis", description: "Dashed 3 4 gridlines in the track colour, solid zero line. 11px muted labels, compact numbers.", selector: "svg[role=\"group\"] > g[aria-hidden=\"true\"] text" },
      { name: "Category labels", description: "x labels, 11px muted. Labels thin out automatically so neighbours stay at least 44px apart.", selector: "svg[role=\"group\"] > g[aria-hidden=\"true\"]:nth-of-type(2) text" },
      { name: "Legend", description: "ChartLegend: 10px swatches, 13px labels. Pair with the line colour.", selector: "ul" },
    ],
  },
  usage: {
    use: ["A metric over time with 6 or more points.","Comparing two to four series on the same unit.","Showing a pinned range with domain, such as 0 to 100 for a score."],
    avoid: [
      { text: "Comparing a few discrete categories.", instead: { slug: "bar-chart", label: "BarChart" } },
      { text: "Emphasising volume or a stacked total.", instead: { slug: "area-chart", label: "AreaChart" } },
      { text: "A trend inside a table cell or KPI tile.", instead: { slug: "sparkline", label: "Sparkline" } },
      { text: "Two series with different units.", instead: { slug: "combo-chart", label: "ComboChart" } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'curve', label: 'Curve', options: ['monotone', 'linear', 'natural', 'step', 'basis'] },
      { kind: 'segmented', key: 'valueFormat', label: 'Format', options: ['number', 'compact', 'currency'] },
      { kind: 'toggle', key: 'dots', label: 'Dots' },
      { kind: 'toggle', key: 'glow', label: 'Glow' },
      { kind: 'toggle', key: 'showGrid', label: 'Gridlines' },
      { kind: 'toggle', key: 'two', label: 'Two series' },
    ],
    initial: { curve: 'monotone', valueFormat: 'currency', dots: true, glow: false, showGrid: true, two: true },
    render: (p) => (
      <div style={{ width: 'min(520px, 100%)' }}>
        <LineChart key={String(p.curve)} data={revenue} index="month" series={p.two ? series : series.slice(0, 1)} curve={p.curve as 'monotone'} valueFormat={p.valueFormat as 'currency'} dots={Boolean(p.dots)} glow={Boolean(p.glow)} showGrid={Boolean(p.showGrid)} height={240} />
      </div>
    ),
    code: (p) => {
      const attrs = [p.curve !== 'monotone' && `curve="${p.curve}"`, p.valueFormat !== 'number' && `valueFormat="${p.valueFormat}"`, p.dots && 'dots', p.glow && 'glow', !p.showGrid && 'showGrid={false}'].filter(Boolean).join(' ');
      return `<LineChart data={revenue} index="month" series={${p.two ? 'series' : "[{ key: 'revenue' }]"}}${attrs ? ' ' + attrs : ''} />`;
    },
  },
  states: [
    { name: "Default", description: "Two series, monotone curve, no dots.", Render: () => (
      <div style={{ width: 460 }}><LineChart data={revenue} index="month" series={series} valueFormat="currency" height={200} /></div>
    ) },
    { name: "With dots", description: "A dot per point. Use for 12 points or fewer.", Render: () => (
      <div style={{ width: 460 }}><LineChart data={revenue.slice(0, 6)} index="month" series={series} valueFormat="currency" dots height={200} /></div>
    ) },
    { name: "Step curve", description: "step suits values that hold until they change, like a plan price.", Render: () => (
      <div style={{ width: 460 }}><LineChart data={revenue} index="month" series={series.slice(0, 1)} curve="step" valueFormat="currency" height={200} /></div>
    ) },
    { name: "Fixed domain", description: "domain pins the axis, here a margin score from 0 to 100.", Render: () => (
      <div style={{ width: 460 }}><LineChart data={revenue} index="month" series={[{ key: 'margin', label: 'Margin', tone: 4 }]} domain={[0, 100]} valueFormat="percent" height={200} /></div>
    ) },
    { name: "Glow", description: "Soft blur under the line. Use once per page, for the hero chart.", Render: () => (
      <div style={{ width: 460 }}><LineChart data={revenue} index="month" series={series.slice(0, 1)} glow valueFormat="currency" height={200} /></div>
    ) },
    { name: "Loading", description: "Skeleton at the chart height. The chart is not mounted until data exists.", Render: () => (
<ChartCard title="Revenue trend"><Skeleton variant="rect" width="100%" height={240} /></ChartCard>
    ) },
    { name: "Empty", description: "No data in range. Say why and offer a way out. The chart is not mounted.", Render: () => (
<ChartCard title="Revenue trend"><EmptyState title="No data for this range" description="Pick a longer period or check that the source is connected." /></ChartCard>
    ) },
    { name: "Single point", description: "One point has no line to draw. It renders centred, so turn dots on or show a number instead.", Render: () => (
      <div style={{ width: 460 }}><LineChart data={revenue.slice(0, 1)} index="month" series={series.slice(0, 1)} dots valueFormat="currency" height={160} /></div>
    ) },
  ],
  sections: [
    {
      type: 'text', id: 'choosing-a-chart', title: 'Choosing a chart',
      body: (<p style={{ margin: 0 }}>Use a line chart to show how a measure changes along an ordered axis, usually time. See the full decision table on <a href="#/components/bar-chart">Bar chart</a>.</p>),
    },
    { type: 'custom', id: 'data-shape', title: 'Data shape', Render: Shape },
    {
      type: 'rules', id: 'formatting', title: 'Axes, labels and numbers',
      items: [
        { title: "Tabular numerals", body: "Axis labels (11px, medium, muted), tooltip values and legend values use tabular-nums, so digits stay in place when values change." },
        { title: "Compact on the axis, full in the tooltip", body: "The axis compacts ($12K). The tooltip shows $63,200 with a rolling number as the cursor moves." },
        { title: "Axis starts at zero unless pinned", body: "Lines are less sensitive to a truncated axis than bars, but a zero baseline stays honest. Use domain only when the range has meaning, such as 0 to 100." },
        { title: "Label thinning", body: "x labels skip entries to keep at least 44px between them. Put the first and last point in your data where the story is." },
        { title: "Units belong in the format", body: "Use valueFormat=\"currency\", \"percent\" or a function such as (n) => `${n} ms`. Never concatenate units into category labels." },
      ],
    },
    {
      type: 'rules', id: 'color-and-palette', title: 'Color and palette',
      items: [
        { title: "Ten chart tokens", body: "--oniva-color-chart-1 to --oniva-color-chart-10 are fixed hues, independent of the accent. Pick by position or pass tone (1-based). Tone wraps after 10." },
        { title: "Series count", body: "Up to four lines. More than that tangles; filter or use small multiples." },
        { title: "Distinguish by more than hue", body: "Pair color with direct legend labels. Use dots on one series and not the other when printing in grayscale." },
        { title: "Color-blind safe", body: "Every mark is at least 3:1 on white. In the light palette, series 1 to 10 stay at least 3.3 delta E apart under protanopia, deuteranopia and tritanopia simulation. Do not rely on that alone: label series in the legend or tooltip." },
        { title: "Track and grid", body: "Empty tracks and gridlines use --oniva-color-chart-track. The hover band uses --oniva-color-chart-cursor." },
      ],
    },
    {
      type: 'rules', id: 'keyboard-exploration', title: 'Keyboard exploration',
      intro: "Tab to the chart, then use the arrow keys to read one x value at a time. Each stop lists every series at that x.",
      items: [
        { title: 'One tab stop', body: 'The chart is a single focusable group (tabindex 0). Tab enters it once and the next Tab leaves it, so a page with six charts costs six tab stops, not hundreds.' },
        { title: 'Arrows move between points', body: "Right and Down move to the next x value, Left and Up to the previous one. Home and End jump to the first and last. Each stop opens a tooltip with all series at that x." },
        { title: 'Focus shows the tooltip', body: 'Moving focus opens the same tooltip as hover, anchored to the focused mark. Esc closes it without moving focus. The focused mark gets a 2px focus ring, 2px offset.' },
      ],
    },
    {
      type: 'rules', id: 'empty-loading-single', title: 'Empty, loading and single-point states',
      intro: "The chart does not draw its own placeholder. Decide before you mount it.",
      items: [
        { title: "Loading", body: "Render a Skeleton at the same height (240px here) so the card does not jump. Mount the chart when data arrives so the entrance animation plays once." },
        { title: "Empty", body: "Use EmptyState inside the ChartCard. Name the cause (No orders in this range) and give one action. Do not render an empty plot with axes." },
        { title: "One point", body: "With one row the x position is centred and no line segment exists, so only a dot (with dots) is visible. Show a KPI value instead until you have at least three points." },
      ],
    },
    {
      type: 'rules', id: 'motion', title: 'Motion',
      items: [
        { title: "Entrance", body: "Each line draws from left to right over 800ms (stroke-dashoffset). Dots pop in over 350ms, starting 300ms after the line starts, staggered 40ms apart." },
        { title: "Data updates", body: "Changing the data tweens existing values over 400ms (ease-out quart) instead of replacing the marks. If the number of rows changes, the chart snaps to the new data." },
        { title: "Reduced motion", body: "With prefers-reduced-motion the entrance animation is removed (animation-name none) and value tweens jump straight to the final value. Tooltip movement drops to 0.01ms." },
      ],
    },

  ],
  content: { rules: [
    { title: "Title names the measure", body: "Revenue trend, not Line chart." },
    { title: "Series labels are nouns", body: "Revenue, Expenses. They appear in the legend and tooltip." },
    { title: "Tell the story in the label", body: "Pass label=\"Revenue grew 73% from January to September\" for screen readers when there is a claim to make." },
  ] },
  accessibility: {
    keyboard: [
      { keys: ["Tab"], action: "Moves focus into the chart, then out to the next control. The chart is one tab stop." },
      { keys: ["→","↓"], action: "Moves focus to the next point. In right-to-left layouts → and ← swap." },
      { keys: ["←","↑"], action: "Moves focus to the previous point." },
      { keys: ["Home","End"], action: "Jumps to the first or last point." },
      { keys: ["Esc"], action: "Closes the tooltip. Focus stays where it is." },
    ],
    notes: ["The plot is an svg with role=\"group\", aria-roledescription=\"chart\" and an aria-label (default describes the series and index).","Each mark is role=\"graphics-symbol\" with aria-roledescription=\"data point\" and a label such as \"Mon: Steps 8,420\".","A visually hidden table mirrors the data (caption, column headers, row headers), so screen reader users can read it row by row.","Axis labels, gridlines and decorative fills are aria-hidden so the data is not read twice.","A crosshair line follows the focused point so the tooltip is anchored to a position on the x axis."],
    reducedMotion: "Entrance animation is removed and value tweens jump to the final value. Tooltip movement drops to 0.01ms.",
  },
  props: [
    { name: "data", type: "ChartDatum[]", description: "Rows. Each row has the index field and one numeric field per series." },
    { name: "index", type: "string", description: "Field that holds the category (x axis) label." },
    { name: "series", type: "ChartSeries[]", description: "Series definitions: key, label, tone (1 to 10)." },
    { name: "curve", type: "'linear' | 'monotone' | 'natural' | 'step' | 'basis'", default: "'monotone'", description: "Interpolation." },
    { name: "dots", type: "boolean", default: "false", description: "Draw a dot on every point." },
    { name: "glow", type: "boolean", default: "false", description: "Soft blur behind the lines." },
    { name: "valueFormat", type: "ValueFormat", default: "'number'", description: "'number', 'compact', 'currency' (USD, no decimals), 'percent' or a function." },
    { name: "height", type: "number", default: "240", description: "Plot height in px. Width fills the container." },
    { name: "showGrid / showXAxis / showYAxis", type: "boolean", default: "true", description: "Toggle gridlines and axis labels." },
    { name: "domain", type: "[number, number]", description: "Fix the y range instead of 0 to max." },
    { name: "label", type: "string", description: "Accessible summary of the chart." },
    { name: "xstyle", type: "StyleXStyles", description: "StyleX overrides for the wrapper." },
  ],
  related: ["area-chart","bar-chart","combo-chart","sparkline","chart-card"],
};
export default page;
