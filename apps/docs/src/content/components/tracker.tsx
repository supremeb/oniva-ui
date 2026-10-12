import { ChartCard, EmptyState, Skeleton, Tracker } from 'oniva-ui';
import type { DocPage } from '../types';

const uptime = Array.from({ length: 30 }, (_, i) => ({
  label: 'Sep ' + (i + 1),
  status: i === 11 ? 'down' : i === 19 || i === 26 ? 'degraded' : 'up',
  detail: i === 11 ? '42 min outage' : i === 19 || i === 26 ? 'Elevated latency' : '100%',
})) as { label: string; status: 'up' | 'degraded' | 'down'; detail: string }[];

const Stage = () => (
  <div style={{ paddingTop: 28, width: 520 }}><Tracker items={uptime} /></div>
);

const Shape = () => (
  <div style={{ display: 'grid', gap: 12 }}>
    <pre tabIndex={0} style={{ margin: 0, padding: 12, borderRadius: 10, overflow: 'auto', fontSize: 12.5, lineHeight: '18px', background: 'var(--oniva-color-surface-inset)', color: 'var(--oniva-color-text)' }}>
      <code>{"interface TrackerItem {\n  label: string;                                  // tooltip title, e.g. 'Sep 12'\n  status?: 'up' | 'degraded' | 'down' | 'none';   // default 'up'\n  tone?: number;                                  // overrides the status color\n  detail?: ReactNode;                             // tooltip value\n}\n\n[\n  { label: 'Sep 11', status: 'up', detail: '100%' },\n  { label: 'Sep 12', status: 'down', detail: '42 min outage' },\n]\n// <Tracker items={items} />"}</code>
    </pre>
    <ul style={{ margin: 0, paddingInlineStart: 18, display: 'grid', gap: 4, fontSize: 14, lineHeight: '20px' }}>
      <li>{"Items are drawn left to right and share the width equally, with a 3px minimum."}</li>
      <li>{"status maps to color and to a word: Operational, Degraded, Outage, No data."}</li>
      <li>{"tone overrides the status color for habit-style trackers. Down without tone is the danger color."}</li>
      <li>{"The group label counts items with status up (the default)."}</li>
    </ul>
  </div>
);

const page: DocPage = {
  slug: "tracker",
  status: 'Stable',
  version: '0.1.0',
  importName: "Tracker",
  group: ['Components', 'Charts'],
  sourcePath: "charts/Tracker",
  lede: "A row of equal status cells. It handles uptime and habit history: one cell per day, colored by status, each with its own tooltip.",
  anatomy: {
    intro: "Four parts. The group and cells are always present. The tooltip appears on hover and focus.",
    Render: Stage,
    parts: [
      { name: "Group", description: "A div with role=\"group\" and a label such as \"Status tracker, 27 of 30 operational\". 36px tall row, 3px gap.", selector: "[role=\"group\"]" },
      { name: "Cell", description: "A button that stretches equally across the row. 4px radius, 3px minimum width. Dims to 70% on hover. 2px focus ring.", selector: "[role=\"group\"] button" },
      { name: "Status color", description: "Up uses chart 7 (green), degraded chart 8 (amber), down the danger color, none the neutral track color.", selector: "[role=\"group\"] button:nth-of-type(12)" },
      { name: "Tooltip", description: "ChartTooltip above the cell with the label, status and your detail text. Appears on hover and focus.", selector: "[role=\"tooltip\"]", fallback: { x: 30, y: 5 } },
    ],
  },
  usage: {
    use: ["Uptime and incident history, 30 to 90 cells.","Habit and streak tracking, one cell per day.","Any series of equal slots with a state each."],
    avoid: [
      { text: "Intensity across two dimensions.", instead: { slug: "heatmap", label: "Heatmap" } },
      { text: "Durations in each stage.", instead: { slug: "stage-bars", label: "StageBars" } },
      { text: "Numeric values over time.", instead: { slug: "sparkline", label: "Sparkline" } },
    ],
  },
  playground: {
    controls: [
      { kind: 'number', key: 'count', label: 'Cells', min: 7, max: 30, step: 1 },
      { kind: 'toggle', key: 'incident', label: 'Show an outage' },
      { kind: 'toggle', key: 'habit', label: 'Habit mode (tone 2, gaps as none)' },
    ],
    initial: { count: 30, incident: true, habit: false },
    render: (p) => (
      <div style={{ paddingTop: 28, width: 'min(520px, 100%)' }}><Tracker items={uptime.slice(0, Number(p.count)).map((u, i) => (p.habit ? { label: u.label, status: i % 4 === 3 ? 'none' : 'up', tone: i % 4 === 3 ? undefined : 2, detail: i % 4 === 3 ? 'Skipped' : 'Done' } : p.incident ? u : { ...u, status: 'up', detail: '100%' }))} /></div>
    ),
    code: (p) => {
      const attrs = p.habit ? "status: i % 4 === 3 ? 'none' : 'up', tone: 2" : "status: 'up'";
      return `<Tracker items={days.slice(0, ${p.count}).map((d, i) => ({ label: d.label, ${attrs} }))} />`;
    },
  },
  states: [
    { name: "Uptime", description: "Mostly up with one outage and two degraded days.", Render: () => (
      <div style={{ paddingTop: 28, width: 480 }}><Tracker items={uptime} /></div>
    ) },
    { name: "Habit", description: "Tone 2 for done, neutral cells for skipped days.", Render: () => (
      <div style={{ paddingTop: 28, width: 360 }}><Tracker items={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => ({ label: d, status: [0, 2, 5].includes(i) ? 'none' : 'up', tone: [0, 2, 5].includes(i) ? undefined : 2, detail: [0, 2, 5].includes(i) ? 'Skipped' : 'Done' }))} /></div>
    ) },
    { name: "All up", description: "A clean row is all green.", Render: () => (
      <div style={{ paddingTop: 28, width: 480 }}><Tracker items={uptime.map((u) => ({ ...u, status: 'up' as const, detail: '100%' }))} /></div>
    ) },
    { name: "No data", description: "status=\"none\" for periods before monitoring started.", Render: () => (
      <div style={{ paddingTop: 28, width: 480 }}><Tracker items={uptime.map((u, i) => (i < 8 ? { label: u.label, status: 'none' as const, detail: 'Not monitored' } : u))} /></div>
    ) },
    { name: "Loading", description: "Skeleton at the chart height. The chart is not mounted until data exists.", Render: () => (
<ChartCard title="API uptime"><Skeleton variant="rect" width="100%" height={36} /></ChartCard>
    ) },
    { name: "Empty", description: "No data in range. Say why and offer a way out. The chart is not mounted.", Render: () => (
<ChartCard title="API uptime"><EmptyState title="No data for this range" description="Pick a longer period or check that the source is connected." /></ChartCard>
    ) },
    { name: "Single point", description: "One cell stretches the full width. Use a Badge for a single status.", Render: () => (
      <div style={{ paddingTop: 28, width: 480 }}><Tracker items={uptime.slice(0, 1)} /></div>
    ) },
  ],
  sections: [
    {
      type: 'text', id: 'choosing-a-chart', title: 'Choosing a chart',
      body: (<p style={{ margin: 0 }}>Use a tracker for status over many equal time slots. See the full decision table on <a href="#/components/bar-chart">Bar chart</a>.</p>),
    },
    { type: 'custom', id: 'data-shape', title: 'Data shape', Render: Shape },
    {
      type: 'rules', id: 'formatting', title: 'Axes, labels and numbers',
      items: [
        { title: "Tabular numerals", body: "Axis labels (11px, medium, muted), tooltip values and legend values use tabular-nums, so digits stay in place when values change." },
        { title: "Cell labels are dates", body: "Sep 12, Mon. They title the tooltip and form the accessible name with the status." },
        { title: "Detail is the number", body: "Put the percentage or duration in detail: 99.2%, 42 min outage. The cell itself has no text." },
        { title: "Headline in the card", body: "Show the aggregate (99.94% uptime) in a ChartCard; the cells show the days." },
        { title: "Units belong in the format", body: "Use valueFormat=\"currency\", \"percent\" or a function such as (n) => `${n} ms`. Never concatenate units into category labels." },
      ],
    },
    {
      type: 'rules', id: 'color-and-palette', title: 'Color and palette',
      items: [
        { title: "Ten chart tokens", body: "--oniva-color-chart-1 to --oniva-color-chart-10 are fixed hues, independent of the accent. Pick by position or pass tone (1-based). Tone wraps after 10." },
        { title: "Status colors", body: "Up is chart 7 (green), degraded chart 8 (amber), down the danger color, none the neutral track. Green and red are distinct under protanopia in luminance but not hue, so rely on the tooltip and label too." },
        { title: "Color is not the only cue", body: "Each cell has an accessible name with the status word (\"Sep 12: Outage\"). Add a legend if the row has no text elsewhere." },
        { title: "Custom tones", body: "tone replaces the status color. Use one tone for done and leave undone as none." },
        { title: "Color-blind safe", body: "Every mark is at least 3:1 on white. In the light palette, series 1 to 10 stay at least 3.3 delta E apart under protanopia, deuteranopia and tritanopia simulation. Do not rely on that alone: label series in the legend or tooltip." },
        { title: "Track and grid", body: "Empty tracks and gridlines use --oniva-color-chart-track. The hover band uses --oniva-color-chart-cursor." },
      ],
    },
    {
      type: 'rules', id: 'keyboard-exploration', title: 'Keyboard exploration',
      intro: "Every cell is a button, so the row is a series of tab stops.",
      items: [
        { title: 'Each cell is a tab stop', body: 'Tab moves from cell to cell (30 cells means 30 stops). There is no roving tabindex or arrow-key navigation yet.' },
        { title: 'Focus shows the tooltip', body: 'Focusing a cell opens its tooltip and a 2px focus ring. Esc closes the tooltip.' },
        { title: 'Keep rows short', body: 'For keyboard users, 30 cells is the practical limit. For 90 days, group by week or use Heatmap, which is a single tab stop.' },
      ],
    },
    {
      type: 'rules', id: 'empty-loading-single', title: 'Empty, loading and single-point states',
      intro: "The chart does not draw its own placeholder. Decide before you mount it.",
      items: [
        { title: "Loading", body: "Render a Skeleton at the same height (36px here) so the card does not jump. Mount the chart when data arrives so the entrance animation plays once." },
        { title: "Empty", body: "Use EmptyState inside the ChartCard. Name the cause (No orders in this range) and give one action. Do not render an empty plot with axes." },
        { title: "One point", body: "One cell fills the row. A single status belongs in a Badge. Aim for 7 or more cells." },
      ],
    },
    {
      type: 'rules', id: 'motion', title: 'Motion',
      items: [
        { title: "Entrance", body: "None. Cells render at once. Only the 150ms opacity change on hover and the tooltip movement animate." },
        { title: "Data updates", body: "Tracker does not tween. New items render immediately." },
        { title: "Reduced motion", body: "With prefers-reduced-motion the entrance animation is removed (animation-name none) and value tweens jump straight to the final value. Tooltip movement drops to 0.01ms." },
      ],
    },

  ],
  content: { rules: [
    { title: "Label every cell", body: "Use the date or period: Sep 12, Week 37." },
    { title: "Status words", body: "Operational, Degraded, Outage, No data are built in; do not restate them in detail." },
    { title: "Detail is short", body: "Under 24 characters: 42 min outage." },
  ] },
  accessibility: {
    keyboard: [
      { keys: ["Tab"], action: "Moves focus to the next cell. Every cell is a tab stop." },
      { keys: ["Shift","Tab"], action: "Moves to the previous cell." },
      { keys: ["Esc"], action: "Closes the tooltip." },
    ],
    notes: ["The root is a div with role=\"group\" and aria-label \"Status tracker, 27 of 30 operational\".","Each cell is a native button with aria-label \"Sep 12: Outage\". It is not pressable; the button is a focus target.","The tooltip is not announced separately. The label already has the status; detail is only visual.","Hover and focus open the same tooltip. The tooltip is pointer-transparent."],
    reducedMotion: "The only animation is a 150ms opacity change on hover and the tooltip translate. Tooltip movement drops to 0.01ms.",
  },
  props: [
    { name: "items", type: "TrackerItem[]", description: "Cells: label, status, tone, detail." },
    { name: "aria-label", type: "string", description: "Overrides the generated group label." },
    { name: "xstyle", type: "StyleXStyles", description: "StyleX overrides for the wrapper." },
  ],
  related: ["heatmap","stage-bars","chart-card","badge","sparkline"],
};
export default page;
