import { CategoryBar, ChartCard, EmptyState, Skeleton } from 'oniva-ui';
import type { DocPage } from '../types';

const ranges = [
  { value: 40, tone: 3, label: 'Poor' },
  { value: 30, tone: 2, label: 'Fair' },
  { value: 30, tone: 1, label: 'Good' },
];
const split = [
  { value: 52, tone: 1, label: 'Fixed' },
  { value: 31, tone: 4, label: 'Usage' },
  { value: 17, tone: 5, label: 'Seats' },
];

const Stage = () => (
  <div style={{ width: 420 }}><CategoryBar segments={ranges} marker={68} showLabels /></div>
);

const Shape = () => (
  <div style={{ display: 'grid', gap: 12 }}>
    <pre tabIndex={0} style={{ margin: 0, padding: 12, borderRadius: 10, overflow: 'auto', fontSize: 12.5, lineHeight: '18px', background: 'var(--oniva-color-surface-inset)', color: 'var(--oniva-color-text)' }}>
      <code>{"interface CategorySegment {\n  value: number;   // relative size, normalised to 100%\n  tone?: number;   // 1 to 10, defaults to position + 1\n  label?: ReactNode;\n}\n\nsegments = [\n  { value: 40, tone: 3, label: 'Poor' },\n  { value: 30, tone: 2, label: 'Fair' },\n  { value: 30, tone: 1, label: 'Good' },\n]\nmarker = 68   // same units as the segment values\n// <CategoryBar segments={segments} marker={68} showLabels />"}</code>
    </pre>
    <ul style={{ margin: 0, paddingInlineStart: 18, display: 'grid', gap: 4, fontSize: 14, lineHeight: '20px' }}>
      <li>{"Segment values are relative. 40, 30, 30 and 4, 3, 3 draw the same bar."}</li>
      <li>{"marker is in the same units as the segment sum, so 68 of 100 sits at 68%."}</li>
      <li>{"The accessible label lists each segment with its rounded percent and the marker position."}</li>
      <li>{"Use 2 to 5 segments."}</li>
    </ul>
  </div>
);

const page: DocPage = {
  slug: "category-bar",
  status: 'Stable',
  version: '0.1.0',
  importName: "CategoryBar",
  group: ['Components', 'Charts'],
  sourcePath: "charts/CategoryBar",
  lede: "A single segmented bar with an optional marker. It handles a score against ranges (poor, fair, good) and a split of one total into a few parts.",
  anatomy: {
    intro: "Four parts. The track and segments are always present. The marker and labels are optional.",
    Render: Stage,
    parts: [
      { name: "Track", description: "10px tall flex row with a 2px gap between segments. Fully rounded ends.", selector: "[role=\"img\"] > div:first-of-type" },
      { name: "Segment", description: "Width proportional to value / total. 3px minimum width. The first and last segments take the rounded ends.", selector: "[role=\"img\"] > div > div:first-of-type" },
      { name: "Marker", description: "16px circle in the text color with a 2px surface ring, centered on the bar at marker / total.", selector: "[role=\"img\"] > div > span" },
      { name: "Labels", description: "12px muted, tabular, under each segment. Width follows the segment.", selector: "[role=\"img\"] > div:nth-of-type(2)" },
    ],
  },
  usage: {
    use: ["A score against ranges: credit health, risk, quality.","A split of one total into 2 to 5 parts in a tight space.","A KPI row where a donut is too large."],
    avoid: [
      { text: "A single percent complete.", instead: { slug: "progress-bar", label: "ProgressBar" } },
      { text: "A value in a bounded range on a dial.", instead: { slug: "gauge", label: "Gauge" } },
      { text: "Many categories or precise comparison.", instead: { slug: "bar-chart", label: "BarChart" } },
    ],
  },
  playground: {
    controls: [
      { kind: 'number', key: 'marker', label: 'Marker (0 to 100)', min: 0, max: 100, step: 1 },
      { kind: 'toggle', key: 'showMarker', label: 'Marker' },
      { kind: 'toggle', key: 'showLabels', label: 'Labels' },
      { kind: 'segmented', key: 'preset', label: 'Preset', options: ['ranges', 'split'] },
    ],
    initial: { marker: 68, showMarker: true, showLabels: true, preset: 'ranges' },
    render: (p) => (
      <div style={{ width: 'min(420px, 100%)' }}><CategoryBar key={String(p.preset)} segments={p.preset === 'ranges' ? ranges : split} marker={p.showMarker ? Number(p.marker) : undefined} showLabels={Boolean(p.showLabels)} /></div>
    ),
    code: (p) => {
      const attrs = [p.showMarker && `marker={${p.marker}}`, p.showLabels && 'showLabels'].filter(Boolean).join(' ');
      return `<CategoryBar segments={${p.preset === 'ranges' ? 'ranges' : 'split'}}${attrs ? ' ' + attrs : ''} />`;
    },
  },
  states: [
    { name: "With marker", description: "Marker at 68 of 100, inside Fair and Good.", Render: () => (
      <div style={{ width: 380 }}><CategoryBar segments={ranges} marker={68} showLabels /></div>
    ) },
    { name: "Split, no marker", description: "Segments only: part-to-whole.", Render: () => (
      <div style={{ width: 380 }}><CategoryBar segments={split} showLabels /></div>
    ) },
    { name: "Marker at the edge", description: "The marker clamps to 0 to 100% of the bar.", Render: () => (
      <div style={{ width: 380 }}><CategoryBar segments={ranges} marker={100} showLabels /></div>
    ) },
    { name: "No labels", description: "Drop labels when a legend or heading names the ranges.", Render: () => (
      <div style={{ width: 380 }}><CategoryBar segments={ranges} marker={32} /></div>
    ) },
    { name: "Thin segment", description: "A 3px minimum keeps tiny segments visible.", Render: () => (
      <div style={{ width: 380 }}><CategoryBar segments={[{ value: 96, tone: 1, label: 'OK' }, { value: 1, tone: 3, label: '' }, { value: 3, tone: 8, label: '' }]} showLabels /></div>
    ) },
    { name: "Loading", description: "Skeleton at the chart height. The chart is not mounted until data exists.", Render: () => (
<ChartCard title="Credit health"><Skeleton variant="rect" width="100%" height={60} /></ChartCard>
    ) },
    { name: "Empty", description: "No data in range. Say why and offer a way out. The chart is not mounted.", Render: () => (
<ChartCard title="Credit health"><EmptyState title="No data for this range" description="Pick a longer period or check that the source is connected." /></ChartCard>
    ) },
    { name: "Single point", description: "One segment is a full pill. Use ProgressBar instead.", Render: () => (
      <div style={{ width: 380 }}><CategoryBar segments={[{ value: 100, tone: 1, label: 'All' }]} showLabels /></div>
    ) },
  ],
  sections: [
    {
      type: 'text', id: 'choosing-a-chart', title: 'Choosing a chart',
      body: (<p style={{ margin: 0 }}>Use a category bar for a split or a score against ranges, in one row. See the full decision table on <a href="#/components/bar-chart">Bar chart</a>.</p>),
    },
    { type: 'custom', id: 'data-shape', title: 'Data shape', Render: Shape },
    {
      type: 'rules', id: 'formatting', title: 'Axes, labels and numbers',
      items: [
        { title: "Tabular numerals", body: "Axis labels (11px, medium, muted), tooltip values and legend values use tabular-nums, so digits stay in place when values change." },
        { title: "Labels are words, not numbers", body: "Poor, Fair, Good. They sit under each segment, so keep them to 8 characters." },
        { title: "Marker value in text", body: "The marker has no number. Put the value next to the bar: \"68 of 100\"." },
        { title: "Percentages are normalised", body: "Segments are relative to their sum. You can pass counts directly." },
        { title: "Units belong in the format", body: "Use valueFormat=\"currency\", \"percent\" or a function such as (n) => `${n} ms`. Never concatenate units into category labels." },
      ],
    },
    {
      type: 'rules', id: 'color-and-palette', title: 'Color and palette',
      items: [
        { title: "Ten chart tokens", body: "--oniva-color-chart-1 to --oniva-color-chart-10 are fixed hues, independent of the accent. Pick by position or pass tone (1-based). Tone wraps after 10." },
        { title: "Ordered ranges use meaning", body: "Tone 3 (pink), 2 (lime), 1 (teal) for poor, fair, good. Keep the same mapping everywhere, and always label." },
        { title: "Splits use distinct hues", body: "For a split, give each segment a different tone. Two or three segments stay readable under color-blind simulation." },
        { title: "Marker contrast", body: "The marker uses the text color with a surface ring, so it is visible on any segment." },
        { title: "Color-blind safe", body: "Every mark is at least 3:1 on white. In the light palette, series 1 to 10 stay at least 3.3 delta E apart under protanopia, deuteranopia and tritanopia simulation. Do not rely on that alone: label series in the legend or tooltip." },
        { title: "Track and grid", body: "Empty tracks and gridlines use --oniva-color-chart-track. The hover band uses --oniva-color-chart-cursor." },
      ],
    },
    {
      type: 'rules', id: 'keyboard-exploration', title: 'Keyboard exploration',
      intro: "CategoryBar is a static image with a text alternative.",
      items: [
        { title: 'Not focusable', body: 'The bar has role="img" and no tab stops.' },
        { title: 'Labels carry meaning', body: 'The accessible label reads "Category bar: Poor 40%, Fair 30%, Good 30%; marker at 68".' },
        { title: 'Need to explore it?', body: 'Pair with text or a Tooltip on a surrounding control. The segments themselves are not interactive.' },
      ],
    },
    {
      type: 'rules', id: 'empty-loading-single', title: 'Empty, loading and single-point states',
      intro: "The chart does not draw its own placeholder. Decide before you mount it.",
      items: [
        { title: "Loading", body: "Render a Skeleton at the same height (60px here) so the card does not jump. Mount the chart when data arrives so the entrance animation plays once." },
        { title: "Empty", body: "Use EmptyState inside the ChartCard. Name the cause (No orders in this range) and give one action. Do not render an empty plot with axes." },
        { title: "One point", body: "One segment is a full bar with no split to read. Use ProgressBar for completion." },
      ],
    },
    {
      type: 'rules', id: 'motion', title: 'Motion',
      items: [
        { title: "Entrance", body: "Segments grow from the left over 450ms (ease-out), each delayed 70ms. The marker is placed immediately." },
        { title: "Data updates", body: "CategoryBar does not tween. Changing segments or marker redraws immediately." },
        { title: "Reduced motion", body: "With prefers-reduced-motion the entrance animation is removed (animation-name none) and value tweens jump straight to the final value. Tooltip movement drops to 0.01ms." },
      ],
    },

  ],
  content: { rules: [
    { title: "Range names are one word", body: "Poor, Fair, Good. Not \"Needs improvement\"." },
    { title: "Say the value", body: "Show \"68 / 100\" next to the bar." },
    { title: "Same order everywhere", body: "Worst to best, left to right." },
  ] },
  accessibility: {
    keyboard: [
      { keys: ["Tab"], action: "Not a tab stop. CategoryBar has no interactive parts." },
    ],
    notes: ["The root is a div with role=\"img\" and an aria-label listing every segment and the marker.","Segment labels that are not strings are announced as \"Segment\".","Add an aria-label override when labels are JSX.","Color is not the only cue: labels sit under each segment."],
    reducedMotion: "The grow entrance is removed (animation-name none) and segments render at full width.",
  },
  props: [
    { name: "segments", type: "CategorySegment[]", description: "Segments: value, tone, label." },
    { name: "marker", type: "number", description: "Marker position, in segment units." },
    { name: "showLabels", type: "boolean", default: "false", description: "Show each label under its segment." },
    { name: "aria-label", type: "string", description: "Overrides the generated label." },
    { name: "xstyle", type: "StyleXStyles", description: "StyleX overrides for the wrapper." },
  ],
  related: ["gauge","progress-bar","meter","donut-chart","chart-legend"],
};
export default page;
