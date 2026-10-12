import { ChartCard, ChartLegend, ComboChart, EmptyState, Skeleton } from 'oniva-ui';
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

const Stage = () => (
  <div style={{ width: 540 }}>
    <ChartCard title="Revenue and margin" legend={<ChartLegend items={[{ label: 'Revenue', tone: 1 }, { label: 'Margin', tone: 3, }]} />}>
      <ComboChart data={revenue} index="month" bars={[{ key: 'revenue', label: 'Revenue', tone: 1 }]} lines={[{ key: 'margin', label: 'Margin', tone: 3 }]} barFormat="currency" lineFormat="percent" height={240} />
    </ChartCard>
  </div>
);

const Shape = () => (
  <div style={{ display: 'grid', gap: 12 }}>
    <pre tabIndex={0} style={{ margin: 0, padding: 12, borderRadius: 10, overflow: 'auto', fontSize: 12.5, lineHeight: '18px', background: 'var(--oniva-color-surface-inset)', color: 'var(--oniva-color-text)' }}>
      <code>{"// one data array, two series groups\nconst bars  = [{ key: 'revenue', label: 'Revenue', tone: 1 }];\nconst lines = [{ key: 'margin',  label: 'Margin',  tone: 3 }];\n\n[\n  { month: 'Jan', revenue: 42800, margin: 27 },\n  { month: 'Feb', revenue: 46100, margin: 29 },\n]\n// <ComboChart data={data} index=\"month\" bars={bars} lines={lines}\n//   barFormat=\"currency\" lineFormat=\"percent\" />"}</code>
    </pre>
    <ul style={{ margin: 0, paddingInlineStart: 18, display: 'grid', gap: 4, fontSize: 14, lineHeight: '20px' }}>
      <li>{"bars and lines are separate ChartSeries arrays. A key may not appear in both."}</li>
      <li>{"Each side formats on its own: barFormat for the left axis, lineFormat for the right."}</li>
      <li>{"Percent values are whole numbers (39 means 39%), not fractions."}</li>
      <li>{"Rows must be ordered by x."}</li>
    </ul>
  </div>
);

const page: DocPage = {
  slug: "combo-chart",
  status: 'Stable',
  version: '0.1.0',
  importName: "ComboChart",
  group: ['Components', 'Charts'],
  sourcePath: "charts/ComboChart",
  lede: "Bars and lines on one x axis. It handles two measures in different units, such as revenue in dollars and margin in percent, each on its own axis.",
  anatomy: {
    intro: "Six parts. The plot, bars and lines are always present. The right axis exists only with dualAxis.",
    Render: Stage,
    parts: [
      { name: "Plot", description: "Responsive svg, 240px here. Extra right margin when dualAxis is on.", selector: "svg[role=\"group\"]" },
      { name: "Bar series", description: "Rounded bars on the left axis. Same grow entrance as BarChart.", selector: "svg[role=\"group\"] > g:not([aria-hidden]) path" },
      { name: "Line series", description: "2px stroke drawn on top of the bars, on the right axis when dualAxis.", selector: "svg[role=\"group\"] > g > path[stroke]" },
      { name: "Line dot", description: "A dot per point with a surface-colour ring. Decorative; the invisible x columns are the hit targets.", selector: "svg[role=\"group\"] circle" },
      { name: "Left and right axes", description: "Left labels follow barFormat, right labels follow lineFormat. 11px muted.", selector: "svg[role=\"group\"] > g[aria-hidden=\"true\"] text" },
      { name: "Legend", description: "ChartLegend. Name the axis in the label if units differ: \"Margin (right)\".", selector: "ul" },
    ],
  },
  usage: {
    use: ["A volume and a rate over the same x: revenue and margin.","A target or forecast line over actual bars.","Two related measures where a shared y axis would flatten one."],
    avoid: [
      { text: "Two series with the same unit. A shared axis is simpler.", instead: { slug: "line-chart", label: "LineChart" } },
      { text: "Comparing categories only.", instead: { slug: "bar-chart", label: "BarChart" } },
      { text: "More than one bar series and more than one line series.", instead: { slug: "bar-chart", label: "BarChart" } },
    ],
  },
  playground: {
    controls: [
      { kind: 'toggle', key: 'dualAxis', label: 'Dual axis' },
      { kind: 'segmented', key: 'curve', label: 'Line curve', options: ['monotone', 'linear', 'natural', 'step', 'basis'] },
      { kind: 'segmented', key: 'barFormat', label: 'Bar format', options: ['number', 'compact', 'currency'] },
      { kind: 'segmented', key: 'lineFormat', label: 'Line format', options: ['number', 'percent'] },
    ],
    initial: { dualAxis: true, curve: 'monotone', barFormat: 'currency', lineFormat: 'percent' },
    render: (p) => (
      <div style={{ width: 'min(540px, 100%)' }}>
        <ComboChart data={revenue} index="month" bars={[{ key: 'revenue', label: 'Revenue', tone: 1 }]} lines={[{ key: 'margin', label: 'Margin', tone: 3 }]} dualAxis={Boolean(p.dualAxis)} curve={p.curve as 'monotone'} barFormat={p.barFormat as 'currency'} lineFormat={p.lineFormat as 'percent'} height={260} />
      </div>
    ),
    code: (p) => {
      const attrs = [!p.dualAxis && 'dualAxis={false}', p.curve !== 'monotone' && `curve="${p.curve}"`, p.barFormat !== 'number' && `barFormat="${p.barFormat}"`, p.lineFormat !== 'number' && `lineFormat="${p.lineFormat}"`].filter(Boolean).join(' ');
      return `<ComboChart data={data} index="month" bars={[{ key: 'revenue' }]} lines={[{ key: 'margin' }]}${attrs ? ' ' + attrs : ''} />`;
    },
  },
  states: [
    { name: "Dual axis", description: "Bars on the left, line on the right. Default.", Render: () => (
      <div style={{ width: 480 }}><ComboChart data={revenue} index="month" bars={[{ key: 'revenue', label: 'Revenue', tone: 1 }]} lines={[{ key: 'margin', label: 'Margin', tone: 3 }]} barFormat="currency" lineFormat="percent" height={220} /></div>
    ) },
    { name: "Single axis", description: "dualAxis={false} puts both on one scale. Only when units match.", Render: () => (
      <div style={{ width: 480 }}><ComboChart data={revenue} index="month" bars={[{ key: 'revenue', label: 'Revenue', tone: 1 }]} lines={[{ key: 'expenses', label: 'Expenses', tone: 3 }]} dualAxis={false} barFormat="currency" height={220} /></div>
    ) },
    { name: "Two bars, one line", description: "Multiple series per side are allowed. Keep the total under four.", Render: () => (
      <div style={{ width: 480 }}><ComboChart data={revenue} index="month" bars={[{ key: 'revenue', label: 'Revenue', tone: 1 }, { key: 'expenses', label: 'Expenses', tone: 6 }]} lines={[{ key: 'margin', label: 'Margin', tone: 3 }]} barFormat="currency" lineFormat="percent" height={220} /></div>
    ) },
    { name: "Loading", description: "Skeleton at the chart height. The chart is not mounted until data exists.", Render: () => (
<ChartCard title="Revenue and margin"><Skeleton variant="rect" width="100%" height={260} /></ChartCard>
    ) },
    { name: "Empty", description: "No data in range. Say why and offer a way out. The chart is not mounted.", Render: () => (
<ChartCard title="Revenue and margin"><EmptyState title="No data for this range" description="Pick a longer period or check that the source is connected." /></ChartCard>
    ) },
    { name: "Single point", description: "One row draws one bar and one dot, with no line segment.", Render: () => (
      <div style={{ width: 480 }}><ComboChart data={revenue.slice(0, 1)} index="month" bars={[{ key: 'revenue', label: 'Revenue', tone: 1 }]} lines={[{ key: 'margin', label: 'Margin', tone: 3 }]} barFormat="currency" lineFormat="percent" height={180} /></div>
    ) },
  ],
  sections: [
    {
      type: 'text', id: 'choosing-a-chart', title: 'Choosing a chart',
      body: (<p style={{ margin: 0 }}>Use a combo chart when two measures share an x axis but not a unit. See the full decision table on <a href="#/components/bar-chart">Bar chart</a>.</p>),
    },
    { type: 'custom', id: 'data-shape', title: 'Data shape', Render: Shape },
    {
      type: 'rules', id: 'formatting', title: 'Axes, labels and numbers',
      items: [
        { title: "Tabular numerals", body: "Axis labels (11px, medium, muted), tooltip values and legend values use tabular-nums, so digits stay in place when values change." },
        { title: "Two axes, two formats", body: "barFormat styles the left axis and the bar tooltip rows. lineFormat styles the right axis and line rows. Keep both compact." },
        { title: "Percent is a whole number", body: "lineFormat=\"percent\" appends % to the number you pass. 39 shows 39%." },
        { title: "Align the grids", body: "Both axes use about four ticks so gridlines line up. Avoid forcing one axis to zero and letting the other float." },
        { title: "Units belong in the format", body: "Use valueFormat=\"currency\", \"percent\" or a function such as (n) => `${n} ms`. Never concatenate units into category labels." },
      ],
    },
    {
      type: 'rules', id: 'color-and-palette', title: 'Color and palette',
      items: [
        { title: "Ten chart tokens", body: "--oniva-color-chart-1 to --oniva-color-chart-10 are fixed hues, independent of the accent. Pick by position or pass tone (1-based). Tone wraps after 10." },
        { title: "Bars quieter than lines", body: "Use a calm tone for bars and a contrasting one for the line (tone 1 and 3 here) so the rate stands out." },
        { title: "Name the axis in the legend", body: "Color alone cannot say which axis a series uses. \"Margin (right axis)\" removes the guess." },
        { title: "Color-blind safe", body: "Every mark is at least 3:1 on white. In the light palette, series 1 to 10 stay at least 3.3 delta E apart under protanopia, deuteranopia and tritanopia simulation. Do not rely on that alone: label series in the legend or tooltip." },
        { title: "Track and grid", body: "Empty tracks and gridlines use --oniva-color-chart-track. The hover band uses --oniva-color-chart-cursor." },
      ],
    },
    {
      type: 'rules', id: 'keyboard-exploration', title: 'Keyboard exploration',
      intro: "Tab to the chart, then use the arrow keys to read one x value at a time. Each stop lists every series at that x.",
      items: [
        { title: 'One tab stop', body: 'The chart is a single focusable group (tabindex 0). Tab enters it once and the next Tab leaves it, so a page with six charts costs six tab stops, not hundreds.' },
        { title: 'Arrows move between x values', body: "Right and Down move to the next x, Left and Up to the previous one. Home and End jump to the first and last. Each stop lists every bar and line series at that x." },
        { title: 'Focus shows the tooltip', body: 'Moving focus opens the same tooltip as hover, anchored to the focused mark. Esc closes it without moving focus. The focused mark gets a 2px focus ring, 2px offset.' },
      ],
    },
    {
      type: 'rules', id: 'empty-loading-single', title: 'Empty, loading and single-point states',
      intro: "The chart does not draw its own placeholder. Decide before you mount it.",
      items: [
        { title: "Loading", body: "Render a Skeleton at the same height (260px here) so the card does not jump. Mount the chart when data arrives so the entrance animation plays once." },
        { title: "Empty", body: "Use EmptyState inside the ChartCard. Name the cause (No orders in this range) and give one action. Do not render an empty plot with axes." },
        { title: "One point", body: "With one row you see a bar and a lone dot. The line has nothing to connect. Show two KPI values until a second period exists." },
      ],
    },
    {
      type: 'rules', id: 'motion', title: 'Motion',
      items: [
        { title: "Entrance", body: "Bars grow from the baseline over 450ms with a 40ms stagger. The line draws over 800ms and dots pop in after it." },
        { title: "Data updates", body: "Changing the data tweens existing values over 400ms (ease-out quart) instead of replacing the marks. If the number of rows changes, the chart snaps to the new data." },
        { title: "Reduced motion", body: "With prefers-reduced-motion the entrance animation is removed (animation-name none) and value tweens jump straight to the final value. Tooltip movement drops to 0.01ms." },
      ],
    },

  ],
  content: { rules: [
    { title: "Name both measures in the title", body: "Revenue and margin, not Combo chart." },
    { title: "Units in the legend", body: "Revenue ($), Margin (%)." },
    { title: "Short series labels", body: "One or two words, since they appear in the tooltip as well." },
  ] },
  accessibility: {
    keyboard: [
      { keys: ["Tab"], action: "Moves focus into the chart, then out to the next control. The chart is one tab stop." },
      { keys: ["→","↓"], action: "Moves focus to the next point. In right-to-left layouts → and ← swap." },
      { keys: ["←","↑"], action: "Moves focus to the previous point." },
      { keys: ["Home","End"], action: "Jumps to the first or last point." },
      { keys: ["Esc"], action: "Closes the tooltip. Focus stays where it is." },
    ],
    notes: ["The plot is an svg with role=\"group\", aria-roledescription=\"chart\" and an aria-label (default names the bars and lines).","Each mark is role=\"graphics-symbol\" with aria-roledescription=\"data point\" and a label such as \"Mon: Steps 8,420\".","A visually hidden table mirrors the data (caption, column headers, row headers), so screen reader users can read it row by row.","Axis labels, gridlines and decorative fills are aria-hidden so the data is not read twice."],
    reducedMotion: "Entrance animation is removed and value tweens jump to the final value. Tooltip movement drops to 0.01ms.",
  },
  props: [
    { name: "data", type: "ChartDatum[]", description: "Rows. Each row has the index field and one numeric field per series." },
    { name: "index", type: "string", description: "Field that holds the category (x axis) label." },
    { name: "bars", type: "ChartSeries[]", description: "Series drawn as bars on the left axis." },
    { name: "lines", type: "ChartSeries[]", description: "Series drawn as lines (right axis when dualAxis)." },
    { name: "barFormat", type: "ValueFormat", default: "'number'", description: "Format for bar values and the left axis." },
    { name: "lineFormat", type: "ValueFormat", default: "'number'", description: "Format for line values and the right axis." },
    { name: "dualAxis", type: "boolean", default: "true", description: "Give lines their own right-hand axis." },
    { name: "curve", type: "'linear' | 'monotone' | 'natural' | 'step' | 'basis'", default: "'monotone'", description: "Line interpolation." },
    { name: "height", type: "number", default: "240", description: "Plot height in px. Width fills the container." },
    { name: "label", type: "string", description: "Accessible summary of the chart." },
    { name: "xstyle", type: "StyleXStyles", description: "StyleX overrides for the wrapper." },
  ],
  related: ["bar-chart","line-chart","area-chart","chart-legend","chart-card"],
};
export default page;
