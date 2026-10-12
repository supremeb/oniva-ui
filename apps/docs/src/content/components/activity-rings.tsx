import { ActivityRings, ChartCard, ChartLegend, EmptyState, Skeleton } from 'oniva-ui';
import type { DocPage } from '../types';

const rings = [
  { label: 'Move', value: 540, goal: 600, unit: 'kcal', tone: 3 },
  { label: 'Exercise', value: 24, goal: 30, unit: 'min', tone: 2 },
  { label: 'Stand', value: 9, goal: 12, unit: 'hr', tone: 4 },
];

const Stage = () => (
  <div style={{ alignItems: 'center', display: 'flex', gap: 24 }}>
    <ActivityRings rings={rings} size={140} thickness={14}>
      <span style={{ fontSize: 14, fontWeight: 600 }}>3 goals</span>
    </ActivityRings>
    <ChartLegend orientation="vertical" shape="round" items={rings.map((r) => ({ label: r.label, tone: r.tone, value: r.value + ' / ' + r.goal + ' ' + r.unit }))} />
  </div>
);

const Shape = () => (
  <div style={{ display: 'grid', gap: 12 }}>
    <pre tabIndex={0} style={{ margin: 0, padding: 12, borderRadius: 10, overflow: 'auto', fontSize: 12.5, lineHeight: '18px', background: 'var(--oniva-color-surface-inset)', color: 'var(--oniva-color-text)' }}>
      <code>{"interface ActivityRing {\n  label: string;\n  value: number;\n  goal: number;    // ring closes at this value\n  unit?: string;   // tooltip suffix, e.g. 'kcal'\n  tone?: number;   // defaults to 3, 2, 4, 5 by position\n}\n\n[\n  { label: 'Move', value: 540, goal: 600, unit: 'kcal' },\n  { label: 'Exercise', value: 24, goal: 30, unit: 'min' },\n]\n// <ActivityRings rings={rings} />"}</code>
    </pre>
    <ul style={{ margin: 0, paddingInlineStart: 18, display: 'grid', gap: 4, fontSize: 14, lineHeight: '20px' }}>
      <li>{"Prop is rings, outermost first. Put the primary goal first."}</li>
      <li>{"goal is required and must be above 0. Progress is value / goal, capped at 100%."}</li>
      <li>{"Use 1 to 4 rings. Each ring shrinks the next by thickness + gap."}</li>
      <li>{"Default tones are 3, 2, 4 and 5 (pink, lime, sky, magenta)."}</li>
    </ul>
  </div>
);

const page: DocPage = {
  slug: "activity-rings",
  status: 'Stable',
  version: '0.1.0',
  importName: "ActivityRings",
  group: ['Components', 'Charts'],
  sourcePath: "charts/ActivityRings",
  lede: "Concentric closed rings, each against its own goal. It handles daily goals: how far along each one is and whether it is done.",
  anatomy: {
    intro: "Four parts. Rings and tracks are always present. Center content and legend are optional.",
    Render: Stage,
    parts: [
      { name: "Progress arc", description: "Rounded arc (corner radius half the thickness) from 12 o'clock to value / goal, capped at one full turn. Minimum visible sweep is 0.12 rad.", selector: "svg[role=\"group\"] path:nth-of-type(2)" },
      { name: "Track", description: "Full ring in the track color at 55% opacity behind each arc.", selector: "svg[role=\"group\"] path:first-of-type" },
      { name: "Rings", description: "Outermost first. Gap between rings is 20% of the thickness, at least 2px. Default 120px size and 12px thickness.", selector: "svg[role=\"group\"]" },
      { name: "Center content", description: "Optional children placed in the middle of the rings.", selector: "div > div", fallback: { x: 50, y: 50 } },
      { name: "Legend", description: "Round-swatch ChartLegend with value and goal.", selector: "ul" },
    ],
  },
  usage: {
    use: ["2 to 4 daily or weekly goals with a target each.","Showing completion at a glance on a dashboard or watch face.","Progress where reaching 100% matters."],
    avoid: [
      { text: "Comparing items on one dial with different maximums.", instead: { slug: "radial-chart", label: "RadialChart" } },
      { text: "A single score on a range.", instead: { slug: "gauge", label: "Gauge" } },
      { text: "A single progress value in a form.", instead: { slug: "progress-bar", label: "ProgressBar" } },
    ],
  },
  playground: {
    controls: [
      { kind: 'number', key: 'size', label: 'Size (px)', min: 80, max: 220, step: 20 },
      { kind: 'number', key: 'thickness', label: 'Thickness (px)', min: 6, max: 20, step: 2 },
      { kind: 'number', key: 'rings', label: 'Rings', min: 1, max: 3, step: 1 },
      { kind: 'toggle', key: 'done', label: 'Move goal complete' },
    ],
    initial: { size: 140, thickness: 14, rings: 3, done: false },
    render: (p) => (
      <ActivityRings rings={rings.slice(0, Number(p.rings)).map((r, i) => (i === 0 && p.done ? { ...r, value: r.goal } : r))} size={Number(p.size)} thickness={Number(p.thickness)} />
    ),
    code: (p) => {
      const attrs = [p.size !== 120 && `size={${p.size}}`, p.thickness !== 12 && `thickness={${p.thickness}}`].filter(Boolean).join(' ');
      return `<ActivityRings rings={rings.slice(0, ${p.rings})}${attrs ? ' ' + attrs : ''} />`;
    },
  },
  states: [
    { name: "In progress", description: "Three rings between 70% and 90%.", Render: () => (
      <ActivityRings rings={rings} size={120} />
    ) },
    { name: "Goal complete", description: "At 100% the ring closes. Values above goal stay at one full turn.", Render: () => (
      <ActivityRings rings={rings.map((r) => ({ ...r, value: r.goal }))} size={120} />
    ) },
    { name: "Just started", description: "Tiny values still show a 0.12 rad cap so the ring is visible.", Render: () => (
      <ActivityRings rings={rings.map((r) => ({ ...r, value: Math.round(r.goal * 0.03) }))} size={120} />
    ) },
    { name: "Not started", description: "At 0 only the track shows.", Render: () => (
      <ActivityRings rings={rings.map((r) => ({ ...r, value: 0 }))} size={120} />
    ) },
    { name: "With center", description: "Children render in the middle.", Render: () => (
      <ActivityRings rings={rings} size={140} thickness={14}><span style={{ fontSize: 14, fontWeight: 600 }}>3 goals</span></ActivityRings>
    ) },
    { name: "Loading", description: "Skeleton at the chart height. The chart is not mounted until data exists.", Render: () => (
<ChartCard title="Daily goals"><Skeleton variant="rect" width="100%" height={140} /></ChartCard>
    ) },
    { name: "Empty", description: "No data in range. Say why and offer a way out. The chart is not mounted.", Render: () => (
<ChartCard title="Daily goals"><EmptyState title="No data for this range" description="Pick a longer period or check that the source is connected." /></ChartCard>
    ) },
    { name: "Single point", description: "One ring is a simple progress circle.", Render: () => (
      <ActivityRings rings={rings.slice(0, 1)} size={120} />
    ) },
  ],
  sections: [
    {
      type: 'text', id: 'choosing-a-chart', title: 'Choosing a chart',
      body: (<p style={{ margin: 0 }}>Use activity rings for goals that each have a target to close. See the full decision table on <a href="#/components/bar-chart">Bar chart</a>.</p>),
    },
    { type: 'custom', id: 'data-shape', title: 'Data shape', Render: Shape },
    {
      type: 'rules', id: 'formatting', title: 'Axes, labels and numbers',
      items: [
        { title: "Tabular numerals", body: "Axis labels (11px, medium, muted), tooltip values and legend values use tabular-nums, so digits stay in place when values change." },
        { title: "Value, goal and percent", body: "The tooltip shows Progress (value and unit), Goal and Complete as a rounded percent." },
        { title: "Units are a suffix", body: "unit appends to values in the tooltip and label: 540 kcal. Do not put units in labels." },
        { title: "Center is optional text", body: "Use children for a single number or short label. Keep it under 6 characters at 120px." },
        { title: "Units belong in the format", body: "Use valueFormat=\"currency\", \"percent\" or a function such as (n) => `${n} ms`. Never concatenate units into category labels." },
      ],
    },
    {
      type: 'rules', id: 'color-and-palette', title: 'Color and palette',
      items: [
        { title: "Ten chart tokens", body: "--oniva-color-chart-1 to --oniva-color-chart-10 are fixed hues, independent of the accent. Pick by position or pass tone (1-based). Tone wraps after 10." },
        { title: "Default tones", body: "Pink, lime and sky (3, 2 and 4). Override with tone if your product maps a goal to a color." },
        { title: "Close the ring", body: "A full ring is the success signal. Do not recolor on completion; the closed shape is the cue." },
        { title: "Label every ring", body: "Rings have no text. Always pair with a legend so color is not the only identifier." },
        { title: "Color-blind safe", body: "Every mark is at least 3:1 on white. In the light palette, series 1 to 10 stay at least 3.3 delta E apart under protanopia, deuteranopia and tritanopia simulation. Do not rely on that alone: label series in the legend or tooltip." },
        { title: "Track and grid", body: "Empty tracks and gridlines use --oniva-color-chart-track. The hover band uses --oniva-color-chart-cursor." },
      ],
    },
    {
      type: 'rules', id: 'keyboard-exploration', title: 'Keyboard exploration',
      intro: "Tab to the chart, then use the arrow keys to step through each ring. Each stop opens its tooltip.",
      items: [
        { title: 'One tab stop', body: 'The chart is a single focusable group (tabindex 0). Tab enters it once and the next Tab leaves it, so a page with six charts costs six tab stops, not hundreds.' },
        { title: 'Arrows move between rings', body: "Right and Down move to the next ring, Left and Up to the previous one, in data order. Home and End jump to the first and last." },
        { title: 'Focus shows the tooltip', body: 'Moving focus opens the same tooltip as hover, anchored to the focused mark. Esc closes it without moving focus. The focused mark gets a 2px focus ring, 2px offset.' },
      ],
    },
    {
      type: 'rules', id: 'empty-loading-single', title: 'Empty, loading and single-point states',
      intro: "The chart does not draw its own placeholder. Decide before you mount it.",
      items: [
        { title: "Loading", body: "Render a Skeleton at the same height (140px here) so the card does not jump. Mount the chart when data arrives so the entrance animation plays once." },
        { title: "Empty", body: "Use EmptyState inside the ChartCard. Name the cause (No orders in this range) and give one action. Do not render an empty plot with axes." },
        { title: "One point", body: "One ring works fine as a progress circle. Add the number in the center so the value is readable without hover." },
      ],
    },
    {
      type: 'rules', id: 'motion', title: 'Motion',
      items: [
        { title: "Entrance", body: "Rings fade in over 400ms, each delayed by 120ms from the outer ring inwards." },
        { title: "Data updates", body: "ActivityRings does not tween. A changed value redraws the arc at its new length immediately." },
        { title: "Reduced motion", body: "With prefers-reduced-motion the entrance animation is removed (animation-name none) and value tweens jump straight to the final value. Tooltip movement drops to 0.01ms." },
      ],
    },

  ],
  content: { rules: [
    { title: "Ring labels are verbs or nouns", body: "Move, Exercise, Stand. One word." },
    { title: "Goals with units", body: "600 kcal, 30 min, 12 hr." },
    { title: "Say when a ring is done", body: "Use a text status (\"Goal reached\") next to the rings, not only a closed shape." },
  ] },
  accessibility: {
    keyboard: [
      { keys: ["Tab"], action: "Moves focus into the chart, then out to the next control. The chart is one tab stop." },
      { keys: ["→","↓"], action: "Moves focus to the next ring. In right-to-left layouts → and ← swap." },
      { keys: ["←","↑"], action: "Moves focus to the previous ring." },
      { keys: ["Home","End"], action: "Jumps to the first or last ring." },
      { keys: ["Esc"], action: "Closes the tooltip. Focus stays where it is." },
    ],
    notes: ["The rings are an svg with role=\"group\" and a label such as \"Activity rings: Move 540 kcal of 600, Exercise 24 min of 30\".","Each ring with progress above 0 is a role=\"graphics-symbol\" stop reading \"Move: 540 of 600 kcal\".","A visually hidden table lists Ring, Value and Goal.","A ring at 0 draws only its track and is not a keyboard stop. Mention zero progress in the legend text."],
    reducedMotion: "Entrance animation is removed and value tweens jump to the final value. Tooltip movement drops to 0.01ms.",
  },
  props: [
    { name: "rings", type: "ActivityRing[]", description: "Rings from the outside: label, value, goal, unit, tone." },
    { name: "size", type: "number", default: "120", description: "Width and height in px." },
    { name: "thickness", type: "number", default: "12", description: "Ring thickness in px." },
    { name: "children", type: "ReactNode", description: "Center content." },
    { name: "label", type: "string", description: "Accessible summary of the chart." },
    { name: "xstyle", type: "StyleXStyles", description: "StyleX overrides for the wrapper." },
  ],
  related: ["radial-chart","gauge","ring-progress","chart-legend","donut-chart"],
};
export default page;
