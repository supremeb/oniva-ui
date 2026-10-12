import { BarChart, ChartCard, ChartLegend, EmptyState, Skeleton } from 'oniva-ui';
import type { DocPage } from '../types';

const revenue = [
  { month: 'Jan', revenue: 42800, expenses: 31200 },
  { month: 'Feb', revenue: 46100, expenses: 32800 },
  { month: 'Mar', revenue: 51900, expenses: 34100 },
  { month: 'Apr', revenue: 49600, expenses: 35900 },
  { month: 'May', revenue: 57300, expenses: 36400 },
  { month: 'Jun', revenue: 63200, expenses: 38800 },
];
const revSeries = [
  { key: 'revenue', label: 'Revenue', tone: 1 },
  { key: 'expenses', label: 'Expenses', tone: 3 },
];

const Stage = () => (
  <div style={{ width: 520 }}>
    <ChartCard title="Revenue vs expenses" value="$63,200" unit="June" delta={{ label: '10.3%', trend: 'up' }} legend={<ChartLegend items={[{ label: 'Revenue', tone: 1 }, { label: 'Expenses', tone: 3 }]} />}>
      <BarChart data={revenue} index="month" series={revSeries} valueFormat="currency" height={220} />
    </ChartCard>
  </div>
);

const Choose = () => (
  <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
    <thead>
      <tr>
        <th scope="col" style={{ textAlign: 'start', padding: '8px 12px 8px 0', color: 'var(--oniva-color-text-muted)', fontWeight: 500 }}>If you need to</th>
        <th scope="col" style={{ textAlign: 'start', padding: '8px 0', color: 'var(--oniva-color-text-muted)', fontWeight: 500 }}>Use</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style={{ padding: '8px 12px 8px 0', borderTop: '1px solid var(--oniva-color-border)' }}>Compare values across categories</td>
        <td style={{ padding: '8px 0', borderTop: '1px solid var(--oniva-color-border)' }}><a href="#/components/bar-chart">BarChart</a></td>
      </tr>
      <tr>
        <td style={{ padding: '8px 12px 8px 0', borderTop: '1px solid var(--oniva-color-border)' }}>Rank named items with the value beside each name</td>
        <td style={{ padding: '8px 0', borderTop: '1px solid var(--oniva-color-border)' }}><a href="#/components/bar-list">BarList</a></td>
      </tr>
      <tr>
        <td style={{ padding: '8px 12px 8px 0', borderTop: '1px solid var(--oniva-color-border)' }}>Show a trend over time, one to four series</td>
        <td style={{ padding: '8px 0', borderTop: '1px solid var(--oniva-color-border)' }}><a href="#/components/line-chart">LineChart</a></td>
      </tr>
      <tr>
        <td style={{ padding: '8px 12px 8px 0', borderTop: '1px solid var(--oniva-color-border)' }}>Show volume or a stacked total over time</td>
        <td style={{ padding: '8px 0', borderTop: '1px solid var(--oniva-color-border)' }}><a href="#/components/area-chart">AreaChart</a></td>
      </tr>
      <tr>
        <td style={{ padding: '8px 12px 8px 0', borderTop: '1px solid var(--oniva-color-border)' }}>Plot two units over the same x axis (revenue and margin)</td>
        <td style={{ padding: '8px 0', borderTop: '1px solid var(--oniva-color-border)' }}><a href="#/components/combo-chart">ComboChart</a></td>
      </tr>
      <tr>
        <td style={{ padding: '8px 12px 8px 0', borderTop: '1px solid var(--oniva-color-border)' }}>Show parts of one whole, five slices or fewer</td>
        <td style={{ padding: '8px 0', borderTop: '1px solid var(--oniva-color-border)' }}><a href="#/components/donut-chart">DonutChart</a></td>
      </tr>
      <tr>
        <td style={{ padding: '8px 12px 8px 0', borderTop: '1px solid var(--oniva-color-border)' }}>Show a few goals as progress rings</td>
        <td style={{ padding: '8px 0', borderTop: '1px solid var(--oniva-color-border)' }}><a href="#/components/activity-rings">ActivityRings</a></td>
      </tr>
      <tr>
        <td style={{ padding: '8px 12px 8px 0', borderTop: '1px solid var(--oniva-color-border)' }}>Compare progress across 2 to 4 items on one dial</td>
        <td style={{ padding: '8px 0', borderTop: '1px solid var(--oniva-color-border)' }}><a href="#/components/radial-chart">RadialChart</a></td>
      </tr>
      <tr>
        <td style={{ padding: '8px 12px 8px 0', borderTop: '1px solid var(--oniva-color-border)' }}>Show one value on a bounded range</td>
        <td style={{ padding: '8px 0', borderTop: '1px solid var(--oniva-color-border)' }}><a href="#/components/gauge">Gauge</a></td>
      </tr>
      <tr>
        <td style={{ padding: '8px 12px 8px 0', borderTop: '1px solid var(--oniva-color-border)' }}>Show a split or a score against ranges in one bar</td>
        <td style={{ padding: '8px 0', borderTop: '1px solid var(--oniva-color-border)' }}><a href="#/components/category-bar">CategoryBar</a></td>
      </tr>
      <tr>
        <td style={{ padding: '8px 12px 8px 0', borderTop: '1px solid var(--oniva-color-border)' }}>Show drop-off through ordered steps</td>
        <td style={{ padding: '8px 0', borderTop: '1px solid var(--oniva-color-border)' }}><a href="#/components/funnel-chart">FunnelChart</a></td>
      </tr>
      <tr>
        <td style={{ padding: '8px 12px 8px 0', borderTop: '1px solid var(--oniva-color-border)' }}>Show flow between stages</td>
        <td style={{ padding: '8px 0', borderTop: '1px solid var(--oniva-color-border)' }}><a href="#/components/sankey-chart">SankeyChart</a></td>
      </tr>
      <tr>
        <td style={{ padding: '8px 12px 8px 0', borderTop: '1px solid var(--oniva-color-border)' }}>Show the relationship between two measures</td>
        <td style={{ padding: '8px 0', borderTop: '1px solid var(--oniva-color-border)' }}><a href="#/components/scatter-chart">ScatterChart</a></td>
      </tr>
      <tr>
        <td style={{ padding: '8px 12px 8px 0', borderTop: '1px solid var(--oniva-color-border)' }}>Compare profiles across 5 to 8 axes</td>
        <td style={{ padding: '8px 0', borderTop: '1px solid var(--oniva-color-border)' }}><a href="#/components/radar-chart">RadarChart</a></td>
      </tr>
      <tr>
        <td style={{ padding: '8px 12px 8px 0', borderTop: '1px solid var(--oniva-color-border)' }}>Show density across two dimensions or a calendar</td>
        <td style={{ padding: '8px 0', borderTop: '1px solid var(--oniva-color-border)' }}><a href="#/components/heatmap">Heatmap</a></td>
      </tr>
      <tr>
        <td style={{ padding: '8px 12px 8px 0', borderTop: '1px solid var(--oniva-color-border)' }}>Show status over many time slots</td>
        <td style={{ padding: '8px 0', borderTop: '1px solid var(--oniva-color-border)' }}><a href="#/components/tracker">Tracker</a></td>
      </tr>
      <tr>
        <td style={{ padding: '8px 12px 8px 0', borderTop: '1px solid var(--oniva-color-border)' }}>Show time spent in each stage</td>
        <td style={{ padding: '8px 0', borderTop: '1px solid var(--oniva-color-border)' }}><a href="#/components/stage-bars">StageBars</a></td>
      </tr>
      <tr>
        <td style={{ padding: '8px 12px 8px 0', borderTop: '1px solid var(--oniva-color-border)' }}>Show a trend inside a table cell or KPI tile</td>
        <td style={{ padding: '8px 0', borderTop: '1px solid var(--oniva-color-border)' }}><a href="#/components/sparkline">Sparkline</a></td>
      </tr>
    </tbody>
  </table>
);

const Shape = () => (
  <div style={{ display: 'grid', gap: 12 }}>
    <pre tabIndex={0} style={{ margin: 0, padding: 12, borderRadius: 10, overflow: 'auto', fontSize: 12.5, lineHeight: '18px', background: 'var(--oniva-color-surface-inset)', color: 'var(--oniva-color-text)' }}>
      <code>{"type ChartDatum = Record<string, string | number>;\n\ninterface ChartSeries {\n  key: string;     // field in each datum\n  label?: string;  // legend + tooltip name, defaults to key\n  tone?: number;   // 1 to 10, defaults to position + 1\n}\n\ntype ValueFormat = 'number' | 'compact' | 'currency' | 'percent' | ((n: number) => string);\n\n// data\n[\n  { month: 'Jan', revenue: 42800, expenses: 31200 },\n  { month: 'Feb', revenue: 46100, expenses: 32800 },\n]\n// <BarChart data={data} index=\"month\" series={[{ key: 'revenue', label: 'Revenue' }]} />"}</code>
    </pre>
    <ul style={{ margin: 0, paddingInlineStart: 18, display: 'grid', gap: 4, fontSize: 14, lineHeight: '20px' }}>
      <li>{"index names the category field. Its values become the labels, so keep them short (Jan, Mon, Pro)."}</li>
      <li>{"Each series key must hold a number. Missing or non-numeric values count as 0 and draw no bar."}</li>
      <li>{"Sort the rows yourself. Charts do not reorder categories."}</li>
      <li>{"Pass 3 to 12 rows. Past 12 vertical categories the labels crowd; switch to orientation=\"horizontal\"."}</li>
    </ul>
  </div>
);

const page: DocPage = {
  slug: "bar-chart",
  status: 'Stable',
  version: '0.1.0',
  importName: "BarChart",
  group: ['Components', 'Charts'],
  sourcePath: "charts/BarChart",
  lede: "Rounded bars for comparing values across categories. It handles four moments: reading one value, comparing groups, seeing a total split into parts, and exploring a point by keyboard.",
  anatomy: {
    intro: "Seven parts. The plot, bars and category labels are always present. The title, legend and value labels come from the card around it; gridlines and the value axis can be turned off.",
    Render: Stage,
    parts: [
      { name: "Card title", description: "ChartCard title: 14px medium via CardTitle. Names the measure, not the chart type.", selector: "h3" },
      { name: "Headline value and delta", description: "24px medium, tabular numerals, -0.02em tracking. The delta badge turns green for good and red for bad; invert flips it for churn-style metrics.", selector: "header span:nth-of-type(1)" },
      { name: "Plot", description: "Responsive svg, 220px tall here. Left margin 48px for the value axis, 28px at the bottom for categories, 12px right, 8px top.", selector: "svg[role=\"group\"]" },
      { name: "Bar", description: "Rounded path, 8px corner radius (barRadius), clamped to half the bar width. Grouped series split each band with a 12% inner gap.", selector: "svg[role=\"group\"] > g:not([aria-hidden]) > path" },
      { name: "Gridlines and value axis", description: "Dashed 3 4 gridlines in the track colour; the zero line is solid. Labels are 11px, medium, muted, compact ($12K).", selector: "svg[role=\"group\"] > g[aria-hidden=\"true\"] text" },
      { name: "Hover column", description: "An invisible full-height column per category. Hover or focus shows the tooltip with every series; keyboard focus draws a 2px ring. This is the keyboard stop.", selector: "svg[role=\"group\"] > rect[role=\"graphics-symbol\"]" },
      { name: "Legend", description: "ChartLegend under the plot: 10px swatches, 13px labels, 16px gap. Series colour is never the only label.", selector: "ul" },
    ],
  },
  usage: {
    use: ["Comparing values across 3 to 12 categories: months, plans, regions.","Splitting a total into parts with layout=\"stacked\", or into shares with layout=\"percent\".","Ranking categories with orientation=\"horizontal\" when labels are long.","Daily or weekly counts with track, where the bar fills a full-height lane."],
    avoid: [
      { text: "A trend that should read as a continuous line over many points.", instead: { slug: "line-chart", label: "LineChart" } },
      { text: "A ranked list of named items with values beside them.", instead: { slug: "bar-list", label: "BarList" } },
      { text: "Parts of one whole with five slices or fewer.", instead: { slug: "donut-chart", label: "DonutChart" } },
      { text: "A bar and a line in different units.", instead: { slug: "combo-chart", label: "ComboChart" } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'orientation', label: 'Orientation', options: ['vertical', 'horizontal'] },
      { kind: 'segmented', key: 'layout', label: 'Layout', options: ['grouped', 'stacked', 'percent'] },
      { kind: 'segmented', key: 'fill', label: 'Fill', options: ['solid', 'gradient', 'dots', 'lines', 'grid'] },
      { kind: 'segmented', key: 'valueFormat', label: 'Format', options: ['number', 'compact', 'currency'] },
      { kind: 'number', key: 'barRadius', label: 'Bar radius', min: 0, max: 16, step: 2 },
      { kind: 'toggle', key: 'track', label: 'Track' },
      { kind: 'toggle', key: 'showGrid', label: 'Gridlines' },
    ],
    initial: { orientation: 'vertical', layout: 'grouped', fill: 'solid', valueFormat: 'currency', barRadius: 8, track: false, showGrid: true },
    render: (p) => (
      <div style={{ width: 'min(520px, 100%)' }}>
        <BarChart
          key={String(p.orientation) + String(p.layout)}
          data={revenue}
          index="month"
          series={revSeries}
          orientation={p.orientation as 'vertical'}
          layout={p.layout as 'grouped'}
          fill={p.fill as 'solid'}
          valueFormat={p.valueFormat as 'currency'}
          barRadius={Number(p.barRadius)}
          track={Boolean(p.track)}
          showGrid={Boolean(p.showGrid)}
          height={240}
        />
      </div>
    ),
    code: (p) => {
      const attrs = [p.orientation !== 'vertical' && `orientation="${p.orientation}"`, p.layout !== 'grouped' && `layout="${p.layout}"`, p.fill !== 'solid' && `fill="${p.fill}"`, p.valueFormat !== 'number' && `valueFormat="${p.valueFormat}"`, p.barRadius !== 8 && `barRadius={${p.barRadius}}`, p.track && 'track', !p.showGrid && 'showGrid={false}'].filter(Boolean).join(' ');
      return `<BarChart data={revenue} index="month" series={series}${attrs ? ' ' + attrs : ''} />`;
    },
  },
  states: [
    { name: "Grouped", description: "Default. One bar per series, side by side in each band.", Render: () => (
      <div style={{ width: 460 }}><BarChart data={revenue} index="month" series={revSeries} valueFormat="currency" height={200} /></div>
    ) },
    { name: "Stacked", description: "Series stack to a total. Only the outer bar ends are rounded.", Render: () => (
      <div style={{ width: 460 }}><BarChart data={revenue} index="month" series={revSeries} layout="stacked" valueFormat="currency" height={200} /></div>
    ) },
    { name: "Percent", description: "Each category normalises to 100%, axis shows 0 to 100%.", Render: () => (
      <div style={{ width: 460 }}><BarChart data={revenue} index="month" series={revSeries} layout="percent" height={200} /></div>
    ) },
    { name: "Horizontal", description: "Category labels on the left, up to 140px wide.", Render: () => (
      <div style={{ width: 460 }}><BarChart data={revenue.slice(0, 4)} index="month" series={[{ key: 'revenue', label: 'Revenue', tone: 1 }]} orientation="horizontal" valueFormat="currency" height={180} /></div>
    ) },
    { name: "Track, no axes", description: "Full-height rounded lane behind each bar. Hide grid and value axis.", Render: () => (
      <div style={{ width: 460 }}><BarChart data={revenue} index="month" series={[{ key: 'revenue', label: 'Revenue', tone: 1 }]} track showGrid={false} showYAxis={false} height={180} /></div>
    ) },
    { name: "Pattern fill", description: "dots, lines or grid fills separate series without color.", Render: () => (
      <div style={{ width: 460 }}><BarChart data={revenue} index="month" series={revSeries} fill="lines" valueFormat="currency" height={200} /></div>
    ) },
    { name: "Loading", description: "Skeleton at the chart height. The chart is not mounted until data exists.", Render: () => (
<ChartCard title="Revenue vs expenses"><Skeleton variant="rect" width="100%" height={240} /></ChartCard>
    ) },
    { name: "Empty", description: "No data in range. Say why and offer a way out. The chart is not mounted.", Render: () => (
<ChartCard title="Revenue vs expenses"><EmptyState title="No data for this range" description="Pick a longer period or check that the source is connected." /></ChartCard>
    ) },
    { name: "Single point", description: "One category fills the plot with a single bar. It is legal but weak: show the number in a card unless more points are coming.", Render: () => (
      <ChartCard title="Revenue" value="$63,200" unit="June"><BarChart data={revenue.slice(5)} index="month" series={[{ key: 'revenue', label: 'Revenue', tone: 1 }]} valueFormat="currency" height={160} /></ChartCard>
    ) },
  ],
  sections: [
    {
      type: 'custom', id: 'choosing-a-chart', title: 'Choosing a chart', Render: () => (
        <div style={{ display: 'grid', gap: 16 }}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: '20px' }}>Start from the question the reader is asking, not from the shape you like. If two charts fit, take the one with fewer marks.</p>
          <Choose />
          <p style={{ margin: 0, fontSize: 14, lineHeight: '20px', color: 'var(--oniva-color-text-muted)' }}>Avoid pie-style charts past five slices, dual axes when one unit will do, and any chart for fewer than three values: a number in a card reads faster.</p>
        </div>
      ),
    },
    { type: 'custom', id: 'data-shape', title: 'Data shape', Render: Shape },
    {
      type: 'rules', id: 'formatting', title: 'Axes, labels and numbers',
      items: [
        { title: "Tabular numerals", body: "Axis labels (11px, medium, muted), tooltip values and legend values use tabular-nums, so digits stay in place when values change." },
        { title: "Compact on the axis, full in the tooltip", body: "The value axis compacts ($12K, 1.2M) so ticks stay under 6 characters. The tooltip shows the full value, $63,200." },
        { title: "Four ticks, starting at zero", body: "The value axis always starts at 0 and gets about four nice ticks. Bars encode length, so a truncated axis would lie." },
        { title: "Percent layout", body: "layout=\"percent\" replaces the axis with 0%, 25%, 50%, 75%, 100% and ignores valueFormat for ticks." },
        { title: "Category labels", body: "Horizontal charts reserve 6.4px per character up to 140px, then clip. Keep labels under 20 characters." },
        { title: "Units belong in the format", body: "Use valueFormat=\"currency\", \"percent\" or a function such as (n) => `${n} ms`. Never concatenate units into category labels." },
      ],
    },
    {
      type: 'rules', id: 'color-and-palette', title: 'Color and palette',
      items: [
        { title: "Ten chart tokens", body: "--oniva-color-chart-1 to --oniva-color-chart-10 are fixed hues, independent of the accent. Pick by position or pass tone (1-based). Tone wraps after 10." },
        { title: "Series count", body: "Two or three series read well. Past five, group the rest into Other or split into small multiples." },
        { title: "Stable meaning", body: "Give a series the same tone across every chart on a page. Revenue is always tone 1." },
        { title: "Pattern fills as a second channel", body: "fill=\"dots\", \"lines\" or \"grid\" adds a texture so grayscale prints and color-blind readers can separate series." },
        { title: "Color-blind safe", body: "Every mark is at least 3:1 on white. In the light palette, series 1 to 10 stay at least 3.3 delta E apart under protanopia, deuteranopia and tritanopia simulation. Do not rely on that alone: label series in the legend or tooltip." },
        { title: "Track and grid", body: "Empty tracks and gridlines use --oniva-color-chart-track. The hover band uses --oniva-color-chart-cursor." },
      ],
    },
    {
      type: 'rules', id: 'keyboard-exploration', title: 'Keyboard exploration',
      intro: "Each category is one stop. Tab to the chart, then use the arrow keys to read each category and all its series.",
      items: [
        { title: 'One tab stop', body: 'The chart is a single focusable group (tabindex 0). Tab enters it once and the next Tab leaves it, so a page with six charts costs six tab stops, not hundreds.' },
        { title: 'Arrows move between categories', body: "Right and Down move to the next category, Left and Up to the previous one. Home and End jump to the first and last. Each stop announces \"Mon: Revenue $42,800, Expenses $31,200\"." },
        { title: 'Focus shows the tooltip', body: 'Moving focus opens the same tooltip as hover, anchored to the focused mark. Esc closes it without moving focus. The focused mark gets a 2px focus ring, 2px offset.' },
      ],
    },
    {
      type: 'rules', id: 'empty-loading-single', title: 'Empty, loading and single-point states',
      intro: "The chart does not draw its own placeholder. Decide before you mount it.",
      items: [
        { title: "Loading", body: "Render a Skeleton at the same height (240px here) so the card does not jump. Mount the chart when data arrives so the entrance animation plays once." },
        { title: "Empty", body: "Use EmptyState inside the ChartCard. Name the cause (No orders in this range) and give one action. Do not render an empty plot with axes." },
        { title: "One point", body: "A single category still renders one bar, up to the band width, with its tooltip. A lone bar compares to nothing, so prefer a KPI value with a delta until at least three categories exist." },
      ],
    },
    {
      type: 'rules', id: 'motion', title: 'Motion',
      items: [
        { title: "Entrance", body: "Bars grow from the baseline over 450ms (ease-out), each category delayed 40ms with the whole stagger capped at 300ms. The animation is released when the chart is 15% in view." },
        { title: "Series offset", body: "Within a category each later series starts up to 80ms after the first, so grouped bars ripple instead of jumping together." },
        { title: "Data updates", body: "Changing the data tweens existing values over 400ms (ease-out quart) instead of replacing the marks. If the number of rows changes, the chart snaps to the new data." },
        { title: "Reduced motion", body: "With prefers-reduced-motion the entrance animation is removed (animation-name none) and value tweens jump straight to the final value. Tooltip movement drops to 0.01ms." },
      ],
    },

  ],
  content: { rules: [
    { title: "Chart title names the measure", body: "Revenue vs expenses, not Bar chart." },
    { title: "Short category labels", body: "Jan, Mon, Pro. Three characters when possible; abbreviate months and weekdays." },
    { title: "Series labels are nouns", body: "Revenue, Expenses. They appear in the legend and tooltip." },
    { title: "Accessible label states the claim", body: "Pass label=\"Revenue rose each month from January to June\" when there is a story; the default is \"Bar chart of Revenue, Expenses by month\"." },
  ] },
  accessibility: {
    keyboard: [
      { keys: ["Tab"], action: "Moves focus into the chart, then out to the next control. The chart is one tab stop." },
      { keys: ["→","↓"], action: "Moves focus to the next category. In right-to-left layouts → and ← swap." },
      { keys: ["←","↑"], action: "Moves focus to the previous category." },
      { keys: ["Home","End"], action: "Jumps to the first or last category." },
      { keys: ["Esc"], action: "Closes the tooltip. Focus stays where it is." },
    ],
    notes: ["The plot is an svg with role=\"group\", aria-roledescription=\"chart\" and an aria-label (default \"Bar chart of Revenue, Expenses by month\").","Each mark is role=\"graphics-symbol\" with aria-roledescription=\"data point\" and a label such as \"Mon: Steps 8,420\".","A visually hidden table mirrors the data (caption, column headers, row headers), so screen reader users can read it row by row.","Axis labels, gridlines and decorative fills are aria-hidden so the data is not read twice.","The hit area is a transparent rect the full height of each category band, so the target is wider than the bar."],
    reducedMotion: "Entrance animation is removed and value tweens jump to the final value. Tooltip movement drops to 0.01ms.",
  },
  props: [
    { name: "data", type: "ChartDatum[]", description: "Rows. Each row has the index field and one numeric field per series." },
    { name: "index", type: "string", description: "Field that holds the category label." },
    { name: "series", type: "ChartSeries[]", description: "Series definitions: key, label, tone." },
    { name: "orientation", type: "'vertical' | 'horizontal'", default: "'vertical'", description: "Bar direction." },
    { name: "layout", type: "'grouped' | 'stacked' | 'percent'", default: "'grouped'", description: "How multiple series combine." },
    { name: "track", type: "boolean", default: "false", description: "Full-height rounded lane behind each bar. Changes default padding to 0.14." },
    { name: "variant", type: "'solid' | 'blocks'", default: "'solid'", description: "blocks draws each bar as a stack of 8px rounded blocks with 3px gaps." },
    { name: "fill", type: "'solid' | 'gradient' | 'dots' | 'lines' | 'grid'", default: "'solid'", description: "Fill treatment." },
    { name: "glow", type: "boolean", default: "false", description: "Soft blur behind the bars." },
    { name: "barRadius", type: "number", default: "8", description: "Corner radius in px." },
    { name: "padding", type: "number", default: "0.32", description: "Space between category bands, 0 to 1." },
    { name: "valueFormat", type: "ValueFormat", default: "'number'", description: "'number', 'compact', 'currency' (USD, no decimals), 'percent' or a function." },
    { name: "height", type: "number", default: "240", description: "Plot height in px. Width fills the container." },
    { name: "showGrid / showXAxis / showYAxis", type: "boolean", default: "true", description: "Toggle gridlines and axis labels." },
    { name: "label", type: "string", description: "Accessible summary. Defaults to a description of the series and index." },
    { name: "xstyle", type: "StyleXStyles", description: "StyleX overrides for the wrapper." },
  ],
  related: ["line-chart","bar-list","chart-card","chart-legend","combo-chart"],
};
export default page;
