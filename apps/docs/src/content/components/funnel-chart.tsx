import { ChartCard, EmptyState, FunnelChart, Skeleton } from 'oniva-ui';
import type { DocPage } from '../types';

const steps = [
  { label: 'Visitors', value: 48200 },
  { label: 'Signups', value: 12640 },
  { label: 'Activated', value: 7310 },
  { label: 'Trial started', value: 3920 },
  { label: 'Paid', value: 1480 },
];

const Stage = () => (
  <div style={{ width: 560 }}>
    <ChartCard title="Signup funnel" value="3.1%" unit="visitor to paid">
      <FunnelChart steps={steps} height={260} />
    </ChartCard>
  </div>
);

const Shape = () => (
  <div style={{ display: 'grid', gap: 12 }}>
    <pre tabIndex={0} style={{ margin: 0, padding: 12, borderRadius: 10, overflow: 'auto', fontSize: 12.5, lineHeight: '18px', background: 'var(--oniva-color-surface-inset)', color: 'var(--oniva-color-text)' }}>
      <code>{"interface FunnelStep {\n  label: string;\n  value: number;  // count at this step\n}\n\n[\n  { label: 'Visitors', value: 48200 },\n  { label: 'Signups', value: 12640 },\n  { label: 'Paid', value: 1480 },\n]\n// <FunnelChart steps={steps} />"}</code>
    </pre>
    <ul style={{ margin: 0, paddingInlineStart: 18, display: 'grid', gap: 4, fontSize: 14, lineHeight: '20px' }}>
      <li>{"Prop is steps, ordered first to last. Percentages are relative to the first step."}</li>
      <li>{"Values should not increase down the funnel. If one does, its bar grows taller and the connector flips."}</li>
      <li>{"Bar height has a 6px minimum so tiny steps stay visible."}</li>
      <li>{"Use 3 to 6 steps. Past six, labels crowd."}</li>
    </ul>
  </div>
);

const page: DocPage = {
  slug: "funnel-chart",
  status: 'Stable',
  version: '0.1.0',
  importName: "FunnelChart",
  group: ['Components', 'Charts'],
  sourcePath: "charts/FunnelChart",
  lede: "Ordered steps drawn as bars with curved connectors. It handles conversion: how many people reach each step and where they drop off.",
  anatomy: {
    intro: "Five parts. The bars and step labels are always present. Values and percentages sit above each bar.",
    Render: Stage,
    parts: [
      { name: "Step bar", description: "Rounded rectangle (8px radius) with height proportional to value. Opacity steps from 100% down to 50% across the funnel.", selector: "svg[role=\"group\"] > g > g > path" },
      { name: "Connector", description: "Curved band between bars at 16% opacity, so the narrowing reads as one shape.", selector: "svg[role=\"group\"] > g > path:first-of-type" },
      { name: "Value", description: "Count above each bar, 15px semibold, tabular, in valueFormat (compact by default).", selector: "svg[role=\"group\"] text:nth-of-type(1)" },
      { name: "Percent of first step", description: "11px muted under the value. 100% on the first step, then the share of step one.", selector: "svg[role=\"group\"] text:nth-of-type(2)" },
      { name: "Step label", description: "11px muted at the bottom of each bar.", selector: "svg[role=\"group\"] text:nth-of-type(3)" },
    ],
  },
  usage: {
    use: ["Conversion through ordered steps: visit, signup, activate, pay.","Checkout or onboarding drop-off with 3 to 6 steps.","Any process where each step is a subset of the previous one."],
    avoid: [
      { text: "Steps that can branch or loop.", instead: { slug: "sankey-chart", label: "SankeyChart" } },
      { text: "Comparing unrelated categories.", instead: { slug: "bar-chart", label: "BarChart" } },
      { text: "Time in each stage.", instead: { slug: "stage-bars", label: "StageBars" } },
    ],
  },
  playground: {
    controls: [
      { kind: 'number', key: 'tone', label: 'Tone (1 to 10)', min: 1, max: 10, step: 1 },
      { kind: 'segmented', key: 'valueFormat', label: 'Format', options: ['compact', 'number'] },
      { kind: 'number', key: 'height', label: 'Height (px)', min: 200, max: 360, step: 20 },
      { kind: 'number', key: 'count', label: 'Steps', min: 3, max: 5, step: 1 },
    ],
    initial: { tone: 5, valueFormat: 'compact', height: 260, count: 5 },
    render: (p) => (
      <div style={{ width: 'min(560px, 100%)' }}><FunnelChart key={String(p.count)} steps={steps.slice(0, Number(p.count))} tone={Number(p.tone)} valueFormat={p.valueFormat as 'compact'} height={Number(p.height)} /></div>
    ),
    code: (p) => {
      const attrs = [p.tone !== 5 && `tone={${p.tone}}`, p.valueFormat !== 'compact' && `valueFormat="${p.valueFormat}"`, p.height !== 260 && `height={${p.height}}`].filter(Boolean).join(' ');
      return `<FunnelChart steps={steps}${attrs ? ' ' + attrs : ''} />`;
    },
  },
  states: [
    { name: "Default", description: "Five steps, compact values.", Render: () => (
      <div style={{ width: 520 }}><FunnelChart steps={steps} height={240} /></div>
    ) },
    { name: "Three steps", description: "Short funnels get wider bars.", Render: () => (
      <div style={{ width: 520 }}><FunnelChart steps={steps.slice(0, 3)} height={240} /></div>
    ) },
    { name: "Full numbers", description: "valueFormat=\"number\" shows 48,200 instead of 48.2K.", Render: () => (
      <div style={{ width: 520 }}><FunnelChart steps={steps} valueFormat="number" height={240} /></div>
    ) },
    { name: "Alternate tone", description: "tone changes the single series color.", Render: () => (
      <div style={{ width: 520 }}><FunnelChart steps={steps} tone={1} height={240} /></div>
    ) },
    { name: "Loading", description: "Skeleton at the chart height. The chart is not mounted until data exists.", Render: () => (
<ChartCard title="Signup funnel"><Skeleton variant="rect" width="100%" height={260} /></ChartCard>
    ) },
    { name: "Empty", description: "No data in range. Say why and offer a way out. The chart is not mounted.", Render: () => (
<ChartCard title="Signup funnel"><EmptyState title="No data for this range" description="Pick a longer period or check that the source is connected." /></ChartCard>
    ) },
    { name: "Single point", description: "One step is a single full-height bar with no drop-off to show.", Render: () => (
      <div style={{ width: 360 }}><FunnelChart steps={steps.slice(0, 1)} height={200} /></div>
    ) },
  ],
  sections: [
    {
      type: 'text', id: 'choosing-a-chart', title: 'Choosing a chart',
      body: (<p style={{ margin: 0 }}>Use a funnel when each step is a subset of the one before it. See the full decision table on <a href="#/components/bar-chart">Bar chart</a>.</p>),
    },
    { type: 'custom', id: 'data-shape', title: 'Data shape', Render: Shape },
    {
      type: 'rules', id: 'formatting', title: 'Axes, labels and numbers',
      items: [
        { title: "Tabular numerals", body: "Axis labels (11px, medium, muted), tooltip values and legend values use tabular-nums, so digits stay in place when values change." },
        { title: "Compact counts, one decimal percent", body: "Counts use compact (48.2K) by default. Percentages show one decimal (26.2%)." },
        { title: "Percent is of step one", body: "Every percent is relative to the first step. The tooltip adds the step-to-step rate (\"From previous\")." },
        { title: "Labels under 14 characters", body: "Step labels are 11px and centered under each bar. Longer labels overlap neighbours on narrow cards." },
        { title: "Units belong in the format", body: "Use valueFormat=\"currency\", \"percent\" or a function such as (n) => `${n} ms`. Never concatenate units into category labels." },
      ],
    },
    {
      type: 'rules', id: 'color-and-palette', title: 'Color and palette',
      items: [
        { title: "Ten chart tokens", body: "--oniva-color-chart-1 to --oniva-color-chart-10 are fixed hues, independent of the accent. Pick by position or pass tone (1-based). Tone wraps after 10." },
        { title: "One tone, fading", body: "The funnel uses a single tone, fading from 100% to 50% opacity. Color never encodes the step; position and the value do." },
        { title: "Contrast on fade", body: "The last bar is at 50% opacity. Use a darker tone (5, 6 or 9) so it keeps 3:1 against white." },
        { title: "Color-blind safe", body: "Every mark is at least 3:1 on white. In the light palette, series 1 to 10 stay at least 3.3 delta E apart under protanopia, deuteranopia and tritanopia simulation. Do not rely on that alone: label series in the legend or tooltip." },
        { title: "Track and grid", body: "Empty tracks and gridlines use --oniva-color-chart-track. The hover band uses --oniva-color-chart-cursor." },
      ],
    },
    {
      type: 'rules', id: 'keyboard-exploration', title: 'Keyboard exploration',
      intro: "Tab to the chart, then use the arrow keys to step through each step. Each stop opens its tooltip.",
      items: [
        { title: 'One tab stop', body: 'The chart is a single focusable group (tabindex 0). Tab enters it once and the next Tab leaves it, so a page with six charts costs six tab stops, not hundreds.' },
        { title: 'Arrows move between steps', body: "Right and Down move to the next step, Left and Up to the previous one, in data order. Home and End jump to the first and last." },
        { title: 'Focus shows the tooltip', body: 'Moving focus opens the same tooltip as hover, anchored to the focused mark. Esc closes it without moving focus. The focused mark gets a 2px focus ring, 2px offset.' },
      ],
    },
    {
      type: 'rules', id: 'empty-loading-single', title: 'Empty, loading and single-point states',
      intro: "The chart does not draw its own placeholder. Decide before you mount it.",
      items: [
        { title: "Loading", body: "Render a Skeleton at the same height (260px here) so the card does not jump. Mount the chart when data arrives so the entrance animation plays once." },
        { title: "Empty", body: "Use EmptyState inside the ChartCard. Name the cause (No orders in this range) and give one action. Do not render an empty plot with axes." },
        { title: "One point", body: "A funnel needs at least two steps to show drop-off. With one it is a single bar at 100%." },
      ],
    },
    {
      type: 'rules', id: 'motion', title: 'Motion',
      items: [
        { title: "Entrance", body: "Bars grow horizontally over 450ms, each step delayed 80ms. Connectors fade in over 400ms." },
        { title: "Data updates", body: "Changing the data tweens existing values over 400ms (ease-out quart) instead of replacing the marks. If the number of rows changes, the chart snaps to the new data." },
        { title: "Reduced motion", body: "With prefers-reduced-motion the entrance animation is removed (animation-name none) and value tweens jump straight to the final value. Tooltip movement drops to 0.01ms." },
      ],
    },

  ],
  content: { rules: [
    { title: "Step labels are past-tense states", body: "Signed up, Activated, Paid, or short nouns like Visitors. Same grammar across steps." },
    { title: "Title names the journey", body: "Signup funnel, Checkout funnel." },
    { title: "One headline number", body: "Show the end-to-end rate in the card: 3.1% visitor to paid." },
  ] },
  accessibility: {
    keyboard: [
      { keys: ["Tab"], action: "Moves focus into the chart, then out to the next control. The chart is one tab stop." },
      { keys: ["→","↓"], action: "Moves focus to the next step. In right-to-left layouts → and ← swap." },
      { keys: ["←","↑"], action: "Moves focus to the previous step." },
      { keys: ["Home","End"], action: "Jumps to the first or last step." },
      { keys: ["Esc"], action: "Closes the tooltip. Focus stays where it is." },
    ],
    notes: ["The funnel is an svg with role=\"group\" and a label such as \"Funnel: Visitors 48.2K to Signups 12.6K\".","Each bar is a role=\"graphics-symbol\" stop with its count and percent of the first step.","A visually hidden table lists Step, Value and Of first step.","Value and percent text above bars are SVG text and are read with the table."],
    reducedMotion: "Entrance animation is removed and value tweens jump to the final value. Tooltip movement drops to 0.01ms.",
  },
  props: [
    { name: "steps", type: "FunnelStep[]", description: "Ordered steps: label, value." },
    { name: "tone", type: "number", default: "5", description: "1-based palette index." },
    { name: "valueFormat", type: "ValueFormat", default: "'compact'", description: "Format for step values." },
    { name: "height", type: "number", default: "260", description: "Plot height in px." },
    { name: "label", type: "string", description: "Accessible summary of the chart." },
    { name: "xstyle", type: "StyleXStyles", description: "StyleX overrides for the wrapper." },
  ],
  related: ["sankey-chart","bar-chart","stage-bars","chart-card","category-bar"],
};
export default page;
