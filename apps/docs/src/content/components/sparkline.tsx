import { ChartCard, EmptyState, Skeleton, Sparkline } from 'oniva-ui';
import type { DocPage } from '../types';

const trend = [12, 14, 13, 17, 19, 18, 22, 24, 23, 27];
const dip = [24, 22, 23, 19, 18, 17, 14, 12, 13, 9];

const Stage = () => (
  <div style={{ alignItems: 'center', display: 'flex', gap: 12 }}>
    <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 24, fontWeight: 500 }}>$27.0K</span>
    <Sparkline data={trend} variant="area" width={120} height={40} />
  </div>
);

const Shape = () => (
  <div style={{ display: 'grid', gap: 12 }}>
    <pre tabIndex={0} style={{ margin: 0, padding: 12, borderRadius: 10, overflow: 'auto', fontSize: 12.5, lineHeight: '18px', background: 'var(--oniva-color-surface-inset)', color: 'var(--oniva-color-text)' }}>
      <code>{"interface SparklineProps {\n  data: number[];                       // plain numbers, in order\n  variant?: 'line' | 'area' | 'bar';\n  tone?: number;                        // 1 to 10\n  width?: number;   // 96\n  height?: number;  // 32\n}\n\n[12, 14, 13, 17, 19, 18, 22, 24, 23, 27]\n// <Sparkline data={data} variant=\"line\" label=\"Revenue up from 12K to 27K over 10 weeks\" />"}</code>
    </pre>
    <ul style={{ margin: 0, paddingInlineStart: 18, display: 'grid', gap: 4, fontSize: 14, lineHeight: '20px' }}>
      <li>{"data is a flat number array. Do not pass objects or dates."}</li>
      <li>{"The scale runs from min(data, 0) to max(data, 1), so negatives extend below the baseline and small values anchor to zero."}</li>
      <li>{"There are no axes, ticks or tooltips by design."}</li>
      <li>{"Pass label to state the claim; the default is \"Trend of 10 points, up from 12 to 27\"."}</li>
    </ul>
  </div>
);

const page: DocPage = {
  slug: "sparkline",
  status: 'Stable',
  version: '0.1.0',
  importName: "Sparkline",
  group: ['Components', 'Charts'],
  sourcePath: "charts/Sparkline",
  lede: "A tiny trend line with no axes. It handles the moment a number needs context: a KPI card, a table cell, a list row.",
  anatomy: {
    intro: "Three parts. The svg and the line (or bars) are always present. The area fill appears in the area variant.",
    Render: Stage,
    parts: [
      { name: "Sparkline", description: "Inline svg, 96 by 32px by default (120 by 40 here), 2px padding. role=\"img\" with a trend summary label.", selector: "svg" },
      { name: "Line", description: "1.75px stroke, round caps and joins, monotone curve. Drawn left to right over 800ms.", selector: "svg path[stroke]" },
      { name: "Area fill", description: "Gradient from 35% opacity to 0 under the line (area variant). Fades in over 400ms.", selector: "svg path:first-of-type" },
    ],
  },
  usage: {
    use: ["A trend beside a KPI value.","A column in a table or list row.","A dense dashboard where each metric gets 96px."],
    avoid: [
      { text: "Reading exact values or axes.", instead: { slug: "line-chart", label: "LineChart" } },
      { text: "A trend that needs a tooltip or keyboard exploration.", instead: { slug: "area-chart", label: "AreaChart" } },
      { text: "Categories rather than time.", instead: { slug: "bar-chart", label: "BarChart" } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'variant', label: 'Variant', options: ['area', 'line', 'bar'] },
      { kind: 'segmented', key: 'series', label: 'Data', options: ['rising', 'falling'] },
      { kind: 'number', key: 'tone', label: 'Tone (1 to 10)', min: 1, max: 10, step: 1 },
      { kind: 'number', key: 'width', label: 'Width (px)', min: 60, max: 240, step: 20 },
      { kind: 'number', key: 'height', label: 'Height (px)', min: 24, max: 80, step: 8 },
      { kind: 'segmented', key: 'curve', label: 'Curve', options: ['monotone', 'linear', 'step'] },
    ],
    initial: { variant: 'area', series: 'rising', tone: 1, width: 120, height: 40, curve: 'monotone' },
    render: (p) => (
      <Sparkline key={String(p.variant) + String(p.series)} data={p.series === 'rising' ? trend : dip} variant={p.variant as 'area'} tone={Number(p.tone)} width={Number(p.width)} height={Number(p.height)} curve={p.curve as 'monotone'} />
    ),
    code: (p) => {
      const attrs = [p.variant !== 'area' && `variant="${p.variant}"`, p.tone !== 1 && `tone={${p.tone}}`, p.width !== 96 && `width={${p.width}}`, p.height !== 32 && `height={${p.height}}`, p.curve !== 'monotone' && `curve="${p.curve}"`].filter(Boolean).join(' ');
      return `<Sparkline data={${p.series === 'rising' ? 'trend' : 'dip'}}${attrs ? ' ' + attrs : ''} />`;
    },
  },
  states: [
    { name: "Area", description: "Default. Line with a fading fill.", Render: () => (
      <Sparkline data={trend} width={120} height={40} />
    ) },
    { name: "Line", description: "Line only. Lightest weight, best in tables.", Render: () => (
      <Sparkline data={trend} variant="line" width={120} height={40} />
    ) },
    { name: "Bar", description: "Bars for discrete periods such as days.", Render: () => (
      <Sparkline data={trend} variant="bar" width={120} height={40} />
    ) },
    { name: "Falling", description: "Pick the tone for the story: pink for a decline.", Render: () => (
      <Sparkline data={dip} tone={3} width={120} height={40} />
    ) },
    { name: "In a table row", description: "At 96 by 32px beside text.", Render: () => (
      <div style={{ alignItems: 'center', display: 'flex', gap: 16 }}><span style={{ width: 90 }}>Acme Corp</span><Sparkline data={trend} variant="line" /><span style={{ fontVariantNumeric: 'tabular-nums' }}>$27.0K</span></div>
    ) },
    { name: "Loading", description: "Skeleton at the chart height. The chart is not mounted until data exists.", Render: () => (
<ChartCard title="Revenue"><Skeleton variant="rect" width="100%" height={32} /></ChartCard>
    ) },
    { name: "Empty", description: "No data in range. Say why and offer a way out. The chart is not mounted.", Render: () => (
<ChartCard title="Revenue"><EmptyState title="No data for this range" description="Pick a longer period or check that the source is connected." /></ChartCard>
    ) },
    { name: "Single point", description: "One value draws one bar, or a dot-less line with no length.", Render: () => (
      <Sparkline data={[12]} variant="bar" width={120} height={40} />
    ) },
  ],
  sections: [
    {
      type: 'text', id: 'choosing-a-chart', title: 'Choosing a chart',
      body: (<p style={{ margin: 0 }}>Use a sparkline when the shape of a trend is enough and space is tight. See the full decision table on <a href="#/components/bar-chart">Bar chart</a>.</p>),
    },
    { type: 'custom', id: 'data-shape', title: 'Data shape', Render: Shape },
    {
      type: 'rules', id: 'formatting', title: 'Axes, labels and numbers',
      items: [
        { title: "Tabular numerals", body: "Axis labels (11px, medium, muted), tooltip values and legend values use tabular-nums, so digits stay in place when values change." },
        { title: "No axes, no numbers", body: "Put the current value beside the sparkline in text. The sparkline shows direction only." },
        { title: "Baseline is zero or less", body: "The scale includes 0, so a series from 100 to 110 looks flat. Normalise first if you want the movement to show." },
        { title: "Size to context", body: "96 by 32px in tables, 120 by 40px in KPI cards. Below 64px wide the line loses shape." },
        { title: "Units belong in the format", body: "Use valueFormat=\"currency\", \"percent\" or a function such as (n) => `${n} ms`. Never concatenate units into category labels." },
      ],
    },
    {
      type: 'rules', id: 'color-and-palette', title: 'Color and palette',
      items: [
        { title: "Ten chart tokens", body: "--oniva-color-chart-1 to --oniva-color-chart-10 are fixed hues, independent of the accent. Pick by position or pass tone (1-based). Tone wraps after 10." },
        { title: "One tone, meaningful", body: "Use tone 1 for neutral or good, tone 3 for bad. Always repeat the direction in text (\"up 12%\")." },
        { title: "Contrast", body: "The line is 1.75px of a chart token (at least 3:1 on white). Do not lighten it with opacity." },
        { title: "Color-blind safe", body: "Every mark is at least 3:1 on white. In the light palette, series 1 to 10 stay at least 3.3 delta E apart under protanopia, deuteranopia and tritanopia simulation. Do not rely on that alone: label series in the legend or tooltip." },
        { title: "Track and grid", body: "Empty tracks and gridlines use --oniva-color-chart-track. The hover band uses --oniva-color-chart-cursor." },
      ],
    },
    {
      type: 'rules', id: 'keyboard-exploration', title: 'Keyboard exploration',
      intro: "Sparkline is a static image with a text alternative.",
      items: [
        { title: 'Not focusable', body: 'The svg has role="img" and no tab stops or tooltip.' },
        { title: 'The summary is the content', body: 'Screen readers read "Trend of 10 points, up from 12 to 27" or the label you pass.' },
        { title: 'Need exploration?', body: 'Use LineChart or AreaChart, which support arrow-key navigation and tooltips.' },
      ],
    },
    {
      type: 'rules', id: 'empty-loading-single', title: 'Empty, loading and single-point states',
      intro: "The chart does not draw its own placeholder. Decide before you mount it.",
      items: [
        { title: "Loading", body: "Render a Skeleton at the same height (32px here) so the card does not jump. Mount the chart when data arrives so the entrance animation plays once." },
        { title: "Empty", body: "Use EmptyState inside the ChartCard. Name the cause (No orders in this range) and give one action. Do not render an empty plot with axes." },
        { title: "One point", body: "One value gives no trend. The area and line variants draw nothing meaningful; bar draws one bar. Hide the sparkline until there are three points." },
      ],
    },
    {
      type: 'rules', id: 'motion', title: 'Motion',
      items: [
        { title: "Entrance", body: "Line variants draw over 800ms (stroke-dashoffset). The area fill fades in over 400ms. Bars grow with a 25ms stagger per bar." },
        { title: "Data updates", body: "Sparkline does not tween. New data redraws immediately. Use a key to replay the entrance." },
        { title: "Reduced motion", body: "With prefers-reduced-motion the entrance animation is removed (animation-name none) and value tweens jump straight to the final value. Tooltip movement drops to 0.01ms." },
      ],
    },

  ],
  content: { rules: [
    { title: "Put the value beside it", body: "The number carries the information; the sparkline shows the shape." },
    { title: "State the period", body: "Add \"last 10 weeks\" nearby." },
    { title: "Override the label with the claim", body: "Revenue up 125% over 10 weeks." },
  ] },
  accessibility: {
    keyboard: [
      { keys: ["Tab"], action: "Not a tab stop. Sparkline has no interactive parts." },
    ],
    notes: ["The svg has role=\"img\" and an aria-label. The default reads \"Trend of 10 points, up from 12 to 27\".","Do not rely on color for direction. State it in the label or nearby text.","No data table is rendered. Provide the data elsewhere if it matters."],
    reducedMotion: "The draw, fade and grow entrances are removed (animation-name none).",
  },
  props: [
    { name: "data", type: "number[]", description: "Values in order." },
    { name: "variant", type: "'line' | 'area' | 'bar'", default: "'area'", description: "Rendering style." },
    { name: "tone", type: "number", default: "1", description: "1-based palette index." },
    { name: "width", type: "number", default: "96", description: "Width in px." },
    { name: "height", type: "number", default: "32", description: "Height in px." },
    { name: "curve", type: "'linear' | 'monotone' | 'natural' | 'step' | 'basis'", default: "'monotone'", description: "Line interpolation." },
    { name: "label", type: "string", description: "Accessible label. Defaults to a trend summary." },
    { name: "xstyle", type: "StyleXStyles", description: "StyleX overrides for the wrapper." },
    { name: "ref", type: "Ref<SVGSVGElement>", description: "Forwarded to the svg." },
  ],
  related: ["kpi-strip","line-chart","area-chart","chart-card","data-table"],
};
export default page;
