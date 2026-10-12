import { ChartCard, EmptyState, Gauge, Skeleton, Speedometer } from 'oniva-ui';
import type { DocPage } from '../types';

const Stage = () => (
  <Gauge value={72} caption="Health score" tone={1} />
);

const Shape = () => (
  <div style={{ display: 'grid', gap: 12 }}>
    <pre tabIndex={0} style={{ margin: 0, padding: 12, borderRadius: 10, overflow: 'auto', fontSize: 12.5, lineHeight: '18px', background: 'var(--oniva-color-surface-inset)', color: 'var(--oniva-color-text)' }}>
      <code>{"interface GaugeProps {\n  value: number;\n  min?: number;   // default 0\n  max?: number;   // default 100\n  tone?: number;  // 1 to 10, default 1\n}\n\ninterface SpeedometerZone { to: number; tone: number; label?: string }\n\n// <Gauge value={72} caption=\"Health score\" />\n// <Speedometer value={64} zones={[{ to: 40, tone: 3 }, { to: 70, tone: 2 }, { to: 100, tone: 1 }]} />"}</code>
    </pre>
    <ul style={{ margin: 0, paddingInlineStart: 18, display: 'grid', gap: 4, fontSize: 14, lineHeight: '20px' }}>
      <li>{"A scalar, not an array. Values clamp to min and max."}</li>
      <li>{"Speedometer zones list the upper bound of each band; the last should equal max."}</li>
      <li>{"Gauge has no hover targets: the value is the content."}</li>
      <li>{"Use a gauge for one value only. For several, use RadialChart."}</li>
    </ul>
  </div>
);

const page: DocPage = {
  slug: "gauge",
  status: 'Stable',
  version: '0.1.0',
  importName: "Gauge",
  group: ['Components', 'Charts'],
  sourcePath: "charts/Gauge",
  lede: "A half-circle for one value on a bounded range. It handles score and utilisation readouts, with a Speedometer variant for banded ranges.",
  anatomy: {
    intro: "Four parts. The track, filled arc and value are always present. The caption is optional.",
    Render: Stage,
    parts: [
      { name: "Track", description: "A full 180-degree arc in the chart track colour, 18px thick, round caps.", selector: "svg[role=\"group\"] path:first-of-type" },
      { name: "Filled arc", description: "Same arc cut to (value - min) / (max - min). Fades in over 400ms.", selector: "svg[role=\"group\"] path:nth-of-type(2)" },
      { name: "Min and max labels", description: "11px muted labels under each end of the arc.", selector: "svg[role=\"group\"] text" },
      { name: "Value", description: "The centered number, tabular, in valueFormat. Real text in the DOM.", selector: "div > span:first-of-type", fallback: { x: 50, y: 70 } },
      { name: "Caption", description: "Optional text under the value.", selector: "div > span:nth-of-type(2)", fallback: { x: 50, y: 85 } },
    ],
  },
  usage: {
    use: ["One score on a fixed range: health 72 of 100.","Utilisation or quota against a ceiling.","Banded ranges with Speedometer (low, ok, high)."],
    avoid: [
      { text: "Several goals at once.", instead: { slug: "radial-chart", label: "RadialChart" } },
      { text: "A part of a whole.", instead: { slug: "donut-chart", label: "DonutChart" } },
      { text: "A linear progress with a label.", instead: { slug: "progress-bar", label: "ProgressBar" } },
      { text: "A value inside a text row.", instead: { slug: "meter", label: "Meter" } },
    ],
  },
  playground: {
    controls: [
      { kind: 'number', key: 'value', label: 'Value', min: 0, max: 100, step: 1 },
      { kind: 'number', key: 'tone', label: 'Tone (1 to 10)', min: 1, max: 10, step: 1 },
      { kind: 'number', key: 'width', label: 'Width (px)', min: 160, max: 320, step: 20 },
      { kind: 'number', key: 'thickness', label: 'Thickness (px)', min: 8, max: 32, step: 2 },
      { kind: 'text', key: 'caption', label: 'Caption', presets: ['Health score', 'Quota used', 'Uptime'] },
      { kind: 'segmented', key: 'valueFormat', label: 'Format', options: ['number', 'percent'] },
    ],
    initial: { value: 72, tone: 1, width: 240, thickness: 18, caption: 'Health score', valueFormat: 'number' },
    render: (p) => (
      <Gauge value={Number(p.value)} tone={Number(p.tone)} width={Number(p.width)} thickness={Number(p.thickness)} caption={String(p.caption)} valueFormat={p.valueFormat as 'number'} />
    ),
    code: (p) => {
      const attrs = [`value={${p.value}}`, p.tone !== 1 && `tone={${p.tone}}`, p.width !== 240 && `width={${p.width}}`, p.thickness !== 18 && `thickness={${p.thickness}}`, p.valueFormat !== 'number' && `valueFormat="${p.valueFormat}"`, `caption="${p.caption}"`].filter(Boolean).join(' ');
      return `<Gauge ${attrs} />`;
    },
  },
  states: [
    { name: "Default", description: "Teal arc at 72 of 100.", Render: () => (
      <Gauge value={72} caption="Health score" />
    ) },
    { name: "Low", description: "Use tone to signal state: pink for at risk.", Render: () => (
      <Gauge value={24} tone={3} caption="At risk" />
    ) },
    { name: "Custom range", description: "min and max change the scale. Here 0 to 5,000.", Render: () => (
      <Gauge value={3250} max={5000} valueFormat="compact" caption="API calls" tone={6} />
    ) },
    { name: "Empty", description: "At min the arc is hidden and only the track shows.", Render: () => (
      <Gauge value={0} caption="No usage yet" />
    ) },
    { name: "Full", description: "At max the arc fills the track.", Render: () => (
      <Gauge value={100} caption="Quota reached" tone={3} />
    ) },
    { name: "Speedometer", description: "Colored bands from min to max with a needle.", Render: () => (
      <Speedometer value={64} zones={[{ to: 40, tone: 3, label: 'Low' }, { to: 70, tone: 2, label: 'Fair' }, { to: 100, tone: 1, label: 'Good' }]} caption="Credit score" />
    ) },
    { name: "Loading", description: "Skeleton at the chart height. The chart is not mounted until data exists.", Render: () => (
<ChartCard title="Health score"><Skeleton variant="rect" width="100%" height={140} /></ChartCard>
    ) },
    { name: "Empty", description: "No data in range. Say why and offer a way out. The chart is not mounted.", Render: () => (
<ChartCard title="Health score"><EmptyState title="No data for this range" description="Pick a longer period or check that the source is connected." /></ChartCard>
    ) },
    { name: "Single point", description: "A gauge always shows one value. Drop the caption for a minimal readout.", Render: () => (
      <Gauge value={72} width={180} />
    ) },
  ],
  sections: [
    {
      type: 'text', id: 'choosing-a-chart', title: 'Choosing a chart',
      body: (<p style={{ margin: 0 }}>Use a gauge for one value against a known range. See the full decision table on <a href="#/components/bar-chart">Bar chart</a>.</p>),
    },
    { type: 'custom', id: 'data-shape', title: 'Data shape', Render: Shape },
    {
      type: 'rules', id: 'formatting', title: 'Axes, labels and numbers',
      items: [
        { title: "Tabular numerals", body: "Axis labels (11px, medium, muted), tooltip values and legend values use tabular-nums, so digits stay in place when values change." },
        { title: "Value in the center", body: "The number uses valueFormat and tabular numerals. Keep to 5 characters; use compact for big values." },
        { title: "Min and max under the arc", body: "Both ends are labeled with the same format, so 0 and 100 or 0 and 5K." },
        { title: "Units in the caption", body: "Say what the number is: Health score, API calls. Do not put units in the format unless it is percent." },
        { title: "Units belong in the format", body: "Use valueFormat=\"currency\", \"percent\" or a function such as (n) => `${n} ms`. Never concatenate units into category labels." },
      ],
    },
    {
      type: 'rules', id: 'color-and-palette', title: 'Color and palette',
      items: [
        { title: "Ten chart tokens", body: "--oniva-color-chart-1 to --oniva-color-chart-10 are fixed hues, independent of the accent. Pick by position or pass tone (1-based). Tone wraps after 10." },
        { title: "Tone encodes state", body: "Keep one tone per state across the product: tone 1 for healthy, 3 for at risk. Never use tone alone to say good or bad: the caption states it." },
        { title: "Speedometer zones", body: "Zone colors come from tone. Use three zones: they must stay separable for color-blind readers, so label them." },
        { title: "Track is neutral", body: "The unfilled arc is the chart track color (1.3:1), a guide not data." },
        { title: "Color-blind safe", body: "Every mark is at least 3:1 on white. In the light palette, series 1 to 10 stay at least 3.3 delta E apart under protanopia, deuteranopia and tritanopia simulation. Do not rely on that alone: label series in the legend or tooltip." },
        { title: "Track and grid", body: "Empty tracks and gridlines use --oniva-color-chart-track. The hover band uses --oniva-color-chart-cursor." },
      ],
    },
    {
      type: 'rules', id: 'keyboard-exploration', title: 'Keyboard exploration',
      intro: "Gauge is a single readout, so there is nothing to step through.",
      items: [
        { title: 'No tab stop', body: 'Gauge is not focusable. The value and caption are real text in the DOM, so they are read in page order.' },
        { title: 'Speedometer zones', body: 'Speedometer bands are tooltip targets for pointer users. Their labels also appear in the accessible label.' },
        { title: 'Need interaction?', body: 'Wrap the gauge in a Button or Link, not the other way round, and give that control its own accessible name.' },
      ],
    },
    {
      type: 'rules', id: 'empty-loading-single', title: 'Empty, loading and single-point states',
      intro: "The chart does not draw its own placeholder. Decide before you mount it.",
      items: [
        { title: "Loading", body: "Render a Skeleton at the same height (140px here) so the card does not jump. Mount the chart when data arrives so the entrance animation plays once." },
        { title: "Empty", body: "Use EmptyState inside the ChartCard. Name the cause (No orders in this range) and give one action. Do not render an empty plot with axes." },
        { title: "One point", body: "A gauge is one value by design, so there is no single-point case. Without a caption it still reads: add one when the number is not self-explanatory." },
      ],
    },
    {
      type: 'rules', id: 'motion', title: 'Motion',
      items: [
        { title: "Entrance", body: "The filled arc fades in over 400ms. The arc is drawn at its final angle, so there is no sweep." },
        { title: "Data updates", body: "The arc re-draws at the new angle immediately. Wrap the value in your own transition if you need a sweep." },
        { title: "Reduced motion", body: "With prefers-reduced-motion the entrance animation is removed (animation-name none) and value tweens jump straight to the final value. Tooltip movement drops to 0.01ms." },
      ],
    },

  ],
  content: { rules: [
    { title: "Caption names the measure", body: "Health score, Quota used. Two words." },
    { title: "Keep scale labels honest", body: "Set min and max to the real limits, not to make the arc look full." },
    { title: "Color rules in text", body: "Say \"At risk\" in the caption, not only in pink." },
  ] },
  accessibility: {
    keyboard: [
      { keys: ["Tab"], action: "Not a tab stop. Gauge has no interactive parts." },
    ],
    notes: ["The svg has role=\"group\" and aria-label \"Gauge: 72 on a scale of 0 to 100\".","The value and caption are real text, read in page order.","No data table is rendered because there is one value.","Provide a text alternative if color carries meaning, such as a caption stating the band."],
    reducedMotion: "Entrance animation is removed and value tweens jump to the final value. Tooltip movement drops to 0.01ms.",
  },
  props: [
    { name: "value", type: "number", description: "Current value." },
    { name: "min", type: "number", default: "0", description: "Scale minimum." },
    { name: "max", type: "number", default: "100", description: "Scale maximum." },
    { name: "tone", type: "number", default: "1", description: "1-based palette index of the filled arc." },
    { name: "width", type: "number", default: "240", description: "Width in px. Height is half plus 6px." },
    { name: "thickness", type: "number", default: "18", description: "Arc thickness in px." },
    { name: "valueFormat", type: "ValueFormat", default: "'number'", description: "'number', 'compact', 'currency' (USD, no decimals), 'percent' or a function." },
    { name: "caption", type: "ReactNode", description: "Text under the value." },
    { name: "label", type: "string", description: "Accessible summary of the chart." },
    { name: "xstyle", type: "StyleXStyles", description: "StyleX overrides for the wrapper." },
    { name: "Speedometer: zones", type: "SpeedometerZone[]", description: "Colored bands from min: { to, tone, label }. The last should end at max." },
  ],
  related: ["radial-chart","activity-rings","category-bar","ring-progress","meter"],
};
export default page;
