import { ChartCard, ContributionHeatmap, EmptyState, Heatmap, Skeleton } from 'oniva-ui';
import type { DocPage } from '../types';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const hours = ['9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p'];
const tickets = [
  [4, 9, 14, 8, 5, 11, 12, 7],
  [6, 12, 18, 10, 7, 13, 15, 9],
  [5, 10, 16, 9, 6, 12, 14, 8],
  [7, 13, 20, 12, 8, 15, 17, 10],
  [3, 8, 11, 6, 4, 7, 9, 5],
];
const contributions = Array.from({ length: 90 }, (_, i) => {
  const d = new Date(Date.UTC(2026, 6, 14 + i));
  return { date: d.toISOString().slice(0, 10), value: (i * 7 + (i % 5) * 3) % 9 };
});

const Stage = () => (
  <div style={{ width: 520 }}>
    <ChartCard title="Support tickets by hour" value="3,248" unit="this month">
      <Heatmap values={tickets} rows={days} columns={hours} unit="tickets" tone={5} />
    </ChartCard>
  </div>
);

const Shape = () => (
  <div style={{ display: 'grid', gap: 12 }}>
    <pre tabIndex={0} style={{ margin: 0, padding: 12, borderRadius: 10, overflow: 'auto', fontSize: 12.5, lineHeight: '18px', background: 'var(--oniva-color-surface-inset)', color: 'var(--oniva-color-text)' }}>
      <code>{"interface HeatmapProps {\n  values: number[][];  // values[row][column]\n  rows: string[];      // row labels, top to bottom\n  columns: string[];   // column labels, left to right\n}\n\ninterface ContributionDay { date: string; value: number }  // ISO date, YYYY-MM-DD\n\nvalues = [[4, 9, 14], [6, 12, 18]]\nrows = ['Mon', 'Tue']\ncolumns = ['9a', '10a', '11a']\n// <Heatmap values={values} rows={rows} columns={columns} unit=\"tickets\" />  // or <ContributionHeatmap data={days} range=\"monthly\" />"}</code>
    </pre>
    <ul style={{ margin: 0, paddingInlineStart: 18, display: 'grid', gap: 4, fontSize: 14, lineHeight: '20px' }}>
      <li>{"values[i][j] pairs with rows[i] and columns[j]. Missing cells count as 0."}</li>
      <li>{"Intensity is relative to the maximum cell, in four steps. One outlier flattens everything else, so cap or log outliers first."}</li>
      <li>{"ContributionHeatmap takes a flat list of { date, value } and slices to the last 371, 35 or 7 days."}</li>
      <li>{"Zero values draw in the neutral track color."}</li>
    </ul>
  </div>
);

const page: DocPage = {
  slug: "heatmap",
  status: 'Stable',
  version: '0.1.0',
  importName: "Heatmap",
  group: ['Components', 'Charts'],
  sourcePath: "charts/Heatmap",
  lede: "A grid where color intensity shows a value. It handles two moments: finding hot spots across two dimensions, and reading activity over weeks as a calendar.",
  anatomy: {
    intro: "Five parts. The cells and both label axes are always present. The legend appears on the calendar variant.",
    Render: Stage,
    parts: [
      { name: "Cell", description: "Rounded rect (6px radius), 22px tall in a 26px row with a 4px gap. Width fills the plot.", selector: "svg[role=\"group\"] rect" },
      { name: "Row labels", description: "11px muted, right-aligned in a left margin sized to the longest label.", selector: "svg[role=\"group\"] g > text" },
      { name: "Column labels", description: "11px muted under the grid, centered on each column.", selector: "svg[role=\"group\"] > g > text:first-of-type" },
      { name: "Intensity", description: "Four steps: 22%, 42%, 68% and 100% opacity of the tone. Zero is the neutral track color.", selector: "svg[role=\"group\"] rect:nth-of-type(3)" },
      { name: "Plot", description: "Height is rows x 26px + 28px unless you pass height.", selector: "svg[role=\"group\"]" },
    ],
  },
  usage: {
    use: ["Hot spots across two dimensions: weekday by hour, plan by region.","Activity over a year, 5 weeks or 7 days with ContributionHeatmap.","Spotting patterns where exact values matter less than shape."],
    avoid: [
      { text: "Exact values or precise comparison.", instead: { slug: "bar-chart", label: "BarChart" } },
      { text: "A relationship between two measures.", instead: { slug: "scatter-chart", label: "ScatterChart" } },
      { text: "A row of uptime status.", instead: { slug: "tracker", label: "Tracker" } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'mode', label: 'Mode', options: ['matrix', 'calendar'] },
      { kind: 'segmented', key: 'range', label: 'Calendar range', options: ['weekly', 'monthly', 'yearly'] },
      { kind: 'number', key: 'tone', label: 'Tone (1 to 10)', min: 1, max: 10, step: 1 },
      { kind: 'toggle', key: 'showLegend', label: 'Legend (calendar)' },
    ],
    initial: { mode: 'matrix', range: 'monthly', tone: 5, showLegend: true },
    render: (p) => (
      <div style={{ width: 'min(560px, 100%)' }}>
        {p.mode === 'matrix' ? (
          <Heatmap values={tickets} rows={days} columns={hours} unit="tickets" tone={Number(p.tone)} />
        ) : (
          <ContributionHeatmap key={String(p.range)} data={contributions} range={p.range as 'monthly'} tone={Number(p.tone)} unit="ticket" showLegend={Boolean(p.showLegend)} />
        )}
      </div>
    ),
    code: (p) => {
      if (p.mode === 'matrix') return `<Heatmap values={values} rows={days} columns={hours} unit="tickets"${p.tone !== 5 ? ` tone={${p.tone}}` : ''} />`;
      const attrs = [p.range !== 'yearly' && `range="${p.range}"`, p.tone !== 5 && `tone={${p.tone}}`, !p.showLegend && 'showLegend={false}'].filter(Boolean).join(' ');
      return `<ContributionHeatmap data={days}${attrs ? ' ' + attrs : ''} unit="ticket" />`;
    },
  },
  states: [
    { name: "Matrix", description: "Rows by columns. Darker is more.", Render: () => (
      <div style={{ width: 460 }}><Heatmap values={tickets} rows={days} columns={hours} unit="tickets" /></div>
    ) },
    { name: "Calendar, monthly", description: "Last 5 weeks, one cell per day.", Render: () => (
      <div style={{ width: 460 }}><ContributionHeatmap data={contributions} range="monthly" unit="ticket" /></div>
    ) },
    { name: "Calendar, weekly", description: "Last 7 days in one row of larger cells.", Render: () => (
      <div style={{ width: 460 }}><ContributionHeatmap data={contributions} range="weekly" unit="ticket" /></div>
    ) },
    { name: "Calendar, yearly", description: "Last 53 weeks. Month labels along the top.", Render: () => (
      <div style={{ width: 600 }}><ContributionHeatmap data={contributions} range="yearly" unit="ticket" /></div>
    ) },
    { name: "Sparse", description: "Zero cells use the neutral track color, not the lightest tone, so a quiet day reads as empty.", Render: () => (
      <div style={{ width: 460 }}><Heatmap values={[[0, 0, 2, 0], [0, 5, 0, 0], [0, 0, 0, 9]]} rows={['Mon', 'Tue', 'Wed']} columns={['9a', '10a', '11a', '12p']} unit="tickets" /></div>
    ) },
    { name: "Loading", description: "Skeleton at the chart height. The chart is not mounted until data exists.", Render: () => (
<ChartCard title="Support tickets by hour"><Skeleton variant="rect" width="100%" height={200} /></ChartCard>
    ) },
    { name: "Empty", description: "No data in range. Say why and offer a way out. The chart is not mounted.", Render: () => (
<ChartCard title="Support tickets by hour"><EmptyState title="No data for this range" description="Pick a longer period or check that the source is connected." /></ChartCard>
    ) },
    { name: "Single point", description: "One cell is a colored square. Show the number.", Render: () => (
      <div style={{ width: 360 }}><Heatmap values={[[12]]} rows={['Mon']} columns={['9a']} unit="tickets" /></div>
    ) },
  ],
  sections: [
    {
      type: 'text', id: 'choosing-a-chart', title: 'Choosing a chart',
      body: (<p style={{ margin: 0 }}>Use a heatmap when position on two dimensions matters more than exact values. See the full decision table on <a href="#/components/bar-chart">Bar chart</a>.</p>),
    },
    { type: 'custom', id: 'data-shape', title: 'Data shape', Render: Shape },
    {
      type: 'rules', id: 'formatting', title: 'Axes, labels and numbers',
      items: [
        { title: "Tabular numerals", body: "Axis labels (11px, medium, muted), tooltip values and legend values use tabular-nums, so digits stay in place when values change." },
        { title: "Exact values live in the tooltip", body: "Cells carry no numbers. Hover or focus shows \"Tue, 11a\" with the value and unit. Pass unit=\"tickets\" to name it." },
        { title: "Short axis labels", body: "Row labels size the left margin (6.5px per character). Keep rows to 3 to 12 characters and columns to 3 characters." },
        { title: "Month labels on the calendar", body: "Yearly shows month names above the grid, thinned so neighbours stay 28px apart. Weekly shows weekday names under each cell." },
        { title: "Units belong in the format", body: "Use valueFormat=\"currency\", \"percent\" or a function such as (n) => `${n} ms`. Never concatenate units into category labels." },
      ],
    },
    {
      type: 'rules', id: 'color-and-palette', title: 'Color and palette',
      items: [
        { title: "Ten chart tokens", body: "--oniva-color-chart-1 to --oniva-color-chart-10 are fixed hues, independent of the accent. Pick by position or pass tone (1-based). Tone wraps after 10." },
        { title: "One tone, four steps", body: "Intensity is opacity of one tone (22%, 42%, 68%, 100%). It reads as sequential data, not categories." },
        { title: "Lightest step is not zero", body: "Zero uses the neutral track color so \"none\" differs from \"a little\". The lightest tone step is 22% opacity." },
        { title: "Intensity alone is not enough", body: "Opacity differences are subtle for low-vision users. The tooltip, the visually hidden table and the calendar legend (Less to More) carry the numbers." },
        { title: "Color-blind safe", body: "Every mark is at least 3:1 on white. In the light palette, series 1 to 10 stay at least 3.3 delta E apart under protanopia, deuteranopia and tritanopia simulation. Do not rely on that alone: label series in the legend or tooltip." },
        { title: "Track and grid", body: "Empty tracks and gridlines use --oniva-color-chart-track. The hover band uses --oniva-color-chart-cursor." },
      ],
    },
    {
      type: 'rules', id: 'keyboard-exploration', title: 'Keyboard exploration',
      intro: "Tab to the chart, then use the arrow keys to step through each cell. Each stop opens its tooltip.",
      items: [
        { title: 'One tab stop', body: 'The chart is a single focusable group (tabindex 0). Tab enters it once and the next Tab leaves it, so a page with six charts costs six tab stops, not hundreds.' },
        { title: 'Arrows move between cells', body: "Right and Down move to the next cell in reading order (row by row), Left and Up to the previous. Home and End jump to the first and last cell. Each stop reads \"Tue, 11a: 18 tickets\"." },
        { title: 'Focus shows the tooltip', body: 'Moving focus opens the same tooltip as hover, anchored to the focused mark. Esc closes it without moving focus. The focused mark gets a 2px focus ring, 2px offset.' },
      ],
    },
    {
      type: 'rules', id: 'empty-loading-single', title: 'Empty, loading and single-point states',
      intro: "The chart does not draw its own placeholder. Decide before you mount it.",
      items: [
        { title: "Loading", body: "Render a Skeleton at the same height (200px here) so the card does not jump. Mount the chart when data arrives so the entrance animation plays once." },
        { title: "Empty", body: "Use EmptyState inside the ChartCard. Name the cause (No orders in this range) and give one action. Do not render an empty plot with axes." },
        { title: "One point", body: "One cell has nothing to compare against. Show a number. A matrix is useful from about 3 x 5 cells." },
      ],
    },
    {
      type: 'rules', id: 'motion', title: 'Motion',
      items: [
        { title: "Entrance", body: "Cells fade in over 400ms with a diagonal stagger of 12ms per row plus column, so the grid sweeps from the top left." },
        { title: "Data updates", body: "Heatmap does not tween. Cells update immediately when values change; opacity transitions are not applied." },
        { title: "Reduced motion", body: "With prefers-reduced-motion the entrance animation is removed (animation-name none) and value tweens jump straight to the final value. Tooltip movement drops to 0.01ms." },
      ],
    },

  ],
  content: { rules: [
    { title: "Name the unit", body: "tickets, commits. Plural nouns for the matrix, singular for the calendar (it pluralises)." },
    { title: "Axis labels are short", body: "Mon, 9a. Avoid sentences." },
    { title: "Explain the scale", body: "Add \"Darker is more\" or use the legend on the calendar." },
  ] },
  accessibility: {
    keyboard: [
      { keys: ["Tab"], action: "Moves focus into the chart, then out to the next control. The chart is one tab stop." },
      { keys: ["→","↓"], action: "Moves focus to the next cell. In right-to-left layouts → and ← swap." },
      { keys: ["←","↑"], action: "Moves focus to the previous cell." },
      { keys: ["Home","End"], action: "Jumps to the first or last cell." },
      { keys: ["Esc"], action: "Closes the tooltip. Focus stays where it is." },
    ],
    notes: ["The grid is an svg with role=\"group\" and a label such as \"Heatmap of 5 rows by 8 columns, peak 20 tickets\".","Each cell is a role=\"graphics-symbol\" stop with a label like \"Tue, 11a: 18 tickets\".","A visually hidden table has the row labels as headers and one column per column label, so values are readable without color.","Do not rely on color intensity alone. Tell users the peak in the chart label."],
    reducedMotion: "Entrance animation is removed and value tweens jump to the final value. Tooltip movement drops to 0.01ms.",
  },
  props: [
    { name: "values", type: "number[][]", description: "Matrix, values[row][col]." },
    { name: "rows", type: "string[]", description: "Row labels." },
    { name: "columns", type: "string[]", description: "Column labels." },
    { name: "tone", type: "number", default: "5", description: "1-based palette index." },
    { name: "unit", type: "string", default: "''", description: "Unit shown in tooltips." },
    { name: "height", type: "number", description: "Plot height. Default rows x 26 + 28." },
    { name: "label", type: "string", description: "Accessible summary of the chart." },
    { name: "xstyle", type: "StyleXStyles", description: "StyleX overrides for the wrapper." },
    { name: "ContributionHeatmap: data", type: "ContributionDay[]", description: "Daily values: { date: \"YYYY-MM-DD\", value }." },
    { name: "ContributionHeatmap: range", type: "'weekly' | 'monthly' | 'yearly'", default: "'yearly'", description: "Last 7 days, 5 weeks or 53 weeks." },
    { name: "ContributionHeatmap: showLegend", type: "boolean", default: "true", description: "Show the Less to More legend." },
  ],
  related: ["scatter-chart","tracker","bar-chart","chart-card","calendar"],
};
export default page;
